import express, { Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import Sweet from '../models/Sweet.model';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();

// GET /api/sweets - Get all sweets (protected)
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const sweets = await Sweet.find().sort({ createdAt: -1 });
    res.json(sweets);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/sweets/search - Search sweets (protected)
router.get(
  '/search',
  authenticate,
  [
    query('name').optional().trim(),
    query('category').optional().trim(),
    query('minPrice').optional().isFloat({ min: 0 }),
    query('maxPrice').optional().isFloat({ min: 0 }),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, category, minPrice, maxPrice } = req.query;

      const filter: any = {};

      if (name) {
        filter.name = { $regex: name as string, $options: 'i' };
      }

      if (category) {
        filter.category = { $regex: category as string, $options: 'i' };
      }

      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) {
          filter.price.$gte = parseFloat(minPrice as string);
        }
        if (maxPrice) {
          filter.price.$lte = parseFloat(maxPrice as string);
        }
      }

      const sweets = await Sweet.find(filter).sort({ createdAt: -1 });
      res.json(sweets);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

// POST /api/sweets - Add a new sweet (protected, admin only)
router.post(
  '/',
  authenticate,
  requireAdmin,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
    body('imageUrl')
      .optional()
      .custom((value) => {
        if (!value || value === '') return true; // Allow empty string
        // Allow localhost and valid URLs
        const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?(\?[&#\w]*)?$/i;
        const localhostPattern = /^(https?:\/\/)?localhost(:\d+)?(\/.*)?$/i;
        return urlPattern.test(value) || localhostPattern.test(value);
      })
      .withMessage('Image URL must be a valid URL'),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, category, price, quantity = 0, imageUrl } = req.body;

      // Check if sweet with same name already exists
      const existingSweet = await Sweet.findOne({ name });
      if (existingSweet) {
        return res.status(400).json({ message: 'Sweet with this name already exists' });
      }

      const sweet = new Sweet({
        name,
        category,
        price,
        quantity,
        imageUrl: imageUrl || undefined,
      });

      await sweet.save();
      res.status(201).json(sweet);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

// GET /api/sweets/:id - Get a single sweet (protected)
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }
    res.json(sweet);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/sweets/:id - Update a sweet (protected, admin only)
router.put(
  '/:id',
  authenticate,
  requireAdmin,
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
    body('imageUrl')
      .optional()
      .custom((value) => {
        if (!value || value === '') return true; // Allow empty string
        // Allow localhost and valid URLs
        const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?(\?[&#\w]*)?$/i;
        const localhostPattern = /^(https?:\/\/)?localhost(:\d+)?(\/.*)?$/i;
        return urlPattern.test(value) || localhostPattern.test(value);
      })
      .withMessage('Image URL must be a valid URL'),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const sweet = await Sweet.findById(req.params.id);
      if (!sweet) {
        return res.status(404).json({ message: 'Sweet not found' });
      }

      // Check if name is being changed and if new name already exists
      if (req.body.name && req.body.name !== sweet.name) {
        const existingSweet = await Sweet.findOne({ name: req.body.name });
        if (existingSweet) {
          return res.status(400).json({ message: 'Sweet with this name already exists' });
        }
      }

      Object.assign(sweet, req.body);
      await sweet.save();

      res.json(sweet);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

// DELETE /api/sweets/:id - Delete a sweet (protected, admin only)
router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const sweet = await Sweet.findById(req.params.id);
      if (!sweet) {
        return res.status(404).json({ message: 'Sweet not found' });
      }

      await Sweet.findByIdAndDelete(req.params.id);
      res.json({ message: 'Sweet deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;

