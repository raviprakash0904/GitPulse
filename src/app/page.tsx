'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, GitCompare, History, Flame, Pin, X, Users, BookOpen, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';
import { useAppStore } from '../store/store';
import { useDebounce } from '../hooks/useDebounce';
import { useSearchRepos, useSearchUsers, usePinnedRepos } from '../hooks/useGitHubApi';
import RepoCard, { RepoCardSkeleton } from '../components/RepoCard';
import UserCard, { UserCardSkeleton } from '../components/UserCard';

const SHOWCASE_REPOS = [
  'facebook/react',
  'vercel/next.js',
  'tailwindlabs/tailwindcss',
  'shadcn/ui',
];

export default function Dashboard() {
  const [searchInput, setSearchInput] = useState('');
  const [searchTab, setSearchTab] = useState<'repos' | 'users'>('repos');
  const [page, setPage] = useState(1);
  const [validationError, setValidationError] = useState('');
  
  const debouncedQuery = useDebounce(searchInput, 500);
  const { pinnedRepos, searchHistory, addSearchHistory, clearSearchHistory } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Input validation
  useEffect(() => {
    if (searchInput.trim() === '') {
      setValidationError('');
      return;
    }
    // Check if input contains invalid characters
    const validPattern = /^[a-zA-Z0-9-_\s./]+$/;
    if (!validPattern.test(searchInput)) {
      setValidationError('Please use only letters, numbers, spaces, or "-", "_", "/", "."');
    } else {
      setValidationError('');
    }
  }, [searchInput]);

  // Reset page when search or tab changes
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, searchTab]);

  // Add queries to history once debounced results are loaded (only if length > 2 and valid)
  useEffect(() => {
    const cleanQuery = debouncedQuery.trim();
    if (cleanQuery.length > 2 && !validationError) {
      addSearchHistory(cleanQuery);
    }
  }, [debouncedQuery, addSearchHistory, validationError]);

  // Fetch search results
  const activeQuery = !validationError ? debouncedQuery.trim() : '';

  const {
    data: repoResults,
    isLoading: repoLoading,
    isError: repoError,
    refetch: refetchRepos,
  } = useSearchRepos(searchTab === 'repos' ? activeQuery : '', page);

  const {
    data: userResults,
    isLoading: userLoading,
    isError: userError,
    refetch: refetchUsers,
  } = useSearchUsers(searchTab === 'users' ? activeQuery : '', page);

  // Fetch details of pinned and showcase repos to show on landing page
  const { data: pinnedRepoDetails, isLoading: pinnedLoading } = usePinnedRepos(
    activeQuery === '' ? pinnedRepos : []
  );

  const { data: showcaseRepoDetails, isLoading: showcaseLoading } = usePinnedRepos(
    activeQuery === '' ? SHOWCASE_REPOS : []
  );

  const handleClearSearch = () => {
    setSearchInput('');
  };

  const handleSelectHistory = (query: string) => {
    setSearchInput(query);
  };

  const handleRetry = () => {
    if (searchTab === 'repos') {
      refetchRepos();
    } else {
      refetchUsers();
    }
  };

  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <RefreshCw className="animate-spin text-orange-500 w-8 h-8" />
        <p className="text-sm text-[var(--text-muted)]">Spinning up GitPulse...</p>
      </div>
    );
  }

  const isLoading = searchTab === 'repos' ? repoLoading : userLoading;
  const isError = searchTab === 'repos' ? repoError : userError;
  const hasResults = searchTab === 'repos' 
    ? (repoResults?.items && repoResults.items.length > 0)
    : (userResults?.items && userResults.items.length > 0);
  const totalCount = searchTab === 'repos' ? (repoResults?.total_count || 0) : (userResults?.total_count || 0);
  const totalPages = Math.min(10, Math.ceil(totalCount / 12)); // limit to 10 pages due to GitHub search API limits

  return (
    <div className="flex flex-col gap-12 max-w-6xl mx-auto">
      {/* Hero Intro */}
      <div className="text-center space-y-4 max-w-2xl mx-auto mt-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 border border-orange-500/20 text-orange-500"
        >
          <Flame size={12} className="fill-orange-500" />
          The Developer Analytics Sandbox
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent"
        >
          Explore Open Source Pulse
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed max-w-lg mx-auto"
        >
          Instantly dissect repositories, analyze developer profiles, and compare key metrics in a sleek, unified startup workspace.
        </motion.p>
      </div>

      {/* Unified Search Panel */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="w-full max-w-2xl mx-auto"
      >
        <div className="glass-card p-2.5 rounded-3xl shadow-xl flex flex-col gap-2 border border-[var(--card-border)]">
          <div className="flex items-center gap-2 bg-orange-500/5 dark:bg-stone-900/60 p-1.5 rounded-2xl border border-[var(--card-border)]/50">
            <Search className="text-[var(--text-muted)] ml-3 shrink-0" size={18} />
            <input
              type="text"
              placeholder={searchTab === 'repos' ? "Search repositories (e.g. facebook/react)..." : "Search developers (e.g. gaearon)..."}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1 bg-transparent border-none py-2 px-1 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none w-full"
            />
            {searchInput && (
              <button
                onClick={handleClearSearch}
                className="p-1.5 rounded-xl hover:bg-orange-500/10 text-[var(--text-muted)] hover:text-orange-500 transition-colors shrink-0 cursor-pointer"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Validation Alert */}
          {validationError && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-500 bg-red-500/5 border border-red-500/20 rounded-xl">
              <AlertCircle size={13} className="shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Tab Toggles */}
          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex gap-2">
              <button
                onClick={() => setSearchTab('repos')}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold tracking-wide cursor-pointer transition-all duration-200 border ${
                  searchTab === 'repos'
                    ? 'bg-orange-500/10 border-orange-500/30 text-orange-500'
                    : 'border-transparent text-[var(--text-secondary)] hover:bg-stone-500/10 hover:text-[var(--text-primary)]'
                }`}
              >
                Repositories
              </button>
              <button
                onClick={() => setSearchTab('users')}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold tracking-wide cursor-pointer transition-all duration-200 border ${
                  searchTab === 'users'
                    ? 'bg-orange-500/10 border-orange-500/30 text-orange-500'
                    : 'border-transparent text-[var(--text-secondary)] hover:bg-stone-500/10 hover:text-[var(--text-primary)]'
                }`}
              >
                Developers
              </button>
            </div>

            <span className="text-[10px] text-[var(--text-muted)] font-medium mr-1.5">
              Press enter or type to search
            </span>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="w-full">
        <AnimatePresence mode="wait">
          {/* SEARCH ACTIVE STATE */}
          {activeQuery !== '' ? (
            <motion.div
              key="search-results-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center px-2">
                <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                  Search Results for &quot;{activeQuery}&quot;
                  <span className="text-xs font-normal text-[var(--text-muted)]">
                    ({totalCount.toLocaleString()} found)
                  </span>
                </h2>
              </div>

              {/* Skeletons Loading */}
              {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {Array.from({ length: 6 }).map((_, i) => 
                    searchTab === 'repos' ? <RepoCardSkeleton key={i} /> : <UserCardSkeleton key={i} />
                  )}
                </div>
              )}

              {/* Error State */}
              {isError && !isLoading && (
                <div className="glass-card p-10 rounded-3xl border border-red-500/20 bg-red-500/5 text-center max-w-md mx-auto space-y-4 shadow-lg">
                  <AlertCircle className="text-red-500 w-10 h-10 mx-auto" />
                  <div>
                    <h3 className="text-sm font-bold text-red-500">API Query Refused</h3>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      GitHub rate limit may be exhausted. Double check your internet, or try attaching a Personal Access Token in the bottom-right indicator.
                    </p>
                  </div>
                  <button
                    onClick={handleRetry}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-red-500 text-white hover:opacity-90 shadow-md cursor-pointer transition-opacity"
                  >
                    <RefreshCw size={12} />
                    Retry Search
                  </button>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && !isError && !hasResults && (
                <div className="glass-card p-12 rounded-3xl text-center max-w-md mx-auto space-y-3">
                  <div className="text-3xl">🔍</div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">No matches found</h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Verify spelling or search terms. The GitHub database contains millions of users and codebases.
                  </p>
                </div>
              )}

              {/* Results Grid */}
              {!isLoading && !isError && hasResults && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {searchTab === 'repos'
                    ? (repoResults?.items || []).map((repo) => <RepoCard key={repo.id} repo={repo} />)
                    : (userResults?.items || []).map((user) => <UserCard key={user.id} user={user} />)
                  }
                </div>
              )}

              {/* Pagination */}
              {!isLoading && !isError && hasResults && totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-6 select-none">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-3.5 py-1.5 rounded-xl border border-[var(--card-border)] glass-card text-xs font-semibold text-[var(--text-secondary)] hover:text-orange-500 hover:border-orange-500/30 transition-all disabled:opacity-40 disabled:hover:text-[var(--text-secondary)] disabled:hover:border-[var(--card-border)] cursor-pointer disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-xs text-[var(--text-muted)] font-medium">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-3.5 py-1.5 rounded-xl border border-[var(--card-border)] glass-card text-xs font-semibold text-[var(--text-secondary)] hover:text-orange-500 hover:border-orange-500/30 transition-all disabled:opacity-40 disabled:hover:text-[var(--text-secondary)] disabled:hover:border-[var(--card-border)] cursor-pointer disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            /* DEFAULT LANDING PANEL (Search history, pinned, trending showcases) */
            <motion.div
              key="landing-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              {/* Search History Row */}
              {searchHistory.length > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                      <History size={13} />
                      Recent Explorations
                    </h3>
                    <button
                      onClick={clearSearchHistory}
                      className="text-[10px] font-semibold text-orange-500 hover:opacity-85 cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {searchHistory.map((query, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectHistory(query)}
                        className="px-3 py-1.5 rounded-xl border border-[var(--card-border)] glass-card text-xs text-[var(--text-secondary)] hover:text-orange-500 hover:border-orange-500/30 transition-all cursor-pointer"
                      >
                        {query}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Pinned Repositories Grid */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                  <Pin size={13} className="text-orange-500" />
                  Bookmarked Workspaces
                </h3>

                {pinnedRepos.length === 0 ? (
                  <div className="glass-card border-dashed p-8 rounded-2xl text-center text-xs text-[var(--text-muted)]">
                    No repositories bookmarked yet. Click the pin icon in repository cards to quick-save workspaces here.
                  </div>
                ) : pinnedLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {pinnedRepos.map((_, i) => <RepoCardSkeleton key={i} />)}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {(pinnedRepoDetails || []).map((repo) => (
                      <RepoCard key={repo.id} repo={repo} />
                    ))}
                  </div>
                )}
              </div>

              {/* Showcase Repositories Grid */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                  <Users size={13} />
                  Trending Showcases
                </h3>

                {showcaseLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {SHOWCASE_REPOS.map((_, i) => <RepoCardSkeleton key={i} />)}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {(showcaseRepoDetails || []).map((repo) => (
                      <RepoCard key={repo.id} repo={repo} />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}