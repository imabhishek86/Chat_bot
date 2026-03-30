const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');

router.get('/this-week', assignmentController.getThisWeekAssignments);
<<<<<<< HEAD
router.patch('/:id/status', assignmentController.updateAssignmentStatus);
router.delete('/:id', assignmentController.deleteAssignment);


=======
>>>>>>> 3dd829c3d0d072bd55ec48ca1d184a87e642a64f

module.exports = router;
