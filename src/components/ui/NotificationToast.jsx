import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationToast = ({ show, urgentTasks, onClose }) => {
    if (!urgentTasks || urgentTasks.length === 0) return null;

    return (
        <AnimatePresence>
            {show && (
                <motion.div 
                    initial={{ opacity: 0, y: -50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-[450px]"
                >
                    <div className="glass-panel p-6 rounded-[2.5rem] border-violet-500/30 shadow-[0_20px_50px_rgba(139,92,246,0.3)] relative overflow-hidden group">
                        {/* Animated background glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-rose-500/10 animate-pulse" />
                        
                        <div className="relative z-10 flex items-start gap-4">
                            <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center flex-shrink-0 animate-bounce">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                    <path d="M12 9v4M12 17h.01" />
                                </svg>
                            </div>
                            
                            <div className="flex-1">
                                <h4 className="text-text-primary font-bold text-sm mb-1">Incoming Deadlines! 🚨</h4>
                                <p className="text-text-secondary text-xs leading-relaxed">
                                    You have <span className="text-rose-400 font-black">{urgentTasks.length} urgent</span> {urgentTasks.length === 1 ? 'task' : 'tasks'} due within 48 hours.
                                </p>
                                
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {urgentTasks.slice(0, 2).map((task, i) => (
                                        <div key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-text-primary/70">
                                            {task.title}
                                        </div>
                                    ))}
                                    {urgentTasks.length > 2 && (
                                        <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-text-primary/40">
                                            +{urgentTasks.length - 2} more
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button 
                                onClick={onClose}
                                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-text-secondary transition-colors"
                            >
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NotificationToast;
