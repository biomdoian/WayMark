import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
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

// NEW: This component tells the map to fly to the new coordinates
function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

function WayMarkMap({ waymarks = [] }) {
  const defaultCenter = [-1.286389, 36.817223]; // Nairobi
  
  const center = waymarks.length > 0 
    ? [waymarks[0].latitude, waymarks[0].longitude] 
    : defaultCenter;

  return (
    <div className="map-wrapper" style={{ height: "100%", width: "100%", borderRadius: "12px", overflow: "hidden" }}>
      <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {waymarks.map((wm) => (
          <Marker key={wm.id} position={[wm.latitude, wm.longitude]}>
            <Popup>
              <div className="popup-content">
                <strong className="text-waymark-amber">{wm.label}</strong>
                <p>{wm.story}</p>
                {wm.timestamp_in_video && <small className="block mt-2 font-mono">🎬 POV: {wm.timestamp_in_video}s</small>}
              </div>
            </Popup>
          </Marker>
        ))}
        {/* This triggers the move when data loads */}
        <RecenterMap center={center} />
      </MapContainer>
    </div>
  );
}

export default WayMarkMap;