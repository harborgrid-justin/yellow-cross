/**
 * Database Configuration
 * PostgreSQL connection setup with Prisma ORM
 */

const { PrismaClient } = require('@prisma/client');

// Create a singleton Prisma client instance
let prisma = null;
let connected = false;

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
    connected = true;
    
    // Note: Graceful shutdown is handled by gracefulShutdown.js
    return client;
  } catch (error) {
    connected = false;
    // Allow app to continue without DB - warning only
    return null;
  }
};

// Function to check if database is connected (synchronous)
const isConnected = () => {
  return connected;
};

// Function to disconnect
const disconnectDB = async () => {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
    connected = false;
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
