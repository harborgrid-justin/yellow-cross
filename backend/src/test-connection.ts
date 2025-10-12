/**
 * Test Database Connection
 * Simple script to test Sequelize connection to PostgreSQL
 */

import { connectDB, disconnectDB } from './config/database';
import { User } from './models/sequelize';

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...\n');
    
    // Connect to database
    const db = await connectDB();
    
    if (!db) {
      console.error('❌ Failed to connect to database');
      return false;
    }
    
    console.log('\n✅ Database connection successful!\n');
    
    // Test querying
    console.log('🔍 Testing query (counting users)...');
    const userCount = await User.count();
    console.log(`✅ User count: ${userCount}\n`);
    
    console.log('🎉 All tests passed!\n');
    
    // Disconnect
    await disconnectDB();
    
    return true;
  } catch (error) {
    console.error('❌ Error during testing:', error);
    return false;
  }
}

testConnection()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
