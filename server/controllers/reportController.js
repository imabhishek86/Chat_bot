const Assignment = require('../models/Assignment');
const openaiService = require('../services/openaiService');

exports.getWeeklyReport = async (req, res) => {
    try {
        const now = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);

        // 1. Completed in last 7 days
        const completedCount = await Assignment.countDocuments({
            status: 'completed',
            completedAt: { $gte: sevenDaysAgo }
        });

        // 2. Missed in last 7 days (Pending with deadline in the past 7 days)
        const missedCount = await Assignment.countDocuments({
            status: 'pending',
            deadline: { $lt: now, $gte: sevenDaysAgo }
        });

        // 3. High priority success (Completed High priority tasks vs Total High priority due in last 7 days)
        const totalHighDue = await Assignment.countDocuments({
            priority: 'High',
            deadline: { $lt: now, $gte: sevenDaysAgo }
        });
        const completedHigh = await Assignment.countDocuments({
            priority: 'High',
            status: 'completed',
            completedAt: { $gte: sevenDaysAgo }
        });

        const highPrioritySuccess = totalHighDue > 0 
            ? Math.round((completedHigh / totalHighDue) * 100) 
            : 100;

        // 4. Productivity Score (Simplified version for report)
        const totalDue = await Assignment.countDocuments({
            deadline: { $lt: now, $gte: sevenDaysAgo }
        });
        const score = totalDue > 0 ? Math.round((completedCount / totalDue) * 100) : 100;

        const stats = {
            completed: completedCount,
            missed: missedCount,
            score: Math.min(score, 100),
            highPrioritySuccess
        };

        const narrative = await openaiService.generateWeeklyPerformanceReport(stats);

        res.json({
            stats,
            narrative,
            generatedAt: now
        });
    } catch (error) {
        console.error('Report Controller Error:', error);
        res.status(500).json({ error: 'Failed to generate performance report' });
    }
};
