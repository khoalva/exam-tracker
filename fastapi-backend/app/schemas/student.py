from pydantic import BaseModel
from typing import Optional, List

# Schema cho Student
class StudentBase(BaseModel):
    sbd: str  # Số báo danh
    math: Optional[float] = None  # Điểm Toán
    literature: Optional[float] = None  # Điểm Ngữ văn
    foreign_language: Optional[float] = None  # Điểm Ngoại ngữ
    physics: Optional[float] = None  # Điểm Vật lí
    chemistry: Optional[float] = None  # Điểm Hóa học
    biology: Optional[float] = None  # Điểm Sinh học
    history: Optional[float] = None  # Điểm Lịch sử
    geography: Optional[float] = None  # Điểm Địa lí
    civic_education: Optional[float] = None  # Điểm GDCD
    foreign_language_code: Optional[str] = None  # Mã ngoại ngữ

class StudentCreate(StudentBase):
    pass

class StudentUpdate(BaseModel):
    math: Optional[float] = None
    literature: Optional[float] = None
    foreign_language: Optional[float] = None
    physics: Optional[float] = None
    chemistry: Optional[float] = None
    biology: Optional[float] = None
    history: Optional[float] = None
    geography: Optional[float] = None
    civic_education: Optional[float] = None
    foreign_language_code: Optional[str] = None

class Student(StudentBase):
    id: int

    class Config:
        from_attributes = True

# Schema phản hồi cho API kiểm tra điểm
class StudentScore(BaseModel):
    sbd: str
    math: Optional[float] = None
    literature: Optional[float] = None
    foreign_language: Optional[float] = None
    physics: Optional[float] = None
    chemistry: Optional[float] = None
    biology: Optional[float] = None
    history: Optional[float] = None
    geography: Optional[float] = None
    civic_education: Optional[float] = None
    foreign_language_code: Optional[str] = None

# Schema cho thống kê
class StatisticsData(BaseModel):
    subject: str
    excellent: int  # >= 8
    good: int       # >= 6 && < 8
    average: int    # >= 4 && < 6
    below_average: int  # < 4

class OverallStats(BaseModel):
    total_students: int
    subjects: List[str]
    statistics: List[StatisticsData]

# Schema cho top 10 học sinh nhóm A
class TopStudent(BaseModel):
    rank: int
    sbd: str
    math: Optional[float] = None
    physics: Optional[float] = None
    chemistry: Optional[float] = None
    total_score: float
    average_score: float