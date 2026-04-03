import React from 'react';

const Filters = ({ search, onSearchChange, priority, onPriorityChange, status, onStatusChange }) => {
    return (
        <div className="flex flex-col lg:flex-row gap-4 mb-8 glass-panel p-4 rounded-[2rem]">
            {/* Search Input */}
            <div className="flex-1 relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-secondary/40 group-focus-within:text-violet-400 transition-colors">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                    </svg>
                </div>
                <input 
                    type="text"
                    placeholder="Search assignments..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full bg-bg-secondary/50 border border-glass-border rounded-2xl py-3 pl-12 pr-4 text-sm text-text-primary placeholder:text-text-secondary/30 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all shadow-inner"
                />
            </div>

            {/* Filter Group */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Priority Filter */}
                <select 
                    value={priority}
                    onChange={(e) => onPriorityChange(e.target.value)}
                    className="bg-bg-secondary/50 border border-glass-border rounded-2xl py-3 px-4 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-violet-500/50 appearance-none cursor-pointer hover:bg-bg-secondary transition-all min-w-[140px] shadow-inner"
                >
                    <option value="all" className="bg-bg-primary text-text-primary">All Priorities</option>
                    <option value="High" className="bg-bg-primary text-rose-400">🔥 High</option>
                    <option value="Medium" className="bg-bg-primary text-amber-400">⚡ Medium</option>
                    <option value="Low" className="bg-bg-primary text-sky-400">🧊 Low</option>
                </select>

                {/* Status Filter */}
                <select 
                    value={status}
                    onChange={(e) => onStatusChange(e.target.value)}
                    className="bg-bg-secondary/50 border border-glass-border rounded-2xl py-3 px-4 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-violet-500/50 appearance-none cursor-pointer hover:bg-bg-secondary transition-all min-w-[140px] shadow-inner"
                >
                    <option value="all" className="bg-bg-primary text-text-primary">All Status</option>
                    <option value="pending" className="bg-bg-primary text-text-secondary">🕒 Pending</option>
                    <option value="completed" className="bg-bg-primary text-emerald-400">✅ Completed</option>
                </select>
            </div>
        </div>
    );
};

export default Filters;
