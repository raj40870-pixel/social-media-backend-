import Message from '../models/Message.js';

export const getChatHistory = async (req, res) => {
    try {
        const { userId } = req.params; // The other user's ID
        const loggedInUserId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId, receiverId: userId },
                { senderId: userId, receiverId: loggedInUserId }
            ]
        }).sort({ createdAt: 1 });

        res.json({ data: messages });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { receiverId, type, content } = req.body;
        const senderId = req.user._id;

        const message = new Message({
            senderId,
            receiverId,
            type,
            content
        });

        const savedMessage = await message.save();

        // Emit socket event to the receiver if they are online
        const io = req.app.get('io');
        if (io) {
            io.to(receiverId.toString()).emit('receiveMessage', savedMessage);
            // Also emit to sender in case they have multiple tabs open
            io.to(senderId.toString()).emit('receiveMessage', savedMessage);
        }

        res.json({ message: 'Message sent', data: savedMessage });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        
        // Generate the URL for the uploaded file
        // Assumes backend runs on localhost:3456
        const fileUrl = `http://localhost:3456/uploads/${req.file.filename}`;
        res.json({ data: fileUrl });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
