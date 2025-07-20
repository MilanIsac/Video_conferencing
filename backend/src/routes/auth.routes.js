import express from 'express';

import { login, logout, signup } from '../controllers/auth.controllers.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { onboard } from '../controllers/auth.controllers.js';

const router = express.Router();

// forget password route
// send otp in mail for login

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)
// logout route is post because it modifies server state (clearing cookies)


router.post('/onboarding', protectRoute, onboard);

router.get('/me', protectRoute, (req, res) => {
    res.status(200).json({ success: true, user: req.user });
});

export default router;