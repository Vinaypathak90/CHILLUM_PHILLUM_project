# Quick Start Guide

**Get the project running in 5 minutes!**

## 🚀 TL;DR (For the impatient)

### Prerequisites
- Node.js v16+
- MongoDB (local or [Atlas](https://www.mongodb.com/cloud/atlas))

### Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB connection
npm install
node createAdmin.js
npm start
# Backend runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

### Login
- Go to `http://localhost:5173/admin/login`
- Email: `admin@example.com`
- Password: (what you set during createAdmin.js)

---

## 📋 Detailed Quick Start

### Step 1: Clone or Download Project
```bash
cd chillum_phillum
```

### Step 2: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env
# Change MONGODB_URI to your connection string
```

**Choose one:**

**Option A: Local MongoDB**
```env
MONGODB_URI=mongodb://localhost:27017/chillum_phillum
```

**Option B: MongoDB Atlas** (Free)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account & cluster
3. Get connection string
4. Paste in .env

```env
MONGODB_URI=mongodb+srv://user:password@cluster.abc123.mongodb.net/chillum_phillum
```

**Continue:**
```bash
# Create admin account
node createAdmin.js
# Follow prompts - remember password!

# Start backend
npm start

# Should see: ✅ Server running on port 5000
```

### Step 3: Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# .env already has correct localhost values
# In production, update VITE_API_BASE_URL

# Start frontend
npm run dev

# Should see: ➜ Local: http://localhost:5173/
```

### Step 4: Access Application

Open browser:

**Public Website:**
- Home: `http://localhost:5173`
- About: `http://localhost:5173/about`
- Contact: `http://localhost:5173/contact`

**Admin Panel:**
- Login: `http://localhost:5173/admin/login`
- Dashboard: `http://localhost:5173/admin/dashboard`
- Content Editor: `http://localhost:5173/admin/content`

---

## 🔑 Default Credentials

```
Email: admin@example.com
Password: (whatever you entered during createAdmin.js)
```

**Change this immediately in production!**

---

## 📁 Project Structure at a Glance

```
backend/
  ├── server.js           ← Start here
  ├── models/             ← Database schemas
  ├── controllers/        ← Business logic
  ├── routes/             ← API endpoints
  ├── .env                ← Your secrets (don't share!)
  └── createAdmin.js      ← Create admin account

frontend/
  ├── src/
  │   ├── pages/          ← Public & admin pages
  │   ├── components/     ← Reusable components
  │   ├── App.jsx         ← Main app
  │   └── config.js       ← API configuration
  └── .env                ← Your config
```

---

## ⚡ Common Commands

### Backend
```bash
npm start                 # Start server
npm run dev              # Start with auto-reload
node createAdmin.js      # Create admin user
```

### Frontend
```bash
npm run dev              # Start dev server (auto-reload)
npm run build            # Production build
npm run preview          # Preview production build
npm run lint             # Check for errors
```

---

## 🐛 Quick Troubleshooting

### "MongoDB connection refused"
```bash
# Make sure MongoDB is running
# Local: mongod (in terminal/services)
# Cloud: Check MongoDB Atlas connection string in .env
```

### "Port 5000 already in use"
```bash
# Change port in backend .env
PORT=5001

# Or kill existing process
lsof -i :5000  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### "Frontend can't reach backend"
```bash
# Check frontend/.env has correct URL
VITE_API_BASE_URL=http://localhost:5000/api

# Check backend is running
curl http://localhost:5000/api/page-content
```

### "Admin login fails"
```bash
# Create new admin
cd backend
node createAdmin.js

# Or check MongoDB has admin
# In MongoDB Compass: Database > admins > find documents
```

### "Images don't upload"
```bash
# Create uploads directory
mkdir -p backend/uploads

# Check permissions
chmod 755 backend/uploads
```

---

## 🎯 Next Steps

1. **Explore the code** - Look around `frontend/src` and `backend/controllers`
2. **Edit content** - Login and try ManageContent page
3. **Read the docs** - Check `/docs` folder for detailed guides
4. **Deploy** - Follow [docs/Deployment.md](../docs/Deployment.md)

---

## 📚 Full Documentation

For detailed information:

- **Full Setup:** [docs/SETUP.md](../docs/SETUP.md)
- **API Reference:** [docs/API.md](../docs/API.md)
- **Deployment:** [docs/Deployment.md](../docs/Deployment.md)
- **Architecture:** [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md)
- **Maps Setup:** [docs/MAP_SETUP_GUIDE.md](../docs/MAP_SETUP_GUIDE.md)

---

## 🆘 Need Help?

1. **Check the docs** - Most questions answered there
2. **Check browser console** (F12) - See frontend errors
3. **Check terminal output** - See backend errors
4. **Check MongoDB Compass** - Verify data saved correctly
5. **Use Postman** - Test API endpoints directly

---

**Happy coding! 🚀**

Questions? Check the full documentation in `/docs` folder!
