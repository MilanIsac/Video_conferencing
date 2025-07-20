import User from "../models/user.models.js";
import { FriendRequest } from "../models/friendRequest.models.js";

export async function getRecommendations(req, res) {

    try {
        const userId = req.user.id;
        const currUser = await User.find({
            $and: [
                { _id: { $ne: userId } }, // excluding myself
                { $id: { $nin: req.user.friends } }, // excluding my friends
                { isOnboarded: true } // only onboarded users
            ]
        })

        re.status(200).json(currUser);
    }

    catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function getFriends(req, res) {

    try {
        const user = await User.findById(req.user.id)
            .select('friends')
            .populate("friends", "username profile_pic bio location");

        res.status(200).json(user.friends);
    }

    catch (error) {
        console.error('Error fetching friends:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function sendFriendRequest(req, res) {

    try {
        const userId = req.user.id;
        const { id: recipientId } = req.params;

        // prevent sending friend request to self
        if (userId === recipientId) {
            return res.status(400).json({ message: 'You cannot send a friend request to yourself' });
        }

        const recipient = await User.findById(recipientId);

        // check if recipient exists
        if (!recipient) {
            return res.status(404).json({ message: 'User not found' });
        }

        // check if already friends
        if (recipient.friends.includes(userId)) {
            return res.status(400).json({ message: 'You are already friends with this user' });
        }

        // check if friend request already exists
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: userId, recipient: recipientId },
                { sender: recipientId, recipient: userId },
            ],
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'Friend request already exists' });
        }

        const friendRequest = new FriendRequest({
            sender: userId,
            recipient: recipientId,
        });

        res.status(201).json(friendRequest);


    }
    catch (error) {
        console.error('Error sending friend request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

}

export async function acceptFriendRequest(req, res) {

    try {
        const { id: requestId } = req.params;
        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        if (friendRequest.recipient.toString() !== req.user.id) {
            return res.status(401).json({ message: "You are not authorized to accept this request" });
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient },
        });

        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender },
        });

        res.status(200).json({ message: "Friend request accepted" });
    }

    catch (error) {
        console.error("Error in accepting friend request: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getFriendRequest(req, res) {
    try {

        const incomingRequest = await FriendRequest.find({
            recipient: req.user.id,
            status: "pending",
        }).populate("sender", "name profile_pic");

        const acceptedFriendReq = await FriendRequest.find({
            sender: req.user.id,
            status: "accepted",
        }).populate("sender", "name profile_pic");

        res.status(200).json({ incomingRequest, acceptedFriendReq });

    } catch (error) {
        console.error("Error in getPendingFriendsController: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getOutgoingRequest(req, res) {

    try {

        const outgoingRequest = await FriendRequest.find({
            sender: req.user.id,
            status: "pending",
        }.populate("recipient", "name profile_pic"));

        res.status(200).json(outgoingRequest);

    } catch (error) {
        console.error("Error in getOutgoingRequest: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}