# 🚀 CRM SaaS (Fullstack)

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-DB-336791?logo=postgresql)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)

Full-stack CRM application for managing **clients, deals, tasks, and sales pipeline activity**.

Built as a **modern SaaS-style product** with authentication, analytics dashboard, and drag-and-drop Kanban.

👉 Designed as a production-like CRM system with real user flows and business logic.

---

## 🌐 Live Demo

👉 https://crm-self-one.vercel.app

Backend API:  
👉 https://crm-b542.onrender.com *(may take ~30s to wake up)*

---

<p align="center">
  <a href="https://crm-self-one.vercel.app">
    <img src="https://img.shields.io/badge/Open%20App-Live%20Demo-blue?style=for-the-badge" />
  </a>
</p>

---

## 🖥 Preview

## Dashboard
![Dashboard](./frontend/public/screenshots/dashboard-dark-1.png)

## Deals
![Deals](./frontend/public/screenshots/deals-kanban-dark.png)

## 🎬 Product Walkthrough
Experience the CRM workflow including dashboard analytics, Kanban pipeline, task management, modal animations, and responsive UI interactions.
👉 [Watch Full Demo](https://drive.google.com/file/d/12zo5HYDrMnIXcO_Ah4pHvNWdTnb9akZr/view?usp=sharing)

---

## ✨ What you can do

- Manage clients and relationships in one place  
- Move deals across pipeline stages with drag & drop  
- Track tasks and deadlines efficiently  
- Store notes and communication history  
- Monitor revenue and business performance via dashboard  

---

## 🚀 Features

### 🔐 Authentication
- JWT authentication (access + refresh tokens)
- Auto logout on expiration
- Protected routes

### 📊 Dashboard
- KPI cards (clients, deals, tasks)
- Revenue overview
- Deals by stage chart
- Recent activity feed
- Skeleton loading

### 💼 Deals (Kanban)
- Drag & Drop Kanban board (Trello-like)
- Stage transitions with API sync
- Pipeline visualization

### ✅ Tasks
- Status filters (open / in progress / done)
- “My Tasks” filter
- Mark as completed

### 👥 Clients
- Full CRUD
- Search & filters
- Manager assignment

### 📝 Notes
- Notes per client
- Search & filtering
- User attribution

### 🎨 UI / UX
- Dark / Light theme toggle
- Responsive SaaS layout
- Empty states
- Toast notifications
- Clean reusable components

---

## 🛠 Tech Stack

### Frontend
- Next.js 16 (App Router)
- React
- TypeScript
- Tailwind CSS
- Axios
- Recharts
- dnd-kit (Drag & Drop)
- Sonner (toasts)

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL (production)
- SQLite (development)
- JWT Authentication
- Pydantic
- Uvicorn

---

## 💡 Why This Project

This project was built to simulate a real SaaS CRM system used by small teams to:

- manage sales pipelines
- track client interactions
- organize tasks and notes
- visualize business performance

It focuses on **clean architecture, UX, and real-world product logic**.

---

## ⚡ Key Highlights

- 🧩 Fullstack architecture (Next.js + FastAPI)
- 📊 Real-time UI updates with API sync
- 🎯 Drag & Drop Kanban (dnd-kit)
- 🌙 Dark / Light mode
- 📱 Fully responsive UI
- 🔐 JWT authentication system

---

## 🧩 Challenges

- Implemented drag-and-drop pipeline sync with optimistic UI updates
- Built reusable modal system with animated transitions
- Solved responsive chart rendering issues in Recharts
- Designed scalable dashboard card architecture

---

## 📸 Screenshots

### Landing
![Landing](./frontend/public/screenshots/landing-1.png)
![Landing](./frontend/public/screenshots/landing-2.png)

### Dashboard
![Dashboard Light](./frontend/public/screenshots/dashboard-light-1.png)
![Dashboard Light](./frontend/public/screenshots/dashboard-light-2.png)
![Dashboard Dark](./frontend/public/screenshots/dashboard-dark-1.png)
![Dashboard Dark](./frontend/public/screenshots/dashboard-dark-2.png)

### Clients
![Clients Light](./frontend/public/screenshots/clients-light.png)
![Clients Dark](./frontend/public/screenshots/clients-dark.png)

### Deals (Kanban Drag & Drop)
![Deals Light](./frontend/public/screenshots/deals-kanban-light.png)
![Deals Dark](./frontend/public/screenshots/deals-kanban-dark.png)

### Tasks
![Tasks Light](./frontend/public/screenshots/tasks-light.png)
![Tasks Dark](./frontend/public/screenshots/tasks-dark.png)

### Notes
![Notes Light](./frontend/public/screenshots/notes-light.png)
![Notes Dark](./frontend/public/screenshots/notes-dark.png)

### Create Forms
![Create Client Light](./frontend/public/screenshots/create-client-light.png)
![Create Client Dark](./frontend/public/screenshots/create-client-dark.png)
![Create Deal Light](./frontend/public/screenshots/create-deal-light.png)
![Create Deal Dark](./frontend/public/screenshots/create-deal-dark.png)
![Create Task Light](./frontend/public/screenshots/create-task-light.png)
![Create Task Dark](./frontend/public/screenshots/create-task-dark.png)
![Create Note Light](./frontend/public/screenshots/create-note-light.png)
![Create Note Dark](./frontend/public/screenshots/create-note-dark.png)


---

## ⚙️ Run Locally

### 1. Clone repo

```bash
git clone https://github.com/DariaSyanska/crm.git 
cd crm 
```

---

### 2. Backend

```bash
cd backend 
python3 -m venv .venv 
source .venv/bin/activate 
pip install -r requirements.txt 
uvicorn app.main:app --reload 
```

Backend:
http://127.0.0.1:8000

---

### 3. Frontend

```bash
cd frontend 
npm install 
npm run dev 
```

Frontend:
http://localhost:3000

---

## 🔐 Environment Variables

### Frontend (frontend/.env.local)

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

### Backend (backend/.env)

```env
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///./crm.db
```

---

## 📡 API Endpoints (Backend)

### Auth
- POST `/auth/login`
- POST `/auth/register`
- GET `/auth/me`

### Clients
- GET `/clients/`
- POST `/clients/`
- PUT `/clients/{id}`
- DELETE `/clients/{id}`

### Deals
- GET `/deals/`
- PUT `/deals/{id}` - update stage (used for drag & drop)

### Tasks
- GET `/tasks/`
- PATCH `/tasks/{id}/complete`

### Notes
- GET `/notes/`

---

## 👤 Demo Account

Use the following credentials:

- **Email:** `admin@example.com`
- **Password:** `123456`

---

## 📁 Project Structure

```bash
crm/
├── backend/
│   ├── app/
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── types/
│   ├── package.json
│   └── .env.local
│
└── README.md
```

---

## ✅ Production Build

```bash
cd frontend 
npm run build 
```

---

## 🧠 What This Project Shows

- Full-stack architecture (frontend + backend)
- Real SaaS patterns (dashboard, auth, CRUD)
- Advanced UI (drag & drop, charts, dark mode)
- API integration and state management
- Clean scalable component structure

---

## 🔮 Future Improvements

- Drag & drop reordering inside columns
- Role-based access (admin / manager)
- WebSocket real-time updates
- Notifications system
- Public demo mode

---

## 📝 Notes

This project is built for portfolio purposes and is not production-ready without additional security and scaling improvements.

> ⚠️ Backend is hosted on Render and may take ~30 seconds to wake up on first request.

---

## 🙌 Author

Daria Sianska  
Frontend / Fullstack Developer  

- GitHub: https://github.com/DariaSyanska
- Portfolio: https://dariasyanska.github.io/portfolio/
