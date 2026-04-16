# CRM System

A full-stack CRM application built with **FastAPI** and **Next.js**.

## Features

- JWT authentication
- Role-based access (`admin`, `manager`)
- Clients management
- Deals pipeline
- Tasks management
- Notes management
- Dashboard with analytics
- Client details page
- Deal details page
- Modern CRM-style UI

## Tech Stack

### Backend
- FastAPI
- SQLAlchemy
- SQLite
- JWT authentication
- Uvicorn

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Axios
- Recharts

## Project Structure

```bash
crm/
├── backend/
│   ├── app/
│   ├── .env.example
│   ├── requirements.txt
│   └── crm.db
├── frontend/
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
└── README.md
