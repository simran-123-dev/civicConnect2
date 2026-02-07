import { NavLink, useNavigate } from "react-router-dom";
import { getToken, clearToken } from "../utils/api";
import { FaBell, FaExclamationCircle } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();

  // Direct values from storage (no state, no effect)
  const role = localStorage.getItem("role") || "user";
  const isLoggedIn = Boolean(getToken());

  const handleLogout = () => {
    clearToken();
    localStorage.setItem("role", "user");
    navigate("/login");
    window.location.reload(); // ensures navbar updates
  };

  return (
    <nav className="sticky top-0 z-50 bg-linear-to-r from-[#0A2540] to-[#0F3D5E]">
      <div className="w-full px-12 h-24 flex items-center justify-between">

        <span className="text-3xl md:text-4xl font-semibold text-white">
          CivicConnect
        </span>

        {isLoggedIn && (
          <div className="hidden md:flex bg-white/10 backdrop-blur-md rounded-full p-1 items-center gap-2">

            {role === "user" && (
              <>
                <NavLink to="/" className="px-6 py-2.5 text-gray-200 hover:text-white">
                  Home
                </NavLink>

                <NavLink
                  to="/raise"
                  className="flex items-center px-6 py-2.5 text-gray-200 hover:text-white"
                >
                  <FaExclamationCircle className="mr-2" />
                  Report Issue
                </NavLink>

                <NavLink to="/map" className="px-6 py-2.5 text-gray-200 hover:text-white">
                  Map View
                </NavLink>

                <NavLink to="/my-complaints" className="px-6 py-2.5 text-gray-200 hover:text-white">
                  My Complaints
                </NavLink>

                <NavLink
                  to="/notifications"
                  className="flex items-center px-6 py-2.5 text-gray-200 hover:text-white"
                >
                  <FaBell className="mr-2" />
                  Notifications
                </NavLink>
              </>
            )}

            {role === "admin" && (
              <>
                <NavLink to="/admin" className="px-6 py-2.5 text-gray-200 hover:text-white">
                  Dashboard
                </NavLink>

                <NavLink to="/admin/complaints" className="px-6 py-2.5 text-gray-200 hover:text-white">
                  Complaints
                </NavLink>

                <NavLink
                  to="/admin/notifications"
                  className="flex items-center px-6 py-2.5 text-gray-200 hover:text-white"
                >
                  <FaBell className="mr-2" />
                  Notifications
                </NavLink>
              </>
            )}
            {role === "employee" && (
              <>
                <NavLink to="/employee/dashboard" className="px-6 py-2.5 text-gray-200 hover:text-white">
                  Employee Dashboard
                </NavLink>

                <NavLink to="/employee/tasks" className="px-6 py-2.5 text-gray-200 hover:text-white">
                  My Tasks
                </NavLink>

                <NavLink
                  to="/employee/notifications"
                  className="flex items-center px-6 py-2.5 text-gray-200 hover:text-white"
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
            className="bg-white text-[#0A2540] px-7 py-3 rounded-full text-lg font-semibold hover:opacity-90"
          >
            Logout
          </button>
        ) : (
          <NavLink
            to="/login"
            className="bg-white text-[#2EC4B6] px-7 py-3 rounded-full text-lg font-semibold hover:opacity-90 inline-block"
          >
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
