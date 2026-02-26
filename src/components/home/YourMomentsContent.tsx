import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import Svg, { Path, Defs, RadialGradient, LinearGradient, Stop, Circle, Rect } from 'react-native-svg';

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

// ─── Moment Card (Custom tab) ─────────────────────────────────────────────────

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

// ─── Subscribe Tab Content (Figma node 927-7862 / 1196-7098) ──────────────────

/**
 * The "Subscribe" inner tab — shows the "Morning Wishes" subscription card
 * with warm amber-peach gradient, decorative blobs, time pill, and
 * a prominent dark Subscribe button. Pixel-perfect from Figma.
 */
const SubscribeTabContent: React.FC = () => (
  <View style={styles.subscribeWrapper}>
    {/* ── Gradient card with decorative blobs ── */}
    <View style={styles.subscribeCard}>
      {/* Base linear gradient background: amber → peach */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width="100%" height="100%">
          <Defs>
            <LinearGradient id="cardBg" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="rgba(255,237,177,0.9)" />
              <Stop offset="100%" stopColor="rgb(255,236,226)" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#cardBg)" />
        </Svg>
      </View>

      {/* Decorative radial blob — top-left warm circle */}
      <View style={styles.blobTopLeft} pointerEvents="none">
        <Svg width={360} height={383} viewBox="0 0 360 383" fill="none">
          <Defs>
            <RadialGradient id="blobA" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <Stop offset="0%" stopColor="#FFE0A3" stopOpacity="0.9" />
              <Stop offset="100%" stopColor="#FFD580" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="130" cy="185" r="180" fill="url(#blobA)" opacity={0.6} />
        </Svg>
      </View>

      {/* Decorative radial blob — bottom-right peach circle (flipped) */}
      <View style={styles.blobBottomRight} pointerEvents="none">
        <Svg width={360} height={383} viewBox="0 0 360 383" fill="none">
          <Defs>
            <RadialGradient id="blobB" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <Stop offset="0%" stopColor="#FFB8A0" stopOpacity="0.7" />
              <Stop offset="100%" stopColor="#FFD9CC" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="230" cy="200" r="170" fill="url(#blobB)" opacity={0.55} />
        </Svg>
      </View>

      {/* ── Card Content ── */}

      {/* EVERYDAY label */}
      <Text style={styles.subEverydayLabel}>EVERYDAY</Text>

      {/* Morning Wishes title */}
      <Text style={styles.subTitle}>Morning Wishes</Text>

      {/* Time pill */}
      <View style={styles.subTimePill}>
        <Text style={styles.subTimePillText}>8:00 AM – 10:00AM</Text>
      </View>

      {/* Description */}
      <Text style={styles.subDescription}>
        Get a positive wish each morning subscribe and begin your day brighter.
      </Text>

      {/* Bottom fade overlay — fades out the description bottom edge */}
      <View style={styles.subFadeOverlay} pointerEvents="none" />

      {/* Subscribe CTA button */}
      <TouchableOpacity
        style={styles.subButton}
        activeOpacity={0.85}>
        <Text style={styles.subButtonText}>Subscribe</Text>
      </TouchableOpacity>

      {/* Footer note */}
      <Text style={styles.subFooterNote}>Modify or Unsubscribe anytime</Text>
    </View>
  </View>
);

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

// ─── Main YourMomentsContent ─────────────────────────────────────────────────

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

  // Active tab pill color: dark for Subscribe, blue for Custom/Archive (Figma spec)
  const getActiveTabStyle = (tab: InnerTab) => {
    if (tab !== activeInnerTab) return null;
    return tab === 'Subscribe' ? styles.innerTabActiveSubscribe : styles.innerTabActive;
  };

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
                style={[styles.innerTab, getActiveTabStyle(tab)]}>
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

      {/* ── Tab Content ── */}
      {activeInnerTab === 'Subscribe' ? (
        <SubscribeTabContent />
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {activeInnerTab === 'Custom' ? (
            moments.length === 0 ? (
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
            )
          ) : (
            /* Archive tab — empty for now */
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No archived moments</Text>
            </View>
          )}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      )}
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
  // Blue active (Custom / Archive)
  innerTabActive: {
    backgroundColor: COLORS.surfaceBluePrimary,
    shadowColor: 'rgba(72,86,92,0.29)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 11,
    elevation: 4,
  },
  // Dark active (Subscribe — matches Figma exactly)
  innerTabActiveSubscribe: {
    backgroundColor: '#263238',
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

  /* ── Subscribe Tab ── */
  subscribeWrapper: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  subscribeCard: {
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    // Warm amber → peach gradient simulated via backgroundColor + relative children
    backgroundColor: '#FFEDB1', // fallback base
    // Gradient achieved via inner linear gradient overlay approach
    height: 271,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Gradient background
  subscribeCardGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 24, // Match parent border radius
  },
  blobTopLeft: {
    position: 'absolute',
    left: -189,
    top: -198,
    width: 360,
    height: 383,
    opacity: 0.9,
  },
  blobBottomRight: {
    position: 'absolute',
    right: -142,
    top: -198,
    width: 360,
    height: 383,
    opacity: 0.9,
    transform: [{ scaleY: -1 }],
  },

  // "EVERYDAY" golden label
  subEverydayLabel: {
    fontFamily: FONTS.family,
    fontWeight: '700' as const,
    fontSize: 11,
    lineHeight: 18,
    letterSpacing: 1.2,
    color: 'rgba(125,101,0,0.8)',
    textAlign: 'center',
    marginBottom: 6,
  },
  // "Morning Wishes" title
  subTitle: {
    fontFamily: FONTS.family,
    fontWeight: '700' as const,
    fontSize: 20,
    lineHeight: 24,
    color: 'rgba(125,101,0,0.9)',
    textAlign: 'center',
    marginBottom: 12,
  },
  // Time pill
  subTimePill: {
    backgroundColor: 'rgba(255,252,239,0.6)',
    borderRadius: 130,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    paddingHorizontal: 17,
    paddingVertical: 4,
    alignSelf: 'center',
    marginBottom: 16,
  },
  subTimePillText: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.medium,
    fontSize: 12,
    lineHeight: 19,
    letterSpacing: 0.15,
    color: COLORS.textSubHeadline,
  },
  // Description
  subDescription: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.semiBold,
    fontSize: 14,
    lineHeight: 17,
    letterSpacing: 0.15,
    color: COLORS.textSubHeadline,
    textAlign: 'center',
    width: 225,
    marginBottom: 20,
  },
  // Soft fade overlay at the bottom of the description area
  subFadeOverlay: {
    position: 'absolute',
    bottom: 68,
    left: -6,
    right: -6,
    height: 76,
    // Gradient white fade from transparent → white (simulated via opacity-layered bg)
    backgroundColor: 'rgba(255,255,255,0)',
  },
  // Subscribe CTA button
  subButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#263238',
    borderRadius: 10,
    paddingHorizontal: 32,
    paddingVertical: 10,
    width: 258,
    // Inner shadows not directly possible in RN; simulated with opacity on button background
    shadowColor: 'rgba(72,86,92,0.29)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 11,
    elevation: 4,
  },
  subButtonText: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.medium,
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: 0.1,
    color: '#FDFEFF',
  },
  // "Modify or Unsubscribe anytime" note
  subFooterNote: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.medium,
    fontSize: 12,
    lineHeight: 19,
    letterSpacing: 0.15,
    color: COLORS.textBodyText1,
    textAlign: 'center',
    marginTop: 10,
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
