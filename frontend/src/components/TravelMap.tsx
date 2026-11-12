import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapMarker } from '../types/trip';
import { MapPin, Building, Landmark, Compass } from 'lucide-react';

// Fix Leaflet's default marker icons in Vite / Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom colored SVG icons for Hotel vs Attractions
const createCustomIcon = (category: string) => {
  const isHotel = category === 'hotel';
  const color = isHotel ? '#4f46e5' : '#0d9488'; // Indigo for Hotel, Teal for Sights
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
      <circle cx="12" cy="12" r="10" fill="${color}" stroke="#ffffff" stroke-width="2"/>
      <circle cx="12" cy="12" r="4" fill="#ffffff" />
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: 'custom-leaflet-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -14],
  });
};

function ChangeMapView({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, 11);
  }, [coords, map]);
  return null;
}

interface TravelMapProps {
  markers: MapMarker[];
  destinationName: string;
}

export const TravelMap: React.FC<TravelMapProps> = ({ markers, destinationName }) => {
  const validMarkers = markers.filter(m => m.lat && m.lng && !isNaN(m.lat) && !isNaN(m.lng));

  const centerLat = validMarkers.length > 0 
    ? validMarkers.reduce((acc, m) => acc + m.lat, 0) / validMarkers.length 
    : 15.2993;
  const centerLng = validMarkers.length > 0 
    ? validMarkers.reduce((acc, m) => acc + m.lng, 0) / validMarkers.length 
    : 74.1240;

  const centerCoords: [number, number] = [centerLat, centerLng];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-brand-600" />
            <span>Interactive Itinerary Map — {destinationName}</span>
          </h3>
          <p className="text-xs text-slate-500">
            OpenStreetMap view with verified coordinates for accommodations and attractions.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-600 ring-2 ring-indigo-200 inline-block" />
            <span className="text-slate-700">Recommended Stay</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-teal-600 ring-2 ring-teal-200 inline-block" />
            <span className="text-slate-700">Attraction</span>
          </div>
        </div>
      </div>

      <div className="h-[420px] w-full rounded-xl overflow-hidden border border-slate-200 shadow-inner relative">
        <MapContainer
          center={centerCoords}
          zoom={11}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <ChangeMapView coords={centerCoords} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {validMarkers.map((marker) => (
            <Marker
              key={marker.id}
              position={[marker.lat, marker.lng]}
              icon={createCustomIcon(marker.category)}
            >
              <Popup>
                <div className="p-1 space-y-1 max-w-[200px]">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    marker.category === 'hotel' 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'bg-teal-100 text-teal-700'
                  }`}>
                    {marker.category === 'hotel' ? 'Accommodation' : `Day ${marker.day || 1} Sight`}
                  </span>
                  <h6 className="font-bold text-slate-900 text-xs leading-tight">{marker.name}</h6>
                  <p className="text-[11px] text-slate-600 leading-snug">{marker.description}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};
