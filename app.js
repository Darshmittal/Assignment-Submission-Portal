require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');  
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialize app
const app = express();

// Connect to MongoDB
connectDB(); 

// Middleware
app.use(express.json());

// Routes
app.use('/users', userRoutes);
app.use('/admins', adminRoutes);

// Default Route
app.get('/', (req, res) => {
  res.send('Welcome to the Assignment Portal API!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
