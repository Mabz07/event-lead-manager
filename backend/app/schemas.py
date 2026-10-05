from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class LeadBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="Full contact name")
    company: str = Field(..., min_length=1, max_length=255, description="Company name")
    email: EmailStr = Field(..., description="Valid work/contact email")
    event: str = Field(..., min_length=1, max_length=255, description="Event name where met")
    notes: str = Field(..., min_length=1, description="Interaction notes")
    follow_up_status: str = Field(
        default="Not Contacted", 
        description="Current status: Not Contacted | Follow Up | Contacted | Completed"
    )


class LeadCreate(LeadBase):
    pass


class LeadUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    company: Optional[str] = Field(None, min_length=1, max_length=255)
    email: Optional[EmailStr] = None
    event: Optional[str] = Field(None, min_length=1, max_length=255)
    notes: Optional[str] = Field(None, min_length=1)
    follow_up_status: Optional[str] = None


class LeadResponse(LeadBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AISummarizeRequest(BaseModel):
    notes: str = Field(..., min_length=3, description="Interaction notes to be summarized")


class AISummarizeResponse(BaseModel):
    summary: str


class AIFollowUpRequest(BaseModel):
    name: str
    company: str
    event: str
    notes: str


class AIFollowUpResponse(BaseModel):
    follow_up_message: str