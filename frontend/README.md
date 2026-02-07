🏙️CivicConnect

Report. Track. Resolve.
A modern civic engagement platform that brings transparency, accountability, and speed to city services.

🔍 At a Glance
| **Aspect**    | **Details**                                             |
| ------------- | ------------------------------------------------------- |
| **Users**     | Citizens, Administrators                                |
| **Core Flow** | Report issues → Track progress → Resolve complaints     |
| **Maps**      | Color-coded issue markers using Leaflet + OpenStreetMap |
| **Security**  | JWT authentication with role-based access control       |


📑 Table of Contents

-Overview
-Feature Highlights
-Tech Stack
-System Architecture
-Local Setup
-Demo Credentials
-Recent Changes
-Map Data Notes


📘 Overview

CivicConnect empowers citizens to report civic issues effortlessly, visualize them on an interactive map, and track their resolution in real time.
The platform is split into:
A Citizen Portal focused on fast reporting and transparency
An Admin Portal designed for efficient triage, monitoring, and accountability
Together, they bridge the gap between citizens and city administration.


✨ Feature Highlights

👤 Citizen Portal
 📝 Report civic issues with location and description
 📍 View complaints on an interactive city map
 ⏳ Track complaint status throughout its lifecycle
 💡 Submit suggestions and feedback
🛠️ Admin Portal
 📥 Review and prioritize incoming complaints
 🔄 Update issue status with resolution notes
 📊 Monitor city-wide issue patterns
 ✅ Close complaints transparently

## Tech Stack

| **Layer**          | **Technology**   |      **Purpose**                     |

| **Frontend**       | React + Vite                  | Fast SPA development and routing      |
| **Styling**        | Tailwind CSS                  | Responsive and consistent UI          |
| **Maps**           | React-Leaflet + OpenStreetMap | Interactive map visualization         |
| **Backend**        | Node.js + Express             | RESTful APIs and business logic       |
| **Database**       | MongoDB (Mongoose)            | Persistent data storage               |
| **Authentication** | JWT                           | Secure sessions and role-based access |


## Architecture

| **Component** | **Responsibility** | **Notes** |
| :--- | :--- | :--- |
| **React UI** | Citizen + Admin portals | Vite-powered SPA in [src](src) |
| **Express API** | Auth, complaints CRUD | API in [server/src](server/src) |
| **Local Map Data** | Map markers | Stored in browser localStorage |
| **Database** | Persistent storage | MongoDB via Mongoose |

## Local Setup

| **Step** | **Command** | **Notes** |
| :--- | :--- | :--- |
| **Install frontend** | `npm install` | Run at repo root |
| **Start frontend** | `npm run dev` | Vite dev server |
| **Install backend** | `cd server && npm install` | Backend deps |
| **Configure env** | Copy [server/.env.example](server/.env.example) | Fill MongoDB URI and secrets |
| **Start backend** | `npm run dev` | From [server](server) |

## Demo Credentials

| **Role** | **Email** | **Password** |
| :--- | :--- | :--- |
| **User** | user@example.com | user123 |
| **User** | jane@example.com | user123 |
| **Admin** | admin@example.com | admin123 |
| **Admin** | superadmin@example.com | admin123 |

## Recent Changes (Feb 6, 2026)

- Fixed admin-only routes to use `ProtectedRoute` to avoid a blank page.
- Added a citizen suggestion box to the home portal UI.

## Map Data Notes

- Map markers come from complaints stored in browser localStorage.
- No static dataset was added; markers appear after users submit issues.
