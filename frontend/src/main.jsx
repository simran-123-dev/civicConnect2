import React from "react";
import "leaflet/dist/leaflet.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { getComplaints, seedComplaints } from "./utils/complaints";

// Dev-only: seed sample complaints on first load when none exist
if (import.meta.env.DEV) {
  const existing = getComplaints();
  if (existing.length === 0) {
    seedComplaints([
      { id: 1, title: "Pothole on 5th", locationText: "5th Ave", status: "Pending", description: "Large pothole", userId: "u1", date: new Date().toISOString() },
      { id: 2, title: "Broken streetlight", locationText: "Elm St", status: "In Progress", description: "Light not working", userId: "u2", date: new Date().toISOString() }
    ]);
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
