import datetime
import uuid
import json
from typing import Dict, Any, Optional
from langgraph.graph import StateGraph, START, END
from app.graph.state import PlanGraphState
from app.schemas.trip import TripPlan, TripRequest
from app.agents.orchestrator import orchestrator_init_node, orchestrator_finalize_node
from app.agents.research_agent import research_agent_node
from app.agents.transportation_agent import transportation_agent_node
from app.agents.accommodation_agent import accommodation_agent_node
from app.agents.local_transport_agent import local_transport_agent_node
from app.agents.itinerary_agent import itinerary_agent_node
from app.agents.budget_agent import budget_agent_node
from app.services.groq_service import GroqLLMService
from app.database.models import TripRepository

def build_travel_graph() -> StateGraph:
    """Build LangGraph StateGraph with sequential and coordinated agent nodes."""
    workflow = StateGraph(PlanGraphState)
    
    # Add nodes
    workflow.add_node("orchestrator_init", orchestrator_init_node)
    workflow.add_node("research_agent", research_agent_node)
    workflow.add_node("transportation_agent", transportation_agent_node)
    workflow.add_node("accommodation_agent", accommodation_agent_node)
    workflow.add_node("local_transport_agent", local_transport_agent_node)
    workflow.add_node("itinerary_agent", itinerary_agent_node)
    workflow.add_node("budget_agent", budget_agent_node)
    workflow.add_node("orchestrator_finalize", orchestrator_finalize_node)
    
    # Connect sequential flow
    workflow.add_edge(START, "orchestrator_init")
    workflow.add_edge("orchestrator_init", "research_agent")
    workflow.add_edge("research_agent", "transportation_agent")
    workflow.add_edge("transportation_agent", "accommodation_agent")
    workflow.add_edge("accommodation_agent", "local_transport_agent")
    workflow.add_edge("local_transport_agent", "itinerary_agent")
    workflow.add_edge("itinerary_agent", "budget_agent")
    workflow.add_edge("budget_agent", "orchestrator_finalize")
    workflow.add_edge("orchestrator_finalize", END)
    
    return workflow.compile()

# Global compiled graph
travel_graph = build_travel_graph()

async def execute_plan_workflow(trip_request: TripRequest) -> Dict[str, Any]:
    """Execute the multi-agent travel planning graph."""
    initial_state: PlanGraphState = {
        "request": trip_request.model_dump(),
        "research_context": [],
        "weather_info": None,
        "transportation_options": [],
        "recommended_transport": None,
        "accommodation_options": [],
        "recommended_accommodation": None,
        "local_transportation": [],
        "itinerary": [],
        "budget_breakdown": None,
        "map_markers": [],
        "overview": "",
        "ai_explanation": "",
        "agent_logs": [],
        "is_demo_mode": False,
        "error": None
    }
    
    # Run the graph
    final_state = await travel_graph.ainvoke(initial_state)
    
    req = final_state["request"]
    trip_id = str(uuid.uuid4())
    
    plan_dict = {
        "id": trip_id,
        "destination": req["destination"],
        "origin": req["origin"],
        "start_date": req["start_date"],
        "end_date": req["end_date"],
        "duration_days": req["duration_days"],
        "travellers": req["travellers"],
        "total_budget": req["total_budget"],
        "travel_style": req.get("travel_style", "Standard"),
        "overview": final_state["overview"],
        "weather_forecast": final_state.get("weather_info"),
        "transportation_options": final_state["transportation_options"],
        "recommended_transport": final_state["recommended_transport"],
        "accommodation_options": final_state["accommodation_options"],
        "recommended_accommodation": final_state["recommended_accommodation"],
        "local_transportation": final_state["local_transportation"],
        "itinerary": final_state["itinerary"],
        "budget_breakdown": final_state["budget_breakdown"],
        "ai_explanation": final_state["ai_explanation"],
        "map_markers": final_state["map_markers"],
        "agent_execution_logs": final_state["agent_logs"],
        "is_demo_mode": final_state.get("is_demo_mode", False),
        "created_at": datetime.datetime.now().isoformat()
    }
    
    # Save to SQLite database
    TripRepository.save_trip(plan_dict)
    
    return plan_dict

