import React from 'react';

const ChatHeader = () => {
    return (
        <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            <h3 className="text-lg font-semibold text-white/90">AI Assistant</h3>
        </div>
    );
};

export default ChatHeader;
