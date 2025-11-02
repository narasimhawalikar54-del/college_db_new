const db = require('../config/db');

module.exports = {
    // GET /api/attendance
    async getAll(req, res) {
        try {
            const [rows] = await db.query(`
                SELECT a.Status, a.StudentId, a.LectureId,
                       u.FName, u.LName, u.Email,
                       l.Date, l.Time, l.Topic,
                       c.Name as CourseName
                FROM ATTENDANCE a
                INNER JOIN USERS u ON a.StudentId = u.UserId
                INNER JOIN LECTURE l ON a.LectureId = l.LectureId
                INNER JOIN COURSE c ON l.CourseId = c.CourseCode
                ORDER BY l.Date DESC, l.Time DESC
            `);
            res.json(rows);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // GET /api/attendance/student/:studentId
    async getByStudent(req, res) {
        try {
            const [rows] = await db.query(`
                SELECT a.Status, a.StudentId, a.LectureId,
                       l.Date, l.Time, l.Topic,
                       c.Name as CourseName
                FROM ATTENDANCE a
                INNER JOIN LECTURE l ON a.LectureId = l.LectureId
                INNER JOIN COURSE c ON l.CourseId = c.CourseCode
                WHERE a.StudentId = ?
                ORDER BY l.Date DESC, l.Time DESC
            `, [req.params.studentId]);
            res.json(rows);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // GET /api/attendance/lecture/:lectureId
    async getByLecture(req, res) {
        try {
            const [rows] = await db.query(`
                SELECT a.Status, a.StudentId, a.LectureId,
                       u.FName, u.LName, u.Email
                FROM ATTENDANCE a
                INNER JOIN USERS u ON a.StudentId = u.UserId
                WHERE a.LectureId = ?
                ORDER BY u.FName, u.LName
            `, [req.params.lectureId]);
            res.json(rows);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // POST /api/attendance
    async create(req, res) {
        const { status, studentId, lectureId } = req.body;
        
        if (!status || !studentId || !lectureId) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (!['Present', 'Absent', 'Partial'].includes(status)) {
            return res.status(400).json({ error: 'Status must be Present, Absent, or Partial' });
        }

        try {
            // Verify student exists
            const [students] = await db.query('SELECT UserId FROM USERS WHERE UserId = ? AND Role = "Student"', [studentId]);
            if (students.length === 0) {
                return res.status(404).json({ error: 'Student not found' });
            }

            // Verify lecture exists
            const [lectures] = await db.query('SELECT LectureId FROM LECTURE WHERE LectureId = ?', [lectureId]);
            if (lectures.length === 0) {
                return res.status(404).json({ error: 'Lecture not found' });
            }

            // Check if attendance already exists
            const [existing] = await db.query(
                'SELECT * FROM ATTENDANCE WHERE StudentId = ? AND LectureId = ?',
                [studentId, lectureId]
            );
            
            if (existing.length > 0) {
                // Update existing attendance
                await db.query(
                    'UPDATE ATTENDANCE SET Status = ? WHERE StudentId = ? AND LectureId = ?',
                    [status, studentId, lectureId]
                );
                res.json({ success: true, message: 'Attendance updated successfully' });
            } else {
                // Create new attendance
                await db.query(
                    'INSERT INTO ATTENDANCE (Status, StudentId, LectureId) VALUES (?, ?, ?)',
                    [status, studentId, lectureId]
                );
                res.status(201).json({ success: true, message: 'Attendance recorded successfully' });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

