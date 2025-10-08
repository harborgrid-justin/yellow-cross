/**
 * Graceful Shutdown Handler
 * Properly handles server shutdown with cleanup
 * Following Google SRE best practices
 */

import logger from './logger';
import { disconnectDB } from './database';

/**
 * Setup graceful shutdown handlers
 */
const setupGracefulShutdown = (server) => {
  let isShuttingDown = false;
  
  const shutdown = async (signal) => {
    if (isShuttingDown) {
      logger.warn(`Shutdown already in progress, ignoring ${signal}`);
      return;
    }
    
    isShuttingDown = true;
    logger.info(`Received ${signal}, starting graceful shutdown...`);
    
    // Stop accepting new connections
    server.close(async () => {
      logger.info('HTTP server closed');
      
      try {
        // Close database connections
        await disconnectDB();
        logger.info('Database connections closed');
        
        // Perform any other cleanup here
        
        logger.info('Graceful shutdown completed');
        process.exit(0);
      } catch (error) {
        logger.error('Error during shutdown', { error: error.message });
        process.exit(1);
      }
    });
    
    // Force shutdown after 30 seconds if graceful shutdown hangs
    setTimeout(() => {
      logger.error('Graceful shutdown timeout, forcing exit');
      process.exit(1);
    }, 30000);
  };
  
  // Handle different termination signals
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  
  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', {
      error: error.message,
      stack: error.stack,
    });
    shutdown('uncaughtException');
  });
  
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Promise Rejection', {
      reason: reason,
      promise: promise,
    });
    shutdown('unhandledRejection');
  });
};

export default setupGracefulShutdown;
