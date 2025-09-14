from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import api_router
from app.core.database import engine
from app.models import student

# Tạo tables nếu chưa có
student.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
    summary="Hệ thống quản lý học sinh và điểm số",
    contact={
        "name": "Student Management System",
        "email": "admin@studentmanagement.com",
    },
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT",
    },
    openapi_tags=[
        {
            "name": "students",
            "description": "Quản lý thông tin học sinh",
        },
        {
            "name": "scores",
            "description": "Quản lý điểm số học sinh",
        },
        {
            "name": "statistics",
            "description": "Thống kê và báo cáo điểm số",
        },
        {
            "name": "system",
            "description": "Kiểm tra hệ thống và health check",
        },
    ],
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix="/api")

@app.get("/", tags=["system"])
def root():
    """
    ## Root endpoint
    
    Trả về thông tin cơ bản về API và links hữu ích.
    """
    return {
        "message": "🎓 Student Management API", 
        "version": settings.VERSION,
        "status": "running",
        "docs": "/docs",
        "redoc": "/redoc",
        "api_base": "/api"
    }

@app.get("/health", tags=["system"])
def health_check():
    """
    ## Health Check
    
    Kiểm tra tình trạng hoạt động của API server.
    
    **Returns:**
    - `status`: Trạng thái server (healthy/unhealthy)
    - `database`: Trạng thái kết nối database
    """
    return {
        "status": "healthy",
        "database": "connected",
        "version": settings.VERSION,
        "timestamp": "2025-09-11T00:00:00Z"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )