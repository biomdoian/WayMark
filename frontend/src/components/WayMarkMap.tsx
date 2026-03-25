import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icon issues in React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const WayMarkMap = () => {
  // Center coordinates for the Nairobi-Nakuru region
  const position: [number, number] = [-1.10, 36.45]; 

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden z-0">
      <MapContainer center={position} zoom={9} scrollWheelZoom={false} className="h-full w-full">
        {/* Dark Mode Map Tiles to match your Cinematic theme */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={[-1.286389, 36.817223]}>
          <Popup>Nairobi: The Start of the Journey</Popup>
        </Marker>
        <Marker position={[-0.303, 36.07]}>
          <Popup>Nakuru: Destination Reached</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default WayMarkMap;