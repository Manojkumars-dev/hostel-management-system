from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import datetime

from database import get_db
import models

router = APIRouter()

class BookingRequest(BaseModel):
    student_id: int
    bed_id: int

@router.get("/available-beds")
def get_available_beds(db: Session = Depends(get_db)):
    # Returns beds that are not occupied
    beds = db.query(models.Bed).filter(models.Bed.is_occupied == False).all()
    # include room details
    result = []
    for bed in beds:
        room = db.query(models.Room).filter(models.Room.id == bed.room_id).first()
        result.append({
            "bed_id": bed.id,
            "room_number": room.room_number if room else "Unknown",
            "bed_number": bed.bed_number,
            "price": room.price_per_month if room else 0
        })
    return result

@router.post("/book")
def book_bed(request: BookingRequest, db: Session = Depends(get_db)):
    # Concurrency consideration: lock the row or rely on simple isolation
    # For SQLite, we just query and update.
    bed = db.query(models.Bed).filter(models.Bed.id == request.bed_id).first()
    if not bed:
        raise HTTPException(status_code=404, detail="Bed not found")
        
    if bed.is_occupied:
        raise HTTPException(status_code=400, detail="Bed is already occupied")
        
    # Check if student already has an active allocation
    active_alloc = db.query(models.Allocation).filter(
        models.Allocation.student_id == request.student_id,
        models.Allocation.end_date == None
    ).first()
    
    if active_alloc:
         raise HTTPException(status_code=400, detail="Student already has an active booking")

    # Mark bed as occupied
    bed.is_occupied = True
    
    # Create allocation
    allocation = models.Allocation(
        student_id=request.student_id,
        bed_id=request.bed_id
    )
    db.add(allocation)
    db.commit()
    db.refresh(allocation)
    
    return {"message": "Booking successful", "allocation_id": allocation.id}

@router.get("/bills/{student_id}")
def get_my_bills(student_id: int, db: Session = Depends(get_db)):
    return db.query(models.Invoice).filter(models.Invoice.student_id == student_id).all()
