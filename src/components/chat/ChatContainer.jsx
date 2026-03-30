import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatHeader from './ChatHeader';
import ChatStats from './ChatStats';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';

const ChatContainer = ({ assignments, onAddAssignment }) => {
<<<<<<< HEAD

=======
>>>>>>> 3dd829c3d0d072bd55ec48ca1d184a87e642a64f
    const getTimestamp = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('chat_messages');
        if (saved) return JSON.parse(saved);
        return [
            { id: 1, text: "Hello! I'm StudyFlow. Need help tracking your deadlines?", type: 'bot', time: getTimestamp() },
            { id: 2, text: 'Try saying: "Add History Essay by Friday"', type: 'bot', time: getTimestamp() }
        ];
    });

    useEffect(() => {
        localStorage.setItem('chat_messages', JSON.stringify(messages));
    }, [messages]);

    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    const suggestions = [
        "Add assignment",
        "What's due this week?"
    ];

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isTyping]);

    const handleSend = async (overrideInput) => {
        const messageText = (overrideInput || input).trim();
        if (!messageText) return;

        const userMsg = { 
            id: Date.now(), 
            text: messageText, 
            type: 'user', 
            time: getTimestamp() 
        };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        setIsTyping(true);

        try {
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: messageText }),
            });

            if (!response.ok) throw new Error('API Request Failed');

            const data = await response.json();
            
<<<<<<< HEAD
            if (data.assignment && onAddAssignment) {
                onAddAssignment(data.assignment);
            }


=======
            if (data.newAssignment && onAddAssignment) {
                onAddAssignment(data.newAssignment);
            }

>>>>>>> 3dd829c3d0d072bd55ec48ca1d184a87e642a64f
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: data.reply || "I've processed your request.",
                type: 'bot',
                time: getTimestamp()
            }]);
        } catch (error) {
            console.error('Chat API Error:', error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "⚠️ Connection error. Please check if the backend server is running.",
                type: 'bot',
                time: getTimestamp()
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
<<<<<<< HEAD
        <div className="flex flex-col h-[650px] w-full glass-panel rounded-[2.5rem] overflow-hidden">
            <ChatHeader />
            <ChatStats assignments={assignments} />

            <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth scrollbar-hide">
=======
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col h-[600px] w-full max-w-md mx-auto bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
        >
            <ChatHeader />
            <ChatStats assignments={assignments} />

            <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth scrollbar-hide">
>>>>>>> 3dd829c3d0d072bd55ec48ca1d184a87e642a64f
                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} />
                    ))}
                    
                    {isTyping && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex justify-start"
                        >
<<<<<<< HEAD
                            <div className="glass-pill px-5 py-3 rounded-3xl rounded-tl-none flex gap-2 items-center">
                                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-violet-400 rounded-full"></motion.span>
                                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-violet-400 rounded-full"></motion.span>
                                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-violet-400 rounded-full"></motion.span>
=======
                            <div className="bg-white/10 text-white/90 border border-white/5 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1.5 items-center backdrop-blur-sm">
                                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-white/50 rounded-full"></motion.span>
                                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-white/50 rounded-full"></motion.span>
                                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-white/50 rounded-full"></motion.span>
>>>>>>> 3dd829c3d0d072bd55ec48ca1d184a87e642a64f
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
<<<<<<< HEAD
                <div ref={chatEndRef} className="h-4" />
            </div>

            {/* Suggestions */}
            <div className="px-6 pb-4 flex gap-2 overflow-x-auto scrollbar-hide">
=======
                <div ref={chatEndRef} className="h-2" />
            </div>

            {/* Suggestions */}
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
>>>>>>> 3dd829c3d0d072bd55ec48ca1d184a87e642a64f
                {suggestions.map((suggestion) => (
                    <button
                        key={suggestion}
                        onClick={() => handleSend(suggestion)}
<<<<<<< HEAD
                        className="whitespace-nowrap px-4 py-2 rounded-full glass-pill text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white/80 transition-all active:scale-95"
=======
                        className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white/40 hover:bg-white/10 hover:text-white/60 transition-all active:scale-95"
>>>>>>> 3dd829c3d0d072bd55ec48ca1d184a87e642a64f
                    >
                        {suggestion}
                    </button>
                ))}
            </div>

<<<<<<< HEAD
            <div className="p-4 bg-white/5 border-t border-white/5">
                <ChatInput 
                    input={input} 
                    setInput={setInput} 
                    onSend={handleSend} 
                />
            </div>
        </div>
    );
};


=======
            <ChatInput 
                input={input} 
                setInput={setInput} 
                onSend={handleSend} 
            />
        </motion.div>
    );
};

>>>>>>> 3dd829c3d0d072bd55ec48ca1d184a87e642a64f
export default ChatContainer;
