import React from 'react';
import { motion } from 'framer-motion';

const SummaryCard = ({ title, value, icon, colorClass, delay, useTheme }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className={`glass-panel p-6 rounded-[2.5rem] hover-glow group flex flex-col gap-4 relative overflow-hidden transition-all duration-500 hover:shadow-2xl ${colorClass.shadow || ''}`}
    >
        <div className="flex justify-between items-center relative z-10">
            <div 
                className={`p-4 rounded-2xl border transition-all group-hover:scale-110 group-hover:rotate-3 duration-500 ${!useTheme ? colorClass.bg + ' ' + colorClass.text + ' ' + colorClass.border : ''}`}
                style={useTheme ? { backgroundColor: 'var(--primary-glow)', color: 'var(--primary-solid)', borderColor: 'var(--glass-border)' } : {}}
            >
                {icon}
            </div>
            <span className="text-3xl font-black text-text-primary tracking-tighter">
                {value}
            </span>
        </div>
        <div>
            <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-1">{title}</p>

            <div className="h-1 w-12 rounded-full bg-white/5 overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1, delay: delay + 0.3 }}
                    className={`h-full ${!useTheme ? colorClass.line : ''}`} 
                    style={useTheme ? { backgroundColor: 'var(--primary-solid)' } : {}}
                />
            </div>
        </div>
    </motion.div>
);

const SummaryCards = ({ assignments }) => {
    const stats = {
        total: assignments.length,
        completed: assignments.filter(a => a.status === 'completed').length,
        pending: assignments.filter(a => a.status !== 'completed').length,
        high: assignments.filter(a => a.priority === 'High' && a.status !== 'completed').length,
        totalHours: assignments.filter(a => a.status !== 'completed').reduce((sum, a) => sum + (a.estimatedHours || 0), 0)
    };

    const config = [
        {
            title: "Total Tasks",
            value: stats.total,
            useTheme: true,
            colorClass: {}, // Handled by useTheme
            icon: (
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
            )
        },
        {
            title: "Completed Tasks",
            value: stats.completed,
            colorClass: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', line: 'bg-emerald-500', shadow: 'hover:shadow-emerald-500/10' },
            icon: (
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" />
                </svg>
            )
        },
        {
            title: "Pending Tasks",
            value: stats.pending,
            colorClass: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', line: 'bg-amber-500', shadow: 'hover:shadow-amber-500/10' },
            icon: (
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4l3 3" />
                </svg>
            )
        },
        {
            title: "Urgent (High)",
            value: stats.high,
            colorClass: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', line: 'bg-rose-500', shadow: 'hover:shadow-rose-500/10' },
            icon: (
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            )
        },
        {
            title: "Total Study Load",
            value: `${Math.round(stats.totalHours)}h`,
            colorClass: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20', line: 'bg-violet-500', shadow: 'hover:shadow-violet-500/10' },
            icon: (
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
            )
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
            {config.map((card, index) => (
                <SummaryCard key={card.title} {...card} delay={index * 0.1} />
            ))}
        </div>
    );
};

export default SummaryCards;
