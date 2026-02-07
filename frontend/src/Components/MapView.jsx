import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

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

const MapView = ({ complaints, center = [28.6139, 77.209], zoom = 12 }) => {
	return (
		<MapContainer center={center} zoom={zoom} className="h-full w-full">
			<TileLayer
				attribution="© OpenStreetMap"
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>

			{complaints.map((c) => (
				<Marker
					key={c.id}
					position={
						Array.isArray(c.coords) && c.coords.length === 2
							? c.coords
							: center
					}
					icon={icons[c.status]}
				>
					<Popup>
						<div className="text-sm">
							<p className="font-semibold">{c.title}</p>
							<p>Category: {c.category || "General"}</p>
							<p>Status: {c.status}</p>
							<p>Date: {c.date || "-"}</p>
							<p>
								Location: {c.locationText || c.location || "Unknown"}
							</p>
						</div>
					</Popup>
				</Marker>
			))}
		</MapContainer>
	);
};

export default MapView;
