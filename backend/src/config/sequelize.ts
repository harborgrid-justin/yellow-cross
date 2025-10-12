/**
 * Sequelize Configuration
 * PostgreSQL connection setup with Sequelize ORM
 */

import { Sequelize } from 'sequelize-typescript';
import path from 'path';

// Database connection URL
const DATABASE_URL = process.env.DATABASE_URL || 
  'postgresql://neondb_owner:npg_rj6VckGihv0J@ep-rough-wind-ad0xgjgi-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

// Create Sequelize instance
const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Required for Neon DB
    }
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  models: [path.join(__dirname, '../models')], // Auto-load models from models directory
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

let connected = false;

/**
 * Connect to database
 */
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');
    
    // Sync models in development (creates tables if they don't exist)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false });
      console.log('✅ Database models synchronized');
    }
    
    connected = true;
    return sequelize;
  } catch (error) {
    console.error('❌ Unable to connect to database:', error);
    connected = false;
    return null;
  }
};

/**
 * Check if database is connected
 */
export const isConnected = () => {
  return connected;
};

/**
 * Disconnect from database
 */
export const disconnectDB = async () => {
  if (sequelize) {
    await sequelize.close();
    connected = false;
    console.log('Database connection closed');
  }
};

/**
 * Get Sequelize instance
 */
export const getSequelize = () => {
  return sequelize;
};

export default sequelize;
