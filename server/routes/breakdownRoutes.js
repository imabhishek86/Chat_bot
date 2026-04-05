const express = require('express');
const router = express.Router();
const openaiService = require('../services/openaiService');

router.post('/', async (req, res) => {
    try {
        const { title } = req.body;
        const steps = await openaiService.breakDownTask(title);
        res.json(steps);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
