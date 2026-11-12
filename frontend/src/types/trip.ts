export interface TripRequest {
  origin: string;
  destination: string;
  start_date: string;
  end_date?: string;
  duration_days?: number;
  travellers: number;
  total_budget: number;
  travel_style: 'Budget' | 'Standard' | 'Premium' | 'Luxury';
  preferred_transport: 'Any' | 'Flight' | 'Train' | 'Bus' | 'Cab' | 'Self-Drive';
  accommodation_type?: string;
  interests: string[];
  special_requirements?: string;
}

export interface TransportOption {
  id: string;
  mode: 'Flight' | 'Train' | 'Bus' | 'Cab' | 'Shared Cab' | 'Self-Drive' | 'Multi-Modal';
  title: string;
  provider: string;
  price_per_person: number;
  total_price: number;
  duration_hours: number;
  duration_display: string;
  comfort_level: 'Budget' | 'Moderate' | 'Comfortable' | 'High Comfort' | 'Luxury';
  pros: string[];
  cons: string[];
  price_type: 'Live Verified' | 'Search-Result' | 'Estimated';
  booking_url?: string;
  recommended: boolean;
  recommendation_reason?: string;
  details?: string;
}

export interface AccommodationOption {
  id: string;
  name: string;
  tier: 'Budget' | 'Standard' | 'Premium' | 'Luxury';
  category: string;
  price_per_night: number;
  total_cost: number;
  rating: number;
  reviews_count?: number;
  location: string;
  distance_from_center: string;
  amenities: string[];
  image_url: string;
  provider: string;
  booking_url: string;
  price_type: 'Live Verified' | 'Search-Result' | 'Estimated';
  lat?: number;
  lng?: number;
  recommended: boolean;
}

export interface LocalTransportOption {
  mode: string;
  estimated_daily_cost: number;
  description: string;
  tips: string[];
}

export interface ActivityItem {
  time: string;
  activity: string;
  location: string;
  estimated_duration: string;
  cost: number;
  tips?: string;
  lat?: number;
  lng?: number;
}

export interface FoodRecommendation {
  meal: string;
  spot_name: string;
  specialty: string;
  approx_cost_per_person: number;
}

export interface DayItinerary {
  day_number: number;
  date: string;
  title: string;
  theme: string;
  morning: ActivityItem;
  afternoon: ActivityItem;
  evening: ActivityItem;
  food_recommendations: FoodRecommendation[];
  local_transport_advice: string;
  estimated_daily_expense: number;
}

export interface BudgetBreakdown {
  total_budget: number;
  intercity_transport: number;
  accommodation: number;
  food: number;
  local_transport: number;
  activities_sightseeing: number;
  emergency_buffer: number;
  total_estimated_cost: number;
  remaining_balance: number;
  is_within_budget: boolean;
  optimization_notes: string[];
}

export interface MapMarker {
  id: string;
  name: string;
  category: 'attraction' | 'hotel' | 'transit' | 'food';
  lat: number;
  lng: number;
  description: string;
  day?: number;
}

export interface AgentLog {
  agent: string;
  action: string;
  status: 'running' | 'completed' | 'optimized' | 'warning';
  timestamp: string;
  details?: string;
}

export interface TripPlan {
  id: string;
  destination: string;
  origin: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  travellers: number;
  total_budget: number;
  travel_style: string;
  overview: string;
  weather_forecast?: {
    destination: string;
    location_name?: string;
    current_temp?: number;
    condition?: string;
    weather_code?: number;
    daily_max?: number;
    daily_min?: number;
    rain_probability?: number;
    source?: string;
  };
  transportation_options: TransportOption[];
  recommended_transport: TransportOption;
  accommodation_options: AccommodationOption[];
  recommended_accommodation: AccommodationOption;
  local_transportation: LocalTransportOption[];
  itinerary: DayItinerary[];
  budget_breakdown: BudgetBreakdown;
  ai_explanation: string;
  map_markers: MapMarker[];
  agent_execution_logs: AgentLog[];
  is_demo_mode: boolean;
  created_at: string;
}

export interface TripSummary {
  id: string;
  destination: string;
  origin: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  travellers: number;
  total_budget: number;
  travel_style: string;
  total_estimated_cost: number;
  created_at: string;
  updated_at: string;
  overview?: string;
}
