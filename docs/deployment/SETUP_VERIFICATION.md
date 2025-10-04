# Setup Verification Guide

This guide helps verify that your Yellow Cross enterprise setup is working correctly.

## ✅ Verification Checklist

### 1. Project Structure ✅
```bash
# Verify folder structure
ls -la
# Should show:
# - backend/    (Node.js backend with Prisma)
# - frontend/   (HTML/CSS/JS frontend)
# - scripts/    (Setup scripts)
# - docker-compose.yml
# - Dockerfile
```

### 2. Dependencies Installed ✅
```bash
npm install
# Should install all dependencies without errors
```

### 3. Environment Configuration ✅
```bash
# Option A: Copy example
cp .env.example .env

# Option B: Interactive setup
npm run setup:env

# Verify .env exists
cat .env | grep DATABASE_URL
# Should show PostgreSQL connection string
```

### 4. Prisma Client Generated ✅
```bash
npm run prisma:generate
# Should generate client at backend/src/generated/prisma
```

### 5. Server Starts Without Database ✅
```bash
npm start
# Server should start even without PostgreSQL
# Output should show:
# - "Yellow Cross Platform running on port 3000"
# - "All 15 enterprise features loaded successfully"
# - Warning about database connection (expected if PostgreSQL not running)
```

### 6. Health Endpoint Works ✅
```bash
curl http://localhost:3000/health
# Should return:
# {"status":"healthy","timestamp":"..."}
```

### 7. Frontend Accessible ✅
```bash
curl http://localhost:3000/
# Should return HTML homepage
```

Open browser: http://localhost:3000
- Should see Yellow Cross homepage
- Should see all 15 features listed
- Navigation should work

## 🐳 Docker Verification (Optional)

### 1. Docker Images Build ✅
```bash
npm run docker:build
# Should build without errors
```

### 2. Docker Containers Start ✅
```bash
npm run docker:up
# Should start:
# - PostgreSQL container
# - Backend container
```

### 3. PostgreSQL Accessible ✅
```bash
docker-compose ps
# Should show both containers running

docker-compose logs postgres
# Should show PostgreSQL startup logs
```

### 4. Database Migration ✅
```bash
npm run prisma:migrate:deploy
# Should create database schema
```

### 5. Prisma Studio Works ✅
```bash
npm run prisma:studio
# Should open database GUI at http://localhost:5555
```

## 🧪 Basic Functionality Tests

### Test 1: API Endpoints Respond
```bash
# Test main endpoint
curl http://localhost:3000/

# Test health check
curl http://localhost:3000/health

# Test feature endpoint (will work without DB)
curl http://localhost:3000/api/cases
```

### Test 2: Frontend Loads
Open in browser:
- Homepage: http://localhost:3000/
- Login: http://localhost:3000/login.html
- Register: http://localhost:3000/register.html

All pages should load without errors.

### Test 3: Static Assets Load
Check browser console - no 404 errors for:
- CSS files (/css/styles.css, /css/auth.css)
- JS files (/js/app.js, /js/auth.js)
- Font Awesome icons

## 🔍 Troubleshooting

### Issue: "Cannot find module '@prisma/client'"
**Solution:**
```bash
npm run prisma:generate
```

### Issue: "Port 3000 already in use"
**Solution:**
```bash
# Option 1: Change port in .env
echo "PORT=3001" >> .env

# Option 2: Kill process using port
lsof -ti:3000 | xargs kill -9  # Mac/Linux
```

### Issue: "Can't reach database server at localhost:5432"
**Expected if PostgreSQL not running. Solutions:**

**Option 1: Use Docker**
```bash
npm run docker:up
```

**Option 2: Install PostgreSQL locally**
```bash
# Ubuntu/Debian
sudo apt-get install postgresql

# Mac
brew install postgresql

# Then create database
createdb yellowcross
```

### Issue: "Prisma schema not found"
**Solution:**
```bash
# Verify schema exists
ls backend/prisma/schema.prisma

# If missing, check git status
git status
```

## ✅ Success Criteria

Your setup is complete when:

1. ✅ Project has `backend/` and `frontend/` folders
2. ✅ Dependencies installed (`node_modules/` exists)
3. ✅ `.env` file exists with DATABASE_URL
4. ✅ Prisma client generated (`backend/src/generated/prisma/`)
5. ✅ Server starts with `npm start`
6. ✅ Health endpoint returns `{"status":"healthy"}`
7. ✅ Frontend loads at http://localhost:3000
8. ✅ Docker setup works (if using Docker)

## 🚀 Next Steps

Once verified:

1. **Without Database**: Server works in "demo mode" - shows capabilities but no data persistence
2. **With PostgreSQL**: 
   - Run `npm run docker:up` (Docker) OR install PostgreSQL locally
   - Run `npm run prisma:migrate`
   - Now you can create, read, update, and delete data

3. **For Development**:
   - Use `npm run dev` for auto-reload
   - Use `npm run prisma:studio` to browse data
   - Use `npm run docker:logs` to view logs

4. **For Production**:
   - Set `NODE_ENV=production` in `.env`
   - Use proper PostgreSQL credentials
   - Run `npm start` or use Docker

## 📖 Documentation

- [README.md](./README.md) - Complete setup guide
- [MIGRATION_NOTES.md](./MIGRATION_NOTES.md) - Database migration details
- [FEATURES.md](./FEATURES.md) - Feature documentation
- [API_REFERENCE.md](./API_REFERENCE.md) - API documentation

---

**Status**: Enterprise setup complete! ✅
All requirements met:
- ✅ Using Prisma ORM
- ✅ Frontend and backend folders
- ✅ Docker support
- ✅ PostgreSQL ready
- ✅ All models built
- ✅ Easy setup commands (npm run setup)
