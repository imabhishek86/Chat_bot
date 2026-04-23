import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RiskAssessment = ({ assignments }) => {
    const [riskData, setRiskData] = useState({ risks: [], status: 'clear' });
    const [isLoading, setIsLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const calculateLocalRisks = () => {
            if (!assignments || assignments.length === 0) return { risks: [], status: 'clear' };

            const pendingTasks = assignments.filter(a => a.status === 'pending');
            const manyPending = pendingTasks.length > 3;
            
            const risks = pendingTasks.filter(task => {
                const now = new Date();
                const deadline = new Date(task.deadline);
                const diffHours = (deadline - now) / (1000 * 60 * 60);
                
                // Condition: Deadline within 2 days AND many pending
                return diffHours > 0 && diffHours < 48 && manyPending;
            }).map(task => ({
                id: task.id || task._id,
                message: "You may miss this task"
            }));

            return { 
                risks, 
                status: risks.length > 0 ? 'warning' : 'clear' 
            };
        };

        const fetchRisks = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/risk');
                if (!response.ok) throw new Error("Server error");
                const data = await response.json();
                setRiskData(data);
            } catch (error) {
                // Fallback to local calculation if server is down
                console.warn("Using local risk calculation (Offline Mode)");
                setRiskData(calculateLocalRisks());
            } finally {
                setIsLoading(false);
            }
        };

        fetchRisks();
    }, [assignments]);


    if (isLoading) return null;
    if (riskData.risks.length === 0) return null;

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mb-8 overflow-hidden rounded-[2.5rem] border transition-all duration-500 ${
                riskData.status === 'warning' 
                ? 'bg-rose-500/5 border-rose-500/20 shadow-[0_0_40px_-10px_rgba(244,63,94,0.2)]' 
                : 'bg-amber-500/5 border-amber-500/20'
            }`}
        >
            <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-500">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                    <line x1="12" y1="9" x2="12" y2="13" />
                                    <line x1="12" y1="17" x2="12.01" y2="17" />
                                </svg>
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 border-2 border-bg-primary animate-ping" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-text-primary tracking-tight">Predictive Risk Alert</h3>
                            <p className="text-sm font-bold text-rose-400 uppercase tracking-widest opacity-80">
                                {riskData.risks.length} {riskData.risks.length === 1 ? 'Assignment' : 'Assignments'} At Risk
                            </p>
                        </div>
                    </div>

                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="px-6 py-3 rounded-2xl bg-rose-500 text-white font-black uppercase tracking-widest text-[10px] hover:bg-rose-400 transition-colors shadow-lg shadow-rose-500/20"
                    >
                        {isExpanded ? 'Hide Analysis' : 'View Full Report'}
                    </button>
                </div>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {riskData.risks.map((risk, idx) => {
                                    const task = assignments.find(a => a._id === risk.id || a.id === risk.id);
                                    if (!task) return null;

                                    return (
                                        <motion.div 
                                            key={risk.id}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="bg-white/5 border border-white/10 rounded-3xl p-5 hover:bg-white/10 transition-all group"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-rose-400 bg-rose-400/10 px-3 py-1 rounded-full">
                                                    Critical Cluster
                                                </span>
                                                <span className="text-text-secondary/40 text-[10px] font-bold">
                                                    {new Date(task.deadline).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h4 className="text-text-primary font-bold mb-2 group-hover:text-rose-400 transition-colors">
                                                {task.title}
                                            </h4>
                                            <p className="text-xs text-text-secondary leading-relaxed italic">
                                                "{risk.message}"
                                            </p>
                                        </motion.div>
                                    );
                                })}
                            </div>
                            
                            <div className="mt-8 p-6 bg-violet-500/10 border border-violet-500/20 rounded-3xl flex items-start gap-4">
                                <div className="text-violet-400 mt-1">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                        <line x1="12" y1="22.08" x2="12" y2="12" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs font-black text-violet-400 uppercase tracking-widest mb-1">AI Mitigation Strategy</p>
                                    <p className="text-sm text-text-primary/70 leading-relaxed font-medium">
                                        High workload density detected. I recommend tackling the breakdown steps for the nearest deadline first to prevent a resource bottleneck.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            {/* Background scanning effect */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent animate-scan" style={{ animationDuration: '3s' }} />
            </div>
        </motion.div>
    );
};

export default RiskAssessment;
