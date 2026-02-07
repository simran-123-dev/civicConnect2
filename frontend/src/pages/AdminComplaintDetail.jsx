import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getComplaintById, updateComplaint } from "../utils/complaints";
import { getAllEmployees, updateComplaintOnServer, getUserIdByEmpId } from "../utils/api";

const AdminComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // derive complaint synchronously to avoid setState inside effects
  const complaint = getComplaintById(id);

  const [status, setStatus] = useState(complaint?.status || "Pending");
  const [remarks, setRemarks] = useState(complaint?.remarks || "");
  const [proofName, setProofName] = useState(complaint?.proofName || "");
  const [assignedTo, setAssignedTo] = useState(complaint?.assignedTo || "");
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const empList = await getAllEmployees();
        setEmployees(empList);
      } catch (error) {
        console.error("Failed to load employees:", error);
      } finally {
        setLoadingEmployees(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleSave = async () => {
    const localUpdates = {
      status,
      remarks,
      proofName,
      assignedTo,
      updatedAt: new Date().toISOString(),
    };

    console.log("🔍 DEBUG: Saving complaint #" + id);
    console.log("📋 Local updates:", localUpdates);

    // Save to localStorage (offline fallback) using empId value so employees can match locally
    const saved = updateComplaint(id, localUpdates);
    console.log("💾 Saved to localStorage:", saved);

    // Prepare server-side updates: convert assignedTo (empId) into employee _id when possible
    let serverAssignedTo = assignedTo;
    try {
      const found = employees.find((e) => (e.empId || e._id) === assignedTo || String(e._id) === String(assignedTo));
      if (found && found._id) {
        serverAssignedTo = found._id;
      } else if (assignedTo && !String(assignedTo).match(/^[0-9a-fA-F]{24}$/)) {
        // ask backend for mapping by empId if frontend list didn't contain the mapping
        try {
          const res = await getUserIdByEmpId(assignedTo);
          if (res && res._id) serverAssignedTo = res._id;
        } catch (mapErr) {
          console.warn("No server mapping for empId", assignedTo, mapErr);
        }
      }
    } catch (e) {
      // ignore
    }

    const serverUpdates = {
      status,
      remarks,
      proofName,
      assignedTo: serverAssignedTo,
      updatedAt: new Date().toISOString(),
    };

    // Also try to sync with server using employee _id so backend queries (by _id) will work
    try {
      await updateComplaintOnServer(id, serverUpdates);
      console.log("✅ Synced update to server (assignedTo -> _id):", serverAssignedTo);
    } catch (err) {
      console.error("Failed to sync with server:", err);
    }

    navigate("/admin/complaints");
  };

  if (!complaint) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] px-6 py-20">
        <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-sm">
          <h1 className="text-2xl font-semibold text-[#0A2540]">
            Complaint not found
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-6 py-20">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-sm">

        <h1 className="text-3xl font-semibold text-[#0A2540] mb-6">
          Complaint #{id}
        </h1>

        <p className="text-gray-600 mb-6">
          Issue: <strong>{complaint.title}</strong> <br />
          Location: {complaint.locationText || complaint.location || "-"} <br />
          Category: {complaint.category || "General"}
        </p>

        {/* STATUS UPDATE */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Update Status
          </label>
          <select
            className="w-full border rounded-lg px-4 py-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
        </div>

        {/* ASSIGN TO EMPLOYEE */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Assign to Employee
          </label>
          {loadingEmployees ? (
            <p className="text-gray-500 text-sm italic">Loading employees...</p>
          ) : employees.length === 0 ? (
            <p className="text-red-500 text-sm italic">No employees available</p>
          ) : (
            <>
              <select
                className="w-full border rounded-lg px-4 py-2 bg-white"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              >
                <option value="">-- Select an Employee --</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp.empId || emp._id}>
                    {emp.name} ({emp.empId}) - {emp.department}
                  </option>
                ))}
              </select>
              {assignedTo && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ Assigned to: <strong>{employees.find((e) => (e.empId || e._id) === assignedTo)?.name}</strong>
                </p>
              )}
            </>
          )}
        </div>

        {/* REMARKS */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Admin Remarks
          </label>
          <textarea
            rows="3"
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Action taken..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>

        {/* PROOF */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">
            Upload Proof
          </label>
          <input
            type="file"
            onChange={(e) =>
              setProofName(e.target.files?.[0]?.name || "")
            }
          />
          {proofName && (
            <p className="text-sm text-gray-500 mt-2">{proofName}</p>
          )}
        </div>

        <button
          onClick={handleSave}
          className="bg-[#2EC4B6] text-[#0A2540] px-8 py-3 rounded-full font-medium"
        >
          Save Update
        </button>

      </div>
    </div>
  );
};

export default AdminComplaintDetail;
