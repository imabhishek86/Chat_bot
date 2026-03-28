import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Dashboard.css';
const Dashboard = ({ assignments, onDelete, onUpdate }) => {
    const sortedAssignments = [...assignments].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="dashboard-container"
        >
            <div className="dashboard-header">
                <h2>Upcoming Deadlines</h2>
                <span className="count-badge">{assignments.length} Total</span>
            </div>

            {assignments.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="empty-state glass-card"
                >
                    <p>No assignments yet. Use the chat to add one!</p>
                </motion.div>
            ) : (
                <div className="deadline-grid">
                    <AnimatePresence mode="popLayout">
                        {sortedAssignments.map(item => {
                            const priority = item.priority || 'Low';

                            return (
                                <motion.div 
                                    key={item.id} 
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                                    className={`assignment-card glass-card ${item.status}`}
                                >
                                    <div className="card-top">
                                        <span className={`priority-tag ${priority.toLowerCase()}`}>
                                            {priority.toUpperCase()}
                                        </span>

                                        <button onClick={() => onDelete(item.id)} className="delete-btn">&times;</button>
                                    </div>
                                    <h4 className="card-title">{item.title}</h4>
                                    <div className="card-footer">
                                        <div className="deadline-info">
                                            <svg viewBox="0 0 24 24" width="14" height="14">
                                                <path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                            </svg>
                                            <span>{new Date(item.deadline).toLocaleDateString()}</span>
                                        </div>
                                        <button 
                                            className="status-toggle"
                                            onClick={() => onUpdate(item.id, { status: item.status === 'completed' ? 'pending' : 'completed' })}
                                        >
                                            {item.status === 'completed' ? 'Undo' : 'Done'}
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );
};

export default Dashboard;
