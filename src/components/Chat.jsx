import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Chat.css';
import { parseDeadline } from '../utils/deadlineParser';

const Chat = ({ onAddAssignment, assignments }) => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm StudyFlow. Need help tracking your deadlines?", type: 'bot' },
        { id: 2, text: 'Try saying: "Add History Essay by Friday"', type: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, type: 'user' };
        setMessages(prev => [...prev, userMsg]);

        // Process message
        const parsed = parseDeadline(input);
        
        setTimeout(() => {
            if (parsed) {
                onAddAssignment(parsed);
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: `Got it! I've added "${parsed.title}" to your dashboard. Due on ${new Date(parsed.deadline).toLocaleDateString()}.`,
                    type: 'bot'
                }]);
            } else if (input.toLowerCase().includes('what') && input.toLowerCase().includes('due')) {
                const count = assignments.filter(a => a.status === 'pending').length;
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: count > 0 ? `You have ${count} pending assignments. Check your dashboard!` : "Looking good! No pending assignments.",
                    type: 'bot'
                }]);
            } else {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: "I didn't quite catch that. Try: 'Add [topic] by [date]'",
                    type: 'bot'
                }]);
            }
        }, 600);

        setInput('');
    };

    return (
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="chat-container glass-card"
        >
            <div className="chat-header">
                <div className="status-dot"></div>
                <h3>AI Assistant</h3>
            </div>
            <div className="chat-messages">
                <AnimatePresence initial={false}>
                    {messages.map(msg => (
                        <motion.div 
                            key={msg.id} 
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className={`message-wrapper ${msg.type}`}
                        >
                            <div className="message-bubble">
                                {msg.text}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={chatEndRef} />
            </div>
            <form className="chat-input-area" onSubmit={handleSend}>
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="glass-input"
                />
                <button type="submit" className="send-btn">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                        <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                </button>
            </form>
        </motion.div>
    );
};

export default Chat;
