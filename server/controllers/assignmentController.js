const Assignment = require('../models/Assignment');

const getThisWeekAssignments = async (req, res) => {
    try {
        const now = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7);

        const assignments = await Assignment.find({
            deadline: { $gte: now, $lte: nextWeek }
        }).sort({ deadline: 1 }); // Sort by nearest deadline

        res.json({
            count: assignments.length,
            assignments: assignments
        });
    } catch (error) {
        console.error('Weekly Assignments Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};

module.exports = {
    getThisWeekAssignments
};
