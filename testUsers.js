import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({});
        console.log("All users in DB:");
        users.forEach(u => console.log(`Name: ${u.firstName}, Email: ${u.email}, ID: ${u._id}`));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
test();
