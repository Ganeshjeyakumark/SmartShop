# SmartShop Billing

SmartShop Billing is a complete full-stack web application designed for small retail shops to manage their billing, inventory, and sales. It allows shop owners to easily generate customer bills, keep track of stock, and print receipts using thermal printers.

## Project Structure

```
SmartShop/
├── backend/            # FastAPI backend
│   ├── app/
│   │   ├── main.py     # Application entrypoint
│   │   ├── core/       # Configuration
│   │   ├── database/   # Database connection & setup
│   │   └── models/     # SQLAlchemy models
│   ├── alembic/        # Database migrations
│   ├── alembic.ini     # Alembic config
│   └── requirements.txt
├── frontend/           # React + Vite + Tailwind frontend
│   ├── src/
│   ├── package.json
│   └── tailwind.config.js
└── docker-compose.yml  # MySQL local database
```

## Setup Instructions

### 1. Database Setup
Ensure you have Docker installed and run:
```sh
docker-compose up -d
```
This will start a MySQL 8.0 instance on port 3306.

### 2. Backend Setup
Navigate to the `backend` directory and set up a virtual environment:
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Run database migrations to create tables:
```powershell
alembic revision --autogenerate -m "initial_schema"
alembic upgrade head
```

Run the server:
```powershell
uvicorn app.main:app --reload
```

### 3. Frontend Setup
Navigate to the `frontend` directory:
```powershell
cd frontend
npm install
npm run dev
```

The React app will be available at http://localhost:5173.
The FastAPI backend will be available at http://localhost:8000.
