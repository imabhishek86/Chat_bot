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

        const assignment = await Assignment.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

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
        
        let mode = 'MOTIVATIONAL';
        const now = new Date();
        const twoDaysFromNow = new Date(now.getTime() + (2 * 24 * 60 * 60 * 1000));

        if (pending.some(a => new Date(a.deadline) <= twoDaysFromNow)) {
            mode = 'URGENT';
        } else if (pending.length > 5) {
            mode = 'WARNING';
        }

        const openaiService = require('../services/openaiService');
        const suggestion = await openaiService.generateCategorizedSuggestion(pending, mode);

        res.json({
            suggestion: suggestion || "Keep up the great work! You're staying on top of your schedule."
        });
    } catch (error) {
        console.error('AI Suggestion API Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};

module.exports = {
    getThisWeekAssignments,
    updateAssignmentStatus,
    deleteAssignment,
    getAISuggestion
};

