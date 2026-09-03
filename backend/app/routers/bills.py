from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.schemas.bill import BillCreate, BillResponse
from app.core.dependencies import get_current_shop
from app.models.shop import Shop
from app.services.billing_service import BillingService
from app.repositories.bill_repository import BillRepository

router = APIRouter()

@router.post("/", response_model=BillResponse, status_code=status.HTTP_201_CREATED)
def create_bill(bill_in: BillCreate, db: Session = Depends(get_db), current_shop: Shop = Depends(get_current_shop)):
    return BillingService.create_bill(db, current_shop, bill_in)

@router.get("/", response_model=List[BillResponse])
def get_bills(db: Session = Depends(get_db), current_shop: Shop = Depends(get_current_shop)):
    return BillRepository.get_all_by_shop(db, current_shop.id)

@router.get("/{bill_id}", response_model=BillResponse)
def get_bill(bill_id: int, db: Session = Depends(get_db), current_shop: Shop = Depends(get_current_shop)):
    bill = BillRepository.get_by_id(db, bill_id, current_shop.id)
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")
    return bill
