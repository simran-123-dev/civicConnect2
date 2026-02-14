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
    const list = getComplaints();
    const maxId = list.reduce((m, c) => Math.max(m, Number(c.id || 0)), 0);

    const newItem = {
      id: maxId + 1,
      ...complaint,
      coords: complaint.coords || null,
      createdAt: new Date().toISOString(),
      status: "Pending",
    };

    seedComplaints([...list, newItem]);
    return Promise.resolve(newItem);
  });
};


export const updateComplaintOnServer = (id, updates) => {
  return apiCall("PATCH", `/complaints/${id}`, updates).catch(() => null);
};

/* ================= EMPLOYEE ================= */

export const getEmployeeTasks = (status = null) => {
  const query = status ? `?status=${status}` : "";

  return apiCall("GET", `/employee/tasks${query}`).catch(() => {
    console.warn("⚠️ Backend not responding — using local fallback");

    const all = getComplaints();

    // Fake employee tasks from complaints
    const tasks = all
      .filter(c => c.status !== "Completed")
      .map(c => ({
        _id: c.id,
        title: c.title,
        description: c.description,
        status: c.status || "Assigned",
        priority: c.priority || "Medium",
        dueDate: new Date().toISOString(),
        estimatedHours: 2,
        actualHours: 0,
        targetLocation: {
          address: c.locationText || "Unknown"
        }
      }));

    if (!status) return tasks;

    return tasks.filter(t => t.status === status);
  });
};

export const getEmployeeDashboardStats = () => {
  return apiCall("GET", "/employee/stats").catch(() => {
    console.warn("⚠️ Using local stats fallback");

    const tasks = getComplaints();

    return {
      totalTasks: tasks.length,
      pendingTasks: tasks.filter(t => t.status === "Pending").length,
      inProgressTasks: tasks.filter(t => t.status === "In Progress").length,
      completedTasks: tasks.filter(t => t.status === "Completed").length,
      unresolvedTasks: tasks.filter(t => t.status === "Unresolved").length,
      overdueTasks: 0
    };
  });
};

export const toggleDutyStatus = async (isOnDuty) => {
  return apiCall("PUT", "/employee/duty", { isOnDuty }).catch(() => {
    console.warn("⚠️ Local duty fallback");
    localStorage.setItem("employeeDuty", JSON.stringify(isOnDuty));
    return { success: true };
  });
};

export const updateEmployeeLocation = async (lat, lng, note = "") => {
  return apiCall("PUT", "/employee/location", { lat, lng, note }).catch(() => {
    console.warn("⚠️ Local location fallback");

    localStorage.setItem(
      "employeeLocation",
      JSON.stringify({
        lat,
        lng,
        note,
        updatedAt: new Date().toISOString(),
      })
    );

    return { success: true };
  });
};

export const updateTaskStatus = (id, status, notes = "", location = null, actualHours = null) => {
  const body = { status, notes };
  if (location) body.location = location;
  if (actualHours != null) body.actualHours = actualHours;

  return apiCall("PUT", `/employee/tasks/${id}/status`, body).catch(() => {
    console.warn("⚠️ Local task status fallback");

    const list = getComplaints();
    const idx = list.findIndex(c => String(c.id) === String(id));

    if (idx !== -1) {
      list[idx].status = status;
      seedComplaints(list);
    }

    return { success: true };
  });
};
