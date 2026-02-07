import { getComplaints } from "../utils/complaints";
import MapView from "../Components/MapView";

const MapDashboard = () => {
  const complaints = getComplaints();

  return (
    <div className="h-[calc(100vh-96px)]">
      <MapView complaints={complaints} />
    </div>
  );
};

export default MapDashboard;
