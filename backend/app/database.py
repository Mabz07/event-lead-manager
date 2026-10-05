import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# 1. Locate .env in backend/
BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"

print(f"\n================ DATABASE DEBUG ================")
print(f"Target .env path: {ENV_PATH}")
print(f"File exists: {ENV_PATH.exists()}")

# Try standard dotenv first
load_dotenv(dotenv_path=ENV_PATH)
DATABASE_URL = os.getenv("postgresql://postgres.lfeljqjmockoqsmwahwk:btsarmyseven13@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres?sslmode=require")

# 2. If dotenv failed, manually read across Windows encodings (UTF-8, UTF-16 LE, etc.)
if not DATABASE_URL and ENV_PATH.exists():
    for enc in ["utf-8", "utf-8-sig", "utf-16", "utf-16-le", "cp1252"]:
        try:
            content = ENV_PATH.read_text(encoding=enc)
            for line in content.splitlines():
                line = line.strip()
                if line.startswith("DATABASE_URL="):
                    DATABASE_URL = line.split("=", 1)[1].strip().strip('"').strip("'")
                    os.environ["DATABASE_URL"] = DATABASE_URL
                    print(f"Successfully decoded .env using encoding: {enc}")
                    break
            if DATABASE_URL:
                break
        except Exception:
            continue

if not DATABASE_URL:
    print(f"[FAILED] Could not read DATABASE_URL from {ENV_PATH}")
    print("================================================\n")
    raise ValueError(
        f"DATABASE_URL could not be read from {ENV_PATH}.\n"
        "Please verify that the file contains: DATABASE_URL=postgresql://..."
    )

print(f"[SUCCESS] DATABASE_URL detected: {DATABASE_URL[:32]}...")
print("================================================\n")

# Supabase URL adjustments
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