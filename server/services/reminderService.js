const cron = require('node-cron');
const Assignment = require('../models/Assignment');
const emailService = require('./emailService');


/**
 * Reminder Service using node-cron
 * Runs every hour to check for assignments due in the next 24 hours.
 */
const initReminders = () => {
    console.log('⏰ Reminder Service Initialized');

    // Run every hour at minute 0: '0 * * * *'
    cron.schedule('0 * * * *', async () => {
        try {
            const now = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(now.getDate() + 1);

            // Find assignments due in the next 24 hours
            const upcomingAssignments = await Assignment.find({
                deadline: {
                    $gte: now,
                    $lte: tomorrow
                }
            });

            if (upcomingAssignments.length > 0) {
                upcomingAssignments.forEach(assignment => {
                    console.log(`[REMINDER] Reminder: ${assignment.title} is due tomorrow`);
                    emailService.sendReminder(assignment);
                });
            }

        } catch (error) {
            console.error('❌ Reminder Service Error:', error);
        }
    });
};

module.exports = { initReminders };
