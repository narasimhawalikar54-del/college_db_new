const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs'); // run: npm install bcryptjs --prefix backend

// Sign In
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // use lowercase column names to match created schema
        const [users] = await db.query(
            'SELECT userid, email, fname, lname, role, password FROM users WHERE email = ?',
            [email]
        );
        
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];
        
        // Compare the provided password with the hashed password from the DB
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Passwords match. Send token and user info.
        res.json({ 
            token: 'dummy-token-' + Date.now(), // In production, use a real JWT
            user: {
                id: user.userid,
                email: user.email,
                name: `${user.fname || ''} ${user.lname || ''}`.trim(),
                role: user.role
            }
        });
    } catch (err) {
        console.error('Signin error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Sign Up
router.post('/signup', async (req, res) => {
    // Accept either a single "name" or separate fname/lname fields from frontend
    const { email, password, name, fName, fname, lName, lname, mInit, role, phone, state, city, pinCode, dob } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    // derive first/last names
    let first = fname || fName || lname || lName ? (fname || fName || '') : '';
    let last = lname || lName || '';
    if (name && !first) {
        const parts = String(name).trim().split(/\s+/);
        first = parts.shift() || '';
        last = parts.join(' ') || '';
    }

    const userRole = role || 'Student';

    if (!['Student', 'Teacher', 'Admin'].includes(userRole)) {
        return res.status(400).json({ error: 'Invalid role. Must be Student, Teacher, or Admin' });
    }

    try {
        const [existing] = await db.query('SELECT email FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user with the hashed password; use lowercase column names
        const [result] = await db.query(
            `INSERT INTO users (email, password, fname, minit, lname, role, phone, state, city, pincode, dob) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [email, hashedPassword, first || null, mInit || null, last || null, userRole, phone || null, state || null, city || null, pinCode || null, dob || null]
        );

        res.status(201).json({ 
            success: true, 
            userId: result.insertId,
            message: 'User created successfully'
        });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;