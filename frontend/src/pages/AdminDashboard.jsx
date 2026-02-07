import { useState } from "react";
import { getComplaints, updateComplaintStatus } from "../utils/complaints";

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState(getComplaints());

  const markResolved = (id) => {
    updateComplaintStatus(id, "Resolved");
    setComplaints(getComplaints());
  };

  return (
    <div className="min-h-screen px-10 py-20 bg-gray-50">
      <h2 className="text-4xl font-semibold text-[#0A2540] mb-12">
        Admin Dashboard
      </h2>

      <div className="grid gap-6">
        {complaints.length === 0 && (
          <p className="text-gray-500">No complaints available.</p>
        )}
        {complaints.map((c) => (
          <div
            key={c.id}
            className="bg-white p-6 rounded-2xl shadow flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{c.title}</h3>
              <p className="text-sm text-gray-500">
                {c.locationText || c.location || "Unknown location"}
              </p>
              <span className="text-sm">{c.status}</span>
            </div>

            {c.status !== "Resolved" && (
              <button
                onClick={() => markResolved(c.id)}
                className="bg-green-500 text-white px-5 py-2 rounded-full"
              >
                Mark Resolved
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
