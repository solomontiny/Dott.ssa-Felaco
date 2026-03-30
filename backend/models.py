from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
import uuid


# Article Models
class Article(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    slug: str
    excerpt: str
    content: str
    image_url: Optional[str] = None
    category: str
    tags: List[str] = []
    published: bool = False
    author: str = "Dott.ssa Felaco Giuseppina"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    published_at: Optional[datetime] = None


class ArticleCreate(BaseModel):
    title: str
    excerpt: str
    content: str
    image_url: Optional[str] = None
    category: str
    tags: List[str] = []
    published: bool = False


class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    published: Optional[bool] = None


# Auth Models
class AdminLogin(BaseModel):
    email: EmailStr


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# Status Check Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class StatusCheckCreate(BaseModel):
    client_name: str


# Consultation Models
class ConsultationRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str
    message: str
    consent: bool
    created_at: datetime = Field(default_factory=datetime.utcnow)
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))


# Appointment Models
class AppointmentRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str
    date: str
    time: str
    type: str
    notes: Optional[str] = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: str = "pending"
