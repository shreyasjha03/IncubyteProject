import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.model';

const router = express.Router();

// Generate JWT token
const generateToken = (userId: string, email: string, role: string) => {
  return jwt.sign(
    { id: userId, email, role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '7d' }
  );
};

// Generate reset token
const generateResetToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// POST /api/auth/register
router.post(
  '/register',
  [
    body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });

      if (existingUser) {
        return res.status(400).json({
          message: 'User with this email or username already exists',
        });
      }

      // Create new user
      const user = new User({
        username,
        email,
        password,
      });

      await user.save();

      const token = generateToken(user._id.toString(), user.email, user.role);

      res.status(201).json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user by email (case-insensitive)
      const user = await User.findOne({ email: email.toLowerCase().trim() });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = generateToken(user._id.toString(), user.email, user.role);

      res.json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

// POST /api/auth/forgot-password - Request password reset
router.post(
  '/forgot-password',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email } = req.body;

      // Find user by email
      const user = await User.findOne({ email });
      
      // Always return success message (security best practice - don't reveal if email exists)
      if (!user) {
        return res.json({
          message: 'If an account with that email exists, a password reset link has been sent.',
        });
      }

      // Generate reset token
      const resetToken = generateResetToken();
      const resetTokenExpiry = new Date();
      resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Token expires in 1 hour

      // Save reset token to user
      user.resetToken = resetToken;
      user.resetTokenExpiry = resetTokenExpiry;
      await user.save();

      // In production, send email with reset link
      // For now, we'll return the token in development mode
      const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
      
      // TODO: Send email with reset link
      // await sendPasswordResetEmail(user.email, resetLink);
      
      console.log('Password reset link (dev only):', resetLink);

      res.json({
        message: 'If an account with that email exists, a password reset link has been sent.',
        // Only include in development
        ...(process.env.NODE_ENV !== 'production' && { resetLink }),
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

// POST /api/auth/verify-reset-token - Verify reset token validity
router.post(
  '/verify-reset-token',
  [
    body('token').notEmpty().withMessage('Reset token is required'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { token } = req.body;

      // Find user with valid reset token
      const user = await User.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: new Date() }, // Token not expired
      });

      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired reset token' });
      }

      res.json({ message: 'Reset token is valid' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

// POST /api/auth/reset-password - Reset password with token
router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Reset token is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { token, password } = req.body;

      // Find user with valid reset token
      const user = await User.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: new Date() }, // Token not expired
      });

      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired reset token' });
      }

      // Update password (will be hashed by pre-save hook)
      user.password = password;
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();

      res.json({ message: 'Password has been reset successfully. You can now login with your new password.' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;

