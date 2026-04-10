import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
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

import './Dashboard.css';



const Dashboard = ({ assignments, onDelete, onUpdate }) => {
    const [viewMode, setViewMode] = useState('list'); // 'list', 'calendar', 'analytics', 'planner', or 'optimizer'
    const [search, setSearch] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [activeFocusTask, setActiveFocusTask] = useState(null);
    const [focusSubTasks, setFocusSubTasks] = useState([]);

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

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end px-2 mb-8 gap-4">
                <div>
                    <h2 className="text-text-primary text-2xl font-bold">Dashboard Overview</h2>
                    <p className="text-text-secondary text-sm mt-1">Track your academic progress</p>
                </div>

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
                </div>
            </div>
            
            <TodayFocus onFocus={handleFocus} />

            <SummaryCards assignments={assignments} />

            <div className="px-2 mb-12">
                <ProductivityScore assignments={assignments} />
            </div>


            <div className="px-2 mb-8">
                <div className="flex flex-col gap-6 mb-8">
                    <h3 className="text-xs font-black text-text-primary/20 uppercase tracking-[0.3em]">
                        {viewMode === 'list' ? 'Manage Tasks' : viewMode === 'calendar' ? 'Deadline Calendar' : viewMode === 'analytics' ? 'Insight Analytics' : viewMode === 'planner' ? 'Strategic Roadmap' : 'Optimizer Strategy'}
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
                ) : (
                    <DeadlineOptimizer />
                )}
            </div>
        </div>
    );
};



export default Dashboard;
