import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';

import { 
    getRecommendations,
    getFriends,
    sendFriendRequest,
    acceptFriendRequest,
    getFriendRequest,
    getOutgoingRequest,
    getUserProfile,
} from '../controllers/user.controllers.js';

const router = express.Router();

// apply protectRoute middleware to all routes in this file
router.use(protectRoute);

router.get('/', getRecommendations);
router.get('/friends', getFriends);

router.post('/friends-requests/:id', sendFriendRequest);
router.put('/friends-requests/:id/accept', acceptFriendRequest);
// reject friend req route


router.get('/friend-request', getFriendRequest);
router.get('/outgoing-friend-request', getOutgoingRequest);

router.get('/:id', getUserProfile);

export default router;