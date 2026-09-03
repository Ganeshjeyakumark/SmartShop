from sqlalchemy.orm import Session
from app.models.bill import Bill
from app.models.bill_item import BillItem
from app.models.shop import Shop

class BillRepository:
    @staticmethod
    def get_next_bill_number(db: Session, shop_id: int, prefix: str) -> str:
        count = db.query(Bill).filter(Bill.shop_id == shop_id).count()
        return f"{prefix}{(count + 1):06d}"

    @staticmethod
    def create_bill_record(db: Session, bill: Bill) -> Bill:
        db.add(bill)
        db.flush()
        return bill
        
    @staticmethod
    def get_all_by_shop(db: Session, shop_id: int):
        return db.query(Bill).filter(Bill.shop_id == shop_id).order_by(Bill.created_at.desc()).all()
        
    @staticmethod
    def get_by_id(db: Session, bill_id: int, shop_id: int):
        return db.query(Bill).filter(Bill.id == bill_id, Bill.shop_id == shop_id).first()
