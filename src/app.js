import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';
import requestRoutes from './routes/request.routes.js';
import userRoutes from './routes/user.routes.js';
import connectionRoutes from './routes/connection.routes.js';
import messageRoutes from './routes/message.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Parses cookies attached to the client request object

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/request', requestRoutes);
app.use('/api/users', userRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/messages', messageRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'API is running...' });
});

import User from './models/User.js';
app.get('/api/debug', async (req, res) => {
    try {
        const users = await User.find({}).select('firstName email photoUrl');
        res.json(users);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

import ConnectionRequest from './models/ConnectionRequest.js';
app.get('/api/debug-requests', async (req, res) => {
    try {
        const requests = await ConnectionRequest.find({});
        res.json(requests);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/debug-update', async (req, res) => {
    try {
        await User.updateOne({ email: 'prince@gmail.com' }, { photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' });
        res.json({ message: 'Prince photo updated successfully!' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 404 Route
app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint not found' });
});

export default app;
