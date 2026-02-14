// Use Vite env var when available so frontend talks to the correct backend port in dev
const API_BASE =
  (import.meta.env.VITE_API_BASE || "http://localhost:5000") + "/api";

import { getComplaints, seedComplaints } from "./complaints";

const USERS_KEY = "cc_users";

/* ================= LOCAL STORAGE HELPERS ================= */

const loadUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const saveUsers = (list) => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error("Failed to save users to storage", e);
  }
};

const makeFakeToken = (user) => {
  return `local-${user.email}-${Date.now()}`;
};

/* ================= TOKEN ================= */

export const setToken = (token) => {
  localStorage.setItem("authToken", token);
};

export const getToken = () => {
  return localStorage.getItem("authToken");
};

export const clearToken = () => {
  localStorage.removeItem("authToken");
};

const getHeaders = () => {
  const headers = {
    "Content-Type": "application/json",
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const apiCall = async (method, endpoint, body = null) => {
  const options = {
    method,
    headers: getHeaders(),
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "API error");
  }

  return data;
};

/* ================= AUTH ================= */

// 🔹 REGISTER UPDATED
export const register = (
  name,
  email,
  phone,
  password,
  role = "user",
  adminKey = "",
  town = "",
  department = ""
) => {
  return apiCall("POST", "/auth/register", {
    name,
    email,
    phone,
    password,
    role,
    adminKey,
    town,
    department,
  }).catch((err) => {
    if (err && (err.message === "Failed to fetch" || err.name === "TypeError")) {
      const users = loadUsers();
      const exists = users.find(
        (u) => u.email === email.toLowerCase()
      );
      if (exists) {
        return Promise.reject(new Error("Email already in use (local)"));
      }

      const newUser = {
        id: `local-${Date.now()}`,
        name,
        email: email.toLowerCase(),
        phone,
        password,
        role: role || "user",
        town: town || "",
        department: department || "",
      };

      users.push(newUser);
      saveUsers(users);

      return Promise.resolve({
        token: makeFakeToken(newUser),
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          town: newUser.town,
          department: newUser.department,
        },
      });
    }
    return Promise.reject(err);
  });
};

// 🔹 LOGIN UPDATED (email / phone / empId)
export const login = (identifier, password) => {
  return apiCall("POST", "/auth/login", {
    identifier,
    password,
  }).catch((err) => {
    if (err && (err.message === "Failed to fetch" || err.name === "TypeError")) {
      const users = loadUsers();

      const found = users.find(
        (u) =>
          u.email === (identifier || "").toLowerCase() ||
          u.phone === identifier ||
          u.empId === identifier
      );

      if (!found || found.password !== password) {
        return Promise.reject(new Error("Invalid credentials (local)"));
      }

      return Promise.resolve({
        token: makeFakeToken(found),
        user: {
          id: found.id,
          name: found.name,
          email: found.email,
          phone: found.phone,
          role: found.role,
          town: found.town,
          empId: found.empId || "",
          department: found.department || "",
        },
      });
    }
    return Promise.reject(err);
  });
};

/* ================= COMPLAINTS (UNCHANGED) ================= */

export const createComplaint = (complaint) => {
  return apiCall("POST", "/complaints", complaint).catch((err) => {
    try {
      const list = getComplaints();
      const maxId = list.reduce((m, c) => Math.max(m, Number(c.id || 0)), 0);
      const newItem = {
        id: maxId + 1,
        ...complaint,
        createdAt: new Date().toISOString(),
        status: "Pending",
      };
      seedComplaints([...list, newItem]);
      return Promise.resolve(newItem);
    } catch {
      return Promise.reject(err);
    }
  });
};

export const updateComplaintOnServer = (id, updates) => {
  return apiCall("PATCH", `/complaints/${id}`, updates).catch(() => null);
};

/* ================= EMPLOYEE (UNCHANGED FROM YOUR ORIGINAL) ================= */

export const getEmployeeTasks = (status = null) => {
  const query = status ? `?status=${status}` : "";
  return apiCall("GET", `/employee/tasks${query}`).catch(() => []);
};

export const getEmployeeTask = (id) => {
  return apiCall("GET", `/employee/tasks/${id}`).catch(() => null);
};

export const getEmployeeDashboardStats = () => {
  return apiCall("GET", "/employee/stats");
};

export const toggleDutyStatus = (isOnDuty) => {
  return apiCall("PUT", "/employee/duty", { isOnDuty });
};

export const updateEmployeeLocation = (lat, lng, note = "") => {
  return apiCall("PUT", "/employee/location", { lat, lng, note });
};

export const updateTaskStatus = (id, status, notes = "", location = null, actualHours = null) => {
  const body = { status, notes };
  if (location) body.location = location;
  if (actualHours != null) body.actualHours = actualHours;
  return apiCall("PUT", `/employee/tasks/${id}/status`, body);
};

export const getAllEmployees = () => {
  return apiCall("GET", "/employee").catch(() => []);
};

export const getUserIdByEmpId = (empId) => {
  return apiCall("GET", `/employee/by-empid/${encodeURIComponent(empId)}`);
};
