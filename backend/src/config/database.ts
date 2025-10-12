/**
 * Database Configuration
 * PostgreSQL connection setup with Sequelize ORM
 */

import 'reflect-metadata';
import { Sequelize } from 'sequelize-typescript';
import path from 'path';

// Import all models
import { User } from '../models/sequelize/User';
import { Case } from '../models/sequelize/Case';
import { CaseNote } from '../models/sequelize/CaseNote';
import { CaseTimelineEvent } from '../models/sequelize/CaseTimelineEvent';
import { Document } from '../models/sequelize/Document';
import { DocumentVersion } from '../models/sequelize/DocumentVersion';
import { DocumentReview } from '../models/sequelize/DocumentReview';
import { Task } from '../models/sequelize/Task';
import { TaskComment } from '../models/sequelize/TaskComment';
import { TaskTemplate } from '../models/sequelize/TaskTemplate';
import { Workflow } from '../models/sequelize/Workflow';
import { Evidence } from '../models/sequelize/Evidence';
import { PrivilegeLog } from '../models/sequelize/PrivilegeLog';
import { Production } from '../models/sequelize/Production';
import { LegalHold } from '../models/sequelize/LegalHold';

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
  models: [
    User, Case, CaseNote, CaseTimelineEvent,
    Document, DocumentVersion, DocumentReview,
    Task, TaskComment, TaskTemplate, Workflow,
    Evidence, PrivilegeLog, Production, LegalHold
  ],
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
const connectDB = async () => {
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
const isConnected = () => {
  return connected;
};

/**
 * Disconnect from database
 */
const disconnectDB = async () => {
  if (sequelize) {
    await sequelize.close();
    connected = false;
    console.log('Database connection closed');
  }
};

/**
 * Get Sequelize instance (backward compatible with getPrismaClient)
 */
const getPrismaClient = () => {
  return sequelize;
};

/**
 * Get Sequelize instance
 */
const getSequelize = () => {
  return sequelize;
};

export {
  connectDB, 
  isConnected, 
  disconnectDB,
  getPrismaClient,
  getSequelize,
  sequelize
};

export default sequelize;
