from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate

class ProductRepository:
    @staticmethod
    def get_all_by_shop(db: Session, shop_id: int, search: str = None, category_id: int = None, low_stock: bool = False):
        query = db.query(Product).filter(Product.shop_id == shop_id)
        
        if search:
            query = query.filter(
                or_(
                    Product.name.ilike(f"%{search}%"),
                    Product.sku.ilike(f"%{search}%"),
                    Product.barcode.ilike(f"%{search}%")
                )
            )
        if category_id:
            query = query.filter(Product.category_id == category_id)
        if low_stock:
            query = query.filter(Product.stock_quantity <= Product.low_stock_threshold)
            
        return query.all()

    @staticmethod
    def get_by_id(db: Session, product_id: int, shop_id: int):
        return db.query(Product).filter(Product.id == product_id, Product.shop_id == shop_id).first()

    @staticmethod
    def create(db: Session, shop_id: int, product_in: ProductCreate):
        new_product = Product(**product_in.model_dump(), shop_id=shop_id)
        db.add(new_product)
        db.flush()
        db.refresh(new_product)
        return new_product

    @staticmethod
    def update(db: Session, product: Product, product_in: ProductUpdate):
        update_data = product_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(product, key, value)
        db.flush()
        db.refresh(product)
        return product

    @staticmethod
    def delete(db: Session, product: Product):
        db.delete(product)
        db.flush()
