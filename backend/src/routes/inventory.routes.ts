import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import Sweet from '../models/Sweet.model';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();

// POST /api/sweets/:id/purchase - Purchase a sweet (protected)
router.post(
  '/:id/purchase',
  authenticate,
  [
    body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const purchaseQuantity = req.body.quantity || 1;
      const sweet = await Sweet.findById(req.params.id);

      if (!sweet) {
        return res.status(404).json({ message: 'Sweet not found' });
      }

      if (sweet.quantity < purchaseQuantity) {
        return res.status(400).json({
          message: `Insufficient stock. Available: ${sweet.quantity}, Requested: ${purchaseQuantity}`,
        });
      }

      sweet.quantity -= purchaseQuantity;
      await sweet.save();

      res.json({
        message: 'Purchase successful',
        sweet,
        purchasedQuantity: purchaseQuantity,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

// POST /api/sweets/:id/restock - Restock a sweet (protected, admin only)
router.post(
  '/:id/restock',
  authenticate,
  requireAdmin,
  [
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { quantity } = req.body;
      const sweet = await Sweet.findById(req.params.id);

      if (!sweet) {
        return res.status(404).json({ message: 'Sweet not found' });
      }

      sweet.quantity += quantity;
      await sweet.save();

      res.json({
        message: 'Restock successful',
        sweet,
        restockedQuantity: quantity,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;

