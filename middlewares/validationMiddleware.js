const { body, validationResult } = require('express-validator');

// Validation for User Registration (POST /register/user)
const validateUserRegistration = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
    body('email')
        .isEmail().withMessage('Valid email is required'),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/\d/).withMessage('Password must contain at least one number')
];

// Validation for Admin Registration (POST /register/admin)
const validateAdminRegistration = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/\d/).withMessage('Password must contain at least one number'),
    body('adminSecret')
        .equals(process.env.ADMIN_SECRET_KEY)
        .withMessage('Invalid admin secret key'),
];

// Validation for User Login (POST /login)
const validateUserLogin = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
];

// Validation for Assignment Upload (POST /upload)
const validateAssignmentUpload = [
    body('task').notEmpty().withMessage('Task is required'),
    // Removed `admin` field validation here, assume user role is checked via middleware.
];

// General error handling function to send validation errors in response
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    validateUserRegistration,
    validateAdminRegistration,
    validateUserLogin,
    validateAssignmentUpload,
    handleValidationErrors,
};
