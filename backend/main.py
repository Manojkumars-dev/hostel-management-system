from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine
import models

# Create all tables in the database
models.Base.metadata.create_all(bind=engine)

from routers import admin, student, auth

app = FastAPI(title="Hostel Management System API")

# Configure CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "Hostel Management System API is running"}

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(student.router, prefix="/api/student", tags=["Student"])
