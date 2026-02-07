import { Navigate } from "react-router-dom";
import { getToken } from "../utils/api";

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = getToken();
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
