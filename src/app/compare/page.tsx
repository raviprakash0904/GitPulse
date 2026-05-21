'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GitCompare, ArrowLeft, RefreshCw, AlertCircle, Sparkles, Star, GitFork, Users, BookOpen } from 'lucide-react';
import { useDeveloperAnalytics } from '../../hooks/useGitHubApi';
import CompareChart from '../../components/charts/CompareChart';
import { formatDate } from '../../utils/format';

export default function CompareWorkbench() {
  const [userAInput, setUserAInput] = useState('gaearon');
  const [userBInput, setUserBInput] = useState('yyx990803');
  
  const [userAActive, setUserAActive] = useState('gaearon');
  const [userBActive, setUserBActive] = useState('yyx990803');

  // Fetch analytics for both developers
  const {
    data: devA,
    isLoading: loadingA,
    isError: errorA,
    refetch: refetchA,
  } = useDeveloperAnalytics(userAActive);

  const {
    data: devB,
    isLoading: loadingB,
    isError: errorB,
    refetch: refetchB,
  } = useDeveloperAnalytics(userBActive);

  const handleCompare = (e: React.FormEvent) => {
    e.preventDefault();
    if (userAInput.trim() && userBInput.trim()) {
      setUserAActive(userAInput.trim());
      setUserBActive(userBInput.trim());
    }
  };

  const handleSwap = () => {
    setUserAInput(userBActive);
    setUserBInput(userAActive);
    setUserAActive(userBActive);
    setUserBActive(userAActive);
  };

  // Calculate winner score based on simple weighted logic
  // (stars * 10) + (followers * 2) + (public_repos * 1)
  const scoreA = devA 
    ? devA.totalStars * 10 + devA.profile.followers * 2 + devA.profile.public_repos 
    : 0;
  const scoreB = devB 
    ? devB.totalStars * 10 + devB.profile.followers * 2 + devB.profile.public_repos 
    : 0;

  const winner = scoreA > scoreB ? 'A' : scoreA < scoreB ? 'B' : 'Draw';

  const isCompareReady = devA && devB;
  const isLoading = loadingA || loadingB;
  const isError = errorA || errorB;

  // Comparison metrics array to feed into CompareChart
  const comparisonMetrics = isCompareReady
    ? [
        { label: 'Followers', valA: devA.profile.followers, valB: devB.profile.followers },
        { label: 'Total Stars', valA: devA.totalStars, valB: devB.totalStars },
        { label: 'Public Repos', valA: devA.profile.public_repos, valB: devB.profile.public_repos },
        { label: 'Following', valA: devA.profile.following, valB: devB.profile.following },
        { label: 'Forks Generated', valA: devA.totalForks, valB: devB.totalForks },
      ]
    : [];

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Title Header */}
      <div className="space-y-3">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-orange-500 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500">
            <GitCompare size={20} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]">
              Developer Comparison Workbench
            </h1>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Compare developer stars, follower bases, and repositories side by side.
            </p>
          </div>
        </div>
      </div>

      {/* Control Search Panel */}
      <form onSubmit={handleCompare} className="glass-card p-5 rounded-2xl border border-[var(--card-border)] flex flex-col md:flex-row gap-4 items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {/* Dev A Search */}
          <div className="space-y-1.5 w-full">
            <label className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">
              Developer A
            </label>
            <input
              type="text"
              placeholder="e.g. gaearon"
              value={userAInput}
              onChange={(e) => setUserAInput(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-orange-500/5 dark:bg-stone-900 border border-[var(--card-border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-orange-500/40"
              required
            />
          </div>

          {/* Dev B Search */}
          <div className="space-y-1.5 w-full">
            <label className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">
              Developer B
            </label>
            <input
              type="text"
              placeholder="e.g. yyx990803"
              value={userBInput}
              onChange={(e) => setUserBInput(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-orange-500/5 dark:bg-stone-900 border border-[var(--card-border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-orange-500/40"
              required
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 w-full md:w-auto shrink-0 md:pt-4">
          <button
            type="button"
            onClick={handleSwap}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl text-xs font-semibold bg-stone-500/10 hover:bg-stone-500/25 text-[var(--text-secondary)] transition-colors border border-[var(--card-border)] cursor-pointer"
          >
            Swap
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 md:flex-initial px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 text-white shadow-md transition-opacity cursor-pointer flex items-center justify-center gap-1.5"
          >
            {isLoading ? (
              <RefreshCw size={13} className="animate-spin" />
            ) : (
              <GitCompare size={13} />
            )}
            Compare Profiles
          </button>
        </div>
      </form>

      {/* Loading Screen */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center h-80 gap-3 border border-[var(--card-border)] rounded-3xl border-dashed">
          <RefreshCw className="animate-spin text-orange-500 w-8 h-8" />
          <p className="text-xs text-[var(--text-muted)] font-medium">Crunching public developer metrics...</p>
        </div>
      )}

      {/* Error state */}
      {isError && !isLoading && (
        <div className="glass-card p-10 rounded-3xl border border-red-500/20 bg-red-500/5 text-center max-w-md mx-auto space-y-4 shadow-lg my-6">
          <AlertCircle className="text-red-500 w-10 h-10 mx-auto" />
          <div>
            <h3 className="text-sm font-bold text-red-500">Retrieval Failure</h3>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Could not fetch data for GA / YY. Check GitHub usernames, network state, or input rate limits.
            </p>
          </div>
          <button
            onClick={() => { refetchA(); refetchB(); }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-red-500 text-white hover:opacity-90 shadow-md transition-opacity cursor-pointer"
          >
            <RefreshCw size={12} />
            Retry Comparison
          </button>
        </div>
      )}

      {/* Comparison Grid Results */}
      {isCompareReady && !isLoading && !isError && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Winner Impact Banner */}
          {winner !== 'Draw' && (
            <div className="glass-card p-4 rounded-2xl flex items-center justify-between border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-500/5 to-transparent">
              <span className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-2">
                <Sparkles size={14} className="text-amber-500 animate-pulse" />
                <span>
                  Developer impact assessment declares{' '}
                  <strong className="text-orange-500">
                    {winner === 'A' ? devA.profile.name || devA.profile.login : devB.profile.name || devB.profile.login}
                  </strong>{' '}
                  with the stronger public score.
                </span>
              </span>
              <span className="hidden md:inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
                Weighted Victory
              </span>
            </div>
          )}

          {/* Core Info Details Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Developer A Card */}
            <div className={`glass-card p-6 rounded-3xl border flex flex-col gap-4 relative ${winner === 'A' ? 'border-amber-500/40 border-glow bg-amber-500/[0.02]' : 'border-[var(--card-border)]'}`}>
              {winner === 'A' && (
                <div className="absolute top-4 right-4 px-2 py-0.5 rounded-md text-[8px] font-black bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 uppercase tracking-widest flex items-center gap-1 shadow-sm">
                  <Sparkles size={8} /> Leader
                </div>
              )}
              
              <div className="flex gap-4 items-center">
                <img
                  src={devA.profile.avatar_url}
                  alt={devA.profile.login}
                  className="w-16 h-16 rounded-2xl object-cover border border-[var(--card-border)]"
                />
                <div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">
                    {devA.profile.name || devA.profile.login}
                  </h3>
                  <Link href={`/user/${devA.profile.login}`} className="text-xs font-semibold text-orange-500 hover:underline">
                    @{devA.profile.login}
                  </Link>
                </div>
              </div>
              <p className="text-xs text-[var(--text-secondary)] min-h-[40px] leading-relaxed line-clamp-2">
                {devA.profile.bio || 'Developer bio is blank.'}
              </p>
              
              <div className="grid grid-cols-2 gap-4 border-t border-[var(--card-border)] pt-4 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] text-[var(--text-muted)] block uppercase font-bold tracking-wider">Followers</span>
                  <span className="font-bold text-[var(--text-primary)] flex items-center gap-1">
                    <Users size={12} className="text-orange-400" />
                    {devA.profile.followers.toLocaleString()}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-[var(--text-muted)] block uppercase font-bold tracking-wider">Public Stars</span>
                  <span className="font-bold text-[var(--text-primary)] flex items-center gap-1">
                    <Star size={12} className="text-amber-500" />
                    {devA.totalStars.toLocaleString()}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-[var(--text-muted)] block uppercase font-bold tracking-wider">Repositories</span>
                  <span className="font-bold text-[var(--text-primary)] flex items-center gap-1">
                    <BookOpen size={12} className="text-orange-500" />
                    {devA.profile.public_repos.toLocaleString()}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-[var(--text-muted)] block uppercase font-bold tracking-wider">Joined GitHub</span>
                  <span className="font-bold text-[var(--text-primary)] block">
                    {formatDate(devA.profile.created_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Developer B Card */}
            <div className={`glass-card p-6 rounded-3xl border flex flex-col gap-4 relative ${winner === 'B' ? 'border-amber-500/40 border-glow bg-amber-500/[0.02]' : 'border-[var(--card-border)]'}`}>
              {winner === 'B' && (
                <div className="absolute top-4 right-4 px-2 py-0.5 rounded-md text-[8px] font-black bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 uppercase tracking-widest flex items-center gap-1 shadow-sm">
                  <Sparkles size={8} /> Leader
                </div>
              )}
              
              <div className="flex gap-4 items-center">
                <img
                  src={devB.profile.avatar_url}
                  alt={devB.profile.login}
                  className="w-16 h-16 rounded-2xl object-cover border border-[var(--card-border)]"
                />
                <div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">
                    {devB.profile.name || devB.profile.login}
                  </h3>
                  <Link href={`/user/${devB.profile.login}`} className="text-xs font-semibold text-orange-500 hover:underline">
                    @{devB.profile.login}
                  </Link>
                </div>
              </div>
              <p className="text-xs text-[var(--text-secondary)] min-h-[40px] leading-relaxed line-clamp-2">
                {devB.profile.bio || 'Developer bio is blank.'}
              </p>
              
              <div className="grid grid-cols-2 gap-4 border-t border-[var(--card-border)] pt-4 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] text-[var(--text-muted)] block uppercase font-bold tracking-wider">Followers</span>
                  <span className="font-bold text-[var(--text-primary)] flex items-center gap-1">
                    <Users size={12} className="text-orange-400" />
                    {devB.profile.followers.toLocaleString()}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-[var(--text-muted)] block uppercase font-bold tracking-wider">Public Stars</span>
                  <span className="font-bold text-[var(--text-primary)] flex items-center gap-1">
                    <Star size={12} className="text-amber-500" />
                    {devB.totalStars.toLocaleString()}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-[var(--text-muted)] block uppercase font-bold tracking-wider">Repositories</span>
                  <span className="font-bold text-[var(--text-primary)] flex items-center gap-1">
                    <BookOpen size={12} className="text-orange-500" />
                    {devB.profile.public_repos.toLocaleString()}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-[var(--text-muted)] block uppercase font-bold tracking-wider">Joined GitHub</span>
                  <span className="font-bold text-[var(--text-primary)] block">
                    {formatDate(devB.profile.created_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Grouped Double Bar Comparison Chart */}
          <div className="glass-card p-5 rounded-3xl border border-[var(--card-border)] flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Key Comparison Indicators</h3>
              <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                Grouped double column display comparing developer star distributions, follower counts, and repo sizes.
              </p>
            </div>
            <CompareChart
              nameA={devA.profile.name || devA.profile.login}
              nameB={devB.profile.name || devB.profile.login}
              metrics={comparisonMetrics}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}