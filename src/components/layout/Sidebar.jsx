import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculatePriority } from '../../utils/priority';



const Sidebar = ({ assignments, mood, onMoodChange }) => {
    const [streak, setStreak] = React.useState(0);

    const moods = [
        { id: 'Tired', label: 'Tired', emoji: '😴', color: 'rose' },
        { id: 'Normal', label: 'Normal', emoji: '😊', color: 'sky' },
        { id: 'Focused', label: 'Focused', emoji: '⚡', color: 'amber' }
    ];

    React.useEffect(() => {
        const fetchStreak = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/stats/streak');
                if (!res.ok) throw new Error();
                const data = await res.json();
                setStreak(data.streak || 0);
            } catch (e) {
                // Silently fallback to 0 in unconnected mode
                setStreak(0);
            }
        };
        fetchStreak();
    }, [assignments]);

    const stats = React.useMemo(() => {
        const total = assignments.length;
        const pending = assignments.filter(a => a.status === 'pending').length;
        const completed = assignments.filter(a => a.status === 'completed').length;
        const missed = assignments.filter(a => a.status === 'missed').length;
        
        const urgent = assignments.filter(a => {
            const p = a.priority || calculatePriority(a.deadline);
            return p.toLowerCase() === 'high' && a.status === 'pending';
        }).length;

        return { total, pending, completed, missed, urgent };
    }, [assignments]);

    return (
        <aside className="w-full xl:w-[320px] flex flex-col gap-8">
            <div className="px-4 space-y-8">
                {/* Mood Selector Section */}
                <div>
                    <h3 className="text-[10px] font-black text-text-secondary/40 uppercase tracking-[0.4em] mb-4">
                        Daily Vibe
                    </h3>
                    <div className="flex gap-3">
                        {moods.map((m) => (
                            <button
                                key={m.id}
                                onClick={() => onMoodChange(m.id)}
                                className={`flex-1 glass-panel p-4 rounded-3xl flex flex-col items-center gap-2 transition-all duration-300 border ${
                                    mood === m.id 
                                    ? `bg-${m.color}-500/10 border-${m.color}-500/40 shadow-[0_0_20px_rgba(var(--${m.color}-rgb),0.1)]` 
                                    : 'border-white/5 opacity-40 hover:opacity-100 hover:border-white/10'
                                }`}
                            >
                                <span className="text-2xl">{m.emoji}</span>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${mood === m.id ? `text-${m.color}-400` : 'text-text-secondary'}`}>
                                    {m.label}
                                </span>
                                {mood === m.id && (
                                    <div className={`w-1 h-1 rounded-full bg-${m.color}-400 animate-pulse`} />
                                )}
                            </button>
                        ))}
                    </div>
                    <div className="mt-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={mood}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`p-4 rounded-3xl border transition-all duration-500 overflow-hidden relative group/msg ${
                                    mood === 'Tired' ? 'bg-rose-500/5 border-rose-500/10' :
                                    mood === 'Focused' ? 'bg-amber-500/5 border-amber-500/10' :
                                    'bg-sky-500/5 border-sky-500/10'
                                }`}
                            >
                                <div className="flex items-center gap-3 relative z-10">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                                        mood === 'Tired' ? 'bg-rose-500/10 text-rose-400' :
                                        mood === 'Focused' ? 'bg-amber-500/10 text-amber-400' :
                                        'bg-sky-500/10 text-sky-400'
                                    }`}>
                                        {mood === 'Tired' ? '💪' : mood === 'Focused' ? '🎯' : '🌱'}
                                    </div>
                                    <p className={`text-[11px] font-bold italic ${
                                        mood === 'Tired' ? 'text-rose-400' :
                                        mood === 'Focused' ? 'text-amber-400' :
                                        'text-sky-400'
                                    }`}>
                                        {mood === 'Tired' ? "Take it easy, start with small tasks" :
                                         mood === 'Focused' ? "Let's crush the important tasks!" :
                                         "Keep up the steady pace!"}
                                    </p>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover/msg:translate-x-full transition-transform duration-1000" />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Header Section */}
                <div>
                    <h3 className="text-[10px] font-black text-text-secondary/40 uppercase tracking-[0.4em] mb-4">
                        Academic Standing
                    </h3>
                    <div className="glass-panel p-8 rounded-[3rem] relative overflow-hidden group border-violet-500/20">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
                             <span className="text-4xl">🔥</span>
                        </div>
                        <div className="relative z-10">
                            <span className="text-5xl font-black text-text-primary tracking-tighter block mb-1">
                                {streak}
                            </span>
                            <p className="text-[11px] font-bold text-violet-400 uppercase tracking-widest italic">
                                Day Win Streak
                            </p>
                        </div>
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-text-secondary/40 uppercase tracking-[0.4em] mb-2 px-2">
                        Momentum Metrics
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-4">
                        {/* Urgent Alert */}
                        <div className="glass-panel p-6 rounded-[2.5rem] border-rose-500/20 bg-rose-500/5 group hover:bg-rose-500/10 transition-colors">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1 italic">Immediate</h4>
                                    <p className="text-text-primary/60 text-[11px] font-medium">Critical focus items</p>
                                </div>
                                <span className="text-3xl font-black text-rose-500 group-hover:scale-110 transition-transform">{stats.urgent}</span>
                            </div>
                        </div>

                        {/* Missed Objectives */}
                        <div className="glass-panel p-6 rounded-[2.5rem] border-white/5 opacity-60 hover:opacity-100 transition-opacity">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1">Missed</h4>
                                    <p className="text-text-secondary/40 text-[11px] font-medium">Past targets</p>
                                </div>
                                <span className="text-3xl font-black text-text-secondary/20">{stats.missed}</span>
                            </div>
                        </div>

                        {/* Completed Success */}
                        <div className="glass-panel p-6 rounded-[2.5rem] border-emerald-500/20 bg-emerald-500/5 group">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1 italic">Defeated</h4>
                                    <p className="text-text-primary/60 text-[11px] font-medium">Tasks conquered</p>
                                </div>
                                <span className="text-3xl font-black text-emerald-500 group-hover:scale-110 transition-transform">{stats.completed}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Google Calendar Control */}
                <div>
                   <button 
                        onClick={async () => {
                            try {
                                const res = await fetch('http://localhost:5000/api/calendar/auth');
                                const data = await res.json();
                                if (data.url) window.location.href = data.url;
                            } catch (e) {
                                alert('Could not reach backend for calendar auth');
                            }
                        }}
                        className="w-full glass-panel p-6 rounded-[2.5rem] hover-glow group flex items-center justify-between border-dashed border-violet-500/30 hover:bg-violet-500/5 transition-all active:scale-95"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-violet-500/20 flex items-center justify-center text-violet-400 group-hover:rotate-12 transition-transform">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                                    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <h4 className="text-[10px] font-black text-text-secondary/40 uppercase tracking-widest">External Sync</h4>
                                <p className="text-[11px] font-black text-text-primary">Google Calendar</p>
                            </div>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                    </button>
                </div>
            </div>
        </aside>
    );
};


export default Sidebar;
