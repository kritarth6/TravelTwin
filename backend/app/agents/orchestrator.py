import datetime
import uuid
from typing import Dict, Any, List
from app.services.groq_service import GroqLLMService

def orchestrator_init_node(state: Dict[str, Any]) -> Dict[str, Any]:
    """Orchestrator: Validates inputs, normalizes dates, and initiates multi-agent workflow."""
    request = state["request"]
    
    # Calculate dates & duration
    start_date_str = request.get("start_date")
    end_date_str = request.get("end_date")
    duration = request.get("duration_days")
    
    try:
        s_date = datetime.datetime.strptime(start_date_str, "%Y-%m-%d").date()
    except Exception:
        s_date = datetime.date.today() + datetime.timedelta(days=14)
        start_date_str = s_date.strftime("%Y-%m-%d")
        
    if end_date_str:
        try:
            e_date = datetime.datetime.strptime(end_date_str, "%Y-%m-%d").date()
            calculated_duration = max(1, (e_date - s_date).days + 1)
        except Exception:
            calculated_duration = duration if duration else 3
            e_date = s_date + datetime.timedelta(days=calculated_duration - 1)
            end_date_str = e_date.strftime("%Y-%m-%d")
    else:
        calculated_duration = duration if duration else 3
        e_date = s_date + datetime.timedelta(days=calculated_duration - 1)
        end_date_str = e_date.strftime("%Y-%m-%d")
        
    # Update normalized values in request
    request["start_date"] = start_date_str
    request["end_date"] = end_date_str
    request["duration_days"] = calculated_duration
    
    timestamp = datetime.datetime.now().strftime("%H:%M:%S")
    log = {
        "agent": "Travel Orchestrator Agent",
        "action": f"Validated trip specs for {request['travellers']} traveller(s) to {request['destination']}",
        "status": "completed",
        "timestamp": timestamp,
        "details": f"Trip duration set to {calculated_duration} day(s) ({start_date_str} to {end_date_str}) with budget ceiling ₹{int(request['total_budget']):,}."
    }
    
    return {
        "request": request,
        "agent_logs": [log]
    }

def orchestrator_finalize_node(state: Dict[str, Any]) -> Dict[str, Any]:
    """Orchestrator: Synthesizes final AI explanation, overview, and formats completed TripPlan."""
    request = state["request"]
    dest = request["destination"]
    orig = request["origin"]
    travellers = request["travellers"]
    budget = request["total_budget"]
    rec_transport = state.get("recommended_transport") or {}
    rec_hotel = state.get("recommended_accommodation") or {}
    breakdown = state.get("budget_breakdown") or {}
    weather = state.get("weather_info") or {}
    
    # Try Groq for AI explanation if available
    groq_service = GroqLLMService()
    ai_explanation = None
    overview = None
    
    if groq_service.is_available():
        prompt = (
            f"Generate a concise 2-sentence trip overview and a 3-bullet AI explanation of why TravelTwin selected "
            f"transport '{rec_transport.get('title')}' and hotel '{rec_hotel.get('name')}' for a trip from {orig} to {dest} "
            f"with {travellers} people and budget ₹{budget:,}."
        )
        res = groq_service.generate_json(
            "You are TravelTwin AI travel architect. Return JSON with 'overview' (string) and 'explanation' (string).",
            prompt
        )
        if res:
            overview = res.get("overview")
            ai_explanation = res.get("explanation")
            
    if not overview:
        overview = (
            f"A personalized {request['duration_days']}-day {request.get('travel_style', 'Standard').lower()} travel itinerary "
            f"from {orig} to {dest} curated for {travellers} traveler(s). "
            f"Current weather conditions are expected to be {weather.get('condition', 'pleasant')} ({weather.get('current_temp', 26)}°C)."
        )
        
    if not ai_explanation:
        ai_explanation = (
            f"TravelTwin prioritized high convenience and affordability: "
            f"1) Selected {rec_transport.get('title')} ({rec_transport.get('provider')}) because it provides the best comfort-to-cost ratio without draining your budget. "
            f"2) Selected {rec_hotel.get('name')} based on its stellar {rec_hotel.get('rating')}★ rating and strategic location near key attractions. "
            f"3) Allocated an emergency buffer of ₹{int(breakdown.get('emergency_buffer', 1000)):,} to safeguard your journey against unexpected expenses."
        )
        
    timestamp = datetime.datetime.now().strftime("%H:%M:%S")
    log = {
        "agent": "Travel Orchestrator Agent",
        "action": "Compiled and verified full end-to-end travel plan",
        "status": "completed",
        "timestamp": timestamp,
        "details": f"All agents synchronized. Budget status: {'Within budget' if breakdown.get('is_within_budget') else 'Budget warning'}."
    }
    
    return {
        "overview": overview,
        "ai_explanation": ai_explanation,
        "agent_logs": state.get("agent_logs", []) + [log]
    }
