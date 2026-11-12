import pytest
from app.agents.transportation_agent import transportation_agent_node
from app.agents.accommodation_agent import accommodation_agent_node
from app.agents.local_transport_agent import local_transport_agent_node
from app.agents.itinerary_agent import itinerary_agent_node

def test_transportation_agent_multi_modal():
    state = {
        "request": {
            "origin": "Delhi",
            "destination": "Jaipur",
            "start_date": "2026-12-01",
            "travellers": 1,
            "total_budget": 10000.0,
            "travel_style": "Budget",
            "preferred_transport": "Any"
        },
        "agent_logs": []
    }
    result = transportation_agent_node(state)
    options = result["transportation_options"]
    
    assert len(options) >= 3
    modes = [o["mode"] for o in options]
    assert "Train" in modes
    assert "Bus" in modes
    assert "Cab" in modes
    
    # Recommended transport should be selected and reasonable
    rec = result["recommended_transport"]
    assert rec is not None
    assert rec["recommended"] is True
    assert rec["total_price"] <= 10000.0 * 0.40

def test_accommodation_agent_four_tiers():
    state = {
        "request": {
            "origin": "Mumbai",
            "destination": "Goa",
            "start_date": "2026-12-10",
            "duration_days": 4,
            "travellers": 2,
            "total_budget": 25000.0,
            "travel_style": "Standard"
        },
        "agent_logs": []
    }
    result = accommodation_agent_node(state)
    options = result["accommodation_options"]
    
    assert len(options) == 4
    tiers = [o["tier"] for o in options]
    assert set(tiers) == {"Budget", "Standard", "Premium", "Luxury"}
    
    rec = result["recommended_accommodation"]
    assert rec is not None
    assert rec["tier"] in ["Budget", "Standard"]

def test_local_transport_agent():
    state = {
        "request": {
            "destination": "Goa"
        },
        "agent_logs": []
    }
    result = local_transport_agent_node(state)
    locals_ = result["local_transportation"]
    assert len(locals_) > 0
    assert any("Scooter" in l["mode"] or "Cab" in l["mode"] or "Bus" in l["mode"] for l in locals_)

def test_itinerary_agent():
    state = {
        "request": {
            "destination": "Jaipur",
            "start_date": "2026-12-15",
            "duration_days": 3,
            "travellers": 2,
            "interests": ["History", "Sightseeing"]
        },
        "recommended_accommodation": {
            "id": "h1",
            "name": "Heritage Haveli",
            "tier": "Standard",
            "category": "Hotel",
            "location": "Old City",
            "lat": 26.9124,
            "lng": 75.7873
        },
        "agent_logs": []
    }
    result = itinerary_agent_node(state)
    itinerary = result["itinerary"]
    markers = result["map_markers"]
    
    assert len(itinerary) == 3
    assert itinerary[0]["day_number"] == 1
    assert "morning" in itinerary[0]
    assert "afternoon" in itinerary[0]
    assert "evening" in itinerary[0]
    assert len(itinerary[0]["food_recommendations"]) > 0
    assert len(markers) >= 3

