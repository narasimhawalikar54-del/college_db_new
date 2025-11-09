const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Sign In
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const [users] = await db.query(
            'SELECT UserId, Email, FName, LName, Role FROM USERS WHERE Email = ? AND Password = ?',
            [email, password]
        );
        
        if (users.length > 0) {
            const user = users[0];
            // In production, use proper JWT tokens with bcrypt for password hashing
            res.json({ 
                token: 'dummy-token-' + Date.now(),
                user: {
                    id: user.UserId,
                    email: user.Email,
                    name: `${user.FName} ${user.LName}`,
                    role: user.Role
                }
            });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Sign Up
router.post('/signup', async (req, res) => {
    const { email, password, fName, mInit, lName, role, phone, state, city, pinCode, dob } = req.body;
    
    // Validation
    if (!email || !password || !fName || !lName || !role || !phone || !state || !city || !pinCode || !dob) {
        return res.status(400).json({ error: 'All required fields must be provided' });
    }

    if (!['Student', 'Teacher', 'Admin'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role. Must be Student, Teacher, or Admin' });
    }

    try {
        // Check if email already exists
        const [existing] = await db.query('SELECT Email FROM USERS WHERE Email = ?', [email]);
        if (existing.length > 0) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        // Insert user
        const [result] = await db.query(
            `INSERT INTO USERS (Email, Password, FName, MInit, LName, Role, Phone, State, City, PinCode, DOB) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [email, password, fName, mInit || null, lName, role, phone, state, city, pinCode, dob]
        );

        res.status(201).json({ 
            success: true, 
            userId: result.insertId,
            message: 'User created successfully'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
