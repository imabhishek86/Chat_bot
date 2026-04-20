import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const ChatInput = ({ input, setInput, onSend }) => {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0])
                    .map(result => result.transcript)
                    .join('');
                setInput(transcript);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, [setInput]);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isListening) {
            recognitionRef.current.stop();
        }
        onSend();
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-3 items-center">
            <motion.button 
                type="button"
                onClick={toggleListening}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-11 h-11 flex items-center justify-center rounded-2xl transition-all ${
                    isListening 
                    ? 'bg-red-500/20 text-red-500 border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
                    : 'bg-bg-secondary/50 text-text-secondary hover:text-violet-500 border border-glass-border'
                }`}
                title={isListening ? "Stop listening" : "Start voice input"}
            >
                {isListening ? (
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <circle cx="12" cy="12" r="6" />
                        </svg>
                    </motion.div>
                ) : (
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        <line x1="12" y1="19" x2="12" y2="23" />
                        <line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                )}
            </motion.button>

            <motion.input 
                whileFocus={{ scale: 1.01 }}
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? "Listening..." : "Message StudyFlow..."}
                className="flex-1 bg-bg-secondary/50 border border-glass-border rounded-2xl px-5 py-3 text-sm text-text-primary focus:outline-none focus:border-violet-500/50 transition-all placeholder:text-text-secondary/30 shadow-inner"
            />
            
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={!input.trim()}
                className="w-11 h-11 flex items-center justify-center rounded-2xl bg-violet-600/90 text-white hover:bg-violet-500 transition-all shadow-[0_10px_20px_rgba(139,92,246,0.3)] disabled:opacity-20 disabled:grayscale"
            >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
            </motion.button>
        </form>
    );
};

export default ChatInput;

