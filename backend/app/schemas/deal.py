from decimal import Decimal
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class DealBase(BaseModel):
    client_id: int
    title: str
    amount: Decimal = Decimal("0.00")
    stage: str = "lead"


class DealCreate(DealBase):
    pass


class DealUpdate(BaseModel):
    client_id: Optional[int] = None
    title: Optional[str] = None
    amount: Optional[Decimal] = None
    stage: Optional[str] = None


class DealResponse(DealBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True