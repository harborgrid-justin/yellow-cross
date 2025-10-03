#!/usr/bin/env node

/**
 * Environment Setup Script
 * Automates .env file creation for Yellow Cross Platform
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const rootDir = path.join(__dirname, '..');
const envPath = path.join(rootDir, '.env');
const envExamplePath = path.join(rootDir, '.env.example');

async function setupEnv() {
  console.log('🚀 Yellow Cross - Environment Setup\n');

  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    const overwrite = await question('.env file already exists. Overwrite? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Setup cancelled.');
      rl.close();
      return;
    }
  }

  console.log('\nPlease provide the following configuration:\n');

  // Get configuration from user
  const port = await question('Server Port (default: 3000): ') || '3000';
  const nodeEnv = await question('Environment (development/production, default: development): ') || 'development';
  
  console.log('\n--- PostgreSQL Configuration ---');
  const dbUser = await question('Database User (default: yellowcross): ') || 'yellowcross';
  const dbPassword = await question('Database Password (default: yellowcross_dev): ') || 'yellowcross_dev';
  const dbName = await question('Database Name (default: yellowcross): ') || 'yellowcross';
  const dbHost = await question('Database Host (default: localhost): ') || 'localhost';
  const dbPort = await question('Database Port (default: 5432): ') || '5432';

  const databaseUrl = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?schema=public`;

  console.log('\n--- Security Configuration ---');
  const jwtSecret = await question('JWT Secret (leave empty to generate random): ');
  const finalJwtSecret = jwtSecret || generateRandomSecret();

  // Create .env content
  const envContent = `# Yellow Cross - Enterprise Law Firm Platform Configuration
# Generated on ${new Date().toISOString()}

# Server Configuration
NODE_ENV=${nodeEnv}
PORT=${port}

# Database Configuration (PostgreSQL with Prisma)
DATABASE_URL=${databaseUrl}

# PostgreSQL Configuration (for Docker)
POSTGRES_USER=${dbUser}
POSTGRES_PASSWORD=${dbPassword}
POSTGRES_DB=${dbName}
POSTGRES_PORT=${dbPort}

# Security Configuration
JWT_SECRET=${finalJwtSecret}
JWT_EXPIRATION=24h
BCRYPT_ROUNDS=10

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-password
FROM_EMAIL=noreply@yellowcross.com

# File Upload Configuration
MAX_FILE_SIZE=52428800
UPLOAD_PATH=./uploads

# Integration Keys (Replace with actual keys)
WESTLAW_API_KEY=your-westlaw-key
LEXISNEXIS_API_KEY=your-lexisnexis-key
DOCUSIGN_API_KEY=your-docusign-key
QUICKBOOKS_CLIENT_ID=your-quickbooks-client-id
QUICKBOOKS_CLIENT_SECRET=your-quickbooks-client-secret

# Security Settings
SESSION_TIMEOUT=1800000
ENABLE_MFA=true
ENABLE_IP_WHITELIST=false

# Backup Configuration
BACKUP_ENABLED=true
BACKUP_SCHEDULE=0 2 * * *
BACKUP_RETENTION_DAYS=30

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/app.log
`;

  // Write .env file
  fs.writeFileSync(envPath, envContent);

  console.log('\n✅ .env file created successfully!');
  console.log(`📍 Location: ${envPath}`);
  console.log('\n⚠️  Remember to update the integration keys and email settings before deploying to production.\n');

  rl.close();
}

function generateRandomSecret(length = 64) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  let secret = '';
  for (let i = 0; i < length; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return secret;
}

// Run setup
setupEnv().catch(error => {
  console.error('Error during setup:', error);
  rl.close();
  process.exit(1);
});
