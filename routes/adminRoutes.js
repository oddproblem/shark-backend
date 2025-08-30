import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import requireRole from '../middleware/roles.js';
import * as adminCtrl from '../controllers/adminController.js';

const router = express.Router();

// Dashboard: accessible by admin or event-manager
router.get(
  '/dashboard',
  requireAuth,
  requireRole(['admin', 'event-manager']),
  adminCtrl.getDashboard
);

// Assign score: accessible by admin or event-manager
router.post(
  '/assign-score',
  requireAuth,
  requireRole(['admin', 'event-manager']),
  adminCtrl.assignScore
);

// Compute top 2 qualifiers per category: admin only
router.post(
  '/compute-qualifiers',
  requireAuth,
  requireRole(['admin']),
  adminCtrl.computeQualifiers
);

// Compute top 3 winners: admin only
router.get(
  '/compute-winners',
  requireAuth,
  requireRole(['admin']),
  adminCtrl.computeWinners
);

export default router;
