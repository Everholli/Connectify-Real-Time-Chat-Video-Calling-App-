import {User} from '../models/User.models.js';
import FriendRequest from '../models/FriendRequest.models.js';

export async function getrecommmendedUsers(req, res) {
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;

        const recommendedUsers = await User.find({
            $and: [
                { _id: {$ne: currentUserId} },
                { _id: {$nin: currentUser.friends} },
                { isOnboarded: true }
            ],
        });
        res.status(200).json({
            message: "Recommended users fetched successfully",
            users: recommendedUsers
        });

    } catch (error) {
        console.error("Error fetching recommended users:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

export async function getMyFriends(req, res) {
    try {
        const user = await User.findById(req.user.id)
        .select('friends')
        .populate('friends', 'username profilePic nativeLanguage learningLanguages');

        res.status(200).json({
            message: "Friends fetched successfully",
            friends: user.friends
        });
    } catch (error) {
        console.error("Error fetching friends:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

export async function sendFriendRequest(req, res) {
    try {
        const myId = req.user.id;
        const { id: receiverId } = req.params;

        //prevent sending request to oneself
        if (myId === receiverId) {
            return res.status(400).json({message: "You cannot send a friend request to yourself"});
        }
        
        const recipient = await User.findById(receiverId);
        if (!recipient) {
            return res.status(404).json({message: "Recipient not found"});
        }

        if(recipient.friends.includes(myId)) {
            return res.status(400).json({message: "You are already friends with this user"});
        }

        //check if a pending request already exists
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, receiver: receiverId },
                { sender: receiverId, receiver: myId }
            ],
        
            status: "pending"
        });
        if (existingRequest) {
            return res
            .status(400)
            .json({message: "A pending friend request already exists between you and this user"});
        }

        const friendRequest = new FriendRequest({
            sender: myId,
            receiver: receiverId
        });
        await friendRequest.save();

        res.status(200).json({
            message: "Friend request sent successfully",
            friendRequest
        });
    } catch (error) {
        console.error("Error sending friend request:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

export async function acceptFriendRequest(req, res) {
    try {
        const {id: requestId} = req.params;

        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest) {
            return res.status(404).json({message: "Friend request not found"});
        }

        //verfy that the logged in user is the receiver of the request
        if (friendRequest.receiver.toString() !== req.user.id) {
            return res.status(403).json({message: "You are not authorized to accept this friend request"});
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        //update both users' friends lists
        //$addToSet: adds the value to the array only if it doesn't already exist
        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.receiver }
        });
        await User.findByIdAndUpdate(friendRequest.receiver, {
            $addToSet: { friends: friendRequest.sender }
        });

        res.status(200).json({
            message: "Friend request accepted successfully",
        });
    } catch (error) {
        console.error("Error accepting friend request:", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export async function getFriendRequests(req, res) {
    try {
        const incomingReqs = await FriendRequest.find({
            receiver: req.user.id,
            status: "pending",
        }).populate("sender", "username profilePic nativeLanguage learningLanguages");

        const acceptedReqs = await FriendRequest.find({
            sender: req.user.id,
            status: "accepted",
        }).populate("receiver", "username profilePic");

        res.status(200).json({ incomingReqs, acceptedReqs });
    } catch (error) {
        console.error("Error fetching friend requests:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getOutgoingFriendRequests(req, res) {
    try {
        const outgoingReqs = await FriendRequest.find({
            sender: req.user.id,
            status: "pending",
        }).populate("receiver", "username profilePic nativeLanguage learningLanguages");

        res.status(200).json({ outgoingReqs})
    } catch (error) {
        console.error("Error fetching outgoing friend requests:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}