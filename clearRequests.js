import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ConnectionRequest from './src/models/ConnectionRequest.js';

dotenv.config();

const clearRequests = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { family: 4 });
        console.log('Connected to MongoDB');
        
        const result = await ConnectionRequest.deleteMany({});
        console.log(`Deleted ${result.deletedCount} connection requests.`);
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

clearRequests();
