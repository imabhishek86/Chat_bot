import React from 'react';
import { motion } from 'framer-motion';

const palettes = [
    { name: 'violet', color: '#8b5cf6', label: 'Violet' },
    { name: 'ocean', color: '#0ea5e9', label: 'Ocean' },
    { name: 'emerald', color: '#10b981', label: 'Emerald' },
    { name: 'rose', color: '#f43f5e', label: 'Rose' },
    { name: 'amber', color: '#f59e0b', label: 'Amber' }
];

const ThemeSwitcher = ({ currentPalette, onPaletteChange }) => {
    return (
        <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-full border border-white/5">
            {palettes.map((p) => (
                <motion.button
                    key={p.name}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onPaletteChange(p.name)}
                    className={`w-5 h-5 rounded-full transition-all relative ${
                        currentPalette === p.name ? 'ring-2 ring-white ring-offset-2 ring-offset-bg-primary scale-110' : 'opacity-40'
                    }`}
                    style={{ backgroundColor: p.color }}
                    title={p.label}
                >
                    {currentPalette === p.name && (
                        <motion.div 
                            layoutId="palette-active"
                            className="absolute -inset-1 rounded-full border border-white/20"
                        />
                    )}
                </motion.button>
            ))}
        </div>
    );
};

export default ThemeSwitcher;
