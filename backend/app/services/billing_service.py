from sqlalchemy.orm import Session
from fastapi import HTTPException
from decimal import Decimal
from app.schemas.bill import BillCreate
from app.models.bill import Bill
from app.models.bill_item import BillItem
from app.models.product import Product
from app.models.customer import Customer
from app.models.shop import Shop
from app.models.stock_transaction import StockTransaction
from app.repositories.bill_repository import BillRepository

class BillingService:
    @staticmethod
    def create_bill(db: Session, shop: Shop, bill_in: BillCreate) -> Bill:
        subtotal = Decimal('0.00')
        bill_items = []
        
        # We need the bill instance first to attach items and stock transactions. 
        # We generate a bill number first.
        if bill_in.customer_id is not None:
            customer = db.query(Customer).filter(
                Customer.id == bill_in.customer_id,
                Customer.shop_id == shop.id,
            ).first()
            if not customer:
                raise HTTPException(status_code=404, detail="Customer not found in this shop")

        bill_number = BillRepository.get_next_bill_number(
            db, shop.id, shop.invoice_prefix or "INV-"
        )
        
        new_bill = Bill(
            shop_id=shop.id,
            customer_id=bill_in.customer_id,
            bill_number=bill_number,
            subtotal=Decimal('0.00'), # Placeholder
            discount=bill_in.discount,
            tax=bill_in.tax,
            total_amount=Decimal('0.00'), # Placeholder
            payment_method=bill_in.payment_method,
            notes=bill_in.notes
        )
        
        db.add(new_bill)
        db.flush() # Get new_bill.id

        try:
            for item_in in bill_in.items:
                item_total = item_in.unit_price * item_in.quantity
                subtotal += item_total
                
                # Create Bill Item
                db_item = BillItem(
                    bill_id=new_bill.id,
                    product_id=item_in.product_id,
                    product_name=item_in.product_name,
                    quantity=item_in.quantity,
                    unit_price=item_in.unit_price,
                    total_price=item_total
                )
                db.add(db_item)
                
                # If it's an existing product, deduct stock
                if item_in.product_id is not None:
                    # Lock row for update
                    product = db.query(Product).filter(Product.id == item_in.product_id, Product.shop_id == shop.id).with_for_update().first()
                    if not product:
                        raise HTTPException(status_code=404, detail=f"Product {item_in.product_id} not found in this shop")
                    
                    if (product.stock_quantity or 0) < item_in.quantity:
                        raise HTTPException(status_code=400, detail=f"Insufficient stock for {product.name}. Available: {product.stock_quantity}")
                    
                    product.stock_quantity -= item_in.quantity
                    
                    # Log stock transaction
                    stock_tx = StockTransaction(
                        shop_id=shop.id,
                        product_id=product.id,
                        transaction_type="SALE",
                        quantity=-item_in.quantity,
                        reference_bill_id=new_bill.id,
                        note=f"Sale via Bill {bill_number}"
                    )
                    db.add(stock_tx)
            
            # Calculate final total
            new_bill.subtotal = subtotal
            new_bill.total_amount = subtotal - bill_in.discount + bill_in.tax
            
            if new_bill.total_amount < 0:
                raise HTTPException(status_code=400, detail="Total amount cannot be negative")
                
            db.commit()
            db.refresh(new_bill)
            return new_bill

        except Exception as e:
            db.rollback()
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(status_code=500, detail="Error creating bill")
