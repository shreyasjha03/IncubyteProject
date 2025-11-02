import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Sweet from '../src/models/Sweet.model';

dotenv.config();

async function clearDatabase() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sweet-shop';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Count existing sweets
    const count = await Sweet.countDocuments();
    console.log(`Found ${count} sweets in database`);

    if (count === 0) {
      console.log('Database is already empty!');
      await mongoose.connection.close();
      return;
    }

    // Delete all sweets
    const result = await Sweet.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} sweets from database`);

    // Verify deletion
    const remainingCount = await Sweet.countDocuments();
    console.log(`Remaining sweets: ${remainingCount}`);

    await mongoose.connection.close();
    console.log('Database connection closed');
    console.log('\n✅ Database cleared successfully! You can now add items manually with images.');
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
}

// Run the clear function
clearDatabase();

