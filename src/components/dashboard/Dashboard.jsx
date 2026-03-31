import React, { useState } from 'react';
import AssignmentList from './AssignmentList';
import SummaryCards from './SummaryCards';
import CalendarView from './CalendarView';
import AnalyticsView from './AnalyticsView';
import ProductivityScore from './ProductivityScore';
import Filters from '../ui/Filters';

import './Dashboard.css';



const Dashboard = ({ assignments, onDelete, onUpdate }) => {
    const [viewMode, setViewMode] = useState('list'); // 'list', 'calendar' or 'analytics'
    const [search, setSearch] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    // Filtering logic
    const filteredAssignments = assignments.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
        const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        return matchesSearch && matchesPriority && matchesStatus;
    });

    return (
        <div className="stack-gap w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end px-2 mb-8 gap-4">
                <div>
                    <h2 className="text-white/90 text-2xl font-bold">Dashboard Overview</h2>
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
                </div>
            </div>

            <SummaryCards assignments={assignments} />

            <div className="px-2 mb-12">
                <ProductivityScore assignments={assignments} />
            </div>


            <div className="px-2 mb-8">
                <div className="flex flex-col gap-6 mb-8">
                    <h3 className="text-xs font-black text-white/20 uppercase tracking-[0.3em]">
                        {viewMode === 'list' ? 'Manage Tasks' : viewMode === 'calendar' ? 'Deadline Calendar' : 'Insight Analytics'}
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
                    />
                ) : viewMode === 'calendar' ? (
                    <CalendarView 
                        assignments={assignments} 
                        onDelete={onDelete} 
                        onUpdate={onUpdate} 
                    />
                ) : (
                    <AnalyticsView assignments={assignments} />
                )}
            </div>
        </div>
    );
};



export default Dashboard;
