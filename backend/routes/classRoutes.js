
const express = require('express');
const router = express.Router();
const { scheduleClass, getUpcomingClasses } = require('../controllers/classController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, scheduleClass);
router.get('/upcoming', protect, getUpcomingClasses); // Maybe protect this too?

module.exports = router;
