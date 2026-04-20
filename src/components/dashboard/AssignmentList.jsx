import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AssignmentList = ({ assignments, onDelete, onUpdate }) => {
    const [risks, setRisks] = useState({});
    const [expandedTaskId, setExpandedTaskId] = useState(null);
    const [subTasks, setSubTasks] = useState({});
    const [isBreakingDown, setIsBreakingDown] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editValue, setEditValue] = useState('');

    useEffect(() => {
        const fetchRisks = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/risk');
                const data = await res.json();
                const riskMap = {};
                if (data.risks) {
                    data.risks.forEach(r => { 
                        riskMap[r.id || r._id] = r; 
                    });
                }
                setRisks(riskMap);
            } catch (err) {
                console.error('Risk Fetch Error:', err);
            }
        };
        if (assignments.length > 0) fetchRisks();
    }, [assignments]);

    const handleBreakdown = async (taskId, title) => {
        if (subTasks[taskId]) {
            setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
            return;
        }

        setIsBreakingDown(true);
        try {
            const res = await fetch('http://localhost:5000/api/breakdown', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title })
            });
            const data = await res.json();
            setSubTasks(prev => ({ ...prev, [taskId]: data }));
            setExpandedTaskId(taskId);
        } catch (e) {
            console.error('Breakdown Error:', e);
        } finally {
            setIsBreakingDown(false);
        }
    };

    const handleUpdateEstimate = async (taskId) => {
        try {
            const res = await fetch(`http://localhost:5000/api/assignments/${taskId}/estimate`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estimatedHours: parseFloat(editValue) })
            });
            if (res.ok) {
                onUpdate(taskId, { estimatedHours: parseFloat(editValue) });
                setEditingTaskId(null);
            }
        } catch (e) {
            console.error('Update Estimate Error:', e);
        }
    };

    const sortedAssignments = [...assignments].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    if (assignments.length === 0) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-16 rounded-[2.5rem] text-center flex flex-col items-center gap-6"
            >
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-2 shadow-lg" style={{ backgroundColor: 'var(--primary-glow)', color: 'var(--primary-solid)', borderColor: 'var(--glass-border)' }}>
                    <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-xl mb-2 text-text-primary">No tasks found</h3>
                    <p className="text-text-secondary max-w-xs mx-auto">Your schedule looks clear! Use the AI assistant to add your first assignment.</p>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="responsive-grid">
            <AnimatePresence mode="popLayout">
                {sortedAssignments.map((item, index) => {
                    const priority = item.priority || 'Low';
                    const isCompleted = item.status === 'completed';
                    const isMissed = item.status === 'missed';
                    const risk = risks[item._id || item.id];

                    return (
                        <motion.div 
                            key={item._id || item.id || `task-${index}`} 
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            className={`glass-panel p-7 rounded-[3rem] relative group transition-all duration-500 ${isCompleted ? 'opacity-40 grayscale-[0.8]' : ''} ${isMissed ? 'border-rose-500/10 bg-rose-500/[0.02] opacity-70 shadow-none' : ''} ${risk ? 'border-rose-500/40 shadow-xl shadow-rose-500/5' : 'hover:shadow-2xl'}`}
                        >
                            {risk && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="absolute -top-3 -right-3 px-3 py-1 bg-rose-500 text-white text-[10px] font-black rounded-full shadow-lg z-10 animate-bounce"
                                >
                                    AT RISK 🚨
                                </motion.div>
                            )}

                            <div className="flex justify-between items-start mb-6">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border flex items-center gap-1.5 ${
                                    priority.toLowerCase() === 'high' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.15)] animate-pulse' :
                                    priority.toLowerCase() === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]' :
                                    'bg-sky-500/10 text-sky-400 border-sky-500/20 shadow-[0_0_10px_rgba(14,165,233,0.1)]'
                                }`}>
                                    {priority.toLowerCase() === 'high' && (
                                        <span className="w-1 h-1 rounded-full bg-rose-400" />
                                    )}
                                    {priority}
                                </span>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => onFocus(item, subTasks[item._id || item.id])}
                                        className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-emerald-500/10 hover:text-emerald-400 text-text-secondary/20 transition-all"
                                        title="Focus Mode"
                                    >
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <circle cx="12" cy="12" r="10" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    </button>
                                    <button 
                                        onClick={() => handleBreakdown(item._id || item.id, item.title)}
                                        className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-violet-500/10 hover:text-violet-400 text-text-secondary/20 transition-all"
                                        title="AI Breakdown"
                                        disabled={isBreakingDown}
                                    >
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                                        </svg>
                                    </button>
                                    <button 
                                        onClick={() => onDelete(item.id)} 
                                        className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-rose-500/10 hover:text-rose-400 text-text-secondary/20 transition-all"
                                        title="Delete Assignment"
                                    >
                                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            
                            <h4 className={`text-lg font-bold mb-4 leading-tight transition-all duration-500 ${isCompleted ? 'line-through text-text-secondary/40' : isMissed ? 'text-rose-500/60' : 'text-text-primary'}`}>
                                {item.title}
                                {isMissed && (
                                    <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 mt-2 italic">⚠️ Target Missed</span>
                                )}
                            </h4>

                            {risk && (
                                <p className="text-[10px] font-bold text-rose-400 mb-4 bg-rose-500/5 p-2 rounded-lg border border-rose-500/10 italic">
                                    "{risk.message}"
                                </p>
                            )}

                            <AnimatePresence>
                                {expandedTaskId === (item._id || item.id) && subTasks[item._id || item.id] && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden mb-6"
                                    >
                                        <div className="space-y-3 pt-2">
                                            {subTasks[item._id || item.id].map((step, sIdx) => (
                                                <div key={sIdx} className="flex items-center gap-3 group/step">
                                                    <div className="w-4 h-4 rounded border-2 border-glass-border flex-shrink-0 group-hover/step:border-violet-500/50 transition-colors" />
                                                    <span className="text-[11px] font-medium text-text-primary/70">{step}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            
                            <div className="flex justify-between items-center mt-auto pt-4 border-t border-glass-border">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2 text-text-secondary/60 font-medium text-xs">
                                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-50">
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="M12 6v6l4 2" />
                                        </svg>
                                        {new Date(item.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </div>
                                    {item.estimatedHours > 0 && (
                                        <div 
                                            onClick={() => {
                                                setEditingTaskId(item._id || item.id);
                                                setEditValue(item.estimatedHours.toString());
                                            }}
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-500/5 border border-violet-500/10 text-violet-400 font-black text-[10px] uppercase tracking-widest group-hover:bg-violet-500/10 transition-colors cursor-pointer hover:border-violet-500/30"
                                        >
                                            {editingTaskId === (item._id || item.id) ? (
                                                <input 
                                                    autoFocus
                                                    type="number"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    onBlur={() => handleUpdateEstimate(item._id || item.id)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleUpdateEstimate(item._id || item.id)}
                                                    className="w-12 bg-transparent border-none outline-none text-violet-400 font-black"
                                                />
                                            ) : (
                                              <>
                                                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" className="opacity-70">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <polyline points="12 6 12 12 16 14" />
                                                </svg>
                                                {item.estimatedHours}h Prediction
                                              </>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <button 
                                    className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all active:scale-95 border ${
                                        isCompleted 
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
                                        : 'bg-text-secondary/5 text-text-secondary/60 hover:bg-text-secondary/10 border-glass-border'
                                    }`}
                                    onClick={() => onUpdate(item.id, { status: isCompleted ? 'pending' : 'completed' })}
                                >
                                    {isCompleted ? 'Done' : isMissed ? 'Retry' : 'Mark Done'}
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};

export default AssignmentList;
