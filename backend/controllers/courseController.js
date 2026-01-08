
const { pool } = require('../config/db');

const createCourse = async (req, res) => {
    const { title, description, price } = req.body;
    const teacher_id = req.user.id; // From auth middleware

    if (req.user.role !== 'teacher') {
        return res.status(403).json({ message: 'Only teachers can create courses' });
    }

    try {
        const newCourse = await pool.query(
            'INSERT INTO courses (title, description, price, teacher_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, description, price, teacher_id]
        );
        res.status(201).json(newCourse.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getAllCourses = async (req, res) => {
    try {
        const courses = await pool.query('SELECT * FROM courses');
        res.json(courses.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getMyCourses = async (req, res) => {
    const user_id = req.user.id;
    try {
        // If teacher, get created courses. If student, get enrolled courses (logic to be improved for enrollments)
        let query = '';
        if (req.user.role === 'teacher') {
            query = 'SELECT * FROM courses WHERE teacher_id = $1';
        } else {
            // Simplified for now, just all courses or improve later with enrollments
            query = 'SELECT c.* FROM courses c JOIN enrollments e ON c.course_id = e.course_id WHERE e.user_id = $1';
            // For MVP MVP, let's just return courses where teacher_id matches for now or empty for student if not enrolled
            if (req.user.role !== 'teacher') return res.json([]);
        }

        if (req.user.role === 'teacher') {
            const courses = await pool.query(query, [user_id]);
            res.json(courses.rows);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { createCourse, getAllCourses, getMyCourses };
