const db = require('../config/db');

module.exports = {
    // GET /api/assignments
    async getAll(req, res) {
        try {
            const [rows] = await db.query(`
                SELECT a.AssignmentId, a.Title, a.Description, a.GivenOn, a.Deadline,
                       a.ClassId, a.CourseId,
                       c.Name as CourseName,
                       cl.Sem, cl.Branch
                FROM ASSIGNMENT a
                INNER JOIN COURSE c ON a.CourseId = c.CourseCode
                INNER JOIN CLASS cl ON a.ClassId = cl.ClassId
                ORDER BY a.Deadline ASC, a.GivenOn DESC
            `);
            res.json(rows);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // GET /api/assignments/:id
    async getById(req, res) {
        try {
            const [rows] = await db.query(`
                SELECT a.AssignmentId, a.Title, a.Description, a.GivenOn, a.Deadline,
                       a.ClassId, a.CourseId,
                       c.Name as CourseName,
                       cl.Sem, cl.Branch
                FROM ASSIGNMENT a
                INNER JOIN COURSE c ON a.CourseId = c.CourseCode
                INNER JOIN CLASS cl ON a.ClassId = cl.ClassId
                WHERE a.AssignmentId = ?
            `, [req.params.id]);
            
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Assignment not found' });
            }
            res.json(rows[0]);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // POST /api/assignments
    async create(req, res) {
        const { title, description, givenOn, deadline, classId, courseId } = req.body;
        
        if (!title || !description || !givenOn || !deadline || !classId || !courseId) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (new Date(deadline) < new Date(givenOn)) {
            return res.status(400).json({ error: 'Deadline must be after given date' });
        }

        try {
            // Verify course exists
            const [courses] = await db.query('SELECT CourseCode FROM COURSE WHERE CourseCode = ?', [courseId]);
            if (courses.length === 0) {
                return res.status(404).json({ error: 'Course not found' });
            }

            // Verify class exists
            const [classes] = await db.query('SELECT ClassId FROM CLASS WHERE ClassId = ?', [classId]);
            if (classes.length === 0) {
                return res.status(404).json({ error: 'Class not found' });
            }

            const [result] = await db.query(
                'INSERT INTO ASSIGNMENT (Title, Description, GivenOn, Deadline, ClassId, CourseId) VALUES (?, ?, ?, ?, ?, ?)',
                [title, description, givenOn, deadline, classId, courseId]
            );
            res.status(201).json({ success: true, id: result.insertId, message: 'Assignment created successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

