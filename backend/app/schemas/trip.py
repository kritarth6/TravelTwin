from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field

class TripRequest(BaseModel):
    origin: str = Field(..., description="Starting city, e.g., Delhi, Mumbai, Bengaluru")
    destination: str = Field(..., description="Destination city, e.g., Goa, Manali, Jaipur")
    start_date: str = Field(..., description="Departure date (YYYY-MM-DD)")
    end_date: Optional[str] = Field(None, description="Return date (YYYY-MM-DD)")
    duration_days: Optional[int] = Field(None, description="Trip duration in days (if end_date not provided)")
    travellers: int = Field(1, ge=1, le=50, description="Number of travellers")
    total_budget: float = Field(..., gt=0, description="Total budget in INR")
    travel_style: Literal["Budget", "Standard", "Premium", "Luxury"] = "Standard"
    preferred_transport: Literal["Any", "Flight", "Train", "Bus", "Cab", "Self-Drive"] = "Any"
    accommodation_type: Optional[str] = "Any"
    interests: List[str] = Field(default_factory=lambda: ["Sightseeing", "Food", "Culture"])
    special_requirements: Optional[str] = None

class TransportOption(BaseModel):
    id: str
    mode: Literal["Flight", "Train", "Bus", "Cab", "Shared Cab", "Self-Drive", "Multi-Modal"]
    title: str
    provider: str
    price_per_person: float
    total_price: float
    duration_hours: float
    duration_display: str
    comfort_level: Literal["Budget", "Moderate", "Comfortable", "High Comfort", "Luxury"]
    pros: List[str]
    cons: List[str]
    price_type: Literal["Live Verified", "Search-Result", "Estimated"] = "Search-Result"
    booking_url: Optional[str] = None
    recommended: bool = False
    recommendation_reason: Optional[str] = None
    details: Optional[str] = None

class AccommodationOption(BaseModel):
    id: str
    name: str
    tier: Literal["Budget", "Standard", "Premium", "Luxury"]
    category: str
    price_per_night: float
    total_cost: float
    rating: float
    reviews_count: Optional[int] = 0
    location: str
    distance_from_center: str
    amenities: List[str]
    image_url: str
    provider: str
    booking_url: str
    price_type: Literal["Live Verified", "Search-Result", "Estimated"] = "Search-Result"
    lat: Optional[float] = None
    lng: Optional[float] = None
    recommended: bool = False

class LocalTransportOption(BaseModel):
    mode: str
    estimated_daily_cost: float
    description: str
    tips: List[str]

class ActivityItem(BaseModel):
    time: str
    activity: str
    location: str
    estimated_duration: str
    cost: float
    tips: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None

class FoodRecommendation(BaseModel):
    meal: str
    spot_name: str
    specialty: str
    approx_cost_per_person: float

class DayItinerary(BaseModel):
    day_number: int
    date: str
    title: str
    theme: str
    morning: ActivityItem
    afternoon: ActivityItem
    evening: ActivityItem
    food_recommendations: List[FoodRecommendation]
    local_transport_advice: str
    estimated_daily_expense: float

class BudgetBreakdown(BaseModel):
    total_budget: float
    intercity_transport: float
    accommodation: float
    food: float
    local_transport: float
    activities_sightseeing: float
    emergency_buffer: float
    total_estimated_cost: float
    remaining_balance: float
    is_within_budget: bool
    optimization_notes: List[str]

class MapMarker(BaseModel):
    id: str
    name: str
    category: Literal["attraction", "hotel", "transit", "food"]
    lat: float
    lng: float
    description: str
    day: Optional[int] = None

class AgentLog(BaseModel):
    agent: str
    action: str
    status: Literal["running", "completed", "optimized", "warning"] = "completed"
    timestamp: str
    details: Optional[str] = None

class TripPlan(BaseModel):
    id: str
    destination: str
    origin: str
    start_date: str
    end_date: str
    duration_days: int
    travellers: int
    total_budget: float
    travel_style: str
    overview: str
    weather_forecast: Optional[Dict[str, Any]] = None
    transportation_options: List[TransportOption]
    recommended_transport: TransportOption
    accommodation_options: List[AccommodationOption]
    recommended_accommodation: AccommodationOption
    local_transportation: List[LocalTransportOption]
    itinerary: List[DayItinerary]
    budget_breakdown: BudgetBreakdown
    ai_explanation: str
    map_markers: List[MapMarker]
    agent_execution_logs: List[AgentLog]
    is_demo_mode: bool = False
    created_at: str

class TripRefineRequest(BaseModel):
    trip_id: str
    prompt: str
    current_plan: Optional[TripPlan] = None
