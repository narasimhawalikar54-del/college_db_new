const db = require('../config/db');

module.exports = {
    // GET /api/courses
    async getAll(req, res) {
        try {
            const [rows] = await db.query('SELECT * FROM COURSE ORDER BY CourseCode');
            res.json(rows);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // POST /api/courses
    async create(req, res) {
        const { courseCode, name, credits, deptName } = req.body;
        
        // Validation
        if (!courseCode || !name || !credits || !deptName) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (isNaN(credits) || credits < 1 || credits > 10) {
            return res.status(400).json({ error: 'Credits must be a number between 1 and 10' });
        }

        try {
            // Check if course code already exists
            const [existing] = await db.query('SELECT CourseCode FROM COURSE WHERE CourseCode = ?', [courseCode]);
            if (existing.length > 0) {
                return res.status(409).json({ error: 'Course code already exists' });
            }

            const [result] = await db.query(
                'INSERT INTO COURSE (CourseCode, Name, Credits, DeptName) VALUES (?, ?, ?, ?)',
                [courseCode, name, credits, deptName]
            );
            res.status(201).json({ success: true, message: 'Course created successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};
