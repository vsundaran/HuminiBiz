import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { COLORS, FONTS } from '../../theme';
import { PlusIcon } from '../icons/PlusIcon';

// ─── Types ────────────────────────────────────────────────────────────────────

type InnerTab = 'Custom' | 'Subscribe' | 'Archive';

type CategoryType = 'Wishes' | 'Motivation';

type MomentCardData = {
  id: string;
  category: CategoryType;
  categoryLabel: string;
  subLabel: string;
  status: 'Active' | 'Scheduled';
  message: string;
  timeStr?: string;
  dateStr?: string;
  timeRange?: string;
  headerBg: string;
  titleColor: string;
  subColor: string;
};

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const ClockIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Path
      d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0.5 8a7.5 7.5 0 1 1 15 0 7.5 7.5 0 0 1-15 0z"
      fill={COLORS.textBodyText1}
    />
    <Path
      d="M8 4a.5.5 0 0 1 .5.5v3.293l2.354 2.353a.5.5 0 0 1-.708.708L7.646 8.354A.5.5 0 0 1 7.5 8V4.5A.5.5 0 0 1 8 4z"
      fill={COLORS.textBodyText1}
    />
  </Svg>
);

const CalendarIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Path
      d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"
      fill={COLORS.textBodyText1}
    />
  </Svg>
);

// ─── Category Icon ────────────────────────────────────────────────────────────

const CategoryIcon = ({ type }: { type: CategoryType }) => {
  if (type === 'Wishes') {
    return (
      <View style={[styles.categoryIconBox, { backgroundColor: '#E3FFCF' }]}>
        <Text style={styles.categoryEmoji}>🎁</Text>
      </View>
    );
  }
  return (
    <View style={[styles.categoryIconBox, { backgroundColor: '#FFE7E7' }]}>
      <Text style={styles.categoryEmoji}>🔥</Text>
    </View>
  );
};

// ─── Moment Card ──────────────────────────────────────────────────────────────

type MomentCardProps = {
  data: MomentCardData;
  enabled: boolean;
  onToggle: (id: string) => void;
  onArchive: (id: string) => void;
};

