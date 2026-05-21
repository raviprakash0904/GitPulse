import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp
}

interface AppState {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  githubToken: string | null;
  setGithubToken: (token: string | null) => void;
  pinnedRepos: string[]; // formatted as "owner/name"
  pinRepo: (repo: string) => void;
  unpinRepo: (repo: string) => void;
  searchHistory: string[];
  addSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  // Transient rate limit state
  rateLimit: RateLimitInfo | null;
  setRateLimit: (info: RateLimitInfo) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'dark',
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark',
        })),
      setTheme: (theme) => set({ theme }),
      githubToken: null,
      setGithubToken: (token) => set({ githubToken: token }),
      pinnedRepos: ['facebook/react', 'vercel/next.js', 'tailwindlabs/tailwindcss'], // Default starter pins
      pinRepo: (repo) =>
        set((state) => {
          const lowerRepo = repo.toLowerCase();
          if (state.pinnedRepos.some((r) => r.toLowerCase() === lowerRepo)) {
            return {};
          }
          return { pinnedRepos: [repo, ...state.pinnedRepos] };
        }),
      unpinRepo: (repo) =>
        set((state) => {
          const lowerRepo = repo.toLowerCase();
          return {
            pinnedRepos: state.pinnedRepos.filter((r) => r.toLowerCase() !== lowerRepo),
          };
        }),
      searchHistory: [],
      addSearchHistory: (query) =>
        set((state) => {
          if (!query.trim()) return {};
          const filtered = state.searchHistory.filter((q) => q.toLowerCase() !== query.toLowerCase());
          return {
            searchHistory: [query, ...filtered].slice(0, 8),
          };
        }),
      clearSearchHistory: () => set({ searchHistory: [] }),
      rateLimit: null,
      setRateLimit: (info) => set({ rateLimit: info }),
    }),
    {
      name: 'gitpulse-storage',
      // Only persist theme, githubToken, pinnedRepos, and searchHistory
      partialize: (state) => ({
        theme: state.theme,
        githubToken: state.githubToken,
        pinnedRepos: state.pinnedRepos,
        searchHistory: state.searchHistory,
      }),
    }
  )
);