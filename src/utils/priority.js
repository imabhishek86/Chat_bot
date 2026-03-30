/**
 * Calculates priority based on the deadline.
 * - Within 2 days -> High
 * - Within 5 days -> Medium
 * - Else -> Low
 * 
 * @param {string|Date} deadline - The assignment deadline
 * @returns {string} - 'High', 'Medium', or 'Low'
 */
export const calculatePriority = (deadline) => {
    const now = new Date();
    const dueDate = new Date(deadline);
    
    // Calculate difference in days
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays <= 2) {
        return 'High';
    } else if (diffDays <= 5) {
        return 'Medium';
    } else {
        return 'Low';
    }
};
