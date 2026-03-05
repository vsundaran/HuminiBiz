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
  feedType: 'live' | 'upcoming' | 'later'
): MomentCardProps => ({
  momentId:        moment._id,
  userName:        moment.userId?.name ?? 'Unknown',
  userRole:        moment.userId?.jobRole ?? '',
  categoryName:    moment.categoryId?.name,
  subcategoryName: moment.subcategoryName,
  eventMessage:    moment.description,
  timeStr:         formatTimeStr(moment, feedType),
  dateStr:         formatDateStr(moment, feedType),
  buttonType:      feedType === 'live' ? 'ShareWishes' : 'NotifyMe',
  likesCount:      moment.likeCount ?? 0,
  isLikedByMe:     moment.isLikedByMe ?? false,
});
