import React from 'react';

const ChatInput = ({ input, setInput, onSend }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSend();
    };

    return (
<<<<<<< HEAD
        <form onSubmit={handleSubmit} className="flex gap-3 items-center">
=======
        <form onSubmit={handleSubmit} className="p-4 bg-white/5 border-t border-white/10 flex gap-2">
>>>>>>> 3dd829c3d0d072bd55ec48ca1d184a87e642a64f
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
<<<<<<< HEAD
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
=======
                placeholder="Ask about assignments..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-all focus:ring-1 focus:ring-violet-500/30"
            />
            <button 
                type="submit" 
                disabled={!input.trim()}
                className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed p-3 rounded-xl text-white transition-all shadow-lg active:scale-95"
            >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
>>>>>>> 3dd829c3d0d072bd55ec48ca1d184a87e642a64f
                </svg>
            </button>
        </form>
    );
};

export default ChatInput;
