from typing import List, Dict, Any, Optional, TypedDict
from app.schemas.trip import (
    TripRequest,
    TransportOption,
    AccommodationOption,
    LocalTransportOption,
    DayItinerary,
    BudgetBreakdown,
    MapMarker,
    AgentLog
)

class PlanGraphState(TypedDict):
    # Input
    request: Dict[str, Any]
    
    # Intermediate Agent Research
    research_context: List[Dict[str, Any]]
    weather_info: Optional[Dict[str, Any]]
    
    # Generated sections
    transportation_options: List[Dict[str, Any]]
    recommended_transport: Optional[Dict[str, Any]]
    
    accommodation_options: List[Dict[str, Any]]
    recommended_accommodation: Optional[Dict[str, Any]]
    
    local_transportation: List[Dict[str, Any]]
    
    itinerary: List[Dict[str, Any]]
    
    budget_breakdown: Optional[Dict[str, Any]]
    
    map_markers: List[Dict[str, Any]]
    
    overview: str
    ai_explanation: str
    
    # Logs and status
    agent_logs: List[Dict[str, Any]]
    is_demo_mode: bool
    error: Optional[str]

