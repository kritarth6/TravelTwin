import datetime
from typing import Dict, Any, List
from app.utils.mock_data import get_city_info

def local_transport_agent_node(state: Dict[str, Any]) -> Dict[str, Any]:
    """Local Transportation Agent: Researches city mobility, auto, metro, bike, and cab options."""
    request = state["request"]
    dest = request["destination"]
    
    city_data = get_city_info(dest)
    raw_local = city_data.get("local_transport", [])
    
    options = []
    for item in raw_local:
        options.append({
            "mode": item["mode"],
            "estimated_daily_cost": float(item["cost"]),
            "description": item["description"],
            "tips": item.get("tips", ["Negotiate fare beforehand or insist on digital meters."])
        })
        
    timestamp = datetime.datetime.now().strftime("%H:%M:%S")
    log = {
        "agent": "Local Transportation Agent",
        "action": f"Mapped {len(options)} destination mobility channels for {dest}",
        "status": "completed",
        "timestamp": timestamp,
        "details": f"Average local mobility budget projected at ₹{int(sum(o['estimated_daily_cost'] for o in options) / max(1, len(options)))}/day."
    }
    
    return {
        "local_transportation": options,
        "agent_logs": state.get("agent_logs", []) + [log]
    }

