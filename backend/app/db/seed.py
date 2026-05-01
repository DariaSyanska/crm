from sqlalchemy.orm import Session

from app.models.user import User
from app.models.client import Client
from app.models.deal import Deal
from app.models.task import Task
from app.models.note import Note
from app.services.security import get_password_hash


def seed_demo_users(db: Session) -> tuple[User, User]:
    admin = db.query(User).filter(User.email == "admin@example.com").first()
    if not admin:
        admin = User(
            name="Admin",
            email="admin@example.com",
            password_hash=get_password_hash("123456"),
            role="admin",
        )
        db.add(admin)

    manager = db.query(User).filter(User.email == "manager@example.com").first()
    if not manager:
        manager = User(
            name="Manager One",
            email="manager@example.com",
            password_hash=get_password_hash("123456"),
            role="manager",
        )
        db.add(manager)

    db.commit()
    db.refresh(admin)
    db.refresh(manager)

    return admin, manager


def seed_demo_data(db: Session) -> None:
    existing_client = db.query(Client).first()
    if existing_client:
        return

    admin, manager = seed_demo_users(db)

    anna = Client(
        name="Anna Novak",
        email="anna.novak@email.com",
        phone="+420777123456",
        company="Novak Marketing",
        status="active",
        manager_id=manager.id,
    )

    serhii = Client(
        name="Serhii Safarov",
        email="serhii.safarov@email.com",
        phone="+420777888999",
        company="Safarov FC",
        status="lead",
        manager_id=manager.id,
    )

    db.add_all([anna, serhii])
    db.commit()
    db.refresh(anna)
    db.refresh(serhii)

    deal1 = Deal(
        title="Website Redesign",
        amount=2500,
        stage="lead",
        client_id=anna.id,
    )

    deal2 = Deal(
        title="Sponsorship Package",
        amount=10000,
        stage="negotiation",
        client_id=serhii.id,
    )

    deal3 = Deal(
        title="Social Media Campaign",
        amount=1500,
        stage="won",
        client_id=anna.id,
    )

    db.add_all([deal1, deal2, deal3])
    db.commit()

    task1 = Task(
        title="Call Anna Novak",
        description="Discuss redesign requirements",
        status="open",
        client_id=anna.id,
        user_id=manager.id,
    )

    task2 = Task(
        title="Prepare sponsorship proposal",
        description="For Safarov FC",
        status="in_progress",
        client_id=serhii.id,
        user_id=manager.id,
    )

    task3 = Task(
        title="Send final invoice",
        description="Campaign completed",
        status="done",
        client_id=anna.id,
        user_id=manager.id,
    )

    db.add_all([task1, task2, task3])
    db.commit()

    note1 = Note(
        text="Interested in redesign, budget confirmed.",
        client_id=anna.id,
        user_id=manager.id,
    )

    note2 = Note(
        text="Wants sponsorship exposure before season start.",
        client_id=serhii.id,
        user_id=manager.id,
    )

    db.add_all([note1, note2])
    db.commit()