import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# Read from Render environment, with your Supabase URL as a reliable fallback
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres.lfeljqjmockoqsmwahwk:btsarmyseven13@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres?sslmode=require"
)

# Fix postgres:// scheme for SQLAlchemy
DATABASE_URL = DATABASE_URL.strip().strip('"').strip("'")
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()