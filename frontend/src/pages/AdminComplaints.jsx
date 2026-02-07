import { Link } from "react-router-dom";
import { getComplaints } from "../utils/complaints";

const statusStyle = {
  Pending: "text-red-600",
  "In Progress": "text-yellow-600",
  Resolved: "text-green-600",
};

const AdminComplaints = () => {
  const complaints = getComplaints();

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-6 py-20">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-semibold text-[#0A2540] mb-10">
          All Complaints
        </h1>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th className="p-4">Issue</th>
                <th className="p-4">Area</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {complaints.length === 0 && (
                <tr className="border-t">
                  <td className="p-4 text-gray-500" colSpan="4">
                    No complaints available.
                  </td>
                </tr>
              )}
              {complaints.map(c => (
                <tr key={c.id} className="border-t">
                  <td className="p-4">{c.title}</td>
                  <td className="p-4">{c.locationText || c.location || "-"}</td>
                  <td className={`p-4 font-medium ${statusStyle[c.status]}`}>
                    {c.status}
                  </td>
                  <td className="p-4">
                    <Link
                      to={`/admin/complaints/${c.id}`}
                      className="text-[#2EC4B6] font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default AdminComplaints;
