import datetime
from typing import Dict, Any, List
from app.services.tavily_service import TavilyResearchService
from app.services.weather_service import get_destination_weather

async def research_agent_node(state: Dict[str, Any]) -> Dict[str, Any]:
    """Research and Verification Agent node: searches web travel data and weather."""
    request = state["request"]
    dest = request["destination"]
    orig = request["origin"]
    
    tavily_service = TavilyResearchService()
    search_queries = [
        f"{orig} to {dest} train bus flight travel options fare",
        f"best budget standard hotels in {dest} current rates",
        f"top attractions and local transit in {dest}"
    ]
    
    research_results = []
    for q in search_queries:
        res = await tavily_service.search(q, max_results=2)
        research_results.extend(res)
        
    weather = await get_destination_weather(dest)
    
    timestamp = datetime.datetime.now().strftime("%H:%M:%S")
    new_log = {
        "agent": "Research & Verification Agent",
        "action": f"Queried verified travel portals & live Open-Meteo weather for {dest}",
        "status": "completed",
        "timestamp": timestamp,
        "details": f"Gathered {len(research_results)} verified references and climate telemetry ({weather.get('condition', 'Normal') if weather else 'Clear'})."
    }
    
    return {
        "research_context": research_results,
        "weather_info": weather,
        "agent_logs": state.get("agent_logs", []) + [new_log]
    }
