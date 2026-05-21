'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, BookOpen, Star, GitFork, MapPin, Briefcase, Link as LinkIcon, RefreshCw, AlertCircle, Calendar } from 'lucide-react';
import { useDeveloperAnalytics } from '../../../hooks/useGitHubApi';
import CommitChart from '../../../components/charts/CommitChart';
import LanguageChart from '../../../components/charts/LanguageChart';
import RepoCard from '../../../components/RepoCard';
import { formatDate } from '../../../utils/format';

interface PageProps {
  params: Promise<{ username: string }>;
}

export default function UserProfile({ params }: PageProps) {
  const { username } = use(params);

  const {
    data: analytics,
    isLoading,
    isError,
    refetch,
  } = useDeveloperAnalytics(username);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse max-w-5xl mx-auto">
        <div className="w-20 h-4 bg-stone-500/20 rounded" />
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-28 h-28 rounded-3xl bg-stone-500/20" />
          <div className="flex-1 space-y-3">
            <div className="w-48 h-6 bg-stone-500/20 rounded" />
            <div className="w-24 h-4 bg-stone-500/20 rounded" />
            <div className="w-full h-4 bg-stone-500/20 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-stone-500/10 border border-stone-500/10" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-80 rounded-2xl bg-stone-500/10 border border-stone-500/10" />
          <div className="h-80 rounded-2xl bg-stone-500/10 border border-stone-500/10" />
        </div>
      </div>
    );
  }

  if (isError || !analytics) {
    return (
      <div className="glass-card p-10 rounded-3xl border border-red-500/20 bg-red-500/5 text-center max-w-md mx-auto space-y-4 shadow-lg my-12">
        <AlertCircle className="text-red-500 w-10 h-10 mx-auto" />
        <div>
          <h3 className="text-sm font-bold text-red-500">Failed to Retrieve Developer</h3>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            GitHub API was unable to fetch information for @{username}. Please check the username or API rate limits.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-500/10 hover:bg-stone-500/20 text-[var(--text-secondary)] transition-colors"
          >
            Go Back
          </Link>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-red-500 text-white hover:opacity-90 shadow-md transition-opacity cursor-pointer"
          >
            <RefreshCw size={12} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { profile, repos, totalStars, totalForks, languageData, activityData, commitCount30Days, recentActivity } = analytics;

  // Filter out forks for recent repositories list
  const sourceRepos = repos.filter(r => !r.fork).slice(0, 6);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Navigation Header */}
      <div>
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-orange-500 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </Link>
      </div>

      {/* Profile Info Header */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
        <img
          src={profile.avatar_url}
          alt={profile.name || profile.login}
          className="w-24 h-24 md:w-28 md:h-28 rounded-3xl object-cover border-2 border-[var(--card-border)] shadow-md shadow-orange-500/5 shrink-0"
        />

        <div className="space-y-3 flex-1">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]">
              {profile.name || profile.login}
            </h1>
            <span className="text-sm font-semibold text-orange-500">
              @{profile.login}
            </span>
          </div>

          <p className="text-xs md:text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            {profile.bio || 'This developer has not filled out a biography.'}
          </p>

          {/* Metadata Row */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-[var(--text-muted)] pt-1">
            {profile.company && (
              <span className="flex items-center gap-1">
                <Briefcase size={12} className="text-orange-400" />
                {profile.company}
              </span>
            )}
            {profile.location && (
              <span className="flex items-center gap-1">
                <MapPin size={12} className="text-orange-400" />
                {profile.location}
              </span>
            )}
            {profile.blog && (
              <a 
                href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-orange-500 transition-colors"
              >
                <LinkIcon size={12} className="text-orange-400" />
                {profile.blog}
              </a>
            )}
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              Joined {formatDate(profile.created_at)}
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="glass-card p-4 rounded-2xl flex flex-col gap-1 border border-[var(--card-border)]">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)] flex items-center gap-1">
            <Star size={12} className="text-amber-500" />
            Total Stars
          </span>
          <span className="text-xl font-black text-[var(--text-primary)]">
            {totalStars.toLocaleString()}
          </span>
        </div>

        {/* Metric 2 */}
        <div className="glass-card p-4 rounded-2xl flex flex-col gap-1 border border-[var(--card-border)]">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)] flex items-center gap-1">
            <GitFork size={12} className="text-orange-400" />
            Total Forks
          </span>
          <span className="text-xl font-black text-[var(--text-primary)]">
            {totalForks.toLocaleString()}
          </span>
        </div>

        {/* Metric 3 */}
        <div className="glass-card p-4 rounded-2xl flex flex-col gap-1 border border-[var(--card-border)]">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)] flex items-center gap-1">
            <BookOpen size={12} className="text-orange-500" />
            Repositories
          </span>
          <span className="text-xl font-black text-[var(--text-primary)]">
            {profile.public_repos.toLocaleString()}
          </span>
        </div>

        {/* Metric 4 */}
        <div className="glass-card p-4 rounded-2xl flex flex-col gap-1 border border-[var(--card-border)]">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)] flex items-center gap-1">
            <Users size={12} className="text-orange-400" />
            Followers
          </span>
          <span className="text-xl font-black text-[var(--text-primary)]">
            {profile.followers.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Visualizations Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart 1: Commit Frequency */}
        <div className="glass-card p-5 rounded-2xl border border-[var(--card-border)] flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Weekly Commit Frequencies</h3>
            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
              Distributions calculated from push events ({commitCount30Days} commits in last 30 days).
            </p>
          </div>
          <CommitChart data={activityData} />
        </div>

        {/* Chart 2: Language Distribution */}
        <div className="glass-card p-5 rounded-2xl border border-[var(--card-border)] flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Primary Languages</h3>
            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
              Shares of programming languages used across public repositories.
            </p>
          </div>
          <LanguageChart data={languageData} />
        </div>
      </div>

      {/* Source Repositories Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
          Featured Projects
        </h3>
        {sourceRepos.length === 0 ? (
          <div className="glass-card border-dashed p-8 rounded-2xl text-center text-xs text-[var(--text-muted)]">
            No public source repositories available.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sourceRepos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        )}
      </div>

      {/* Activity Feed */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
          Recent Public Activity Feed
        </h3>

        {recentActivity.length === 0 ? (
          <div className="glass-card border-dashed p-8 rounded-2xl text-center text-xs text-[var(--text-muted)]">
            No public events registered on GitHub in the last 90 days.
          </div>
        ) : (
          <div className="glass-card p-5 rounded-2xl border border-[var(--card-border)] divide-y divide-[var(--card-border)]">
            {recentActivity.map((event: any, i: number) => {
              const eventDate = new Date(event.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              let description = `Performed ${event.type}`;
              if (event.type === 'PushEvent') {
                const count = event.payload?.commits?.length || 1;
                description = `Pushed ${count} commit(s) to ${event.repo.name}`;
              } else if (event.type === 'CreateEvent') {
                description = `Created ${event.payload?.ref_type || 'repository'} in ${event.repo.name}`;
              } else if (event.type === 'WatchEvent') {
                description = `Starred repository ${event.repo.name}`;
              } else if (event.type === 'IssuesEvent') {
                description = `${event.payload?.action || 'Opened'} issue in ${event.repo.name}`;
              } else if (event.type === 'ForkEvent') {
                description = `Forked repository ${event.repo.name}`;
              }

              return (
                <div key={event.id || i} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-[var(--text-secondary)]">
                      {description}
                    </span>
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] shrink-0">
                    {eventDate}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}