from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Tạo engine cho database
engine = create_engine(settings.DATABASE_URL)

# Tạo SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Tạo Base class
Base = declarative_base()

# Dependency để get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()