const Assignment = require('../models/Assignment');
const chatbotService = require('../services/chatbotService');

const handleChat = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ status: 'error', message: 'Message is required' });
        }

        const intent = chatbotService.parseIntent(message);

        if (intent === 'ADD_ASSIGNMENT') {
<<<<<<< HEAD
            const extracted = await chatbotService.extractAssignment(message);

=======
            const extracted = chatbotService.extractAssignment(message);
>>>>>>> 3dd829c3d0d072bd55ec48ca1d184a87e642a64f
            
            if (!extracted) {
                return res.json({ 
                    reply: "I couldn't quite catch the task details. Try: 'Add Math Homework on Friday'" 
                });
            }

            const newAssignment = await Assignment.create({
                title: extracted.title,
                deadline: extracted.deadline
            });

<<<<<<< HEAD
            return res.status(201).json({
                message: "Assignment added successfully",
                assignment: newAssignment,
                // Including reply for frontend compatibility
                reply: `✅ Added assignment: "${newAssignment.title}" for ${newAssignment.deadline.toDateString()}`
            });
        }


=======

            return res.status(201).json({
                reply: `✅ Added assignment: "${newAssignment.title}" for ${newAssignment.deadline.toDateString()}`,
                newAssignment: newAssignment
            });
        }

>>>>>>> 3dd829c3d0d072bd55ec48ca1d184a87e642a64f
        if (intent === 'QUERY_WEEK') {
            const now = new Date();
            const nextWeek = new Date();
            nextWeek.setDate(now.getDate() + 7);

            const assignments = await Assignment.find({
                deadline: { $gte: now, $lte: nextWeek }
            }).sort({ deadline: 1 });

            if (assignments.length === 0) {
                return res.json({ reply: "You don't have any assignments due this week! 🎉" });
            }

            const list = assignments.map(a => `- ${a.title} (${a.deadline.toDateString()})`).join('\n');
            return res.json({
                reply: `Current tasks for this week:\n${list}`
            });
        }

        return res.json({ 
            reply: "I'm not sure how to help with that. Try asking me to add an assignment or show what's due this week." 
        });

    } catch (error) {
<<<<<<< HEAD
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }



=======
        console.error('Chat Controller Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
>>>>>>> 3dd829c3d0d072bd55ec48ca1d184a87e642a64f
};

module.exports = {
    handleChat
};
