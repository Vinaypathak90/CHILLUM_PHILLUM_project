# Chillum Phillum - Creative Studio Platform

A full-stack web platform for creative studios to manage content, campaigns, projects, and client interactions with a professional admin dashboard.

## 📋 Project Overview

**Chillum Phillum** is a comprehensive content management system (CMS) built for creative production studios. It provides:

- 🎬 **Public Website** - Portfolio showcase with dynamic content
- 🎯 **Admin Dashboard** - Complete content management backend
- 📱 **Responsive Design** - Mobile-first approach
- 🔐 **Authentication** - Secure admin panel access
- 💾 **Database Management** - MongoDB with Mongoose ORM
- 🎨 **Modern UI** - Glass morphism effects and smooth animations

## 🚀 Tech Stack

### Frontend
- **React 18** - UI library with hooks
- **React Router v6** - Client-side navigation
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client for API calls
- **Vite** - Build tool and dev server

### Backend
- **Node.js & Express** - Server framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Multer** - File upload handling

### Tools & Services
- **Vercel** - Frontend deployment
- **Google Maps API** - Location embedding

## 📁 Project Structure

```
chillum_phillum/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── pageContentController.js
│   │   ├── campaignController.js
│   │   ├── projectController.js
│   │   ├── clientController.js
│   │   ├── messageController.js
│   │   └── TeamController.js
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification
│   ├── models/
│   │   ├── PageContent.js        # Main content schema
│   │   ├── Campaign.js
│   │   ├── Project.js
│   │   ├── Client.js
│   │   ├── Message.js
│   │   ├── Team.js
│   │   └── Admin.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── pageContentRoutes.js
│   │   ├── campaignRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── clientRoutes.js
│   │   ├── messageRoutes.js
│   │   └── teamRoutes.js
│   ├── .env                      # Environment variables
│   ├── package.json
│   ├── server.js                 # Express app setup
│   └── createAdmin.js            # Admin account initialization
│
├── frontend/
│   ├── src/
│   │   ├── assets/               # Images, fonts, media
│   │   ├── components/           # Reusable React components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── ContactSection.jsx
│   │   │   └── ...
│   │   ├── pages/                # Page components
│   │   │   ├── public/
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── About.jsx
│   │   │   │   ├── Studio.jsx
│   │   │   │   ├── Team.jsx
│   │   │   │   └── Contact.jsx
│   │   │   └── admin/
│   │   │       ├── Login.jsx
│   │   │       ├── Dashboard.jsx
│   │   │       ├── ManageContent.jsx
│   │   │       ├── ManageCampaigns.jsx
│   │   │       └── ...
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── config.js             # API configuration
│   │   └── App.css
│   ├── public/                   # Static files
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── eslint.config.js
│
├── docs/
│   ├── API.md                    # API documentation
│   ├── SETUP.md                  # Development setup
│   ├── Deployment.md             # Deployment guide
│   └── MAP_SETUP_GUIDE.md        # Google Maps setup
│
├── .git/
├── .gitignore
├── README.md                     # This file
└── package.json                  # Root package (optional)
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB (local or Atlas)
- Git

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials
# MONGODB_URI=your_mongodb_connection
# JWT_SECRET=your_secret_key
# PORT=5000

# Initialize admin account
node createAdmin.js

# Start development server
npm start
# Server runs on http://localhost:5000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (if needed)
echo VITE_API_BASE_URL=http://localhost:5000/api > .env

# Start development server
npm run dev
# Open http://localhost:5173
```

## 📊 Database Schema

### PageContent (Main Content Model)
Central MongoDB document storing all website content:

```javascript
PageContent {
  nav: { logoText, logoImage },
  hero: { backgroundImages[], eyebrow, titleMain, titleHighlight, subtitle },
  about: { label, titleMain, titleHighlight, paragraphs[], images[] },
  studio: { label, titleMain, cards[] },
  contact: { email, phone, location },
  contactPage: {
    mapEmbedCode,
    locations: [{ title, address, phone, hours }],
    faqs: [{ question, answer }],
    services: [{ icon, title, desc }]
  },
  footer: { copyrightText, socials: { instagram, x, facebook } }
}
```

