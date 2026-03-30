import React from 'react';
import { motion } from 'framer-motion';

const ThemeToggle = ({ theme, toggleTheme }) => {
    return (
        <button 
            onClick={toggleTheme}
            className="glass-panel p-3 rounded-2xl hover:scale-110 active:scale-95 transition-all group overflow-hidden relative"
            aria-label="Toggle theme"
        >
            <div className="relative z-10">
                {theme === 'dark' ? (
                    <motion.svg 
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"
                        className="text-amber-400"
                    >
                        <circle cx="12" cy="12" r="5" />
                        <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                    </motion.svg>
                ) : (
                    <motion.svg 
                        initial={{ scale: 0, rotate: 90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"
                        className="text-violet-600"
                    >
                        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                    </motion.svg>
                )}
            </div>
            
            {/* Background glow effect on hover */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-0 ${theme === 'dark' ? 'bg-amber-400/20' : 'bg-violet-500/20'}`} />
        </button>
    );
};

export default ThemeToggle;
