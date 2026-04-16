from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.note import Note
from app.schemas.note import NoteCreate, NoteUpdate, NoteResponse
from app.dependencies import get_current_user
from app.access import get_client_or_404, check_client_access, get_note_or_404

router = APIRouter(prefix="/notes", tags=["Notes"])


@router.post("/", response_model=NoteResponse)
def create_note(
    note: NoteCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    client = get_client_or_404(db, note.client_id)
    check_client_access(client, current_user)

    note_data = note.model_dump()

    if current_user.role != "admin":
        note_data["user_id"] = current_user.id

    db_note = Note(**note_data)
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note


@router.get("/", response_model=list[NoteResponse])
def list_notes(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role == "admin":
        return db.query(Note).all()

    return db.query(Note).filter(Note.user_id == current_user.id).all()


@router.get("/{note_id}", response_model=NoteResponse)
def get_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    note = get_note_or_404(db, note_id)
    client = get_client_or_404(db, note.client_id)
    check_client_access(client, current_user)

    if current_user.role != "admin" and note.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    return note


@router.put("/{note_id}", response_model=NoteResponse)
def update_note(
    note_id: int,
    data: NoteUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    note = get_note_or_404(db, note_id)
    client = get_client_or_404(db, note.client_id)
    check_client_access(client, current_user)

    if current_user.role != "admin" and note.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    update_data = data.model_dump(exclude_unset=True)

    if "client_id" in update_data:
        new_client = get_client_or_404(db, update_data["client_id"])
        check_client_access(new_client, current_user)

    if current_user.role != "admin":
        update_data["user_id"] = current_user.id

    for field, value in update_data.items():
        setattr(note, field, value)

    db.commit()
    db.refresh(note)
    return note


@router.delete("/{note_id}")
def delete_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    note = get_note_or_404(db, note_id)
    client = get_client_or_404(db, note.client_id)
    check_client_access(client, current_user)

    if current_user.role != "admin" and note.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    db.delete(note)
    db.commit()
    return {"message": "Note deleted"}