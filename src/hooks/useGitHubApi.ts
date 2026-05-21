import { useQuery } from '@tanstack/react-query';
import { githubService } from '../services/github';

export function useSearchRepos(query: string, page = 1) {
  return useQuery({
    queryKey: ['search-repos', query, page],
    queryFn: () => githubService.searchRepos(query, page),
    enabled: !!query.trim(),
    staleTime: 60000, // 1 min cache
  });
}

export function useSearchUsers(query: string, page = 1) {
  return useQuery({
    queryKey: ['search-users', query, page],
    queryFn: () => githubService.searchUsers(query, page),
    enabled: !!query.trim(),
    staleTime: 60000,
  });
}

export function useUserProfile(username: string) {
  return useQuery({
    queryKey: ['user-profile', username],
    queryFn: () => githubService.getUserProfile(username),
    enabled: !!username,
    staleTime: 120000, // 2 min cache
  });
}

export function useUserRepos(username: string) {
  return useQuery({
    queryKey: ['user-repos', username],
    queryFn: () => githubService.getUserRepos(username),
    enabled: !!username,
    staleTime: 120000,
  });
}

export function useRepoDetails(owner: string, name: string) {
  return useQuery({
    queryKey: ['repo-details', owner, name],
    queryFn: () => githubService.getRepoDetails(owner, name),
    enabled: !!owner && !!name,
    staleTime: 120000,
  });
}

export function useRepoLanguages(owner: string, name: string) {
  return useQuery({
    queryKey: ['repo-languages', owner, name],
    queryFn: () => githubService.getRepoLanguages(owner, name),
    enabled: !!owner && !!name,
    staleTime: 300000, // 5 min cache
  });
}

export function useRepoContributors(owner: string, name: string) {
  return useQuery({
    queryKey: ['repo-contributors', owner, name],
    queryFn: () => githubService.getRepoContributors(owner, name),
    enabled: !!owner && !!name,
    staleTime: 300000,
  });
}

export function useRepoCommits(owner: string, name: string) {
  return useQuery({
    queryKey: ['repo-commits', owner, name],
    queryFn: () => githubService.getRepoCommits(owner, name),
    enabled: !!owner && !!name,
    staleTime: 120000,
  });
}

// Hook to fetch details for multiple pinned repositories in parallel
export function usePinnedRepos(repoFullNames: string[]) {
  return useQuery({
    queryKey: ['pinned-repos', repoFullNames],
    queryFn: async () => {
      if (!repoFullNames || repoFullNames.length === 0) return [];
      const promises = repoFullNames.map(async (fullName) => {
        const [owner, name] = fullName.split('/');
        if (!owner || !name) return null;
        try {
          return await githubService.getRepoDetails(owner, name);
        } catch (e) {
          console.error(`Failed to load details for pinned repo ${fullName}`, e);
          return null;
        }
      });
      const results = await Promise.all(promises);
      return results.filter(Boolean) as any[];
    },
    enabled: repoFullNames && repoFullNames.length > 0,
    staleTime: 120000,
  });
}

// Composite hook for developer analytics
export function useDeveloperAnalytics(username: string) {
  return useQuery({
    queryKey: ['developer-analytics', username],
    queryFn: async () => {
      const [profile, repos, events] = await Promise.all([
        githubService.getUserProfile(username),
        githubService.getUserRepos(username),
        githubService.getUserEvents(username).catch(() => []), // gracefully handle events failure
      ]);

      // Calculate languages summary across all user repos
      const languages: Record<string, number> = {};
      let totalStars = 0;
      let totalForks = 0;
      
      repos.forEach(repo => {
        totalStars += repo.stargazers_count;
        totalForks += repo.forks_count;
        if (repo.language) {
          languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
      });

      const languageData = Object.entries(languages)
        .map(([name, count]) => ({ name, value: count }))
        .sort((a, b) => b.value - a.value);

      // Analyze push events to build weekly activity graph
      const activityData = [
        { name: 'Mon', commits: 0 },
        { name: 'Tue', commits: 0 },
        { name: 'Wed', commits: 0 },
        { name: 'Thu', commits: 0 },
        { name: 'Fri', commits: 0 },
        { name: 'Sat', commits: 0 },
        { name: 'Sun', commits: 0 },
      ];

      let commitCount30Days = 0;
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      events.forEach(event => {
        if (event.type === 'PushEvent' && event.created_at) {
          const eventDate = new Date(event.created_at);
          
          // Weekly distribution
          const day = eventDate.getDay(); // 0 is Sun, 1 is Mon...
          const adjustedDay = day === 0 ? 6 : day - 1; // Map Sun to index 6, Mon to 0...
          
          const commitsInPush = event.payload?.commits?.length || 1;
          activityData[adjustedDay].commits += commitsInPush;

          // 30 days active commits count
          if (eventDate >= thirtyDaysAgo) {
            commitCount30Days += commitsInPush;
          }
        }
      });

      return {
        profile,
        repos,
        totalStars,
        totalForks,
        languageData,
        activityData,
        commitCount30Days,
        recentActivity: events.slice(0, 10),
      };
    },
    enabled: !!username,
    staleTime: 120000,
  });
}