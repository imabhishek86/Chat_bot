import React, { useState, useEffect } from 'react';
import Chat from './components/chat/ChatContainer';
import Dashboard from './components/dashboard/Dashboard';
import Sidebar from './components/layout/Sidebar';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ErrorState from './components/ui/ErrorState';
import DashboardSkeleton from './components/ui/Skeleton';
import ErrorBoundary from './components/ui/ErrorBoundary';
import ThemeToggle from './components/ui/ThemeToggle';
import NotificationToast from './components/ui/NotificationToast';
import ThemeSwitcher from './components/ui/ThemeSwitcher';
import { calculatePriority } from './utils/priority';

function App() {
  const [assignments, setAssignments] = useState([]);
  const [mood, setMood] = useState(localStorage.getItem('user_mood') || 'Normal');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [palette, setPalette] = useState(localStorage.getItem('palette') || 'violet');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [urgentTasks, setUrgentTasks] = useState([]);
  const [showNotification, setShowNotification] = useState(false);

  // Persistence for user_mood
  useEffect(() => {
    localStorage.setItem('user_mood', mood);
  }, [mood]);

  // Computed Filtered Assignments
  const filteredAssignments = React.useMemo(() => {
    return assignments.filter(a => {
      if (a.status === 'completed') return true; // Always show completed tasks or filter them out? I'll keep them.
      
      const priority = (a.priority || calculatePriority(a.deadline)).toLowerCase();
      
      // Urgent logic check (due within 48h)
      const now = new Date();
      const deadline = new Date(a.deadline);
      const diffHours = (deadline - now) / (1000 * 60 * 60);
      const isUrgent = diffHours > 0 && diffHours < 48;

      if (mood === 'Tired') return priority === 'low';
      if (mood === 'Normal') return priority === 'medium';
      if (mood === 'Focused') return priority === 'high' || isUrgent;
      
      return true;
    });
  }, [assignments, mood]);


  // Apply theme classes to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Manage Mode
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Manage Palette
    const paletteClasses = ['theme-violet', 'theme-ocean', 'theme-emerald', 'theme-rose', 'theme-amber'];
    root.classList.remove(...paletteClasses);
    root.classList.add(`theme-${palette}`);

    localStorage.setItem('theme', theme);
    localStorage.setItem('palette', palette);
  }, [theme, palette]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    // 1. Instant Load from LocalStorage
    try {
      const saved = localStorage.getItem('assignments');
      if (saved) {
        setAssignments(JSON.parse(saved));
      }
    } catch (err) {
      console.error("Local Load Error:", err);
    }

    // 2. Background Sync from Server
    const syncData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/assignments');
        if (res.ok) {
          const data = await res.json();
          // Merge or overwrite with server truth
          if (data.assignments) {
            setAssignments(data.assignments);
            localStorage.setItem('assignments', JSON.stringify(data.assignments));
          }
        }
      } catch (err) {
        console.warn("Backend unavailable. Running in persistent offline mode.");
      } finally {
        setIsLoading(false);
      }
    };

    syncData();
  }, []);

  useEffect(() => {
    localStorage.setItem('assignments', JSON.stringify(assignments));
  }, [assignments]);

  // Check for urgent tasks
  useEffect(() => {
    if (!isLoading && assignments.length > 0) {
      const now = new Date();
      const urgent = assignments.filter(a => {
        if (a.status === 'completed') return false;
        const deadline = new Date(a.deadline);
        const diffHours = (deadline - now) / (1000 * 60 * 60);
        return diffHours > 0 && diffHours < 48;
      });
      
      if (urgent.length > 0) {
        setUrgentTasks(urgent);
        setShowNotification(true);
      }
    }
  }, [isLoading, assignments]);

  const addAssignment = async (newTask) => {
    try {
      const isDuplicate = assignments.some(a => 
        a.title.toLowerCase() === newTask.title.toLowerCase() && 
        new Date(a.deadline).getTime() === new Date(newTask.deadline).getTime()
      );

      if (isDuplicate) return;

      const priority = newTask.priority || calculatePriority(newTask.deadline);
      const tempId = Date.now();
      
      const preparedTask = {
        ...newTask,
        id: tempId,
        priority,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // 1. Immediate Local State Update (triggers localStorage sync)
      setAssignments(prev => [...prev, preparedTask]);

      // 2. Background Server Sync
      try {
        const res = await fetch('http://localhost:5000/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: `Add ${preparedTask.title} on ${preparedTask.deadline}` })
        });
        
        if (res.ok) {
           // On success, background sync will eventually refresh the full list with server IDs
        }
      } catch (err) {
        console.warn("Server save failed. Task cached locally in storage.");
      }
    } catch (err) {
      setError("Failed to add assignment. Please try again.");
    }
  };

  const deleteAssignment = async (id) => {
    setAssignments(prev => prev.filter(a => a.id !== id && a._id !== id));
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
    setAssignments(prev => prev.map(a => {
      if (a.id === id || a._id === id) {
        const updatedTask = { ...a, ...updates };
        if (updatedTask.deadline) {
          updatedTask.priority = calculatePriority(updatedTask.deadline);
        }
        return updatedTask;
      }
      return a;
    }));

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
      }
    }
  };

  if (isLoading) return <DashboardSkeleton theme={theme} />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="min-h-screen bg-bg-primary transition-all duration-500 overflow-x-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        
        <NotificationToast 
          show={showNotification} 
          urgentTasks={urgentTasks} 
          onClose={() => setShowNotification(false)} 
        />

        <header className="pt-12 pb-16 text-center animate-slide-up relative">
          <div className="absolute right-0 top-12 flex items-center gap-6">
            <ThemeSwitcher currentPalette={palette} onPaletteChange={setPalette} />
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
          <h1 className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent inline-block pb-2" style={{ backgroundImage: `linear-gradient(to right, var(--primary-solid), var(--accent-secondary))` }}>
            StudyFlow
          </h1>
          <p className="text-text-secondary text-xs mt-2 font-black tracking-[0.4em] uppercase opacity-60">
            Advanced Academic Assistant
          </p>
        </header>

        <ErrorBoundary>
          <main className="flex flex-col xl:grid xl:grid-cols-[380px_450px_1fr] gap-8 items-start min-h-[70vh] pb-32">
            <Sidebar 
              assignments={assignments} 
              mood={mood} 
              onMoodChange={setMood} 
            />
            
            <div className="w-full xl:sticky xl:top-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <Chat onAddAssignment={addAssignment} assignments={assignments} />
            </div>

            <div className="w-full animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Dashboard 
                assignments={filteredAssignments} 
                onDelete={deleteAssignment}
                onUpdate={updateAssignment}
                mood={mood}
              />
            </div>
          </main>
        </ErrorBoundary>

        <footer className="py-12 text-center opacity-20 border-t border-glass-border">
          <p className="text-sm font-bold tracking-widest uppercase">© 2026 StudyFlow • Intelligence in Education</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
