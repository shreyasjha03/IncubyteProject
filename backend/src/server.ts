import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes';
import sweetRoutes from './routes/sweet.routes';
import inventoryRoutes from './routes/inventory.routes';
import orderRoutes from './routes/order.routes';
import uploadRoutes from './routes/upload.routes';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);
app.use('/api/sweets', inventoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Sweet Shop API is running' });
});

// Database connection
// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sweet-shop')
    .then(() => {
      console.log('Connected to MongoDB');
      const server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });

      server.on('error', (error: any) => {
        if (error.code === 'EADDRINUSE') {
          console.error(`Port ${PORT} is already in use. Please:`);
          console.error(`1. Kill the process using: lsof -ti:${PORT} | xargs kill -9`);
          console.error(`2. Or change the PORT in your .env file`);
          process.exit(1);
        } else {
          console.error('Server error:', error);
          process.exit(1);
        }
      });
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    });
}

export default app;

