import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - checks if user is logged in
export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (Bearer TOKEN_STRING)
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the database (excluding password) and attach to request object
            req.user = await User.findById(decoded.id).select('-password');
            
            return next();
        } catch (error) {
            res.status(401);
            return next(new Error('Not authorized, token failed'));
        }
    }

    if (!token) {
        res.status(401);
        return next(new Error('Not authorized, no token provided'));
    }
};

// Authorize Roles - Checks if user has permission (e.g., 'seller')
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            res.status(403);
            return next(new Error(`Role (${req.user.role}) is not authorized to access this resource`));
        }
        next();
    };
};