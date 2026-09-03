from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.schemas.customer import CustomerCreate, CustomerUpdate, CustomerResponse
from app.core.dependencies import get_current_shop
from app.models.shop import Shop
from app.repositories.customer_repository import CustomerRepository

router = APIRouter()

@router.get("/", response_model=List[CustomerResponse])
def get_customers(db: Session = Depends(get_db), current_shop: Shop = Depends(get_current_shop)):
    return CustomerRepository.get_all_by_shop(db, current_shop.id)

@router.post("/", response_model=CustomerResponse, status_code=status.HTTP_201_CREATED)
def create_customer(customer_in: CustomerCreate, db: Session = Depends(get_db), current_shop: Shop = Depends(get_current_shop)):
    customer = CustomerRepository.create(db, current_shop.id, customer_in)
    db.commit()
    return customer

@router.put("/{customer_id}", response_model=CustomerResponse)
def update_customer(customer_id: int, customer_in: CustomerUpdate, db: Session = Depends(get_db), current_shop: Shop = Depends(get_current_shop)):
    customer = CustomerRepository.get_by_id(db, customer_id, current_shop.id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    customer = CustomerRepository.update(db, customer, customer_in)
    db.commit()
    return customer

@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer(customer_id: int, db: Session = Depends(get_db), current_shop: Shop = Depends(get_current_shop)):
    customer = CustomerRepository.get_by_id(db, customer_id, current_shop.id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    CustomerRepository.delete(db, customer)
    db.commit()
