'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useAppStore } from '../store/store';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useAppStore();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting until client-side mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed top-6 left-6 z-50 w-11 h-11 rounded-full bg-orange-500/10 border border-orange-500/20" />
    );
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className="fixed top-6 left-6 z-50 p-3 rounded-full glass-card hover:bg-orange-500/10 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] shadow-lg cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {theme === 'dark' ? (
            <motion.div
              key="sun"
              initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="text-amber-400 text-glow"
            >
              <Sun size={20} className="fill-amber-400" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: 90, opacity: 0, scale: 0.8 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="text-orange-600"
            >
              <Moon size={20} className="fill-orange-600" />
            </motion.div>
          )
        }
        </AnimatePresence>
      </div>
    </motion.button>
  );
}