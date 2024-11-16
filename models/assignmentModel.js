const mongoose = require('mongoose');

// Defining the assignment schema
const assignmentSchema = new mongoose.Schema({
    task: { 
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'accepted', 'rejected'],
        default: 'pending'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin', // Link to Admin model
        required: false
    },
    assignedToAdmin: {
        type: Boolean,
        default: false // Tracks whether an admin has been assigned
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

assignmentSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
