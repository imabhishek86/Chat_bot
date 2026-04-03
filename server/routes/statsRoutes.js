const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

router.get('/streak', statsController.getStreak);

module.exports = router;
