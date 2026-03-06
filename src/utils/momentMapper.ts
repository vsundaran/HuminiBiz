import { Moment } from '../types/moment.types';
import { MomentCardProps } from '../components/cards/MomentCard';

// ─── Format "Ends in X m / X h" for live, or "hh:mm AM/PM" for others ────────
const pad = (n: number) => String(n).padStart(2, '0');

const fmtTime = (date: Date): string => {
  const h = date.getHours();
  const m = date.getMinutes();
  const ampm = h >= 12 ? 'pm' : 'am';
  const hh = h % 12 || 12;
  return `${pad(hh)}:${pad(m)}${ampm}`;
};

const fmtDate = (date: Date): string => {
  const dd = pad(date.getDate());
  const mm = pad(date.getMonth() + 1);
  const yy = String(date.getFullYear()).slice(2);
  return `${dd}/${mm}/${yy}`;
};

export const formatTimeStr = (moment: Moment, feedType: 'live' | 'upcoming' | 'later'): string => {
  try {
    if (feedType === 'live') {
      const diffMs = new Date(moment.endDateTime).getTime() - Date.now();
      if (diffMs <= 0) return 'Ended';
      const mins = Math.ceil(diffMs / 60000);
      if (mins < 60) return `Ends in ${mins}m`;
      const hrs = Math.floor(mins / 60);
      const rem = mins % 60;
      return rem > 0 ? `Ends in ${hrs}h ${rem}m` : `Ends in ${hrs}h`;
    }
    return fmtTime(new Date(moment.startDateTime));
  } catch {
    return '';
  }
};

export const formatDateStr = (moment: Moment, feedType: 'live' | 'upcoming' | 'later'): string | undefined => {
  if (feedType === 'live') return undefined;
  try {
    return fmtDate(new Date(moment.startDateTime));
  } catch {
    return undefined;
  }
};

// ─── Master mapper: API Moment → MomentCard props ────────────────────────────
export const momentToCardProps = (
  moment: Moment,
  feedType: 'live' | 'upcoming' | 'later',
  isInCall?: boolean, // Optionally override with real-time socket state
): MomentCardProps => {
  // Extract the creator's user ID — userId can be a populated object or a plain string/ObjectId
  const userObj = moment.userId;
  const receiverId = userObj?._id
    ? String(userObj._id)
    : typeof userObj === 'string'
      ? userObj
      : '';

  return {
    momentId:        moment._id,
    // ── Call target info (creator = person being called) ──
    receiverId,
    receiverName:    userObj?.name ?? 'Unknown',
    receiverRole:    userObj?.jobRole ?? '',
    // ── Display info ──────────────────────────────────────
    userName:        userObj?.name ?? 'Unknown',
    userRole:        userObj?.jobRole ?? '',
    categoryName:    moment.categoryId?.name,
    subcategoryName: moment.subcategoryName,
    eventMessage:    moment.description,
    timeStr:         formatTimeStr(moment, feedType),
    dateStr:         formatDateStr(moment, feedType),
    buttonType:      feedType === 'live' ? 'ShareWishes' : 'NotifyMe',
    likesCount:      moment.likeCount ?? 0,
    isLikedByMe:     moment.isLikedByMe ?? false,
    // Real-time override takes priority; fall back to API value from initial load
    isInCall:        isInCall !== undefined ? isInCall : (moment.isInCall ?? false),
  };
};
