from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.crud.student import student_crud
from app.schemas.student import (
    Student, StudentCreate, StudentUpdate,
    StudentScore, OverallStats, TopStudent
)
from typing import List

router = APIRouter()

# Student endpoints
@router.get("/students", response_model=List[Student], tags=["students"])
def get_students(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Lấy danh sách học sinh với phân trang"""
    students = student_crud.get_students(db, skip=skip, limit=limit)
    return students

@router.get("/students/{student_id}", response_model=Student, tags=["students"])
def get_student(student_id: int, db: Session = Depends(get_db)):
    """Lấy thông tin học sinh theo ID"""
    student = student_crud.get_student_by_id(db, student_id=student_id)
    if student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.get("/students/score/{sbd}", response_model=StudentScore, tags=["scores"])
def get_student_score(sbd: str, db: Session = Depends(get_db)):
    """Tra cứu điểm số học sinh theo số báo danh (VD: 01001001)"""
    student = student_crud.get_student_by_sbd(db, sbd=sbd)
    if student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    
    return StudentScore(
        sbd=student.sbd,
        math=student.math,
        literature=student.literature,
        foreign_language=student.foreign_language,
        physics=student.physics,
        chemistry=student.chemistry,
        biology=student.biology,
        history=student.history,
        geography=student.geography,
        civic_education=student.civic_education,
        foreign_language_code=student.foreign_language_code
    )

@router.post("/students", response_model=Student, tags=["students"])
def create_student(student: StudentCreate, db: Session = Depends(get_db)):
    """Tạo học sinh mới"""
    db_student = student_crud.get_student_by_sbd(db, sbd=student.sbd)
    if db_student:
        raise HTTPException(status_code=400, detail="Student ID (SBD) already exists")
    return student_crud.create_student(db=db, student=student)

@router.put("/students/{student_id}", response_model=Student, tags=["students"])
def update_student(student_id: int, student_update: StudentUpdate, db: Session = Depends(get_db)):
    """Cập nhật thông tin học sinh"""
    db_student = student_crud.update_student(db, student_id=student_id, student_update=student_update)
    if db_student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    return db_student

@router.delete("/students/{student_id}", tags=["students"])
def delete_student(student_id: int, db: Session = Depends(get_db)):
    """Xóa học sinh khỏi hệ thống"""
    success = student_crud.delete_student(db, student_id=student_id)
    if not success:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"message": "Student deleted successfully"}

# Statistics endpoints
@router.get("/statistics", response_model=OverallStats, tags=["statistics"])
def get_statistics(db: Session = Depends(get_db)):
    """Lấy thống kê điểm số tổng quan của tất cả học sinh"""
    print("get_statistics endpoint called")
    stats = student_crud.get_statistics(db)
    return OverallStats(**stats)

@router.get("/students/top10/group-a", response_model=List[TopStudent], tags=["statistics"])
def get_top_students_group_a(db: Session = Depends(get_db)):
    """Lấy top 10 học sinh nhóm A có điểm số cao nhất (toán, lý, hóa)"""

    top_students = student_crud.get_top_students_group_a(db)
    return [TopStudent(**student) for student in top_students]