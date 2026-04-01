const express = require('express');
const router = express.Router();
const googleCalendarService = require('../services/googleCalendarService');

router.get('/auth', (req, res) => {
    const url = googleCalendarService.getAuthUrl();
    res.json({ url });
});

router.get('/callback', async (req, res) => {
    const { code } = req.query;
    try {
        await googleCalendarService.saveTokens(code);
        res.send('<h1>Authentication Successful!</h1><p>You can now close this window and return to StudyFlow.</p>');
    } catch (error) {
        res.status(500).send('Authentication Failed: ' + error.message);
    }
});

module.exports = router;
