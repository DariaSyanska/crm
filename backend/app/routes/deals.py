from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.deal import Deal
from app.schemas.deal import DealCreate, DealUpdate, DealResponse
from app.dependencies import get_current_user
from app.access import get_client_or_404, check_client_access, get_deal_or_404

router = APIRouter(prefix="/deals", tags=["Deals"])


@router.post("/", response_model=DealResponse)
def create_deal(
    deal: DealCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    client = get_client_or_404(db, deal.client_id)
    check_client_access(client, current_user)

    db_deal = Deal(**deal.model_dump())
    db.add(db_deal)
    db.commit()
    db.refresh(db_deal)
    return db_deal


@router.get("/", response_model=list[DealResponse])
def list_deals(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    query = db.query(Deal)

    if current_user.role == "admin":
        return query.all()

    return query.join(Deal.client).filter_by(manager_id=current_user.id).all()


@router.get("/{deal_id}", response_model=DealResponse)
def get_deal(
    deal_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    deal = get_deal_or_404(db, deal_id)
    client = get_client_or_404(db, deal.client_id)
    check_client_access(client, current_user)
    return deal


@router.put("/{deal_id}", response_model=DealResponse)
def update_deal(
    deal_id: int,
    data: DealUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    deal = get_deal_or_404(db, deal_id)
    old_client = get_client_or_404(db, deal.client_id)
    check_client_access(old_client, current_user)

    update_data = data.model_dump(exclude_unset=True)

    if "client_id" in update_data:
        new_client = get_client_or_404(db, update_data["client_id"])
        check_client_access(new_client, current_user)

    for field, value in update_data.items():
        setattr(deal, field, value)

    db.commit()
    db.refresh(deal)
    return deal


@router.delete("/{deal_id}")
def delete_deal(
    deal_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    deal = get_deal_or_404(db, deal_id)
    client = get_client_or_404(db, deal.client_id)
    check_client_access(client, current_user)

    db.delete(deal)
    db.commit()
    return {"message": "Deal deleted"}