async def execute_refine_workflow(trip_id: str, prompt: str, current_plan: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Conversational refinement: Updates relevant portions of the plan without full re-generation."""
    if not current_plan:
        current_plan = TripRepository.get_trip(trip_id)
        if not current_plan:
            raise ValueError(f"Trip with id {trip_id} not found.")

    # Record message in conversation history
    TripRepository.add_message(trip_id, "user", prompt)
    
    # Check if Groq LLM is available for intelligent conversational modification
    groq = GroqLLMService()
    p_lower = prompt.lower()
    
    # 1. Check for Transport swap requests
    explicit_mode_selected = None
    if "train" in p_lower or "bus" in p_lower or "flight" in p_lower or "cab" in p_lower:
        target_mode = "Train" if "train" in p_lower else ("Bus" if "bus" in p_lower else ("Flight" if "flight" in p_lower else "Cab"))
        matching = [t for t in current_plan.get("transportation_options", []) if t["mode"].lower() == target_mode.lower()]
        if matching:
            new_transport = matching[0]
            explicit_mode_selected = target_mode
            # Unset old recommended
            for t in current_plan["transportation_options"]:
                t["recommended"] = (t["id"] == new_transport["id"])
            new_transport["recommended"] = True
            new_transport["recommendation_reason"] = f"Swapped to {target_mode} as per your follow-up request."
            current_plan["recommended_transport"] = new_transport
            
            # Recalculate budget
            old_transport_cost = current_plan["budget_breakdown"]["intercity_transport"]
            diff = new_transport["total_price"] - old_transport_cost
            current_plan["budget_breakdown"]["intercity_transport"] = new_transport["total_price"]
            current_plan["budget_breakdown"]["total_estimated_cost"] = round(current_plan["budget_breakdown"]["total_estimated_cost"] + diff, 2)
            current_plan["budget_breakdown"]["remaining_balance"] = round(current_plan["total_budget"] - current_plan["budget_breakdown"]["total_estimated_cost"], 2)
            current_plan["budget_breakdown"]["is_within_budget"] = current_plan["budget_breakdown"]["remaining_balance"] >= 0
            current_plan["budget_breakdown"]["optimization_notes"].append(f"Updated transport to {target_mode} (Cost adjusted by ₹{int(diff):+d}).")

    # 2. Check for Hotel / Accommodation tier change requests
    if "hotel" in p_lower or "hostel" in p_lower or "resort" in p_lower or "stay" in p_lower or "cheaper stay" in p_lower:
        target_tier = "Budget" if ("hostel" in p_lower or "budget" in p_lower or "cheap" in p_lower) else ("Luxury" if "luxury" in p_lower or "resort" in p_lower else "Premium" if "premium" in p_lower else "Standard")
        matching = [h for h in current_plan.get("accommodation_options", []) if h["tier"].lower() == target_tier.lower()]
        if matching:
            new_hotel = matching[0]
            for h in current_plan["accommodation_options"]:
                h["recommended"] = (h["id"] == new_hotel["id"])
            new_hotel["recommended"] = True
            current_plan["recommended_accommodation"] = new_hotel
            
            # Recalculate stay budget
            old_stay_cost = current_plan["budget_breakdown"]["accommodation"]
            diff = new_hotel["total_cost"] - old_stay_cost
            current_plan["budget_breakdown"]["accommodation"] = new_hotel["total_cost"]
            current_plan["budget_breakdown"]["total_estimated_cost"] = round(current_plan["budget_breakdown"]["total_estimated_cost"] + diff, 2)
            current_plan["budget_breakdown"]["remaining_balance"] = round(current_plan["total_budget"] - current_plan["budget_breakdown"]["total_estimated_cost"], 2)
            current_plan["budget_breakdown"]["is_within_budget"] = current_plan["budget_breakdown"]["remaining_balance"] >= 0
            current_plan["budget_breakdown"]["optimization_notes"].append(f"Swapped stay to {new_hotel['name']} ({target_tier}) (Cost adjusted by ₹{int(diff):+d}).")

    # 3. Check for Budget restriction requests (e.g. "under 20000", "reduce budget to 15000", "cheaper")
    if "cheaper" in p_lower or "reduce" in p_lower or "under" in p_lower:
        import re
        nums = re.findall(r"\b\d{4,6}\b", prompt.replace(",", ""))
        if nums:
            new_budget = float(nums[0])
            current_plan["total_budget"] = new_budget
            current_plan["budget_breakdown"]["total_budget"] = new_budget
            
        # Only swap transport if user didn't explicitly request a specific mode
        if not explicit_mode_selected:
            cheaper_trans = [t for t in current_plan.get("transportation_options", []) if t["mode"] in ["Train", "Bus"]]
            if cheaper_trans:
                best_cheap_t = sorted(cheaper_trans, key=lambda x: x["total_price"])[0]
                for t in current_plan["transportation_options"]:
                    t["recommended"] = (t["id"] == best_cheap_t["id"])
                current_plan["recommended_transport"] = best_cheap_t
                current_plan["budget_breakdown"]["intercity_transport"] = best_cheap_t["total_price"]
            
        budget_stays = [h for h in current_plan.get("accommodation_options", []) if h["tier"] == "Budget"]
        if budget_stays:
            best_cheap_h = budget_stays[0]
            for h in current_plan["accommodation_options"]:
                h["recommended"] = (h["id"] == best_cheap_h["id"])
            current_plan["recommended_accommodation"] = best_cheap_h
            current_plan["budget_breakdown"]["accommodation"] = best_cheap_h["total_cost"]
            
        # Recompute totals
        b = current_plan["budget_breakdown"]
        new_total = (
            b["intercity_transport"] + 
            b["accommodation"] + 
            b["food"] + 
            b["local_transport"] + 
            b["activities_sightseeing"] + 
            b["emergency_buffer"]
        )
        b["total_estimated_cost"] = round(new_total, 2)
        b["remaining_balance"] = round(current_plan["total_budget"] - new_total, 2)
        b["is_within_budget"] = b["remaining_balance"] >= 0
        b["optimization_notes"].append(f"Optimized entire plan for maximum savings: New total ₹{int(new_total):,}.")

    # Add refinement log
    timestamp = datetime.datetime.now().strftime("%H:%M:%S")
    current_plan["agent_execution_logs"].append({
        "agent": "Refinement Agent",
        "action": f"Processed user adjustment: '{prompt[:45]}...'",
        "status": "completed",
        "timestamp": timestamp,
        "details": "Selectively updated components while maintaining plan coherence and budget calculations."
    })
    
    current_plan["ai_explanation"] += f"\n\nUpdated following your feedback: {prompt}"
    
    # Save updated plan and record assistant response
    TripRepository.save_trip(current_plan)
    TripRepository.add_message(trip_id, "assistant", f"I've updated your trip plan to incorporate: {prompt}")
    
    return current_plan
