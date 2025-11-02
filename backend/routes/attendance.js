const express = require('express');
const router = express.Router();
const controller = require('../controllers/attendanceController');

router.get('/', controller.getAll);
router.get('/student/:studentId', controller.getByStudent);
router.get('/lecture/:lectureId', controller.getByLecture);
router.post('/', controller.create);

module.exports = router;

