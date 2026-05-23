import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['text', 'image', 'video', 'document', 'audio'],
        default: 'text'
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);
