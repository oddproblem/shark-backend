import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import * as teamCtrl from '../controllers/teamController.js';

const router = express.Router();

// Get current user's team
router.get('/me', requireAuth, teamCtrl.getMyTeam);

// Assign a category to the team
router.post('/assign-category', requireAuth, teamCtrl.selectCategory);

// Optional duplicate route if needed
router.post('/select-category', requireAuth, teamCtrl.selectCategory);

// ✅ New route to fetch available categories
router.get('/get-category', requireAuth, teamCtrl.getCategories);

export default router;
