const db = require('../config/db');

module.exports = {
    // GET /api/teachers
    async getAll(req, res) {
        try {
            const [rows] = await db.query(`
                SELECT t.UserId, u.Email, u.FName, u.MInit, u.LName, u.Role, 
                       u.Phone, u.State, u.City, u.PinCode, u.DOB,
                       t.Salary, t.SSN, t.Department
                FROM TEACHER t
                INNER JOIN USERS u ON t.UserId = u.UserId
                ORDER BY t.UserId DESC
            `);
            res.json(rows);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // GET /api/teachers/:id
    async getById(req, res) {
        try {
            const [rows] = await db.query(`
                SELECT t.UserId, u.Email, u.FName, u.MInit, u.LName, u.Role, 
                       u.Phone, u.State, u.City, u.PinCode, u.DOB,
                       t.Salary, t.SSN, t.Department
                FROM TEACHER t
                INNER JOIN USERS u ON t.UserId = u.UserId
                WHERE t.UserId = ?
            `, [req.params.id]);
            
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Teacher not found' });
            }
            res.json(rows[0]);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // POST /api/teachers
    async create(req, res) {
        const { userId, salary, ssn, department } = req.body;
        
        if (!userId || !salary || !ssn || !department) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        try {
            // Check if user exists and is a teacher
            const [users] = await db.query('SELECT Role FROM USERS WHERE UserId = ?', [userId]);
            if (users.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            if (users[0].Role !== 'Teacher') {
                return res.status(400).json({ error: 'User must have Teacher role' });
            }

            // Check if SSN already exists
            const [existing] = await db.query('SELECT SSN FROM TEACHER WHERE SSN = ?', [ssn]);
            if (existing.length > 0) {
                return res.status(409).json({ error: 'SSN already exists' });
            }

            const [result] = await db.query(
                'INSERT INTO TEACHER (UserId, Salary, SSN, Department) VALUES (?, ?, ?, ?)',
                [userId, salary, ssn, department]
            );
            res.status(201).json({ success: true, message: 'Teacher created successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

