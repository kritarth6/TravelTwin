import datetime
from typing import Dict, Any, List

def budget_agent_node(state: Dict[str, Any]) -> Dict[str, Any]:
    """Budget Optimization Agent: Balances intercity, stay, dining, local mobility, and emergency buffer."""
    request = state["request"]
    total_budget = float(request["total_budget"])
    travellers = int(request.get("travellers", 1))
    duration_days = int(request.get("duration_days", 3))
    
    rec_transport = state.get("recommended_transport")
    rec_hotel = state.get("recommended_accommodation")
    itinerary = state.get("itinerary", [])
    transport_options = state.get("transportation_options", [])
    hotel_options = state.get("accommodation_options", [])
    
    optimization_notes = []
    
    # 1. Calculate preliminary costs
    transport_cost = rec_transport["total_price"] if rec_transport else 2000.0
    accommodation_cost = rec_hotel["total_cost"] if rec_hotel else 3000.0
    
    # Calculate food & local activities from itinerary
    food_cost = 0.0
    activities_cost = 0.0
    local_transport_cost = 0.0
    
    for day in itinerary:
        # Food
        for f in day.get("food_recommendations", []):
            food_cost += f.get("approx_cost_per_person", 200) * travellers
            
        # Activities
        activities_cost += day.get("morning", {}).get("cost", 50)
        activities_cost += day.get("afternoon", {}).get("cost", 50)
        activities_cost += day.get("evening", {}).get("cost", 50)
        
        # Local transport estimate per day
        local_transport_cost += 350.0 * travellers
        
    subtotal = transport_cost + accommodation_cost + food_cost + activities_cost + local_transport_cost
    buffer_cost = max(500.0, round(subtotal * 0.07, 2)) # 7% emergency contingency
    total_estimated = subtotal + buffer_cost
    
    # 2. BUDGET OPTIMIZATION LOOP
    # If total_estimated exceeds total_budget, explore cheaper options automatically!
    if total_estimated > total_budget:
        optimization_notes.append(
            f"Initial projected total (₹{int(total_estimated):,}) exceeded user budget (₹{int(total_budget):,}). Triggering auto-optimization."
        )
        
        # Optimization Step A: Downgrade transport if currently flight or cab
        if rec_transport and rec_transport["mode"] in ["Flight", "Cab"]:
            cheaper_transports = [
                t for t in transport_options 
                if t["mode"] in ["Train", "Bus"] and t["total_price"] < rec_transport["total_price"]
            ]
            if cheaper_transports:
                cheaper_transport = sorted(cheaper_transports, key=lambda x: x["total_price"])[0]
                saved_amt = rec_transport["total_price"] - cheaper_transport["total_price"]
                rec_transport["recommended"] = False
                cheaper_transport["recommended"] = True
                cheaper_transport["recommendation_reason"] = f"Auto-swapped from {rec_transport['mode']} to save ₹{int(saved_amt):,} and stay within your budget."
                rec_transport = cheaper_transport
                transport_cost = rec_transport["total_price"]
                optimization_notes.append(f"Replaced high-cost transport with {cheaper_transport['title']} (Saved ₹{int(saved_amt):,}).")
                
        # Optimization Step B: Downgrade stay to Budget/Hostel if still exceeding
        subtotal = transport_cost + accommodation_cost + food_cost + activities_cost + local_transport_cost
        if subtotal + buffer_cost > total_budget and rec_hotel and rec_hotel["tier"] != "Budget":
            budget_hotels = [h for h in hotel_options if h["tier"] == "Budget"]
            if budget_hotels:
                new_hotel = budget_hotels[0]
                saved_stay = rec_hotel["total_cost"] - new_hotel["total_cost"]
                rec_hotel["recommended"] = False
                new_hotel["recommended"] = True
                rec_hotel = new_hotel
                accommodation_cost = rec_hotel["total_cost"]
                optimization_notes.append(f"Swapped stay to {new_hotel['name']} (Saved ₹{int(saved_stay):,}).")
                
        # Re-tally after optimization
        subtotal = transport_cost + accommodation_cost + food_cost + activities_cost + local_transport_cost
        buffer_cost = max(300.0, round(subtotal * 0.05, 2))
        total_estimated = subtotal + buffer_cost

    remaining_balance = round(total_budget - total_estimated, 2)
    is_within_budget = remaining_balance >= 0
    
    if is_within_budget and not optimization_notes:
        optimization_notes.append(f"Plan is comfortably within your budget with ₹{int(remaining_balance):,} remaining contingency surplus.")
    elif not is_within_budget:
        optimization_notes.append(f"Plan is currently ₹{int(abs(remaining_balance)):,} above budget despite optimizations. Consider increasing budget or shortening trip duration.")

    breakdown = {
        "total_budget": round(total_budget, 2),
        "intercity_transport": round(transport_cost, 2),
        "accommodation": round(accommodation_cost, 2),
        "food": round(food_cost, 2),
        "local_transport": round(local_transport_cost, 2),
        "activities_sightseeing": round(activities_cost, 2),
        "emergency_buffer": round(buffer_cost, 2),
        "total_estimated_cost": round(total_estimated, 2),
        "remaining_balance": remaining_balance,
        "is_within_budget": is_within_budget,
        "optimization_notes": optimization_notes
    }
    
    timestamp = datetime.datetime.now().strftime("%H:%M:%S")
    log = {
        "agent": "Budget Optimization Agent",
        "action": f"Allocated 6 budget pillars (Total est: ₹{int(total_estimated):,} of ₹{int(total_budget):,})",
        "status": "optimized" if optimization_notes else "completed",
        "timestamp": timestamp,
        "details": f"Allocated: Stay ₹{int(accommodation_cost):,}, Transport ₹{int(transport_cost):,}, Food ₹{int(food_cost):,}, Local ₹{int(local_transport_cost):,}, Buffer ₹{int(buffer_cost):,}."
    }
    
    return {
        "budget_breakdown": breakdown,
        "recommended_transport": rec_transport,
        "recommended_accommodation": rec_hotel,
        "agent_logs": state.get("agent_logs", []) + [log]
    }

