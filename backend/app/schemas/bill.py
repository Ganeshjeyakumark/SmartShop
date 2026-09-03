from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional
from decimal import Decimal
from datetime import datetime

class BillItemBase(BaseModel):
    product_id: Optional[int] = None
    product_name: str
    quantity: int = Field(gt=0)
    unit_price: Decimal = Field(gt=0)

class BillItemCreate(BillItemBase):
    pass

class BillItemResponse(BillItemBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    bill_id: int
    total_price: Decimal

class BillBase(BaseModel):
    customer_id: Optional[int] = None
    discount: Decimal = Field(default=Decimal('0.00'), ge=0)
    tax: Decimal = Field(default=Decimal('0.00'), ge=0)
    payment_method: str
    notes: Optional[str] = None

class BillCreate(BillBase):
    items: List[BillItemCreate]

class BillResponse(BillBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    shop_id: int
    bill_number: str
    subtotal: Decimal
    total_amount: Decimal
    created_at: datetime
    items: List[BillItemResponse] = Field(default_factory=list)
