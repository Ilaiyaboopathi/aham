# AHAM Housing Finance - CMS Admin Panel Guide

## Overview
Complete CMS (Content Management System) backend + Admin Panel built with **FastAPI + MongoDB + React** for AHAM Housing Finance website.

---

## 🔐 Admin Credentials

**Login URL:** `https://your-domain.com/admin`

**Default Admin Account:**
- Email: `admin@ahamhfc.com`
- Password: `admin123`

⚠️ **IMPORTANT:** Change the default password after first login!

---

## 🎯 Features Implemented

### 1. **Authentication & Authorization**
- JWT-based secure authentication
- Role-based access control (Admin, Editor, Viewer)
- Protected API routes
- Session management

### 2. **Content Management**

#### Hero Banners
- Create/Edit/Delete carousel banners
- Bilingual support (English/Tamil)
- Image upload with optimization
- Order management
- Active/Inactive status

#### Loan Products
- Manage loan products and services
- Bilingual descriptions
- Image and icon management
- Feature highlights
- Custom gradients

#### Testimonials
- Customer reviews and ratings
- Profile photos
- Location and loan type tagging
- Bilingual comments

#### Articles & Updates
- Blog post management
- Auto-slug generation
- Thumbnail images
- Published/Draft status
- Bilingual content

### 3. **Media Library**
- Image upload with auto-optimization
- Convert to WebP format
- Resize to max 1920px width
- 2MB file size limit
- Search and filter
- Copy URL to clipboard
- Delete unused media

### 4. **User Management** (Admin only)
- Create new admin users
- Assign roles (Admin/Editor/Viewer)
- View login history
- Delete users

### 5. **Audit Logs**
- Track all CMS changes
- User activity monitoring
- Change history (old/new values)
- Filter by section
- Timestamp tracking

---

## 🚀 API Endpoints

### Public APIs (Frontend Consumption)
```
GET  /api/cms/banners         - Get active banners
GET  /api/cms/products        - Get active products
GET  /api/cms/testimonials    - Get active testimonials
GET  /api/cms/articles        - Get published articles
```

### Admin APIs (JWT Protected)
```
POST /api/admin/login         - Admin login
GET  /api/admin/me            - Get current user info

# Banners
GET    /api/admin/banners
POST   /api/admin/banners
PUT    /api/admin/banners/:id
DELETE /api/admin/banners/:id

# Products
GET    /api/admin/products
POST   /api/admin/products
PUT    /api/admin/products/:id
DELETE /api/admin/products/:id

# Testimonials
GET    /api/admin/testimonials
POST   /api/admin/testimonials
PUT    /api/admin/testimonials/:id
DELETE /api/admin/testimonials/:id

# Articles
GET    /api/admin/articles
POST   /api/admin/articles
PUT    /api/admin/articles/:id
DELETE /api/admin/articles/:id

# Media
POST   /api/admin/media/upload
GET    /api/admin/media/library
DELETE /api/admin/media/:id

# Users (Admin only)
GET    /api/admin/users
POST   /api/admin/users
DELETE /api/admin/users/:id

# Audit Logs
GET    /api/admin/audit-logs?limit=100
```

---

## 📁 Project Structure

```
/app/
├── backend/
│   ├── server.py              # FastAPI application
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
│
├── frontend/
│   └── src/
│       ├── admin/             # Admin Panel
│       │   ├── AdminApp.js    # Admin routing
│       │   ├── admin.css      # Admin styles
│       │   ├── components/    # Reusable components
│       │   │   ├── AdminLayout.js
│       │   │   ├── BannerModal.js
│       │   │   ├── ProductModal.js
│       │   │   ├── TestimonialModal.js
│       │   │   ├── ArticleModal.js
│       │   │   └── UserModal.js
│       │   ├── pages/         # Admin pages
│       │   │   ├── AdminLogin.js
│       │   │   ├── AdminDashboard.js
│       │   │   ├── BannersManager.js
│       │   │   ├── ProductsManager.js
│       │   │   ├── TestimonialsManager.js
│       │   │   ├── ArticlesManager.js
│       │   │   ├── MediaLibrary.js
│       │   │   ├── UsersManager.js
│       │   │   └── AuditLogs.js
│       │   └── utils/         # Utilities
│       │       ├── auth.js
│       │       └── api.js
│       │
│       └── components/        # Frontend components (existing)
│
└── uploads/                   # Uploaded media files
```

---

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **MongoDB** - NoSQL database via Motor (async driver)
- **Pydantic** - Data validation
- **JWT** - Token-based authentication
- **Pillow** - Image processing
- **Bcrypt** - Password hashing

### Frontend (Admin)
- **React** - UI framework
- **React Router** - Routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Heroicons** - Icon library
- **Tailwind CSS** - Styling

---

## 🔧 Configuration

