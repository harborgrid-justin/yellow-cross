/**
 * Yellow Cross - Enterprise Law Firm Practice Management Platform
 * Main NestJS Application Entry Point
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { AppModule } from './app.module';
import { logger } from './config/logger.config';

// Load environment variables
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') || 3000;

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Security middleware
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com'],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          fontSrc: ["'self'", 'https://cdnjs.cloudflare.com'],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
    }),
  );

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api');

  // Start server
  await app.listen(port);
  
  logger.info('Yellow Cross NestJS Platform started', {
    port,
    environment: process.env.NODE_ENV || 'development',
    features: 60,
    nodeVersion: process.version,
  });

  console.log(`\n🚀 Yellow Cross NestJS Application is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api`);
}

bootstrap();
