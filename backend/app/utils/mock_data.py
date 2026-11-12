"""Knowledge base of geographic coordinates, attractions, local transit, and regional travel patterns."""

CITY_DATABASE = {
    "goa": {
        "name": "Goa",
        "state_country": "Goa, India",
        "lat": 15.2993,
        "lng": 74.1240,
        "airport_code": "GOI",
        "railway_station": "Madgaon (MAO) / Thivim (THVM)",
        "best_season": "November to February",
        "local_transport": [
            {"mode": "Rented Scooter/Bike", "cost": 400, "description": "Most popular way to explore Goa beaches and coastal lanes.", "tips": ["Always wear a helmet", "Carry original DL"]},
            {"mode": "Self-Drive Car", "cost": 1500, "description": "Convenient for families and groups traveling between North & South Goa.", "tips": ["Thar/Swift available widely", "Check security deposit terms"]},
            {"mode": "GoaMiles App / Taxi", "cost": 1200, "description": "Fixed rate app cabs; private tourist taxis charge higher standard tariffs.", "tips": ["Pre-book for airport transfers"]},
            {"mode": "Kadamba Local Buses", "cost": 80, "description": "Very economical public transport connecting Panaji, Margao, and Mapusa.", "tips": ["Buses stop by 8:30 PM"]}
        ],
        "attractions": [
            {"name": "Fort Aguada", "lat": 15.4925, "lng": 73.7737, "desc": "17th-century Portuguese lighthouse & fortress overlooking Sinquerim Beach.", "hours": "09:30 AM - 06:00 PM", "fee": 50},
            {"name": "Baga & Calangute Beach", "lat": 15.5553, "lng": 73.7517, "desc": "Iconic beach hub known for water sports, beach shacks, and vibrant night markets.", "hours": "Open 24 hours", "fee": 0},
            {"name": "Basilica of Bom Jesus", "lat": 15.5009, "lng": 73.9116, "desc": "UNESCO World Heritage Roman Catholic basilica holding the mortal remains of St. Francis Xavier.", "hours": "09:00 AM - 06:30 PM", "fee": 0},
            {"name": "Dudhsagar Waterfalls", "lat": 15.3144, "lng": 74.3143, "desc": "Four-tiered massive cascade on the Mandovi River bordering Bhagwan Mahaveer Sanctuary.", "hours": "08:30 AM - 04:30 PM", "fee": 500},
            {"name": "Anjuna Flea Market & Curlies", "lat": 15.5733, "lng": 73.7410, "desc": "Bohemian coastal stretch famous for sunset vibes, trance cafes, and handicraft stalls.", "hours": "Open till late night", "fee": 0}
        ],
        "cuisines": [
            {"meal": "Breakfast", "spot": "Infantaria Bakery, Calangute", "dish": "Goan Poi with Pork Sausages or Mushroom Xacuti", "cost": 250},
            {"meal": "Lunch", "spot": "Fisherman's Wharf, Panaji", "dish": "Authentic Goan Fish Thali with Kingfish Rava Fry & Solkadhi", "cost": 450},
            {"meal": "Dinner", "spot": "Gunpowder, Assagao", "dish": "South Indian coastal curries with Malabar Parotta & Bebinca dessert", "cost": 650}
        ]
    },
    "jaipur": {
        "name": "Jaipur",
        "state_country": "Rajasthan, India",
        "lat": 26.9124,
        "lng": 75.7873,
        "airport_code": "JAI",
        "railway_station": "Jaipur Junction (JP)",
        "best_season": "October to March",
        "local_transport": [
            {"mode": "Jaipur Metro", "cost": 50, "description": "Fast and air-conditioned east-west connectivity through old walled city.", "tips": ["Use smart card for quick access"]},
            {"mode": "E-Rickshaws & Autos", "cost": 300, "description": "Best for maneuvering through narrow bazaars of Johari and Bapu Bazaar.", "tips": ["Negotiate price or use meter"]},
            {"mode": "Uber / Ola Cabs", "cost": 800, "description": "Air-conditioned city transfers especially to Amber Fort and Nahargarh hills.", "tips": ["Book round trip for forts outside city"]},
            {"mode": "RTDC Hop-on Hop-off Bus", "cost": 400, "description": "Official tourist sightseeing circuit covering all heritage sites.", "tips": ["Departs from Railway Station"]}
        ],
        "attractions": [
            {"name": "Hawa Mahal (Palace of Winds)", "lat": 26.9239, "lng": 75.8267, "desc": "Five-story pink sandstone palace with 953 intricately carved jharokhas.", "hours": "09:00 AM - 05:00 PM", "fee": 50},
            {"name": "Amber Fort & Palace", "lat": 26.9855, "lng": 75.8513, "desc": "Magnificent hilltop fortress featuring Sheesh Mahal (mirror palace) & Maota Lake.", "hours": "08:00 AM - 05:30 PM", "fee": 100},
            {"name": "City Palace & Jantar Mantar", "lat": 26.9258, "lng": 75.8237, "desc": "Royal residence of Maharaja of Jaipur and 18th-century astronomical observatory.", "hours": "09:30 AM - 05:00 PM", "fee": 200},
            {"name": "Nahargarh Fort Sunset Viewpoint", "lat": 26.9373, "lng": 75.8155, "desc": "Perched on Aravalli hills with sweeping panoramic views of the Pink City at sunset.", "hours": "10:00 AM - 07:00 PM", "fee": 50},
            {"name": "Bapu & Johari Bazaar", "lat": 26.9196, "lng": 75.8234, "desc": "Vibrant markets renowned for Jaipuri quilts, gemstones, block-printed textiles, and mojris.", "hours": "11:00 AM - 09:00 PM", "fee": 0}
        ],
        "cuisines": [
            {"meal": "Breakfast", "spot": "Rawat Mishthan Bhandar, Station Road", "dish": "Pyaaz Kachori with spicy tamarind chutney & Jalebi", "cost": 150},
            {"meal": "Lunch", "spot": "Laxmi Mishthan Bhandar (LMB), Johari Bazaar", "dish": "Traditional Royal Rajasthani Dal Baati Churma Thali", "cost": 500},
            {"meal": "Dinner", "spot": "1135 AD, Amer Fort / Handi, MI Road", "dish": "Authentic Laal Maas with Rumali Roti or Gatte ki Sabzi", "cost": 750}
        ]
    },
    "manali": {
        "name": "Manali",
        "state_country": "Himachal Pradesh, India",
        "lat": 32.2432,
        "lng": 77.1892,
        "airport_code": "KUU (Bhuntar, 50km)",
        "railway_station": "Chandigarh (CDG, 300km) / Anandpur Sahib",
        "best_season": "March to June & December to February (Snow)",
        "local_transport": [
            {"mode": "Local Auto-rickshaws", "cost": 250, "description": "Good for quick trips between Mall Road and Old Manali.", "tips": ["Fixed union rates apply"]},
            {"mode": "Himachal Taxi Union Cabs", "cost": 1800, "description": "Dedicated cabs for Solang Valley, Atal Tunnel, and Sissu day trips.", "tips": ["Must book through government registered union counters"]},
            {"mode": "Walking & Strolling", "cost": 0, "description": "Pleasant walking through cedar forests and Old Manali cafes.", "tips": ["Wear comfortable grip shoes"]},
            {"mode": "Rental Royal Enfield / Scooty", "cost": 900, "description": "Popular mountain exploring choice for solo and couple travelers.", "tips": ["Avoid during heavy black ice or snowfall"]}
        ],
        "attractions": [
            {"name": "Solang Valley", "lat": 32.3166, "lng": 77.1581, "desc": "Adventure hub offering paragliding, zorbing, quad biking, and winter ski slopes.", "hours": "09:00 AM - 06:00 PM", "fee": 0},
            {"name": "Atal Tunnel & Sissu (Lahaul)", "lat": 32.3644, "lng": 77.0505, "desc": "World's longest highway tunnel above 10,000 feet leading to snow-capped Lahaul valley.", "hours": "Open subject to weather", "fee": 0},
            {"name": "Hadimba Devi Temple", "lat": 32.2483, "lng": 77.1696, "desc": "Historic pagoda-shaped wooden temple built in 1553 surrounded by towering deodar trees.", "hours": "08:00 AM - 06:00 PM", "fee": 0},
            {"name": "Old Manali Village & Cafes", "lat": 32.2562, "lng": 77.1751, "desc": "Bohemian hub with wooden chalets, apple orchards, live acoustic music, and riverside cafes.", "hours": "Open till late evening", "fee": 0},
            {"name": "Jogini Waterfall Trek", "lat": 32.2690, "lng": 77.1900, "desc": "Scenic 3-km forest trail starting from Vashisht hot springs to pristine cascading waterfalls.", "hours": "09:00 AM - 05:00 PM", "fee": 0}
        ],
        "cuisines": [
            {"meal": "Breakfast", "spot": "Cafe 1947, Old Manali", "dish": "Woodfired trout sandwich, pancakes & hot Himalayan spiced chai", "cost": 300},
            {"meal": "Lunch", "spot": "Johnson's Cafe & Bar", "dish": "Fresh Himalayan Pan-Fried Trout with herb potatoes", "cost": 650},
            {"meal": "Dinner", "spot": "Chopsticks, Mall Road", "dish": "Steaming Tibetan Momos, Thukpa soup & Tingmo bread", "cost": 350}
        ]
    },
    "kerala": {
        "name": "Kochi & Munnar (Kerala)",
        "state_country": "Kerala, India",
        "lat": 9.9312,
        "lng": 76.2673,
        "airport_code": "COK",
        "railway_station": "Ernakulam Junction (ERS)",
        "best_season": "September to March",
        "local_transport": [
            {"mode": "Kochi Water Metro & Ferries", "cost": 40, "description": "State-of-the-art electric hybrid water ferries connecting islands and heritage Fort Kochi.", "tips": ["Very scenic and punctual"]},
            {"mode": "Private Tourist Cab", "cost": 2200, "description": "Essential for scenic hillside transit from Kochi to Munnar tea plantations.", "tips": ["Book AC cab with experienced hill driver"]},
            {"mode": "KSRTC Fast Passenger Buses", "cost": 150, "description": "Direct scenic mountain bus route winding through Cheeyappara waterfalls.", "tips": ["Affordable budget mountain journey"]}
        ],
        "attractions": [
            {"name": "Fort Kochi & Chinese Fishing Nets", "lat": 9.9658, "lng": 76.2425, "desc": "Colonial seaside heritage zone with cantilevered Chinese fishing nets and art cafes.", "hours": "Best viewed at sunrise/sunset", "fee": 0},
            {"name": "Munnar Tea Gardens & Eravikulam National Park", "lat": 10.1518, "lng": 77.0601, "desc": "Rolling emerald tea slopes home to the endangered Nilgiri Tahr mountain goat.", "hours": "08:30 AM - 04:00 PM", "fee": 200},
            {"name": "Mattupetty Dam & Echo Point", "lat": 10.1060, "lng": 77.1245, "desc": "Scenic storage reservoir with speed boating surrounded by mist-covered hills.", "hours": "09:00 AM - 05:00 PM", "fee": 50},
            {"name": "Alleppey Backwater Shikara Cruise", "lat": 9.4981, "lng": 76.3388, "desc": "Cruising through tranquil palm-fringed canals, paddy fields, and village waterways.", "hours": "06:00 AM - 06:00 PM", "fee": 800}
        ],
        "cuisines": [
            {"meal": "Breakfast", "spot": "Kashi Art Cafe, Fort Kochi", "dish": "Appam with vegetable stew & Kerala roast coffee", "cost": 280},
            {"meal": "Lunch", "spot": "Rapsy Restaurant, Munnar", "dish": "Authentic Kerala Sadya on banana leaf with payasam", "cost": 220},
            {"meal": "Dinner", "spot": "Seagull Restaurant, Mattancherry", "dish": "Karimeen Pollichathu (pearl spot fish in banana leaf) with Malabar Parotta", "cost": 600}
        ]
    }
}

