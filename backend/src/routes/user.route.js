import express from 'express';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { sendFriendRequest, acceptFriendRequest, getFriendRequests, getMyFriends, getOutgoingFriendRequests, getrecommmendedUsers} from '../controllers/user.controllers.js';
import { get } from 'mongoose';

const router = express.Router();

//apply auth middleware to protect routes
router.use(protectRoute);

router.get('/friends', getMyFriends);
router.get('/', getrecommmendedUsers);

router.post('/friendRequest/:id', sendFriendRequest);
router.put('/friendRequest/:id/accept', acceptFriendRequest);

router.get('/friendRequests', getFriendRequests);
router.get('/outgoingFriendRequests', getOutgoingFriendRequests);


export default router;