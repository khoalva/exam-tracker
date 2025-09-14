from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://neondb_owner:npg_Olnrcj5DS4Ie@ep-polished-sky-ad32sa01-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    DATABASE_URL_ASYNC: str = "postgresql+asyncpg://neondb_owner:npg_Olnrcj5DS4Ie@ep-polished-sky-ad32sa01-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    
    # Security
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # App Settings
    APP_NAME: str = "Student Management API"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = """
    """
    
    class Config:
        env_file = ".env"

settings = Settings()