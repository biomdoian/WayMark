import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// FIXED: This now only flies to the center the VERY FIRST time it loads
function RecenterMap({ center }) {
  const map = useMap();
  const [hasRecentered, setHasRecentered] = useState(false);

  useEffect(() => {
    if (center && !hasRecentered) {
      map.flyTo(center, 13, { animate: true });
      setHasRecentered(true);
    }
  }, [center, hasRecentered, map]);

  return null;
}

function MapEvents({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

function WayMarkMap({ waymarks = [], onMapClick, selectedLocation }) {
  const defaultCenter = [-1.286389, 36.817223]; // Nairobi
  
  // Use the first waymark as the anchor, or Nairobi default
  const center = waymarks.length > 0 
    ? [waymarks[0].latitude, waymarks[0].longitude] 
    : defaultCenter;

  return (
    <div className="map-wrapper h-full w-full">
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={true} 
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Existing Waypoints */}
        {waymarks.map((wm) => (
          <Marker key={wm.id} position={[wm.latitude, wm.longitude]}>
            <Popup>
              <div className="text-black">
                <strong className="text-waymark-amber">{wm.label}</strong>
                <p>{wm.story}</p>
                {wm.timestamp_in_video && (
                  <small className="block mt-1 font-mono">🎬 POV: {wm.timestamp_in_video}s</small>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Temporary Blue Pin for the new location */}
        {selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
        )}

        <RecenterMap center={center} />
        <MapEvents onMapClick={onMapClick} />
      </MapContainer>
    </div>
  );
}

export default WayMarkMap;