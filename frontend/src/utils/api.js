// Use Vite env var when available so frontend talks to the correct backend port in dev
const API_BASE = (import.meta.env.VITE_API_BASE || "http://localhost:5000") + "/api";

import { getComplaints, seedComplaints } from "./complaints";

const USERS_KEY = "cc_users";

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

export const register = (name, email, password, role = "user", adminKey = "", town = "", empId = "", department = "") => {
  return apiCall("POST", "/auth/register", {
    name,
    email,
    password,
    role,
    adminKey,
    town,
    empId,
    department,
  }).catch((err) => {
    // fallback for dev/offline: persist user locally
    // Treat network errors or inability to reach API as offline mode
    if (err && (err.message === "Failed to fetch" || err.name === "TypeError")) {
      const users = loadUsers();
      const exists = users.find((u) => u.email === email.toLowerCase());
      if (exists) {
        return Promise.reject(new Error("Email already in use (local)"));
      }
      const newUser = {
        id: `local-${Date.now()}`,
        name,
        email: email.toLowerCase(),
        password,
        role: role || "user",
        town: town || "",
        empId: empId || "",
        department: department || "",
      };
      users.push(newUser);
      saveUsers(users);
      return Promise.resolve({ token: makeFakeToken(newUser), user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, town: newUser.town, empId: newUser.empId, department: newUser.department } });
    }
    return Promise.reject(err);
  });
};

export const login = (email, password) => {
  return apiCall("POST", "/auth/login", { email, password }).catch((err) => {
    if (err && (err.message === "Failed to fetch" || err.name === "TypeError")) {
      // offline/dev: check local users
      const users = loadUsers();
      const found = users.find((u) => u.email === (email || "").toLowerCase() && u.password === password);
      if (!found) return Promise.reject(new Error("Invalid credentials (local)"));
      return Promise.resolve({ token: makeFakeToken(found), user: { id: found.id, name: found.name, email: found.email, role: found.role, town: found.town, empId: found.empId || "", department: found.department || "" } });
    }
    return Promise.reject(err);
  });
};

/* ================= COMPLAINTS (API) ================= */

export const createComplaint = (complaint) => {
  return apiCall("POST", "/complaints", complaint).catch((err) => {
    // fallback for offline/dev: persist complaint to localStorage
    try {
      const list = getComplaints();
      const maxId = list.reduce((m, c) => Math.max(m, Number(c.id || 0)), 0);
      const newItem = {
        id: maxId + 1,
        title: complaint.title,
        description: complaint.description || "",
        locationText: complaint.locationText,
        location: complaint.locationText,
        category: complaint.category || "General",
        town: complaint.town || "",
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        status: "Pending",
        priority: "Medium",
        dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
        estimatedHours: 0,
        actualHours: 0,
        remarks: "",
        proofName: "",
        assignedTo: "",
        userId: complaint.userId || "local",
      };
      seedComplaints([...list, newItem]);
      return Promise.resolve(newItem);
    } catch {
      return Promise.reject(err);
    }
  });
};

export const updateComplaintOnServer = (id, updates) => {
  return apiCall("PATCH", `/complaints/${id}`, updates).catch((err) => {
    console.warn("Failed to update complaint on server, using localStorage fallback", err);
    // fallback: update localStorage
    return null;
  });
};

/* ================= EMPLOYEE ================= */

export const getEmployeeTasks = (status = null) => {
  const query = status ? `?status=${status}` : "";
  return apiCall("GET", `/employee/tasks${query}`).catch((err) => {
    console.warn("Failed to fetch employee tasks from server, using localStorage fallback", err);
    // fallback: get tasks from localStorage
    try {
      const empId = localStorage.getItem("empId");
      const userId = localStorage.getItem("userId");
      
      console.log("🔍 DEBUG getEmployeeTasks:");
      console.log("  empId:", empId);
      console.log("  userId:", userId);
      
      if (!empId && !userId) {
        console.warn("❌ No employee ID found");
        return [];
      }
      
      const list = getComplaints();
      console.log("📋 Total complaints:", list.length);
      console.log("🔎 Complaints:", list.map(c => ({ id: c.id, assignedTo: c.assignedTo, title: c.title })));
      
      let tasks = list.filter((c) => {
        const match = String(c.assignedTo) === String(empId) || String(c.assignedTo) === String(userId);
        console.log(`  Complaint #${c.id} (assignedTo="${c.assignedTo}"): ${match ? "✓ MATCH" : "✗ NO MATCH"}`);
        return match;
      });
      
      console.log("✅ Matched tasks:", tasks.length);
      
      if (status && status !== "all") {
        tasks = tasks.filter((t) => t.status === status);
      }
      
      return tasks;
    } catch (e) {
      console.error("Failed to load tasks from localStorage", e);
      return [];
    }
  });
};

