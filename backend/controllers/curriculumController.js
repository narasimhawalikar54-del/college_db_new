const db = require('../config/db');

module.exports = {
    // GET /api/curriculum
    async getAll(req, res) {
        try {
            const [rows] = await db.query(`
                SELECT cu.ClassId, cu.CourseId, cu.AssignedTeacherId,
                       c.Name as CourseName, c.Credits, c.DeptName,
                       cl.Sem, cl.Branch, cl.Degree,
                       u.FName, u.LName, u.Email as TeacherEmail
                FROM CURRICULUM cu
                INNER JOIN COURSE c ON cu.CourseId = c.CourseCode
                INNER JOIN CLASS cl ON cu.ClassId = cl.ClassId
                INNER JOIN USERS u ON cu.AssignedTeacherId = u.UserId
                ORDER BY cu.ClassId, cu.CourseId
            `);
            res.json(rows);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // GET /api/curriculum/class/:classId
    async getByClass(req, res) {
        try {
            const [rows] = await db.query(`
                SELECT cu.ClassId, cu.CourseId, cu.AssignedTeacherId,
                       c.Name as CourseName, c.Credits,
                       u.FName, u.LName as TeacherName
                FROM CURRICULUM cu
                INNER JOIN COURSE c ON cu.CourseId = c.CourseCode
                INNER JOIN USERS u ON cu.AssignedTeacherId = u.UserId
                WHERE cu.ClassId = ?
                ORDER BY cu.CourseId
            `, [req.params.classId]);
            res.json(rows);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // POST /api/curriculum
    async create(req, res) {
        const { classId, courseId, assignedTeacherId } = req.body;
        
        if (!classId || !courseId || !assignedTeacherId) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        try {
            // Verify class exists
            const [classes] = await db.query('SELECT ClassId FROM CLASS WHERE ClassId = ?', [classId]);
            if (classes.length === 0) {
                return res.status(404).json({ error: 'Class not found' });
            }

            // Verify course exists
            const [courses] = await db.query('SELECT CourseCode FROM COURSE WHERE CourseCode = ?', [courseId]);
            if (courses.length === 0) {
                return res.status(404).json({ error: 'Course not found' });
            }

            // Verify teacher exists
            const [teachers] = await db.query('SELECT UserId FROM USERS WHERE UserId = ? AND Role = "Teacher"', [assignedTeacherId]);
            if (teachers.length === 0) {
                return res.status(404).json({ error: 'Teacher not found' });
            }

            // Check if curriculum already exists
            const [existing] = await db.query(
                'SELECT * FROM CURRICULUM WHERE ClassId = ? AND CourseId = ?',
                [classId, courseId]
            );

            if (existing.length > 0) {
                // Update existing curriculum
                await db.query(
                    'UPDATE CURRICULUM SET AssignedTeacherId = ? WHERE ClassId = ? AND CourseId = ?',
                    [assignedTeacherId, classId, courseId]
                );
                res.json({ success: true, message: 'Curriculum updated successfully' });
            } else {
                // Create new curriculum
                await db.query(
                    'INSERT INTO CURRICULUM (ClassId, CourseId, AssignedTeacherId) VALUES (?, ?, ?)',
                    [classId, courseId, assignedTeacherId]
                );
                res.status(201).json({ success: true, message: 'Curriculum created successfully' });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

