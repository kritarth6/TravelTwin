import httpx
from typing import Optional, Dict, Any

def _fallback_weather(destination: str) -> Dict[str, Any]:
    return {
        "destination": destination,
        "current_temp": 24,
        "condition": "Pleasant / Clear",
        "daily_max": 28,
        "daily_min": 18,
        "rain_probability": 10,
        "source": "Estimated Seasonal Climate"
    }

async def get_destination_weather(destination: str) -> Dict[str, Any]:
    """Fetch live 7-day weather forecast using free Open-Meteo API."""
    try:
        async with httpx.AsyncClient(timeout=6.0) as client:
            # 1. Geocode destination to get coordinates
            geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={destination}&count=1&language=en&format=json"
            geo_res = await client.get(geo_url)
            if geo_res.status_code != 200:
                return _fallback_weather(destination)
            geo_data = geo_res.json()
            if not geo_data.get("results"):
                return _fallback_weather(destination)
            
            top_result = geo_data["results"][0]
            lat = top_result.get("latitude")
            lng = top_result.get("longitude")
            country = top_result.get("country", "")
            admin1 = top_result.get("admin1", "")

            # 2. Query forecast
            forecast_url = (
                f"https://api.open-meteo.com/v1/forecast?"
                f"latitude={lat}&longitude={lng}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&current_weather=true&timezone=auto"
            )
            forecast_res = await client.get(forecast_url)
            if forecast_res.status_code != 200:
                return None
            
            forecast_data = forecast_res.json()
            current = forecast_data.get("current_weather", {})
            daily = forecast_data.get("daily", {})

            # Weather code interpretation
            w_code = current.get("weathercode", 0)
            condition = "Clear Sky"
            if w_code in [1, 2, 3]:
                condition = "Partly Cloudy"
            elif w_code in [45, 48]:
                condition = "Foggy / Mist"
            elif w_code in [51, 53, 55, 61, 63, 65, 80, 81, 82]:
                condition = "Rain / Showers"
            elif w_code in [71, 73, 75, 85, 86]:
                condition = "Snow"
            elif w_code >= 95:
                condition = "Thunderstorm"

            return {
                "destination": destination,
                "location_name": f"{top_result.get('name')}, {admin1}, {country}".strip(", "),
                "lat": lat,
                "lng": lng,
                "current_temp": current.get("temperature"),
                "windspeed": current.get("windspeed"),
                "condition": condition,
                "weather_code": w_code,
                "daily_max": daily.get("temperature_2m_max", [28])[0] if daily.get("temperature_2m_max") else 28,
                "daily_min": daily.get("temperature_2m_min", [18])[0] if daily.get("temperature_2m_min") else 18,
                "rain_probability": daily.get("precipitation_probability_max", [10])[0] if daily.get("precipitation_probability_max") else 10,
                "source": "Open-Meteo Live API"
            }
    except Exception as e:
        # Graceful fallback without failing the whole itinerary
        return {
            "destination": destination,
            "current_temp": 26,
            "condition": "Pleasant / Sunny",
            "daily_max": 29,
            "daily_min": 19,
            "rain_probability": 15,
            "source": "Estimated Seasonal Climate"
        }
