const Assignment = require('../models/Assignment');
const googleCalendarService = require('../services/googleCalendarService');

const getThisWeekAssignments = async (req, res) => {
    try {
        // Offline check
        const mongoose = require('mongoose');
        if (mongoose.connection.readyState !== 1) {
            return res.json({ count: 0, assignments: [], offline: true });
        }

        const now = new Date();
        now.setHours(0, 0, 0, 0); // Start of today
        
        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7);
        nextWeek.setHours(23, 59, 59, 999); 

        const assignments = await Assignment.find({
            deadline: { $gte: now, $lte: nextWeek }
        }).sort({ deadline: 1 });

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

        if (assignment.googleEventId) {
            await googleCalendarService.updateEvent(assignment);
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

        if (assignment.googleEventId) {
            await googleCalendarService.deleteEvent(assignment.googleEventId);
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
        // Offline check
        const mongoose = require('mongoose');
        if (mongoose.connection.readyState !== 1) {
            return res.json({ message: "Connect to your database to unlock AI tactical suggestions.", type: 'normal', offline: true });
        }

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
        // Offline check
        const mongoose = require('mongoose');
        if (mongoose.connection.readyState !== 1) {
            return res.json({ tasks: [], message: "Database offline.", offline: true });
        }

        const now = new Date();
        const futureLimit = new Date();
        futureLimit.setDate(now.getDate() + 5);

        const pending = await Assignment.find({
            status: 'pending',
            deadline: { $lte: futureLimit }
        });

        const priorityWeight = { 'High': 1, 'Medium': 2, 'Low': 3 };

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

const bulkEstimateHours = async (req, res) => {
    try {
        const assignments = await Assignment.find({ 
            $or: [
                { estimatedHours: { $exists: false } },
                { estimatedHours: 0 },
                { estimatedHours: null }
            ],
            status: 'pending'
        });

        if (assignments.length === 0) {
            return res.json({ status: 'success', message: 'All tasks already have estimates.', count: 0 });
        }

        const openaiService = require('../services/openaiService');
        const updatePromises = assignments.map(async (a) => {
            const hours = await openaiService.estimateTaskDuration(a.title);
            return Assignment.findByIdAndUpdate(a._id, { estimatedHours: hours });
        });

        await Promise.all(updatePromises);

        res.json({
            status: 'success',
            message: `Successfully estimated time for ${assignments.length} tasks.`,
            count: assignments.length
        });
    } catch (error) {
        console.error('Bulk Estimation Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};

const getMissedAssignments = async (req, res) => {
    try {
        // Offline check
        const mongoose = require('mongoose');
        if (mongoose.connection.readyState !== 1) {
            return res.json({ count: 0, assignments: [], offline: true });
        }

        const now = new Date();
        const missed = await Assignment.find({
            status: 'pending',
            deadline: { $lt: now }
        }).sort({ deadline: 1 });

        res.json({
            count: missed.length,
            assignments: missed
        });
    } catch (error) {
        console.error('Missed Assignments Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};

const triggerPrioritySync = async (req, res) => {
    try {
        const automationService = require('../services/automationService');
        const result = await automationService.syncPriorities();
        
        if (result.success) {
            res.json({ status: 'success', message: `Successfully synced priorities for ${result.count} tasks.` });
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Priority Sync API Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};

const explainTodayFocus = async (req, res) => {
    try {
        // Offline check
        const mongoose = require('mongoose');
        if (mongoose.connection.readyState !== 1) {
            return res.json({ explanation: "Your database is currently offline. Start MongoDB to see your focus briefing!", offline: true });
        }

        const now = new Date();
        const futureLimit = new Date();
        futureLimit.setDate(now.getDate() + 5);

        const pending = await Assignment.find({
            status: 'pending',
            deadline: { $lte: futureLimit }
        });

        const priorityWeight = { 'High': 1, 'Medium': 2, 'Low': 3 };
        const sorted = pending.sort((a, b) => {
            const deadlineDiff = new Date(a.deadline) - new Date(b.deadline);
            if (deadlineDiff !== 0) return deadlineDiff;
            return (priorityWeight[a.priority] || 2) - (priorityWeight[b.priority] || 2);
        });

        const topTasks = sorted.slice(0, 3);
        const openaiService = require('../services/openaiService');
        const explanation = await openaiService.explainFocusSchedule(topTasks);

        res.json({ explanation });
    } catch (error) {
        console.error('Explain Focus API Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};

const cleanupAssignments = async (req, res) => {
    try {
        const automationService = require('../services/automationService');
        const result = await automationService.runFullMaintenance();
        
        if (result.success) {
            const summary = `${result.cleaned} tasks cleaned, ${result.missed} marked missed`;
            res.json({ 
                status: 'success', 
                summary,
                details: result 
            });
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Cleanup API Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};

const updateEstimate = async (req, res) => {
    try {
        const { id } = req.params;
        const { estimatedHours } = req.body;

        if (estimatedHours === undefined || isNaN(estimatedHours)) {
            return res.status(400).json({ status: 'error', message: 'Valid estimatedHours is required' });
        }

        const assignment = await Assignment.findById(id);
        if (!assignment) {
            return res.status(404).json({ status: 'error', message: 'Assignment not found' });
        }

        assignment.estimatedHours = Number(estimatedHours);
        await assignment.save();

        // Sync with Google Calendar
        if (assignment.googleEventId) {
            await googleCalendarService.updateEvent(assignment);
        }

        res.json({
            status: 'success',
            message: 'Estimate updated successfully',
            assignment
        });
    } catch (error) {
        console.error('Update Estimate Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};

module.exports = {
    getThisWeekAssignments,
    updateAssignmentStatus,
    deleteAssignment,
    getAISuggestion,
    getTodayFocus,
    bulkEstimateHours,
    getMissedAssignments,
    triggerPrioritySync,
    explainTodayFocus,
    cleanupAssignments,
    updateEstimate
};
