'use client';

import React from 'react';
import Link from 'next/link';
import { Star, GitFork, BookMarked, Pin, PinOff, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import { GithubRepo } from '../services/github';
import { formatCompactNumber, formatBytes } from '../utils/format';
import { useAppStore } from '../store/store';

interface RepoCardProps {
  repo: GithubRepo;
}

// GitHub Language Color Map
const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#deb887',
  Ruby: '#701516',
  PHP: '#4F5D95',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Shell: '#89e051',
  Vue: '#41b883',
  React: '#61dafb',
};

export default function RepoCard({ repo }: RepoCardProps) {
  const { pinnedRepos, pinRepo, unpinRepo } = useAppStore();
  
  const isPinned = pinnedRepos.some(
    (fullName) => fullName.toLowerCase() === repo.full_name.toLowerCase()
  );

  const handlePinClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isPinned) {
      unpinRepo(repo.full_name);
    } else {
      pinRepo(repo.full_name);
    }
  };

  const langColor = repo.language ? LANGUAGE_COLORS[repo.language] || '#8b8a89' : '#8b8a89';

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative flex flex-col justify-between h-48 rounded-2xl glass-card p-5 hover:border-orange-500/40 transition-all duration-300"
    >
      {/* Absolute Pinned Corner Action */}
      <button
        onClick={handlePinClick}
        className="absolute top-4 right-4 p-2 rounded-xl text-[var(--text-muted)] hover:text-orange-500 hover:bg-orange-500/10 transition-all cursor-pointer"
        aria-label={isPinned ? 'Unpin repository' : 'Pin repository'}
      >
        {isPinned ? (
          <PinOff size={14} className="text-orange-500 fill-orange-500" />
        ) : (
          <Pin size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </button>

      <div className="flex flex-col gap-2">
        {/* Repo Header */}
        <Link 
          href={`/repo/${repo.owner.login}/${repo.name}`}
          className="flex items-start gap-2.5 max-w-[85%]"
        >
          <BookMarked size={18} className="text-orange-500 mt-0.5 shrink-0" />
          <div className="overflow-hidden">
            <span className="text-[10px] text-[var(--text-muted)] block font-medium uppercase tracking-wider truncate">
              {repo.owner.login}
            </span>
            <h3 className="text-sm font-bold text-[var(--text-primary)] hover:text-orange-500 transition-colors truncate">
              {repo.name}
            </h3>
          </div>
        </Link>

        {/* Repo Description */}
        <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed mt-1">
          {repo.description || 'No description available for this repository.'}
        </p>
      </div>

      {/* Stats and Info Footer */}
      <div className="flex items-center justify-between border-t border-[var(--card-border)] pt-3.5 mt-2 text-[11px] text-[var(--text-muted)]">
        <div className="flex items-center gap-3">
          {/* Star Count */}
          <span className="flex items-center gap-1 group-hover:text-[var(--text-secondary)]">
            <Star size={12} className="text-amber-500 fill-amber-500/10" />
            {formatCompactNumber(repo.stargazers_count)}
          </span>

          {/* Fork Count */}
          <span className="flex items-center gap-1 group-hover:text-[var(--text-secondary)]">
            <GitFork size={12} className="text-orange-400" />
            {formatCompactNumber(repo.forks_count)}
          </span>

          {/* Size */}
          <span className="flex items-center gap-1 group-hover:text-[var(--text-secondary)]">
            <Database size={12} />
            {formatBytes(repo.size)}
          </span>
        </div>

        {/* Language Indicator */}
        {repo.language && (
          <div className="flex items-center gap-1.5 font-medium text-[var(--text-secondary)]">
            <span 
              className="w-2 h-2 rounded-full ring-2 ring-white/10 dark:ring-black/10 shrink-0" 
              style={{ backgroundColor: langColor }}
            />
            {repo.language}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Skeleton Component for loading states
export function RepoCardSkeleton() {
  return (
    <div className="h-48 rounded-2xl glass-card p-5 flex flex-col justify-between animate-pulse">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-4 h-4 rounded bg-orange-500/20" />
          <div className="flex-1 space-y-1.5">
            <div className="w-16 h-2 bg-stone-500/20 rounded" />
            <div className="w-28 h-3 bg-stone-500/20 rounded" />
          </div>
        </div>
        <div className="space-y-1.5 mt-2">
          <div className="w-full h-2.5 bg-stone-500/20 rounded" />
          <div className="w-4/5 h-2.5 bg-stone-500/20 rounded" />
        </div>
      </div>
      
      <div className="flex items-center justify-between border-t border-[var(--card-border)] pt-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-3 bg-stone-500/20 rounded" />
          <div className="w-10 h-3 bg-stone-500/20 rounded" />
        </div>
        <div className="w-12 h-3 bg-stone-500/20 rounded" />
      </div>
    </div>
  );
}