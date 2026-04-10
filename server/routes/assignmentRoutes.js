const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');

router.get('/this-week', assignmentController.getThisWeekAssignments);
router.get('/suggestion', assignmentController.getAISuggestion);
router.get('/today-focus', assignmentController.getTodayFocus);
router.patch('/:id/status', assignmentController.updateAssignmentStatus);
router.delete('/:id', assignmentController.deleteAssignment);


module.exports = router;
