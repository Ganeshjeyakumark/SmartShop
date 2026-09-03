from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional

class ShopBase(BaseModel):
    shop_name: str
    phone: str
    email: EmailStr
    address: str
    city: str
    state: str
    pincode: str
    gst_number: Optional[str] = None
    invoice_prefix: Optional[str] = "INV-"

class ShopCreate(ShopBase):
    pass

class ShopUpdate(BaseModel):
    shop_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    gst_number: Optional[str] = None
    invoice_prefix: Optional[str] = None

class ShopResponse(ShopBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_id: int
