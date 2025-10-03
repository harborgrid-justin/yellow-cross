/**
 * Database Configuration
 * PostgreSQL connection setup with Prisma ORM
 */

const { PrismaClient } = require('../generated/prisma');

// Create a singleton Prisma client instance
let prisma = null;

const getPrismaClient = () => {
  if (!prisma) {
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }
  return prisma;
};

const connectDB = async () => {
  try {
    const client = getPrismaClient();
    
    // Test the connection
    await client.$connect();
    
    console.log('PostgreSQL Connected successfully via Prisma');
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      await client.$disconnect();
      console.log('PostgreSQL connection closed through app termination');
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      await client.$disconnect();
      console.log('PostgreSQL connection closed through app termination');
      process.exit(0);
    });
    
    return client;
  } catch (error) {
    console.error('Error connecting to PostgreSQL:', error.message);
    // Allow app to continue without DB - warning only
    console.log('Continuing without database connection...');
    return null;
  }
};

// Function to check if database is connected
const isConnected = async () => {
  try {
    const client = getPrismaClient();
    await client.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    return false;
  }
};

// Function to disconnect
const disconnectDB = async () => {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
  }
};

module.exports = { 
  connectDB, 
  isConnected, 
  disconnectDB,
  getPrismaClient,
  get prisma() {
    return getPrismaClient();
  }
};
