import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getComplaintById, updateComplaint } from "../utils/complaints";
import {
  getAllEmployees,
  updateComplaintOnServer,
  getUserIdByEmpId,
} from "../utils/api";

const AdminComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const complaint = getComplaintById(id);

  const [status, setStatus] = useState(complaint?.status || "Pending");
  const [remarks, setRemarks] = useState(complaint?.remarks || "");
  const [proofName, setProofName] = useState(complaint?.proofName || "");
  const [assignedTo, setAssignedTo] = useState(complaint?.assignedTo || "");
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const list = await getAllEmployees();
      setEmployees(list);
    };
    fetchEmployees();
  }, []);

  const handleSave = async () => {
    const updates = {
      status,
      remarks,
      proofName,
      assignedTo,
      updatedAt: new Date().toISOString(),
    };

    updateComplaint(id, updates);
    await updateComplaintOnServer(id, updates);
    navigate("/admin/complaints");
  };

  if (!complaint) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-semibold">Complaint not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-10">

        {/* Header */}
        <div className="mb-8 border-b pb-6">
          <h1 className="text-3xl font-bold text-[#0A2540] mb-2">
            Complaint #{id}
          </h1>
          <p className="text-gray-600">
            <span className="font-semibold">{complaint.title}</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            📍 {complaint.locationText || "-"} | 🏷 {complaint.category || "General"}
          </p>
        </div>

        {/* Status */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option>Pending</option>
            <option>Assigned</option>
            <option>In Progress</option>
            <option>Resolved</option>
            <option>Unresolved</option>
          </select>
        </div>

        {/* Assign */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Assign to Employee
          </label>
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">-- Select Employee --</option>
            {employees.map((emp) => (
              <option key={emp.id || emp._id} value={emp.id || emp._id}>
                {emp.name} ({emp.department || "Dept"})
              </option>
            ))}
          </select>
        </div>

        {/* Remarks */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Admin Remarks
          </label>
          <textarea
            rows="4"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            placeholder="Enter remarks..."
          />
        </div>

        {/* File */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Upload Proof
          </label>
          <input
            type="file"
            onChange={(e) =>
              setProofName(e.target.files?.[0]?.name || "")
            }
            className="block w-full text-sm text-gray-500"
          />
          {proofName && (
            <p className="text-sm text-gray-500 mt-2">
              Selected: {proofName}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-8 py-3 rounded-full bg-[#2EC4B6] text-[#0A2540] font-semibold hover:scale-105 transition"
          >
            Save Update
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminComplaintDetail;
