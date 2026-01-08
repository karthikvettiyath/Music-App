
const { pool } = require('../config/db');

const scheduleClass = async (req, res) => {
    const { course_id, start_time, duration, title } = req.body;

    try {
        const newClass = await pool.query(
            'INSERT INTO classes (course_id, start_time, duration, title) VALUES ($1, $2, $3, $4) RETURNING *',
            [course_id, start_time, duration, title]
        );
        res.status(201).json(newClass.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getUpcomingClasses = async (req, res) => {
    // Ideally filter by user enrollments or teacher ownership
    // For now, return all classes for simplicity in MVP or filter via query params
    try {
        const classes = await pool.query('SELECT * FROM classes WHERE start_time > NOW() ORDER BY start_time ASC');
        res.json(classes.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { scheduleClass, getUpcomingClasses };
