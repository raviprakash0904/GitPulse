'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, ShieldAlert, CheckCircle2, RefreshCw, Info } from 'lucide-react';
import { useAppStore } from '../store/store';

export default function RateLimitIndicator() {
  const { rateLimit, githubToken, setGithubToken } = useAppStore();
  const [tokenInput, setTokenInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [resetCountdown, setResetCountdown] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (githubToken) {
      setTokenInput(githubToken);
    }
  }, [githubToken]);

  // Update countdown to rate limit reset
  useEffect(() => {
    if (!rateLimit?.reset) return;

    const updateCountdown = () => {
      const diff = rateLimit.reset * 1000 - Date.now();
      if (diff <= 0) {
        setResetCountdown('Resetting...');
        return;
      }
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setResetCountdown(`${mins}m ${secs}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [rateLimit]);

  if (!mounted) return null;

  const handleSaveToken = (e: React.FormEvent) => {
    e.preventDefault();
    setGithubToken(tokenInput.trim() || null);
    setIsOpen(false);
  };

  const remaining = rateLimit?.remaining ?? 60;
  const limit = rateLimit?.limit ?? 60;
  const percent = Math.max(0, Math.min(100, (remaining / limit) * 100));

  // Determine indicator color
  let progressColor = 'bg-gradient-to-r from-orange-500 to-amber-500';
  let badgeColor = 'bg-orange-500/10 text-orange-500 border border-orange-500/20';
  if (percent < 30) {
    progressColor = 'bg-red-500';
    badgeColor = 'bg-red-500/10 text-red-400 border border-red-500/20';
  } else if (percent < 70) {
    progressColor = 'bg-yellow-500';
    badgeColor = 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {/* Token configuration modal-dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-80 glass-card p-4 rounded-2xl shadow-xl border border-[var(--card-border)] mb-2"
          >
            <h4 className="text-sm font-semibold flex items-center gap-2 mb-2 text-[var(--text-primary)]">
              <Key size={16} className="text-orange-500" />
              GitHub Access Token
            </h4>
            <p className="text-xs text-[var(--text-muted)] mb-3 leading-relaxed">
              Standard rate limits are restricted to 60 requests per hour. Provide a GitHub PAT to unlock 5,000 requests.
            </p>
            <form onSubmit={handleSaveToken} className="space-y-3">
              <input
                type="password"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl bg-orange-500/5 dark:bg-stone-900 border border-[var(--card-border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-orange-500/40"
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-500/10 hover:bg-stone-500/20 text-[var(--text-secondary)] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 text-white font-semibold shadow-md transition-opacity cursor-pointer"
                >
                  Save Token
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Trigger Card */}
      <motion.div
        className="glass-card p-3 rounded-2xl flex flex-col gap-2 min-w-[220px] shadow-lg cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-[var(--text-secondary)] flex items-center gap-1.5">
            API Health Rate
            {githubToken ? (
              <span title="Authenticated with Token">
                <CheckCircle2 size={13} className="text-emerald-500" />
              </span>
            ) : (
              <span title="Unauthenticated Rate Limit">
                <Info size={13} className="text-orange-400" />
              </span>
            )}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeColor}`}>
            {remaining} / {limit} reqs
          </span>
        </div>

        {/* Custom Progress bar */}
        <div className="w-full h-1.5 bg-orange-500/10 rounded-full overflow-hidden">
          <motion.div 
            className={`h-full ${progressColor}`}
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        <div className="flex justify-between items-center text-[10px] text-[var(--text-muted)]">
          <span>{githubToken ? 'Developer PAT active' : 'PAT Config: click to set'}</span>
          {rateLimit && (
            <span className="flex items-center gap-1">
              <RefreshCw size={10} className="animate-spin" style={{ animationDuration: '3s' }} />
              Reset: {resetCountdown}
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}