For detailed schema docs, see [backend/models/PageContent.js](backend/models/PageContent.js)

## 🔐 Authentication

### Admin Login Flow
1. User logs in with email/password
2. Backend validates credentials and returns JWT token
3. Token stored in localStorage
4. All admin panel requests include token in headers

### Protected Routes
```javascript
// Frontend
const token = localStorage.getItem('authToken');
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Backend
// authMiddleware.js verifies token before allowing access
```

## 📡 API Endpoints

### Public Endpoints
```
GET  /api/page-content        # Get all website content
```

### Admin Endpoints (Protected)
```
POST   /api/auth/login         # Admin login
GET    /api/page-content       # Get content
POST   /api/page-content       # Update content
GET    /api/campaigns          # List campaigns
POST   /api/campaigns          # Create campaign
PUT    /api/campaigns/:id      # Update campaign
DELETE /api/campaigns/:id      # Delete campaign
```

Full API documentation: [docs/API.md](docs/API.md)

## 🎨 Features

### Public Pages
- **Home** - Hero section with portfolio introduction
- **About** - Studio story and team info
- **Studio** - Services and capabilities showcase
- **Team** - Team members profile and culture
- **Contact** - Contact form with map and location
- **Projects/Campaigns** - Portfolio showcase

### Admin Dashboard
- **Content Management** - Edit all website content
- **Campaign Management** - Create and manage campaigns
- **Project Management** - Portfolio management
- **Team Management** - Team member profiles
- **Client Management** - Client information
- **Message Management** - Contact form submissions
- **Analytics** - Engagement metrics (optional)

## 🌐 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy to Vercel using Vercel CLI or Git
vercel deploy --prod
```

### Backend (Heroku/Render/Railway)
```bash
cd backend
# Configure environment variables
# Deploy using your platform's CLI
```

For detailed deployment instructions: [docs/Deployment.md](docs/Deployment.md)

## 📝 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/chillum
JWT_SECRET=your_super_secret_key_here
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## 🚀 Available Scripts

### Backend
```bash
npm start              # Start server
npm run dev            # Start with nodemon (hot reload)
node createAdmin.js    # Create admin account
```

### Frontend
```bash
npm run dev            # Start dev server
npm run build          # Production build
npm run preview        # Preview production build
npm run lint           # Run ESLint
```

## 📚 Key Features & Implementation

### 1. Backend-First Content Management
- All content stored in MongoDB PageContent collection
- Admin panel directly edits database values
- Frontend reads and displays content without hardcoding

### 2. Dynamic Data Flow
```
Admin Panel (Frontend) → Save Button 
  → POST /api/page-content 
  → MongoDB Update 
  → Public Site (Frontend) → GET /api/page-content 
  → Display Updated Content
```

### 3. Image Upload
- Multer handles file uploads to server
- Images stored in `backend/uploads/` directory
- Image URLs saved to database

### 4. Glass Morphism UI
- Modern backdrop-blur effects
- Responsive design with Tailwind
- Smooth animations and transitions

### 5. Authentication
- JWT-based admin authentication
- Protected route middleware
- Automatic token refresh

## 🔍 Troubleshooting

### Data Not Showing
- Check browser console for API errors
- Verify MongoDB connection
- Ensure content is saved in admin panel
- Check `contacts.locationPage` exists in database (not just root level)

### Authentication Issues
- Clear localStorage and login again
- Check JWT_SECRET matches in backend .env
- Verify token is sent in request headers

### Build Errors
- Clear `node_modules` and reinstall: `npm install`
- Clear build cache: `npm run build --reset-cache`
- Check Node.js version (should be v16+)

## 📧 Contact & Support

For issues or questions:
- **Email:** hello@chillumphillum.com
- **GitHub:** [Your Repo URL]
- **Documentation:** See `/docs` folder

## 📄 License

This project is proprietary. All rights reserved © 2026 Chillum Phillum.

## 🎯 Future Enhancements

- [ ] Analytics dashboard
- [ ] Email notifications
- [ ] SEO optimization
- [ ] Multi-language support
- [ ] Advanced caching
- [ ] API rate limiting
- [ ] Automated backups

---

**Last Updated:** April 4, 2026  
**Version:** 1.0.0
