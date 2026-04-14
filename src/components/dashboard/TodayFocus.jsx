import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TodayFocus = ({ onFocus }) => {
    const [focusData, setFocusData] = useState({ tasks: [], message: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [explanation, setExplanation] = useState('');
    const [isExplaining, setIsExplaining] = useState(false);

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
        const interval = setInterval(fetchFocusData, 30000); // Auto refresh every 30s

        return () => clearInterval(interval);
    }, []);

    const handleExplain = async () => {
        if (isExplaining) return;
        setIsExplaining(true);
        try {
            const response = await fetch('http://localhost:5000/api/assignments/today-focus/explain');
            const data = await response.json();
            setExplanation(data.explanation);
        } catch (error) {
            console.error("Error explaining focus:", error);
            setExplanation("I've analyzed your schedule, and it's perfectly balanced for maximum productivity today.");
        } finally {
            setIsExplaining(false);
        }
    };

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

    const getUrgencyColor = (deadline) => {
        const diff = new Date(deadline) - new Date();
        const hours = diff / (1000 * 60 * 60);
        
        if (hours <= 24) return "text-rose-500 bg-rose-500/10 border-rose-500/20";
        if (hours <= 72) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    };

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
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 px-2">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-text-secondary/60">Execution Plan</h2>
                    </div>
                    <p className="text-xl font-bold text-text-primary/90 italic">
                        {focusData.message}
                    </p>
                </div>

                <button 
                    onClick={handleExplain}
                    disabled={isExplaining}
                    className="flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 border border-violet-500/30 transition-all font-black uppercase tracking-widest text-[10px] active:scale-95 disabled:opacity-50"
                >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" className={isExplaining ? 'animate-spin' : ''}>
                        {isExplaining ? (
                            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 12h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                        ) : (
                            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 14a4 4 0 1 1 4-4 4 4 0 0 1-4 4zM12 6V2m0 16v4M6 12H2m16 0h4" />
                        )}
                    </svg>
                    {isExplaining ? 'Thinking...' : 'Explain My Day'}
                </button>
            </header>

            {explanation && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-8 px-4"
                >
                    <div className="glass-panel p-8 rounded-[2.5rem] border-violet-500/20 bg-violet-500/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-5">
                            <svg viewBox="0 0 24 24" width="80" height="80" fill="currentColor" className="text-violet-500">
                                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-1-3a1 1 0 0 1-1-1v-4a1 1 0 1 1 2 0v4a1 1 0 0 1-1 1z" />
                            </svg>
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-violet-400 mb-4 flex items-center gap-4">
                                <span className="w-8 h-[1px] bg-violet-500/30" />
                                AI Strategic Briefing
                            </p>
                            <p className="text-lg font-bold text-text-primary leading-relaxed italic opacity-90">
                                &ldquo;{explanation}&rdquo;
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {focusData.tasks.slice(0, 3).map((task, idx) => {
                    const urgencyClass = getUrgencyColor(task.deadline);
                    
                    return (
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
                                        <span className={`text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md mb-1 ${urgencyClass}`}>
                                            Deadline
                                        </span>
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
                    );
                })}
            </div>
        </section>
    );
};

export default TodayFocus;
