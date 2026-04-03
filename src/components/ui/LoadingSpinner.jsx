import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
            <div className="relative">
                {/* Outer Ring */}
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-16 h-16 rounded-full border-4 border-violet-500/10 border-t-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                />
                
                {/* Inner Glow */}
                <motion.div 
                    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-emerald-500 blur-xl"
                />
            </div>
            
            <div className="text-center">
                <p className="text-sm font-black text-text-primary uppercase tracking-[0.3em] animate-pulse">
                    Synchronizing
                </p>
                <p className="text-[10px] text-text-secondary mt-1 font-medium opacity-50 uppercase tracking-widest">
                    Preparing your workspace
                </p>
            </div>
        </div>
    );
};

export default LoadingSpinner;
