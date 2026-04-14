import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from '../ui/LoadingSpinner';

const WeeklyReport = ({ onBack }) => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/reports/weekly');
                const data = await res.json();
                setReport(data);
            } catch (err) {
                console.error('Failed to fetch weekly report:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 gap-6">
            <LoadingSpinner />
            <p className="text-text-secondary animate-pulse font-black uppercase tracking-[0.3em] text-[10px]">AI Strategic Analysis in Progress...</p>
        </div>
    );

    if (!report) return null;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-5xl mx-auto px-4 pb-20"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 border-b border-glass-border pb-12">
                <div>
                    <h2 className="text-5xl font-black text-text-primary tracking-tighter mb-4 italic">Performance Editorial</h2>
                    <div className="flex items-center gap-4">
                        <span className="px-3 py-1 rounded-full bg-primary-solid/10 text-primary-solid text-[10px] font-black uppercase tracking-widest border border-primary-solid/20">
                            Issue No. {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <p className="text-text-secondary text-xs font-bold uppercase tracking-widest opacity-60">AI Intelligence Report</p>
                    </div>
                </div>

                <button 
                    onClick={onBack}
                    className="px-8 py-3 rounded-2xl bg-white/5 text-text-primary font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all border border-glass-border shadow-soft active:scale-95"
                >
                    Return to Center
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left: Stats Column */}
                <div className="flex flex-col gap-8">
                    <div className="glass-panel p-10 rounded-[3rem] border-primary-solid/20 bg-primary-glow/5 relative overflow-hidden">
                        <h3 className="text-[10px] font-black text-primary-solid uppercase tracking-[0.4em] mb-6">Efficiency Score</h3>
                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-7xl font-black text-text-primary tabular-nums tracking-tighter">{report.stats.score}</span>
                            <span className="text-2xl font-black text-primary-solid opacity-50">%</span>
                        </div>
                        <p className="text-text-secondary text-xs leading-relaxed font-medium">Aggregate productivity vs deadlines for the last 7 days.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="glass-panel p-6 rounded-[2.5rem] border-emerald-500/20 bg-emerald-500/5">
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-4">Wins</span>
                            <span className="text-3xl font-black text-text-primary">{report.stats.completed}</span>
                            <p className="text-[10px] text-text-secondary uppercase mt-1">Completed</p>
                        </div>
                        <div className="glass-panel p-6 rounded-[2.5rem] border-rose-500/20 bg-rose-500/5">
                            <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest block mb-4">Slips</span>
                            <span className="text-3xl font-black text-text-primary">{report.stats.missed}</span>
                            <p className="text-[10px] text-text-secondary uppercase mt-1">Past Due</p>
                        </div>
                    </div>
                </div>

                {/* Right: AI Narrative Column */}
                <div className="lg:col-span-2">
                    <div className="glass-panel p-12 rounded-[3.5rem] border-white/5 relative bg-white/[0.02]">
                         <div className="absolute top-0 right-0 p-8 opacity-5">
                            <svg viewBox="0 0 24 24" width="100" height="100" fill="currentColor" className="text-primary-solid">
                                <path d="M11 17a1 1 0 0 1-1-1v-4a1 1 0 0 1 2 0v4a1 1 0 0 1-1 1Zm1-9a1 1 0 1 0-1-1 1 1 0 0 0 1 1Z" />
                                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Z" />
                            </svg>
                        </div>
                        
                        <div className="prose prose-invert max-w-none">
                            <h3 className="text-text-secondary text-[10px] font-black uppercase tracking-[0.5em] mb-12 flex items-center gap-4">
                                <span className="w-8 h-[1px] bg-primary-solid opacity-30" />
                                AI Strategic Review
                            </h3>
                            <div className="text-2xl font-bold text-text-primary leading-relaxed whitespace-pre-line prose-p:mb-8 italic opacity-90">
                                {report.narrative}
                            </div>
                        </div>

                        <div className="mt-16 pt-12 border-t border-glass-border flex justify-between items-center">
                            <div className="flex gap-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary-solid opacity-20" />
                                ))}
                            </div>
                            <span className="text-[10px] font-black text-text-secondary/30 uppercase tracking-[0.3em]">Confidential Study Analytics</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default WeeklyReport;
