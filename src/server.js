import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']); // Fix querySrv ECONNREFUSED

import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB().then(() => {
    // Start server after DB connection
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to DB', err);
});
