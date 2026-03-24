import React, { useState, useEffect } from 'react';
import Chat from './components/Chat';
import Dashboard from './components/Dashboard';

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
    <div className="container animate-fade">
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '3.5rem', 
          fontWeight: '700', 
          background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-2px'
        }}>
          StudyFlow
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginTop: '0.5rem' }}>
          Your AI-powered Academic Assistant
        </p>
      </header>

      <main style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '3rem', 
        alignItems: 'start',
        minHeight: '70vh'
      }}>
        <div style={{ position: 'sticky', top: '2rem' }}>
          <Chat onAddAssignment={addAssignment} assignments={assignments} />
        </div>
        <div>
          <Dashboard 
            assignments={assignments} 
            onDelete={deleteAssignment}
            onUpdate={updateAssignment}
          />
        </div>
      </main>
      
      <footer style={{ marginTop: 'auto', padding: '4rem 0', textAlign: 'center', opacity: 0.5 }}>
        <p>© 2026 StudyFlow • Advanced Deadline Management</p>
      </footer>
    </div>
  );
}

export default App;
