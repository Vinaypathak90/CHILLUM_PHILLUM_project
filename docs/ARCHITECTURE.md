# Project Architecture & Features

Deep dive into the project structure, design decisions, and feature implementations.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    PUBLIC WEBSITE                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Home → About → Studio → Team → Contact → Projects     │
│                                                          │
│     All powered by content from MongoDB via API        │
└─────────────────────────────────────────────────────────┘
                          ↕
                    React Frontend
                  (Vite + Tailwind CSS)
                          ↕
                    ┌────────────┐
                    │ API Route  │
                    │ /api/*     │
                    └────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│                   EXPRESS BACKEND                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Routes → Controllers → Business Logic                 │
│       ↓                                                  │
│  Middleware → Authentication → Database Operations    │
│                                                          │
│  • JWT Authentication                                   │
│  • CORS Management                                      │
│  • File Upload Handling                                 │
│  • Request Validation                                   │
│                                                          │
└─────────────────────────────────────────────────────────┘
                          ↕
                      MongoDB
                    (Atlas Cloud)
```

---

## 📊 Data Models

### PageContent (Core Schema)
This is the main document that powers the entire website:

```javascript
{
  _id: ObjectId,
  
  // Navigation
  nav: {
    logoText: String,
    logoImage: String
  },
  
  // Hero Section
  hero: {
    backgroundImages: [String],
    eyebrow: String,
    titleMain: String,
    titleHighlight: String,
    subtitle: String,
    button1: { text, link },
    button2: { text, link }
  },
  
  // About Section
  about: {
    label: String,
    titleMain: String,
    titleHighlight: String,
    titleEnd: String,
    paragraphs: [String],
    images: [String],
    stats: [{ number, label }]
  },
  
  // Studio/Services Section
  studio: {
    label: String,
    cards: [{ image, label, description }],
    capabilities: [{ icon, title, items }]
  },
  
  // Contact Page (Nested)
  contactPage: {
    mapEmbedCode: String,
    mapHeight: String,
    locations: [{
      title: String,
      address: String,
      phone: String,
      hours: String
    }],
    faqs: [{
      question: String,
      answer: String
    }],
    services: [{
      icon: String,
      title: String,
      desc: String
    }]
  },
  
  // Footer
  footer: {
    copyrightText: String,
    socials: {
      instagram: String,
      x: String,
      facebook: String
    }
  },
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

### Other Models

**Admin:**
```javascript
{
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

**Campaign:**
```javascript
{
  title: String,
  description: String,
  status: String, // active, completed, draft
  specialties: [String],
  content: String
}
```

**Project:**
```javascript
{
  title: String,
  description: String,
  image: String,
  category: String,
  skills: [String],
  link: String
}
```

**Message:**
```javascript
{
  name: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  read: Boolean,
  createdAt: Date
}
```

---

## 🔐 Authentication Flow

### Login Process

```
User Input (Email + Password)
        ↓
POST /api/auth/login
        ↓
Backend validates credentials
        ↓
Password matches hash?
  ├─ YES → Generate JWT token
  │        Return token + success
  │        Token stored in localStorage
  │
  └─ NO → Return error 401
```

### Protected Route Access

```
Frontend makes request with token in header:
Authorization: Bearer eyJhbGc...

Backend receives request
        ↓
Check Authorization header
        ↓
Verify JWT signature & expiry
        ↓
Valid?
  ├─ YES → Allow request, process
  └─ NO → Return 401 Unauthorized
```

### Token Flow

```javascript
// Frontend
localStorage.setItem('authToken', response.data.token);

// Every request includes:
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Backend checks:
const token = req.headers.authorization?.split(' ')[1];
jwt.verify(token, process.env.JWT_SECRET);
```

---

## 💾 Content Management System

### How Content Updates Work

**Admin Panel Flow:**
```
Admin opens ManageContent.jsx
        ↓
Page loads current content from API
        ↓
Admin edits form fields/uploads images
        ↓
Changes stored in React state (client-side only)
        ↓
Admin clicks "UPDATE WEBSITE CONTENT"
        ↓
POST /api/page-content with updated data
        ↓
Backend validates & updates MongoDB
        ↓
Public pages fetch new content via GET /api/page-content
        ↓
Changes appear on website immediately
```

### Two-Phase Update System

**Phase 1: Client-Side State**
```javascript
// Edit form fields
handleContactPageChange('mapEmbedCode', 'new value');
// Updates React state immediately
// User sees changes in form
```

**Phase 2: Database Persistence**
```javascript
// Click save button
handleSave()
// POST entire content object to backend
// MongoDB updated
// Public pages now show new data
```

### Backwards Compatibility

```javascript
// Supports BOTH old structure AND new structure:
const locations = 
  pageData.locations?.length > 0 
    ? pageData.locations  // New: nested under contactPage
    : content?.locations  // Old: at root level
    ? content.locations
    : defaultLocations;  // Fallback
```

---

## 🎨 UI/UX Patterns

### Glass Morphism Component

Used throughout for modern aesthetic:

```css
/* Glass effect = backdrop blur + transparency */
background: linear-gradient(
  135deg, 
  rgba(255,255,255,0.15) 0%, 
  rgba(255,255,255,0.05) 100%
);
border: 1px solid rgba(255,255,255,0.2);
backdrop-filter: blur(10px);
box-shadow: 0 8px 32px 0 rgba(31,38,135,0.1);
```

### Form Components

**Admin Form Pattern:**
```jsx
// Input with label, validation, and styling
<div className="form-group">
  <label>Field Label</label>
  <input 
    className="form-input"
    value={content.field}
    onChange={(e) => handleChange('section', 'field', e.target.value)}
  />
