const Assignment = require('../models/Assignment');
const openaiService = require('../services/openaiService');

exports.getStudyPlan = async (req, res) => {
    try {
        const assignments = await Assignment.find({ status: 'pending' }).sort({ deadline: 1 });
        
        const studyPlan = await openaiService.generateStudyPlan(assignments);
        
        res.json(studyPlan);
    } catch (error) {
        console.error('Planner Error:', error);
        res.status(500).json({ error: 'Failed to generate study plan' });
    }
};
