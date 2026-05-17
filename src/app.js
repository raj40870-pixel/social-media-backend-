import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Parses cookies attached to the client request object

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'API is running...' });
});

// 404 Route
app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint not found' });
});

export default app;
