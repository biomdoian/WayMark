import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Importing default icons to fix the "missing marker" bug in React-Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function WayMarkMap({ waymarks }) {
  // Default center (Nairobi) if no waymarks exist
  const defaultCenter = [-1.286389, 36.817223];
  
  // Use the first waymark's coordinates as center if available
  const center = waymarks.length > 0 
    ? [waymarks[0].latitude, waymarks[0].longitude] 
    : defaultCenter;

  return (
    <div className="map-wrapper" style={{ height: "400px", width: "100%", margin: "20px 0", borderRadius: "12px", overflow: "hidden" }}>
      <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {waymarks.map((wm) => (
          <Marker key={wm.id} position={[wm.latitude, wm.longitude]}>
            <Popup>
              <div className="popup-content">
                <strong>{wm.label}</strong>
                <p>{wm.story}</p>
                {wm.timestamp_in_video && <small>Timestamp: {wm.timestamp_in_video}s</small>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default WayMarkMap;