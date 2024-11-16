const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUserRegistration, validateUserLogin, handleValidationErrors } = require('../middlewares/validationMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const adminController = require('../controllers/adminController'); // Importing the admin controller

// User Registration
router.post('/register', validateUserRegistration, handleValidationErrors, userController.registerUser);

// User Login
router.post('/login', validateUserLogin, handleValidationErrors, userController.loginUser);

// Submit Assignment
router.post('/upload', authMiddleware.isAuthenticated, userController.uploadAssignment);

// Get All Admins
router.get('/admins', authMiddleware.isAuthenticated, adminController.getAllAdmins); // New route to get all admins

module.exports = router;
