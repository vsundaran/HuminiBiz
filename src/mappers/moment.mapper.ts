import { Moment } from '../types/moment.types';

// ─── Timing Helpers ────────────────────────────────────────────────────────────

/**
 * Compute a human-readable time remaining string for a live moment.
 * Returns "Ends in Xm" or "Ends in Xh Ym"
 */
function computeEndsIn(endDateTime: string): string {
  const now = new Date();
  const end = new Date(endDateTime);
  const diffMs = end.getTime() - now.getTime();

  if (diffMs <= 0) {
    return 'Ended';
  }

  const totalMinutes = Math.round(diffMs / 60000);
  if (totalMinutes < 60) {
    return `Ends in ${totalMinutes}m`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return mins > 0 ? `Ends in ${hours}h ${mins}m` : `Ends in ${hours}h`;
}

/**
 * Compute a human-readable start time string for upcoming/later moments.
 * Returns "HH:MMAM - HH:MMPM"
 */
function formatTimeRange(startDateTime: string, endDateTime: string): string {
  const formatTime = (dt: string) => {
    const d = new Date(dt);
    let h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, '0');
    const period = h >= 12 ? 'PM' : 'AM';
    h = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${h}:${m}${period}`;
  };
  return `${formatTime(startDateTime)} - ${formatTime(endDateTime)}`;
}

/**
 * Format date as M/D/YY
 */
function formatDate(dateString: string): string {
  const d = new Date(dateString);
  return `${d.getMonth() + 1}/${d.getDate()}/${String(d.getFullYear()).slice(-2)}`;
}

// ─── Mapped UI Shape ────────────────────────────────────────────────────────────

export interface MomentCardUIData {
  momentId: string;
  /** The ID of the user who created this moment (used as receiverId for calls) */
  receiverId: string;
  receiverName: string;
  receiverRole: string;
  userName: string;
  userRole: string;
  eventType: string;
  eventMessage: string;
  timeStr?: string;
  dateStr?: string;
  buttonType: 'ShareWishes' | 'NotifyMe';
  likesCount: number;
  isLikedByMe: boolean;
  isInCall?: boolean;
}

/**
 * Map a server Moment → MomentCardUIData for live moments
 */
export function mapLiveMoment(moment: Moment): MomentCardUIData {
  const user = moment.userId;
  const subcategoryName = typeof moment.categoryId === 'object'
    ? (moment.categoryId as any).subcategories?.find?.((s: any) => s._id?.toString() === moment.subcategoryId)?.name
    : undefined;

  const eventType = subcategoryName
    ? subcategoryName.replace(/\s+/g, '')
    : (typeof moment.categoryId === 'object' ? (moment.categoryId as any).name : 'General');

  const userId = typeof user === 'object' && user !== null
    ? String((user as any)?._id ?? '')
    : String(user ?? '');

  return {
    momentId: moment._id,
    receiverId: userId,
    receiverName: user?.name ?? 'Unknown',
    receiverRole: user?.jobRole ?? '',
    userName: user?.name ?? 'Unknown',
    userRole: user?.jobRole ?? '',
    eventType,
    eventMessage: moment.description,
    timeStr: computeEndsIn(moment.endDateTime),
    buttonType: 'ShareWishes',
    likesCount: moment.likeCount,
    isLikedByMe: moment.isLikedByMe,
  };
}

/**
 * Map a server Moment → MomentCardUIData for upcoming/later moments
 */
export function mapUpcomingMoment(moment: Moment): MomentCardUIData {
  const user = moment.userId;
  const subcategoryName = (moment.categoryId as any)?.subcategories?.find?.(
    (s: any) => s._id?.toString() === moment.subcategoryId,
  )?.name;
  const eventType = subcategoryName
    ? subcategoryName.replace(/\s+/g, '')
    : (typeof moment.categoryId === 'object' ? (moment.categoryId as any).name : 'General');

  const userId = typeof user === 'object' && user !== null
    ? String((user as any)?._id ?? '')
    : String(user ?? '');

  return {
    momentId: moment._id,
    receiverId: userId,
    receiverName: user?.name ?? 'Unknown',
    receiverRole: user?.jobRole ?? '',
    userName: user?.name ?? 'Unknown',
    userRole: user?.jobRole ?? '',
    eventType,
    eventMessage: moment.description,
    dateStr: formatDate(moment.startDateTime),
    timeStr: formatTimeRange(moment.startDateTime, moment.endDateTime),
    buttonType: 'NotifyMe',
    likesCount: moment.likeCount,
    isLikedByMe: moment.isLikedByMe,
  };
}

/**
 * Map a "my active moment" to display in YourMoments tab
 */
export interface MyMomentUIData {
  id: string;
  categoryName: string;
  subcategoryName: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  active: boolean;
  isLive: boolean;
  timeStr?: string;
  dateStr?: string;
}

export function mapMyMoment(moment: Moment): MyMomentUIData {
  const now = new Date();
  const isLive = new Date(moment.endDateTime) > now && moment.active;

  return {
    id: moment._id,
    categoryName: (moment.categoryId as any)?.name ?? 'Unknown',
    subcategoryName: (moment.categoryId as any)?.subcategories?.find?.(
      (s: any) => s._id?.toString() === moment.subcategoryId,
    )?.name ?? '',
    description: moment.description,
    startDateTime: moment.startDateTime,
    endDateTime: moment.endDateTime,
    active: moment.active,
    isLive,
    timeStr: isLive ? computeEndsIn(moment.endDateTime) : undefined,
    dateStr: !isLive ? formatDate(moment.startDateTime) : undefined,
  };
}
