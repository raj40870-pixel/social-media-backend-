import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ _id: id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
export const signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'This email already exists. Please use another email or login' });
        }

        // Create user
        const user = await User.create({
            firstName,
            lastName,
            email,
            password
        });

        if (user) {
            res.status(201).json({
                message: 'User registered successfully',
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                }
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email: email.toLowerCase() });

        if (user && (await user.matchPassword(password))) {
            // Generate token
            const token = generateToken(user._id);

            // Set cookie
            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                sameSite: 'none',
                secure: true
            });

            res.json({
                message: 'Login successful',
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                }
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
export const logout = async (req, res) => {
    res.cookie('token', null, {
        httpOnly: true,
        expires: new Date(Date.now()),
        sameSite: 'none',
        secure: true
    });
    res.status(200).json({ message: 'User successfully logged out' });
};
