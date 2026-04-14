const cron = require('node-cron');
const Assignment = require('../models/Assignment');

/**
 * Recalculates priorities for all pending assignments based on deadline proximity.
 */
const syncPriorities = async () => {
    try {
        const now = new Date();
        const pending = await Assignment.find({ status: 'pending' });

        if (pending.length === 0) return { success: true, message: 'No pending tasks to sync.' };

        const operations = pending.map(task => {
            const deadline = new Date(task.deadline);
            const diffDays = (deadline - now) / (1000 * 60 * 60 * 24);
            
            let newPriority = 'Low';
            if (diffDays <= 2) {
                newPriority = 'High';
            } else if (diffDays <= 5) {
                newPriority = 'Medium';
            }

            return {
                updateOne: {
                    filter: { _id: task._id },
                    update: { priority: newPriority }
                }
            };
        });

        await Assignment.bulkWrite(operations);
        console.log(`[Automation] Synced priorities for ${pending.length} assignments at ${now.toLocaleString()}`);
        return { success: true, count: pending.length };
    } catch (err) {
        console.error('[Automation Error] Could not sync priorities:', err);
        return { success: false, error: err.message };
    }
};

/**
 * Initializes the background automation jobs.
 */
const initAutomation = () => {
    // Run every day at midnight (Server time)
    cron.schedule('0 0 * * *', () => {
        syncPriorities();
    });

    console.log('✅ Automation Service Initialized (Daily Priority Sync)');
};

module.exports = {
    syncPriorities,
    initAutomation
};
