import React from 'react';
import { motion } from 'framer-motion';

const MessageBubble = ({ message }) => {
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
        </motion.div>
    );
};

export default MessageBubble;
