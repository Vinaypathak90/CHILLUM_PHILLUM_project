# API Documentation

## Base URL
```
http://localhost:5000/api
Production: https://chillum-backend.herokuapp.com/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

### Login (Admin)
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "your_password"
}

Response (200):
{
  "success": true,
  "token": "eyJhbGc...",
  "message": "Admin logged in successfully"
}
```

---

## 📄 Content Management

### Get Page Content
```http
GET /api/page-content
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "nav": { "logoText": "CHILLUM PHILLUM", "logoImage": "..." },
    "hero": { "titleMain": "...", "titleHighlight": "..." },
    "about": { "paragraphs": [...], "images": [...] },
    "studio": { "cards": [...] },
    "contact": { "email": "...", "phone": "..." },
    "contactPage": {
      "locations": [
        { "title": "Mumbai Studio", "address": "...", "phone": "...", "hours": "..." }
      ],
      "faqs": [
        { "question": "...", "answer": "..." }
      ],
      "services": [
        { "icon": "🎬", "title": "Video Production", "desc": "..." }
      ]
    },
    "footer": { "copyrightText": "...", "socials": {...} }
  }
}
```

### Update Page Content
```http
POST /api/page-content
Authorization: Bearer <token>
Content-Type: application/json

{
  "hero": {
    "titleMain": "New Title",
    "titleHighlight": "Highlight"
  },
  "contactPage": {
    "locations": [
      {
        "title": "Mumbai Studio",
        "address": "Bandra West, Mumbai",
        "phone": "+91 22 1234 5678",
        "hours": "Mon-Fri: 10 AM - 7 PM"
      }
    ]
  }
}

Response (200):
{
  "success": true,
  "message": "Website content updated successfully!",
  "data": { ...updated content... }
}
```

---

## 🎬 Campaigns

### Get All Campaigns
```http
GET /api/campaigns
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "title": "Campaign Name",
      "description": "...",
      "status": "active",
      "specialties": ["Video", "Photography"]
    }
  ]
}
```

### Create Campaign
```http
POST /api/campaigns
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Summer Campaign 2026",
  "description": "New summer product launch",
  "status": "active",
  "specialties": ["Video Production", "Design"]
}

Response (201): { ...campaign... }
```

### Update Campaign
```http
PUT /api/campaigns/:id
Authorization: Bearer <token>

{ "title": "Updated Title" }

Response (200): { ...updated campaign... }
```

### Delete Campaign
```http
DELETE /api/campaigns/:id
Authorization: Bearer <token>

Response (200): { "success": true, "message": "Campaign deleted" }
```

---

## 🎬 Projects

### Get All Projects
```http
GET /api/projects
```

### Create Project
```http
POST /api/projects
Authorization: Bearer <token>

{
  "title": "Project Name",
  "description": "...",
  "image": "url",
  "skills": ["skill1", "skill2"]
}
```

### Update Project
```http
PUT /api/projects/:id
Authorization: Bearer <token>
```

### Delete Project
```http
DELETE /api/projects/:id
Authorization: Bearer <token>
```

---

## 👥 Clients

### Get All Clients
```http
GET /api/clients
```

### Create Client
```http
POST /api/clients
Authorization: Bearer <token>

{
  "name": "Client Name",
  "email": "client@email.com",
  "phone": "+91 99999 99999",
  "company": "Company Name"
}
```

### Update Client
```http
PUT /api/clients/:id
Authorization: Bearer <token>
```

### Delete Client
```http
DELETE /api/clients/:id
Authorization: Bearer <token>
```

---

## 💬 Messages

### Get All Messages
```http
GET /api/messages
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Sender Name",
      "email": "sender@email.com",
      "phone": "+91 99999 99999",
      "subject": "Message Subject",
      "message": "Message content",
      "createdAt": "2026-04-04T10:00:00Z"
    }
  ]
}
```

### Create Message (Public)
```http
POST /api/messages

{
  "name": "Your Name",
  "email": "your@email.com",
  "phone": "+91 99999 99999",
  "subject": "Subject",
  "message": "Your message"
}

Response (201): { "success": true, "message": "Message sent successfully" }
```

### Get Single Message
```http
GET /api/messages/:id
Authorization: Bearer <token>
```

### Delete Message
```http
DELETE /api/messages/:id
Authorization: Bearer <token>
```

---

## 👨‍💼 Team

### Get All Team Members
```http
GET /api/team
```

### Create Team Member
```http
POST /api/team
Authorization: Bearer <token>

{
  "name": "Member Name",
  "role": "Role Title",
  "bio": "Bio description",
  "image": "image_url",
  "skills": ["skill1", "skill2"]
}
```

### Update Team Member
```http
PUT /api/team/:id
Authorization: Bearer <token>
```

### Delete Team Member
```http
DELETE /api/team/:id
Authorization: Bearer <token>
```

---

## 📤 File Upload

### Upload Image
```http
POST /api/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- file: <binary_file>

Response (200):
{
  "success": true,
  "imageUrl": "/uploads/filename.jpg"
}
```

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid request body"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Token expired or invalid"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 🔄 Data Flow Example

### Update Homepage Content
```
Admin Panel
  ↓
Fill form (titleMain, images, etc.)
  ↓
Click "UPDATE WEBSITE CONTENT"
  ↓
POST /api/page-content with new data
  ↓
Backend validates & updates MongoDB
  ↓
Response: { "success": true, "data": {...} }
  ↓
Admin sees success message
  ↓
Public website reads GET /api/page-content
  ↓
Contact page displays updated locations & FAQs
```

---

## 📦 Request/Response Examples

### Using Axios (Frontend)
```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Add token to all requests
API.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Get content
const response = await API.get('/page-content');

// Update content
const updateResponse = await API.post('/page-content', {
  hero: { titleMain: 'New Title' }
});
```

### Using cURL (Testing)
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Get content
curl -X GET http://localhost:5000/api/page-content

# Update content (with token)
curl -X POST http://localhost:5000/api/page-content \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"hero":{"titleMain":"New Title"}}'
```

---

**Last Updated:** April 4, 2026
