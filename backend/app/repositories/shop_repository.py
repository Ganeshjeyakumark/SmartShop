from sqlalchemy.orm import Session
from app.models.shop import Shop

class ShopRepository:
    @staticmethod
    def get_shop_by_owner_id(db: Session, owner_id: int) -> Shop | None:
        return db.query(Shop).filter(Shop.owner_id == owner_id).first()

    @staticmethod
    def create_shop(db: Session, shop: Shop) -> Shop:
        db.add(shop)
        db.flush()
        return shop
        
    @staticmethod
    def update_shop(db: Session, shop: Shop) -> Shop:
        db.add(shop)
        db.flush()
        return shop
