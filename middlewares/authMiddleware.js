const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Middleware to check if the user is authenticated (JWT verification)
const isAuthenticated = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the user data (decoded from JWT) to the request object
        console.log('Decoded User:', decoded);
        next();
    } catch (err) {

        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        } else {
            return res.status(401).json({ message: 'Invalid token' });
        }
    }
};


// Middleware to check if the user has admin role
const isAdmin = (req, res, next) => {
    console.log('User Data:', req.user); 

    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied, admin only' });
    }
    next();
};


module.exports = { isAuthenticated, isAdmin };
