import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Sweet from '../src/models/Sweet.model';

dotenv.config();

const sweets = [
  // Items 6-30 (since 1-5 are already added)
  { name: 'Soan Papdi', category: 'Dry Sweet', price: 20, quantity: 75 },
  { name: 'Besan Ladoo', category: 'Homemade Sweet', price: 25, quantity: 70 },
  { name: 'Mysore Pak', category: 'South Indian Sweet', price: 35, quantity: 50 },
  { name: 'Rasmalai', category: 'Milk Sweet', price: 45, quantity: 30 },
  { name: 'Peda', category: 'Milk Sweet', price: 20, quantity: 100 },
  { name: 'Barfi (Plain)', category: 'Traditional Sweet', price: 25, quantity: 80 },
  { name: 'Gajar Halwa', category: 'Seasonal Sweet', price: 50, quantity: 40 },
  { name: 'Cham Cham', category: 'Bengali Sweet', price: 25, quantity: 60 },
  { name: 'Malpua', category: 'Festival Sweet', price: 30, quantity: 40 },
  { name: 'Sandesh', category: 'Bengali Sweet', price: 30, quantity: 55 },
  { name: 'Rabri', category: 'Milk Sweet', price: 60, quantity: 25 },
  { name: 'Chikki', category: 'Dry Sweet', price: 15, quantity: 90 },
  { name: 'Ladoo (Til)', category: 'Winter Sweet', price: 20, quantity: 80 },
  { name: 'Milk Cake', category: 'Milk Sweet', price: 30, quantity: 50 },
  { name: 'Coconut Barfi', category: 'Dry Sweet', price: 25, quantity: 60 },
  { name: 'Samosa', category: 'Snack', price: 15, quantity: 120 },
  { name: 'Kachori', category: 'Snack', price: 20, quantity: 100 },
  { name: 'Namak Pare', category: 'Snack', price: 10, quantity: 150 },
  { name: 'Mixture', category: 'Namkeen', price: 25, quantity: 100 },
  { name: 'Mathri', category: 'Snack', price: 15, quantity: 90 },
  { name: 'Sev', category: 'Namkeen', price: 20, quantity: 120 },
  { name: 'Bhujia', category: 'Namkeen', price: 20, quantity: 100 },
  { name: 'Masala Chai', category: 'Beverage', price: 15, quantity: 200 },
  { name: 'Lassi', category: 'Beverage', price: 30, quantity: 80 },
  { name: 'Badam Milk', category: 'Beverage', price: 40, quantity: 60 },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sweet-shop';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Check existing sweets to avoid duplicates
    const existingSweets = await Sweet.find({});
    const existingNames = new Set(existingSweets.map(s => s.name.toLowerCase()));
    
    console.log(`Found ${existingSweets.length} existing sweets in database`);

    // Filter out sweets that already exist
    const newSweets = sweets.filter(sweet => !existingNames.has(sweet.name.toLowerCase()));
    
    if (newSweets.length === 0) {
      console.log('All sweets are already in the database!');
      await mongoose.connection.close();
      return;
    }

    console.log(`Adding ${newSweets.length} new sweets...`);

    // Insert new sweets
    for (const sweet of newSweets) {
      try {
        await Sweet.create(sweet);
        console.log(`✓ Added: ${sweet.name}`);
      } catch (error: any) {
        if (error.code === 11000) {
          console.log(`⊘ Skipped (duplicate): ${sweet.name}`);
        } else {
          console.error(`✗ Error adding ${sweet.name}:`, error.message);
        }
      }
    }

    console.log('\n✅ Seed completed successfully!');
    
    // Show summary
    const totalSweets = await Sweet.countDocuments();
    console.log(`\nTotal sweets in database: ${totalSweets}`);

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();

