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
        
        // Cloudinary automatically provides the URL in req.file.path
        const fileUrl = req.file.path;
        res.json({ data: fileUrl });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const senderId = req.user._id;

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        // Only allow the sender to delete their own message
        if (message.senderId.toString() !== senderId.toString()) {
            return res.status(403).json({ message: 'You can only delete your own messages' });
        }

        await Message.findByIdAndDelete(messageId);
        res.json({ message: 'Message deleted successfully', data: messageId });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
