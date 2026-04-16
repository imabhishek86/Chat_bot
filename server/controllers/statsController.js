const Assignment = require('../models/Assignment');

const getStreak = async (req, res) => {
    try {
        // Offline check
        const mongoose = require('mongoose');
        if (mongoose.connection.readyState !== 1) {
            return res.json({ streak: 0, offline: true });
        }

        const completed = await Assignment.find({ 
            status: 'completed',
            completedAt: { $exists: true }
        }).sort({ completedAt: -1 });

        if (completed.length === 0) {
            return res.json({ streak: 0 });
        }

        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        // Check if user completed something today or yesterday to continue streak
        const completionDates = [...new Set(completed.map(a => {
            const d = new Date(a.completedAt);
            d.setHours(0, 0, 0, 0);
            return d.getTime();
        }))];

        let checkDate = new Date(currentDate);
        
        // If nothing today, check if something yesterday
        if (!completionDates.includes(checkDate.getTime())) {
            checkDate.setDate(checkDate.getDate() - 1);
            if (!completionDates.includes(checkDate.getTime())) {
                return res.json({ streak: 0 });
            }
        }

        // Count backwards
        while (completionDates.includes(checkDate.getTime())) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        }

        res.json({ streak });
    } catch (error) {
        console.error('Streak Calculation Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};

module.exports = {
    getStreak
};
