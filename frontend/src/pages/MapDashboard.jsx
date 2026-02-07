import { getComplaints } from "../utils/complaints";
import MapView from "../Components/MapView";

const MapDashboard = () => {
  const complaints = getComplaints();

  return (
    <div className="flex flex-col h-screen">

      {/* Header */}
      <div className="px-6 py-4 bg-white shadow-sm">
        <h2 className="text-2xl font-semibold text-[#0A2540]">
          Complaints Map
        </h2>
        <p className="text-sm text-gray-500">
          View all reported civic issues on the map.
        </p>
      </div>

      {/* Map Section */}
      <div className="flex-1">
        <MapView complaints={complaints} />
      </div>

    </div>
  );
};

export default MapDashboard;
