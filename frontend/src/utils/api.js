// Use Vite env var when available
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
    console.error("Failed to save users", e);
  }
};

const makeFakeToken = (user) =>
  `local-${user.email}-${Date.now()}`;

/* ================= TOKEN ================= */

export const setToken = (token) =>
  localStorage.setItem("authToken", token);

export const getToken = () =>
  localStorage.getItem("authToken");

export const clearToken = () =>
  localStorage.removeItem("authToken");

const getHeaders = () => {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

export const apiCall = async (method, endpoint, body = null) => {
  const options = {
    method,
    headers: getHeaders(),
  };

  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${API_BASE}${endpoint}`, options);

  if (!response.ok) {
    throw new Error("API error");
  }

  return response.json();
};

/* ================= AUTH ================= */

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
  }).catch(() => {
    const users = loadUsers();

    if (users.find((u) => u.email === email.toLowerCase())) {
      return Promise.reject(new Error("Email already exists"));
    }

    const newUser = {
      id: `local-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role,
      town,
      department,
    };

    users.push(newUser);
    saveUsers(users);

    return {
      token: makeFakeToken(newUser),
      user: newUser,
    };
  });
};

export const login = (identifier, password) => {
  return apiCall("POST", "/auth/login", {
    identifier,
    password,
  }).catch(() => {
    const users = loadUsers();

    const found = users.find(
      (u) =>
        u.email === identifier?.toLowerCase() ||
        u.phone === identifier ||
        u.empId === identifier
    );

    if (!found || found.password !== password) {
      return Promise.reject(new Error("Invalid credentials"));
    }

    return {
      token: makeFakeToken(found),
      user: found,
    };
  });
};

/* ================= COMPLAINTS ================= */

export const createComplaint = (complaint) => {
  return apiCall("POST", "/complaints", complaint).catch(() => {
    const list = getComplaints();
    const maxId = list.reduce(
      (m, c) => Math.max(m, Number(c.id || 0)),
      0
    );

    const newItem = {
      id: maxId + 1,
      ...complaint,
      coords: complaint.coords || null,
      createdAt: new Date().toISOString(),
      status: "Pending",
    };

    seedComplaints([...list, newItem]);
    return newItem;
  });
};

export const updateComplaintOnServer = (id, updates) =>
  apiCall("PATCH", `/complaints/${id}`, updates).catch(() => null);

/* ================= EMPLOYEE ================= */

export const getEmployeeTasks = (status = null) => {
  const query = status ? `?status=${status}` : "";

  return apiCall("GET", `/employee/tasks${query}`).catch(() => {
    const all = getComplaints();

    const tasks = all.map((c) => ({
      _id: c.id,
      title: c.title,
      description: c.description,
      status: c.status || "Assigned",
      priority: c.priority || "Medium",
      dueDate: new Date().toISOString(),
      estimatedHours: 2,
      actualHours: 0,
      targetLocation: {
        address: c.locationText || "Unknown",
      },
    }));

    if (!status) return tasks;

    return tasks.filter((t) => t.status === status);
  });
};

export const getEmployeeTask = (id) => {
  return apiCall("GET", `/employee/tasks/${id}`).catch(() => {
    const all = getComplaints();
    const found = all.find((c) => String(c.id) === String(id));

    if (!found) return null;

    return {
      _id: found.id,
      title: found.title,
      description: found.description,
      status: found.status || "Assigned",
      priority: found.priority || "Medium",
      dueDate: new Date().toISOString(),
      estimatedHours: 2,
      actualHours: 0,
      targetLocation: {
        address: found.locationText || "Unknown",
      },
    };
  });
};

export const getEmployeeDashboardStats = () => {
  return apiCall("GET", "/employee/stats").catch(() => {
    const tasks = getComplaints();

    return {
      totalTasks: tasks.length,
      pendingTasks: tasks.filter((t) => t.status === "Pending").length,
      inProgressTasks: tasks.filter((t) => t.status === "In Progress").length,
      completedTasks: tasks.filter((t) => t.status === "Completed").length,
      unresolvedTasks: tasks.filter((t) => t.status === "Unresolved").length,
      overdueTasks: 0,
    };
  });
};

export const toggleDutyStatus = (isOnDuty) => {
  return apiCall("PUT", "/employee/duty", { isOnDuty }).catch(() => {
    localStorage.setItem("employeeDuty", JSON.stringify(isOnDuty));
    return { success: true };
  });
};

export const updateEmployeeLocation = (lat, lng, note = "") => {
  return apiCall("PUT", "/employee/location", {
    lat,
    lng,
    note,
  }).catch(() => {
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

export const updateTaskStatus = (
  id,
  status,
  notes = "",
  location = null,
  actualHours = null
) => {
  const body = { status, notes };
  if (location) body.location = location;
  if (actualHours != null) body.actualHours = actualHours;

  return apiCall("PUT", `/employee/tasks/${id}/status`, body).catch(() => {
    const list = getComplaints();
    const idx = list.findIndex((c) => String(c.id) === String(id));

    if (idx !== -1) {
      list[idx].status = status;
      seedComplaints(list);
    }

    return { success: true };
  });
};

export const getAllEmployees = () => {
  return apiCall("GET", "/employee").catch(() => {
    const users = JSON.parse(localStorage.getItem("cc_users") || "[]");
    return users.filter((u) => u.role === "employee");
  });
};

export const getUserIdByEmpId = (empId) => {
  return apiCall("GET", `/employee/by-empid/${encodeURIComponent(empId)}`)
    .catch(() => {
      const users = JSON.parse(localStorage.getItem("cc_users") || "[]");
      const found = users.find(
        (u) => u.empId === empId && u.role === "employee"
      );

      if (!found) return null;

      return {
        id: found.id,
        name: found.name,
        email: found.email,
      };
    });
};
