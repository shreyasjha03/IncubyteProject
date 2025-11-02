import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.model';

dotenv.config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB - use production URI (same as Railway)
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sweet-shop';
    
    if (!process.env.MONGODB_URI || MONGODB_URI.includes('localhost')) {
      console.warn('⚠️  WARNING: Using local MongoDB. Make sure MONGODB_URI is set to production database!');
    }
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Admin user details
    const adminData = {
      username: 'Shreyas',
      email: 'shreyasjha16@gmail.com',
      password: 'Raunak@955',
      role: 'admin' as const,
    };

    // Check if admin user already exists
    const existingUser = await User.findOne({
      $or: [
        { username: adminData.username },
        { email: adminData.email.toLowerCase() },
      ],
    });

    let adminUser;

    if (existingUser) {
      if (existingUser.role === 'admin') {
        console.log('ℹ️  Admin user already exists.');
        // Update password if needed - mark as modified to trigger hash
        existingUser.password = adminData.password;
        await existingUser.save();
        console.log('✅ Password updated');
        adminUser = existingUser;
      } else {
        // Update existing user to admin
        existingUser.role = 'admin';
        existingUser.password = adminData.password;
        await existingUser.save();
        console.log('✅ Updated existing user to admin role');
        adminUser = existingUser;
      }
      console.log(`   Username: ${adminUser.username}`);
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Role: ${adminUser.role}`);
      
      // Verify password
      const testLogin = await adminUser.comparePassword(adminData.password);
      console.log(`🔍 Password verification: ${testLogin ? '✅ PASSED' : '❌ FAILED'}`);
    } else {
      // Create new admin user - password will be hashed by pre-save hook
      adminUser = new User({
        username: adminData.username,
        email: adminData.email.toLowerCase(),
        password: adminData.password,
        role: 'admin',
      });
      
      await adminUser.save();
      console.log('✅ Admin user created successfully!');
      console.log(`   Username: ${adminUser.username}`);
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Role: ${adminUser.role}`);
      
      // Verify password
      const testLogin = await adminUser.comparePassword(adminData.password);
      console.log(`🔍 Password verification: ${testLogin ? '✅ PASSED' : '❌ FAILED'}`);
    }

    console.log('\n✅ Process completed!');
    console.log('\nYou can now login with:');
    console.log(`   Email: ${adminData.email.toLowerCase()}`);
    console.log(`   Password: ${adminData.password}`);
    console.log(`   Role: ${adminUser.role}`);
  } catch (error: any) {
    console.error('❌ Error creating admin user:', error.message);
    if (error.code === 11000) {
      console.error('   Duplicate key error - user with this username or email already exists');
    }
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Database connection closed');
  }
};

createAdminUser();
