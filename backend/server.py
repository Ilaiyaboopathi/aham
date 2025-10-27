from fastapi import FastAPI, HTTPException, Depends, status, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from passlib.context import CryptContext
import os
from bson import ObjectId
from PIL import Image
import io
import shutil
from pathlib import Path

app = FastAPI(title="AHAM Housing Finance CMS API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URL)
db = client.aham_cms

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET", "your-super-secret-jwt-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Upload Configuration
UPLOAD_DIR = Path("/app/uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
MAX_FILE_SIZE = 2 * 1024 * 1024  # 2MB

app.mount("/uploads", StaticFiles(directory="/app/uploads"), name="uploads")

# ===== MODELS =====

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class UserModel(BaseModel):
    name: str
    email: EmailStr
    role: str = "editor"  # admin, editor, viewer
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_login: Optional[datetime] = None

class UserInDB(UserModel):
    password_hash: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "editor"

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class Banner(BaseModel):
    title_en: str
    title_ta: str
    subtitle_en: str
    subtitle_ta: str
    cta_text_en: str
    cta_text_ta: str
    cta_action: str
    image_url: str
    highlights: List[str]
    order_index: int = 0
    status: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class About(BaseModel):
    title_en: str
    title_ta: str
    subtitle_en: str
    subtitle_ta: str
    features: List[Dict[str, Any]]
    stats: List[Dict[str, Any]]
    status: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Product(BaseModel):
    title_en: str
    title_ta: str
    description_en: str
    description_ta: str
    icon: str
    image_url: str
    features: List[str]
    gradient: str
    order_index: int = 0
    status: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class EMICalculator(BaseModel):
    title_en: str
    title_ta: str
    subtitle_en: str
    subtitle_ta: str
    default_interest: float = 8.5
    default_tenure: int = 240
    status: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class EligibilityQuestion(BaseModel):
    question_en: str
    question_ta: str
    question_type: str  # text, select, radio, number
    options: List[str] = []
    score_map: Dict[str, int] = {}
    order_index: int = 0
    status: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Testimonial(BaseModel):
    name: str
    location: str
    rating: int = 5
    comment_en: str
    comment_ta: str
    image_url: str
    loan_type: str
    order_index: int = 0
    status: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Article(BaseModel):
    title_en: str
    title_ta: str
    slug: str
    content_en: str
    content_ta: str
    thumbnail_url: str
    published_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Footer(BaseModel):
    address_en: str
    address_ta: str
    phone: str
    email: str
    social_links: Dict[str, str]
    copyright_en: str
    copyright_ta: str
    status: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SEO(BaseModel):
    page: str
    meta_title_en: str
    meta_title_ta: str
    meta_desc_en: str
    meta_desc_ta: str
    keywords_en: str
    keywords_ta: str
    status: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class MediaItem(BaseModel):
    file_name: str
    url: str
    alt_text_en: str = ""
    alt_text_ta: str = ""
    file_size: int
    uploaded_by: str
    uploaded_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AuditLog(BaseModel):
    user_id: str
    user_email: str
    section: str
    action: str  # create, update, delete
    record_id: str
    old_value: Optional[Dict[str, Any]] = None
    new_value: Optional[Dict[str, Any]] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ===== AUTHENTICATION HELPERS =====

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    user = await db.users.find_one({"email": email})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user

async def require_admin(user: dict = Depends(get_current_user)):
    if user.get("role") not in ["admin", "editor"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    return user

async def log_audit(user_email: str, section: str, action: str, record_id: str, old_value=None, new_value=None):
    audit_entry = {
        "user_email": user_email,
        "section": section,
        "action": action,
        "record_id": record_id,
        "old_value": old_value,
        "new_value": new_value,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    await db.audit_logs.insert_one(audit_entry)

# ===== MEDIA UPLOAD HELPER =====

async def optimize_and_save_image(file: UploadFile, user_email: str) -> Dict[str, Any]:
    # Read file
    contents = await file.read()
    
    # Check file size
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail=f"File size exceeds {MAX_FILE_SIZE / (1024*1024)}MB limit")
    
    # Open image with Pillow
    try:
        image = Image.open(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid image file")
    
    # Convert to RGB if necessary
    if image.mode in ("RGBA", "P"):
        image = image.convert("RGB")
    
    # Resize if width > 1920px
    if image.width > 1920:
        ratio = 1920 / image.width
        new_height = int(image.height * ratio)
        image = image.resize((1920, new_height), Image.Resampling.LANCZOS)
    
    # Generate unique filename
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    file_name = f"{timestamp}_{file.filename.rsplit('.', 1)[0]}.webp"
    file_path = UPLOAD_DIR / file_name
    
    # Save as WebP
    image.save(file_path, "WEBP", quality=85, optimize=True)
    
    # Get file size
    file_size = file_path.stat().st_size
    
    # Save to database
    media_doc = {
        "file_name": file_name,
        "url": f"/uploads/{file_name}",
        "alt_text_en": "",
        "alt_text_ta": "",
        "file_size": file_size,
        "uploaded_by": user_email,
        "uploaded_at": datetime.now(timezone.utc).isoformat()
    }
    result = await db.media_library.insert_one(media_doc)
    media_doc["_id"] = str(result.inserted_id)
    
    return media_doc

# ===== ROOT & HEALTH CHECK =====

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "AHAM CMS API"}

# ===== AUTHENTICATION ENDPOINTS =====

@app.post("/api/admin/login", response_model=TokenResponse)
async def admin_login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Update last login
    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {"last_login": datetime.now(timezone.utc).isoformat()}}
    )
    
    # Create token
    access_token = create_access_token({"sub": user["email"]})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    }

