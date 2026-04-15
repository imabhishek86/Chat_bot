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

/**
 * Perfroms a deep system-wide maintenance cycle.
 */
const runFullMaintenance = async () => {
    try {
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

        // 1. Purge: Delete completed tasks older than 7 days
        const purgeResult = await Assignment.deleteMany({
            status: 'completed',
            completedAt: { $lt: sevenDaysAgo }
        });

        // 2. Audit: Mark pending tasks with past deadlines as 'missed'
        const auditResult = await Assignment.updateMany(
            {
                status: 'pending',
                deadline: { $lt: now }
            },
            { status: 'missed' }
        );

        // 3. Sync: Trigger priority re-calculation
        const syncResult = await syncPriorities();

        return {
            success: true,
            cleaned: purgeResult.deletedCount,
            missed: auditResult.modifiedCount,
            synced: syncResult.count
        };
    } catch (err) {
        console.error('[Maintenance Error]:', err);
        return { success: false, error: err.message };
    }
};

module.exports = {
    syncPriorities,
    initAutomation,
    runFullMaintenance
};
