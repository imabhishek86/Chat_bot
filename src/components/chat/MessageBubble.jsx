import React from 'react';
import { motion } from 'framer-motion';

const MessageBubble = ({ message }) => {
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

        </motion.div>
    );
};


export default MessageBubble;
