import React from 'react';
import { calculatePriority } from '../utils/priority';

const Sidebar = ({ assignments }) => {
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
        <aside className="w-80 flex-shrink-0 hidden lg:flex flex-col gap-6 pt-2">
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-white/30 uppercase tracking-[0.25em] px-2">Insights</h3>
                
                <div className="grid gap-4">
                    {/* Total Assignments Card */}
                    <div className="p-5 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/[0.08] transition-all group cursor-default">
                        <div className="flex justify-between items-start mb-3">
                            <div className="p-2.5 rounded-2xl bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                                </svg>
                            </div>
                            <span className="text-3xl font-black text-white/90 group-hover:scale-110 transition-transform duration-300">{total}</span>
                        </div>
                        <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Total Tasks</p>
                    </div>

                    {/* High Priority Card */}
                    <div className="p-5 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/[0.08] transition-all group cursor-default">
                        <div className="flex justify-between items-start mb-3">
                            <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <span className="text-3xl font-black text-white/90 group-hover:scale-110 transition-transform duration-300">{highPriority}</span>
                        </div>
                        <p className="text-xs font-bold text-white/40 uppercase tracking-widest">High Priority</p>
                    </div>

                    {/* Due This Week Card */}
                    <div className="p-5 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/[0.08] transition-all group cursor-default">
                        <div className="flex justify-between items-start mb-3">
                            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="text-3xl font-black text-white/90 group-hover:scale-110 transition-transform duration-300">{dueThisWeek}</span>
                        </div>
                        <p className="text-xs font-bold text-white/40 uppercase tracking-widest">This Week</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
