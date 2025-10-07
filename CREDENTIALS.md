# Yellow Cross - Default Login Credentials

## 🔐 Default Admin Account

After setting up the database and running the seed script, you can login with:

### Credentials
- **Username:** `admin`
- **Email:** `admin@yellowcross.com`
- **Password:** `Admin@123`

### Access URL
- **Application:** http://localhost:3000
- **Health Check:** http://localhost:3000/health
- **Database UI:** `npm run prisma:studio`

## 📋 Setup Instructions

### Initial Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```

4. Run database migrations:
   ```bash
   npm run prisma:migrate
   ```

5. **Seed the database with default admin user:**
   ```bash
   npm run prisma:seed
   ```

6. Start the application:
   ```bash
   npm start
   ```

7. Login at http://localhost:3000 with the credentials above

## ⚠️ Security Best Practices

### IMPORTANT - Change Default Password
1. Login with default credentials
2. Navigate to user settings/profile
3. Change password immediately
4. Use a strong password with:
   - At least 8 characters
   - Uppercase and lowercase letters
   - Numbers
   - Special characters

### Additional Security Notes
- Default password expires in 90 days
- The seed script will NOT overwrite existing admin user
- Account will lock after 5 failed login attempts (30-minute lockout)
- Multi-factor authentication (MFA) can be enabled in user settings
- Password history is tracked (prevents reusing old passwords)

## 🔄 Re-seeding Database

If you need to reset the database and re-seed:

```bash
# WARNING: This deletes all data!
npm run prisma:reset

# Then seed again
npm run prisma:seed
```

Or manually seed without reset:
```bash
npm run prisma:seed
```

The seed script is idempotent - it checks if admin exists before creating.

## 📝 User Roles

The default admin user has:
- **Role:** Admin
- **Permissions:** Full access (*)
- **Status:** Active
- **Verified:** Yes

## 🆘 Troubleshooting

### If you forgot the password:
1. Stop the application
2. Run: `npm run prisma:reset` (deletes all data)
3. Run: `npm run prisma:seed`
4. Restart and login with default credentials

### If seed fails:
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env file
- Verify database exists and is accessible
- Check that migrations have run successfully

### If admin user already exists:
- The seed script will skip creation
- Use password reset feature (if implemented)
- Or manually reset the database (see above)

## 📚 Additional Resources

- [Full README](./README.md)
- [Setup Guide](./docs/deployment/SETUP_GUIDE.md)
- [Security Features](./docs/ENTERPRISE_CAPABILITIES.md)
- Prisma Schema: `backend/prisma/schema.prisma`
- Seed Script: `backend/prisma/seed.js`
