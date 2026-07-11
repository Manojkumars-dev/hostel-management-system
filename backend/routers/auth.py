from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import get_db
import models

router = APIRouter()

class RegisterRequest(BaseModel):
    full_name: str
    email: str
    password: str
    role: str

class LoginRequest(BaseModel):
    email: str
    password: str
    role: str

@router.post("/register")
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == req.email).first()
    if user:
        raise HTTPException(status_code=400, detail="User with this email already exists.")
        
    user = models.User(
        full_name=req.full_name,
        email=req.email,
        password=req.password,
        role=req.role
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "Registration successful", "user": {"id": user.id, "role": user.role, "email": user.email, "full_name": user.full_name}}

@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        models.User.email == req.email,
        models.User.role == req.role
    ).first()
    
    if not user:
         raise HTTPException(status_code=404, detail="User not found. Please register first.")
         
    if user.password != req.password:
         raise HTTPException(status_code=401, detail="Incorrect password.")

    return {"message": "Login successful", "user": {"id": user.id, "role": user.role, "email": user.email, "full_name": user.full_name}}
