import React from 'react';

const ChatStats = ({ assignments }) => {
    const total = assignments?.length || 0;
    const upcoming = assignments
        ?.filter(a => a.status === 'pending')
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .slice(0, 1)[0];

    return (
        <div className="px-8 py-3 bg-white/[0.02] border-b border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500/50 shadow-[0_0_8px_rgba(139,92,246,0.3)]"></div>
                <span>{total} Tasks</span>
            </div>
            {upcoming && (
                <div className="flex items-center gap-2 max-w-[50%]">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.3)] flex-shrink-0"></div>
                    <span className="truncate">Next: {upcoming.title}</span>

                </div>
            )}
        </div>
    );
};


export default ChatStats;
