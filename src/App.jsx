import React, { useState, useEffect } from 'react';
import Chat from './components/chat/ChatContainer';
<<<<<<< HEAD
import Dashboard from './components/dashboard/Dashboard';
import Sidebar from './components/layout/Sidebar';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ErrorState from './components/ui/ErrorState';
import DashboardSkeleton from './components/ui/Skeleton';
import ErrorBoundary from './components/ui/ErrorBoundary';
import ThemeToggle from './components/ui/ThemeToggle';
import { calculatePriority } from './utils/priority';




function App() {
  const [assignments, setAssignments] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Apply theme class to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };


  useEffect(() => {
    // Simulate initial data load from localStorage with a small delay for a premium feel
    const timer = setTimeout(() => {
      try {
        const saved = localStorage.getItem('assignments');
        if (saved) setAssignments(JSON.parse(saved));
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load assignments:", err);
        setError("Could not load your assignments from local storage.");
        setIsLoading(false);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, []);
=======
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import { calculatePriority } from './utils/priority';


function App() {
  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem('assignments');
    return saved ? JSON.parse(saved) : [];
  });
>>>>>>> 3dd829c3d0d072bd55ec48ca1d184a87e642a64f

  useEffect(() => {
    localStorage.setItem('assignments', JSON.stringify(assignments));
  }, [assignments]);

  const addAssignment = (newTask) => {
<<<<<<< HEAD
    try {
      const isDuplicate = assignments.some(a => 
        a.title.toLowerCase() === newTask.title.toLowerCase() && 
        new Date(a.deadline).getTime() === new Date(newTask.deadline).getTime()
      );

      if (isDuplicate) return;

      const priority = newTask.priority || calculatePriority(newTask.deadline);

      setAssignments(prev => [...prev, {
        ...newTask,
        priority,
        id: Date.now(),
        status: 'pending',
        createdAt: new Date().toISOString()
      }]);
    } catch (err) {
      setError("Failed to add assignment. Please try again.");
    }
  };

  const deleteAssignment = async (id) => {
    // 1. Update local state instantly
    setAssignments(prev => prev.filter(a => a.id !== id && a._id !== id));

    // 2. Sync with Backend
    try {
      const mongoId = assignments.find(a => a.id === id || a._id === id)?._id || id;
      await fetch(`http://localhost:5000/api/assignments/${mongoId}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error("Failed to delete assignment from backend:", err);
    }
  };


  const updateAssignment = async (id, updates) => {


    // 1. Update local state instantly for a snappy UI
    setAssignments(prev => prev.map(a => {
      if (a.id === id || a._id === id) {
        const updatedTask = { ...a, ...updates };
        if (updatedTask.deadline) {
          updatedTask.priority = calculatePriority(updatedTask.deadline);
=======
    // Duplication check: Prevent adding the same task with same title and deadline
    const isDuplicate = assignments.some(a => 
      a.title.toLowerCase() === newTask.title.toLowerCase() && 
      new Date(a.deadline).getTime() === new Date(newTask.deadline).getTime()
    );

    if (isDuplicate) return;

    // Automatically calculate priority if not provided
    const priority = newTask.priority || calculatePriority(newTask.deadline);

    setAssignments(prev => [...prev, {
      ...newTask,
      priority,
      id: Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString()
    }]);
  };

  const deleteAssignment = (id) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  const updateAssignment = (id, updates) => {
    setAssignments(prev => prev.map(a => {
      if (a.id === id) {
        const updatedTask = { ...a, ...updates };
        // If deadline is updated, recalculate priority
        if (updates.deadline) {
          updatedTask.priority = calculatePriority(updates.deadline);
>>>>>>> 3dd829c3d0d072bd55ec48ca1d184a87e642a64f
        }
        return updatedTask;
      }
      return a;
    }));
<<<<<<< HEAD

    // 2. Sync with Backend if it's a status update
    if (updates.status) {
      try {
        const mongoId = assignments.find(a => a.id === id || a._id === id)?._id || id;
        await fetch(`http://localhost:5000/api/assignments/${mongoId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: updates.status })
        });
      } catch (err) {
        console.error("Failed to sync status with backend:", err);
        // Optional: toast error or revert local state
      }
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary transition-all duration-500 overflow-x-hidden">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <header className="pt-12 pb-16 text-center animate-slide-up relative">
            <div className="absolute right-0 top-12">
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            </div>
            <h1 className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent inline-block pb-2">
              StudyFlow
            </h1>
            <p className="text-text-secondary text-xs mt-2 font-black tracking-[0.4em] uppercase opacity-60">
              Advanced Academic Assistant
            </p>
          </header>

          <main className="flex flex-col xl:grid xl:grid-cols-[380px_450px_1fr] gap-8 items-start min-h-[70vh] pb-32">
            <div className="w-full opacity-50 pointer-events-none">
              <Sidebar assignments={[]} />
            </div>
            <div className="w-full xl:sticky xl:top-8 opacity-50 pointer-events-none">
              <Chat assignments={[]} onAddAssignment={() => {}} />
            </div>
            <div className="w-full">
              <DashboardSkeleton />
            </div>
          </main>
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary section-padding">
        <ErrorState message={error} onRetry={() => { setError(null); setIsLoading(true); }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary transition-all duration-500 overflow-x-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <header className="pt-12 pb-16 text-center animate-slide-up relative">
          <div className="absolute right-0 top-12">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
          <h1 className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent inline-block pb-2">
            StudyFlow
          </h1>
          <p className="text-text-secondary text-xs mt-2 font-black tracking-[0.4em] uppercase opacity-60">
            Advanced Academic Assistant
          </p>
        </header>

        <ErrorBoundary>
          <main className="flex flex-col xl:grid xl:grid-cols-[380px_450px_1fr] gap-8 items-start min-h-[70vh] pb-32">
            <Sidebar assignments={assignments} />
            
            <div className="w-full xl:sticky xl:top-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <Chat onAddAssignment={addAssignment} assignments={assignments} />
            </div>

            <div className="w-full animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Dashboard 
                assignments={assignments} 
                onDelete={deleteAssignment}
                onUpdate={updateAssignment}
              />
            </div>
          </main>
        </ErrorBoundary>

        
        <footer className="py-12 text-center opacity-20 border-t border-white/5">
          <p className="text-sm font-bold tracking-widest uppercase">© 2026 StudyFlow • Intelligence in Education</p>
        </footer>
      </div>
=======
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
>>>>>>> 3dd829c3d0d072bd55ec48ca1d184a87e642a64f
    </div>
  );
}

<<<<<<< HEAD

=======
>>>>>>> 3dd829c3d0d072bd55ec48ca1d184a87e642a64f
export default App;
