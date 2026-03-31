const cron = require('node-cron');
const Assignment = require('../models/Assignment');
const emailService = require('./emailService');
const openaiService = require('./openaiService');


/**
 * Reminder Service using node-cron
 * Runs every hour to check for assignments due in the next 24 hours.
 */
const initReminders = () => {




    // Run every hour at minute 0: '0 * * * *'
    cron.schedule('0 * * * *', async () => {
        try {
            const now = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(now.getDate() + 1);

            // Find pending assignments due in the next 24 hours
            const upcomingAssignments = await Assignment.find({
                status: 'pending',
                deadline: {
                    $gte: now,
                    $lte: tomorrow
                }
            });

            for (const assignment of upcomingAssignments) {
                // Get AI motivational message
                const aiMessage = await openaiService.generateMotivationalMessage(assignment);
                await emailService.sendReminder(assignment, aiMessage);
            }

        } catch (error) {
            console.error('❌ Reminder Service Error:', error);
        }
    });
};

module.exports = { initReminders };
