from sqlalchemy.orm import Session

from app.models.user import User
from app.services.security import get_password_hash


def seed_demo_users(db: Session) -> None:
    admin = db.query(User).filter(User.email == "admin@example.com").first()
    if not admin:
        admin = User(
            name="Admin",
            email="admin@example.com",
            hashed_password=get_password_hash("123456"),
            role="admin",
        )
        db.add(admin)

    manager = db.query(User).filter(User.email == "manager@example.com").first()
    if not manager:
        manager = User(
            name="Manager One",
            email="manager@example.com",
            hashed_password=get_password_hash("123456"),
            role="manager",
        )
        db.add(manager)

    db.commit()