const express = require('express');
const router = express.Router();
const controller = require('../controllers/courseController');
const db = require('../config/db'); // Needed for the custom /view route

// Use controller for basic routes
router.get('/', controller.getAllCourses);
router.post('/', controller.createCourse);

// GET /api/courses/view (for your view.html page)
// This query is now corrected to properly join tables
router.get('/view', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                u.UserId AS StudentID,
                CONCAT(u.FName, ' ', u.LName) AS StudentName,
                cl.Branch,
                c.CourseCode,
                c.Name AS CourseName
            FROM STUDENT s
            JOIN USERS u ON s.UserId = u.UserId
            JOIN CLASS cl ON s.CurrentClassId = cl.ClassId
            JOIN CURRICULUM cu ON cl.ClassId = cu.ClassId
            JOIN COURSE c ON cu.CourseId = c.CourseCode
            ORDER BY StudentName, CourseName;
        `);
        res.json(rows);
    } catch (err) {
        console.error('Error fetching student-course view:', err);
        res.status(500).json({ error: err.message || 'Failed to load view' });
    }
});

module.exports = router;