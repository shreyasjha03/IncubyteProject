import request from 'supertest';
import app from '../server';
import mongoose from 'mongoose';
import User from '../models/User.model';
import Sweet from '../models/Sweet.model';

describe('Inventory API', () => {
  let authToken: string;
  let adminToken: string;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sweet-shop-test');
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Sweet.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Sweet.deleteMany({});

    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    });

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });
    authToken = loginResponse.body.token;

    const adminLoginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'password123' });
    adminToken = adminLoginResponse.body.token;
  });

  describe('POST /api/sweets/:id/purchase', () => {
    it('should purchase a sweet and decrease quantity', async () => {
      const sweet = await Sweet.create({
        name: 'Test Sweet',
        category: 'Candy',
        price: 5.99,
        quantity: 10,
      });

      const response = await request(app)
        .post(`/api/sweets/${sweet._id}/purchase`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ quantity: 2 });

      expect(response.status).toBe(200);
      expect(response.body.sweet.quantity).toBe(8);
    });

    it('should not purchase if insufficient stock', async () => {
      const sweet = await Sweet.create({
        name: 'Test Sweet',
        category: 'Candy',
        price: 5.99,
        quantity: 2,
      });

      const response = await request(app)
        .post(`/api/sweets/${sweet._id}/purchase`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ quantity: 5 });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/sweets/:id/restock', () => {
    it('should restock a sweet as admin', async () => {
      const sweet = await Sweet.create({
        name: 'Test Sweet',
        category: 'Candy',
        price: 5.99,
        quantity: 10,
      });

      const response = await request(app)
        .post(`/api/sweets/${sweet._id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 20 });

      expect(response.status).toBe(200);
      expect(response.body.sweet.quantity).toBe(30);
    });

    it('should not allow regular user to restock', async () => {
      const sweet = await Sweet.create({
        name: 'Test Sweet',
        category: 'Candy',
        price: 5.99,
        quantity: 10,
      });

      const response = await request(app)
        .post(`/api/sweets/${sweet._id}/restock`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ quantity: 20 });

      expect(response.status).toBe(403);
    });
  });
});

