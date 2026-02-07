import React, { useState, useEffect } from "react";
import { 
  getEmployeeTasks, 
  getEmployeeDashboardStats, 
  updateEmployeeLocation, 
  toggleDutyStatus 
} from "../../utils/api";

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [isOnDuty, setIsOnDuty] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchDashboardData();
  }, [filter]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [tasksData, statsData] = await Promise.all([
        getEmployeeTasks(filter === "all" ? null : filter),
        getEmployeeDashboardStats(),
      ]);
      
      setTasks(tasksData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDutyToggle = async () => {
    try {
      const newDutyStatus = !isOnDuty;
      await toggleDutyStatus(newDutyStatus);
      setIsOnDuty(newDutyStatus);
    } catch (error) {
      console.error("Failed to toggle duty status:", error);
    }
  };

  const updateLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          await updateEmployeeLocation(latitude, longitude, "Location updated from dashboard");
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
      case "Critical": return "bg-red-500";
      case "High": return "bg-orange-500";
      case "Medium": return "bg-yellow-500";
      case "Low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A2540] mb-4">Employee Dashboard</h1>
          
          {/* Duty Status Toggle */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDutyToggle}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  isOnDuty
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {isOnDuty ? "On Duty" : "Off Duty"}
              </button>
            </div>
            
            <button
              onClick={updateLocation}
              disabled={locationLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {locationLoading ? "Updating..." : "Update Location"}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Tasks</h3>
            <p className="text-2xl font-bold text-[#0A2540]">{stats.totalTasks || 0}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Pending</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.pendingTasks || 0}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
            <p className="text-2xl font-bold text-yellow-600">{stats.inProgressTasks || 0}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Completed</h3>
            <p className="text-2xl font-bold text-green-600">{stats.completedTasks || 0}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Unresolved</h3>
            <p className="text-2xl font-bold text-red-600">{stats.unresolvedTasks || 0}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Overdue</h3>
            <p className="text-2xl font-bold text-orange-600">{stats.overdueTasks || 0}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg w-fit">
            {["all", "Assigned", "In Progress", "Completed", "On Hold", "Unresolved"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === status
                    ? "bg-white text-[#0A2540] shadow-sm"
                    : "text-gray-600 hover:text-[#0A2540]"
                }`}
              >
                {status === "all" ? "All Tasks" : status}
              </button>
            ))}
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-500">No tasks found.</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task._id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-[#0A2540]">
                        {task.title}
                      </h3>
                      
                      {/* Priority Indicator */}
                      <div className="flex items-center space-x-1">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                        <span className="text-sm text-gray-600">{task.priority}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{task.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span>📍 {task.targetLocation?.address || "Location not specified"}</span>
                      <span>📅 Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      <span>⏱️ Est: {task.estimatedHours}h</span>
                      {task.actualHours > 0 && (
                        <span>✅ Actual: {task.actualHours}h</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    
                    <a
                      href={`/employee/tasks/${task._id}`}
                      className="px-4 py-2 bg-[#0A2540] text-white rounded-lg hover:bg-[#0f3059] transition-colors text-sm"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;