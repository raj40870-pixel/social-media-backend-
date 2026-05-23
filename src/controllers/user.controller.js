import ConnectionRequest from '../models/ConnectionRequest.js';
import User from '../models/User.js';

const USER_SAFE_DATA = 'firstName lastName photoUrl age gender about skills';

// Get all pending connection requests for the logged-in user
export const getRequests = async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'interested',
        }).populate('fromUserId', USER_SAFE_DATA);

        res.json({ message: 'Data fetched successfully', data: connectionRequests });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all accepted connections for the logged-in user
export const getConnections = async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: 'accepted' },
                { fromUserId: loggedInUser._id, status: 'accepted' }
            ]
        }).populate('fromUserId', USER_SAFE_DATA).populate('toUserId', USER_SAFE_DATA);

        const data = connectionRequests.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({ data });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get feed of users that the logged-in user has not interacted with
export const getFeed = async (req, res) => {
    try {
        const loggedInUser = req.user;

        // Find all connection requests (sent or received)
        const connectionRequests = await ConnectionRequest.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }]
        }).select('fromUserId toUserId');

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select(USER_SAFE_DATA);

        res.json({ data: users });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Check if a user exists by email
export const checkUser = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email: email.toLowerCase() }).select('_id firstName lastName photoUrl');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User found', data: user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
