import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import ProtectedRoute from "./Components/ProtectedRoute";

import Home from "./pages/Home";
import RaiseIssue from "./pages/RaiseIssue";
import MapDashboard from "./pages/MapDashboard";
import MyComplaints from "./pages/MyComplaints";
import AdminDashboard from "./pages/AdminDashboard";
import AdminComplaints from "./pages/AdminComplaints";
import AdminComplaintDetail from "./pages/AdminComplaintDetail";
import ComplaintDetail from "./pages/ComplaintDetail";
import Login from "./pages/Login";
import DebugPage from "./pages/DebugPage";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";

import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import EmployeeTasks from "./pages/employee/EmployeeTasks";
import AssignedTask from "./pages/employee/AssignedTask";

function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/debug" element={<DebugPage />} />
        <Route path="/raise" element={<RaiseIssue />} />
        <Route path="/map" element={<MapDashboard />} />
        <Route path="/my-complaints" element={<MyComplaints />} />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/complaints"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminComplaints />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/complaints/:id"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminComplaintDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute requiredRole="admin">
              <AnalyticsDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/complaints/:id" element={<ComplaintDetail />} />

        {/* EMPLOYEE ROUTES */}
        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute requiredRole="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/tasks"
          element={
            <ProtectedRoute requiredRole="employee">
              <EmployeeTasks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/tasks/:id"
          element={
            <ProtectedRoute requiredRole="employee">
              <AssignedTask />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
