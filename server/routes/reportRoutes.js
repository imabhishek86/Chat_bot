const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/weekly', reportController.getWeeklyReport);

module.exports = router;
