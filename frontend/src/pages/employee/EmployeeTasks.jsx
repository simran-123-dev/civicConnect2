import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getEmployeeTasks } from "../../utils/api";

const EmployeeTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const tasksData = await getEmployeeTasks(filter === "all" ? null : filter);
        setTasks(tasksData);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [filter]);

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
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A2540] mb-4">My Tasks</h1>
          
          {/* Filter Tabs */}
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

        {/* Tasks Grid */}
        <div className="grid gap-6">
          {tasks.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-500">No tasks found.</p>
            </div>
          ) : (
            tasks.map((task) => {
              // handle both database _id and localStorage id
              const taskId = task._id || task.id;
              const taskTitle = task.title || "Unnamed Task";
              const taskDescription = task.description || "";
              const taskStatus = task.status || "Assigned";
              const taskPriority = task.priority || "Medium";
              const taskDueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date";
              const taskLocation = task.targetLocation?.address || task.locationText || "Location not specified";
              const taskEstHours = task.estimatedHours || 0;
              const taskActualHours = task.actualHours || 0;
              const taskAssignedBy = task.assignedBy?.name || "Admin";

              return (
              <div key={taskId} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-[#0A2540]">
                          {taskTitle}
                        </h3>
                        
                        {/* Priority Indicator */}
                        <div className="flex items-center space-x-1">
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(taskPriority)}`}></div>
                          <span className="text-sm text-gray-600">{taskPriority}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-3 line-clamp-2">{taskDescription}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span>📍 {taskLocation}</span>
                        <span>📅 Due: {taskDueDate}</span>
                        <span>⏱️ Est: {taskEstHours}h</span>
                        {taskActualHours > 0 && (
                          <span>✅ Actual: {taskActualHours}h</span>
                        )}
                        <span>👤 Assigned by: {taskAssignedBy}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(taskStatus)}`}>
                        {taskStatus}
                      </span>
                      
                      <Link
                        to={`/employee/tasks/${taskId}`}
                        className="px-4 py-2 bg-[#0A2540] text-white rounded-lg hover:bg-[#0f3059] transition-colors text-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
                
                {/* Task Progress Bar */}
                <div className="px-6 pb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        taskStatus === "Completed" ? "bg-green-500" :
                        taskStatus === "In Progress" ? "bg-yellow-500" :
                        taskStatus === "Assigned" ? "bg-blue-500" :
                        taskStatus === "Unresolved" ? "bg-red-500" :
                        "bg-gray-400"
                      }`}
                      style={{
                        width: taskStatus === "Completed" ? "100%" :
                               taskStatus === "In Progress" ? "60%" :
                               taskStatus === "Assigned" ? "20%" :
                               taskStatus === "Unresolved" ? "90%" : "0%"
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeTasks;