import React from 'react';

const ChatInput = ({ input, setInput, onSend }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSend();
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-3 items-center">

            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message StudyFlow..."
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-violet-500/50 transition-all placeholder:text-white/20"
            />
            <button 
                type="submit"
                disabled={!input.trim()}
                className="w-11 h-11 flex items-center justify-center rounded-2xl bg-violet-600/80 text-white hover:bg-violet-500 transition-all active:scale-95 disabled:opacity-20 disabled:grayscale"
            >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />

                </svg>
            </button>
        </form>
    );
};

export default ChatInput;
