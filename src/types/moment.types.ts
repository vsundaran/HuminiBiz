// ─── Moment Domain Types ──────────────────────────────────────────────────────

export interface Subcategory {
  _id: string;
  name: string;
  active?: boolean;
}

export interface Category {
  _id: string;
  name: string;
  subcategories: Subcategory[];
  active?: boolean;
}

export interface MomentUser {
  _id: string;
  name: string;
  jobRole: string;
  department: string;
}

export interface Moment {
  _id: string;
  userId: MomentUser;
  categoryId: Category;
  subcategoryId: string;
  description: string;
  startDateTime: string;       // ISO string
  endDateTime: string;         // ISO string
  active: boolean;
  likeCount: number;
  isLikedByMe: boolean;
  createdAt: string;
  updatedAt: string;
}

// Feed types returned by the server
export type MomentFeedType = 'live' | 'upcoming' | 'later';

// My moments response shape
export interface MyMomentsData {
  activeMoments: Moment[];
  expiredMoments: Moment[];
}

// Toggle like response
export interface ToggleLikeResponse {
  liked: boolean;
  likeCount: number;
}

// Create moment payload
export interface CreateMomentPayload {
  categoryId: string;
  subcategoryId: string;
  description: string;
  startDateTime: string;      // ISO string
  endDateTime: string;        // ISO string
}
