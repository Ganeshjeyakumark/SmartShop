from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timezone, timedelta
from app.database.database import get_db
from app.core.dependencies import get_current_shop
from app.models.shop import Shop
from app.models.bill import Bill
from app.models.product import Product
from decimal import Decimal

router = APIRouter()

@router.get("/summary")
def get_dashboard_summary(db: Session = Depends(get_db), current_shop: Shop = Depends(get_current_shop)):
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    # Today's sales & bills
    today_bills = db.query(Bill).filter(
        Bill.shop_id == current_shop.id, 
        Bill.created_at >= today_start
    ).all()
    today_sales = sum([b.total_amount for b in today_bills])
    today_count = len(today_bills)
    
    # This month's sales
    month_bills = db.query(Bill).filter(
        Bill.shop_id == current_shop.id, 
        Bill.created_at >= month_start
    ).all()
    month_sales = sum([b.total_amount for b in month_bills])
    
    # Total products and low stock
    products = db.query(Product).filter(Product.shop_id == current_shop.id).all()
    total_products = len(products)
    low_stock_products = len([p for p in products if p.stock_quantity <= p.low_stock_threshold])
    
    return {
        "today_sales": float(today_sales),
        "today_bills": today_count,
        "month_sales": float(month_sales),
        "total_products": total_products,
        "low_stock": low_stock_products
    }

@router.get("/sales")
def get_sales_chart(days: int = 7, db: Session = Depends(get_db), current_shop: Shop = Depends(get_current_shop)):
    now = datetime.now(timezone.utc)
    start_date = now - timedelta(days=days-1)
    start_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0)
    
    # Basic daily grouping
    bills = db.query(Bill).filter(
        Bill.shop_id == current_shop.id,
        Bill.created_at >= start_date
    ).all()
    
    chart_data = {}
    for i in range(days):
        d = (start_date + timedelta(days=i)).strftime("%Y-%m-%d")
        chart_data[d] = 0
        
    for bill in bills:
        d = bill.created_at.strftime("%Y-%m-%d")
        if d in chart_data:
            chart_data[d] += float(bill.total_amount)
            
    return [{"date": k, "sales": v} for k, v in chart_data.items()]

@router.get("/payment-summary")
def get_payment_summary(db: Session = Depends(get_db), current_shop: Shop = Depends(get_current_shop)):
    results = db.query(Bill.payment_method, func.sum(Bill.total_amount)).filter(
        Bill.shop_id == current_shop.id
    ).group_by(Bill.payment_method).all()
    
    return [{"name": row[0], "value": float(row[1] or 0)} for row in results]
