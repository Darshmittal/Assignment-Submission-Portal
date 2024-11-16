const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { validateAdminRegistration, validateUserLogin, handleValidationErrors } = require('../middlewares/validationMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

// Admin Registration
router.post('/register', validateAdminRegistration, handleValidationErrors, adminController.registerAdmin);

// Admin Login
router.post('/login', validateUserLogin, handleValidationErrors, adminController.loginAdmin);

// View All Assignments for the Admin
// Only an authenticated admin should be able to see assignments assigned to them
router.get('/assignments', authMiddleware.isAuthenticated, authMiddleware.isAdmin, adminController.viewAssignments);

// Accept Assignment (Admin approves an assignment)
router.patch('/assignments/:id/accept', authMiddleware.isAuthenticated, authMiddleware.isAdmin, adminController.acceptAssignment);

// Reject Assignment (Admin rejects an assignment)
router.patch('/assignments/:id/reject', authMiddleware.isAuthenticated, authMiddleware.isAdmin, adminController.rejectAssignment);

module.exports = router;
