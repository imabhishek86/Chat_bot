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
