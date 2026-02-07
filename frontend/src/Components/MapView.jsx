import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Status Icons
const icons = {
  Pending: new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
    iconSize: [32, 32],
  }),
  "In Progress": new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
    iconSize: [32, 32],
  }),
  Resolved: new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
    iconSize: [32, 32],
  }),
};

// Current location icon
const currentIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  iconSize: [32, 32],
});

const MapView = ({
  complaints = [],
  center = [28.6139, 77.209],
  zoom = 12,
}) => {
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentLocation([
          pos.coords.latitude,
          pos.coords.longitude,
        ]);
      },
      (err) => {
        console.log("Location error:", err);
      }
    );
  }, []);

  return (
    <div className="h-full w-full">
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Current Location */}
        {currentLocation && (
          <Marker position={currentLocation} icon={currentIcon}>
            <Popup>You are here 📍</Popup>
          </Marker>
        )}

        {/* Complaint Markers */}
        {complaints
          .filter(
            (c) =>
              Array.isArray(c.coords) &&
              c.coords.length === 2
          )
          .map((c) => (
            <Marker
              key={c.id}
              position={c.coords}
              icon={icons[c.status] || icons["Pending"]}
            >
              <Popup>
                <strong>{c.title}</strong>
                <br />
                Status: {c.status}
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
