import React from 'react';
import { motion } from 'framer-motion';

const ErrorState = ({ message, onRetry }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel p-8 rounded-[2rem] text-center max-w-md mx-auto my-12"
    >
      <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold mb-2">Something went wrong</h3>
      <p className="text-text-secondary mb-8">{message || "We encountered an error while loading your data."}</p>
      
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-8 py-3 rounded-2xl bg-white/5 border border-white/10 font-bold uppercase tracking-wider text-xs hover:bg-white/10 transition-all active:scale-95"
        >
          Try Again
        </button>
      )}
    </motion.div>
  );
};

export default ErrorState;
