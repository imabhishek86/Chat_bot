import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TodayFocus = ({ onFocus }) => {
    const [focusData, setFocusData] = useState({ tasks: [], message: '' });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFocusData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/assignments/today-focus');
                const data = await response.json();
                setFocusData(data);
            } catch (error) {
                console.error("Error fetching Today's Focus:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFocusData();
    }, []);

    if (isLoading) {
        return (
            <div className="glass-panel p-6 rounded-[2rem] border-glass-border animate-pulse mb-8">
                <div className="h-4 bg-glass-border rounded w-1/3 mb-4"></div>
                <div className="h-8 bg-glass-border rounded w-2/3"></div>
            </div>
        );
    }

    if (!focusData.tasks || focusData.tasks.length === 0) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-8 rounded-[2.5rem] border-glass-border bg-glass/5 mb-8 relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                </div>
                <p className="text-text-secondary font-medium italic mb-2 tracking-wide uppercase text-[10px] opacity-60">Status: All Clear</p>
                <h2 className="text-2xl font-black text-text-primary tracking-tight">
                    {focusData.message || "You're all caught up for now!"}
                </h2>
            </motion.div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8 rounded-[2.5rem] border-glass-border bg-glass/10 mb-8 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-solid/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
            
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-2 rounded-full bg-primary-solid animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-solid font-geist">AI Generated Priority</span>
                </div>

                <h2 className="text-3xl font-black text-text-primary mb-2 tracking-tighter leading-none">
                    Today's Focus
                </h2>
                <p className="text-text-secondary text-base mb-8 font-medium">
                    {focusData.message}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {focusData.tasks.map((task, idx) => (
                        <motion.div 
                            key={task._id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-glass/20 border border-glass-border p-5 rounded-[2rem] hover:bg-glass/30 transition-all group cursor-pointer"
                            onClick={() => onFocus(task)}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                    task.priority === 'High' ? 'bg-rose-500/10 text-rose-400' : 
                                    task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                                }`}>
                                    {task.priority}
                                </span>
                                <span className="text-text-secondary/40 text-[9px] font-bold">
                                    {new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </span>
                            </div>
                            <h3 className="text-text-primary font-bold text-sm mb-4 line-clamp-1 group-hover:text-primary-solid transition-colors">
                                {task.title}
                            </h3>
                            <div className="flex items-center gap-2 text-[10px] font-black text-primary-solid uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">
                                Start Session
                                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default TodayFocus;