export const getEmployeeTask = (id) => {
  return apiCall("GET", `/employee/tasks/${id}`).catch((err) => {
    console.warn("Failed to fetch employee task from server, using localStorage fallback", err);
    // fallback: get task from localStorage
    try {
      const empId = localStorage.getItem("empId");
      const userId = localStorage.getItem("userId");
      
      if (!empId && !userId) return null;
      
      const list = getComplaints();
      const task = list.find((c) => String(c.id) === String(id) || String(c._id) === String(id));
      
      if (task && (String(task.assignedTo) === String(empId) || String(task.assignedTo) === String(userId))) {
        return task;
      }
      return null;
    } catch (e) {
      console.error("Failed to load task from localStorage", e);
      return null;
    }
  });
};

export const getEmployeeDashboardStats = () => {
  return apiCall("GET", "/employee/stats");
};

export const toggleDutyStatus = (isOnDuty) => {
  return apiCall("PUT", "/employee/duty", { isOnDuty });
};

export const updateEmployeeLocation = (lat, lng, note = "") => {
  return apiCall("PUT", "/employee/location", { lat, lng, note }).catch((err) => {
    console.warn("Failed to update location on server, saving locally", err);
    try {
      const loc = { lat, lng, note, updatedAt: new Date().toISOString() };
      localStorage.setItem("employee_location", JSON.stringify(loc));
      // also try to store in complaints local user store if present
      const usersRaw = localStorage.getItem(USERS_KEY);
      if (usersRaw) {
        const users = JSON.parse(usersRaw || "[]");
        const currentEmail = (localStorage.getItem("userEmail") || "").toLowerCase();
        const idx = users.findIndex((u) => (u.email || "").toLowerCase() === currentEmail);
        if (idx !== -1) {
          users[idx].currentLocation = loc;
          saveUsers(users);
        }
      }
      return Promise.resolve({ message: "saved-local", location: loc });
    } catch (e) {
      console.error("Failed to save location locally", e);
      return Promise.reject(err);
    }
  });
};

export const updateTaskStatus = (id, status, notes = "", location = null, actualHours = null) => {
  const body = { status, notes };
  if (location) body.location = location;
  if (actualHours != null) body.actualHours = actualHours;
  return apiCall("PUT", `/employee/tasks/${id}/status`, body);
};

export const getAllEmployees = () => {
  return apiCall("GET", "/employee").catch((err) => {
    console.warn("Failed to fetch employees from server, using local fallback", err);
    // fallback: return hardcoded test employees for local dev
    return [
      {
        _id: "local-emp-1",
        name: "Field Officer",
        email: "employee@example.com",
        empId: "EMP-1001",
        department: "Roads",
        isOnDuty: true,
      },
      {
        _id: "local-emp-2",
        name: "Maintenance Officer",
        email: "maintenance@example.com",
        empId: "EMP-1002",
        department: "Lighting",
        isOnDuty: true,
      },
      {
        _id: "local-emp-3",
        name: "Sanitation Officer",
        email: "sanitation@example.com",
        empId: "EMP-1003",
        department: "Sanitation",
        isOnDuty: false,
      },
    ];
  });
};

export const getUserIdByEmpId = (empId) => {
  if (!empId) return Promise.reject(new Error("empId required"));
  return apiCall("GET", `/employee/by-empid/${encodeURIComponent(empId)}`).catch((err) => {
    console.warn("Failed to lookup user by empId", empId, err);
    return Promise.reject(err);
  });
};
