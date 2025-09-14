from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.student import Student
from app.schemas.student import StudentCreate, StudentUpdate
from typing import Optional, List

class StudentCRUD:
    def get_student_by_id(self, db: Session, student_id: int) -> Optional[Student]:
        return db.query(Student).filter(Student.id == student_id).first()
    
    def get_student_by_sbd(self, db: Session, sbd: str) -> Optional[Student]:
        return db.query(Student).filter(Student.sbd == sbd).first()
    
    def get_students(self, db: Session, skip: int = 0, limit: int = 100) -> List[Student]:
        return db.query(Student).offset(skip).limit(limit).all()
    
    def create_student(self, db: Session, student: StudentCreate) -> Student:
        db_student = Student(**student.dict())
        db.add(db_student)
        db.commit()
        db.refresh(db_student)
        return db_student
    
    def update_student(self, db: Session, student_id: int, student_update: StudentUpdate) -> Optional[Student]:
        db_student = self.get_student_by_id(db, student_id)
        if db_student:
            update_data = student_update.dict(exclude_unset=True)
            for key, value in update_data.items():
                setattr(db_student, key, value)
            db.commit()
            db.refresh(db_student)
        return db_student
    
    def delete_student(self, db: Session, student_id: int) -> bool:
        db_student = self.get_student_by_id(db, student_id)
        if db_student:
            db.delete(db_student)
            db.commit()
            return True
        return False
    
    def get_statistics(self, db: Session):
        """Lấy thống kê điểm số theo từng môn học"""
        subjects = ['math', 'literature', 'foreign_language', 'physics', 'chemistry', 'biology', 'history', 'geography', 'civic_education']
        statistics = []
        
        for subject in subjects:
            column = getattr(Student, subject)
            
            # Chỉ đếm những học sinh có điểm môn này (không null)
            excellent = db.query(Student).filter(column >= 8.0).count()
            good = db.query(Student).filter(column >= 6.0, column < 8.0).count()
            average = db.query(Student).filter(column >= 4.0, column < 6.0).count()
            below_average = db.query(Student).filter(column < 4.0, column.isnot(None)).count()
            
            statistics.append({
                'subject': subject.replace('_', ' ').title(),
                'excellent': excellent,
                'good': good,
                'average': average,
                'below_average': below_average
            })
        
        total_students = db.query(Student).count()
        
        return {
            'total_students': total_students,
            'subjects': [s.replace('_', ' ').title() for s in subjects],
            'statistics': statistics
        }
    
    def get_top_students_group_a(self, db: Session, limit: int = 10):
        """Lấy top học sinh nhóm A (toán, lý, hóa)"""
        print("get_top_students_group_a called")
        # Lấy học sinh có đủ điểm 3 môn toán, lý, hóa
        students = db.query(Student).filter(
            Student.math.isnot(None),
            Student.physics.isnot(None), 
            Student.chemistry.isnot(None)
        ).all()
        print("tesst")
        student_scores = []
        for student in students:
            total_score = student.math + student.physics + student.chemistry
            average_score = total_score / 3
            
            student_scores.append({
                'student': student,
                'total_score': total_score,
                'average_score': average_score
            })
        
        # Sắp xếp theo điểm trung bình giảm dần
        student_scores.sort(key=lambda x: x['average_score'], reverse=True)
        
        # Lấy top N và thêm rank
        top_students = []
        for i, item in enumerate(student_scores[:limit]):
            top_students.append({
                'rank': i + 1,
                'sbd': item['student'].sbd,
                'math': item['student'].math,
                'physics': item['student'].physics,
                'chemistry': item['student'].chemistry,
                'total_score': item['total_score'],
                'average_score': item['average_score']
            })
        print(top_students)
        return top_students

# Tạo instance
student_crud = StudentCRUD()