'use client';

import React from 'react';
import Link from 'next/link';
import { Users, BookOpen, MapPin, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { GithubUser } from '../services/github';
import { formatCompactNumber } from '../utils/format';

interface UserCardProps {
  user: GithubUser;
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative flex flex-col justify-between h-48 rounded-2xl glass-card p-5 hover:border-orange-500/40 transition-all duration-300"
    >
      <div className="flex gap-4">
        {/* Avatar image */}
        <div className="relative shrink-0">
          <img
            src={user.avatar_url}
            alt={user.name || user.login}
            className="w-14 h-14 rounded-2xl object-cover border border-[var(--card-border)] group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* User Info */}
        <div className="overflow-hidden flex-1">
          <h3 className="text-sm font-bold text-[var(--text-primary)] hover:text-orange-500 transition-colors truncate">
            {user.name || user.login}
          </h3>
          <span className="text-[10px] text-[var(--text-muted)] font-medium">
            @{user.login}
          </span>
          <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed mt-1.5">
            {user.bio || 'No bio provided by this developer.'}
          </p>
        </div>
      </div>

      {/* Stats and Navigation footer */}
      <div className="flex items-center justify-between border-t border-[var(--card-border)] pt-3.5 mt-2 text-[11px] text-[var(--text-muted)]">
        <div className="flex items-center gap-3">
          {/* Followers count */}
          <span className="flex items-center gap-1 group-hover:text-[var(--text-secondary)]">
            <Users size={12} className="text-orange-400" />
            {formatCompactNumber(user.followers)} followers
          </span>

          {/* Repos count */}
          <span className="flex items-center gap-1 group-hover:text-[var(--text-secondary)]">
            <BookOpen size={12} className="text-amber-500" />
            {formatCompactNumber(user.public_repos)} repos
          </span>
        </div>

        {/* Location or Action */}
        <Link 
          href={`/user/${user.login}`}
          className="flex items-center gap-1 text-[var(--text-secondary)] group-hover:text-orange-500 font-bold transition-colors"
        >
          View Profile
          <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}

// Skeleton Component for loading states
export function UserCardSkeleton() {
  return (
    <div className="h-48 rounded-2xl glass-card p-5 flex flex-col justify-between animate-pulse">
      <div className="flex gap-4">
        <div className="w-14 h-14 rounded-2xl bg-stone-500/20 shrink-0" />
        <div className="flex-1 space-y-1.5 overflow-hidden">
          <div className="w-24 h-3 bg-stone-500/20 rounded" />
          <div className="w-12 h-2.5 bg-stone-500/20 rounded" />
          <div className="w-full h-2.5 bg-stone-500/20 rounded mt-2" />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[var(--card-border)] pt-3.5">
        <div className="flex items-center gap-3">
          <div className="w-16 h-3 bg-stone-500/20 rounded" />
          <div className="w-16 h-3 bg-stone-500/20 rounded" />
        </div>
        <div className="w-12 h-3 bg-stone-500/20 rounded" />
      </div>
    </div>
  );
}