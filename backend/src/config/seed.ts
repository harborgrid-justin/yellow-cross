/**
 * Sequelize Database Seeding Script
 * Seeds the database with default admin user and initial data
 */

import { sequelize } from './database';
import { User } from '../models/sequelize';
import bcrypt from 'bcryptjs';

/**
 * Default admin credentials
 * Username: admin
 * Email: admin@yellowcross.com
 * Password: Admin@123
 */
const DEFAULT_ADMIN = {
  userId: 'USR-ADMIN-001',
  username: 'admin',
  email: 'admin@yellowcross.com',
  password: 'Admin@123', // Will be hashed
  firstName: 'System',
  lastName: 'Administrator',
  fullName: 'System Administrator',
  jobTitle: 'System Administrator',
  department: 'IT',
  roles: ['Admin'],
  permissions: ['*'], // Full permissions
  status: 'Active',
  isVerified: true,
  mfaEnabled: false,
  mfaBackupCodes: [],
  allowedIPs: [],
  blockedIPs: [],
  tags: ['system', 'admin'],
  preferences: {
    language: 'en',
    timezone: 'UTC',
    notifications: {
      email: true,
      sms: false,
      push: true
    }
  },
  createdBy: 'system'
};

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

async function seedUsers() {
  console.log('🌱 Seeding users...');
  
  // Check if admin user already exists
  const existingAdmin = await User.findOne({
    where: { username: DEFAULT_ADMIN.username }
  });

  if (existingAdmin) {
    console.log('ℹ️  Admin user already exists. Skipping user seed.');
    return existingAdmin;
  }

  // Hash the password
  const hashedPassword = await hashPassword(DEFAULT_ADMIN.password);
  
  // Set password expiry (90 days from now)
  const passwordExpiresAt = new Date();
  passwordExpiresAt.setDate(passwordExpiresAt.getDate() + 90);

  // Create admin user
  const admin = await User.create({
    ...DEFAULT_ADMIN,
    password: hashedPassword,
    passwordExpiresAt
  });

  console.log('✅ Admin user created successfully!');
  console.log('📧 Email:', DEFAULT_ADMIN.email);
  console.log('👤 Username:', DEFAULT_ADMIN.username);
  
  return admin;
}

async function main() {
  console.log('🚀 Starting database seeding...\n');

  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Sync models (create tables if they don\'t exist)
    await sequelize.sync({ alter: false });
    console.log('✅ Database models synchronized');

    // Seed users
    await seedUsers();

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📝 Default Login Credentials:');
    console.log('   Username: admin');
    console.log('   Email: admin@yellowcross.com');
    console.log('   Password: Admin@123');
    console.log('\n⚠️  IMPORTANT: Please change the default password after first login for security!');
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run if executed directly
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default main;
