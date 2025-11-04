/**
 * Database Configuration Module for NestJS
 * PostgreSQL connection setup with Sequelize ORM
 */

import { SequelizeModuleOptions } from '@nestjs/sequelize';

export const databaseConfig = (): SequelizeModuleOptions => {
  const DATABASE_URL = process.env.DATABASE_URL || 
    'postgresql://neondb_owner:npg_rj6VckGihv0J@ep-rough-wind-ad0xgjgi-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

  return {
    dialect: 'postgres',
    uri: DATABASE_URL,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Required for Neon DB
      }
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    autoLoadModels: false,
    synchronize: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
};
