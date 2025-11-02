import request from 'supertest';
import app from '../server';
import mongoose from 'mongoose';
import User from '../models/User.model';
import Sweet from '../models/Sweet.model';

describe('Sweets API', () => {
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

    // Create regular user
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

    // Create admin user
    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    });

    // Get tokens
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });
    authToken = loginResponse.body.token;

    const adminLoginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'password123' });
    adminToken = adminLoginResponse.body.token;
  });

  describe('GET /api/sweets', () => {
    it('should get all sweets for authenticated user', async () => {
      await Sweet.create([
        { name: 'Chocolate', category: 'Candy', price: 5.99, quantity: 10 },
        { name: 'Lollipop', category: 'Candy', price: 2.99, quantity: 20 },
      ]);

      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });

    it('should require authentication', async () => {
      const response = await request(app).get('/api/sweets');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/sweets', () => {
    it('should create a new sweet as admin', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Gummy Bears',
          category: 'Candy',
          price: 3.99,
          quantity: 15,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name', 'Gummy Bears');
    });

    it('should not allow regular user to create sweet', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Gummy Bears',
          category: 'Candy',
          price: 3.99,
        });

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/sweets/search', () => {
    beforeEach(async () => {
      await Sweet.create([
        { name: 'Chocolate Bar', category: 'Chocolate', price: 5.99, quantity: 10 },
        { name: 'Gummy Bears', category: 'Candy', price: 3.99, quantity: 20 },
        { name: 'Lollipop', category: 'Candy', price: 2.99, quantity: 15 },
      ]);
    });

    it('should search by name', async () => {
      const response = await request(app)
        .get('/api/sweets/search?name=chocolate')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toContain('Chocolate');
    });

    it('should search by category', async () => {
      const response = await request(app)
        .get('/api/sweets/search?category=Candy')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });

    it('should filter by price range', async () => {
      const response = await request(app)
        .get('/api/sweets/search?minPrice=3&maxPrice=5')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].price).toBeGreaterThanOrEqual(3);
      expect(response.body[0].price).toBeLessThanOrEqual(5);
    });
  });

  describe('PUT /api/sweets/:id', () => {
    it('should update sweet as admin', async () => {
      const sweet = await Sweet.create({
        name: 'Test Sweet',
        category: 'Candy',
        price: 5.99,
        quantity: 10,
      });

      const response = await request(app)
        .put(`/api/sweets/${sweet._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 6.99 });

      expect(response.status).toBe(200);
      expect(response.body.price).toBe(6.99);
    });
  });

  describe('DELETE /api/sweets/:id', () => {
    it('should delete sweet as admin', async () => {
      const sweet = await Sweet.create({
        name: 'Test Sweet',
        category: 'Candy',
        price: 5.99,
        quantity: 10,
      });

      const response = await request(app)
        .delete(`/api/sweets/${sweet._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);

      const deleted = await Sweet.findById(sweet._id);
      expect(deleted).toBeNull();
    });
  });
});

