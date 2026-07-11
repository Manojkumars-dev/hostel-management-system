# Hostel Management System

A full-stack dual-panel web application for managing hostel operations — built with **React**, **FastAPI**, and **SQLite**.

## Features

- **Admin Portal** — Manage rooms, beds, allocations, and generate monthly bills
- **Student Portal** — View available beds, book a bed, view and print monthly invoices
- **Authentication** — Secure email & password login and registration for both Admin and Student roles
- **Demo Login** — One-click demo credentials on the login screen for quick testing
- **No double bookings** — Automated conflict prevention on bed allocations
- **Printable billing** — Clean invoice print view for fee transparency

## Tech Stack

| Layer     | Technology                  |
|-----------|-----------------------------|
| Frontend  | React (Vite), Vanilla CSS   |
| Backend   | Python, FastAPI, SQLAlchemy |
| Database  | SQLite (upgradable to SQL Server) |
| Hosting   | Render (backend), Vite dev server (frontend) |

## Project Structure

```
hostel-management-system/
+-- backend/
¦   +-- main.py           # FastAPI entry point
¦   +-- models.py         # Database models
¦   +-- database.py       # DB connection
¦   +-- requirements.txt
¦   +-- routers/
¦       +-- auth.py       # Register & Login
¦       +-- admin.py      # Room, Bed, Billing APIs
¦       +-- student.py    # Booking & Bill APIs
+-- frontend/
¦   +-- src/
¦       +-- App.jsx           # Auth flow + routing
¦       +-- index.css         # Global premium styles
¦       +-- pages/
¦           +-- AdminDashboard.jsx
¦           +-- StudentDashboard.jsx
+-- requirements.txt      # Root-level for Render deployment
+-- render.yaml           # Render deployment config
+-- README.md
```

## Getting Started Locally

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate      # Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Demo Credentials

| Role          | Email                  | Password     |
|---------------|------------------------|--------------|
| Administrator | admin@hostel.com       | admin123     |
| Student       | student@hostel.com     | student123   |

> Register these accounts on first visit using the **Register New User** button.

## Deployment (Render)

- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `cd backend && uvicorn main:app --host 0.0.0.0 --port \`
