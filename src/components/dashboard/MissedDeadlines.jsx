import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MissedDeadlines = ({ onUpdate }) => {
    const [missedTasks, setMissedTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMissed = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/assignments/missed');
            const data = await res.json();
            setMissedTasks(data.assignments || []);
        } catch (err) {
            console.error('Failed to fetch missed tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMissed();
        // Refresh every minute to check if new deadlines have elapsed
        const interval = setInterval(fetchMissed, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleComplete = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/api/assignments/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'completed' })
            });
            if (res.ok) {
                setMissedTasks(prev => prev.filter(t => t._id !== id));
                if (onUpdate) onUpdate();
            }
        } catch (err) {
            console.error('Failed to complete missed task:', err);
        }
    };

    if (loading || missedTasks.length === 0) return null;

    return (
        <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-12"
        >
            <div className="glass-panel p-8 rounded-[2.5rem] border-rose-500/30 bg-rose-500/5 relative overflow-hidden shadow-xl shadow-rose-500/5">
                {/* Visual Alert Indicator */}
                <div className="absolute top-0 right-0 p-6 opacity-10">
                    <svg viewBox="0 0 24 24" width="120" height="120" fill="currentColor" className="text-rose-500">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                </div>

                <div className="flex flex-col gap-6 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/20 animate-pulse">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3">
                                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-rose-500 tracking-tight leading-none uppercase italic">Missed Deadlines Detected</h2>
                            <p className="text-rose-400/60 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Immediate action required: Damage Control Mode Active</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <AnimatePresence>
                            {missedTasks.map((task) => (
                                <motion.div 
                                    key={task._id}
                                    layout
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    className="glass-panel p-5 rounded-3xl border-rose-500/20 bg-rose-500/5 flex flex-col justify-between gap-4 group hover:bg-rose-500/10 transition-all border shadow-sm"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-black text-rose-500 px-2 py-0.5 rounded-full bg-rose-500/10 uppercase italic">Missed</span>
                                            <span className="text-[10px] font-black text-rose-400/40 tabular-nums uppercase">
                                                {new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-text-primary tracking-tight leading-tight group-hover:translate-x-1 transition-transform">{task.title}</h3>
                                    </div>

                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleComplete(task._id)}
                                            className="flex-1 py-2.5 rounded-2xl bg-rose-500 text-white font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20 active:scale-95"
                                        >
                                            Complete Now
                                        </button>
                                        <button 
                                            className="px-4 py-2.5 rounded-2xl bg-white/5 text-text-primary font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all border border-glass-border"
                                            title="View Details"
                                        >
                                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3">
                                                <path d="M12 5v14M5 12h14" />
                                            </svg>
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default MissedDeadlines;
