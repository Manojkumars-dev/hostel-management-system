from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import datetime

from database import get_db
import models

router = APIRouter()

class RoomCreate(BaseModel):
    room_number: str
    capacity: int
    price_per_month: float

class BedCreate(BaseModel):
    room_id: int
    bed_number: str

@router.post("/rooms")
def create_room(room: RoomCreate, db: Session = Depends(get_db)):
    db_room = models.Room(**room.model_dump())
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    return db_room

@router.get("/rooms")
def get_rooms(db: Session = Depends(get_db)):
    return db.query(models.Room).all()

@router.post("/beds")
def create_bed(bed: BedCreate, db: Session = Depends(get_db)):
    room = db.query(models.Room).filter(models.Room.id == bed.room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    # check capacity
    current_beds = db.query(models.Bed).filter(models.Bed.room_id == room.id).count()
    if current_beds >= room.capacity:
        raise HTTPException(status_code=400, detail="Room capacity reached")

    db_bed = models.Bed(**bed.model_dump())
    db.add(db_bed)
    db.commit()
    db.refresh(db_bed)
    return db_bed

@router.get("/allocations")
def get_all_allocations(db: Session = Depends(get_db)):
    return db.query(models.Allocation).all()

@router.post("/billing/generate")
def generate_monthly_bills(month: str, db: Session = Depends(get_db)):
    # Find all active allocations
    allocations = db.query(models.Allocation).filter(
        models.Allocation.end_date == None
    ).all()
    
    invoices = []
    for alloc in allocations:
        # Check if invoice already exists for this student for this month
        existing = db.query(models.Invoice).filter(
            models.Invoice.student_id == alloc.student_id,
            models.Invoice.month == month
        ).first()
        
        if not existing:
            # get room price
            bed = db.query(models.Bed).filter(models.Bed.id == alloc.bed_id).first()
            if bed:
                room = db.query(models.Room).filter(models.Room.id == bed.room_id).first()
                if room:
                    invoice = models.Invoice(
                        student_id=alloc.student_id,
                        amount=room.price_per_month,
                        month=month,
                        is_paid=False
                    )
                    db.add(invoice)
                    invoices.append(invoice)
            
    db.commit()
    return {"message": f"Generated {len(invoices)} bills for {month}"}
