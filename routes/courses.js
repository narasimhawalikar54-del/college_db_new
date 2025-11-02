const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/branches - return distinct branches (from STUDENT table or fallback to COURSE.DeptName)
router.get('/branches', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT DISTINCT Branch FROM STUDENT');
        if (rows.length > 0) return res.json(rows.map(r => r.Branch));
    } catch (err) {
        // ignore and try fallback
    }
    try {
        const [rows] = await db.query('SELECT DISTINCT DeptName FROM COURSE');
        return res.json(rows.map(r => r.DeptName));
    } catch (err) {
        console.error('Error fetching branches:', err);
        return res.status(500).json({ error: 'Failed to load branches' });
    }
});

// GET /api/courses?branch=... - return students for a branch or courses if STUDENT missing
router.get('/', async (req, res) => {
    const branch = req.query.branch;
    if (branch) {
        try {
            const [rows] = await db.query('SELECT * FROM STUDENT WHERE Branch = ?', [branch]);
            if (rows.length > 0) return res.json({ students: rows });
            // fallback to courses
        } catch (err) {
            // continue to fallback
        }
        try {
            const [rows] = await db.query('SELECT * FROM COURSE WHERE DeptName = ?', [branch]);
            return res.json({ courses: rows });
        } catch (err) {
            console.error('Error filtering by branch:', err);
            return res.status(500).json({ error: 'Failed to filter by branch' });
        }
    }

    // Default: return all courses
    try {
        const [rows] = await db.query('SELECT * FROM COURSE');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching courses:', err);
        res.status(500).json({ error: 'Failed to load courses' });
    }
});

// GET /api/courses/view - ensure view exists and return its rows
router.get('/view', async (req, res) => {
    try {
        // Check if view exists in current database
        const [viewCheck] = await db.query(
            "SELECT COUNT(*) AS cnt FROM information_schema.views WHERE table_schema = DATABASE() AND table_name = 'StudentCourseView'"
        );
        if (viewCheck[0].cnt === 0) {
            // Ensure required tables exist
            const [studentTbl] = await db.query(
                "SELECT COUNT(*) AS cnt FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'STUDENT'"
            );
            const [courseTbl] = await db.query(
                "SELECT COUNT(*) AS cnt FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'COURSE'"
            );
            if (studentTbl[0].cnt === 0 || courseTbl[0].cnt === 0) {
                return res.status(500).json({ error: 'Required table STUDENT or COURSE does not exist. Create them before using the view.' });
            }

            // Create view (no IF NOT EXISTS to be compatible); if creation fails return error
            const createViewSql = `
                CREATE VIEW StudentCourseView AS
                SELECT
                    s.id AS StudentID,
                    s.Name AS StudentName,
                    s.Branch,
                    c.CourseCode,
                    c.Name AS CourseName,
                    c.Credits,
                    c.DeptName
                FROM STUDENT s
                JOIN COURSE c ON s.Branch = c.DeptName
            `;
            await db.query(createViewSql);
        }

        // Select from view
        const [rows] = await db.query('SELECT * FROM StudentCourseView');
        return res.json(rows);
    } catch (err) {
        console.error('Error creating/loading view:', err);
        return res.status(500).json({ error: err.message || 'Failed to create or load view' });
    }
});

// POST /api/courses - insert course
router.post('/', async (req, res) => {
    const { courseCode, name, credits, deptName } = req.body;
    if (!courseCode || !name) return res.status(400).json({ error: 'courseCode and name are required' });
    try {
        const [result] = await db.query(
            'INSERT INTO COURSE (CourseCode, Name, Credits, DeptName) VALUES (?, ?, ?, ?)',
            [courseCode, name, credits || null, deptName || null]
        );
        res.status(201).json({ success: true, id: result.insertId });
    } catch (err) {
        console.error('Error inserting course:', err);
        res.status(500).json({ error: 'Failed to insert course' });
    }
});

module.exports = router;
