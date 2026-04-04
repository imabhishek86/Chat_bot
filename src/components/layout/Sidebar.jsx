import React from 'react';
import { calculatePriority } from '../../utils/priority';


const Sidebar = ({ assignments }) => {
    const [streak, setStreak] = React.useState(0);

    React.useEffect(() => {
        const fetchStreak = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/stats/streak');
                const data = await res.json();
                setStreak(data.streak || 0);
            } catch (e) {
                console.error('Failed to fetch streak');
            }
        };
        fetchStreak();
    }, [assignments]);

    const total = assignments.length;
    
    const highPriority = assignments.filter(a => {
        const p = a.priority || calculatePriority(a.deadline);
        return p.toLowerCase() === 'high';
    }).length;

    const dueThisWeek = assignments.filter(a => {
        const now = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7);
        const deadline = new Date(a.deadline);
        return deadline >= now && deadline <= nextWeek;
    }).length;

    return (
        <aside className="w-full xl:w-[380px] flex flex-col gap-8">
            <div className="stack-gap px-2">
                <h3 className="text-xs font-bold text-text-secondary/40 uppercase tracking-[0.3em]">Quick Insights</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-6">
                    {/* Total Assignments Card */}
                    <div className="glass-panel p-6 rounded-[2.5rem] hover-glow group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-2xl border transition-colors shadow-lg" style={{ backgroundColor: 'var(--primary-glow)', color: 'var(--primary-solid)', borderColor: 'var(--glass-border)' }}>
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                                </svg>
                            </div>
                            <span className="text-4xl font-black text-text-primary group-hover:scale-110 transition-transform">{total}</span>
                        </div>
                        <p className="text-[10px] font-black text-text-secondary/40 uppercase tracking-widest">Total Tasks</p>
                    </div>

                    {/* High Priority Card handles itself with ROSE */}
                    <div className="glass-panel p-6 rounded-[2.5rem] hover-glow group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <span className="text-4xl font-black text-text-primary group-hover:scale-110 transition-transform">{highPriority}</span>
                        </div>
                        <p className="text-[10px] font-black text-text-secondary/40 uppercase tracking-widest">Urgent Actions</p>
                    </div>

                    {/* Due This Week handles itself with EMERALD */}
                    <div className="glass-panel p-6 rounded-[2.5rem] hover-glow group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="text-4xl font-black text-text-primary group-hover:scale-110 transition-transform">{dueThisWeek}</span>
                        </div>
                        <p className="text-[10px] font-black text-text-secondary/40 uppercase tracking-widest">This Week</p>
                    </div>

                    {/* Daily Streak handles itself with ORANGE */}
                    <div className="glass-panel p-6 rounded-[2.5rem] hover-glow group bg-gradient-to-br from-orange-500/5 to-transparent">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M12 2c0 0-2 4-2 6s1 3 1 3 M12 2c0 0 2 4 2 6s-1 3-1 3 M12 22s-4-2-4-6c0-3 2-6 4-10 2 4 4 7 4 10 0 4-4 6-4 6z" />
                                </svg>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-4xl font-black text-text-primary group-hover:scale-110 transition-transform flex items-center gap-2">
                                    {streak}
                                    <span className="text-orange-500 text-xl animate-pulse">🔥</span>
                                </span>
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-text-secondary/40 uppercase tracking-widest">Daily Streak</p>
                    </div>

                    {/* Google Calendar Link - Unified with Theme */}
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
                        className="glass-panel p-6 rounded-[2.5rem] hover-glow group flex items-center justify-between transition-all active:scale-95 text-left border-dashed"
                        style={{ borderColor: 'var(--primary-glow)' }}
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-white/5 text-text-secondary/20 transition-colors shadow-lg group-hover:scale-110" style={{ color: 'var(--primary-solid)', backgroundColor: 'var(--primary-glow)', borderColor: 'var(--glass-border)' }}>
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                                    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-text-secondary/30 uppercase tracking-widest group-hover:text-text-secondary transition-colors">Calendar Sync</h4>
                                <p className="text-[11px] font-bold text-text-primary group-hover:text-primary-solid transition-colors" style={{ color: 'var(--primary-solid)' }}>Connect Google</p>
                            </div>
                        </div>
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--primary-solid)' }} />
                    </button>
                </div>
            </div>
        </aside>
    );
};


export default Sidebar;
