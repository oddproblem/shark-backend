import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import requireRole from '../middleware/roles.js';
import * as attendanceCtrl from '../controllers/attendanceController.js';

const router = express.Router();

router.get('/', requireAuth, requireRole(['event-manager']), attendanceCtrl.listTeams);
router.post('/toggle', requireAuth, requireRole(['event-manager']), attendanceCtrl.toggleAttendance);

export default router;
