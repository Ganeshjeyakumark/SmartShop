from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.shop import ShopResponse, ShopUpdate
from app.core.dependencies import get_current_shop
from app.models.shop import Shop
from app.repositories.shop_repository import ShopRepository

router = APIRouter()

@router.get("/profile", response_model=ShopResponse)
def get_shop_profile(current_shop: Shop = Depends(get_current_shop)):
    return current_shop

@router.put("/profile", response_model=ShopResponse)
def update_shop_profile(shop_in: ShopUpdate, current_shop: Shop = Depends(get_current_shop), db: Session = Depends(get_db)):
    update_data = shop_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_shop, field, value)
    
    ShopRepository.update_shop(db, current_shop)
    db.commit()
    db.refresh(current_shop)
    return current_shop
