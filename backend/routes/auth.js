const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs'); // You must run: npm install bcryptjs --prefix backend

// Sign In
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const [users] = await db.query(
            'SELECT UserId, Email, FName, LName, Role, Password FROM USERS WHERE Email = ?',
            [email]
        );
        
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];
        
        // Compare the provided password with the hashed password from the DB
        const isMatch = await bcrypt.compare(password, user.Password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Passwords match. Send token and user info.
        res.json({ 
            token: 'dummy-token-' + Date.now(), // In production, use a real JWT
            user: {
                id: user.UserId,
                email: user.Email,
                name: `${user.FName} ${user.LName}`,
                role: user.Role
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Sign Up
router.post('/signup', async (req, res) => {
    const { email, password, fName, mInit, lName, role, phone, state, city, pinCode, dob } = req.body;
    
    if (!email || !password || !fName || !lName || !role || !phone || !state || !city || !pinCode || !dob) {
        return res.status(400).json({ error: 'All required fields must be provided' });
    }

    if (!['Student', 'Teacher', 'Admin'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role. Must be Student, Teacher, or Admin' });
    }

    try {
        const [existing] = await db.query('SELECT Email FROM USERS WHERE Email = ?', [email]);
        if (existing.length > 0) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user with the HASHED password
        const [result] = await db.query(
            `INSERT INTO USERS (Email, Password, FName, MInit, LName, Role, Phone, State, City, PinCode, DOB) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [email, hashedPassword, fName, mInit || null, lName, role, phone, state, city, pinCode, dob]
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