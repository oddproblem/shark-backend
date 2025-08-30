import express from 'express';
import * as leader from '../controllers/leaderboardController.js';

const router = express.Router();

router.get('/', leader.getLeaderboard);

export default router;