@app.get("/api/admin/me")
async def get_current_user_info(user: dict = Depends(get_current_user)):
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "role": user["role"]
    }

# ===== USER MANAGEMENT (Admin Only) =====

@app.get("/api/admin/users")
async def get_all_users(user: dict = Depends(require_admin)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Only admins can view users")
    
    users = await db.users.find({}, {"password_hash": 0}).to_list(100)
    for u in users:
        u["_id"] = str(u["_id"])
    return users

@app.post("/api/admin/users")
async def create_user(new_user: UserCreate, user: dict = Depends(require_admin)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Only admins can create users")
    
    # Check if email already exists
    existing = await db.users.find_one({"email": new_user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_doc = {
        "name": new_user.name,
        "email": new_user.email,
        "password_hash": get_password_hash(new_user.password),
        "role": new_user.role,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "last_login": None
    }
    
    result = await db.users.insert_one(user_doc)
    await log_audit(user["email"], "users", "create", str(result.inserted_id), new_value=new_user.dict())
    
    return {"message": "User created successfully", "id": str(result.inserted_id)}

@app.delete("/api/admin/users/{user_id}")
async def delete_user(user_id: str, user: dict = Depends(require_admin)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Only admins can delete users")
    
    result = await db.users.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    await log_audit(user["email"], "users", "delete", user_id)
    return {"message": "User deleted successfully"}

# ===== BANNERS ENDPOINTS =====

@app.get("/api/cms/banners")
async def get_public_banners():
    banners = await db.banners.find({"status": True}).sort("order_index", 1).to_list(100)
    for banner in banners:
        banner["_id"] = str(banner["_id"])
    return banners

@app.get("/api/admin/banners")
async def get_all_banners(user: dict = Depends(require_admin)):
    banners = await db.banners.find({}).sort("order_index", 1).to_list(100)
    for banner in banners:
        banner["_id"] = str(banner["_id"])
    return banners

@app.post("/api/admin/banners")
async def create_banner(banner: Banner, user: dict = Depends(require_admin)):
    banner_doc = banner.dict()
    banner_doc["created_at"] = datetime.now(timezone.utc).isoformat()
    banner_doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.banners.insert_one(banner_doc)
    await log_audit(user["email"], "banners", "create", str(result.inserted_id), new_value=banner_doc)
    
    return {"message": "Banner created", "id": str(result.inserted_id)}

@app.put("/api/admin/banners/{banner_id}")
async def update_banner(banner_id: str, banner: Banner, user: dict = Depends(require_admin)):
    old_banner = await db.banners.find_one({"_id": ObjectId(banner_id)})
    if not old_banner:
        raise HTTPException(status_code=404, detail="Banner not found")
    
    banner_doc = banner.dict()
    banner_doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.banners.update_one({"_id": ObjectId(banner_id)}, {"$set": banner_doc})
    await log_audit(user["email"], "banners", "update", banner_id, old_value=old_banner, new_value=banner_doc)
    
    return {"message": "Banner updated"}

@app.delete("/api/admin/banners/{banner_id}")
async def delete_banner(banner_id: str, user: dict = Depends(require_admin)):
    result = await db.banners.delete_one({"_id": ObjectId(banner_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Banner not found")
    
    await log_audit(user["email"], "banners", "delete", banner_id)
    return {"message": "Banner deleted"}

# ===== PRODUCTS ENDPOINTS =====

@app.get("/api/cms/products")
async def get_public_products():
    products = await db.products.find({"status": True}).sort("order_index", 1).to_list(100)
    for product in products:
        product["_id"] = str(product["_id"])
    return products

@app.get("/api/admin/products")
async def get_all_products(user: dict = Depends(require_admin)):
    products = await db.products.find({}).sort("order_index", 1).to_list(100)
    for product in products:
        product["_id"] = str(product["_id"])
    return products

@app.post("/api/admin/products")
async def create_product(product: Product, user: dict = Depends(require_admin)):
    product_doc = product.dict()
    product_doc["created_at"] = datetime.now(timezone.utc).isoformat()
    product_doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.products.insert_one(product_doc)
    await log_audit(user["email"], "products", "create", str(result.inserted_id), new_value=product_doc)
    
    return {"message": "Product created", "id": str(result.inserted_id)}

@app.put("/api/admin/products/{product_id}")
async def update_product(product_id: str, product: Product, user: dict = Depends(require_admin)):
    old_product = await db.products.find_one({"_id": ObjectId(product_id)})
    if not old_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    product_doc = product.dict()
    product_doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.products.update_one({"_id": ObjectId(product_id)}, {"$set": product_doc})
    await log_audit(user["email"], "products", "update", product_id, old_value=old_product, new_value=product_doc)
    
    return {"message": "Product updated"}

@app.delete("/api/admin/products/{product_id}")
async def delete_product(product_id: str, user: dict = Depends(require_admin)):
    result = await db.products.delete_one({"_id": ObjectId(product_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    await log_audit(user["email"], "products", "delete", product_id)
    return {"message": "Product deleted"}

# ===== TESTIMONIALS ENDPOINTS =====

@app.get("/api/cms/testimonials")
async def get_public_testimonials():
    testimonials = await db.testimonials.find({"status": True}).sort("order_index", 1).to_list(100)
    for testimonial in testimonials:
        testimonial["_id"] = str(testimonial["_id"])
    return testimonials

@app.get("/api/admin/testimonials")
async def get_all_testimonials(user: dict = Depends(require_admin)):
    testimonials = await db.testimonials.find({}).sort("order_index", 1).to_list(100)
    for testimonial in testimonials:
        testimonial["_id"] = str(testimonial["_id"])
    return testimonials

@app.post("/api/admin/testimonials")
async def create_testimonial(testimonial: Testimonial, user: dict = Depends(require_admin)):
    testimonial_doc = testimonial.dict()
    testimonial_doc["created_at"] = datetime.now(timezone.utc).isoformat()
    testimonial_doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.testimonials.insert_one(testimonial_doc)
    await log_audit(user["email"], "testimonials", "create", str(result.inserted_id), new_value=testimonial_doc)
    
    return {"message": "Testimonial created", "id": str(result.inserted_id)}

@app.put("/api/admin/testimonials/{testimonial_id}")
async def update_testimonial(testimonial_id: str, testimonial: Testimonial, user: dict = Depends(require_admin)):
    old_testimonial = await db.testimonials.find_one({"_id": ObjectId(testimonial_id)})
    if not old_testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    testimonial_doc = testimonial.dict()
    testimonial_doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.testimonials.update_one({"_id": ObjectId(testimonial_id)}, {"$set": testimonial_doc})
    await log_audit(user["email"], "testimonials", "update", testimonial_id, old_value=old_testimonial, new_value=testimonial_doc)
    
    return {"message": "Testimonial updated"}

@app.delete("/api/admin/testimonials/{testimonial_id}")
async def delete_testimonial(testimonial_id: str, user: dict = Depends(require_admin)):
    result = await db.testimonials.delete_one({"_id": ObjectId(testimonial_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    await log_audit(user["email"], "testimonials", "delete", testimonial_id)
    return {"message": "Testimonial deleted"}

# ===== ABOUT/STATS ENDPOINTS =====

@app.get("/api/cms/about-stats")
async def get_public_about_stats():
    about = await db.about_stats.find_one({"status": True})
    if about:
        about["_id"] = str(about["_id"])
    return about or {}

@app.get("/api/admin/about-stats")
async def get_admin_about_stats(user: dict = Depends(require_admin)):
    about = await db.about_stats.find_one({})
    if about:
        about["_id"] = str(about["_id"])
    return about or {}

@app.post("/api/admin/about-stats")
async def create_about_stats(about: About, user: dict = Depends(require_admin)):
    about_doc = about.dict()
    about_doc["created_at"] = datetime.now(timezone.utc).isoformat()
    about_doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.about_stats.insert_one(about_doc)
    await log_audit(user["email"], "about_stats", "create", str(result.inserted_id), new_value=about_doc)
    
    return {"message": "About/Stats created", "id": str(result.inserted_id)}

@app.put("/api/admin/about-stats/{about_id}")
async def update_about_stats(about_id: str, about: About, user: dict = Depends(require_admin)):
    old_about = await db.about_stats.find_one({"_id": ObjectId(about_id)})
    if not old_about:
        raise HTTPException(status_code=404, detail="About/Stats not found")
    
    about_doc = about.dict()
    about_doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.about_stats.update_one({"_id": ObjectId(about_id)}, {"$set": about_doc})
    await log_audit(user["email"], "about_stats", "update", about_id, old_value=old_about, new_value=about_doc)
    
    return {"message": "About/Stats updated"}

# ===== FOOTER ENDPOINTS =====

@app.get("/api/cms/footer")
async def get_public_footer():
    footer = await db.footer.find_one({"status": True})
    if footer:
        footer["_id"] = str(footer["_id"])
    return footer or {}

@app.get("/api/admin/footer")
async def get_admin_footer(user: dict = Depends(require_admin)):
    footer = await db.footer.find_one({})
    if footer:
        footer["_id"] = str(footer["_id"])
    return footer or {}

@app.post("/api/admin/footer")
async def create_footer(footer: Footer, user: dict = Depends(require_admin)):
    footer_doc = footer.dict()
    footer_doc["created_at"] = datetime.now(timezone.utc).isoformat()
    footer_doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.footer.insert_one(footer_doc)
    await log_audit(user["email"], "footer", "create", str(result.inserted_id), new_value=footer_doc)
    
    return {"message": "Footer created", "id": str(result.inserted_id)}

@app.put("/api/admin/footer/{footer_id}")
async def update_footer(footer_id: str, footer: Footer, user: dict = Depends(require_admin)):
    old_footer = await db.footer.find_one({"_id": ObjectId(footer_id)})
    if not old_footer:
        raise HTTPException(status_code=404, detail="Footer not found")
    
    footer_doc = footer.dict()
    footer_doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.footer.update_one({"_id": ObjectId(footer_id)}, {"$set": footer_doc})
    await log_audit(user["email"], "footer", "update", footer_id, old_value=old_footer, new_value=footer_doc)
    
    return {"message": "Footer updated"}

# ===== EMI CALCULATOR ENDPOINTS =====

@app.get("/api/cms/emi-calculator")
async def get_public_emi_calculator():
    emi = await db.emi_calculator.find_one({"status": True})
    if emi:
        emi["_id"] = str(emi["_id"])
    return emi or {}

@app.get("/api/admin/emi-calculator")
async def get_admin_emi_calculator(user: dict = Depends(require_admin)):
    emi = await db.emi_calculator.find_one({})
    if emi:
        emi["_id"] = str(emi["_id"])
    return emi or {}

@app.post("/api/admin/emi-calculator")
async def create_emi_calculator(emi: EMICalculator, user: dict = Depends(require_admin)):
    emi_doc = emi.dict()
    emi_doc["created_at"] = datetime.now(timezone.utc).isoformat()
    emi_doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.emi_calculator.insert_one(emi_doc)
    await log_audit(user["email"], "emi_calculator", "create", str(result.inserted_id), new_value=emi_doc)
    
    return {"message": "EMI Calculator created", "id": str(result.inserted_id)}

@app.put("/api/admin/emi-calculator/{emi_id}")
async def update_emi_calculator(emi_id: str, emi: EMICalculator, user: dict = Depends(require_admin)):
    old_emi = await db.emi_calculator.find_one({"_id": ObjectId(emi_id)})
    if not old_emi:
        raise HTTPException(status_code=404, detail="EMI Calculator not found")
    
    emi_doc = emi.dict()
    emi_doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.emi_calculator.update_one({"_id": ObjectId(emi_id)}, {"$set": emi_doc})
    await log_audit(user["email"], "emi_calculator", "update", emi_id, old_value=old_emi, new_value=emi_doc)
    
    return {"message": "EMI Calculator updated"}

# ===== ARTICLES ENDPOINTS =====

@app.get("/api/cms/articles")
async def get_public_articles():
    articles = await db.articles.find({"status": True}).sort("published_date", -1).to_list(100)
    for article in articles:
        article["_id"] = str(article["_id"])
    return articles

@app.get("/api/admin/articles")
async def get_all_articles(user: dict = Depends(require_admin)):
    articles = await db.articles.find({}).sort("published_date", -1).to_list(100)
    for article in articles:
        article["_id"] = str(article["_id"])
    return articles

@app.post("/api/admin/articles")
async def create_article(article: Article, user: dict = Depends(require_admin)):
    article_doc = article.dict()
    article_doc["created_at"] = datetime.now(timezone.utc).isoformat()
    article_doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    article_doc["published_date"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.articles.insert_one(article_doc)
    await log_audit(user["email"], "articles", "create", str(result.inserted_id), new_value=article_doc)
    
    return {"message": "Article created", "id": str(result.inserted_id)}

@app.put("/api/admin/articles/{article_id}")
async def update_article(article_id: str, article: Article, user: dict = Depends(require_admin)):
    old_article = await db.articles.find_one({"_id": ObjectId(article_id)})
    if not old_article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    article_doc = article.dict()
    article_doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.articles.update_one({"_id": ObjectId(article_id)}, {"$set": article_doc})
    await log_audit(user["email"], "articles", "update", article_id, old_value=old_article, new_value=article_doc)
    
    return {"message": "Article updated"}

@app.delete("/api/admin/articles/{article_id}")
async def delete_article(article_id: str, user: dict = Depends(require_admin)):
    result = await db.articles.delete_one({"_id": ObjectId(article_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Article not found")
    
    await log_audit(user["email"], "articles", "delete", article_id)
    return {"message": "Article deleted"}

# ===== MEDIA LIBRARY ENDPOINTS =====

@app.post("/api/admin/media/upload")
async def upload_media(file: UploadFile = File(...), user: dict = Depends(require_admin)):
    media_doc = await optimize_and_save_image(file, user["email"])
    return media_doc

@app.get("/api/admin/media/library")
async def get_media_library(user: dict = Depends(require_admin)):
    media_items = await db.media_library.find({}).sort("uploaded_at", -1).to_list(100)
    for item in media_items:
        item["_id"] = str(item["_id"])
    return media_items

@app.delete("/api/admin/media/{media_id}")
async def delete_media(media_id: str, user: dict = Depends(require_admin)):
    media = await db.media_library.find_one({"_id": ObjectId(media_id)})
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    
    # Delete file from disk
    file_path = UPLOAD_DIR / media["file_name"]
    if file_path.exists():
        file_path.unlink()
    
    await db.media_library.delete_one({"_id": ObjectId(media_id)})
    await log_audit(user["email"], "media", "delete", media_id)
    
    return {"message": "Media deleted"}

# ===== AUDIT LOGS =====

@app.get("/api/admin/audit-logs")
async def get_audit_logs(limit: int = 100, user: dict = Depends(require_admin)):
    logs = await db.audit_logs.find({}).sort("timestamp", -1).limit(limit).to_list(limit)
    for log in logs:
        log["_id"] = str(log["_id"])
    return logs

# ===== INITIALIZE DEFAULT ADMIN =====

@app.on_event("startup")
async def startup_event():
    # Create default admin if not exists
    admin_exists = await db.users.find_one({"email": "admin@ahamhfc.com"})
    if not admin_exists:
        admin_user = {
            "name": "Admin User",
            "email": "admin@ahamhfc.com",
            "password_hash": get_password_hash("admin123"),
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "last_login": None
        }
        await db.users.insert_one(admin_user)
        print("✅ Default admin user created: admin@ahamhfc.com / admin123")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)