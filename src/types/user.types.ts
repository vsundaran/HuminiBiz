// ─── User Domain Types ────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  jobRole: string;
  department: string;
  organizationId: string;
  isProfileUpdated: boolean;
}

export interface UserStats {
  totalMinutes: number;
  joyGiven: number;
  joyReceived: number;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  jobRole: string;
  minutes: number;
}

export interface UpdateProfilePayload {
  name: string;
  department: string;
  jobRole: string;
}
