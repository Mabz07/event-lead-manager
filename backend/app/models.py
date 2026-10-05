from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from app.database import Base


class EventLead(Base):
    __tablename__ = "event_leads"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False, index=True)
    company = Column(String(255), nullable=False, index=True)
    email = Column(String(255), nullable=False, index=True)
    event = Column(String(255), nullable=False, index=True)
    notes = Column(Text, nullable=False)
    follow_up_status = Column(String(50), nullable=False, default="Not Contacted", index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)