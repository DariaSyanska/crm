from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.init_db import init_db
from app.routes.users import router as users_router
from app.routes.clients import router as clients_router
from app.routes.deals import router as deals_router
from app.routes.tasks import router as tasks_router
from app.routes.notes import router as notes_router
from app.routes.auth import router as auth_router

app = FastAPI(title="CRM Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://crm-plum-phi.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(clients_router)
app.include_router(deals_router)
app.include_router(tasks_router)
app.include_router(notes_router)


@app.get("/")
def root():
    return {"message": "CRM backend is running"}