import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import requireRole from '../middleware/roles.js';
import * as auditCtrl from '../controllers/auditController.js';

const router = express.Router();

router.get('/', requireAuth, requireRole(['admin','event-manager']), auditCtrl.listAudits);

export default router;