</div>
```

### Responsive Design

```javascript
// Tailwind responsive prefixes
className="
  grid 
  grid-cols-1         // Mobile: 1 column
  md:grid-cols-2      // Tablet: 2 columns
  lg:grid-cols-3      // Desktop: 3 columns
"
```

---

## 🖼️ Image Handling

### Upload Flow

```
Admin selects image file
        ↓
handleImageUpload triggered
        ↓
FormData created with file
        ↓
POST /api/upload (multipart/form-data)
        ↓
Multer saves file to backend/uploads/
        ↓
Backend returns image URL
        ↓
URL stored in pageContent database
        ↓
Frontend fetches and displays in <img src={url} />
```

### Image URL Storage

```javascript
// Images stored as URLs in database
contactPage: {
  mapEmbedCode: '<iframe src="..." />'
}

// On frontend, directly used in HTML
<div dangerouslySetInnerHTML={{ __html: mapEmbedCode }} />
```

---

## 🔄 Data Flow Examples

### Example 1: Updating Location List

```
Step 1: User adds new location in ManageContent
  → setState: locations = [..., newLocation]

Step 2: User clicks "UPDATE WEBSITE CONTENT"
  → POST /api/page-content { contactPage: { locations: [...] } }

Step 3: Backend receives, validates, saves to MongoDB
  → MongoDB.PageContent.findOneAndUpdate()

Step 4: Public Contact.jsx fetches data
  → GET /api/page-content
  → Receives updated locations

Step 5: Contact page renders with new location
  → locations.map(loc => <LocationCard {...loc} />)
```

### Example 2: Uploading Hero Image

```
Step 1: Admin selects image in upload input
  → handleImageUpload triggered

Step 2: File sent to backend
  → POST /api/upload with FormData

Step 3: Backend saves file
  → Multer saves to ./uploads/
  → Returns { imageUrl: '/uploads/abc123.jpg' }

Step 4: Frontend updates state
  → setState: { hero: { backgroundImages: ['...', '/uploads/abc123.jpg'] } }

Step 5: Admin clicks Save
  → POST /api/page-content with updated images array

Step 6: Homepage loads
  → GET /api/page-content
  → Receives image URL
  → Renders: <img src="/uploads/abc123.jpg" />
