const express = require('express');
const router = express.Router();
const plannerController = require('../controllers/plannerController');

router.get('/', plannerController.getStudyPlan);

module.exports = router;
