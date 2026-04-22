import React from 'react';
import { motion } from 'framer-motion';
import { calculatePriority } from '../../utils/priority';

const MoodRecommendations = ({ assignments, mood, onFocus }) => {
    const recommended = React.useMemo(() => {
        if (!assignments.length) return [];

        const pending = assignments.filter(a => a.status === 'pending');
        
        return pending.filter(a => {
            const priority = (a.priority || calculatePriority(a.deadline)).toLowerCase();
            const now = new Date();
            const deadline = new Date(a.deadline);
            const diffHours = (deadline - now) / (1000 * 60 * 60);
            const isUrgent = diffHours > 0 && diffHours < 48;

            if (mood === 'Tired') return priority === 'low';
            if (mood === 'Normal') return priority === 'medium';
            if (mood === 'Focused') return priority === 'high' || isUrgent;
            return false;
        })
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .slice(0, 2);
    }, [assignments, mood]);

    if (!recommended.length) return null;

    const moodConfig = {
        Tired: { color: 'rose', icon: '🔋', text: 'Low-energy wins' },
        Normal: { color: 'sky', icon: '⚖️', text: 'Steady progress' },
        Focused: { color: 'amber', icon: '🎯', text: 'High-impact focus' }
    };

    const config = moodConfig[mood] || moodConfig.Normal;

    return (
        <div className="mb-12">
            <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-3">
                    <span className="text-xl">{config.icon}</span>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary/40">Mood Match</p>
                        <h4 className="text-sm font-black text-text-primary uppercase tracking-widest">Recommended for you</h4>
                    </div>
                </div>
                <div className={`px-4 py-1.5 rounded-full bg-${config.color}-500/10 border border-${config.color}-500/20 text-[10px] font-black uppercase tracking-widest text-${config.color}-400`}>
                    {config.text}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommended.map((task, idx) => (
                    <motion.div
                        key={task.id || task._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`glass-panel p-6 rounded-[2.5rem] relative overflow-hidden group cursor-pointer border-${config.color}-500/10 hover:border-${config.color}-500/30 transition-all shadow-[0_0_20px_rgba(var(--${config.color}-rgb),0)] hover:shadow-[0_0_30px_rgba(var(--${config.color}-rgb),0.05)]`}
                        onClick={() => onFocus(task)}
                    >
                        {/* Glow Effect */}
                        <div className={`absolute -inset-1 bg-gradient-to-r from-${config.color}-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-2xl`} />
                        
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-text-secondary`}>
                                    Scheduled for {new Date(task.deadline).toLocaleDateString()}
                                </div>
                                <div className={`w-8 h-8 rounded-2xl bg-${config.color}-500/10 flex items-center justify-center text-${config.color}-400 group-hover:rotate-12 transition-transform`}>
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M5 12h14m-7-7v14" />
                                    </svg>
                                </div>
                            </div>
                            
                            <h5 className="text-base font-black text-text-primary tracking-tight mb-2 group-hover:text-transparent group-hover:bg-clip-text transition-all" style={{ backgroundImage: `linear-gradient(to right, var(--text-primary), var(--${config.color}-400))` }}>
                                {task.title}
                            </h5>
                            
                            <p className="text-xs text-text-secondary/60 font-medium line-clamp-1 mb-4">
                                {task.description || 'Optimized task for your current vibe.'}
                            </p>

                            <div className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full bg-${config.color}-400`} />
                                <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">Perfect Fit Detected</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default MoodRecommendations;