```

---

## 🌐 Routing Structure

### Frontend Routes (React Router)

```javascript
<Routes>
  {/* Public Routes */}
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/studio" element={<Studio />} />
  <Route path="/team" element={<Team />} />
  <Route path="/contact" element={<Contact />} />
  
  {/* Admin Routes */}
  <Route path="/admin/login" element={<Login />} />
  <Route path="/admin/dashboard" element={<Dashboard />} />
  <Route path="/admin/content" element={<ManageContent />} />
  <Route path="/admin/campaigns" element={<ManageCampaigns />} />
  
  {/* Fallback */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

### Backend Routes (Express)

```javascript
// Public
GET  /api/page-content           // Get all content

// Authentication
POST /api/auth/login             // Admin login

// Admin Protected
POST /api/page-content           // Update content
POST /api/campaigns              // Create campaign
GET  /api/campaigns              // List campaigns
PUT  /api/campaigns/:id          // Update campaign
DELETE /api/campaigns/:id        // Delete campaign

// Files
POST /api/upload                 // Upload image
```

---

## 🔌 API Request/Response Pattern

### Standard Response Format

```javascript
// Success
{
  success: true,
  data: { /* actual data */ },
  message: "Operation successful"
}

// Error
{
  success: false,
  message: "Error message explaining what went wrong"
}
```

### Error Handling

**Frontend:**
```javascript
try {
  const response = await API.post('/endpoint', data);
  if (response.data.success) {
    // Handle success
  }
} catch (error) {
  // Handle error
  console.error(error.response?.data?.message);
}
```

**Backend:**
```javascript
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message
  });
});
```

---

## 🚀 Performance Considerations

### Optimization Strategies

1. **Frontend:**
   - Vite for fast builds
   - Code splitting with React.lazy
   - Image optimization
   - Tailwind purging unused CSS

2. **Backend:**
   - Database indexing
   - Request validation early
   - Efficient queries
   - Caching strategies

3. **Database:**
   - MongoDB Atlas auto-scaling
   - Proper indexes on frequently queried fields
   - Connection pooling

### Caching Strategy

```javascript
// Could add Redis caching layer
const cachedContent = cache.get('page-content');
if (cachedContent) {
  return cachedContent;
}
// Otherwise fetch from DB
const content = await PageContent.findOne();
cache.set('page-content', content, 3600); // 1 hour TTL
return content;
```

---

## 🧪 Testing Checklist

**Before Deployment:**
- [ ] All API endpoints return correct data
- [ ] Authentication works (login/logout)
- [ ] Content updates persist
- [ ] Images upload and display
- [ ] Forms validate correctly
- [ ] Mobile responsive design works
- [ ] No console errors
- [ ] Contact form sends emails (if configured)

---

## 📚 Technology Decisions

### Why React + Vite?
- Fast development experience
- Component reusability
- Large community
- Excellent DevTools

### Why Express?
- Lightweight and flexible
- Fast development
- Great middleware ecosystem
- Perfect for REST APIs

### Why MongoDB?
- Flexible schema (easy to add fields)
- Scales well horizontally
- Great for content management
- Cloud hosting (Atlas) is free tier available

### Why Tailwind CSS?
- Utility-first approach
- Rapid UI development
- Consistent design system
- Small bundle size

---

## 🔮 Future Improvements

Potential enhancements:

1. **Search functionality** - Full-text search on projects/campaigns
2. **Comments system** - Allow team discussions
3. **Email notifications** - Notify on new messages
4. **SEO optimization** - Meta tags, sitemap, robots.txt
5. **Analytics** - Track page views, user behavior
6. **API rate limiting** - Prevent abuse
7. **GraphQL** - Alternative to REST API
8. **Redis caching** - Faster content delivery
9. **Docker** - Containerization for easy deployment
10. **Automated testing** - Jest, Cypress

---

**Last Updated:** April 4, 2026
