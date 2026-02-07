# CivicConnect - Complete Project Overview

A comprehensive civic engagement platform connecting citizens with municipal authorities for transparent issue reporting and resolution tracking.

---

## 📋 Table of Contents
1. [System Architecture](#system-architecture)
2. [Tech Stack Details](#tech-stack-details)
3. [Database Connection Flow](#database-connection-flow)
4. [Frontend-Backend Communication](#frontend-backend-communication)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Authentication & Authorization](#authentication--authorization)
8. [Project Structure](#project-structure)
9. [Setup Instructions](#setup-instructions)
10. [Environment Variables](#environment-variables)

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CIVICCONNECT SYSTEM                      │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐                  ┌──────────────────────┐
│   CITIZEN PORTAL     │                  │   ADMIN PORTAL       │
│  (React + Vite)      │                  │  (React + Vite)      │
├──────────────────────┤                  ├──────────────────────┤
│ • Login/Signup       │                  │ • Login/Signup       │
│ • Report Issues      │                  │ • View Complaints    │
│ • View My Issues     │                  │ • Update Status      │
│ • Map Dashboard      │                  │ • Add Remarks        │
│ • Suggestion Box     │                  │ • Area Management    │
└──────────────────────┘                  └──────────────────────┘
          │                                         │
          └─────────────────┬─────────────────────┘
                            │
                  ┌─────────▼──────────┐
                  │   VITE PROXY       │
                  │  (Dev Server)      │
                  │ Port: 5175         │
                  └─────────┬──────────┘
                            │
                  ┌─────────▼──────────────────┐
                  │   EXPRESS.JS API SERVER    │
                  │   (Node.js Backend)        │
                  │   Port: 5000               │
                  ├────────────────────────────┤
                  │ Routes:                    │
                  │ • /api/auth/register       │
                  │ • /api/auth/login          │
                  │ • /api/complaints (CRUD)   │
                  └─────────┬──────────────────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
         │                  │                  │
    ┌────▼────┐      ┌──────▼──────┐   ┌─────▼──────┐
    │JWT Auth │      │  Mongoose   │   │  Multer    │
    │Middleware      │   ODM       │   │  (Files)   │
    └─────────┘      └──────┬──────┘   └──────┬─────┘
                            │                  │
                  ┌─────────▼──────────────────▼────┐
                  │   MONGODB ATLAS DATABASE        │
                  │   mongodb+srv://user:pass@...   │
                  ├─────────────────────────────────┤
                  │ Collections:                    │
                  │ • users (Citizens & Admins)     │
                  │ • complaints (Issues)           │
                  │ • uploads (Media Files)         │
                  └─────────────────────────────────┘
```

---

## 🛠️ Tech Stack Details

### **Frontend Stack**

#### **React (UI Framework)**
- **Version**: Latest
- **Purpose**: Build interactive user interfaces
- **Location**: `/src`
- **Components**:
  - `src/Components/` - Reusable UI components (Navbar, IssueCard, MapView)
  - `src/pages/` - Page-level components (Home, Login, RaiseIssue, etc.)

#### **Vite (Build Tool)**
- **Purpose**: Fast development server and optimized production builds
- **Config**: `vite.config.js`
- **Dev Server**: Runs on port 5175
- **Proxy**: Routes `/api/*` requests to backend (port 5000)

#### **React Router**
- **Purpose**: Client-side routing
- **Location**: `src/App.jsx`
- **Routes**:
  - `/` - Home page
  - `/login` - Authentication
  - `/raise` - Issue reporting
  - `/map` - Map dashboard
  - `/my-complaints` - User's complaints
  - `/admin` - Admin dashboard (protected route)
  - `/admin/complaints` - All complaints (admin only)

#### **Tailwind CSS**
- **Purpose**: Utility-first styling
- **Config**: `tailwind.config.js`
- **Colors**:
  - Primary: `#0A2540` (Dark Blue)
  - Secondary: `#2EC4B6` (Teal)
- **Classes**: Used throughout all components for responsive design

#### **React-Leaflet**
- **Purpose**: Interactive mapping
- **Map Provider**: OpenStreetMap (free tiles)
- **Features**:
  - Display complaint markers
  - Color-coded by status (Red=Pending, Yellow=In Progress, Green=Resolved)
  - Click markers to view complaint details
- **Location**: `src/Components/MapView.jsx`

---

### **Backend Stack**

#### **Node.js + Express**
- **Version**: Latest LTS
- **Purpose**: RESTful API server
- **Port**: 5000
- **Key Middleware**:
  - `cors` - Enable cross-origin requests
  - `morgan` - Request logging
  - `express.json()` - Parse JSON bodies

#### **MongoDB (Database)**
- **Setup**: MongoDB Atlas (Cloud)
- **Connection**: Mongoose ODM (Object Data Mapping)
- **Collections**:
  - **users**: Store citizen and admin accounts
  - **complaints**: Store reported civic issues
  - **uploads**: Store complaint media files (photos/videos)

#### **Mongoose (ODM)**
- **Purpose**: Schema-based database interactions
- **Location**: `server/src/models/`
- **Models**:
  - `User.js` - User schema (name, email, password, role, town)
  - `Complaint.js` - Complaint schema (title, description, location, town, status, etc.)

#### **JWT (JSON Web Tokens)**
- **Purpose**: Stateless authentication
- **Secret**: Stored in `server/.env` as `JWT_SECRET`
- **Token Expiry**: 7 days
- **Payload**: `{ id, role, email }`
- **Location**: `server/src/middleware/auth.js`

#### **Bcryptjs**
- **Purpose**: Hash passwords securely
- **Salt Rounds**: 10
- **Usage**: Register and login endpoints

---

## 🔌 Database Connection Flow

### **Step 1: Environment Configuration**
```
server/.env
│
├── MONGODB_URI=mongodb+srv://simrn19989_db_user:password@cluster0.dzb4mke.mongodb.net/civicconnect
├── JWT_SECRET=your-secret-key
├── PORT=5000
├── CORS_ORIGIN=http://localhost:5175
└── ADMIN_SIGNUP_KEY=admin-secret-key
```

### **Step 2: Connection Setup**
**File**: `server/src/config/db.js`
```javascript
const mongoose = require("mongoose");
const connectDb = async () => {
  const uri = process.env.MONGODB_URI;
  await mongoose.connect(uri);
  return mongoose.connection;
};
```

### **Step 3: Server Initialization**
**File**: `server/src/index.js`
```
1. Load environment variables (dotenv)
2. Connect to MongoDB (connectDb())
3. Initialize Express app
4. Mount API routes (/api/auth, /api/complaints)
5. Listen on PORT 5000
```

### **Step 4: Data Operations**
- **Create**: User signup, file complaint
- **Read**: Get complaints, fetch user details
- **Update**: Change complaint status, add remarks
- **Delete**: Remove complaints (if needed)

---

## 🔄 Frontend-Backend Communication

### **Request Flow**

```
React Component
    │
    ├─► User Action (click, form submit)
    │
    ├─► API Call (src/utils/api.js)
    │   │
    │   └─► fetch("/api/endpoint")
    │
    ├─► Vite Proxy (vite.config.js)
    │   │
    │   └─► http://localhost:5000/api/endpoint
    │
    ├─► Express Route Handler
    │   │
    │   ├─► Auth Middleware (verify JWT)
    │   ├─► Role Middleware (check permissions)
    │   └─► Business Logic
    │
    ├─► Mongoose Query
    │   │
    │   └─► MongoDB Operation
    │
    ├─► Response JSON
    │
    ├─► React State Update
    │
    └─► UI Re-render
```

### **Key API Wrapper**
**File**: `src/utils/api.js`
```javascript
const API_BASE = "/api";  // Uses Vite proxy

export const apiCall = async (method, endpoint, body = null) => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  };
  
  const response = await fetch(`${API_BASE}${endpoint}`, options);
  return response.json();
};
```

### **Vite Proxy Configuration**
**File**: `vite.config.js`
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    },
  },
}
```

---

## 📊 Database Schema

### **User Collection**
```javascript
{
  _id: ObjectId,
  name: String,                          // User's full name
  email: String (unique),                // User's email
  passwordHash: String,                  // Bcrypt hashed password
  role: String (enum: "user", "admin"),  // User type
  town: String,                          // Admin's assigned town (if admin)
  createdAt: Date,
  updatedAt: Date
}
```

**Example Documents**:
```javascript
// Citizen
{ name: "John Doe", email: "john@example.com", role: "user", town: "" }

// Admin
{ name: "Admin Officer", email: "admin@example.com", role: "admin", town: "Downtown" }
```

### **Complaint Collection**
```javascript
{
  _id: ObjectId,
  title: String,                         // Issue title
  description: String,                   // Full description
  locationText: String,                  // User-readable location
  town: String,                          // Area/town (required)
  coords: [latitude, longitude],         // Geographic coordinates
  category: String,                      // Issue category (Roads, Lighting, etc.)
  status: String (enum: "Pending", "In Progress", "Resolved"),
  remarks: String,                       // Admin notes
  proofName: String,                     // Media file name
  createdBy: ObjectId (ref: User),       // Complaint author (citizen)
  createdAt: Date,
  updatedAt: Date
}
```

**Example Document**:
```javascript
{
  title: "Pothole on Main Street",
  description: "Large pothole near traffic light causing accidents",
  locationText: "123 Main St, Downtown",
  town: "Downtown",
  coords: [28.6139, 77.2090],
  category: "Roads",
  status: "In Progress",
  remarks: "Repair team assigned, ETA 2 days",
  createdBy: ObjectId(...),
  createdAt: 2026-02-06T10:30:00Z
}
```

---

## 🔐 API Endpoints

### **Authentication**

| Method | Endpoint | Body | Response |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | `{ name, email, password, role, adminKey?, town? }` | `{ token, user }` |
| **POST** | `/api/auth/login` | `{ email, password }` | `{ token, user }` |
| **GET** | `/api/health` | - | `{ status: "ok" }` |

### **Complaints**

| Method | Endpoint | Body | Authorization |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/complaints` | - | JWT (filters by user role + town) |
| **GET** | `/api/complaints/:id` | - | JWT |
| **POST** | `/api/complaints` | `{ title, description, locationText, town, coords, category }` | JWT |
| **PATCH** | `/api/complaints/:id` | `{ status, remarks }` | JWT (admin only) |
| **DELETE** | `/api/complaints/:id` | - | JWT (admin only) |

**Example Request**:
```bash
curl -X POST http://localhost:5000/api/complaints \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Broken Street Light",
    "description": "Light on 5th Ave is broken for 2 weeks",
    "locationText": "5th Ave & Main St",
    "town": "Downtown",
    "coords": [28.6139, 77.2090],
    "category": "Lighting"
  }'
```

---

## 🛡️ Authentication & Authorization Flow

### **Registration**
```
User fills signup form (name, email, password, town for admins)
    │
    ├─► Frontend validates input
    │
    ├─► POST /api/auth/register
    │
    ├─► Backend:
    │   ├─ Check email uniqueness
    │   ├─ Validate admin key (if admin)
    │   ├─ Hash password with bcrypt
    │   ├─ Create User document in MongoDB
    │   └─ Generate JWT token
    │
    ├─► Frontend:
    │   ├─ Store token in localStorage
    │   ├─ Store role in localStorage
    │   ├─ Store userId in localStorage
    │   └─ Redirect to home
```

### **Login**
```
User enters email & password
    │
    ├─► POST /api/auth/login
    │
    ├─► Backend:
    │   ├─ Find user by email
    │   ├─ Compare password with bcrypt
    │   ├─ Generate JWT token (7-day expiry)
    │   └─ Return token + user data
    │
    ├─► Frontend stores: token, role, userId, town (if admin)
    │
    └─► Protected routes check localStorage
```

### **Protected Routes**
**File**: `src/components/ProtectedRoute.jsx`
```javascript
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const token = getToken();  // Check localStorage
  const role = localStorage.getItem("role");
  
  if (!token) return <Navigate to="/login" />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/" />;
  
  return children;
};
```

### **Token Usage**
Every API request includes:
```javascript
headers: {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json"
}
```

Backend validates token in `server/src/middleware/auth.js`:
```javascript
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = { id: decoded.id, role: decoded.role };
  next();
};
```

---

## 📂 Project Structure

```
civicconnect/
├── Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx                    # Landing page + suggestion box
│   │   │   ├── Login.jsx                   # Auth (signup/login)
│   │   │   ├── RaiseIssue.jsx              # Report complaint form
│   │   │   ├── MyComplaints.jsx            # Citizen's complaints
│   │   │   ├── MapDashboard.jsx            # Map view
│   │   │   ├── AdminDashboard.jsx          # Admin overview
│   │   │   ├── AdminComplaints.jsx         # Admin complaint list
│   │   │   ├── AdminComplaintDetail.jsx    # Admin detail view
│   │   │   └── ComplaintDetail.jsx         # Citizen detail view
│   │   │
│   │   ├── Components/
│   │   │   ├── Navbar.jsx                  # Top navigation
│   │   │   ├── IssueCard.jsx               # Complaint card component
│   │   │   └── MapView.jsx                 # Map component
│   │   │
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx          # Route guard
│   │   │
│   │   ├── utils/
│   │   │   ├── api.js                      # API wrapper
│   │   │   └── complaints.jsx              # localStorage helpers
│   │   │
│   │   ├── App.jsx                         # Main app component
│   │   ├── main.jsx                        # React entry point
│   │   └── index.css                       # Global styles
│   │
│   ├── index.html                          # HTML entry
│   ├── vite.config.js                      # Vite config (proxy setup)
│   ├── package.json
│   └── eslint.config.js

├── Backend (Node.js + Express)
│   ├── server/
│   │   ├── src/
│   │   │   ├── index.js                    # Server entry point
│   │   │   ├── seed.js                     # Database seeding script
│   │   │   │
│   │   │   ├── config/
│   │   │   │   └── db.js                   # MongoDB connection
│   │   │   │
│   │   │   ├── models/
│   │   │   │   ├── User.js                 # User schema
│   │   │   │   └── Complaint.js            # Complaint schema
│   │   │   │
│   │   │   ├── routes/
│   │   │   │   ├── auth.js                 # Auth endpoints
│   │   │   │   └── complaints.js           # Complaint CRUD endpoints
│   │   │   │
│   │   │   └── middleware/
│   │   │       ├── auth.js                 # JWT verification
│   │   │       └── requireRole.js          # Role-based access
│   │   │
│   │   ├── .env                            # Environment variables
│   │   ├── .env.example                    # Template
│   │   ├── package.json                    # Dependencies
│   │   └── README.md                       # Backend docs

└── .gitignore
```

---

## 🚀 Setup Instructions

### **Prerequisites**
- Node.js (v16+)
- npm or yarn
- MongoDB Atlas account (free tier available)
- Git

### **Step 1: Clone & Install**
```bash
# Clone repo
git clone <repo-url>
cd civicconnect

# Frontend deps
npm install

# Backend deps
cd server
npm install
cd ..
```

### **Step 2: Configure MongoDB**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create cluster (M0 free tier)
3. Create database user (simrn19989_db_user / password)
4. Get connection string
5. Whitelist IP address (0.0.0.0/0 for development)
6. Copy connection string

### **Step 3: Setup Environment**
```bash
# server/.env
PORT=5000
MONGODB_URI=mongodb+srv://simrn19989_db_user:password@cluster0.dzb4mke.mongodb.net/civicconnect?retryWrites=true&w=majority
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5175
ADMIN_SIGNUP_KEY=admin-secret-key
```

### **Step 4: Start Services**
```bash
# Terminal 1: Backend
cd server
npm run dev
# Expected: "Server running on port 5000"

# Terminal 2: Frontend
npm run dev
# Expected: "Local: http://localhost:5175"
```

### **Step 5: Seed Database**
```bash
cd server
npm run seed
# Creates demo users for testing
```

### **Step 6: Access Application**
- Frontend: http://localhost:5175
- Backend API: http://localhost:5000
- Demo Login: user@example.com / user123

---

## 🔑 Environment Variables

### **Backend (.env)**
| Variable | Example | Purpose |
| :--- | :--- | :--- |
| `PORT` | 5000 | Backend server port |
| `MONGODB_URI` | mongodb+srv://... | Database connection string |
| `JWT_SECRET` | your-secret-key | Token signing secret |
| `CORS_ORIGIN` | http://localhost:5175 | Frontend origin (for CORS) |
| `ADMIN_SIGNUP_KEY` | admin-secret-key | Key for admin registration |

### **Frontend (.env.local - optional)**
| Variable | Example | Purpose |
| :--- | :--- | :--- |
| `VITE_API_URL` | http://localhost:5000/api | Backend API base URL |

---

## 📱 Key Features by Component

### **Citizen Features**
- ✅ Self-registration (email, name, password)
- ✅ Report issues with photos/videos
- ✅ Track complaint status
- ✅ View issues on interactive map
- ✅ Submit improvement suggestions
- ✅ View personal complaint history

### **Admin Features**
- ✅ Register with area assignment (town)
- ✅ View complaints from their area only
- ✅ Update complaint status
- ✅ Add resolution remarks and proof
- ✅ Monitor area-wise data
- ✅ Dashboard with statistics

### **Security Features**
- ✅ Password hashing (bcryptjs)
- ✅ JWT-based authentication
- ✅ Role-based access control
- ✅ Protected routes
- ✅ Area-wise complaint isolation

---

## 🔄 Data Flow Example

### **Report Issue Flow**
```
1. Citizen fills form:
   - title: "Pothole"
   - description: "Large hole on Main St"
   - town: "Downtown"
   - location: "123 Main St"
   - coords: [28.6139, 77.2090]
   - photo: [uploaded file]

2. Frontend:
   - Validates input
   - Calls POST /api/complaints
   - Includes JWT token in header

3. Backend:
   - Auth middleware verifies JWT
   - Extracts user ID from token
   - Validates required fields
   - Creates Complaint document in MongoDB

4. MongoDB:
   - Stores complaint with createdBy=userId, town="Downtown"

5. Frontend:
   - Shows success message
   - Redirects to /my-complaints
   - Complaint immediately visible (linked to userId)

6. Admin:
   - Logs in as admin for "Downtown"
   - GET /api/complaints returns only Downtown complaints
   - Admin updates status to "In Progress"
   - Citizen sees real-time update
   - Map shows yellow marker (in progress)
```

---

## 🆘 Troubleshooting

| Issue | Solution |
| :--- | :--- |
| MongoDB connection fails | Check IP whitelist in Atlas, verify connection string |
| CORS errors | Ensure CORS_ORIGIN matches frontend port (5175) |
| 401 Unauthorized | Token expired or missing, user needs to relogin |
| Blank page on /admin | Check if user role is "admin" in localStorage |
| Complaints not showing | Verify town matches between citizen and admin |

---

## 📞 Support & Contact

For setup help or questions:
1. Check the README files in each directory
2. Review .env.example for required variables
3. Check browser console (F12) for client-side errors
4. Check terminal for server-side errors

---

**Last Updated**: February 6, 2026
**Version**: 1.0
**Status**: Production Ready
