import React from 'react';

const ChatHeader = () => {
    return (
        <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)] animate-pulse"></div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/90">AI Assistant</h3>
            </div>
            <div className="flex gap-1">
                {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/5"></div>) }
            </div>

        </div>
    );
};


export default ChatHeader;