### Backend Environment Variables (.env)
```bash
MONGO_URL=mongodb://localhost:27017
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### Frontend Environment Variables
```bash
REACT_APP_BACKEND_URL=https://your-api-domain.com
```

---

## 📝 Usage Guide

### 1. Creating a Banner
1. Navigate to **Hero Banners**
2. Click **Add Banner**
3. Fill in bilingual titles and subtitles
4. Add image URL
5. Select CTA action
6. Add 3 highlights
7. Set order index
8. Toggle Active/Inactive
9. Click **Create**

### 2. Managing Products
1. Navigate to **Loan Products**
2. Click **Add Product**
3. Fill product details (bilingual)
4. Add image and icon
5. Specify features
6. Choose gradient colors
7. Click **Create**

### 3. Uploading Media
1. Navigate to **Media Library**
2. Click **Upload Image**
3. Select image (max 2MB)
4. Image is auto-optimized to WebP
5. Copy URL for use in other sections

### 4. Adding Users
1. Navigate to **User Management**
2. Click **Add User**
3. Enter name, email, password
4. Assign role (Admin/Editor/Viewer)
5. Click **Create User**

---

## 🔒 Security Features

1. **Password Hashing** - Bcrypt encryption
2. **JWT Tokens** - Secure session management (24hr expiry)
3. **Role-Based Access** - Admin, Editor, Viewer permissions
4. **Protected Routes** - Backend API authentication
5. **Audit Logging** - Complete change tracking
6. **File Validation** - Size and type checks on uploads

---

## 📊 Database Schema

### Collections

#### users
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password_hash: String,
  role: String,
  created_at: ISODate,
  last_login: ISODate
}
```

#### banners
```javascript
{
  _id: ObjectId,
  title_en: String,
  title_ta: String,
  subtitle_en: String,
  subtitle_ta: String,
  cta_text_en: String,
  cta_text_ta: String,
  cta_action: String,
  image_url: String,
  highlights: Array,
  order_index: Number,
  status: Boolean,
  created_at: ISODate,
  updated_at: ISODate
}
```

#### products
```javascript
{
  _id: ObjectId,
  title_en: String,
  title_ta: String,
  description_en: String,
  description_ta: String,
  icon: String,
  image_url: String,
  features: Array,
  gradient: String,
  order_index: Number,
  status: Boolean,
  created_at: ISODate,
  updated_at: ISODate
}
```

#### testimonials
```javascript
{
  _id: ObjectId,
  name: String,
  location: String,
  rating: Number,
  comment_en: String,
  comment_ta: String,
  image_url: String,
  loan_type: String,
  order_index: Number,
  status: Boolean,
  created_at: ISODate,
  updated_at: ISODate
}
```

#### articles
```javascript
{
  _id: ObjectId,
  title_en: String,
  title_ta: String,
  slug: String,
  content_en: String,
  content_ta: String,
  thumbnail_url: String,
  published_date: ISODate,
  status: Boolean,
  created_at: ISODate,
  updated_at: ISODate
}
```

#### media_library
```javascript
{
  _id: ObjectId,
  file_name: String,
  url: String,
  alt_text_en: String,
  alt_text_ta: String,
  file_size: Number,
  uploaded_by: String,
  uploaded_at: ISODate
}
```

#### audit_logs
```javascript
{
  _id: ObjectId,
  user_email: String,
  section: String,
  action: String,
  record_id: String,
  old_value: Object,
  new_value: Object,
  timestamp: ISODate
}
```

---

## 🎨 Admin Panel Screenshots

1. **Login Page** - Secure JWT authentication
2. **Dashboard** - Overview with stats and recent activity
3. **Hero Banners** - CRUD interface with bilingual support
4. **Media Library** - Upload and manage images
5. **User Management** - Role-based access control
6. **Audit Logs** - Complete change tracking

---

## 🚨 Important Notes

1. **Default Credentials** - Change immediately after first login
2. **Image Upload** - Max 2MB, auto-converted to WebP
3. **Bilingual** - All content supports English and Tamil
4. **Audit Trail** - All changes are logged automatically
5. **Role Permissions**:
   - **Admin**: Full access (create users, delete content)
   - **Editor**: Manage content (no user management)
   - **Viewer**: Read-only access

---

## 🔄 Integration with Frontend

The existing frontend components can now fetch data from CMS APIs:

```javascript
// Example: Fetch banners
const response = await fetch(`${REACT_APP_BACKEND_URL}/api/cms/banners`);
const banners = await response.json();
```

---

## 📞 Support

For issues or questions:
1. Check audit logs for recent changes
2. Verify user permissions
3. Check browser console for errors
4. Review backend logs: `/var/log/supervisor/backend.err.log`

---

## ✅ Testing Checklist

- [x] Admin login with default credentials
- [x] Create/Edit/Delete banners
- [x] Upload and optimize images
- [x] Bilingual content support
- [x] User management (Admin only)
- [x] Audit log tracking
- [x] JWT authentication
- [x] Role-based permissions

---

## 🎯 Next Steps (Optional Enhancements)

1. **Frontend Integration** - Update existing components to fetch from CMS
2. **SEO Manager** - Add page-level meta tags management
3. **EMI Calculator Config** - Make calculator settings dynamic
4. **Footer Manager** - Dynamic footer content editing
5. **About Section** - Dynamic "Why Choose Us" content
6. **Email Templates** - Manage email notification templates

---

**Built with ❤️ using FastAPI + MongoDB + React**
