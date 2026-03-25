import React, { useState, useEffect } from 'react';
import Chat from './components/chat/ChatContainer';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';

function App() {
  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem('assignments');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('assignments', JSON.stringify(assignments));
  }, [assignments]);

  const addAssignment = (newTask) => {
    setAssignments(prev => [...prev, {
      ...newTask,
      id: Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString()
    }]);
  };

  const deleteAssignment = (id) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  const updateAssignment = (id, updates) => {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  return (
    <div className="container animate-fade max-w-[1600px] mx-auto px-6">
      <header className="mb-12 pt-8 text-center">
        <h1 className="text-6xl font-black bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent letter-spacing-tight">
          StudyFlow
        </h1>
        <p className="text-white/40 text-lg mt-2 font-medium tracking-wide">
          Your AI-powered Academic Assistant
        </p>
      </header>

      <main className="flex flex-col lg:flex-row gap-8 items-start min-h-[70vh] pb-20">
        <Sidebar assignments={assignments} />
        
        <div className="flex-1 w-full lg:max-w-md sticky top-8">
          <Chat onAddAssignment={addAssignment} assignments={assignments} />
        </div>

        <div className="flex-1 w-full">
          <Dashboard 
            assignments={assignments} 
            onDelete={deleteAssignment}
            onUpdate={updateAssignment}
          />
        </div>
      </main>
      
      <footer className="mt-auto py-12 text-center opacity-30 border-t border-white/5">
        <p className="text-sm font-medium">© 2026 StudyFlow • Advanced Deadline Management</p>
      </footer>
    </div>
  );
}

export default App;
