from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app import models, schemas


def get_leads(
    db: Session,
    search: Optional[str] = None,
    follow_up_status: Optional[str] = None,
    event: Optional[str] = None
) -> List[models.EventLead]:
    query = db.query(models.EventLead)

    # Multi-field search
    if search and search.strip():
        search_pattern = f"%{search.strip()}%"
        query = query.filter(
            or_(
                models.EventLead.name.ilike(search_pattern),
                models.EventLead.company.ilike(search_pattern),
                models.EventLead.email.ilike(search_pattern),
                models.EventLead.event.ilike(search_pattern),
            )
        )

    # Exact status filter
    if follow_up_status and follow_up_status.strip():
        query = query.filter(models.EventLead.follow_up_status == follow_up_status.strip())

    # Exact event filter
    if event and event.strip():
        query = query.filter(models.EventLead.event == event.strip())

    return query.order_by(models.EventLead.updated_at.desc()).all()


def get_lead_by_id(db: Session, lead_id: int) -> Optional[models.EventLead]:
    return db.query(models.EventLead).filter(models.EventLead.id == lead_id).first()


def create_lead(db: Session, lead_in: schemas.LeadCreate) -> models.EventLead:
    db_lead = models.EventLead(
        name=lead_in.name.strip(),
        company=lead_in.company.strip(),
        email=lead_in.email.strip(),
        event=lead_in.event.strip(),
        notes=lead_in.notes.strip(),
        follow_up_status=lead_in.follow_up_status.strip(),
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    return db_lead


def update_lead(db: Session, lead_id: int, lead_in: schemas.LeadUpdate) -> Optional[models.EventLead]:
    db_lead = get_lead_by_id(db, lead_id)
    if not db_lead:
        return None

    update_data = lead_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if value is not None and isinstance(value, str):
            setattr(db_lead, field, value.strip())
        elif value is not None:
            setattr(db_lead, field, value)

    db_lead.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_lead)
    return db_lead


def delete_lead(db: Session, lead_id: int) -> bool:
    db_lead = get_lead_by_id(db, lead_id)
    if not db_lead:
        return False
    db.delete(db_lead)
    db.commit()
    return True


def get_unique_events(db: Session) -> List[str]:
    records = db.query(models.EventLead.event).distinct().all()
    return sorted([r[0] for r in records if r[0]])