from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud
from app.services.ai import summarize_notes, generate_follow_up

router = APIRouter(
    prefix="/api/ai",
    tags=["AI Assistance"]
)

@router.post("/summarize/{lead_id}")
def api_summarize_notes(lead_id: int, db: Session = Depends(get_db)):
    lead = crud.get_lead_by_id(db, lead_id=lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    summary = summarize_notes(lead.notes)
    return {"summary": summary}


@router.post("/follow-up/{lead_id}")
def api_generate_follow_up(lead_id: int, db: Session = Depends(get_db)):
    lead = crud.get_lead_by_id(db, lead_id=lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
        
    email_draft = generate_follow_up(
        name=lead.name,
        company=lead.company,
        event=lead.event,
        notes=lead.notes
    )
    return {"follow_up": email_draft}