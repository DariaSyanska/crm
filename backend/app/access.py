from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.client import Client
from app.models.deal import Deal
from app.models.task import Task
from app.models.note import Note


def get_client_or_404(db: Session, client_id: int) -> Client:
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client


def check_client_access(client: Client, current_user):
    if current_user.role != "admin" and client.manager_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")


def get_deal_or_404(db: Session, deal_id: int) -> Deal:
    deal = db.query(Deal).filter(Deal.id == deal_id).first()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    return deal


def get_task_or_404(db: Session, task_id: int) -> Task:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


def get_note_or_404(db: Session, note_id: int) -> Note:
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note