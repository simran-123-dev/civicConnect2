import { NavLink, useNavigate } from "react-router-dom";
import { getToken, clearToken } from "../utils/api";
import { FaBell, FaExclamationCircle } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "user";
  const isLoggedIn = Boolean(getToken());

  const handleLogout = () => {
    clearToken();
    localStorage.setItem("role", "user");
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="w-full px-12 h-24 flex items-center justify-between">

        <span className="text-3xl md:text-4xl font-semibold text-gray-800">
          CivicConnect
        </span>

        {isLoggedIn && (
          <div className="hidden md:flex bg-gray-100 rounded-full p-1 items-center gap-2">

            {role === "user" && (
              <>
                <NavLink to="/" className="px-6 py-2.5 text-gray-600 hover:text-blue-600">
                  Home
                </NavLink>

                <NavLink
                  to="/raise"
                  className="flex items-center px-6 py-2.5 text-gray-600 hover:text-blue-600"
                >
                  <FaExclamationCircle className="mr-2" />
                  Report Issue
                </NavLink>

                <NavLink to="/map" className="px-6 py-2.5 text-gray-600 hover:text-blue-600">
                  Map View
                </NavLink>

                <NavLink to="/my-complaints" className="px-6 py-2.5 text-gray-600 hover:text-blue-600">
                  My Complaints
                </NavLink>

                <NavLink
                  to="/notifications"
                  className="flex items-center px-6 py-2.5 text-gray-600 hover:text-blue-600"
                >
                  <FaBell className="mr-2" />
                  Notifications
                </NavLink>
              </>
            )}

            {role === "admin" && (
              <>
                <NavLink to="/admin" className="px-6 py-2.5 text-gray-600 hover:text-blue-600">
                  Dashboard
                </NavLink>

                <NavLink to="/admin/complaints" className="px-6 py-2.5 text-gray-600 hover:text-blue-600">
                  Complaints
                </NavLink>

                <NavLink
                  to="/admin/notifications"
                  className="flex items-center px-6 py-2.5 text-gray-600 hover:text-blue-600"
                >
                  <FaBell className="mr-2" />
                  Notifications
                </NavLink>
              </>
            )}

            {role === "employee" && (
              <>
                <NavLink to="/employee/dashboard" className="px-6 py-2.5 text-gray-600 hover:text-blue-600">
                  Employee Dashboard
                </NavLink>

                <NavLink to="/employee/tasks" className="px-6 py-2.5 text-gray-600 hover:text-blue-600">
                  My Tasks
                </NavLink>

                <NavLink
                  to="/employee/notifications"
                  className="flex items-center px-6 py-2.5 text-gray-600 hover:text-blue-600"
                >
                  <FaBell className="mr-2" />
                  Notifications
                </NavLink>
              </>
            )}
          </div>
        )}

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-blue-600 text-white px-7 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition"
          >
            Logout
          </button>
        ) : (
          <NavLink
            to="/login"
            className="bg-blue-600 text-white px-7 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition inline-block"
          >
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
