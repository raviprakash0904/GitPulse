'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, GitFork, AlertCircle, RefreshCw, Calendar, FileCode, Users, Database, Clipboard } from 'lucide-react';
import { useRepoDetails, useRepoLanguages, useRepoContributors, useRepoCommits } from '@/hooks/useGitHubApi';
import LanguageChart from '@/components/charts/LanguageChart';
import ContributorChart from '@/components/charts/ContributorChart';
import { formatDate, formatBytes, formatCompactNumber } from '@/utils/format';

interface PageProps {
  params: Promise<{ owner: string; name: string }>;
}

export default function RepoDetailsPage({ params }: PageProps) {
  const { owner, name } = use(params);

  // Fetch all details in parallel using React Query hooks
  const {
    data: repo,
    isLoading: repoLoading,
    isError: repoError,
    refetch: refetchRepo,
  } = useRepoDetails(owner, name);

  const {
    data: languages,
    isLoading: langLoading,
    isError: langError,
    refetch: refetchLang,
  } = useRepoLanguages(owner, name);

  const {
    data: contributors,
    isLoading: contribLoading,
    isError: contribError,
    refetch: refetchContrib,
  } = useRepoContributors(owner, name);

  const {
    data: commits,
    isLoading: commitsLoading,
    isError: commitsError,
    refetch: refetchCommits,
  } = useRepoCommits(owner, name);

  const handleRetryAll = () => {
    refetchRepo();
    refetchLang();
    refetchContrib();
    refetchCommits();
  };

  const isLoading = repoLoading || langLoading || contribLoading || commitsLoading;
  const isError = repoError || langError || contribError || commitsError;

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse max-w-5xl mx-auto">
        <div className="w-24 h-4 bg-stone-500/20 rounded" />
        <div className="space-y-3">
          <div className="w-64 h-6 bg-stone-500/20 rounded" />
          <div className="w-full h-4 bg-stone-500/20 rounded" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-stone-500/10" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-80 rounded-2xl bg-stone-500/10" />
          <div className="h-80 rounded-2xl bg-stone-500/10" />
        </div>
      </div>
    );
  }

  if (isError || !repo) {
    return (
      <div className="glass-card p-10 rounded-3xl border border-red-500/20 bg-red-500/5 text-center max-w-md mx-auto space-y-4 shadow-lg my-12">
        <AlertCircle className="text-red-500 w-10 h-10 mx-auto" />
        <div>
          <h3 className="text-sm font-bold text-red-500">Failed to Retrieve Repository</h3>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            GitHub was unable to find repository &quot;{owner}/{name}&quot;. The repository may be private or your API rate limits may be exhausted.
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
            onClick={handleRetryAll}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-red-500 text-white hover:opacity-90 shadow-md transition-opacity cursor-pointer"
          >
            <RefreshCw size={12} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Format languages bytes to percentage/value array
  const totalBytes = Object.values(languages || {}).reduce((a, b) => a + b, 0);
  const languageData = Object.entries(languages || {}).map(([key, bytes]) => ({
    name: key,
    value: parseFloat(((bytes / (totalBytes || 1)) * 100).toFixed(1)),
    bytes,
  })).sort((a, b) => b.value - a.value);

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

      {/* Repository Title Profile */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Link 
                href={`/user/${repo.owner.login}`}
                className="text-sm font-semibold text-orange-500 hover:underline"
              >
                {repo.owner.login}
              </Link>
              <span className="text-[var(--text-muted)]">/</span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]">
                {repo.name}
              </h1>
              {repo.license && (
                <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase bg-stone-500/10 border border-stone-500/20 text-[var(--text-muted)]">
                  {repo.license.spdx_id || repo.license.key}
                </span>
              )}
            </div>
            
            <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed max-w-3xl">
              {repo.description || 'No description available for this repository.'}
            </p>
          </div>

          <div className="shrink-0 flex gap-2">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-500/10 hover:bg-orange-500/15 border border-orange-500/20 hover:border-orange-500/30 text-orange-500 transition-colors"
            >
              View on GitHub
            </a>
          </div>
        </div>

        {/* Metadata info */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-[var(--text-muted)]">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            Created {formatDate(repo.created_at)}
          </span>
          <span className="flex items-center gap-1">
            <RefreshCw size={12} className="w-3 h-3" />
            Last updated {formatDate(repo.updated_at)}
          </span>
        </div>
      </div>

      {/* Core Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: Stars */}
        <div className="glass-card p-4 rounded-2xl flex flex-col gap-1 border border-[var(--card-border)]">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)] flex items-center gap-1">
            <Star size={12} className="text-amber-500" />
            Stars
          </span>
          <span className="text-xl font-black text-[var(--text-primary)]">
            {repo.stargazers_count.toLocaleString()}
          </span>
        </div>

        {/* Metric 2: Forks */}
        <div className="glass-card p-4 rounded-2xl flex flex-col gap-1 border border-[var(--card-border)]">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)] flex items-center gap-1">
            <GitFork size={12} className="text-orange-400" />
            Forks
          </span>
          <span className="text-xl font-black text-[var(--text-primary)]">
            {repo.forks_count.toLocaleString()}
          </span>
        </div>

        {/* Metric 3: Size */}
        <div className="glass-card p-4 rounded-2xl flex flex-col gap-1 border border-[var(--card-border)]">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)] flex items-center gap-1">
            <Database size={12} />
            Storage Size
          </span>
          <span className="text-xl font-black text-[var(--text-primary)]">
            {formatBytes(repo.size)}
          </span>
        </div>

        {/* Metric 4: Open Issues */}
        <div className="glass-card p-4 rounded-2xl flex flex-col gap-1 border border-[var(--card-border)]">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)] flex items-center gap-1">
            <AlertCircle size={12} className="text-orange-500" />
            Open Issues
          </span>
          <span className="text-xl font-black text-[var(--text-primary)]">
            {repo.open_issues_count.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Languages share donut chart */}
        <div className="glass-card p-5 rounded-2xl border border-[var(--card-border)] flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Codebase Language Composition</h3>
            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
              Calculated from compiled bytes size ({formatBytes(repo.size)} total).
            </p>
          </div>
          <LanguageChart data={languageData.map(l => ({ name: l.name, value: l.bytes }))} />
        </div>

        {/* Top Contributors column chart */}
        <div className="glass-card p-5 rounded-2xl border border-[var(--card-border)] flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Top Contributors</h3>
            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
              Git commit frequency rankings for core authors.
            </p>
          </div>
          <ContributorChart data={contributors || []} />
        </div>
      </div>

      {/* Commits List */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
          <Clipboard size={13} />
          Recent Commit Activity Stream
        </h3>

        {!commits || commits.length === 0 ? (
          <div className="glass-card border-dashed p-8 rounded-2xl text-center text-xs text-[var(--text-muted)]">
            No public commits registered.
          </div>
        ) : (
          <div className="glass-card p-5 rounded-2xl border border-[var(--card-border)] divide-y divide-[var(--card-border)]">
            {commits.map((c) => {
              const date = new Date(c.commit.author.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div key={c.sha} className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-4 text-xs">
                  <div className="space-y-1 overflow-hidden">
                    <p className="font-semibold text-[var(--text-primary)] hover:text-orange-500 transition-colors line-clamp-1">
                      {c.commit.message}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)]">
                      {c.author?.avatar_url && (
                        <img
                          src={c.author.avatar_url}
                          alt={c.commit.author.name}
                          className="w-4 h-4 rounded-full border border-[var(--card-border)]"
                        />
                      )}
                      <span>
                        by{' '}
                        {c.author?.login ? (
                          <Link href={`/user/${c.author.login}`} className="font-semibold text-[var(--text-secondary)] hover:text-orange-500">
                            {c.author.login}
                          </Link>
                        ) : (
                          c.commit.author.name
                        )}
                      </span>
                      <span>•</span>
                      <span className="font-mono">{c.sha.slice(0, 7)}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] shrink-0 pt-0.5">
                    {date}
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