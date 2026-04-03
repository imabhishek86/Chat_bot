import { motion } from 'framer-motion';

const ChatInput = ({ input, setInput, onSend }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSend();
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-3 items-center">
            <motion.input 
                whileFocus={{ scale: 1.01 }}
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message StudyFlow..."
                className="flex-1 bg-bg-secondary/50 border border-glass-border rounded-2xl px-5 py-3 text-sm text-text-primary focus:outline-none focus:border-violet-500/50 transition-all placeholder:text-text-secondary/30 shadow-inner"
            />
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={!input.trim()}
                className="w-11 h-11 flex items-center justify-center rounded-2xl bg-violet-600/90 text-white hover:bg-violet-500 transition-all shadow-[0_10px_20px_rgba(139,92,246,0.3)] disabled:opacity-20 disabled:grayscale"
            >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
            </motion.button>
        </form>
    );
};

export default ChatInput;
