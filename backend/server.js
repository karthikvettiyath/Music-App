
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { pool } = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('RaagaLive Backend is running');
});

app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/users', require('./routes/userRoutes')); // User routes not created yet, skipping for now
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/classes', require('./routes/classRoutes'));
app.use('/api/meetings', require('./routes/meetingRoutes'));

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
