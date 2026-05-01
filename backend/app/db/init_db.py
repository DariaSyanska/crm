from app.db.session import Base, engine, SessionLocal
from app.db.seed import seed_demo_users, seed_demo_data

from app.models.user import User
from app.models.client import Client
from app.models.deal import Deal
from app.models.task import Task
from app.models.note import Note


def init_db() -> None:
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        seed_demo_users(db)
        seed_demo_data(db)
    finally:
        db.close()