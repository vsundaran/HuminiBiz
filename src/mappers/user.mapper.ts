import { UserProfile, LeaderboardEntry } from '../types/user.types';

/**
 * Extract initials from a full name string.
 * "John Doe" → "JD", "John" → "J", "Unknown" → "U"
 */
export function getInitials(name: string): string {
  if (!name || name.trim().length === 0) {
    return 'U';
  }
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Map raw server user response to a cleaner UserProfile shape
 */
export function mapUserProfile(raw: any): UserProfile {
  return {
    id: raw.id ?? raw._id ?? '',
    name: raw.name ?? '',
    email: raw.email ?? '',
    jobRole: raw.jobRole ?? '',
    department: raw.department ?? '',
    organizationId: raw.organizationId ?? '',
    isProfileUpdated: raw.isProfileUpdated ?? false,
  };
}

/**
 * Map leaderboard entries with safe defaults
 */
export function mapLeaderboard(raw: any[]): LeaderboardEntry[] {
  return (raw ?? []).map(entry => ({
    userId: entry.userId ?? '',
    name: entry.name ?? 'Unknown',
    jobRole: entry.jobRole ?? '',
    minutes: entry.minutes ?? 0,
  }));
}
