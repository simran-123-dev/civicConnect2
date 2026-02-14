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

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    identifier: "",
    password: "",
    adminKey: "",
    town: "",
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
          form.phone,
          form.password,
          userType,
          form.adminKey,
          form.town,
          form.department
        );
      } else {
        response = await login(form.identifier, form.password);
      }

      setToken(response.token);
      localStorage.setItem("role", response.user.role);
      localStorage.setItem("userId", response.user.id);
      localStorage.setItem("empId", response.user.empId || "");
      localStorage.setItem("userName", response.user.name);
      localStorage.setItem("userEmail", response.user.email);

      navigate("/");
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md border border-gray-100 p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">CivicConnect</h1>
          <p className="text-gray-500 text-sm mt-1">
            Report, Track & Resolve Civic Issues
          </p>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {isSignup ? "Create Account" : "Login"}
        </h2>

        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
          {["user", "employee", "admin"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setUserType(type)}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                userType === type
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600"
              }`}
            >
              {type === "user"
                ? "Citizen"
                : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {isSignup && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                required
                onChange={handleChange}
                value={form.name}
                className="w-full border rounded-md px-3 py-2"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                onChange={handleChange}
                value={form.email}
                className="w-full border rounded-md px-3 py-2"
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                required
                onChange={handleChange}
                value={form.phone}
                className="w-full border rounded-md px-3 py-2"
              />
            </>
          )}

          {!isSignup && (
            <input
              type="text"
              name="identifier"
              placeholder="Email / Phone / Employee ID"
              required
              onChange={handleChange}
              value={form.identifier}
              className="w-full border rounded-md px-3 py-2"
            />
          )}

          {isSignup && userType === "employee" && (
            <input
              type="text"
              name="department"
              placeholder="Department (e.g. Roads, Lighting)"
              required
              onChange={handleChange}
              value={form.department}
              className="w-full border rounded-md px-3 py-2"
            />
          )}

          {isSignup && userType === "admin" && (
            <>
              <input
                type="text"
                name="town"
                placeholder="Town"
                required
                onChange={handleChange}
                value={form.town}
                className="w-full border rounded-md px-3 py-2"
              />

              <input
                type="text"
                name="adminKey"
                placeholder="Admin Signup Key"
                required
                onChange={handleChange}
                value={form.adminKey}
                className="w-full border rounded-md px-3 py-2"
              />
            </>
          )}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
              value={form.password}
              className="w-full border rounded-md px-3 py-2 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-sm text-gray-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700"
          >
            {loading ? "Processing..." : isSignup ? "Create Account" : "Login"}
          </button>
        </form>

        <div className="text-center mt-6 text-sm">
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setError("");
            }}
            className="ml-2 text-blue-600 hover:underline"
          >
            {isSignup ? "Login" : "Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
