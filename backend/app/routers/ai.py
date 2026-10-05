from fastapi import APIRouter
from app import schemas
from app.services import gemini_service

router = APIRouter(prefix="/api/ai", tags=["AI Assistance"])


@router.post("/summarize", response_model=schemas.AISummarizeResponse)
def summarize_lead_notes(payload: schemas.AISummarizeRequest):
    """Generate concise bulleted summary of lead notes."""
    result = gemini_service.summarize_notes(payload.notes)
    return {"summary": result}


@router.post("/follow-up", response_model=schemas.AIFollowUpResponse)
def draft_lead_follow_up(payload: schemas.AIFollowUpRequest):
    """Generate professional follow-up draft based on interaction notes."""
    result = gemini_service.generate_follow_up(
        name=payload.name,
        company=payload.company,
        event=payload.event,
        notes=payload.notes
    )
    return {"follow_up_message": result}