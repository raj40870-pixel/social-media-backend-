import User from '../models/User.js';

// @desc    Get user profile
// @route   GET /api/profile/view
export const getProfile = async (req, res) => {
    try {
        const user = req.user; // from protect middleware
        res.json({ message: "Profile fetched successfully", data: user });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Edit user profile
// @route   PUT /api/profile/edit
export const editProfile = async (req, res) => {
    try {
        const allowedUpdates = ['firstName', 'lastName', 'photoUrl', 'age', 'gender', 'about', 'skills'];
        const updates = Object.keys(req.body);
        
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
        if (!isValidOperation) {
            return res.status(400).json({ message: 'Invalid updates!' });
        }

        const user = req.user;
        updates.forEach((update) => {
            user[update] = req.body[update];
        });

        await user.save();
        res.json({ message: "Profile updated successfully", data: user });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};
