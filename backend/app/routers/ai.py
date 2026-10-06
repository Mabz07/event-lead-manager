from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from app.services.ai import summarize_notes, generate_follow_up

router = APIRouter(
    prefix="/api/ai",
    tags=["AI Assistance"]
)

class SummarizeRequest(BaseModel):
    notes: str

class FollowUpRequest(BaseModel):
    name: str
    company: str
    event: str
    notes: str

@router.post("/summarize")
def api_summarize_notes(payload: SummarizeRequest):
    try:
        summary = summarize_notes(payload.notes)
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/follow-up")
def api_generate_follow_up(payload: FollowUpRequest):
    try:
        email_draft = generate_follow_up(
            name=payload.name,
            company=payload.company,
            event=payload.event,
            notes=payload.notes
        )
        return {"follow_up": email_draft}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )