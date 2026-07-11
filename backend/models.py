from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    password = Column(String)
    email = Column(String, unique=True, index=True)
    role = Column(String, default="student") # 'admin' or 'student'
    full_name = Column(String)

class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, index=True)
    room_number = Column(String, unique=True, index=True)
    capacity = Column(Integer)
    price_per_month = Column(Float)
    
    beds = relationship("Bed", back_populates="room")

class Bed(Base):
    __tablename__ = "beds"
    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("rooms.id"))
    bed_number = Column(String) # e.g., 'A', 'B'
    is_occupied = Column(Boolean, default=False)
    
    room = relationship("Room", back_populates="beds")
    allocations = relationship("Allocation", back_populates="bed")

class Allocation(Base):
    __tablename__ = "allocations"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    bed_id = Column(Integer, ForeignKey("beds.id"))
    start_date = Column(DateTime, default=datetime.datetime.utcnow)
    end_date = Column(DateTime, nullable=True)
    
    student = relationship("User")
    bed = relationship("Bed", back_populates="allocations")

class Invoice(Base):
    __tablename__ = "invoices"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float)
    month = Column(String) # e.g., '2023-10'
    is_paid = Column(Boolean, default=False)
    generated_date = Column(DateTime, default=datetime.datetime.utcnow)
    
    student = relationship("User")
