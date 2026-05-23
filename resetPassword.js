import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import dns from 'dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);
dotenv.config();

const resetPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ email: 'prince@gmail.com' });
        if (user) {
            user.password = '123@prince';
            await user.save();
            console.log('Password reset successfully to 123@prince');
        } else {
            console.log('User not found');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
resetPassword();
