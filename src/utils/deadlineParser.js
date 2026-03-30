import { calculatePriority } from './priority';

export const parseDeadline = (input) => {
  const text = input.toLowerCase();
  
  // Basic Regex for "Task on/by Date"
  const patterns = [
    /add\s+(.+)\s+(?:on|by|next)\s+(.+)/i,
    /(.+)\s+(?:on|by|next)\s+(.+)/i
  ];

  let task = "";
  let dateStr = "";

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      task = match[1].trim();
      dateStr = match[2].trim();
      break;
    }
  }

  if (!task) return null;

  // Simple date resolution
  let deadline = new Date();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  
  if (dateStr.includes('today')) {
    // Keep today
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

  const deadlineIso = deadline.toISOString();

  return {
    title: task.charAt(0).toUpperCase() + task.slice(1),
    deadline: deadlineIso,
    priority: calculatePriority(deadlineIso),
    originalInput: input
  };
};

