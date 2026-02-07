import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register, setToken } from "../utils/api";

const Login = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("user");
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminKey, setShowAdminKey] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    adminKey: "",
    town: "",
    empId: "",
    department: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let response;
      if (isSignup) {
        response = await register(
          form.name,
          form.email,
          form.password,
          userType,
          form.adminKey,
          form.town,
          form.empId,
          form.department
        );
      } else {
        response = await login(form.email, form.password);
      }

      setToken(response.token);
      localStorage.setItem("role", response.user.role);
      localStorage.setItem("userId", response.user.id);
      localStorage.setItem("userName", response.user.name);
      localStorage.setItem("userEmail", response.user.email);
      if (response.user.town) {
        localStorage.setItem("town", response.user.town);
      }
      if (response.user.empId) {
        localStorage.setItem("empId", response.user.empId);
      }
      if (response.user.department) {
        localStorage.setItem("department", response.user.department);
      }
      navigate("/");
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0A2540] via-[#0F3D5E] to-[#2EC4B6] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4">
            <span className="text-3xl">🏛️</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">CivicConnect</h1>
          <p className="text-white/60">Report, Track & Resolve Civic Issues</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8">
            {/* Header */}
            <h2 className="text-2xl font-bold text-[#0A2540] mb-1">
              {isSignup ? "Create Your Account" : "Welcome Back"}
            </h2>
            <p className="text-gray-600 text-sm mb-8">
              {isSignup
                ? "Join us and help improve your community"
                : "Continue your civic contribution"}
            </p>

            {/* USER TYPE SELECTOR */}
            <div className="flex gap-3 mb-8 bg-gray-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setUserType("user");
                  setForm({ ...form, adminKey: "", empId: "", department: "" });
                  setError("");
                }}
                className={`flex-1 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                  userType === "user"
                    ? "bg-white text-[#2EC4B6] shadow-lg scale-105"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                👤 Citizen
              </button>

              <button
                type="button"
                onClick={() => {
                  setUserType("employee");
                  setError("");
                }}
                className={`flex-1 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                  userType === "employee"
                    ? "bg-white text-[#2EC4B6] shadow-lg scale-105"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                👷 Employee
              </button>

              <button
                type="button"
                onClick={() => {
                  setUserType("admin");
                  setError("");
                }}
                className={`flex-1 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                  userType === "admin"
                    ? "bg-white text-[#2EC4B6] shadow-lg scale-105"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                🔐 Admin
              </button>
            </div>

            {/* FORM */}
<form onSubmit={handleSubmit} className="space-y-5">
              {isSignup && (
                <div className="group">
                  <label className="flex text-sm font-semibold text-gray-700 mb-2.5 items-center">
                    <span>👤 Full Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    required
                    onChange={handleChange}
                    value={form.name}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#2EC4B6] focus:bg-blue-50/20 transition-all duration-300"
                  />
                </div>
              )}

              <div className="group">
                <label className="flex text-sm font-semibold text-gray-700 mb-2.5 items-center">
                  <span>✉️ Email Address</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  onChange={handleChange}
                  value={form.email}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#2EC4B6] focus:bg-blue-50/20 transition-all duration-300"
                />
              </div>

              <div className="group">
                <label className="flex text-sm font-semibold text-gray-700 mb-2.5 items-center">
                  <span>🔒 Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    required
                    onChange={handleChange}
                    value={form.password}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-[#2EC4B6] focus:bg-blue-50/20 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              {isSignup && userType === "admin" && (
                <>
                  <div className="group">
                    <label className="flex text-sm font-semibold text-gray-700 mb-2.5 items-center">
                      <span>📍 Town/Area</span>
                    </label>
                    <select
                      name="town"
                      onChange={handleChange}
                      value={form.town}
                      required
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#2EC4B6] focus:bg-blue-50/20 transition-all duration-300 bg-white"
                    >
                      <option value="">Select your town</option>
                      <option value="Downtown">Downtown</option>
                      <option value="Uptown">Uptown</option>
                      <option value="Midtown">Midtown</option>
                      <option value="Suburbs">Suburbs</option>
                      <option value="East Side">East Side</option>
                      <option value="West Side">West Side</option>
                    </select>
                  </div>
                  <div className="group">
                    <label className="flex text-sm font-semibold text-gray-700 mb-2.5 items-center">
                      <span>🔐 Admin Key</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showAdminKey ? "text" : "password"}
                        name="adminKey"
                        placeholder="Enter admin key"
                        required
                        onChange={handleChange}
                        value={form.adminKey}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-[#2EC4B6] focus:bg-blue-50/20 transition-all duration-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminKey(!showAdminKey)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showAdminKey ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {isSignup && userType === "employee" && (
                <>
                  <div className="group">
                    <label className="flex text-sm font-semibold text-gray-700 mb-2.5 items-center">
                      <span>🏷️ Employee ID</span>
                    </label>
                    <input
                      type="text"
                      name="empId"
                      placeholder="EMP-1001"
                      required
                      onChange={handleChange}
                      value={form.empId}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#2EC4B6] focus:bg-blue-50/20 transition-all duration-300"
                    />
                  </div>
                  <div className="group">
                    <label className="flex text-sm font-semibold text-gray-700 mb-2.5 items-center">
                      <span>🏢 Department</span>
                    </label>
                    <input
                      type="text"
                      name="department"
                      placeholder="e.g., Roads, Lighting, Sanitation"
                      required
                      onChange={handleChange}
                      value={form.department}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#2EC4B6] focus:bg-blue-50/20 transition-all duration-300"
                    />
                  </div>
                </>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl text-sm font-medium flex items-start gap-3">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-linear-to-r from-[#2EC4B6] to-[#1fa39a] text-white py-3.5 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="inline-block animate-spin">⏳</span>
                    Loading...
                  </>
                ) : isSignup ? (
                  <>
                    <span>✨</span>
                    Sign up as {userType}
                  </>
                ) : (
                  <>
                    <span>🔓</span>
                    Login
                  </>
                )}
          </button>
        </form>

            {/* TOGGLE SIGNUP/LOGIN */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-700 text-sm mb-4">
                {isSignup
                  ? "Already have an account?"
                  : "Don't have an account?"}
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsSignup(!isSignup);
                  setError("");
                  setForm({
                    name: "",
                    email: "",
                    password: "",
                    adminKey: "",
                    town: "",
                    empId: "",
                    department: "",
                  });
                }}
                className="text-[#2EC4B6] font-bold text-lg hover:text-[#1fa39a] transition-colors"
              >
                {isSignup ? "Login" : "Sign up"}
              </button>
            </div>
          </div>

          {/* DEMO CREDENTIALS */}
          {!isSignup && (
            <div className="bg-linear-to-r from-blue-50 to-cyan-50 px-8 py-6 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-700 mb-3 flex items-center gap-2">
                <span>📋</span> Demo Credentials (for testing)
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center bg-white/60 px-3 py-2 rounded-lg hover:bg-white transition-colors">
                  <div>
                    <p className="font-semibold text-gray-800">Admin</p>
                    <p className="text-gray-600">admin@example.com / admin123</p>
                  </div>
                  <span>👑</span>
                </div>
                <div className="flex justify-between items-center bg-white/60 px-3 py-2 rounded-lg hover:bg-white transition-colors">
                  <div>
                    <p className="font-semibold text-gray-800">Employee</p>
                    <p className="text-gray-600">employee@example.com / admin123</p>
                  </div>
                  <span>👷</span>
                </div>
                <div className="flex justify-between items-center bg-white/60 px-3 py-2 rounded-lg hover:bg-white transition-colors">
                  <div>
                    <p className="font-semibold text-gray-800">Citizen</p>
                    <p className="text-gray-600">citizen@example.com / admin123</p>
                  </div>
                  <span>👤</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-white/60 text-xs mt-6">
          © 2026 CivicConnect. Building Better Communities Together.
        </p>
      </div>
    </div>
  );
};

export default Login;
