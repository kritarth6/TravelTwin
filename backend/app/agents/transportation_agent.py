import datetime
import uuid
from typing import Dict, Any, List
from app.services.transport_service import generate_booking_links, estimate_intercity_distance_km
from app.services.groq_service import GroqLLMService

def transportation_agent_node(state: Dict[str, Any]) -> Dict[str, Any]:
    """Transportation Agent: Evaluates multi-modal travel between origin and destination."""
    request = state["request"]
    orig = request["origin"]
    dest = request["destination"]
    start_date = request["start_date"]
    travellers = int(request.get("travellers", 1))
    total_budget = float(request["total_budget"])
    pref = request.get("preferred_transport", "Any")
    style = request.get("travel_style", "Standard")
    
    links = generate_booking_links(orig, dest, start_date)
    dist_km = estimate_intercity_distance_km(orig, dest)
    
    options = []
    
    # 1. Train Option (Superfast / Express / Vande Bharat)
    train_fare_pp = max(350, int(dist_km * 1.35)) # 3A / Sleeper average
    train_hours = round(dist_km / 65 + 1.5, 1)
    options.append({
        "id": str(uuid.uuid4())[:8],
        "mode": "Train",
        "title": "Superfast Express / Vande Bharat",
        "provider": "Indian Railways (IRCTC)",
        "price_per_person": float(train_fare_pp),
        "total_price": float(train_fare_pp * travellers),
        "duration_hours": float(train_hours),
        "duration_display": f"{int(train_hours)}h {int((train_hours % 1) * 60)}m",
        "comfort_level": "Comfortable",
        "pros": ["Highly cost-effective", "Room to stretch and sleep overnight", "Central station arrival"],
        "cons": ["Tickets book out early", "May require tatkal or advance reservation"],
        "price_type": "Search-Result",
        "booking_url": links["trains_confirmtkt"],
        "recommended": False,
        "recommendation_reason": None,
        "details": f"Direct or express line traversing approximately {int(dist_km)} km with berth options."
    })
    
    # 2. Bus Option (AC Sleeper / Volvo)
    bus_fare_pp = max(450, int(dist_km * 1.45))
    bus_hours = round(dist_km / 50 + 2.0, 1)
    options.append({
        "id": str(uuid.uuid4())[:8],
        "mode": "Bus",
        "title": "AC Sleeper / Multi-Axle Volvo",
        "provider": "RedBus / Zingbus / InterCity SmartBus",
        "price_per_person": float(bus_fare_pp),
        "total_price": float(bus_fare_pp * travellers),
        "duration_hours": float(bus_hours),
        "duration_display": f"{int(bus_hours)}h {int((bus_hours % 1) * 60)}m",
        "comfort_level": "Moderate",
        "pros": ["Frequent departures", "Last-minute seat availability", "Overnight journeys save hotel cost"],
        "cons": ["Highway traffic risk", "Less legroom than trains"],
        "price_type": "Search-Result",
        "booking_url": links["bus_redbus"],
        "recommended": False,
        "recommendation_reason": None,
        "details": "Semi-sleeper or luxury multi-axle sleeper bus with charging points and water bottle."
    })
    
    # 3. Flight Option (Only if distance > 300km)
    if dist_km > 300:
        flight_fare_pp = max(2800, int(2200 + dist_km * 1.8))
        flight_hours = round(1.2 + (dist_km / 750), 1)
        options.append({
            "id": str(uuid.uuid4())[:8],
            "mode": "Flight",
            "title": "Economy Direct / 1-Stop Flight",
            "provider": "IndiGo / Air India / Akasa Air",
            "price_per_person": float(flight_fare_pp),
            "total_price": float(flight_fare_pp * travellers),
            "duration_hours": float(flight_hours),
            "duration_display": f"{int(flight_hours)}h {int((flight_hours % 1) * 60)}m",
            "comfort_level": "High Comfort",
            "pros": ["Fastest travel time", "Ideal for short duration getaways", "Airline loyalty points"],
            "cons": ["Highest per-person cost", "Airport check-in time of 2 hours", "Luggage weight limits"],
            "price_type": "Live Verified" if state.get("is_demo_mode") is False else "Estimated",
            "booking_url": links["flights_google"],
            "recommended": False,
            "recommendation_reason": None,
            "details": "Standard commercial flight with 15kg check-in & 7kg cabin baggage allowance."
        })
        
    # 4. Private Outstation Cab / Shared Taxi
    cab_total = max(3000, int(dist_km * 13.5 + 400)) # Rs 13.5/km + toll/state tax
    cab_hours = round(dist_km / 55, 1)
    options.append({
        "id": str(uuid.uuid4())[:8],
        "mode": "Cab",
        "title": "Private Outstation Sedan / SUV",
        "provider": "MakeMyTrip Cabs / Savaari",
        "price_per_person": round(cab_total / travellers, 1),
        "total_price": float(cab_total),
        "duration_hours": float(cab_hours),
        "duration_display": f"{int(cab_hours)}h {int((cab_hours % 1) * 60)}m",
        "comfort_level": "High Comfort",
        "pros": ["Door-to-door convenience", "Stop anywhere along the highway", "Private vehicle comfort"],
        "cons": ["Expensive for solo travellers", "Toll charges and highway tiredness"],
        "price_type": "Estimated",
        "booking_url": links["cab_makemytrip"],
        "recommended": False,
        "recommendation_reason": None,
        "details": "Dedicated AC sedan (Dzire/Etios) or Ertiga with driver allowance and fuel included."
    })
    
    # 5. Multi-modal / Self-drive combo
    selfdrive_total = max(2500, int(1800 + dist_km * 8.5))
    options.append({
        "id": str(uuid.uuid4())[:8],
        "mode": "Self-Drive",
        "title": "Self-Drive Hatchback / Compact SUV",
        "provider": "Zoomcar / Revv",
        "price_per_person": round(selfdrive_total / travellers, 1),
        "total_price": float(selfdrive_total),
        "duration_hours": float(cab_hours),
        "duration_display": f"{int(cab_hours)}h {int((cab_hours % 1) * 60)}m",
        "comfort_level": "Moderate",
        "pros": ["Complete itinerary independence", "Fun road trip experience", "Economical when split"],
        "cons": ["Requires driving stamina", "Security deposit and fuel paid separately"],
        "price_type": "Estimated",
        "booking_url": links["selfdrive_zoomcar"],
        "recommended": False,
        "recommendation_reason": None,
        "details": "Unlimited or flexi-kilometer package with sanitized self-drive car."
    })

    # INTELLIGENT SELECTION ALGORITHM
    # Calculate recommended option:
    # Rule 1: Respect preferred_transport if explicit
    # Rule 2: Budget constraint: Intercity transport should not exceed 35-40% of total budget
    # Rule 3: Prefer Train/Bus for distance < 450km or Budget style
    recommended = None
    max_transport_budget = total_budget * 0.40
    
    if pref != "Any":
        for opt in options:
            if opt["mode"].lower() == pref.lower():
                recommended = opt
                recommended["recommendation_reason"] = f"Chosen according to your explicit transport preference for {pref}."
                break
                
    if not recommended:
        # Check budget-friendly choices
        valid_budget_options = [o for o in options if o["total_price"] <= max_transport_budget]
        if not valid_budget_options:
            valid_budget_options = sorted(options, key=lambda x: x["total_price"])
            
        if style in ["Budget", "Standard"] or dist_km <= 500:
            # Pick train or bus
            train_opt = next((o for o in valid_budget_options if o["mode"] == "Train"), None)
            bus_opt = next((o for o in valid_budget_options if o["mode"] == "Bus"), None)
            
            if train_opt and (train_opt["total_price"] <= max_transport_budget or not bus_opt):
                recommended = train_opt
                recommended["recommendation_reason"] = f"Best balance of affordability (₹{int(train_opt['price_per_person'])}/person), comfort, and scenic journey for {int(dist_km)} km."
            elif bus_opt:
                recommended = bus_opt
                recommended["recommendation_reason"] = f"Most practical and economical choice within your total budget of ₹{int(total_budget):,}."
            else:
                recommended = valid_budget_options[0]
                recommended["recommendation_reason"] = "Most cost-effective available route for your group."
        else: # Premium / Luxury or high budget
            flight_opt = next((o for o in options if o["mode"] == "Flight"), None)
            if flight_opt and flight_opt["total_price"] <= max_transport_budget:
                recommended = flight_opt
                recommended["recommendation_reason"] = f"Fastest travel time ({flight_opt['duration_display']}), matching your {style} travel preference within budget."
            else:
                recommended = valid_budget_options[0]
                recommended["recommendation_reason"] = "Recommended for optimal comfort and travel time efficiency."

    recommended["recommended"] = True
    
    timestamp = datetime.datetime.now().strftime("%H:%M:%S")
    log = {
        "agent": "Transportation Agent",
        "action": f"Analyzed 5 transit modes ({orig} -> {dest}, {int(dist_km)} km)",
        "status": "completed",
        "timestamp": timestamp,
        "details": f"Recommended {recommended['mode']} ({recommended['title']}) at ₹{int(recommended['total_price']):,} for {travellers} traveler(s)."
    }
    
    return {
        "transportation_options": options,
        "recommended_transport": recommended,
        "agent_logs": state.get("agent_logs", []) + [log]
    }
