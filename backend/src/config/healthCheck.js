/**
 * Health Check Configuration
 * Comprehensive health monitoring for all system dependencies
 * Following Google SRE best practices for health checks
 */

const { isConnected } = require('./database');
const logger = require('./logger');

/**
 * Check database health
 */
const checkDatabase = async () => {
  try {
    const connected = await isConnected();
    return {
      status: connected ? 'healthy' : 'degraded',
      message: connected ? 'Database connection active' : 'Database not connected',
      responseTime: connected ? 'fast' : 'n/a',
    };
  } catch (error) {
    logger.error('Database health check failed', { error: error.message });
    return {
      status: 'unhealthy',
      message: error.message,
      responseTime: 'n/a',
    };
  }
};

/**
 * Check memory usage
 */
const checkMemory = () => {
  const usage = process.memoryUsage();
  const totalMB = Math.round(usage.heapTotal / 1024 / 1024);
  const usedMB = Math.round(usage.heapUsed / 1024 / 1024);
  const percentage = Math.round((usedMB / totalMB) * 100);
  
  return {
    status: percentage < 90 ? 'healthy' : 'degraded',
    heapUsed: `${usedMB} MB`,
    heapTotal: `${totalMB} MB`,
    percentage: `${percentage}%`,
  };
};

/**
 * Check uptime
 */
const checkUptime = () => {
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  
  return {
    status: 'healthy',
    uptime: `${hours}h ${minutes}m ${seconds}s`,
    uptimeSeconds: Math.floor(uptime),
  };
};

/**
 * Comprehensive health check
 * Returns overall system health and individual component status
 */
const performHealthCheck = async () => {
  const startTime = Date.now();
  
  // Check all components in parallel
  const [database, memory, uptime] = await Promise.all([
    checkDatabase(),
    Promise.resolve(checkMemory()),
    Promise.resolve(checkUptime()),
  ]);
  
  // Determine overall status
  let overallStatus = 'healthy';
  if (database.status === 'unhealthy' || memory.status === 'unhealthy') {
    overallStatus = 'unhealthy';
  } else if (database.status === 'degraded' || memory.status === 'degraded') {
    overallStatus = 'degraded';
  }
  
  const responseTime = Date.now() - startTime;
  
  return {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    responseTime: `${responseTime}ms`,
    version: process.env.npm_package_version || '2.0.0',
    environment: process.env.NODE_ENV || 'development',
    checks: {
      database,
      memory,
      uptime,
    },
  };
};

/**
 * Liveness probe
 * Simple check to see if the service is running
 */
const livenessProbe = () => {
  return {
    status: 'alive',
    timestamp: new Date().toISOString(),
  };
};

/**
 * Readiness probe
 * Check if the service is ready to accept traffic
 */
const readinessProbe = async () => {
  try {
    // Check critical dependencies
    const dbConnected = await isConnected();
    const memoryOk = checkMemory().status !== 'unhealthy';
    
    const ready = dbConnected && memoryOk;
    
    return {
      status: ready ? 'ready' : 'not-ready',
      timestamp: new Date().toISOString(),
      checks: {
        database: dbConnected,
        memory: memoryOk,
      },
    };
  } catch (error) {
    logger.error('Readiness probe failed', { error: error.message });
    return {
      status: 'not-ready',
      timestamp: new Date().toISOString(),
      error: error.message,
    };
  }
};

module.exports = {
  performHealthCheck,
  livenessProbe,
  readinessProbe,
  checkDatabase,
  checkMemory,
  checkUptime,
};
