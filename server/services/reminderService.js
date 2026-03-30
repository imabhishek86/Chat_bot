const cron = require('node-cron');
const Assignment = require('../models/Assignment');
const emailService = require('./emailService');
<<<<<<< HEAD
const openaiService = require('./openaiService');
=======
>>>>>>> 3dd829c3d0d072bd55ec48ca1d184a87e642a64f


/**
 * Reminder Service using node-cron
 * Runs every hour to check for assignments due in the next 24 hours.
 */
const initReminders = () => {
<<<<<<< HEAD

=======
    console.log('⏰ Reminder Service Initialized');
>>>>>>> 3dd829c3d0d072bd55ec48ca1d184a87e642a64f

    // Run every hour at minute 0: '0 * * * *'
    cron.schedule('0 * * * *', async () => {
        try {
            const now = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(now.getDate() + 1);

<<<<<<< HEAD
            // Find pending assignments due in the next 24 hours
            const upcomingAssignments = await Assignment.find({
                status: 'pending',
=======
            // Find assignments due in the next 24 hours
            const upcomingAssignments = await Assignment.find({
>>>>>>> 3dd829c3d0d072bd55ec48ca1d184a87e642a64f
                deadline: {
                    $gte: now,
                    $lte: tomorrow
                }
            });

<<<<<<< HEAD
            for (const assignment of upcomingAssignments) {
                // Get AI motivational message
                const aiMessage = await openaiService.generateMotivationalMessage(assignment);
                await emailService.sendReminder(assignment, aiMessage);
            }


=======
            if (upcomingAssignments.length > 0) {
                upcomingAssignments.forEach(assignment => {
                    console.log(`[REMINDER] Reminder: ${assignment.title} is due tomorrow`);
                    emailService.sendReminder(assignment);
                });
            }

>>>>>>> 3dd829c3d0d072bd55ec48ca1d184a87e642a64f
        } catch (error) {
            console.error('❌ Reminder Service Error:', error);
        }
    });
};

module.exports = { initReminders };
