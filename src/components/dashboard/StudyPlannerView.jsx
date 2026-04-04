import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from '../ui/LoadingSpinner';

const StudyPlannerView = () => {
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/planner');
                const data = await res.json();
                setPlan(data);
                setLoading(false);
            } catch (err) {
                console.error('Planner Fetch Error:', err);
                setError('Failed to generate your personalized plan. Try adding some assignments first!');
                setLoading(false);
            }
        };
        fetchPlan();
    }, []);

    if (loading) return <LoadingSpinner />;

    if (error) return (
        <div className="glass-panel p-12 rounded-[3rem] text-center">
            <div className="w-20 h-20 bg-rose-500/10 text-rose-400 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <p className="text-text-secondary font-medium">{error}</p>
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="stack-gap"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                    <h2 className="text-2xl font-black text-text-primary tracking-tight">AI 7-Day Roadmap</h2>
                    <p className="text-text-secondary text-sm font-medium mt-1">Smart distribution based on your deadlines</p>
                </div>
                {plan?.motivation && (
                    <div className="px-4 py-2 rounded-2xl border" style={{ backgroundColor: 'var(--primary-glow)', borderColor: 'var(--glass-border)' }}>
                        <p className="text-[11px] font-black uppercase tracking-widest leading-relaxed italic" style={{ color: 'var(--primary-solid)' }}>
                            "{plan.motivation}"
                        </p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 gap-6">
                {plan?.plan?.map((day, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-panel p-6 rounded-[2.5rem] hover-glow group border-l-4"
                        style={{ borderLeftColor: 'var(--primary-glow)' }}
                    >
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-32 flex-shrink-0">
                                <h3 className="text-lg font-black text-text-primary uppercase tracking-tighter">{day.day}</h3>
                                <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--primary-solid)', opacity: 0.7 }}>{day.focus}</div>
                            </div>
                            
                            <div className="flex-1 space-y-3">
                                {day.tasks && day.tasks.length > 0 ? (
                                    day.tasks.map((task, tidx) => (
                                        <div key={tidx} className="flex items-start gap-3 group/task">
                                            <div className="w-5 h-5 rounded-lg border-2 border-glass-border flex-shrink-0 mt-0.5 group-hover/task:border-emerald-500/50 transition-colors" style={{ groupHover: { borderColor: 'var(--primary-solid)' } }} />
                                            <p className="text-text-primary text-sm font-medium leading-relaxed group-hover/task:translate-x-1 transition-transform">
                                                {task}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-text-secondary/30 text-sm italic">Reserved for flexible review</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default StudyPlannerView;
