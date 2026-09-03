from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from app.database.base import Base

class StockTransaction(Base):
    __tablename__ = "stock_transactions"

    id = Column(Integer, primary_key=True, index=True)
    shop_id = Column(Integer, ForeignKey("shops.id"), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    transaction_type = Column(String(50), nullable=False) # PURCHASE, SALE, ADJUSTMENT, RETURN
    quantity = Column(Integer, nullable=False)
    reference_bill_id = Column(Integer, ForeignKey("bills.id"), nullable=True)
    note = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
