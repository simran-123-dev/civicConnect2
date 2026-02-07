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
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-6">
      <div className="bg-white w-full max-w-md p-10 rounded-2xl shadow-sm">
        <h2 className="text-3xl font-semibold text-[#0A2540] mb-2">
          {isSignup ? "Create Account" : "Welcome back"}
        </h2>
        <p className="text-gray-500 mb-8">
          {isSignup
            ? "Sign up to report and track civic issues"
            : "Login to report and track civic issues"}
        </p>

        {/* USER TYPE SELECTOR */}
        <div className="flex gap-4 mb-6">
          <button
            type="button"
            onClick={() => {
              setUserType("user");
              setForm({ ...form, adminKey: "", empId: "", department: "" });
              setError("");
            }}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              userType === "user"
                ? "bg-[#2EC4B6] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Citizen
          </button>

          <button
            type="button"
            onClick={() => {
              setUserType("employee");
              setError("");
            }}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              userType === "employee"
                ? "bg-[#2EC4B6] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Employee
          </button>

          <button
            type="button"
            onClick={() => {
              setUserType("admin");
              setError("");
            }}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              userType === "admin"
                ? "bg-[#2EC4B6] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Admin
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Full name"
                required
                onChange={handleChange}
                value={form.name}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="user@email.com"
              required
              onChange={handleChange}
              value={form.email}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                required
                onChange={handleChange}
                value={form.password}
                className="w-full border rounded-lg px-4 py-2 pr-12 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {isSignup && userType === "admin" && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">
                  Town/Area
                </label>
                <select
                  name="town"
                  onChange={handleChange}
                  value={form.town}
                  required
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none"
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
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">
                  Admin Key
                </label>
                <div className="relative">
                  <input
                    type={showAdminKey ? "text" : "password"}
                    name="adminKey"
                    placeholder="Enter admin registration key"
                    required
                    onChange={handleChange}
                    value={form.adminKey}
                    className="w-full border rounded-lg px-4 py-2 pr-12 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminKey(!showAdminKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showAdminKey ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
            </>
          )}

          {isSignup && userType === "employee" && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Employee ID
                </label>
                <input
                  type="text"
                  name="empId"
                  placeholder="EMP-1001"
                  required
                  onChange={handleChange}
                  value={form.empId}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  placeholder="Roads"
                  required
                  onChange={handleChange}
                  value={form.department}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none"
                />
              </div>
            </>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2EC4B6] text-[#0A2540] py-3 rounded-full font-medium hover:opacity-90 disabled:opacity-50"
          >
            {loading
              ? "Loading..."
              : isSignup
              ? `Sign up as ${userType}`
              : "Login"}
          </button>
        </form>

        {/* TOGGLE SIGNUP/LOGIN */}
        <div className="mt-6 text-center">
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
            className="text-[#2EC4B6] font-medium hover:underline"
          >
            {isSignup
              ? "Already have an account? Login"
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
