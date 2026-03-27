/**
 * Chatbot Logic Service
 * Handles intent detection and entity extraction (Title, Deadline)
 */

const parseIntent = (message) => {
    const text = message.toLowerCase();
    
    if (text.includes('what') || text.includes('show') || text.includes('list') || text.includes('due')) {
        return 'QUERY_WEEK';
    }
    
    if (text.includes('add') || text.includes('new') || text.includes('remind')) {
        return 'ADD_ASSIGNMENT';
    }

    return 'UNKNOWN';
};

const extractAssignment = (message) => {
    const text = message.toLowerCase();
    
    // Patterns: "Add [Task] on/by/due [Date]"
    const patterns = [
        /add\s+(.+)\s+(?:on|by|next|due)\s+(.+)/i,
        /(.+)\s+(?:on|by|next|due)\s+(.+)/i
    ];

    let title = "";
    let dateStr = "";

    for (const pattern of patterns) {
        const match = message.match(pattern);
        if (match) {
            title = match[1].trim();
            dateStr = match[2].trim().toLowerCase();
            break;
        }
    }

    if (!title) return null;

    // Basic date parsing
    let deadline = new Date();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    if (dateStr.includes('today')) {
        // Today
    } else if (dateStr.includes('tomorrow')) {
        deadline.setDate(deadline.getDate() + 1);
    } else if (days.includes(dateStr)) {
        const targetDay = days.indexOf(dateStr);
        const diff = (targetDay + 7 - deadline.getDay()) % 7;
        deadline.setDate(deadline.getDate() + (diff === 0 ? 7 : diff));
    } else if (dateStr.startsWith('next ')) {
        const day = dateStr.replace('next ', '');
        if (days.includes(day)) {
            const targetDay = days.indexOf(day);
            const diff = (targetDay + 7 - deadline.getDay()) % 7;
            deadline.setDate(deadline.getDate() + (diff === 0 ? 7 : diff) + 7);
        }
    } else {
        const parsed = new Date(dateStr);
        if (!isNaN(parsed)) deadline = parsed;
    }

    return {
        title: title.charAt(0).toUpperCase() + title.slice(1),
        deadline: deadline
    };
};

module.exports = {
    parseIntent,
    extractAssignment
};
