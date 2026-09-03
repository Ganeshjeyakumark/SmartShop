from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

BACKEND_DIR = Path(__file__).resolve().parents[2]
CA_CERTIFICATE_PATH = BACKEND_DIR / "certs" / "ca.pem"

if not CA_CERTIFICATE_PATH.is_file():
    raise FileNotFoundError(
        f"Aiven CA certificate not found at {CA_CERTIFICATE_PATH}. "
        "Ensure backend/certs/ca.pem is present."
    )

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"ssl": {"ca": str(CA_CERTIFICATE_PATH)}},
    pool_pre_ping=True,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
