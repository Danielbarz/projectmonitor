# Project Monitoring System

A comprehensive web-based application designed to track and monitor project lifecycles, from initial input to completion. This system provides role-based access for Administrators and Users, featuring real-time dashboards, interactive maps, progress tracking (milestones), and an automated notification system.

## 🚀 Technologies Used

### Frontend
*   **React** (Vite) - Fast and modern UI library.
*   **Tailwind CSS** - Utility-first CSS framework for styling.
*   **React Router** - Client-side routing.
*   **React Leaflet** - Interactive maps for project location tracking.
*   **Chart.js / Gantt** - Visualizing project timelines and statistics.

### Backend
*   **Node.js & Express.js** - Robust server-side runtime and API framework.
*   **PostgreSQL** - Relational database for data persistence.
*   **node-postgres (pg)** - PostgreSQL client for Node.js.
*   **JSON Web Token (JWT)** - Secure authentication.

---

## 🛠️ Prerequisites

*   **Node.js** (v14 or higher recommended)
*   **PostgreSQL** (Ensure the service is running)

---

## 📦 Installation & Setup

### 1. Database Setup

1.  Open your PostgreSQL tool (pgAdmin or terminal).
2.  Create a new database named `project_management`:
    ```sql
    CREATE DATABASE project_management;
    ```

### 2. Backend Setup

1.  Navigate to the `server` directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Configure Environment Variables:**
    *   Check the `.env` file in the `server` directory.
    *   Update the database credentials (`DB_USER`, `DB_PASSWORD`) if they differ from your local setup.
    ```env
    DB_USER=postgres
    DB_PASSWORD=your_password
    DB_NAME=project_management
    ```
4.  **Seed the Database:**
    *   Run the seed script to create tables and populate initial data (Roles, Master Data, Default Users):
    ```bash
    npm run seed
    ```
    *   *(Note: This will also create the necessary tables automatically).*

5.  **Start the Server:**
    ```bash
    npm run dev
    ```
    *   The server will run on `http://localhost:5000`.

### 3. Frontend Setup

1.  Open a new terminal and navigate to the project root (where `vite.config.js` is located):
    ```bash
    cd .. 
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Start the Frontend:**
    ```bash
    npm run dev
    ```
    *   The application will usually run on `http://localhost:5173`.

---

## ✨ Key Features

*   **Role-Based Access Control:** Secure routes and features specific to Admins and Users.
*   **Dashboard:** High-level overview of project statistics, completion rates, and status distribution.
*   **Project Management:** Create, Update, and Track projects with detailed milestone timelines.
*   **Interactive Map:** Visualize project locations on a map with coordinate locking.
*   **Notifications:** 
    *   **Admin-to-User:** Users receive notifications when an Admin updates their project.
    *   **User-to-Admin:** Admins receive notifications when a User creates or updates a project.
*   **Activity Log:** Full history of notes and status changes for every project.
*   **Data Import:** Support for uploading projects via CSV/Excel.

---

## ⚠️ Troubleshooting

*   **"Project not found" / White Screen:** Ensure the backend server is running and the database is correctly seeded.
*   **Database Connection Error:** Verify your credentials in `server/.env`.
*   **Notifications not appearing?** Notifications poll every 5 seconds. Ensure you are logged in as the correct target user (e.g., the project owner).

---

## 📂 Project Structure

```
projectmonitor/
├── public/             # Static assets (images, icons)
├── server/             # Backend logic
│   ├── controllers/    # Request handlers
│   ├── routes/         # API endpoints
│   ├── database.sql    # SQL Schema reference
│   └── seed.js         # Database seeder
├── src/                # Frontend source code
│   ├── components/     # Reusable UI components
│   ├── pages/          # Application views/pages
│   ├── context/        # Global state (Auth)
│   └── assets/         # Images and styles
└── README.md           # Project documentation
```