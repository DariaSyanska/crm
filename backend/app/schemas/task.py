from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    status: str = "open"
    user_id: Optional[int] = None
    client_id: Optional[int] = None


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    status: Optional[str] = None
    user_id: Optional[int] = None
    client_id: Optional[int] = None


class TaskResponse(TaskBase):
    id: int

    class Config:
        from_attributes = True