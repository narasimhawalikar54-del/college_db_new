const express = require('express');
const router = express.Router();
const controller = require('../controllers/reportController');

router.get('/', controller.getAll);
router.get('/student/:studentId', controller.getByStudent);
router.post('/', controller.create);

module.exports = router;

