from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import schemas, crud

router = APIRouter(prefix="/api/leads", tags=["Leads"])


@router.get("", response_model=List[schemas.LeadResponse])
def read_leads(
    search: Optional[str] = Query(None, description="Search across name, company, email, event"),
    follow_up_status: Optional[str] = Query(None, description="Filter by follow-up status"),
    event: Optional[str] = Query(None, description="Filter by event name"),
    db: Session = Depends(get_db)
):
    """Retrieve all leads with optional search and filtering."""
    return crud.get_leads(db=db, search=search, follow_up_status=follow_up_status, event=event)


@router.get("/events", response_model=List[str])
def get_all_events(db: Session = Depends(get_db)):
    """Retrieve list of distinct event names for filter dropdowns."""
    return crud.get_unique_events(db=db)


@router.get("/{lead_id}", response_model=schemas.LeadResponse)
def read_lead(lead_id: int, db: Session = Depends(get_db)):
    """Fetch single lead by ID."""
    lead = crud.get_lead_by_id(db=db, lead_id=lead_id)
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Lead with ID {lead_id} not found."
        )
    return lead


@router.post("", response_model=schemas.LeadResponse, status_code=status.HTTP_201_CREATED)
def create_new_lead(lead_in: schemas.LeadCreate, db: Session = Depends(get_db)):
    """Create a new event lead."""
    return crud.create_lead(db=db, lead_in=lead_in)


@router.put("/{lead_id}", response_model=schemas.LeadResponse)
def update_existing_lead(
    lead_id: int, 
    lead_in: schemas.LeadUpdate, 
    db: Session = Depends(get_db)
):
    """Update lead details."""
    updated = crud.update_lead(db=db, lead_id=lead_id, lead_in=lead_in)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Lead with ID {lead_id} not found."
        )
    return updated


@router.delete("/{lead_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_lead(lead_id: int, db: Session = Depends(get_db)):
    """Delete a lead permanently."""
    success = crud.delete_lead(db=db, lead_id=lead_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Lead with ID {lead_id} not found."
        )
    return None