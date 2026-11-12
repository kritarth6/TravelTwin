import datetime
import uuid
from typing import Dict, Any, List
from app.utils.mock_data import get_city_info
from app.services.transport_service import generate_booking_links

def accommodation_agent_node(state: Dict[str, Any]) -> Dict[str, Any]:
    """Accommodation Agent: Evaluates and prices stays across 4 tiers for the destination."""
    request = state["request"]
    dest = request["destination"]
    start_date = request["start_date"]
    travellers = int(request.get("travellers", 1))
    duration_days = int(request.get("duration_days", 3))
    nights = max(1, duration_days - 1)
    total_budget = float(request["total_budget"])
    style = request.get("travel_style", "Standard")
    rooms = max(1, (travellers + 1) // 2)
    
    city_data = get_city_info(dest)
    dest_name = city_data.get("name", dest.title())
    base_lat = city_data.get("lat", 20.59)
    base_lng = city_data.get("lng", 78.96)
    
    links = generate_booking_links(request["origin"], dest, start_date)
    
    # 4 distinct tier options
    tier_configs = [
        {
            "tier": "Budget",
            "category": "Backpacker Hostel & Pods",
            "name": f"Zostel / goSTOPS {dest_name}",
            "base_rate": 850,
            "rating": 4.5,
            "reviews": 1280,
            "location": f"Near Old Town & City Center, {dest_name}",
            "distance": "0.8 km from center",
            "amenities": ["High-speed WiFi", "Air Conditioning", "Common Room", "Luggage Storage", "Cafe"],
            "image": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
            "lat_offset": 0.008,
            "lng_offset": -0.006
        },
        {
            "tier": "Standard",
            "category": "Boutique 3-Star Hotel",
            "name": f"Treebo Trend / Bloom Hotel {dest_name}",
            "base_rate": 2400,
            "rating": 4.2,
            "reviews": 840,
            "location": f"Central Tourist Promenade, {dest_name}",
            "distance": "1.5 km from center",
            "amenities": ["Complimentary Breakfast", "Ensuite Bathroom", "Room Service", "Daily Housekeeping", "Free WiFi"],
            "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
            "lat_offset": -0.005,
            "lng_offset": 0.009
        },
        {
            "tier": "Premium",
            "category": "4-Star Deluxe Heritage Stay",
            "name": f"Radisson / Lemon Tree Premier {dest_name}",
            "base_rate": 5200,
            "rating": 4.6,
            "reviews": 1520,
            "location": f"Prime Valley / Beachside Boulevard, {dest_name}",
            "distance": "2.8 km from center",
            "amenities": ["Swimming Pool", "Spa & Wellness", "Buffet Breakfast", "Fitness Center", "Airport Shuttle"],
            "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
            "lat_offset": 0.015,
            "lng_offset": 0.012
        },
        {
            "tier": "Luxury",
            "category": "5-Star Luxury Resort & Villas",
            "name": f"Taj / Oberoi Grand Resort {dest_name}",
            "base_rate": 12500,
            "rating": 4.9,
            "reviews": 2100,
            "location": f"Exclusive Scenic Estate, {dest_name}",
            "distance": "4.5 km from center (Private Grounds)",
            "amenities": ["Infinity Pool", "Fine Dining Restaurants", "Butler Service", "Private Balcony", "Luxury Spa"],
            "image": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
            "lat_offset": -0.020,
            "lng_offset": -0.015
        }
    ]
    
    options = []
    for cfg in tier_configs:
        nightly_rate = cfg["base_rate"] * (1 if cfg["tier"] == "Budget" else rooms)
        total_stay = nightly_rate * nights
        options.append({
            "id": str(uuid.uuid4())[:8],
            "name": cfg["name"],
            "tier": cfg["tier"],
            "category": cfg["category"],
            "price_per_night": float(nightly_rate),
            "total_cost": float(total_stay),
            "rating": cfg["rating"],
            "reviews_count": cfg["reviews"],
            "location": cfg["location"],
            "distance_from_center": cfg["distance"],
            "amenities": cfg["amenities"],
            "image_url": cfg["image"],
            "provider": "Booking.com / Verified Partner",
            "booking_url": links["hotels_booking"],
            "price_type": "Search-Result",
            "lat": round(base_lat + cfg["lat_offset"], 5),
            "lng": round(base_lng + cfg["lng_offset"], 5),
            "recommended": False
        })
        
    # Pick recommended accommodation matching budget and travel style
    # Target accommodation budget is typically 30-35% of total budget
    max_stay_budget = total_budget * 0.40
    recommended = None
    
    for opt in options:
        if opt["tier"] == style and opt["total_cost"] <= max_stay_budget:
            recommended = opt
            break
            
    if not recommended:
        # Pick the best stay that fits within the budget
        affordable = [o for o in options if o["total_cost"] <= max_stay_budget]
        if affordable:
            recommended = affordable[-1] # highest tier that fits
        else:
            recommended = options[0] # lowest (budget) option
            
    recommended["recommended"] = True
    
    timestamp = datetime.datetime.now().strftime("%H:%M:%S")
    log = {
        "agent": "Accommodation Agent",
        "action": f"Benchmarked 4 hospitality tiers for {nights} night(s) in {dest_name}",
        "status": "completed",
        "timestamp": timestamp,
        "details": f"Recommended {recommended['tier']} stay ({recommended['name']}) at ₹{int(recommended['total_cost']):,} total for {rooms} room(s)."
    }
    
    return {
        "accommodation_options": options,
        "recommended_accommodation": recommended,
        "agent_logs": state.get("agent_logs", []) + [log]
    }

