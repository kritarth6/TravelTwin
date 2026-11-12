import datetime
import uuid
from typing import Dict, Any, List
from app.utils.mock_data import get_city_info

def itinerary_agent_node(state: Dict[str, Any]) -> Dict[str, Any]:
    """Itinerary Agent: Generates balanced, geographically grouped day-by-day itineraries."""
    request = state["request"]
    dest = request["destination"]
    start_date_str = request["start_date"]
    duration_days = int(request.get("duration_days", 3))
    interests = request.get("interests", ["Sightseeing", "Food", "Culture"])
    travellers = int(request.get("travellers", 1))
    
    city_data = get_city_info(dest)
    attractions = city_data.get("attractions", [])
    cuisines = city_data.get("cuisines", [])
    
    try:
        start_date = datetime.datetime.strptime(start_date_str, "%Y-%m-%d").date()
    except Exception:
        start_date = datetime.date.today() + datetime.timedelta(days=7)
        
    itinerary_days = []
    map_markers = []
    
    # Add hotel marker if accommodation was selected
    rec_hotel = state.get("recommended_accommodation")
    if rec_hotel and rec_hotel.get("lat") and rec_hotel.get("lng"):
        map_markers.append({
            "id": f"hotel-{rec_hotel['id']}",
            "name": rec_hotel["name"],
            "category": "hotel",
            "lat": rec_hotel["lat"],
            "lng": rec_hotel["lng"],
            "description": f"{rec_hotel['tier']} stay - {rec_hotel['category']} ({rec_hotel['location']})",
            "day": None
        })

    for day_idx in range(1, duration_days + 1):
        curr_date = start_date + datetime.timedelta(days=day_idx - 1)
        curr_date_str = curr_date.strftime("%Y-%m-%d")
        
        # Pick attractions for the day cycling through available attractions
        attr1 = attractions[(day_idx * 2 - 2) % len(attractions)]
        attr2 = attractions[(day_idx * 2 - 1) % len(attractions)]
        
        # Morning activity
        morning = {
            "time": "09:00 AM - 12:30 PM",
            "activity": f"Visit {attr1['name']}",
            "location": attr1['name'],
            "estimated_duration": "3.5 hours",
            "cost": float(attr1.get("fee", 50) * travellers),
            "tips": f"Hours: {attr1.get('hours')}. Arrive early to avoid mid-day queues.",
            "lat": attr1.get("lat"),
            "lng": attr1.get("lng")
        }
        
        # Afternoon activity
        afternoon = {
            "time": "02:00 PM - 05:00 PM",
            "activity": f"Explore {attr2['name']}",
            "location": attr2['name'],
            "estimated_duration": "3 hours",
            "cost": float(attr2.get("fee", 0) * travellers),
            "tips": f"Hours: {attr2.get('hours')}. {attr2.get('desc')}",
            "lat": attr2.get("lat"),
            "lng": attr2.get("lng")
        }
        
        # Evening activity
        evening = {
            "time": "06:30 PM - 09:30 PM",
            "activity": f"Sunset Leisure & Local Market Walk in {city_data['name']}",
            "location": "Central Promenade / Night Bazaar",
            "estimated_duration": "3 hours",
            "cost": float(150 * travellers),
            "tips": "Great time for street photography, sampling regional snacks, and souvenir shopping.",
            "lat": round(attr2.get("lat", 20.59) + 0.005, 4),
            "lng": round(attr2.get("lng", 78.96) - 0.004, 4)
        }
        
        # Add map markers for attractions
        map_markers.append({
            "id": f"day{day_idx}-attr1",
            "name": attr1["name"],
            "category": "attraction",
            "lat": attr1["lat"],
            "lng": attr1["lng"],
            "description": attr1["desc"],
            "day": day_idx
        })
        map_markers.append({
            "id": f"day{day_idx}-attr2",
            "name": attr2["name"],
            "category": "attraction",
            "lat": attr2["lat"],
            "lng": attr2["lng"],
            "description": attr2["desc"],
            "day": day_idx
        })
        
        # Food recommendations for this day
        day_foods = []
        for meal_item in cuisines:
            day_foods.append({
                "meal": meal_item["meal"],
                "spot_name": meal_item["spot"],
                "specialty": meal_item["dish"],
                "approx_cost_per_person": float(meal_item["cost"])
            })
            
        estimated_day_cost = (
            morning["cost"] + 
            afternoon["cost"] + 
            evening["cost"] + 
            sum(f["approx_cost_per_person"] * travellers for f in day_foods) +
            (350 * travellers) # estimated local transit
        )
        
        itinerary_days.append({
            "day_number": day_idx,
            "date": curr_date_str,
            "title": f"Day {day_idx}: Highlights of {city_data['name']}",
            "theme": f"Exploring {attr1['name']} & {attr2['name']}",
            "morning": morning,
            "afternoon": afternoon,
            "evening": evening,
            "food_recommendations": day_foods,
            "local_transport_advice": f"Best explored using {'scooter rentals or local cabs' if 'Goa' in dest else 'auto-rickshaws and metro'} along the central sightseeing corridor.",
            "estimated_daily_expense": round(estimated_day_cost, 2)
        })
        
    timestamp = datetime.datetime.now().strftime("%H:%M:%S")
    log = {
        "agent": "Itinerary Agent",
        "action": f"Generated {duration_days}-day paced schedule for {city_data['name']}",
        "status": "completed",
        "timestamp": timestamp,
        "details": f"Planned {len(itinerary_days)} day(s) with morning, afternoon, evening activities and {len(cuisines)} authentic food spots."
    }
    
    return {
        "itinerary": itinerary_days,
        "map_markers": map_markers,
        "agent_logs": state.get("agent_logs", []) + [log]
    }

