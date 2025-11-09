const express = require('express');
const router = express.Router();
const db = require('../config/db');

// View 1: Student Grade Report (JOINs: 5 tables)
router.get('/student-grades', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                CONCAT(u.FName, ' ', u.LName) AS StudentName,
                c.Name AS CourseName,
                cl.Branch,
                cl.Sem,
                r.CIEMarks,
                r.SEEMarks,
                (r.CIEMarks + r.SEEMarks) AS TotalMarks,
                r.Grade
            FROM REPORT r
            JOIN USERS u ON r.StudentId = u.UserId
            JOIN COURSE c ON r.CourseId = c.CourseCode
            JOIN CLASS cl ON r.ClassId = cl.ClassId
            ORDER BY StudentName, CourseName;
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// View 2: Teacher Schedule (JOINs: 6 tables)
router.get('/teacher-schedules', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                CONCAT(u.FName, ' ', u.LName) AS TeacherName,
                c.Name AS CourseName,
                cl.Branch,
                cl.Sem,
                l.Date,
                l.Time,
                l.Topic,
                l.RoomNo
            FROM CURRICULUM cu
            JOIN USERS u ON cu.AssignedTeacherId = u.UserId
            JOIN COURSE c ON cu.CourseId = c.CourseCode
            JOIN CLASS cl ON cu.ClassId = cl.ClassId
            JOIN LECTURE l ON cu.CourseId = l.CourseId AND cu.ClassId = l.ClassId
            ORDER BY TeacherName, l.Date, l.Time;
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// View 3: Class Assignment Summary (JOINs: 3 tables + Aggregate)
router.get('/class-assignments', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                cl.Branch,
                cl.Sem,
                c.Name AS CourseName,
                COUNT(a.AssignmentId) AS AssignmentCount
            FROM ASSIGNMENT a
            JOIN CLASS cl ON a.ClassId = cl.ClassId
            JOIN COURSE c ON a.CourseId = c.CourseCode
            GROUP BY cl.Branch, cl.Sem, c.Name
            ORDER BY cl.Branch, cl.Sem, AssignmentCount DESC;
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// View 4: Student Attendance Full Record (JOINs: 5 tables)
router.get('/student-attendance', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                CONCAT(u.FName, ' ', u.LName) AS StudentName,
                c.Name AS CourseName,
                l.Topic,
                l.Date,
                a.Status
            FROM ATTENDANCE a
            JOIN USERS u ON a.StudentId = u.UserId
            JOIN LECTURE l ON a.LectureId = l.LectureId
            JOIN COURSE c ON l.CourseId = c.CourseCode
            WHERE u.Role = 'Student'
            ORDER BY StudentName, l.Date DESC;
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// View 5: Course Enrollment Count (JOINs: 4 tables + Aggregate)
router.get('/course-enrollment', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                c.Name AS CourseName,
                c.DeptName,
                COUNT(s.UserId) AS EnrolledStudents
            FROM COURSE c
            JOIN CURRICULUM cu ON c.CourseCode = cu.CourseId
            JOIN CLASS cl ON cu.ClassId = cl.ClassId
            JOIN STUDENT s ON cl.ClassId = s.CurrentClassId
            GROUP BY c.Name, c.DeptName
            ORDER BY EnrolledStudents DESC;
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;