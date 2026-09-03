from pydantic import BaseModel, EmailStr, model_validator

from app.schemas.shop import ShopResponse
from app.schemas.user import UserResponse


class UserRegister(BaseModel):
    owner_name: str
    email: EmailStr
    password: str
    confirm_password: str

    shop_name: str
    phone: str
    address: str
    city: str
    state: str
    pincode: str

    @model_validator(mode="after")
    def validate_passwords(self):
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match")
        return self


class Token(BaseModel):
    access_token: str
    token_type: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
    shop: ShopResponse