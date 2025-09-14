from fastapi import APIRouter
from app.api import students

api_router = APIRouter()

# Include các router con
api_router.include_router(students.router, tags=["students"])