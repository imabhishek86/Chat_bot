const express = require('express');
const router = express.Router();
const optimizerController = require('../controllers/optimizerController');

router.get('/', optimizerController.getOptimizedSchedule);

module.exports = router;
