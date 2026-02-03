from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class ConsultationRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str
    message: str
    consent: bool
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))

class AppointmentRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str
    date: str
    time: str
    type: str
    notes: Optional[str] = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: str = "pending"

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

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
        
        result = await db.consultations.insert_one(doc)
        
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
        
        result = await db.appointments.insert_one(doc)
        
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
        consultations = await db.consultations.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
        
        # Convert ISO string timestamps back to datetime objects
        for consultation in consultations:
            if isinstance(consultation['created_at'], str):
                consultation['created_at'] = datetime.fromisoformat(consultation['created_at'])
        
        return {"success": True, "consultations": consultations}
    except Exception as e:
        logger.error(f"Error fetching consultations: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching consultations")

# Include the router in the main app
app.include_router(api_router)

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