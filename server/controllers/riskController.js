const Assignment = require('../models/Assignment');
const openaiService = require('../services/openaiService');

exports.getRiskAnalysis = async (req, res) => {
    try {
        const assignments = await Assignment.find({ status: 'pending' });
        
        if (!assignments || assignments.length === 0) {
            return res.json({
                risks: [],
                totalPending: 0,
                status: 'clear',
                message: 'No pending tasks to analyze.'
            });
        }

        const risks = await openaiService.predictRisk(assignments);
        
        res.json({
            risks: risks || [],
            totalPending: assignments.length,
            status: risks.length > 0 ? 'warning' : 'clear',
            lastUpdated: new Date()
        });
    } catch (error) {
        console.error('Risk Analysis Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error', error: error.message });
    }
};
