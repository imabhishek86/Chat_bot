import React from 'react';

const ChatStats = ({ assignments }) => {
    const total = assignments?.length || 0;
    const upcoming = assignments
        ?.filter(a => a.status === 'pending')
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .slice(0, 1)[0];

    return (
        <div className="px-6 py-2 bg-white/5 border-b border-white/10 flex justify-between items-center text-[10px] uppercase tracking-wider font-bold text-white/40">
            <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                <span>{total} Assignments Total</span>
            </div>
            {upcoming && (
                <div className="flex items-center gap-2 text-right">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    <span className="truncate max-w-[150px]">Next: {upcoming.title}</span>
                </div>
            )}
        </div>
    );
};

export default ChatStats;
