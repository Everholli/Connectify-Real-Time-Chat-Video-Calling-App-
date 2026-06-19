import express from 'express';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { sendFriendRequest, acceptFriendRequest, getFriendRequests, getMyFriends, getOutgoingFriendRequests, getrecommmendedUsers} from '../controllers/user.controllers.js';
import { get } from 'mongoose';

const router = express.Router();

//apply auth middleware to protect routes
router.use(protectRoute);

router.get('/friends', getMyFriends);
router.get('/recommended-users', getrecommmendedUsers);

router.post('/friend-request/:id', sendFriendRequest);
router.put('/friend-request/:id/accept', acceptFriendRequest);

router.get('/friend-requests', getFriendRequests);
router.get('/outgoing-friend-requests', getOutgoingFriendRequests);


export default router;