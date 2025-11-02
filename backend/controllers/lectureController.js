const db = require('../config/db');

module.exports = {
    // GET /api/lectures
    async getAll(req, res) {
        try {
            const [rows] = await db.query(`
                SELECT l.LectureId, l.Date, l.Time, l.Duration, l.Topic, l.RoomNo, l.MeetLink,
                       l.CourseId, c.Name as CourseName,
                       l.ClassId, cl.Sem, cl.Branch
                FROM LECTURE l
                INNER JOIN COURSE c ON l.CourseId = c.CourseCode
                INNER JOIN CLASS cl ON l.ClassId = cl.ClassId
                ORDER BY l.Date DESC, l.Time DESC
            `);
            res.json(rows);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // GET /api/lectures/:id
    async getById(req, res) {
        try {
            const [rows] = await db.query(`
                SELECT l.LectureId, l.Date, l.Time, l.Duration, l.Topic, l.RoomNo, l.MeetLink,
                       l.CourseId, c.Name as CourseName,
                       l.ClassId, cl.Sem, cl.Branch
                FROM LECTURE l
                INNER JOIN COURSE c ON l.CourseId = c.CourseCode
                INNER JOIN CLASS cl ON l.ClassId = cl.ClassId
                WHERE l.LectureId = ?
            `, [req.params.id]);
            
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Lecture not found' });
            }
            res.json(rows[0]);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // POST /api/lectures
    async create(req, res) {
        const { date, time, duration, topic, roomNo, meetLink, courseId, classId } = req.body;
        
        if (!date || !time || !duration || !topic || !roomNo || !courseId || !classId) {
            return res.status(400).json({ error: 'All required fields must be provided' });
        }

        if (duration < 1 || duration > 480) {
            return res.status(400).json({ error: 'Duration must be between 1 and 480 minutes' });
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
                'INSERT INTO LECTURE (Date, Time, Duration, Topic, RoomNo, MeetLink, CourseId, ClassId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [date, time, duration, topic, roomNo, meetLink || null, courseId, classId]
            );
            res.status(201).json({ success: true, id: result.insertId, message: 'Lecture created successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

