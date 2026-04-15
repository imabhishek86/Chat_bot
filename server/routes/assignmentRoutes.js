const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');

router.get('/this-week', assignmentController.getThisWeekAssignments);
router.get('/suggestion', assignmentController.getAISuggestion);
router.get('/today-focus', assignmentController.getTodayFocus);
router.get('/today-focus/explain', assignmentController.explainTodayFocus);
router.get('/missed', assignmentController.getMissedAssignments);
router.post('/estimate-all', assignmentController.bulkEstimateHours);
router.post('/sync-priorities', assignmentController.triggerPrioritySync);
router.post('/cleanup', assignmentController.cleanupAssignments);
router.patch('/:id/status', assignmentController.updateAssignmentStatus);
router.delete('/:id', assignmentController.deleteAssignment);


module.exports = router;
