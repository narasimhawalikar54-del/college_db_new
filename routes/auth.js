const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'name, email and password required' });
    }
    try {
        const hashed = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            'INSERT INTO Users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashed]
        );
        res.status(201).json({ success: true, id: result.insertId });
    } catch (err) {
        if (err && err.errno === 1062) { // duplicate entry
            return res.status(409).json({ error: 'Email already registered' });
        }
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Database error during signup' });
    }
});

// POST /api/auth/signin
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });
    try {
        const [users] = await db.query(
            'SELECT userid, name, email, password FROM Users WHERE email = ?', [email]
        );
        if (!users || users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const user = users[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.json({ 
            success: true, 
            id: user.userid,
            name: user.name, 
            email: user.email 
        });
    } catch (err) {
        console.error('Signin error:', err);
        res.status(500).json({ error: 'Database error during signin' });
    }
});

module.exports = router;
