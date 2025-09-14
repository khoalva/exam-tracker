import pandas as pd
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models.student import Base, Student

# Tạo tables
Base.metadata.create_all(bind=engine)

def load_data_from_csv():
    """Đọc dữ liệu từ file CSV và nạp vào database"""
    db = SessionLocal()
    
    try:
        # Xóa dữ liệu cũ nếu có
        db.query(Student).delete()
        db.commit()
        print("🗑️ Cleared existing data")
        
        # Đọc file CSV
        csv_file = "diem_thi_thpt_2024.csv"
        print(f"📖 Reading data from {csv_file}...")
        
        # Đọc CSV với encoding phù hợp
        try:
            df = pd.read_csv(csv_file, encoding='utf-8')
        except:
            try:
                df = pd.read_csv(csv_file, encoding='utf-8-sig')
            except:
                df = pd.read_csv(csv_file, encoding='latin-1')
        
        print(f"📊 Found {len(df)} records in CSV")
        print(f"Columns: {list(df.columns)}")
        
        # Mapping từ CSV columns đến database columns
        column_mapping = {
            'sbd': 'sbd',
            'toan': 'math',
            'ngu_van': 'literature', 
            'ngoai_ngu': 'foreign_language',
            'vat_li': 'physics',
            'hoa_hoc': 'chemistry',
            'sinh_hoc': 'biology',
            'lich_su': 'history',
            'dia_li': 'geography',
            'gdcd': 'civic_education',
            'ma_ngoai_ngu': 'foreign_language_code'
        }
        
        # Xử lý dữ liệu
        students_created = 0
        
        for index, row in df.iterrows():
            try:
                # Tạo dictionary cho student data
                student_data = {}
                
                for csv_col, db_col in column_mapping.items():
                    if csv_col in df.columns:
                        value = row[csv_col]
                        
                        # Xử lý giá trị null/NaN
                        if pd.isna(value) or value == '' or value == 'null':
                            student_data[db_col] = None
                        elif db_col == 'sbd' or db_col == 'foreign_language_code':
                            # String columns
                            student_data[db_col] = str(value) if value is not None else None
                        else:
                            # Float columns (điểm số)
                            try:
                                student_data[db_col] = float(value) if value is not None else None
                            except (ValueError, TypeError):
                                student_data[db_col] = None
                
                # Tạo student object
                student = Student(**student_data)
                db.add(student)
                students_created += 1
                
                # Commit theo batch để tránh memory issues
                if students_created % 1000 == 0:
                    db.commit()
                    print(f"✅ Processed {students_created} students...")
                    
            except Exception as e:
                print(f"⚠️ Error processing row {index}: {e}")
                continue
        
        # Commit remaining data
        db.commit()
        print(f"✅ Successfully imported {students_created} students!")
        
        # In thống kê
        total_students = db.query(Student).count()
        print(f"📊 Total students in database: {total_students}")
        
        # Thống kê có điểm các môn
        subjects = ['math', 'literature', 'foreign_language', 'physics', 'chemistry', 'biology', 'history', 'geography', 'civic_education']
        for subject in subjects:
            count = db.query(Student).filter(getattr(Student, subject).isnot(None)).count()
            print(f"   - {subject.replace('_', ' ').title()}: {count} students have scores")
        
    except FileNotFoundError:
        print(f"❌ File {csv_file} not found!")
    except Exception as e:
        print(f"❌ Error loading data: {e}")
        db.rollback()
    finally:
        db.close()

def create_sample_data():
    """Tạo dữ liệu mẫu nếu không có file CSV"""
    db = SessionLocal()
    
    try:
        # Xóa dữ liệu cũ
        db.query(Student).delete()
        db.commit()
        
        # Tạo học sinh mẫu với cấu trúc mới
        sample_students = [
            {"sbd": "01001001", "math": 9.5, "physics": 9.2, "chemistry": 9.8, "literature": 8.0, "foreign_language": 8.5, "foreign_language_code": "N1"},
            {"sbd": "01001002", "math": 9.0, "physics": 9.5, "chemistry": 9.0, "literature": 7.8, "foreign_language": 8.2, "foreign_language_code": "N1"},
            {"sbd": "01001003", "math": 8.8, "physics": 9.0, "chemistry": 9.2, "literature": 8.5, "foreign_language": 8.0, "foreign_language_code": "N1"},
            {"sbd": "01001004", "math": 8.5, "physics": 8.8, "chemistry": 9.0, "literature": 7.5, "foreign_language": 7.8, "foreign_language_code": "N1"},
            {"sbd": "01001005", "math": 8.2, "physics": 8.5, "chemistry": 8.8, "literature": 8.2, "foreign_language": 8.3, "foreign_language_code": "N1"},
            {"sbd": "01001006", "math": 8.0, "physics": 8.2, "chemistry": 8.5, "literature": 7.0, "foreign_language": 7.5, "foreign_language_code": "N1"},
            {"sbd": "01001007", "math": 7.8, "physics": 8.0, "chemistry": 8.2, "literature": 7.8, "foreign_language": 7.2, "foreign_language_code": "N1"},
            {"sbd": "01001008", "math": 7.5, "physics": 7.8, "chemistry": 8.0, "literature": 6.5, "foreign_language": 7.0, "foreign_language_code": "N1"},
            {"sbd": "01001009", "math": 7.2, "physics": 7.5, "chemistry": 7.8, "literature": 7.0, "foreign_language": 6.8, "foreign_language_code": "N1"},
            {"sbd": "01001010", "math": 7.0, "physics": 7.2, "chemistry": 7.5, "literature": 6.2, "foreign_language": 6.5, "foreign_language_code": "N1"},
        ]
        
        for student_data in sample_students:
            student = Student(**student_data)
            db.add(student)
        
        db.commit()
        print("✅ Sample data created successfully!")
        
        # In thống kê
        total_students = db.query(Student).count()
        print(f"📊 Created {total_students} students")
        
    except Exception as e:
        print(f"❌ Error creating sample data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "--sample":
        print("🚀 Creating sample data...")
        create_sample_data()
    else:
        print("🚀 Loading data from CSV...")
        load_data_from_csv()