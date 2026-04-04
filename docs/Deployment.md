# Deployment Guide

Complete guide to deploy Chillum Phillum to production.

## 🎯 Deployment Overview

The typical setup:
- **Frontend:** Vercel (recommended) or Netlify
- **Backend:** Heroku, Render, Railway, or DigitalOcean
- **Database:** MongoDB Atlas

---

## 🖥️ Backend Deployment

### Option 1: Deploy to Render (Recommended)

Render.com is free and easy to use.

#### Step 1: Prepare Backend

```bash
cd backend

# Ensure package.json has start script
# Should have: "start": "node server.js"

# Create .env.production
echo "MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_secret
NODE_ENV=production
PORT=3000" > .env.production
```

#### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub account
3. Authorize Render to access your repos

#### Step 3: Create New Web Service

1. Dashboard → New → Web Service
2. Select your GitHub repository
3. Configure:
   - **Name:** `chillum-phillum-backend`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Branch:** main

#### Step 4: Add Environment Variables

In Render dashboard:
1. Go to your service
2. Settings → Environment
3. Add variables:
   ```
   MONGODB_URI = mongodb+srv://...
   JWT_SECRET = your_secret_key
   NODE_ENV = production
   ```

#### Step 5: Deploy

Click "New Release" to deploy. Your backend URL will be something like:
```
https://chillum-phillum-backend.onrender.com
```

Save this URL for frontend configuration.

---

### Option 2: Deploy to Heroku

Heroku requires a credit card but has free tier available.

#### Step 1: Install Heroku CLI

```bash
# macOS
brew tap heroku/brew && brew install heroku

# Windows (or download from heroku.com)
npm install -g heroku

# Verify
heroku --version
```

#### Step 2: Login to Heroku

```bash
heroku login
# Opens browser for authentication
```

#### Step 3: Create Heroku App

```bash
cd backend
heroku create chillum-phillum-backend

# This creates your app and sets remote
# Example URL: https://chillum-phillum-backend.herokuapp.com
```

#### Step 4: Add Environment Variables

```bash
heroku config:set MONGODB_URI="mongodb+srv://..."
heroku config:set JWT_SECRET="your_production_secret"
heroku config:set NODE_ENV="production"
```

#### Step 5: Deploy

```bash
git push heroku main
```

Monitor deployment:
```bash
heroku logs --tail
```

---

## 🎨 Frontend Deployment

### Option 1: Deploy to Vercel (Recommended)

Vercel is the creator of Next.js and optimized for React.

#### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Authorize Vercel

#### Step 2: Import Project

1. Dashboard → New Project
2. Select your GitHub repository
3. Select `frontend` folder as root

#### Step 3: Environment Variables

In Vercel dashboard:
1. Project Settings → Environment Variables
2. Add:
   ```
   VITE_API_BASE_URL = https://chillum-phillum-backend.onrender.com/api
   ```

Replace with your actual backend URL!

#### Step 4: Deploy

Click "Deploy" - Vercel will:
1. Install dependencies
2. Run `npm run build`
3. Deploy to CDN
4. Provide URL: `https://chillum-phillum.vercel.app`

---

### Option 2: Deploy to Netlify

Netlify is another popular choice.

#### Step 1: Connect Repository

1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Select GitHub repo

#### Step 2: Configure Build

- **Build command:** `npm run build`
- **Publish directory:** `dist`

#### Step 3: Add Environment Variables

Build → Environment:
```
VITE_API_BASE_URL = https://your-backend-url/api
```

#### Step 4: Deploy

Click "Deploy site"

---

## 🗄️ Database Setup (MongoDB Atlas)

MongoDB Atlas is the official MongoDB cloud service.

### Step 1: Create Account

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up with email
3. Create organization
4. Create project

### Step 2: Create Cluster

1. Click "Create Deployment"
2. Choose "M0 Free Tier"
3. Select cloud provider and region
4. Create cluster (takes 2-3 minutes)

### Step 3: Create Database User

1. Database Access → Add New Database User
2. Choose "Password" authentication
3. Create username and password
4. Add to all clusters
5. **Save credentials** - you'll need them!

### Step 4: Get Connection String

1. Clusters → Connect
2. Choose "Connect your application"
3. Select Node.js and version 4.0+
4. Copy connection string:
   ```
   mongodb+srv://username:password@cluster0.abc123.mongodb.net/chillum_phillum
   ```

### Step 5: Whitelist IPs

1. Network Access → Add IP Address
2. Add your IP address (or 0.0.0.0 for all)
3. Confirm

