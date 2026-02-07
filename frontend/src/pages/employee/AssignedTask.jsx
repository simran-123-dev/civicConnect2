import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  getEmployeeTask, 
  updateTaskStatus, 
  updateEmployeeLocation 
} from "../../utils/api";

const AssignedTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [statusNotes, setStatusNotes] = useState("");
  const [actualHours, setActualHours] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const taskData = await getEmployeeTask(id);
        setTask(taskData);
        setActualHours(taskData.actualHours || "");
      } catch (error) {
        console.error("Failed to fetch task:", error);
        alert("Failed to load task details");
        navigate("/employee/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
    getCurrentLocation();
  }, [id, navigate]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!statusNotes.trim() && (newStatus === "Completed" || newStatus === "Unresolved")) {
      alert("Please provide notes for completion or unresolved status");
      return;
    }

    try {
      setUpdating(true);
      const updatedTask = await updateTaskStatus(
        id, 
        newStatus, 
        statusNotes, 
        currentLocation,
        actualHours ? parseFloat(actualHours) : null
      );
      
      setTask(updatedTask);
      setStatusNotes("");
      
      if (newStatus === "Completed" || newStatus === "Unresolved") {
        alert(`Task marked as ${newStatus.toLowerCase()}`);
        navigate("/employee/dashboard");
      }
    } catch (error) {
      console.error("Failed to update task status:", error);
      alert("Failed to update task status");
    } finally {
      setUpdating(false);
    }
  };

  const updateLocationManually = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          await updateEmployeeLocation(latitude, longitude, `Location update for task: ${task.title}`);
          setCurrentLocation({ lat: latitude, lng: longitude });
          alert("Location updated successfully!");
        } catch (error) {
          console.error("Failed to update location:", error);
          alert("Failed to update location");
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Failed to get location");
        setLocationLoading(false);
      }
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Assigned": return "bg-blue-100 text-blue-800";
      case "In Progress": return "bg-yellow-100 text-yellow-800";
      case "Completed": return "bg-green-100 text-green-800";
      case "On Hold": return "bg-gray-100 text-gray-800";
      case "Unresolved": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical": return "border-l-red-500 bg-red-50";
      case "High": return "border-l-orange-500 bg-orange-50";
      case "Medium": return "border-l-yellow-500 bg-yellow-50";
      case "Low": return "border-l-green-500 bg-green-50";
      default: return "border-l-gray-500 bg-gray-50";
    }
  };

  const openMapLocation = () => {
    if (task?.targetLocation?.lat && task?.targetLocation?.lng) {
      const url = `https://maps.google.com/maps?q=${task.targetLocation.lat},${task.targetLocation.lng}`;
      window.open(url, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading task details...</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Task Not Found</h2>
          <button
            onClick={() => navigate("/employee/dashboard")}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/employee/dashboard")}
            className="mb-4 flex items-center text-blue-600 hover:text-blue-700"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-[#0A2540]">Task Details</h1>
        </div>

        {/* Task Card */}
        <div className={`bg-white rounded-lg shadow-lg border-l-4 ${getPriorityColor(task.priority)} mb-6`}>
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-[#0A2540] mb-2">{task.title}</h2>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                  <span className="text-sm text-gray-600">Priority: {task.priority}</span>
                  <span className="text-sm text-gray-600">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Task Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Task Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Description</label>
                    <p className="text-gray-800">{task.description}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Assigned By</label>
                    <p className="text-gray-800">{task.assignedBy?.name} ({task.assignedBy?.email})</p>
                  </div>
                  
                  <div className="flex space-x-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Estimated Hours</label>
                      <p className="text-gray-800">{task.estimatedHours}h</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Actual Hours</label>
                      <input
                        type="number"
                        value={actualHours}
                        onChange={(e) => setActualHours(e.target.value)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded"
                        step="0.5"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Location</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Target Location</label>
                    <p className="text-gray-800">{task.targetLocation?.address}</p>
                    {task.targetLocation?.lat && task.targetLocation?.lng && (
                      <button
                        onClick={openMapLocation}
                        className="mt-1 text-blue-600 hover:text-blue-700 text-sm"
                      >
                        📍 View on Map
                      </button>
                    )}
                  </div>
                  
                  <div>
                    <button
                      onClick={updateLocationManually}
                      disabled={locationLoading}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                    >
                      {locationLoading ? "Updating..." : "Update My Location"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Complaint Details */}
            {task.complaintId && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Related Complaint</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800">{task.complaintId.title}</h4>
                  <p className="text-gray-600 mt-1">{task.complaintId.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    📍 {task.complaintId.locationText}
                  </p>
                </div>
              </div>
            )}

            {/* Work Log */}
            {task.workLog && task.workLog.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Work Log</h3>
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {task.workLog.map((log, index) => (
                    <div key={index} className="flex items-center space-x-3 text-sm">
                      <span className="text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(log.action)}`}>
                        {log.action}
                      </span>
                      {log.notes && <span className="text-gray-600">{log.notes}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Update Section */}
        {task.status !== "Completed" && task.status !== "Unresolved" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Update Task Status</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Notes (required for completion/unresolved)
              </label>
              <textarea
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Add notes about your work or completion status..."
              />
            </div>

            <div className="flex flex-wrap gap-3">
              {task.status === "Assigned" && (
                <button
                  onClick={() => handleStatusUpdate("In Progress")}
                  disabled={updating}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
                >
                  {updating ? "Updating..." : "Start Work"}
                </button>
              )}
              
              {task.status === "In Progress" && (
                <>
                  <button
                    onClick={() => handleStatusUpdate("On Hold")}
                    disabled={updating}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                  >
                    {updating ? "Updating..." : "Put on Hold"}
                  </button>
                  
                  <button
                    onClick={() => handleStatusUpdate("Completed")}
                    disabled={updating}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    {updating ? "Updating..." : "Mark Complete"}
                  </button>
                  
                  <button
                    onClick={() => handleStatusUpdate("Unresolved")}
                    disabled={updating}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {updating ? "Updating..." : "Mark Unresolved"}
                  </button>
                </>
              )}
              
              {task.status === "On Hold" && (
                <button
                  onClick={() => handleStatusUpdate("In Progress")}
                  disabled={updating}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
                >
                  {updating ? "Updating..." : "Resume Work"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Completion Notes */}
        {task.completionNotes && (
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Completion Notes</h3>
            <p className="text-gray-600">{task.completionNotes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedTask;