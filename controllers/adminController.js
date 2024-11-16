const User = require('../models/userModel');
const Assignment = require('../models/assignmentModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Loading the  environment variables from dotenv file
dotenv.config();

// Handling Registration for Admin
const registerAdmin = async (req, res) => {
    const { name, email, password, adminSecret } = req.body;

    try {
        if (adminSecret !== process.env.ADMIN_SECRET_KEY) {
            return res.status(403).json({ message: 'Invalid admin secret.' });
        }

        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists.' });
        }

        const newAdmin = new User({
            name,
            email,
            password,
            role: 'admin',
        });

        await newAdmin.save();

        res.status(201).json({
            message: 'Admin registered successfully',
            adminId: newAdmin._id,
            name: newAdmin.name,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};

// AHandling Login For Admin User
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide both email and password.' });
        }

        // Checking if admin with these details already exists
        const admin = await User.findOne({ email });
        if (!admin || admin.role !== 'admin') {
            return res.status(404).json({ message: 'Admin not found.' });
        }

        // Compare entered password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, admin.password);
        console.log('Password Match:', isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Creating JWT token
        const token = jwt.sign(
            { adminId: admin._id, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};


// Method implemented to View assignments assigned to the specific admin 
const viewAssignments = async (req, res) => {
    try {
      
        const assignments = await Assignment.find({ admin: req.user.adminId.toString() });

        if (!assignments || assignments.length === 0) {
            return res.status(404).json({ message: 'No assignments found.' });
        }

        res.status(200).json(assignments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching assignments.' });
    }
};



// Method to Accept assignment by Admin
const acceptAssignment = async (req, res) => {
    const { id } = req.params;

    try {
        // Finding the assignment by Assignment ID in the Assignment collection
        const assignment = await Assignment.findById(id);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
t
        if (assignment.admin.toString() !== req.user.adminId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to accept this assignment.' });
        }

        assignment.status = 'in-progress';
        await assignment.save();

        res.status(200).json({ message: 'Assignment accepted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while accepting assignment.' });
    }
};


// Method to Reject assignment by Admin
const rejectAssignment = async (req, res) => {
    const { id } = req.params;

    try {
        const assignment = await Assignment.findById(id);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

        if (assignment.admin.toString() !== req.user.adminId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to reject this assignment.' });
        }

        assignment.status = 'rejected';
        await assignment.save();

        res.status(200).json({ message: 'Assignment rejected' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while rejecting assignment.' });
    }
};

const getAllAdmins = async (req, res) => {
    try {

        const admins = await User.find({ role: 'admin' });

        if (!admins || admins.length === 0) {
            return res.status(404).json({ message: 'No admins found.' });
        }

        res.status(200).json(admins);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching admins.' });
    }
};

module.exports = { registerAdmin, loginAdmin, viewAssignments, acceptAssignment, rejectAssignment, getAllAdmins };
