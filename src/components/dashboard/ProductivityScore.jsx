import React from 'react';
import { motion } from 'framer-motion';

const ProductivityScore = ({ assignments }) => {
    const now = new Date();
    
    const completedCount = assignments.filter(a => a.status === 'completed').length;
    const missedCount = assignments.filter(a => a.status === 'pending' && new Date(a.deadline) < now).length;
    
    // Calculate score
    const score = Math.max(0, (completedCount * 10) - (missedCount * 5));
    
    // Badge levels
    const getBadge = (s) => {
        if (s >= 300) return { label: 'Academic Master', icon: '💎', color: 'text-violet-400', bg: 'bg-violet-400/10', border: 'border-violet-400/20' };
        if (s >= 150) return { label: 'High Flyer', icon: '🥇', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' };
        if (s >= 50) return { label: 'Silver Achiever', icon: '🥈', color: 'text-slate-300', bg: 'bg-slate-300/10', border: 'border-slate-300/20' };
        return { label: 'Academic Beginner', icon: '🥉', color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' };
    };
    
    const badge = getBadge(score);
    
    return (
        <div className="glass-panel p-10 rounded-[3.5rem] relative overflow-hidden group shadow-xl hover:shadow-2xl">
            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-20 -mr-16 -mt-16 transition-colors duration-700 ${badge.bg}`} />
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <h3 className="text-xs font-black text-text-secondary uppercase tracking-[0.3em] mb-4">
                        Productivity Score
                    </h3>
                    <div className="flex items-baseline gap-2">
                        <motion.span 
                            key={score}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-6xl font-black text-text-primary tracking-tighter"
                        >
                            {score}
                        </motion.span>
                        <span className="text-text-secondary font-bold text-sm">pts</span>
                    </div>
                </div>
                
                <div className="flex flex-col items-center gap-4">
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl border ${badge.border} ${badge.bg} shadow-lg transition-all duration-500`}
                    >
                        {badge.icon}
                    </motion.div>
                    <div className="text-center">
                        <p className={`font-black text-xs uppercase tracking-widest ${badge.color}`}>
                            {badge.label}
                        </p>
                        <p className="text-text-secondary text-[10px] mt-1 font-medium italic opacity-50">
                            Based on your task habits
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Stats breakdwon footer */}
            <div className="mt-8 pt-6 border-t border-white/5 flex justify-center md:justify-start gap-8">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">+{completedCount * 10} Completion Bonus</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">-{missedCount * 5} Missed Penalties</span>
                </div>
            </div>
        </div>
    );
};

export default ProductivityScore;
