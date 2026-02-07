import React, { useState } from "react";

const DebugPage = () => {
  const [localData, setLocalData] = useState({});
  const [refresh, setRefresh] = useState(0);

  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");
    const userEmail = localStorage.getItem("userEmail");
    const empId = localStorage.getItem("empId");
    const department = localStorage.getItem("department");
    const complaints = JSON.parse(localStorage.getItem("cc_complaints") || "[]");
    const employeeLocation = JSON.parse(localStorage.getItem("employee_location") || "{}");

    setLocalData({
      user,
      token: token ? `${token.substring(0, 20)}...` : null,
      role,
      userId,
      userEmail,
      empId,
      department,
      complaintsCount: complaints.length,
      complaints: complaints.slice(0, 5), // first 5
      employeeLocation,
      allKeys: Object.keys(localStorage),
    });
  }, []);

  const handleRefresh = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");
    const userEmail = localStorage.getItem("userEmail");
    const empId = localStorage.getItem("empId");
    const department = localStorage.getItem("department");
    const complaints = JSON.parse(localStorage.getItem("cc_complaints") || "[]");
    const employeeLocation = JSON.parse(localStorage.getItem("employee_location") || "{}");

    setLocalData({
      user,
      token: token ? `${token.substring(0, 20)}...` : null,
      role,
      userId,
      userEmail,
      empId,
      department,
      complaintsCount: complaints.length,
      complaints: complaints.slice(0, 5), // first 5
      employeeLocation,
      allKeys: Object.keys(localStorage),
    });
    setRefresh(refresh + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-[#0A2540] mb-6">Debug Page</h1>
        <p className="text-gray-600 mb-6">View and inspect localStorage data for debugging.</p>

        <button
          onClick={handleRefresh}
          className="mb-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Refresh Data
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Auth Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-[#0A2540] mb-4">Auth Info</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium">Token:</span>
                <p className="text-gray-600 break-all">{localData.token || "Not set"}</p>
              </div>
              <div>
                <span className="font-medium">Role:</span>
                <p className="text-gray-600">{localData.role || "Not set"}</p>
              </div>
              <div>
                <span className="font-medium">User ID:</span>
                <p className="text-gray-600">{localData.userId || "Not set"}</p>
              </div>
              <div>
                <span className="font-medium">Email:</span>
                <p className="text-gray-600">{localData.userEmail || "Not set"}</p>
              </div>
            </div>
          </div>

          {/* Employee Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-[#0A2540] mb-4">Employee Info</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium">Emp ID:</span>
                <p className="text-gray-600">{localData.empId || "Not set"}</p>
              </div>
              <div>
                <span className="font-medium">Department:</span>
                <p className="text-gray-600">{localData.department || "Not set"}</p>
              </div>
              <div>
                <span className="font-medium">Location (Last Updated):</span>
                <p className="text-gray-600 text-xs">
                  {localData.employeeLocation.updatedAt
                    ? `Lat: ${localData.employeeLocation.lat}, Lng: ${localData.employeeLocation.lng}`
                    : "Not set"}
                </p>
                <p className="text-gray-500 text-xs">
                  {localData.employeeLocation.updatedAt || ""}
                </p>
              </div>
            </div>
          </div>

          {/* Complaints Summary */}
          <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
            <h2 className="text-xl font-semibold text-[#0A2540] mb-4">
              Complaints ({localData.complaintsCount || 0} total)
            </h2>
            {localData.complaints && localData.complaints.length > 0 ? (
              <div className="space-y-3 text-sm">
                {localData.complaints.map((c, idx) => (
                  <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2">
                    <p className="font-medium">#{c.id}: {c.title}</p>
                    <p className="text-gray-600">Status: {c.status}</p>
                    <p className="text-gray-600">Assigned To: {c.assignedTo || "Unassigned"}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No complaints in localStorage.</p>
            )}
          </div>

          {/* All Storage Keys */}
          <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
            <h2 className="text-xl font-semibold text-[#0A2540] mb-4">All localStorage Keys</h2>
            <div className="flex flex-wrap gap-2">
              {localData.allKeys && localData.allKeys.length > 0 ? (
                localData.allKeys.map((key) => (
                  <span
                    key={key}
                    className="bg-gray-100 px-3 py-1 rounded-full text-xs font-mono"
                  >
                    {key}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No keys found.</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> This page displays localStorage data for debugging purposes only. 
            It's intended for development and troubleshooting.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
