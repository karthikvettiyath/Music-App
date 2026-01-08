
const { pool } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Check if user exists
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING user_id, name, email, role',
            [name, email, hashedPassword, role]
        );

        // Generate Token
        const token = jwt.sign({ id: newUser.rows[0].user_id, role: newUser.rows[0].role }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        res.status(201).json({
            user: newUser.rows[0],
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check for user
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check matches
        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate Token
        const token = jwt.sign({ id: user.rows[0].user_id, role: user.rows[0].role }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        res.json({
            user: {
                user_id: user.rows[0].user_id,
                name: user.rows[0].name,
                email: user.rows[0].email,
                role: user.rows[0].role,
            },
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { registerUser, loginUser };
