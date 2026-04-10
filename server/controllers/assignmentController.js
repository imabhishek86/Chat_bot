const Assignment = require('../models/Assignment');
const googleCalendarService = require('../services/googleCalendarService');

const getThisWeekAssignments = async (req, res) => {
    try {
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Start of today
        
        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7);
        nextWeek.setHours(23, 59, 59, 999); // End of 7 days from now


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

const updateAssignmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'completed'].includes(status)) {
            return res.status(400).json({ status: 'error', message: 'Invalid status value' });
        }

        const assignment = await Assignment.findById(id);
        if (!assignment) {
            return res.status(404).json({ status: 'error', message: 'Assignment not found' });
        }

        assignment.status = status;
        if (status === 'completed') {
            assignment.completedAt = new Date();
        } else {
            assignment.completedAt = undefined;
        }

        await assignment.save();

        if (!assignment) {
            return res.status(404).json({ status: 'error', message: 'Assignment not found' });
        }

        res.json({
            status: 'success',
            message: 'Status updated successfully',
            assignment
        });
    } catch (error) {
        console.error('Update Status Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};

const deleteAssignment = async (req, res) => {
    try {
        const { id } = req.params;
        const assignment = await Assignment.findByIdAndDelete(id);

        if (!assignment) {
            return res.status(404).json({ status: 'error', message: 'Assignment not found' });
        }

        res.json({
            status: 'success',
            message: 'Assignment deleted successfully'
        });
    } catch (error) {
        console.error('Delete Assignment Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};

const getAISuggestion = async (req, res) => {
    try {
        const pending = await Assignment.find({ status: 'pending' }).sort({ deadline: 1 });
        
        let type = 'normal';
        const now = new Date();
        const twoDaysFromNow = new Date(now.getTime() + (2 * 24 * 60 * 60 * 1000));

        if (pending.some(a => new Date(a.deadline) <= twoDaysFromNow)) {
            type = 'urgent';
        } else if (pending.length > 5) {
            type = 'warning';
        }

        const openaiService = require('../services/openaiService');
        const message = await openaiService.generateCategorizedSuggestion(pending, type.toUpperCase());

        res.json({
            message: message || "Keep up the great work! You're staying on top of your schedule.",
            type: type
        });
    } catch (error) {
        console.error('AI Suggestion API Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};

const getTodayFocus = async (req, res) => {
    try {
        const now = new Date();
        const futureLimit = new Date();
        futureLimit.setDate(now.getDate() + 5);

        // Fetch pending assignments with deadlines within next 5 days
        const pending = await Assignment.find({
            status: 'pending',
            deadline: { $lte: futureLimit }
        });

        // Priority weighting for custom sort
        const priorityWeight = { 'High': 1, 'Medium': 2, 'Low': 3 };

        // Sort by nearest deadline, then priority
        const sorted = pending.sort((a, b) => {
            const deadlineDiff = new Date(a.deadline) - new Date(b.deadline);
            if (deadlineDiff !== 0) return deadlineDiff;
            return (priorityWeight[a.priority] || 2) - (priorityWeight[b.priority] || 2);
        });

        const topTasks = sorted.slice(0, 3);
        const message = topTasks.length > 0 
            ? `Start with ${topTasks[0].title} assignment` 
            : "No urgent focus tasks found. Enjoy your day or plan ahead!";

        res.json({
            tasks: topTasks,
            message: message
        });
    } catch (error) {
        console.error('Focus API Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};

module.exports = {
    getThisWeekAssignments,
    updateAssignmentStatus,
    deleteAssignment,
    getAISuggestion,
    getTodayFocus
};

