import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../ui/LoadingSpinner';

const DeadlineOptimizer = () => {
    const [optimization, setOptimization] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTasks, setSelectedTasks] = useState({});
    const [isApplying, setIsApplying] = useState(false);
    const [applyStatus, setApplyStatus] = useState(null);

    const fetchOptimization = async () => {
        setLoading(true);
        setError(null);
        setApplyStatus(null);
        try {
            const res = await fetch('http://localhost:5000/api/optimizer');
            if (!res.ok) throw new Error('Failed to fetch optimization');
            const data = await res.json();
            setOptimization(data);
            
            // Default select all suggestions
            const initialSelected = {};
            data.delay.forEach(item => {
                initialSelected[item.id] = true;
            });
            setSelectedTasks(initialSelected);
        } catch (err) {
            console.error('Optimizer Fetch Error:', err);
            setError('Could not optimize your schedule. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async () => {
        setIsApplying(true);
        try {
            const shifts = optimization.delay
                .filter(item => selectedTasks[item.id])
                .map(item => ({ id: item.id, newDate: item.suggested_date }));

            if (shifts.length === 0) {
                alert("Please select at least one suggestion to apply.");
                return;
            }

            const res = await fetch('http://localhost:5000/api/optimizer/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ shifts })
            });

            if (res.ok) {
                setApplyStatus('success');
                setTimeout(() => fetchOptimization(), 2000); // Reload data after success
            } else {
                throw new Error('Failed to apply changes');
            }
        } catch (err) {
            console.error('Apply Error:', err);
            alert("Error applying rescheduling. Please try again.");
        } finally {
            setIsApplying(false);
        }
    };

    const toggleTask = (id) => {
        setSelectedTasks(prev => ({ ...prev, [id]: !prev[id] }));
    };

    useEffect(() => {
        fetchOptimization();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 gap-6">
            <LoadingSpinner />
            <p className="text-text-secondary animate-pulse font-black uppercase tracking-[0.3em] text-[10px]">AI Strategist is thinking...</p>
        </div>
    );

    if (error) return (
        <div className="glass-panel p-12 rounded-[3.5rem] text-center shadow-xl">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-400 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 9v4m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <p className="text-text-secondary font-bold mb-6">{error}</p>
            <button 
                onClick={fetchOptimization}
                className="px-8 py-3 rounded-2xl bg-primary-glow text-primary-solid font-black uppercase tracking-widest text-xs border border-primary-solid/20 hover:bg-primary-solid hover:text-white transition-all shadow-lg"
            >
                Retry Optimization
            </button>
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="stack-gap w-full"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                    <h2 className="text-3xl font-black text-text-primary tracking-tight">AI Strategy Optimizer</h2>
                    <p className="text-text-secondary text-sm font-medium mt-1">Smart rescheduling to eliminate deadline paralysis</p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={fetchOptimization}
                        className="group flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 text-text-primary font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all border border-glass-border shadow-sm"
                    >
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:rotate-180 transition-transform duration-500">
                            <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
                        </svg>
                        Refresh Strategy
                    </button>
                    
                    {optimization.delay.length > 0 && (
                        <button 
                            onClick={handleApply}
                            disabled={isApplying || applyStatus === 'success'}
                            className={`group flex items-center gap-2 px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl active:scale-95 ${
                                applyStatus === 'success' 
                                ? 'bg-emerald-500 text-white cursor-default'
                                : 'bg-primary-solid text-white hover:bg-primary-solid/90 shadow-primary-solid/20'
                            }`}
                        >
                            {isApplying ? 'Processing...' : applyStatus === 'success' ? 'Optimization Applied!' : 'Apply Rescheduling'}
                            {applyStatus !== 'success' && (
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3">
                                    <path d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Strategy Overview */}
            <div className="glass-panel p-10 rounded-[3rem] border-primary-solid/20 bg-primary-glow/5 mb-8 relative overflow-hidden shadow-premium">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                    <svg viewBox="0 0 24 24" width="160" height="160" fill="currentColor">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                </div>
                <h3 className="text-[10px] font-black text-primary-solid uppercase tracking-[0.4em] mb-4">Master Strategy</h3>
                <p className="text-xl font-bold text-text-primary italic leading-relaxed relative z-10 max-w-2xl">
                    "{optimization.overall_strategy}"
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Focus Area */}
                <div className="flex flex-col gap-6">
                    <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] px-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        Focus Priorities (Now)
                    </h3>
                    {optimization.focus.length > 0 ? (
                        <div className="space-y-4">
                            {optimization.focus.map((title, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="glass-panel p-7 rounded-[2.5rem] border-emerald-500/20 bg-emerald-500/5 group hover:bg-emerald-500/10 transition-all cursor-default shadow-soft"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-lg">
                                            {idx + 1}
                                        </div>
                                        <span className="text-xl font-bold text-text-primary tracking-tight">{title}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="glass-panel p-10 rounded-[2.5rem] text-center opacity-40 italic text-sm">
                            No immediate emergencies detected.
                        </div>
                    )}
                </div>

                {/* Delay Suggestions */}
                <div className="flex flex-col gap-6">
                    <h3 className="text-[10px] font-black text-amber-400 uppercase tracking-[0.3em] px-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        Strategic Delays (Relax)
                    </h3>
                    {optimization.delay.length > 0 ? (
                        <div className="space-y-4">
                            {optimization.delay.map((item, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    onClick={() => toggleTask(item.id)}
                                    className={`glass-panel p-7 rounded-[2.5rem] border transition-all cursor-pointer shadow-soft group ${
                                        selectedTasks[item.id] 
                                        ? 'border-amber-500/30 bg-amber-500/5' 
                                        : 'border-white/5 bg-white/5 opacity-50 grayscale'
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                                                selectedTasks[item.id] ? 'bg-amber-500 border-amber-500' : 'border-white/20'
                                            }`}>
                                                {selectedTasks[item.id] && (
                                                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="white" strokeWidth="4">
                                                        <path d="M20 6L9 17l-5-5" />
                                                    </svg>
                                                )}
                                            </div>
                                            <h4 className="text-lg font-bold text-text-primary">
                                                {item.title}
                                            </h4>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] font-black text-amber-500 uppercase block mb-1">New Date</span>
                                            <span className="text-xs font-bold text-text-primary tabular-nums">
                                                {new Date(item.suggested_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-text-secondary text-[11px] leading-relaxed opacity-80 italic pl-9">
                                        "{item.reason}"
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="glass-panel p-10 rounded-[2.5rem] text-center opacity-40 italic text-sm">
                            No low-priority tasks detected yet.
                        </div>
                    )}
                </div>
            </div>

            {/* Roadmap */}
            <div className="pb-20">
                <h3 className="text-[10px] font-black text-text-secondary/40 uppercase tracking-[0.4em] mb-8 text-center">Actionable Roadmap</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {optimization.optimized_plan.map((phase, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 + (idx * 0.1) }}
                            className="glass-panel p-8 rounded-[2.5rem] border-glass-border hover:shadow-xl flex flex-col gap-5"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-2xl font-black text-text-primary tabular-nums tracking-tighter">{phase.day}</span>
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--primary-solid)' }} />
                            </div>
                            <p className="text-text-secondary text-xs font-semibold leading-relaxed">
                                {phase.activity}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default DeadlineOptimizer;
