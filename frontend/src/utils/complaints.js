const STORAGE_KEY = "cc_complaints";

const loadComplaints = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse complaints from storage", e);
    return [];
  }
};

const saveComplaints = (list) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error("Failed to save complaints to storage", e);
  }
};

export const getComplaints = () => {
  return loadComplaints();
};

export const getComplaintById = (id) => {
  const list = loadComplaints();
  return (
    list.find((c) => String(c.id) === String(id) || String(c._id) === String(id)) || null
  );
};

export const getMyComplaints = (userId = null) => {
  const list = loadComplaints();
  if (!userId) return list;
  return list.filter((c) => String(c.userId) === String(userId));
};

export const updateComplaint = (id, updates = {}) => {
  const list = loadComplaints();
  const idx = list.findIndex((c) => String(c.id) === String(id) || String(c._id) === String(id));
  
  console.log("🔧 updateComplaint called for id:", id);
  console.log("📍 Found at index:", idx);
  
  if (idx === -1) {
    console.error("❌ Complaint not found! id:", id);
    return null;
  }
  
  // If assigning to someone, set status to "Assigned" automatically
  if (updates.assignedTo && !updates.status) {
    updates.status = "Assigned";
  }
  
  console.log("✏️ Updates to apply:", updates);
  const updated = { ...list[idx], ...updates };
  console.log("📝 Updated complaint:", updated);
  
  list[idx] = updated;
  saveComplaints(list);
  
  console.log("✅ Saved! New list size:", list.length);
  return updated;
};

export const updateComplaintStatus = (id, status) => {
  const list = loadComplaints();
  const idx = list.findIndex((c) => String(c.id) === String(id));
  if (idx === -1) return null;
  const updated = { ...list[idx], status, updatedAt: new Date().toISOString() };
  list[idx] = updated;
  saveComplaints(list);
  return updated;
};

// helper to seed complaints for dev convenience
export const seedComplaints = (items = []) => {
  saveComplaints(items);
};
