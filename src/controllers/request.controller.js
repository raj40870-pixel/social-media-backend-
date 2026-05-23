import ConnectionRequest from '../models/ConnectionRequest.js';
import User from '../models/User.js';

export const sendConnectionRequest = async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const { toUserId } = req.body;
        const status = 'interested';

        console.log(`[DEBUG] sendConnectionRequest: fromUserId=${fromUserId}, toUserId=${toUserId}, email=${req.body.email || 'N/A'}`);

        if (!toUserId) {
            return res.status(400).json({ message: 'toUserId is required' });
        }

        if (fromUserId.toString() === toUserId.toString()) {
            return res.status(400).json({ message: `Cannot send connection request to yourself. (from: ${fromUserId}, to: ${toUserId})` });
        }

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check for existing request
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        if (existingConnectionRequest) {
            return res.status(400).json({ message: 'Connection Request already exists' });
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();

        res.json({
            message: 'Connection Request Sent!',
            data
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const reviewConnectionRequest = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;

        const allowedStatus = ['accepted', 'rejected'];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: 'Status not allowed' });
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: 'interested'
        });

        if (!connectionRequest) {
            return res.status(404).json({ message: 'Connection request not found' });
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.json({ message: `Connection request ${status}`, data });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const clearFakeRequests = async (req, res) => {
    try {
        await ConnectionRequest.deleteMany({});
        res.json({ message: 'All connection requests cleared successfully.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