const MomentCard = React.memo(({ data, enabled, onToggle, onArchive }: MomentCardProps) => (
  <View style={styles.card}>
    {/* Header strip */}
    <View style={[styles.cardHeader, { backgroundColor: data.headerBg }]}>
      <View style={styles.cardHeaderLeft}>
        <CategoryIcon type={data.category} />
        <View style={styles.cardHeaderText}>
          <Text style={[styles.cardTitle, { color: data.titleColor }]}>
            {data.categoryLabel}
          </Text>
          <Text style={[styles.cardSubLabel, { color: data.subColor }]}>
            {data.subLabel}
          </Text>
          <Text style={styles.cardStatus}>Status: {data.status}</Text>
        </View>
      </View>
      <Switch
        value={enabled}
        onValueChange={() => onToggle(data.id)}
        trackColor={{ false: '#EDEDED', true: '#EDEDED' }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#EDEDED"
        style={styles.toggle}
      />
    </View>

    {/* Body */}
    <View style={styles.cardDividerContainer}>
      <View style={styles.cardBody}>
        <Text style={styles.cardMessage}>{data.message}</Text>
        <View style={styles.divider} />
        <View style={styles.cardFooter}>
          <View style={styles.timeRow}>
            {data.timeStr && (
              <>
                <ClockIcon />
                <Text style={styles.timeText}>{data.timeStr}</Text>
              </>
            )}
            {data.dateStr && (
              <>
                <CalendarIcon />
                <Text style={styles.timeText}>{data.dateStr}</Text>
                {data.timeRange && (
                  <Text style={styles.timeText}>{data.timeRange}</Text>
                )}
              </>
            )}
          </View>
          <TouchableOpacity
            style={styles.archiveButton}
            onPress={() => onArchive(data.id)}
            activeOpacity={0.75}>
            <Text style={styles.archiveText}>Archive</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </View>
));

// ─── Initial Data ─────────────────────────────────────────────────────────────

const INITIAL_MOMENTS: MomentCardData[] = [
  {
    id: '1',
    category: 'Wishes',
    categoryLabel: 'Wishes',
    subLabel: 'Work anniversary',
    status: 'Active',
    message:
      'Today is my work anniversary! Feel free to call me and share your wishes or celebrate this moment together.',
    timeStr: 'Ends in 50m',
    headerBg: '#F3FDEC',
    titleColor: '#486333',
    subColor: 'rgba(72,99,51,0.9)',
  },
  {
    id: '2',
    category: 'Motivation',
    categoryLabel: 'Motivation',
    subLabel: 'Deadline Stress',
    status: 'Scheduled',
    message:
      "I'm facing a tough deadline today, feel free to call and motivate me.",
    dateStr: '12/3/26',
    timeRange: '11:00AM-12:00PM',
    headerBg: '#FFF3EF',
    titleColor: '#804343',
    subColor: 'rgba(128,67,67,0.9)',
  },
];

// ─── Main Content Component ───────────────────────────────────────────────────

/**
 * The "Your Moments" tab content — inner tabs (Custom/Subscribe/Archive),
 * moment cards, and FAB. Self-contained with no navigation dependency.
 * Rendered inside HomeScreen when the "Your Moments" tab is active.
 */
export const YourMomentsContent: React.FC = () => {
  const [activeInnerTab, setActiveInnerTab] = useState<InnerTab>('Custom');
  const [moments, setMoments] = useState(INITIAL_MOMENTS);
  const [enabledMap, setEnabledMap] = useState<Record<string, boolean>>({
    '1': false,
    '2': false,
  });

  const handleToggle = useCallback((id: string) => {
    setEnabledMap(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleArchive = useCallback((id: string) => {
    setMoments(prev => prev.filter(m => m.id !== id));
  }, []);

  return (
    <>
      {/* ── Inner top tabs: Custom / Subscribe / Archive ── */}
      <View style={styles.innerTabsContainer}>
        <View style={styles.innerTabsWrapper}>
          {(['Custom', 'Subscribe', 'Archive'] as InnerTab[]).map(tab => {
            const isActive = activeInnerTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveInnerTab(tab)}
                activeOpacity={0.8}
                style={[styles.innerTab, isActive && styles.innerTabActive]}>
                <Text
                  style={[
                    styles.innerTabText,
                    isActive ? styles.innerTabTextActive : styles.innerTabTextInactive,
                  ]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── Moment Cards ── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {moments.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No moments yet</Text>
          </View>
        ) : (
          moments.map(moment => (
            <MomentCard
              key={moment.id}
              data={moment}
              enabled={enabledMap[moment.id] ?? false}
              onToggle={handleToggle}
              onArchive={handleArchive}
            />
          ))
        )}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* ── FAB ── */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
        <PlusIcon size={24} color={COLORS.primary} />
      </TouchableOpacity>
    </>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  /* Inner top tabs */
  innerTabsContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
  },
  innerTabsWrapper: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    height: 46,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  innerTab: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerTabActive: {
    backgroundColor: COLORS.surfaceBluePrimary,
    shadowColor: 'rgba(72,86,92,0.29)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 11,
    elevation: 4,
  },
  innerTabText: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.sm,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  innerTabTextActive: {
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.white,
  },
  innerTabTextInactive: {
    fontWeight: FONTS.weights.medium,
    color: COLORS.textPlaceholder,
  },

  /* Scroll */
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 20,
    gap: 16,
  },
  bottomSpacer: {
    height: 120,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.md,
    color: COLORS.textBodyText1,
  },

  /* Moment Card */
  card: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  categoryIconBox: {
    width: 60,
    height: 58,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  categoryEmoji: {
    fontSize: 28,
    lineHeight: 36,
  },
  cardHeaderText: {
    flex: 1,
    gap: 3,
  },
  cardTitle: {
    fontFamily: FONTS.family,
    fontWeight: '700' as const,
    fontSize: 14,
    lineHeight: 18,
  },
  cardSubLabel: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.semiBold,
    fontSize: 13,
    lineHeight: 18,
  },
  cardStatus: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.semiBold,
    fontSize: 10,
    lineHeight: 14,
    color: COLORS.textBodyText1,
  },
  toggle: {
    transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }],
  },

  /* Card body */
  cardDividerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 0,
  },
  cardBody: {
    gap: 14,
    paddingTop: 12,
    paddingBottom: 16,
  },
  cardMessage: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.semiBold,
    fontSize: 15,
    lineHeight: 20,
    color: COLORS.textSubHeadline,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
  },
  timeText: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.medium,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textBodyText1,
  },
  archiveButton: {
    backgroundColor: '#E9EBEB',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  archiveText: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.medium,
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: 0.1,
    color: COLORS.textSubHeadline,
  },

  /* FAB */
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 10,
    width: 58,
    height: 58,
    backgroundColor: '#FFE15B',
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 20,
  },
});
