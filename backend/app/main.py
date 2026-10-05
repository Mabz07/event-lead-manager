import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import leads, ai

# Create database tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Event Lead Manager API",
    description="Backend services for managing conference and event leads with AI assistance.",
    version="1.0.0"
)

# CORS setup
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(leads.router)
app.include_router(ai.router)


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy", "service": "Event Lead Manager API"}