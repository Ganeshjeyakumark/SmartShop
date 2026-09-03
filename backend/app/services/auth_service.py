from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.schemas.auth import UserRegister
from app.models.user import User
from app.models.shop import Shop

from app.repositories.user_repository import UserRepository
from app.repositories.shop_repository import ShopRepository

from app.core.security import get_password_hash


class AuthService:

    @staticmethod
    def register_user_and_shop(
        db: Session,
        user_in: UserRegister
    ):

        # 1. Password confirmation
        if user_in.password != user_in.confirm_password:
            raise HTTPException(
                status_code=400,
                detail="Passwords do not match"
            )

        # 2. Check duplicate email
        existing_user = UserRepository.get_user_by_email(
            db,
            user_in.email
        )

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )

        try:
            # 3. Hash password
            hashed_password = get_password_hash(
                user_in.password
            )

            # 4. Create User
            new_user = User(
                name=user_in.owner_name,
                email=user_in.email,
                password_hash=hashed_password
            )

            created_user = UserRepository.create_user(
                db,
                new_user
            )

            # 5. Create Shop
            new_shop = Shop(
                owner_id=created_user.id,
                shop_name=user_in.shop_name,
                phone=user_in.phone,
                email=user_in.email,
                address=user_in.address,
                city=user_in.city,
                state=user_in.state,
                pincode=user_in.pincode
            )

            ShopRepository.create_shop(
                db,
                new_shop
            )

            # 6. Commit BOTH together
            db.commit()

            return True

        except HTTPException:
            db.rollback()
            raise

        except Exception:
            db.rollback()

            raise HTTPException(
                status_code=500,
                detail="Registration failed"
            )