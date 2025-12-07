import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/profile', authenticateToken, authController.profile);
router.get('/admin-only', authenticateToken, authorizeRole('admin'), authController.adminOnly);

export default router;
