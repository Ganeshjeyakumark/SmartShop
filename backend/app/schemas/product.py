from pydantic import BaseModel, ConfigDict
from typing import Optional
from decimal import Decimal
from datetime import datetime
from .category import CategoryResponse

class ProductBase(BaseModel):
    name: str
    category_id: Optional[int] = None
    sku: Optional[str] = None
    barcode: Optional[str] = None
    selling_price: Decimal
    purchase_price: Optional[Decimal] = None
    stock_quantity: int = 0
    low_stock_threshold: int = 5
    unit: str = "pcs"
    is_active: bool = True

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category_id: Optional[int] = None
    sku: Optional[str] = None
    barcode: Optional[str] = None
    selling_price: Optional[Decimal] = None
    purchase_price: Optional[Decimal] = None
    stock_quantity: Optional[int] = None
    low_stock_threshold: Optional[int] = None
    unit: Optional[str] = None
    is_active: Optional[bool] = None

class ProductResponse(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    shop_id: int
    created_at: datetime
    updated_at: datetime
