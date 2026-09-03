from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.auth import UserRegister, LoginResponse
from app.services.auth_service import AuthService
from app.repositories.user_repository import UserRepository
from app.repositories.shop_repository import ShopRepository
from app.core.security import verify_password, create_access_token
from app.core.dependencies import get_current_user
from app.schemas.user import UserResponse

router = APIRouter()

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    AuthService.register_user_and_shop(db, user_in)
    return {"message": "User and Shop registered successfully"}

@router.post("/login", response_model=LoginResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = UserRepository.get_user_by_email(db, form_data.username)
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")

    access_token = create_access_token(subject=user.id)
    shop = ShopRepository.get_shop_by_owner_id(db, user.id)
    if shop is None:
        raise HTTPException(status_code=404, detail="Shop not found for this user")
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user,
        "shop": shop
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user = Depends(get_current_user)):
    return current_user
