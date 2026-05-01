# CRM SaaS (Frontend + Backend)

Full-stack CRM application for managing clients, deals, tasks, and sales pipeline activity.

This is a non-commercial portfolio demo project built to showcase full-stack development skills, CRM logic, authentication, dashboard analytics, and clean SaaS-style UI.

## 🚀 Features

- Authentication: login, register, JWT access token, refresh token
- Auto logout when session expires
- Dashboard with analytics cards
- Deals by stage chart
- Revenue overview
- Recent activity section
- Clients management: create, edit, delete, search, filters
- Deals pipeline with Kanban-style view
- Tasks management with status filters and “My Tasks”
- Empty states for clients, deals, and tasks
- Skeleton loading for dashboard
- Responsive SaaS-style UI

## 🛠 Tech Stack

### Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Axios
- Recharts
- Sonner

### Backend

- FastAPI
- SQLAlchemy
- PostgreSQL / SQLite for local development
- JWT Auth
- Pydantic
- Uvicorn

## 📸 Screenshots

```md
![Dashboard](./screenshots/dashboard.png)
![Clients](./screenshots/clients.png)
![Deals](./screenshots/deals.png)
![Tasks](./screenshots/tasks.png)
```

## ⚙️ Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/DariaSyanska/crm.git
cd crm-saas
```

### 2. Backend setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python3 -m uvicorn app.main:app --reload
```

Backend will run on:

```txt
http://127.0.0.1:8000
```

### 3. Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

```txt
http://localhost:3000
```

## 🔐 Environment Variables

Create `.env.local` inside the `frontend` folder:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Create `.env` inside the `backend` folder:

```env
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///./crm.db
```

## 👤 Demo Account

```txt
Email: admin@example.com
Password: 123456
```

## 📁 Project Structure

```txt
crm/
├── backend/
│   ├── app/
│   ├── requirements.txt
│   └── .env.example
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

## ✅ Build Check

```bash
cd frontend
npm run build
```

The project should compile successfully without TypeScript errors.

## 📝 Note

This project is created for portfolio purposes and is not intended for commercial use without additional production security improvements.
