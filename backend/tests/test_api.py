import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "integrations" in data

def test_plan_and_refine_flow():
    # 1. Plan a trip
    payload = {
        "origin": "Delhi",
        "destination": "Jaipur",
        "start_date": "2026-12-05",
        "duration_days": 2,
        "travellers": 2,
        "total_budget": 15000,
        "travel_style": "Standard",
        "preferred_transport": "Train",
        "interests": ["History", "Food"]
    }
    res = client.post("/api/trips/plan", json=payload)
    assert res.status_code == 200
    trip = res.json()
    trip_id = trip["id"]
    
    assert trip["destination"] == "Jaipur"
    assert len(trip["transportation_options"]) > 0
    assert len(trip["accommodation_options"]) == 4
    assert len(trip["itinerary"]) == 2
    assert trip["budget_breakdown"]["total_budget"] == 15000.0
    
    # 2. Get saved trip by ID
    get_res = client.get(f"/api/trips/{trip_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == trip_id
    
    # 3. Refine trip
    refine_res = client.post("/api/trips/refine", json={
        "trip_id": trip_id,
        "prompt": "Replace with bus and make it cheaper under 12000"
    })
    assert refine_res.status_code == 200
    refined = refine_res.json()
    assert refined["recommended_transport"]["mode"] == "Bus"
    assert refined["total_budget"] == 12000.0
    
    # 4. List saved trips
    list_res = client.get("/api/trips")
    assert list_res.status_code == 200
    trips = list_res.json()
    assert any(t["id"] == trip_id for t in trips)
    
    # 5. Delete saved trip
    del_res = client.delete(f"/api/trips/{trip_id}")
    assert del_res.status_code == 200
    
    # Verify deletion
    verify_del = client.get(f"/api/trips/{trip_id}")
    assert verify_del.status_code == 404
