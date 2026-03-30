from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime
import shutil

from auth import get_current_admin, generate_magic_link_token, ADMIN_EMAIL
from models import (
    Article, ArticleCreate, ArticleUpdate, 
    AdminLogin, TokenResponse,
    StatusCheck, StatusCheckCreate
)
from utils import create_slug


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create uploads directory
UPLOAD_DIR = ROOT_DIR / 'uploads'
UPLOAD_DIR.mkdir(exist_ok=True)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.get("/health")
async def health_check():
    """Health check endpoint for Kubernetes liveness and readiness probes"""
    return {
        "status": "healthy",
        "service": "dottssa-felaco-api",
        "timestamp": datetime.utcnow().isoformat()
    }

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

@api_router.post("/consultation")
async def create_consultation(consultation: ConsultationRequest):
    try:
        if not consultation.consent:
            raise HTTPException(status_code=400, detail="Consent is required")
        
        # Convert to dict and serialize datetime to ISO string for MongoDB
        doc = consultation.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        
        await db.consultations.insert_one(doc)
        
        # Here you would send WhatsApp notification
        # For now, we'll log it
        logger.info(f"New consultation request from {consultation.name} - {consultation.phone}")
        
        return {
            "success": True,
            "message": "Consultation request received",
            "id": consultation.id
        }
    except Exception as e:
        logger.error(f"Error creating consultation: {str(e)}")
        raise HTTPException(status_code=500, detail="Error processing consultation request")

@api_router.post("/appointment")
async def create_appointment(appointment: AppointmentRequest):
    try:
        # Convert to dict and serialize datetime to ISO string for MongoDB
        doc = appointment.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        
        await db.appointments.insert_one(doc)
        
        # Here you would send WhatsApp and email notifications
        logger.info(f"New appointment from {appointment.name} on {appointment.date} at {appointment.time}")
        
        return {
            "success": True,
            "message": "Appointment booked successfully",
            "id": appointment.id
        }
    except Exception as e:
        logger.error(f"Error creating appointment: {str(e)}")
        raise HTTPException(status_code=500, detail="Error booking appointment")

@api_router.get("/appointments")
async def get_appointments():
    try:
        appointments = await db.appointments.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
        
        # Convert ISO string timestamps back to datetime objects
        for appointment in appointments:
            if isinstance(appointment['created_at'], str):
                appointment['created_at'] = datetime.fromisoformat(appointment['created_at'])
        
        return {"success": True, "appointments": appointments}
    except Exception as e:
        logger.error(f"Error fetching appointments: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching appointments")

@api_router.get("/consultations")
async def get_consultations():
    try:
        consultations = await db.consultations.find().sort("created_at", -1).to_list(100)
        return {"success": True, "consultations": consultations}
    except Exception as e:
        logger.error(f"Error fetching consultations: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching consultations")


# ============= ADMIN AUTH ENDPOINTS =============

@api_router.post("/admin/login", response_model=TokenResponse)
async def admin_login(login: AdminLogin):
    """Admin login - generates JWT token for authenticated access"""
    try:
        if login.email != ADMIN_EMAIL:
            raise HTTPException(
                status_code=403,
                detail="Access denied. Only authorized admin can login."
            )
        
        token = generate_magic_link_token(login.email)
        return TokenResponse(access_token=token, token_type="bearer")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in admin login: {str(e)}")
        raise HTTPException(status_code=500, detail="Login error")


@api_router.get("/admin/verify")
async def verify_admin(current_admin: dict = Depends(get_current_admin)):
    """Verify if the token is valid"""
    return {"valid": True, "email": current_admin.get("sub")}


# ============= ARTICLE MANAGEMENT ENDPOINTS =============

@api_router.post("/admin/articles", response_model=Article)
async def create_article(
    article: ArticleCreate,
    current_admin: dict = Depends(get_current_admin)
):
    """Create a new article (admin only)"""
    try:
        article_dict = article.dict()
        article_dict['id'] = str(uuid.uuid4())
        article_dict['slug'] = create_slug(article.title)
        article_dict['author'] = "Dott.ssa Felaco Giuseppina"
        article_dict['created_at'] = datetime.utcnow()
        article_dict['updated_at'] = datetime.utcnow()
        
        if article.published:
            article_dict['published_at'] = datetime.utcnow()
        
        await db.articles.insert_one(article_dict)
        return Article(**article_dict)
    except Exception as e:
        logger.error(f"Error creating article: {str(e)}")
        raise HTTPException(status_code=500, detail="Error creating article")


