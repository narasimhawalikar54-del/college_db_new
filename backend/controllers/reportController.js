const db = require('../config/db');

module.exports = {
    // GET /api/reports
    async getAll(req, res) {
        try {
            const [rows] = await db.query(`
                SELECT r.SEEMarks, r.CIEMarks, r.Grade, r.Remark,
                       r.CourseId, r.ClassId, r.StudentId,
                       c.Name as CourseName,
                       cl.Sem, cl.Branch,
                       u.FName, u.LName, u.Email
                FROM REPORT r
                INNER JOIN COURSE c ON r.CourseId = c.CourseCode
                INNER JOIN CLASS cl ON r.ClassId = cl.ClassId
                INNER JOIN USERS u ON r.StudentId = u.UserId
                ORDER BY r.CourseId, r.StudentId
            `);
            res.json(rows);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // GET /api/reports/student/:studentId
    async getByStudent(req, res) {
        try {
            const [rows] = await db.query(`
                SELECT r.SEEMarks, r.CIEMarks, r.Grade, r.Remark,
                       r.CourseId, r.ClassId,
                       c.Name as CourseName,
                       cl.Sem, cl.Branch
                FROM REPORT r
                INNER JOIN COURSE c ON r.CourseId = c.CourseCode
                INNER JOIN CLASS cl ON r.ClassId = cl.ClassId
                WHERE r.StudentId = ?
                ORDER BY r.CourseId
            `, [req.params.studentId]);
            res.json(rows);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // POST /api/reports
    async create(req, res) {
        const { seeMarks, cieMarks, grade, remark, courseId, classId, studentId } = req.body;
        
        if (!seeMarks || cieMarks === undefined || !grade || !courseId || !classId || !studentId) {
            return res.status(400).json({ error: 'All required fields must be provided' });
        }

        if (seeMarks < 0 || seeMarks > 100 || cieMarks < 0 || cieMarks > 100) {
            return res.status(400).json({ error: 'Marks must be between 0 and 100' });
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

            // Verify student exists
            const [students] = await db.query('SELECT UserId FROM USERS WHERE UserId = ? AND Role = "Student"', [studentId]);
            if (students.length === 0) {
                return res.status(404).json({ error: 'Student not found' });
            }

            // Check if report already exists
            const [existing] = await db.query(
                'SELECT * FROM REPORT WHERE CourseId = ? AND ClassId = ? AND StudentId = ?',
                [courseId, classId, studentId]
            );

            if (existing.length > 0) {
                // Update existing report
                await db.query(
                    'UPDATE REPORT SET SEEMarks = ?, CIEMarks = ?, Grade = ?, Remark = ? WHERE CourseId = ? AND ClassId = ? AND StudentId = ?',
                    [seeMarks, cieMarks, grade, remark || null, courseId, classId, studentId]
                );
                res.json({ success: true, message: 'Report updated successfully' });
            } else {
                // Create new report
                await db.query(
                    'INSERT INTO REPORT (SEEMarks, CIEMarks, Grade, Remark, CourseId, ClassId, StudentId) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [seeMarks, cieMarks, grade, remark || null, courseId, classId, studentId]
                );
                res.status(201).json({ success: true, message: 'Report created successfully' });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

