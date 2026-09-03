from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from app.core.dependencies import get_current_shop
from app.models.shop import Shop
from app.repositories.category_repository import CategoryRepository

router = APIRouter()

@router.get("/", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db), current_shop: Shop = Depends(get_current_shop)):
    return CategoryRepository.get_all_by_shop(db, shop_id=current_shop.id)

@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(category_in: CategoryCreate, db: Session = Depends(get_db), current_shop: Shop = Depends(get_current_shop)):
    category = CategoryRepository.create(db, shop_id=current_shop.id, category_in=category_in)
    db.commit()
    return category

@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(category_id: int, category_in: CategoryUpdate, db: Session = Depends(get_db), current_shop: Shop = Depends(get_current_shop)):
    category = CategoryRepository.get_by_id(db, category_id, current_shop.id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    category = CategoryRepository.update(db, category, category_in)
    db.commit()
    return category

@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(category_id: int, db: Session = Depends(get_db), current_shop: Shop = Depends(get_current_shop)):
    category = CategoryRepository.get_by_id(db, category_id, current_shop.id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    CategoryRepository.delete(db, category)
    db.commit()