Use this connection string in both backend and frontend environment variables!

---

## 🔗 Connecting Everything

### Update Frontend Environment

After backend is deployed, update frontend:

**Frontend .env (or Vercel environment):**
```
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

**Redeploy:**
```bash
# If using Vercel CLI
vercel --prod

# Or let Vercel auto-deploy on git push
git push
```

### Test Connection

After deployment:
1. Go to frontend URL
2. Open DevTools (F12)
3. Network tab → Check API calls
4. Should see successful responses from backend

---

## 🔒 Security Checklist

Before going live:

- [ ] Change JWT_SECRET to a strong random string
- [ ] Change admin password in production
- [ ] Enable HTTPS (should be automatic)
- [ ] Set NODE_ENV=production
- [ ] Whitelist CORS origins properly
- [ ] Use strong MongoDB password
- [ ] Enable two-factor auth on platform accounts
- [ ] Set up automated backups
- [ ] Use environment-specific configurations
- [ ] Never commit .env files to Git

### Example Production .env

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://produser:StrongPassword123!@prod-cluster.abc123.mongodb.net/chillum_phillum
JWT_SECRET=your_very_long_random_secret_key_minimum_32_characters_here
CORS_ORIGIN=https://your-frontend-domain.com
```

---

## 📊 Monitoring & Maintenance

### Backend Logs

**Render:**
```bash
# View logs in Render dashboard → Logs tab
```

**Heroku:**
```bash
heroku logs --tail
```

### Database Backups

**MongoDB Atlas:**
1. Dashboard → Backup
2. Enable "Continuous Cloud Backups"
3. Can restore anytime

### Performance Monitoring

- Use Vercel Analytics
- Monitor Render/Heroku metrics
- Check MongoDB Atlas performance tab

---

## 🚀 Deployment Checklist

### Before First Deploy
- [ ] Backend `.env` created with production values
- [ ] Frontend `.env` with correct API URL
- [ ] MongoDB Atlas cluster created
- [ ] Admin account initialized
- [ ] Test locally - all features work
- [ ] No console errors in browser
- [ ] Build succeeds: `npm run build`

### Deployment
- [ ] Backend deployed and online
- [ ] Frontend deployed with correct API URL
- [ ] Test login works
- [ ] Test create/edit content
- [ ] Test images upload
- [ ] Test contact form sends messages

### After Deploy
- [ ] Verify frontend can reach backend
- [ ] Check API responses in Network tab
- [ ] Test full user workflow
- [ ] Monitor logs for errors
- [ ] Setup monitoring alerts
- [ ] Document deployment URLs

---

## 🔄 CI/CD (Automated Deployments)

### Automatic Deployment on Git Push

Both Vercel and Render support automatic deployment:

1. **Vercel:** Auto-deploys on push to main
2. **Render:** Can configure auto-deploy webhook

This means:
```bash
git push origin main
# Automatically triggers deployment!
```

---

## 🐛 Troubleshooting Deployments

### Frontend build fails
```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build

# Check for TypeScript/ESLint errors
npm run lint
```

### Backend won't start
```bash
# Check MongoDB connection
heroku/render logs --tail

# Usually shows connection error if MONGODB_URI is wrong
```

### CORS errors
Backend `.env` should have:
```env
CORS_ORIGIN=https://your-frontend-url
```

### Images not loading
Check image URLs in database:
- Should be full URLs or correct paths
- Verify upload directory is writable

### Login not working
- Check JWT_SECRET matches between environments
- Verify MongoDB user exists
- Check network tab for 401 errors

---

## 📈 Scaling & Optimization

As you grow:

1. **Database:** Upgrade MongoDB Atlas tier
2. **Backend:** Choose paid tier (Render, Heroku Pro)
3. **Frontend:** Already scalable with Vercel CDN
4. **Images:** Use CDN like Cloudinary
5. **Cache:** Implement Redis caching
6. **Load Balancing:** Add multiple backend instances

---

## 🔗 Useful Links

- [Render Docs](https://render.com/docs)
- [Heroku Docs](https://devcenter.heroku.com/)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Express Production Guide](https://expressjs.com/en/advanced/best-practice-performance.html)

---

## 📞 Support

If deployment fails:

1. **Check logs first** - they usually explain the issue
2. **Verify environment variables** - most common issue
3. **Test API endpoint** - use curl/Postman
4. **Check browser console** - frontend errors
5. **Review connection string** - MongoDB URI format
6. **Ask in community forums** - Discord, Reddit, GitHub Discussions

---

**Last Updated:** April 4, 2026

Good luck deploying! 🚀
