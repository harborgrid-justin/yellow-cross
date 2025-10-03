# Troubleshooting Guide

This guide helps you resolve common issues with Yellow Cross Platform setup and operation.

## 📋 Quick Diagnosis

Run the setup verification to identify issues:

```bash
npm run setup:verify
```

This will tell you exactly what's missing or misconfigured.

---

## 🔧 Common Issues by Category

### 1. Installation Issues

#### npm install fails

**Symptoms:**
- Error during `npm install`
- Missing packages
- Permission errors

**Solutions:**

1. **Clear npm cache and reinstall:**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check Node.js version:**
   ```bash
   node --version
   ```
   Must be v18 or higher. Update if needed from [nodejs.org](https://nodejs.org/)

3. **Fix permission issues (Linux/macOS):**
   ```bash
   sudo chown -R $USER:$USER ~/.npm
   sudo chown -R $USER:$USER .
   ```

4. **Use npm audit to fix vulnerabilities:**
   ```bash
   npm audit fix
   ```

#### Permission denied errors

**Symptoms:**
- `EACCES: permission denied`
- Cannot write to directories

**Solutions:**

1. **Don't use sudo with npm** (creates ownership problems)

2. **Fix npm permissions (Linux/macOS):**
   ```bash
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
   source ~/.bashrc
   ```

3. **Fix directory ownership:**
   ```bash
   sudo chown -R $USER:$USER .
   ```

---

### 2. Database Connection Issues

#### Cannot connect to PostgreSQL

**Error:**
```
Error: P1001: Can't reach database server at localhost:5432
```

**Diagnosis:**
```bash
# Check if PostgreSQL is running
pg_isready

# Check DATABASE_URL in .env
cat .env | grep DATABASE_URL

# For Docker
docker-compose ps
docker-compose logs postgres
```

**Solutions:**

**If using Docker:**
```bash
# Start PostgreSQL container
docker-compose up -d postgres

# Wait a few seconds, then check
docker-compose ps

# View logs for errors
docker-compose logs postgres
```

**If using local PostgreSQL:**
```bash
# Linux
sudo systemctl status postgresql
sudo systemctl start postgresql

# macOS
brew services list
brew services start postgresql@15

# Windows
# Use Services app or pg_ctl
```

**Check DATABASE_URL format:**
```
# Correct format:
DATABASE_URL=postgresql://username:password@host:port/database?schema=public

# Example:
DATABASE_URL=postgresql://yellowcross:yellowcross_dev@localhost:5432/yellowcross?schema=public
```

#### Database does not exist

**Error:**
```
Error: P1003: Database yellowcross does not exist
```

**Solutions:**

1. **Create the database:**
   ```bash
   createdb yellowcross
   ```

2. **Or using psql:**
   ```bash
   psql -U postgres
   CREATE DATABASE yellowcross;
   \q
   ```

3. **For Docker:**
   ```bash
   docker-compose down
   docker-compose up -d
   # Database is created automatically
   ```

#### Authentication failed

**Error:**
```
Error: P1000: Authentication failed against database server
```

**Solutions:**

1. **Check credentials in .env:**
   ```bash
   cat .env | grep -E "POSTGRES_USER|POSTGRES_PASSWORD"
   ```

2. **Update DATABASE_URL with correct credentials:**
   ```
   DATABASE_URL=postgresql://CORRECT_USER:CORRECT_PASSWORD@localhost:5432/yellowcross?schema=public
   ```

3. **For local PostgreSQL, update pg_hba.conf:**
   ```bash
   # Find config file
   psql -U postgres -c "SHOW hba_file;"
   
   # Edit and change authentication to 'trust' or 'md5'
   # Then restart PostgreSQL
   sudo systemctl restart postgresql  # Linux
   brew services restart postgresql@15  # macOS
   ```

---

### 3. Prisma Issues

#### Prisma Client not found

**Error:**
```
Error: @prisma/client did not initialize yet
```

**Solution:**
```bash
npm run prisma:generate
```

**Verify generated:**
```bash
ls -la backend/src/generated/prisma/
```

Should show: `index.js`, `index.d.ts`, and other files.

#### Migration fails

**Error:**
```
Error: P3005: The database schema is not empty
```

**Solutions:**

1. **Reset database (⚠️ deletes all data):**
   ```bash
   npm run prisma:reset
   ```

2. **Or force push schema:**
   ```bash
   cd backend
   npx prisma db push --force-reset
   ```

3. **Or create a new migration:**
   ```bash
   cd backend
   npx prisma migrate dev --name fix_schema
   ```

#### Prisma schema errors

**Error:**
```
Error validating: ...
```

**Solutions:**

1. **Format schema:**
   ```bash
   cd backend
   npx prisma format
   ```

2. **Validate schema:**
   ```bash
   cd backend
   npx prisma validate
   ```

3. **Check for syntax errors in `backend/prisma/schema.prisma`**

#### Schema out of sync

**Error:**
```
Error: Prisma schema and database are out of sync
```

**Solutions:**

1. **Generate Prisma Client:**
   ```bash
   npm run prisma:generate
   ```

2. **Run migrations:**
   ```bash
   npm run prisma:migrate
   ```

3. **Or push schema:**
   ```bash
   cd backend
   npx prisma db push
   ```

---

### 4. Environment Configuration Issues

#### .env file missing

**Symptoms:**
- Errors about missing environment variables
- Server won't start

**Solutions:**

1. **Create .env automatically:**
   ```bash
   npm run setup:env
   ```

2. **Or copy manually:**
   ```bash
   cp .env.example .env
   ```

3. **Or create interactively:**
   ```bash
   npm run setup:env:interactive
   ```

#### Invalid environment variables

**Symptoms:**
- Server starts but behaves incorrectly
- Database connection fails

**Solution:**

Check and update `.env` file:

```bash
# View current configuration
cat .env

# Edit with your preferred editor
nano .env
# or
vim .env
# or
code .env
```

**Required variables:**
- `NODE_ENV` - development or production
- `PORT` - Server port (default: 3000)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT tokens

**Format for DATABASE_URL:**
```
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]?schema=public
```

---

### 5. Docker Issues

#### Docker containers won't start

**Symptoms:**
- `docker-compose up` fails
- Containers exit immediately

**Diagnosis:**
```bash
docker-compose ps
docker-compose logs
```

**Solutions:**

1. **Check Docker is running:**
   ```bash
   docker --version
   docker-compose --version
   ```

2. **Rebuild containers:**
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```

3. **Check for port conflicts:**
   ```bash
   # Check if port 5432 is in use
   lsof -i :5432  # macOS/Linux
   netstat -ano | findstr :5432  # Windows
   ```

4. **View detailed logs:**
   ```bash
   docker-compose logs -f postgres
   docker-compose logs -f backend
   ```

#### PostgreSQL container fails

**Symptoms:**
- PostgreSQL container exits
- Can't connect to database in Docker

**Solutions:**

1. **Check logs:**
   ```bash
   docker-compose logs postgres
   ```

2. **Remove volume and restart:**
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```

3. **Check disk space:**
   ```bash
   df -h
   docker system df
   ```

4. **Prune old containers:**
   ```bash
   docker system prune -a
   ```

#### Backend container fails

**Symptoms:**
- Backend container won't start
- Application errors in logs

**Solutions:**

1. **Check logs:**
   ```bash
   docker-compose logs backend
   ```

2. **Rebuild image:**
   ```bash
   docker-compose build backend --no-cache
   docker-compose up -d backend
   ```

3. **Exec into container for debugging:**
   ```bash
   docker-compose exec backend sh
   # Then check files, run commands, etc.
   ```

---

### 6. Application Server Issues

#### Server won't start

**Error:**
```
Error: Cannot find module ...
```

**Solutions:**

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Regenerate Prisma Client:**
   ```bash
   npm run prisma:generate
   ```

3. **Check Node.js version:**
   ```bash
   node --version
   ```
   Must be v18 or higher.

#### Port already in use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**

1. **Find process using port:**
   ```bash
   # macOS/Linux
   lsof -i :3000
   
   # Windows
   netstat -ano | findstr :3000
   ```

2. **Kill process:**
   ```bash
   # macOS/Linux
   kill -9 <PID>
   
   # Windows
   taskkill /PID <PID> /F
   ```

3. **Or change port in .env:**
   ```
   PORT=3001
   ```

#### Health check fails

**Error:**
```
curl http://localhost:3000/health
curl: (7) Failed to connect to localhost port 3000
```

**Solutions:**

1. **Check server is running:**
   ```bash
   ps aux | grep node
   ```

2. **Check server logs:**
   ```bash
   npm start
   # Look for errors
   ```

3. **Check firewall:**
   ```bash
   # Linux
   sudo ufw status
   sudo ufw allow 3000
   
   # macOS
   # System Preferences > Security & Privacy > Firewall
   ```

---

### 7. Frontend Issues

#### Frontend won't load

**Symptoms:**
- Blank page at http://localhost:3000
- 404 errors
- Static files not serving

**Solutions:**

1. **Check server is running:**
   ```bash
   curl http://localhost:3000/health
   ```

2. **Verify frontend files exist:**
   ```bash
   ls frontend/
   ls frontend/index.html
   ```

3. **Check server logs for static file errors**

4. **Clear browser cache:**
   - Chrome: Ctrl+Shift+Delete
   - Firefox: Ctrl+Shift+Delete
   - Safari: Cmd+Option+E

#### TypeScript compilation errors

**Symptoms:**
- `npm run build:react` fails
- Type errors

**Solutions:**

1. **Check TypeScript configuration:**
   ```bash
   cat tsconfig.json
   ```

2. **Run type checking:**
   ```bash
   npm run lint:frontend
   ```

3. **Install missing types:**
   ```bash
   npm install --save-dev @types/[package-name]
   ```

---

### 8. Test Issues

#### Tests fail to run

**Error:**
```
Cannot find module ...
```

**Solutions:**

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Regenerate Prisma Client:**
   ```bash
   npm run prisma:generate
   ```

#### Specific tests fail

**Note:** Some test failures are expected due to unrelated issues (Joi validation syntax).

**Expected:**
- `backend/tests/setup.test.js`: 20/23 pass ✅
- Other tests may have Joi-related failures (unrelated to setup)

**To run specific tests:**
```bash
npm test -- backend/tests/setup.test.js
```

---

## 🔍 Diagnostic Commands

### System Information
```bash
# Node.js version
node --version

# npm version
npm --version

# Operating system
uname -a  # Linux/macOS
systeminfo  # Windows
```

### Database Status
```bash
# PostgreSQL status
pg_isready

# Check if database exists
psql -U postgres -l | grep yellowcross

# Test connection
psql postgresql://yellowcross:yellowcross_dev@localhost:5432/yellowcross -c "SELECT version();"
```

### Docker Status
```bash
# Docker version
docker --version
docker-compose --version

# Running containers
docker-compose ps

# Container logs
docker-compose logs

# Resource usage
docker stats
```

### Application Status
```bash
# Check if server is running
curl http://localhost:3000/health

# Check processes
ps aux | grep node

# Check listening ports
netstat -tuln | grep 3000  # Linux
lsof -i :3000  # macOS
```

### Setup Verification
```bash
# Run full verification
npm run setup:verify

# Check specific components
ls -la .env
ls -la backend/src/generated/prisma/
ls -la node_modules/@prisma/client/
```

---

## 📝 Getting More Help

### 1. Check Documentation
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Complete setup instructions
- [README.md](./README.md) - Main documentation
- [SETUP_VERIFICATION.md](./SETUP_VERIFICATION.md) - Verification checklist

### 2. Run Diagnostics
```bash
npm run setup:verify
```

### 3. Check Logs

**Application logs:**
```bash
npm start  # Look for errors in output
```

**Docker logs:**
```bash
docker-compose logs -f
```

**PostgreSQL logs:**
```bash
# Linux
sudo tail -f /var/log/postgresql/postgresql-*.log

# macOS
tail -f /usr/local/var/log/postgresql@15.log

# Docker
docker-compose logs -f postgres
```

### 4. Enable Debug Mode

Add to `.env`:
```
LOG_LEVEL=debug
NODE_ENV=development
```

Then restart:
```bash
npm start
```

---

## 🆘 Emergency Recovery

If everything is broken and you need to start fresh:

### Complete Reset (⚠️ Deletes all data)

```bash
# Stop all processes
docker-compose down -v  # If using Docker
pkill -f node  # Kill Node processes

# Clean everything
rm -rf node_modules
rm -rf backend/src/generated
rm package-lock.json
rm .env

# Reinstall
npm install

# Reconfigure
npm run setup:env

# Regenerate Prisma
npm run prisma:generate

# Restart database
npm run docker:setup  # If using Docker
# Or for local PostgreSQL:
dropdb yellowcross
createdb yellowcross
npm run prisma:migrate
```

### Partial Reset (Keep node_modules)

```bash
# Just reset database and Prisma
rm -rf backend/src/generated
npm run prisma:generate
npm run prisma:reset  # Resets database
```

---

## ✅ Verification Checklist

After fixing issues, verify everything works:

- [ ] `npm run setup:verify` - All checks pass
- [ ] `npm start` - Server starts without errors
- [ ] `curl http://localhost:3000/health` - Returns `{"status":"healthy"}`
- [ ] `npm test -- backend/tests/setup.test.js` - 20+ tests pass
- [ ] `npm run prisma:studio` - Opens database GUI
- [ ] Frontend loads at http://localhost:3000

---

**Need more help?** Check the main [README.md](./README.md) or [SETUP_GUIDE.md](./SETUP_GUIDE.md).
