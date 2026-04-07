import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FocusMode = ({ task, subTasks, onExit, onComplete }) => {
    const [duration, setDuration] = useState(25); // minutes
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [showSettings, setShowSettings] = useState(true);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(interval);
            setIsActive(false);
            // Optional: Play a sound or show a notification
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    useEffect(() => {
        if (showSettings) {
            setTimeLeft(duration * 60);
        }
    }, [duration, showSettings]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStart = () => {
        setShowSettings(false);
        setIsActive(true);
    };

    const totalSeconds = duration * 60;
    const progress = (timeLeft / totalSeconds);
    const dashOffset = 817 * (1 - progress);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-background/95 backdrop-blur-3xl flex flex-col items-center justify-center p-8 overflow-hidden"
        >
            {/* Immersive Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px] opacity-20 transition-colors duration-1000 ${isActive ? 'bg-primary-solid animate-pulse' : 'bg-violet-500'}`} />
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
            </div>

            <div className="relative z-10 w-full max-w-2xl flex flex-col items-center text-center">
                <motion.button 
                    whileHover={{ scale: 1.1, x: -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onExit}
                    className="absolute -top-16 left-0 text-text-secondary/40 hover:text-text-primary transition-colors flex items-center gap-2 font-black uppercase tracking-widest text-[10px]"
                >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                    Abandon Focus
                </motion.button>

                <AnimatePresence mode="wait">
                    {showSettings ? (
                        <motion.div 
                            key="settings"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.1, opacity: 0 }}
                            className="flex flex-col items-center"
                        >
                            <span className="px-4 py-1 rounded-full bg-primary-glow text-primary-solid text-[10px] font-black uppercase tracking-widest border border-primary-solid/20 mb-6 font-geist">
                                Prepare Phase
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black text-text-primary mb-12 tracking-tight">
                                How long will you focus?
                            </h2>

                            <div className="flex gap-4 mb-12">
                                {[25, 45, 60].map(m => (
                                    <button 
                                        key={m}
                                        onClick={() => setDuration(m)}
                                        className={`w-24 h-24 rounded-3xl border-2 transition-all flex flex-col items-center justify-center group ${duration === m ? 'border-primary-solid bg-primary-solid text-white shadow-2xl shadow-primary-solid/40' : 'border-glass-border bg-glass/20 text-text-secondary hover:border-text-secondary/40'}`}
                                    >
                                        <span className="text-2xl font-black tracking-tighter">{m}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">mins</span>
                                    </button>
                                ))}
                            </div>

                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleStart}
                                className="px-12 py-5 rounded-[2rem] bg-text-primary text-background font-black uppercase tracking-[0.3em] text-sm hover:shadow-2xl transition-all"
                            >
                                Enter Flow State
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="timer"
                            initial={{ scale: 1.1, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="flex flex-col items-center w-full"
                        >
                            <div className="mb-12">
                                <span className="px-4 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 mb-4 inline-block">
                                    Deep Work In Progress
                                </span>
                                <h2 className="text-3xl md:text-4xl font-black text-text-primary tracking-tight">
                                    {task.title}
                                </h2>
                            </div>

                            {/* Timer Circle */}
                            <div className="relative w-80 h-80 flex items-center justify-center mb-12">
                                <svg className="absolute inset-0 w-full h-full -rotate-90">
                                    <circle 
                                        cx="160" cy="160" r="130" 
                                        className="stroke-glass-border fill-none" 
                                        strokeWidth="4"
                                        strokeDasharray="817"
                                    />
                                    <motion.circle 
                                        cx="160" cy="160" r="130" 
                                        className="fill-none transition-all duration-1000" 
                                        style={{ stroke: 'var(--primary-solid)', filter: 'drop-shadow(0 0 8px var(--primary-solid))' }}
                                        strokeWidth="8"
                                        strokeDasharray="817"
                                        animate={{ strokeDashoffset: dashOffset }}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="flex flex-col items-center">
                                    <span className="text-8xl font-black text-text-primary tabular-nums tracking-tighter leading-none mb-4">
                                        {formatTime(timeLeft)}
                                    </span>
                                    <div className="flex gap-4">
                                        <button 
                                            onClick={() => setIsActive(!isActive)}
                                            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-text-primary text-background hover:scale-110 active:scale-90 transition-all"
                                        >
                                            {isActive ? (
                                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
                                            ) : (
                                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="ml-1"><path d="M7 4v16l13-8z" /></svg>
                                            )}
                                        </button>
                                        <button 
                                            onClick={() => setShowSettings(true)}
                                            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-glass/20 text-text-primary border border-glass-border hover:bg-glass/40 transition-all"
                                            title="Reset Timer"
                                        >
                                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full max-w-md space-y-4 text-left">
                                <h3 className="text-[10px] font-black text-text-secondary/40 uppercase tracking-[0.3em] mb-4 text-center">Active Roadmap</h3>
                                <div className="glass-panel p-6 rounded-[2.5rem] border-glass-border bg-glass/10 backdrop-blur-xl">
                                    {subTasks && subTasks.length > 0 ? (
                                        <div className="space-y-4">
                                            {subTasks.map((step, idx) => (
                                                <div key={idx} className="flex items-center gap-4 group cursor-pointer">
                                                    <div className="w-5 h-5 rounded-lg border-2 border-glass-border flex-shrink-0 flex items-center justify-center group-hover:border-primary-solid transition-colors">
                                                        <div className="w-2 h-2 rounded-sm bg-primary-solid opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                    <span className="text-sm font-bold text-text-primary/70 leading-tight group-hover:text-text-primary transition-colors">{step}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-text-secondary/30 italic text-center text-sm py-4">No sub-tasks available. Just focus on the core objective.</p>
                                    )}
                                </div>
                            </div>

                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => onComplete(task.id)}
                                className="mt-12 w-full py-5 rounded-[2rem] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-black uppercase tracking-[0.3em] text-xs hover:bg-emerald-500 hover:text-white transition-all shadow-xl shadow-emerald-500/10"
                            >
                                Mission Accomplished
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default FocusMode;
