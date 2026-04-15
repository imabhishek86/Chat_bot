import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AssignmentList from './AssignmentList';
import SummaryCards from './SummaryCards';
import CalendarView from './CalendarView';
import AnalyticsView from './AnalyticsView';
import ProductivityScore from './ProductivityScore';
import Filters from '../ui/Filters';
import StudyPlannerView from './StudyPlannerView';
import FocusMode from './FocusMode';
import DeadlineOptimizer from './DeadlineOptimizer';
import TodayFocus from './TodayFocus';
import RiskAssessment from './RiskAssessment';
import MissedDeadlines from './MissedDeadlines';
import WeeklyReport from './WeeklyReport';

import './Dashboard.css';



const Dashboard = ({ assignments, onDelete, onUpdate }) => {
    const [viewMode, setViewMode] = useState('list'); // 'list', 'calendar', 'analytics', 'planner', 'optimizer', 'report'
    const [search, setSearch] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [activeFocusTask, setActiveFocusTask] = useState(null);
    const [focusSubTasks, setFocusSubTasks] = useState([]);
    const [maintenanceSummary, setMaintenanceSummary] = useState(null);
    const [isCleaning, setIsCleaning] = useState(false);

    // Filtering logic
    const filteredAssignments = assignments.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
        const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        return matchesSearch && matchesPriority && matchesStatus;
    });

    const handleFocus = (task, subs) => {
        setActiveFocusTask(task);
        if (subs) setFocusSubTasks(subs);
        else setFocusSubTasks([]);
    };

    const handleFocusComplete = (taskId) => {
        onUpdate(taskId, { status: 'completed' });
        setActiveFocusTask(null);
    };

    const handleMaintenance = async () => {
        setIsCleaning(true);
        try {
            const res = await fetch('http://localhost:5000/api/assignments/cleanup', { method: 'POST' });
            const data = await res.json();
            if (data.status === 'success') {
                setMaintenanceSummary(data.summary);
                onUpdate(); // Trigger refresh
                setTimeout(() => setMaintenanceSummary(null), 5000);
            }
        } catch (err) {
            console.error('Maintenance failed:', err);
        } finally {
            setIsCleaning(false);
        }
    };

    return (
        <div className="stack-gap w-full">
            <AnimatePresence>
                {activeFocusTask && (
                    <FocusMode 
                        task={activeFocusTask} 
                        subTasks={focusSubTasks}
                        onExit={() => setActiveFocusTask(null)}
                        onComplete={handleFocusComplete}
                    />
                )}
            </AnimatePresence>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end px-2 mb-12 gap-6 pb-6 border-b border-glass-border">
                <div>
                    <h2 className="text-text-primary text-3xl font-black tracking-tight mb-2">Academic Command Center</h2>
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-text-secondary text-xs font-bold uppercase tracking-widest opacity-60">System Synced & Optimizing</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <AnimatePresence>
                        {maintenanceSummary && (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="px-4 py-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 text-[10px] font-black uppercase tracking-widest"
                            >
                                ✨ {maintenanceSummary}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button 
                        onClick={handleMaintenance}
                        disabled={isCleaning}
                        className={`p-3 rounded-2xl bg-white/5 border border-glass-border text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50 ${isCleaning ? 'animate-pulse' : ''}`}
                        title="Run System Maintenance"
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 12h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                        </svg>
                    </button>
                    
                    <div className="view-toggle-container">
                    <button 
                        className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setViewMode('list')}
                    >
                        List view
                    </button>
                    <button 
                        className={`view-btn ${viewMode === 'calendar' ? 'active' : ''}`}
                        onClick={() => setViewMode('calendar')}
                    >
                        Calendar
                    </button>
                    <button 
                        className={`view-btn ${viewMode === 'analytics' ? 'active' : ''}`}
                        onClick={() => setViewMode('analytics')}
                    >
                        Analytics
                    </button>
                    <button 
                        className={`view-btn ${viewMode === 'planner' ? 'active' : ''}`}
                        onClick={() => setViewMode('planner')}
                    >
                        AI Plan
                    </button>
                    <button 
                        className={`view-btn ${viewMode === 'optimizer' ? 'active' : ''}`}
                        onClick={() => setViewMode('optimizer')}
                    >
                        AI Strategy
                    </button>
                    <button 
                        className={`view-btn ${viewMode === 'report' ? 'active' : ''}`}
                        onClick={() => setViewMode('report')}
                    >
                        Weekly Report
                    </button>
            </div>
        </div>
    </div>
    
    <TodayFocus onFocus={handleFocus} />
            
            <MissedDeadlines onUpdate={onUpdate} />

            <RiskAssessment assignments={assignments} />

            <SummaryCards assignments={assignments} />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="px-2 mb-16"
            >
                <ProductivityScore assignments={assignments} />
            </motion.div>


            <div className="px-2 mb-8">
                <div className="flex flex-col gap-6 mb-8">
                    <h3 className="text-xs font-black text-text-primary/20 uppercase tracking-[0.3em]">
                        {viewMode === 'list' ? 'Manage Tasks' : viewMode === 'calendar' ? 'Deadline Calendar' : viewMode === 'analytics' ? 'Insight Analytics' : viewMode === 'planner' ? 'Strategic Roadmap' : viewMode === 'optimizer' ? 'Optimizer Strategy' : 'Performance Editorial'}
                    </h3>

                    {viewMode === 'list' && (
                        <Filters 
                            search={search} 
                            onSearchChange={setSearch}
                            priority={priorityFilter}
                            onPriorityChange={setPriorityFilter}
                            status={statusFilter}
                            onStatusChange={setStatusFilter}
                        />
                    )}
                </div>

                {viewMode === 'list' ? (
                    <AssignmentList 
                        assignments={filteredAssignments} 
                        onDelete={onDelete} 
                        onUpdate={onUpdate} 
                        onFocus={handleFocus}
                    />
                ) : viewMode === 'calendar' ? (
                    <CalendarView 
                        assignments={assignments} 
                        onDelete={onDelete} 
                        onUpdate={onUpdate} 
                    />
                ) : viewMode === 'analytics' ? (
                    <AnalyticsView assignments={assignments} />
                ) : viewMode === 'planner' ? (
                    <StudyPlannerView />
                ) : viewMode === 'optimizer' ? (
                    <DeadlineOptimizer />
                ) : (
                    <WeeklyReport onBack={() => setViewMode('list')} />
                )}
            </div>
        </div>
    );
};



export default Dashboard;
