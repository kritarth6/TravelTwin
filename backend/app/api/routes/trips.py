from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Query
from app.schemas.trip import TripRequest, TripPlan, TripRefineRequest
from app.graph.workflow import execute_plan_workflow, execute_refine_workflow
from app.database.models import TripRepository

router = APIRouter()

@router.post("/plan", response_model=TripPlan)
async def plan_trip(request: TripRequest):
    """Generate a comprehensive multi-agent travel plan based on user inputs."""
    try:
        plan = await execute_plan_workflow(request)
        return plan
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Planning error: {str(e)}")

@router.post("/refine", response_model=TripPlan)
async def refine_trip(request: TripRefineRequest):
    """Refine an existing plan following conversational instructions without full re-generation."""
    try:
        updated_plan = await execute_refine_workflow(
            trip_id=request.trip_id,
            prompt=request.prompt,
            current_plan=request.current_plan.model_dump() if request.current_plan else None
        )
        return updated_plan
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Refinement error: {str(e)}")

@router.get("", response_model=List[Dict[str, Any]])
async def list_saved_trips():
    """Retrieve all saved trip plans from SQLite database."""
    return TripRepository.list_trips()

@router.get("/{trip_id}", response_model=TripPlan)
async def get_saved_trip(trip_id: str):
    """Retrieve a specific trip plan by ID."""
    trip = TripRepository.get_trip(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail=f"Trip '{trip_id}' not found.")
    return trip

@router.delete("/{trip_id}")
async def delete_saved_trip(trip_id: str):
    """Delete a saved trip plan from the database."""
    success = TripRepository.delete_trip(trip_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Trip '{trip_id}' not found.")
    return {"message": "Trip deleted successfully", "id": trip_id}

@router.get("/{trip_id}/messages")
async def get_trip_messages(trip_id: str):
    """Get chat refinement history for a trip."""
    return TripRepository.get_messages(trip_id)

