import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import * as authCtrl from '../controllers/authController.js';

const router = express.Router();

router.post('/login', authCtrl.login);
router.post('/register', authCtrl.registerTeamHead);
router.post('/logout', authCtrl.logout);

// ✅ Add this route
router.get('/check', requireAuth, (req, res) => {
  res.json({
    message: 'User authenticated',
    // Note: The user object from requireAuth middleware doesn't have _id
    user: { id: req.user.id, role: req.user.role, name: req.user.name }
  });
});

export default router;
