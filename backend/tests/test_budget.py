import pytest
from app.agents.budget_agent import budget_agent_node

def test_budget_agent_optimization():
    # Test case where initial total exceeds user budget
    state = {
        "request": {
            "origin": "Delhi",
            "destination": "Goa",
            "travellers": 2,
            "duration_days": 3,
            "total_budget": 12000.0
        },
        "transportation_options": [
            {
                "id": "t1",
                "mode": "Flight",
                "title": "Economy Flight",
                "total_price": 10000.0,
                "recommended": True
            },
            {
                "id": "t2",
                "mode": "Train",
                "title": "Superfast Express",
                "total_price": 3200.0,
                "recommended": False
            }
        ],
        "recommended_transport": {
            "id": "t1",
            "mode": "Flight",
            "title": "Economy Flight",
            "total_price": 10000.0,
            "recommended": True
        },
        "accommodation_options": [
            {
                "id": "h1",
                "name": "Hostel",
                "tier": "Budget",
                "total_cost": 1700.0,
                "recommended": False
            },
            {
                "id": "h2",
                "name": "Hotel",
                "tier": "Standard",
                "total_cost": 4800.0,
                "recommended": True
            }
        ],
        "recommended_accommodation": {
            "id": "h2",
            "name": "Hotel",
            "tier": "Standard",
            "total_cost": 4800.0,
            "recommended": True
        },
        "itinerary": [
            {
                "food_recommendations": [{"approx_cost_per_person": 150}],
                "morning": {"cost": 50},
                "afternoon": {"cost": 50},
                "evening": {"cost": 100}
            }
        ],
        "agent_logs": []
    }

    result = budget_agent_node(state)
    breakdown = result["budget_breakdown"]
    
    # Assert that auto-optimization triggered to swap flight for train and lower stay
    assert breakdown is not None
    assert breakdown["intercity_transport"] == 3200.0 # Swapped to Train
    assert result["recommended_transport"]["mode"] == "Train"
    assert len(breakdown["optimization_notes"]) > 0
