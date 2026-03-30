<<<<<<< HEAD
const openaiService = require('./openaiService');
=======
/**
 * Chatbot Logic Service
 * Handles intent detection and entity extraction (Title, Deadline)
 */
>>>>>>> 3dd829c3d0d072bd55ec48ca1d184a87e642a64f

const parseIntent = (message) => {
    const text = message.toLowerCase();
    
<<<<<<< HEAD
    if (text.includes('what') || text.includes('show') || text.includes('list') || text.includes('due') || text.includes('week')) {
        return 'QUERY_WEEK';
    }
    
    if (text.includes('add') || text.includes('new') || text.includes('remind') || text.includes('track')) {
=======
    if (text.includes('what') || text.includes('show') || text.includes('list') || text.includes('due')) {
        return 'QUERY_WEEK';
    }
    
    if (text.includes('add') || text.includes('new') || text.includes('remind')) {
>>>>>>> 3dd829c3d0d072bd55ec48ca1d184a87e642a64f
        return 'ADD_ASSIGNMENT';
    }

    return 'UNKNOWN';
};

<<<<<<< HEAD
const extractAssignmentRegex = (message) => {
    // Patterns: "Add [Task] on/by/due [Date]"
    const patterns = [
        /add\s+(.+)\s+(?:on|by|next|due)\s+(.+)/i,
        /remind\s+me\s+to\s+(.+)\s+(?:on|by|next|due)\s+(.+)/i,
=======
const extractAssignment = (message) => {
    const text = message.toLowerCase();
    
    // Patterns: "Add [Task] on/by/due [Date]"
    const patterns = [
        /add\s+(.+)\s+(?:on|by|next|due)\s+(.+)/i,
>>>>>>> 3dd829c3d0d072bd55ec48ca1d184a87e642a64f
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

<<<<<<< HEAD
=======
    // Basic date parsing
>>>>>>> 3dd829c3d0d072bd55ec48ca1d184a87e642a64f
    let deadline = new Date();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    if (dateStr.includes('today')) {
<<<<<<< HEAD
        // Use current date
=======
        // Today
>>>>>>> 3dd829c3d0d072bd55ec48ca1d184a87e642a64f
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

<<<<<<< HEAD
const extractAssignment = async (message) => {
    const aiResult = await openaiService.extractAssignmentWithAI(message);
    
    if (aiResult) {
        // Ensure title is formatted and deadline is a Date object for the model
        return {
            title: aiResult.title.charAt(0).toUpperCase() + aiResult.title.slice(1),
            deadline: new Date(aiResult.deadline)
        };
    }

    return extractAssignmentRegex(message);
};


=======
>>>>>>> 3dd829c3d0d072bd55ec48ca1d184a87e642a64f
module.exports = {
    parseIntent,
    extractAssignment
};
<<<<<<< HEAD

=======
>>>>>>> 3dd829c3d0d072bd55ec48ca1d184a87e642a64f
