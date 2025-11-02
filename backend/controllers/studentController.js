const db = require('../config/db');

module.exports = {
    // GET /api/students
    async getAll(req, res) {
        try {
            const [rows] = await db.query(`
                SELECT s.UserId, u.Email, u.FName, u.MInit, u.LName, u.Role, 
                       u.Phone, u.State, u.City, u.PinCode, u.DOB,
                       s.CurrentClassId, c.Sem, c.Branch, c.Degree
                FROM STUDENT s
                INNER JOIN USERS u ON s.UserId = u.UserId
                LEFT JOIN CLASS c ON s.CurrentClassId = c.ClassId
                ORDER BY s.UserId DESC
            `);
            res.json(rows);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // GET /api/students/:id
    async getById(req, res) {
        try {
            const [rows] = await db.query(`
                SELECT s.UserId, u.Email, u.FName, u.MInit, u.LName, u.Role, 
                       u.Phone, u.State, u.City, u.PinCode, u.DOB,
                       s.CurrentClassId, c.Sem, c.Branch, c.Degree
                FROM STUDENT s
                INNER JOIN USERS u ON s.UserId = u.UserId
                LEFT JOIN CLASS c ON s.CurrentClassId = c.ClassId
                WHERE s.UserId = ?
            `, [req.params.id]);
            
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Student not found' });
            }
            res.json(rows[0]);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // POST /api/students
    async create(req, res) {
        const { userId, currentClassId } = req.body;
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        try {
            // Check if user exists and is a student
            const [users] = await db.query('SELECT Role FROM USERS WHERE UserId = ?', [userId]);
            if (users.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            if (users[0].Role !== 'Student') {
                return res.status(400).json({ error: 'User must have Student role' });
            }

            // If classId provided, verify it exists
            if (currentClassId) {
                const [classes] = await db.query('SELECT ClassId FROM CLASS WHERE ClassId = ?', [currentClassId]);
                if (classes.length === 0) {
                    return res.status(404).json({ error: 'Class not found' });
                }
            }

            const [result] = await db.query(
                'INSERT INTO STUDENT (UserId, CurrentClassId) VALUES (?, ?)',
                [userId, currentClassId || null]
            );
            res.status(201).json({ success: true, message: 'Student created successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // PUT /api/students/:id
    async update(req, res) {
        const { currentClassId } = req.body;
        
        try {
            if (currentClassId) {
                const [classes] = await db.query('SELECT ClassId FROM CLASS WHERE ClassId = ?', [currentClassId]);
                if (classes.length === 0) {
                    return res.status(404).json({ error: 'Class not found' });
                }
            }

            await db.query(
                'UPDATE STUDENT SET CurrentClassId = ? WHERE UserId = ?',
                [currentClassId || null, req.params.id]
            );
            res.json({ success: true, message: 'Student updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

