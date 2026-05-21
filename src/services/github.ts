import axios, { AxiosResponse } from 'axios';
import { useAppStore } from '../store/store';

const GITHUB_API_URL = 'https://api.github.com';

const client = axios.create({
  baseURL: GITHUB_API_URL,
  timeout: 15000, // 15s timeout
  headers: {
    Accept: 'application/vnd.github+json',
  },
});

// Helper to extract and update rate limits from headers
const updateRateLimit = (response: AxiosResponse) => {
  const limit = response.headers['x-ratelimit-limit'];
  const remaining = response.headers['x-ratelimit-remaining'];
  const reset = response.headers['x-ratelimit-reset'];

  if (limit !== undefined && remaining !== undefined && reset !== undefined) {
    useAppStore.getState().setRateLimit({
      limit: parseInt(limit, 10),
      remaining: parseInt(remaining, 10),
      reset: parseInt(reset, 10),
    });
  }
};

// Request interceptor to dynamically inject the token
client.interceptors.request.use((config) => {
  const token = useAppStore.getState().githubToken || process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  if (token) {
    config.headers.Authorization = `Bearer ${token.trim()}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to catch rate limit headers and errors
client.interceptors.response.use(
  (response) => {
    updateRateLimit(response);
    return response;
  },
  async (error) => {
    if (error.response) {
      updateRateLimit(error.response);
    }
    return Promise.reject(error);
  }
);

// GitHub API Types
export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  size: number;
  language: string | null;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  topics?: string[];
  license?: {
    key: string;
    name: string;
    spdx_id: string;
  } | null;
}

export interface GithubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GithubContributor {
  login: string;
  avatar_url: string;
  contributions: number;
  html_url: string;
}

export interface GithubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  author: {
    login: string;
    avatar_url: string;
  } | null;
}

export interface SearchReposResponse {
  total_count: number;
  items: GithubRepo[];
}

export interface SearchUsersResponse {
  total_count: number;
  items: GithubUser[];
}

// GitHub API Services
export const githubService = {
  async searchRepos(query: string, page = 1, perPage = 12): Promise<SearchReposResponse> {
    if (!query.trim()) return { total_count: 0, items: [] };
    const response = await client.get<SearchReposResponse>('/search/repositories', {
      params: { q: query, page, per_page: perPage },
    });
    return response.data;
  },

  async searchUsers(query: string, page = 1, perPage = 12): Promise<SearchUsersResponse> {
    if (!query.trim()) return { total_count: 0, items: [] };
    const response = await client.get<SearchUsersResponse>('/search/users', {
      params: { q: query, page, per_page: perPage },
    });
    return response.data;
  },

  async getUserProfile(username: string): Promise<GithubUser> {
    const response = await client.get<GithubUser>(`/users/${username}`);
    return response.data;
  },

  async getUserRepos(username: string, perPage = 100): Promise<GithubRepo[]> {
    const response = await client.get<GithubRepo[]>(`/users/${username}/repos`, {
      params: { per_page: perPage, sort: 'updated' },
    });
    return response.data;
  },

  async getRepoDetails(owner: string, name: string): Promise<GithubRepo> {
    const response = await client.get<GithubRepo>(`/repos/${owner}/${name}`);
    return response.data;
  },

  async getRepoLanguages(owner: string, name: string): Promise<Record<string, number>> {
    const response = await client.get<Record<string, number>>(`/repos/${owner}/${name}/languages`);
    return response.data;
  },

  async getRepoContributors(owner: string, name: string, perPage = 10): Promise<GithubContributor[]> {
    const response = await client.get<GithubContributor[]>(`/repos/${owner}/${name}/contributors`, {
      params: { per_page: perPage },
    });
    return response.data;
  },

  async getRepoCommits(owner: string, name: string, perPage = 30): Promise<GithubCommit[]> {
    const response = await client.get<GithubCommit[]>(`/repos/${owner}/${name}/commits`, {
      params: { per_page: perPage },
    });
    return response.data;
  },

  async getUserEvents(username: string, perPage = 100): Promise<any[]> {
    const response = await client.get<any[]>(`/users/${username}/events`, {
      params: { per_page: perPage },
    });
    return response.data;
  }
};