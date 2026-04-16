from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class NoteBase(BaseModel):
    client_id: int
    user_id: Optional[int] = None
    text: str


class NoteCreate(NoteBase):
    pass


class NoteUpdate(BaseModel):
    client_id: Optional[int] = None
    user_id: Optional[int] = None
    text: Optional[str] = None


class NoteResponse(NoteBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True