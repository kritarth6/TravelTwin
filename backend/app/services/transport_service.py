import urllib.parse
from typing import Dict, List, Any

def generate_booking_links(origin: str, destination: str, date: str) -> Dict[str, str]:
    """Generate verified deep search URLs for real travel aggregators and official portals."""
    enc_origin = urllib.parse.quote(origin)
    enc_dest = urllib.parse.quote(destination)
    
    return {
        "flights_google": f"https://www.google.com/travel/flights?q=flights+from+{enc_origin}+to+{enc_dest}+on+{date}",
        "flights_makemytrip": f"https://www.makemytrip.com/flight/search?itinerary={enc_origin}-{enc_dest}-{date}&tripType=O&paxType=A-1_C-0_I-0",
        "flights_skyscanner": f"https://www.skyscanner.com/transport/flights/{enc_origin}/{enc_dest}/",
        "trains_irctc": f"https://www.irctc.co.in/nget/train-search",
        "trains_confirmtkt": f"https://www.confirmtkt.com/rbooking-d/trains/from/{enc_origin}/to/{enc_dest}",
        "bus_redbus": f"https://www.redbus.in/bus-tickets/{enc_origin}-to-{enc_dest}",
        "bus_abhibus": f"https://www.abhibus.com/bus_search/{enc_origin}/{enc_dest}",
        "cab_makemytrip": f"https://www.makemytrip.com/cabs/{enc_origin}-to-{enc_dest}-cabs.html",
        "selfdrive_zoomcar": f"https://www.zoomcar.com/",
        "hotels_booking": f"https://www.booking.com/searchresults.html?ss={enc_dest}&checkin={date}",
        "hotels_agoda": f"https://www.agoda.com/search?city={enc_dest}"
    }

def estimate_intercity_distance_km(origin: str, destination: str) -> float:
    """Rough heuristic distance table between major hubs with fallback."""
    o = origin.lower().strip()
    d = destination.lower().strip()
    
    known_pairs = {
        ("delhi", "jaipur"): 280,
        ("delhi", "manali"): 530,
        ("delhi", "goa"): 1850,
        ("delhi", "varanasi"): 820,
        ("delhi", "mumbai"): 1420,
        ("mumbai", "goa"): 590,
        ("mumbai", "pune"): 150,
        ("bengaluru", "goa"): 560,
        ("bengaluru", "chennai"): 350,
        ("bengaluru", "kochi"): 550,
        ("bengaluru", "coorg"): 260,
        ("kolkata", "darjeeling"): 610,
        ("hyderabad", "goa"): 650,
        ("chennai", "pondicherry"): 150,
    }
    
    for (k1, k2), dist in known_pairs.items():
        if (k1 in o and k2 in d) or (k2 in o and k1 in d):
            return float(dist)
            
    # Default sensible heuristic distance between distinct cities
    return 650.0
