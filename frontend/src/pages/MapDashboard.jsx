import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { getComplaints } from "../utils/complaints";
import { useEffect, useState } from "react";

const MapDashboard = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    setComplaints(getComplaints());
  }, []);

  const valid = complaints.filter(
    (c) => c.coords && Array.isArray(c.coords) && c.coords.length === 2
  );

  const defaultCenter =
    valid.length > 0 ? valid[0].coords : [28.6139, 77.2090];

  return (
    <div className="h-screen w-full">
      <MapContainer center={defaultCenter} zoom={12} className="h-full w-full">
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {valid.map((c, index) => (
          <Marker key={index} position={c.coords}>
            <Popup>
              <div>
                <h3 className="font-semibold">{c.title}</h3>
                <p>{c.locationText}</p>
                <p>Status: {c.status || "Pending"}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapDashboard;
