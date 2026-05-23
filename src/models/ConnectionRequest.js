import mongoose from 'mongoose';

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['ignored', 'interested', 'accepted', 'rejected'],
            message: '{VALUE} is incorrect status type'
        }
    }
}, { timestamps: true });

// Prevent sending a request to yourself
connectionRequestSchema.pre('save', function () {
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error('You cannot send a connection request to yourself!');
    }
});

export default mongoose.model('ConnectionRequest', connectionRequestSchema);