@api_router.get("/articles")
async def get_articles(published_only: bool = True, skip: int = 0, limit: int = 20):
    """Get all articles (public endpoint)"""
    try:
        query = {"published": True} if published_only else {}
        articles = await db.articles.find(query).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
        total = await db.articles.count_documents(query)
        return {"success": True, "articles": articles, "total": total}
    except Exception as e:
        logger.error(f"Error fetching articles: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching articles")


@api_router.get("/articles/{slug}")
async def get_article_by_slug(slug: str):
    """Get single article by slug (public endpoint)"""
    try:
        article = await db.articles.find_one({"slug": slug, "published": True})
        if not article:
            raise HTTPException(status_code=404, detail="Article not found")
        return {"success": True, "article": article}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching article: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching article")


@api_router.get("/admin/articles")
async def get_all_articles_admin(
    current_admin: dict = Depends(get_current_admin),
    skip: int = 0,
    limit: int = 50
):
    """Get all articles including unpublished (admin only)"""
    try:
        articles = await db.articles.find().sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
        total = await db.articles.count_documents({})
        return {"success": True, "articles": articles, "total": total}
    except Exception as e:
        logger.error(f"Error fetching articles: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching articles")


@api_router.get("/admin/articles/{article_id}")
async def get_article_by_id(
    article_id: str,
    current_admin: dict = Depends(get_current_admin)
):
    """Get single article by ID (admin only)"""
    try:
        article = await db.articles.find_one({"id": article_id})
        if not article:
            raise HTTPException(status_code=404, detail="Article not found")
        return {"success": True, "article": article}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching article: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching article")


@api_router.put("/admin/articles/{article_id}")
async def update_article(
    article_id: str,
    article_update: ArticleUpdate,
    current_admin: dict = Depends(get_current_admin)
):
    """Update an article (admin only)"""
    try:
        existing = await db.articles.find_one({"id": article_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Article not found")
        
        update_data = {k: v for k, v in article_update.dict().items() if v is not None}
        update_data['updated_at'] = datetime.utcnow()
        
        # Update title and slug
        if 'title' in update_data and update_data['title'] != existing.get('title'):
            update_data['slug'] = create_slug(update_data['title'])
        
        # Update published_at timestamp
        if 'published' in update_data:
            if update_data['published'] and not existing.get('published'):
                update_data['published_at'] = datetime.utcnow()
            elif not update_data['published']:
                update_data['published_at'] = None
        
        await db.articles.update_one({"id": article_id}, {"$set": update_data})
        
        updated_article = await db.articles.find_one({"id": article_id})
        return {"success": True, "article": updated_article}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating article: {str(e)}")
        raise HTTPException(status_code=500, detail="Error updating article")


@api_router.delete("/admin/articles/{article_id}")
async def delete_article(
    article_id: str,
    current_admin: dict = Depends(get_current_admin)
):
    """Delete an article (admin only)"""
    try:
        result = await db.articles.delete_one({"id": article_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Article not found")
        return {"success": True, "message": "Article deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting article: {str(e)}")
        raise HTTPException(status_code=500, detail="Error deleting article")


@api_router.post("/admin/upload-image")
async def upload_image(
    file: UploadFile = File(...),
    current_admin: dict = Depends(get_current_admin)
):
    """Upload image for article (admin only)"""
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Generate unique filename
        file_extension = file.filename.split('.')[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = UPLOAD_DIR / unique_filename
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Return URL
        image_url = f"/api/uploads/{unique_filename}"
        return {"success": True, "image_url": image_url}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading image: {str(e)}")
        raise HTTPException(status_code=500, detail="Error uploading image")


@api_router.get("/uploads/{filename}")
async def get_uploaded_file(filename: str):
    """Serve uploaded images"""
    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)


# Include the router in the main app
app.include_router(api_router)

# Health check endpoint for Kubernetes (without /api prefix)
@app.get("/health")
async def health_check_root():
    """Health check endpoint for Kubernetes liveness and readiness probes"""
    return {
        "status": "healthy",
        "service": "dottssa-felaco-api",
        "timestamp": datetime.utcnow().isoformat()
    }

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()