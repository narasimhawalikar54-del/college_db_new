const express = require('express');
const router = express.Router();
const controller = require('../controllers/curriculumController');

router.get('/', controller.getAll);
router.get('/class/:classId', controller.getByClass);
router.post('/', controller.create);

module.exports = router;

