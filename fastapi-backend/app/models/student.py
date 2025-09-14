from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    sbd = Column(String(20), unique=True, index=True, nullable=False)  # Số báo danh
    math = Column(Float, nullable=True)  # Điểm Toán
    literature = Column(Float, nullable=True)  # Điểm Ngữ văn
    foreign_language = Column(Float, nullable=True)  # Điểm Ngoại ngữ
    physics = Column(Float, nullable=True)  # Điểm Vật lí
    chemistry = Column(Float, nullable=True)  # Điểm Hóa học
    biology = Column(Float, nullable=True)  # Điểm Sinh học
    history = Column(Float, nullable=True)  # Điểm Lịch sử
    geography = Column(Float, nullable=True)  # Điểm Địa lí
    civic_education = Column(Float, nullable=True)  # Điểm GDCD
    foreign_language_code = Column(String(10), nullable=True)  # Mã ngoại ngữ