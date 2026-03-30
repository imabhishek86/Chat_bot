import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarView.css';
import { motion, AnimatePresence } from 'framer-motion';
import AssignmentList from './AssignmentList';


const CalendarView = ({ assignments, onDelete, onUpdate }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Function to check if a date has assignments
    const getAssignmentsForDate = (date) => {
        return assignments.filter(a => {
            const assignmentDate = new Date(a.deadline);
            return assignmentDate.getDate() === date.getDate() &&
                   assignmentDate.getMonth() === date.getMonth() &&
                   assignmentDate.getFullYear() === date.getFullYear();
        });
    };

    // Render dots on the calendar tiles for deadlines
    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const dailyTasks = getAssignmentsForDate(date);
            if (dailyTasks.length > 0) {
                return <div className={`deadline-dot ${dailyTasks.length > 1 ? 'multi' : ''}`} />;
            }
        }
        return null;
    };

    const selectedTasks = getAssignmentsForDate(selectedDate);

    return (
        <div className="calendar-container animate-slide-up">
            <Calendar 
                onChange={setSelectedDate} 
                value={selectedDate}
                tileContent={tileContent}
                className="studyflow-calendar"
                prev2Label={null}
                next2Label={null}
            />

            <div className="selected-date-tasks mt-8">
                <div className="flex items-center gap-4 mb-6 px-4">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
                        <span className="text-xl font-black text-violet-400">{selectedDate.getDate()}</span>
                    </div>
                    <div>
                        <h3 className="text-white/90 text-lg">Deadlines on {selectedDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</h3>
                        <p className="text-text-secondary text-xs">{selectedTasks.length} {selectedTasks.length === 1 ? 'task' : 'tasks'} found</p>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedDate.toISOString()}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <AssignmentList 
                            assignments={selectedTasks} 
                            onDelete={onDelete} 
                            onUpdate={onUpdate} 
                        />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CalendarView;
