import React from 'react';
import { motion } from 'framer-motion';

const MessageBubble = ({ message }) => {
<<<<<<< HEAD
    const isBot = message.type === 'bot';
    
    return (
        <motion.div 
            initial={{ opacity: 0, x: isBot ? -10 : 10, y: 5 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}
        >
            <div className={`max-w-[85%] px-5 py-3 rounded-[1.5rem] relative ${
                isBot 
                ? 'glass-panel rounded-tl-none text-white/90' 
                : 'bg-violet-600/20 border border-violet-500/30 rounded-tr-none text-white'
            }`}>
                <p className="text-[13px] leading-relaxed font-medium">{message.text}</p>
                <span className="text-[9px] font-bold uppercase tracking-widest opacity-30 mt-2 block">
                    {message.time}
                </span>
            </div>
=======
    const isUser = message.type === 'user';
    
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
        >
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-lg ${
                isUser 
                    ? 'bg-violet-600 text-white rounded-tr-none' 
                    : 'bg-white/10 text-white/90 border border-white/5 rounded-tl-none backdrop-blur-sm'
            }`}>
                {message.text}
            </div>
            {message.time && (
                <span className="text-[10px] text-white/20 mt-1 px-1 font-medium italic">
                    {message.time}
                </span>
            )}
>>>>>>> 3dd829c3d0d072bd55ec48ca1d184a87e642a64f
        </motion.div>
    );
};

<<<<<<< HEAD

=======
>>>>>>> 3dd829c3d0d072bd55ec48ca1d184a87e642a64f
export default MessageBubble;
