const User = require('../models/userModel');
const Assignment = require('../models/assignmentModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Loading the environment variables 
dotenv.config();

// User registration
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Validating the input
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        // Checking if the user already exists in the DB
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        const newUser = await User.create({
            name,
            email,
            password,
            role: 'user' 
        });

        res.status(201).json({
            message: 'User registered successfully',
            userId: newUser._id,
            name: newUser.name
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};

// User login 
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validating input
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide both email and password.' });
        }

        const user = await User.findOne({ email });
        if (!user || user.role !== 'user') {
            return res.status(404).json({ message: 'User not found.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
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

// Uploading the assignment in the portal from the user
const uploadAssignment = async (req, res) => {
    const { task, description, deadline, adminId } = req.body;
    const userId = req.user.userId;

    if (!task || !description || !deadline || !adminId) {
        return res.status(400).json({ message: 'Task, description, deadline, and adminId are required.' });
    }

    try {
        const assignment = new Assignment({
            task, 
            description,
            deadline,
            user: userId,
            admin: adminId,
            assignedToAdmin: true
        });
        
        await assignment.save();
        res.status(201).json({ message: 'Assignment uploaded successfully' });
    } catch (error) {
        console.error('Error uploading assignment:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    uploadAssignment
};
