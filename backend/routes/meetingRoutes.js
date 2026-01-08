
const express = require('express');
const router = express.Router();
const { generateToken } = require('../controllers/meetingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/token', protect, generateToken);

module.exports = router;
