const Assignment = require('../models/Assignment');
const openaiService = require('../services/openaiService');

exports.getRiskAnalysis = async (req, res) => {
    try {
        const assignments = await Assignment.find({ status: 'pending' });
        const risks = await openaiService.predictRisk(assignments);
        res.json(risks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