DEFAULT_DESTINATION = {
    "name": "General Destination",
    "state_country": "India",
    "lat": 20.5937,
    "lng": 78.9629,
    "airport_code": "DEL",
    "railway_station": "Central Junction",
    "best_season": "All Year",
    "local_transport": [
        {"mode": "Public Bus & Transit", "cost": 100, "description": "Extensive city bus network connecting key stations and suburbs.", "tips": ["Keep small cash denominations"]},
        {"mode": "Auto-Rickshaws & Taxis", "cost": 450, "description": "Door-to-door transit for shopping and sightseeing.", "tips": ["Use app rides like Uber/Ola where available"]},
        {"mode": "Rental Vehicles / Cabs", "cost": 1400, "description": "Comfortable full-day private cabs for multi-attraction itineraries.", "tips": ["Plan stops along the same corridor"]}
    ],
    "attractions": [
        {"name": "City Heritage Landmark", "lat": 20.6000, "lng": 78.9700, "desc": "Prominent cultural and historical monument in the center of the city.", "hours": "09:00 AM - 05:30 PM", "fee": 50},
        {"name": "Central Market & Cultural Quarter", "lat": 20.5900, "lng": 78.9600, "desc": "Lively downtown street market featuring regional handicrafts and food.", "hours": "10:00 AM - 09:00 PM", "fee": 0},
        {"name": "Botanical Gardens & Viewpoint", "lat": 20.6100, "lng": 78.9800, "desc": "Picturesque green reserve offering panoramic city views and relaxation.", "hours": "06:00 AM - 06:30 PM", "fee": 30}
    ],
    "cuisines": [
        {"meal": "Breakfast", "spot": "Local Central Cafe", "dish": "Traditional regional morning platter with filter beverage", "cost": 150},
        {"meal": "Lunch", "spot": "Heritage Thali House", "dish": "Authentic regional lunch thali with local staples", "cost": 350},
        {"meal": "Dinner", "spot": "Skyline Dining Bistro", "dish": "Signature regional evening specialty platter", "cost": 550}
    ]
}

def get_city_info(destination: str) -> dict:
    clean = destination.lower().strip()
    for key, data in CITY_DATABASE.items():
        if key in clean or clean in key:
            return data
    # Fallback with destination name preserved
    fallback = dict(DEFAULT_DESTINATION)
    fallback["name"] = destination.title()
    return fallback
