import express, { Response } from 'express';
import Order from '../models/Order.model';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();

// GET /api/orders - Get all orders for the authenticated user
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .limit(100); // Limit to last 100 orders

    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/orders/:orderId - Get a single order by orderId
router.get('/:orderId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId, userId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/orders - Create a new order
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { orderId, items, total, status } = req.body;

    if (!orderId || !items || !Array.isArray(items) || items.length === 0 || !total) {
      return res.status(400).json({ message: 'Invalid order data' });
    }

    const order = new Order({
      userId,
      orderId,
      items,
      total,
      status: status || 'completed',
    });

    await order.save();

    res.status(201).json(order);
  } catch (error: any) {
    if (error.code === 11000) {
      // Duplicate orderId
      return res.status(400).json({ message: 'Order ID already exists' });
    }
    res.status(500).json({ message: error.message });
  }
});

export default router;

