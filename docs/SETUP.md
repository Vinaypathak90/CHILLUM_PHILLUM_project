# Development Setup Guide

Complete step-by-step guide to get the project running locally.

## 📋 Prerequisites

Before starting, ensure you have:

- **Node.js** v16 or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Git** ([Download](https://git-scm.com/))
- **Code Editor** (VS Code recommended)

Check versions:
```bash
node --version    # Should be v16+
npm --version     # Should be v8+
git --version     # Any recent version
```

---

## 🔧 Backend Setup

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

This installs:
- Express (web framework)
- MongoDB/Mongoose (database)
- JWT (authentication)
- Multer (file uploads)
- Bcryptjs (password hashing)
- CORS (cross-origin requests)

### Step 2: Create Environment Variables

Create a `.env` file in the `backend/` folder:

```bash
touch .env
```

Add these variables:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chillum_phillum
# Or for local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/chillum_phillum

# Server
PORT=5000
NODE_ENV=development

# JWT Authentication
JWT_SECRET=your_super_secret_key_change_this_in_production

# Optional
UPLOAD_DIR=./uploads
```

### Step 3: Get MongoDB Connection String

**Option A: MongoDB Local**
```bash
# If MongoDB is installed locally
MONGODB_URI=mongodb://localhost:27017/chillum_phillum
```

**Option B: MongoDB Atlas (Cloud)**
1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account/login
3. Create a cluster
4. Click "Connect" → "Connect your application"
5. Copy connection string
6. Replace `<username>`, `<password>`, `<cluster>`

```
MONGODB_URI=mongodb+srv://youruser:yourpass@cluster0.abc123.mongodb.net/chillum_phillum
```

### Step 4: Initialize Admin Account

```bash
node createAdmin.js
```

This creates the first admin account. You'll be prompted for:
- Email: `admin@example.com`
- Password: (choose a strong password)

### Step 5: Start Backend Server

```bash
npm start
```

Or with hot reload:
```bash
npm install -g nodemon  # One time
npm run dev
```

**Expected output:**
```
✅ MongoDB Connected!
✅ Server running on port 5000
```

Visit: `http://localhost:5000/` (should show server info or home page)

---

## 🎨 Frontend Setup

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

This installs:
- React (UI library)
- React Router (navigation)
- Axios (HTTP client)
- Tailwind CSS (styling)
- Vite (build tool)

### Step 2: Create Environment File

Create `.env` in `frontend/`:

```bash
touch .env
```

Add:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

This tells the frontend where to find the backend API.

### Step 3: Start Frontend Development Server

```bash
npm run dev
```

**Expected output:**
```
  VITE v5.0.0  ready in 123 ms

  ➜  Local:   http://localhost:5173/
```

Open in browser: `http://localhost:5173`

---

## ✅ Verification Checklist

### Backend Running?
```bash
curl http://localhost:5000/api/page-content
# Should return JSON response
```

### Frontend Running?
- Open `http://localhost:5173`
- Should see homepage

### Can Access Admin Panel?
1. Go to `http://localhost:5173/admin/login`
2. Use credentials from admin initialization
3. Should see dashboard

### Database Connected?
1. Login to MongoDB Atlas (if cloud)
2. Check Collections → PageContent
3. Should have at least one document

---

## 🔑 Default Admin Credentials

After running `node createAdmin.js`, use these to login:

```
Email: admin@example.com
Password: (the one you entered)
```

**⚠️ Important:** Change password in production!

---

## 📂 File Structure Overview

```
./backend
  ├── config/db.js          ← MongoDB connection
  ├── middleware/           ← Authentication, CORS
  ├── models/               ← Database schemas
  ├── routes/               ← API endpoints
  ├── controllers/          ← Business logic
  ├── server.js             ← Express app
  ├── createAdmin.js        ← Initialize admin
  └── .env                  ← Environment variables

./frontend
  ├── src/
  │   ├── components/       ← Reusable UI pieces
  │   ├── pages/            ← Full page components
  │   ├── assets/           ← Images, fonts
  │   ├── config.js         ← API configuration
  │   ├── App.jsx           ← Main app component
  │   └── main.jsx          ← React entry point
  ├── public/               ← Static files
  ├── vite.config.js        ← Vite configuration
  └── tailwind.config.js    ← Tailwind configuration
```

---

## 🐛 Common Issues & Solutions

### Issue: "MongoDB connection refused"
**Solution:**
- If using local MongoDB: Make sure MongoDB service is running
  ```bash
  # macOS
  brew services start mongodb-community
  
  # Windows
  # Start MongoDB from Services
  
  # Linux
  sudo systemctl start mongod
  ```

- If using Atlas: Check connection string in `.env`
  - Username/password correct?
  - IP whitelist includes your IP?
  - Cluster name correct?

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or use different port
PORT=5001 npm start
```

### Issue: "Frontend can't reach backend API"
**Solution:**
- Check `frontend/.env` has correct API URL
- Make sure backend is running on that port
- Check browser console for CORS errors
- If using different machine: use machine IP instead of localhost

### Issue: "Admin login not working"
**Solution:**
```bash
# Recreate admin account
node createAdmin.js

# Or check existing admins in MongoDB
# Connect to MongoDB and query: db.admins.find()
```

### Issue: "Image upload fails"
**Solution:**
- Check backend has `uploads/` directory: `mkdir -p backend/uploads`
- Check file permissions on uploads folder
- Verify multer configuration in server.js

### Issue: Vite build fails
**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 🚀 Development Workflow

### Making Changes

**Backend:**
1. Edit files in `backend/controllers`, `models`, `routes`
2. Server auto-reloads with nodemon
3. Test with Postman or curl
4. Check browser console for errors

**Frontend:**
1. Edit files in `frontend/src`
2. Browser auto-refreshes with Vite
3. Check browser DevTools (F12)
4. Save to trigger hot module replacement

### Testing API Endpoints

Use Postman or curl:

```bash
# Get all content (public)
curl http://localhost:5000/api/page-content

# Login (get token)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"yourpassword"}'

# Update content (protected)
curl -X POST http://localhost:5000/api/page-content \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"hero":{"titleMain":"New Title"}}'
```

---

## 📚 Next Steps

1. **Understand the data flow:** See [API.md](API.md)
2. **Deploy your app:** See [Deployment.md](Deployment.md)
3. **Setup Map embedding:** See [../MAP_SETUP_GUIDE.md](../MAP_SETUP_GUIDE.md)
4. **Review backend models:** Check `backend/models/`
5. **Check frontend components:** Explore `frontend/src/components/`

---

## 💡 Tips for Development

- **Use browser DevTools** (F12) to debug frontend
- **Use MongoDB Compass** for easy database browsing
- **Use Postman** to test API endpoints
- **Keep .env private** - never commit to Git
- **Always use Bearer tokens** for protected routes
- **Test on mobile** using your machine's IP address

---

## 🔗 Useful Links

- [Node.js Docs](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [React Docs](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [JWT Explanation](https://jwt.io/introduction)

---

**Happy coding! 🚀**

If you get stuck, check the error messages in console and search the issue online.
