const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');

router.get('/this-week', assignmentController.getThisWeekAssignments);

module.exports = router;
