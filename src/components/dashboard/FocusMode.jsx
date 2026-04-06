import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FocusMode = ({ task, subTasks, onExit, onComplete }) => {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(interval);
            setIsActive(false);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-8 overflow-hidden"
        >
            {/* Ambient Background Gradient */}
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-500/20 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/20 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="relative z-10 w-full max-w-2xl flex flex-col items-center text-center">
                <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onExit}
                    className="absolute -top-12 left-0 text-text-secondary/40 hover:text-text-primary transition-colors flex items-center gap-2 font-black uppercase tracking-widest text-[10px]"
                >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                    Exit Focus
                </motion.button>

                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mb-8"
                >
                    <span className="px-4 py-1 rounded-full bg-primary-glow text-primary-solid text-[10px] font-black uppercase tracking-widest border border-primary-solid/20">
                        Focusing On
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-text-primary mt-6 tracking-tighter leading-none">
                        {task.title}
                    </h2>
                </motion.div>

                {/* Timer Circle */}
                <div className="relative w-72 h-72 flex items-center justify-center mb-12">
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle 
                            cx="144" cy="144" r="130" 
                            className="stroke-glass-border fill-none" 
                            strokeWidth="8"
                        />
                        <motion.circle 
                            cx="144" cy="144" r="130" 
                            className="fill-none" 
                            style={{ stroke: 'var(--primary-solid)' }}
                            strokeWidth="8"
                            strokeDasharray="817"
                            initial={{ strokeDashoffset: 817 }}
                            animate={{ strokeDashoffset: 817 * (timeLeft / (25 * 60)) }}
                            transition={{ duration: 1, ease: "linear" }}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="flex flex-col items-center">
                        <span className="text-7xl font-black text-text-primary tabular-nums tracking-tighter">
                            {formatTime(timeLeft)}
                        </span>
                        <button 
                            onClick={() => setIsActive(!isActive)}
                            className="mt-4 px-8 py-3 rounded-2xl bg-text-primary text-background font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary-solid/20"
                        >
                            {isActive ? 'Pause' : 'Start'}
                        </button>
                    </div>
                </div>

                <div className="w-full space-y-4 text-left">
                    <h3 className="text-[10px] font-black text-text-secondary/40 uppercase tracking-[0.3em] mb-4 text-center">Milestones</h3>
                    <div className="glass-panel p-6 rounded-[2.5rem] border-glass-border bg-glass/20">
                        {subTasks && subTasks.length > 0 ? (
                            <div className="space-y-4">
                                {subTasks.map((step, idx) => (
                                    <div key={idx} className="flex items-center gap-4 group cursor-pointer">
                                        <div className="w-6 h-6 rounded-xl border-2 border-glass-border flex-shrink-0 flex items-center justify-center group-hover:border-primary-solid transition-colors">
                                            <div className="w-2 h-2 rounded-full bg-primary-solid opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <span className="text-sm font-bold text-text-primary/70 leading-tight">{step}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-text-secondary/30 italic text-center text-sm py-4">No sub-tasks available for this assignment.</p>
                        )}
                    </div>
                </div>

                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onComplete(task.id)}
                    className="mt-12 w-full py-5 rounded-[2rem] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-black uppercase tracking-[0.3em] text-xs hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/10"
                >
                    Mark Task Complete
                </motion.button>
            </div>
        </motion.div>
    );
};

export default FocusMode;
