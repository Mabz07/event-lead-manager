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

# Open CORS to allow Vercel and local development seamlessly
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, including your Vercel deployment
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allows all headers
)
# Register routers
app.include_router(leads.router)
app.include_router(ai.router)


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy", "service": "Event Lead Manager API"}