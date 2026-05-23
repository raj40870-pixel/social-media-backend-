import mongoose from 'mongoose';
import User from './src/models/User.js';
import dns from 'dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const resetOtherDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://social:Kq5T6c7eHwO6i1Fm@cluster0.d1qshcp.mongodb.net/socialMediaApp');
        const user = await User.findOne({ email: 'prince@gmail.com' });
        if (user) {
            user.password = '123@prince';
            await user.save();
            console.log('Password reset successfully in socialMediaApp');
        } else {
            console.log('User not found in socialMediaApp');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
resetOtherDB();
