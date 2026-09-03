from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.database import get_db
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from app.core.dependencies import get_current_shop
from app.models.shop import Shop
from app.repositories.product_repository import ProductRepository
from app.repositories.category_repository import CategoryRepository

router = APIRouter()

@router.get("/", response_model=List[ProductResponse])
def get_products(
    search: Optional[str] = None,
    category_id: Optional[int] = None,
    low_stock: bool = False,
    db: Session = Depends(get_db),
    current_shop: Shop = Depends(get_current_shop)
):
    return ProductRepository.get_all_by_shop(db, current_shop.id, search, category_id, low_stock)

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db), current_shop: Shop = Depends(get_current_shop)):
    product = ProductRepository.get_by_id(db, product_id, current_shop.id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(product_in: ProductCreate, db: Session = Depends(get_db), current_shop: Shop = Depends(get_current_shop)):
    if product_in.category_id:
        category = CategoryRepository.get_by_id(db, product_in.category_id, current_shop.id)
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
    product = ProductRepository.create(db, current_shop.id, product_in)
    db.commit()
    return product

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(product_id: int, product_in: ProductUpdate, db: Session = Depends(get_db), current_shop: Shop = Depends(get_current_shop)):
    product = ProductRepository.get_by_id(db, product_id, current_shop.id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if product_in.category_id:
        category = CategoryRepository.get_by_id(db, product_in.category_id, current_shop.id)
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
            
    product = ProductRepository.update(db, product, product_in)
    db.commit()
    return product

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db), current_shop: Shop = Depends(get_current_shop)):
    product = ProductRepository.get_by_id(db, product_id, current_shop.id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    ProductRepository.delete(db, product)
    db.commit()
