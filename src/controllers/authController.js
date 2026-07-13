import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Generate JWT Token Utility Function
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user (Buyer or Seller)
// @route   POST /api/auth/register
export const registerUser = async (req, res, next) => {
    const { name, email, password, contactInfo, role } = req.body;

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            return next(new Error('User already exists'));
        }

        // Hash the password securely
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the user document
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            contactInfo,
            role: role || 'buyer' // Fallback defaults to 'buyer'
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                contactInfo: user.contactInfo,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400);
            return next(new Error('Invalid user data provided'));
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
export const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401);
            return next(new Error('Invalid email or password'));
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get user profile data
// @route   GET /api/auth/profile
export const getUserProfile = async (req, res, next) => {
    try {
        // req.user is set by our protect middleware
        const user = await User.findById(req.user._id).select('-password');

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                contactInfo: user.contactInfo,
                role: user.role,
                sellerRating: user.sellerRating
            });
        } else {
            res.status(404);
            return next(new Error('User profile not found'));
        }
    } catch (error) {
        next(error);
    }
};