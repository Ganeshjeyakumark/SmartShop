from sqlalchemy.orm import Session
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate

class CategoryRepository:
    @staticmethod
    def get_all_by_shop(db: Session, shop_id: int):
        return db.query(Category).filter(Category.shop_id == shop_id).all()

    @staticmethod
    def get_by_id(db: Session, category_id: int, shop_id: int):
        return db.query(Category).filter(Category.id == category_id, Category.shop_id == shop_id).first()

    @staticmethod
    def create(db: Session, shop_id: int, category_in: CategoryCreate):
        new_category = Category(**category_in.model_dump(), shop_id=shop_id)
        db.add(new_category)
        db.flush()
        db.refresh(new_category)
        return new_category

    @staticmethod
    def update(db: Session, category: Category, category_in: CategoryUpdate):
        update_data = category_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(category, key, value)
        db.flush()
        db.refresh(category)
        return category

    @staticmethod
    def delete(db: Session, category: Category):
        db.delete(category)
        db.flush()
