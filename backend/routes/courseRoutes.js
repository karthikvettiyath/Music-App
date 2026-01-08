
const express = require('express');
const router = express.Router();
const { createCourse, getAllCourses, getMyCourses } = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createCourse);
router.get('/', getAllCourses);
router.get('/my', protect, getMyCourses);

module.exports = router;
