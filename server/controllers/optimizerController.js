const Assignment = require('../models/Assignment');
const openaiService = require('../services/openaiService');

exports.getOptimizedSchedule = async (req, res) => {
    try {
        const assignments = await Assignment.find({ status: 'pending' }).sort({ deadline: 1 });
        
        if (assignments.length === 0) {
            return res.json({ 
                focus: [], 
                delay: [], 
                optimized_plan: [], 
                overall_strategy: "Add some assignments to generate an optimized strategy!" 
            });
        }

        const optimizedPlan = await openaiService.optimizeDeadlines(assignments);
        
        res.json(optimizedPlan);
    } catch (error) {
        console.error('Optimizer Controller Error:', error);
        res.status(500).json({ error: 'Failed to optimize deadlines' });
    }
};

exports.applyOptimization = async (req, res) => {
    try {
        const { shifts } = req.body; // Array of { id, newDate }
        
        if (!shifts || !Array.isArray(shifts)) {
            return res.status(400).json({ error: 'Invalid shifts data provided' });
        }

        const updatePromises = shifts.map(shift => 
            Assignment.findByIdAndUpdate(shift.id, { deadline: shift.newDate })
        );

        await Promise.all(updatePromises);
        
        res.json({ message: 'Optimization applied successfully!', count: shifts.length });
    } catch (error) {
        console.error('Apply Optimization Error:', error);
        res.status(500).json({ error: 'Failed to apply optimization' });
    }
};
