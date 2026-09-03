from sqlalchemy.orm import Session
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerUpdate

class CustomerRepository:
    @staticmethod
    def get_all_by_shop(db: Session, shop_id: int):
        return db.query(Customer).filter(Customer.shop_id == shop_id).all()

    @staticmethod
    def get_by_id(db: Session, customer_id: int, shop_id: int):
        return db.query(Customer).filter(Customer.id == customer_id, Customer.shop_id == shop_id).first()

    @staticmethod
    def create(db: Session, shop_id: int, customer_in: CustomerCreate):
        new_customer = Customer(**customer_in.model_dump(), shop_id=shop_id)
        db.add(new_customer)
        db.flush()
        db.refresh(new_customer)
        return new_customer

    @staticmethod
    def update(db: Session, customer: Customer, customer_in: CustomerUpdate):
        update_data = customer_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(customer, key, value)
        db.flush()
        db.refresh(customer)
        return customer

    @staticmethod
    def delete(db: Session, customer: Customer):
        db.delete(customer)
        db.flush()
