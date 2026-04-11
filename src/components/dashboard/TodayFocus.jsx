import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

    const labels = ["Do First", "Next", "Later"];
    const styles = [
        "bg-linear-to-br from-violet-600/20 to-indigo-600/20 border-violet-500/30 shadow-[0_0_20px_-5px_rgba(139,92,246,0.3)] ring-1 ring-violet-500/20",
        "bg-white/5 border-white/10 hover:bg-white/10",
        "bg-white/5 border-white/10 opacity-70 hover:opacity-100"
    ];

    const badgeStyles = [
        "bg-violet-500 text-white shadow-lg shadow-violet-500/20",
        "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30",
        "bg-slate-500/20 text-slate-400 border border-slate-500/30"
    ];

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-48 rounded-3xl bg-white/5 animate-pulse border border-white/10" />
                ))}
            </div>
        );
    }

    if (!focusData.tasks || focusData.tasks.length === 0) return null;

    return (
        <section className="mb-12">
            <header className="flex flex-col gap-2 mb-8 px-2">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-text-secondary/60">Execution Plan</h2>
                </div>
                <p className="text-xl font-bold text-text-primary/90 italic">
                    {focusData.message}
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {focusData.tasks.slice(0, 3).map((task, idx) => (
                    <motion.div 
                        key={task._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.15, duration: 0.5, ease: "easeOut" }}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        onClick={() => onFocus(task)}
                        className={`group relative overflow-hidden rounded-[2rem] border p-7 transition-all cursor-pointer backdrop-blur-xl ${styles[idx]}`}
                    >
                        {/* Background subtle glow for the first card */}
                        {idx === 0 && (
                            <div className="absolute -right-12 -top-12 w-40 h-40 bg-violet-500/20 rounded-full blur-[60px] pointer-events-none" />
                        )}

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex justify-between items-center mb-6">
                                <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full ${badgeStyles[idx]}`}>
                                    {labels[idx]}
                                </span>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-bold text-text-secondary/50 uppercase tracking-tighter">Deadline</span>
                                    <span className="text-xs font-black text-text-primary/70">
                                        {new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-text-primary mb-6 leading-tight group-hover:text-violet-400 transition-colors line-clamp-2">
                                {task.title}
                            </h3>

                            <div className="mt-auto flex items-center justify-between">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${
                                    task.priority === 'High' ? 'text-rose-400' : 
                                    task.priority === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                                }`}>
                                    {task.priority} Priority
                                </span>
                                
                                <div className="flex items-center gap-2 text-[10px] font-black text-violet-400 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                                    Focus
                                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default TodayFocus;
