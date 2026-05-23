import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']); // Fix querySrv ECONNREFUSED

import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 3456;

const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true
    }
});

app.set('io', io);

// Basic Socket logic for 1-on-1 chat
io.on('connection', (socket) => {
    // User joins their own personal room using their user ID
    socket.on('join', (userId) => {
        socket.join(userId);
    });

    socket.on('disconnect', () => {
        // Automatically handled
    });
});

// Export io so it can be used in controllers
export { io };

// Connect to database
connectDB().then(() => {
    // Start server after DB connection
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to DB', err);
});
