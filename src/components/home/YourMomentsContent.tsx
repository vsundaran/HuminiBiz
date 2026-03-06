import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { AnimatedSwitch } from '../common/AnimatedSwitch';
import { CHIP_VISUAL, DEFAULT_CHIP } from '../../theme/categoryColors';
import Svg, { Path, Defs, RadialGradient, LinearGradient, Stop, Circle, Rect } from 'react-native-svg';

import { COLORS, FONTS } from '../../theme';
import { PlusIcon } from '../icons/PlusIcon';
import { AnimatedView, AnimatedPressable, AnimatedCard, AnimatedListItem } from '../../components/animated';
import { Shadow } from 'react-native-shadow-2';
import { useMyMoments, useToggleMomentStatus, useArchiveMoment } from '../../hooks/useMoments';

import { mapMyMoment, formatDate, formatTimeRange } from '../../mappers/moment.mapper';

import { SkeletonLoader } from '../common/SkeletonLoader';
import { EmptyState } from '../common/EmptyState';
import { AppConfirm } from '../common/AppConfirm';


// ─── Types ────────────────────────────────────────────────────────────────────

type InnerTab = 'Custom' | 'Subscribe' | 'Archive';

type CategoryType = string;

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

import { WishesIcon } from '../icons/WishesIcon';
import { MotivationIcon } from '../icons/MotivationIcon';
import { ArchiveBoxIcon } from '../icons/ArchiveBoxIcon';


// ─── Category Icon ────────────────────────────────────────────────────────────

const CategoryIcon = ({ type }: { type: CategoryType }) => {
  const visual = CHIP_VISUAL[type] ?? DEFAULT_CHIP;

  // Only Wishes → gift-box icon.
  // Celebration, Motivation, Others → fire icon (MotivationIcon).
  const isWishes = type === 'Wishes';

  return (
    <View style={[styles.categoryIconBox, { backgroundColor: visual.bg }]}>
      {isWishes ? (
        <WishesIcon size={40} color={visual.textColor} />
      ) : (
        <MotivationIcon size={40} color={visual.textColor} />
      )}
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
  <AnimatedCard style={styles.card}>
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
          <Text style={styles.cardStatus}>Status: {data.status === "Active" ? "Active" : "Inactive"}</Text>
        </View>
      </View>
      <AnimatedSwitch
        value={enabled}
        onValueChange={() => onToggle(data.id)}
      />
    </View>

    {/* Body */}
    <View style={styles.cardDividerContainer}>
      <View style={styles.cardBody}>
        <Text style={styles.cardMessage}>{data.message}</Text>
        <View style={styles.divider} />
        <View style={styles.cardFooter}>
          <View style={styles.timeRow}>
            {/* Live moment: show clock + "Ends in Xm" */}
            {data.timeStr && !data.dateStr && (
              <>
                <ClockIcon />
                <Text style={styles.timeText}>{data.timeStr}</Text>
              </>
            )}
            {/* Scheduled/inactive: show calendar + date + time range */}
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
          <AnimatedPressable
            style={styles.archiveButton}
            onPress={() => onArchive(data.id)}>
            <Text style={styles.archiveText}>Archive</Text>
          </AnimatedPressable>
        </View>
      </View>
    </View>
  </AnimatedCard>
));

// ─── Subscribe Tab Content (Figma node 927-7862 / 1196-7098) ──────────────────

/**
 * The "Subscribe" inner tab — shows the "Morning Wishes" subscription card
 * with warm amber-peach gradient, decorative blobs, time pill, and
 * a prominent dark Subscribe button. Pixel-perfect from Figma.
 */
const SubscribeTabContent: React.FC = () => (
  <AnimatedView animation="slideUp" style={styles.subscribeWrapper}>
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
      <Shadow
        distance={4}
        startColor="rgba(72,86,92,0.15)"
        offset={[0, 4]}
        style={{ borderRadius: 10 }}
        containerStyle={{ alignSelf: 'center' }}
      >
        <AnimatedPressable style={styles.subButton}>
          <Text style={styles.subButtonText}>Subscribe</Text>
        </AnimatedPressable>
      </Shadow>

      {/* Footer note */}
      <Text style={styles.subFooterNote}>Modify or Unsubscribe anytime</Text>
    </View>
  </AnimatedView>
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



const ARCHIVED_MOMENTS: MomentCardData[] = [
  {
    id: 'a1',
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
  // ID of the moment pending archive confirmation (null = modal hidden)
  const [confirmArchiveId, setConfirmArchiveId] = useState<string | null>(null);

  // ── Real API data ─────────────────────────────────────────────────────
  const { data: myMomentsData, isLoading, refetch } = useMyMoments();
  const { mutate: toggleStatus } = useToggleMomentStatus();
  const { mutate: archiveMutate } = useArchiveMoment();


  const activeMoments = (myMomentsData?.activeMoments ?? []).map(mapMyMoment);
  const expiredMoments = (myMomentsData?.expiredMoments ?? []).map(mapMyMoment);

  // Toggle switch: only changes active ON/OFF — card stays in Custom tab.
  const handleToggle = useCallback((id: string, currentActive: boolean) => {
    toggleStatus({ momentId: id, active: !currentActive });
  }, [toggleStatus]);

  // Archive button: show confirmation modal first — archive only on confirm.
  const handleArchive = useCallback((id: string) => {
    setConfirmArchiveId(id);
  }, []);

  const handleArchiveConfirm = useCallback(() => {
    if (confirmArchiveId) {
      archiveMutate(confirmArchiveId);
    }
    setConfirmArchiveId(null);
  }, [confirmArchiveId, archiveMutate]);

  const handleArchiveCancel = useCallback(() => {
    setConfirmArchiveId(null);
  }, []);


  // Active tab pill color: dark for Subscribe, blue for Custom/Archive (Figma spec)
  const getActiveTabStyle = (tab: InnerTab) => {
    if (tab !== activeInnerTab) { return null; }
    return tab === 'Subscribe' ? styles.innerTabActiveSubscribe : styles.innerTabActive;
  };

  return (
    <>
      {/* ── Inner top tabs: Custom / Subscribe / Archive ── */}
      <View style={styles.innerTabsContainer}>
        <View style={styles.innerTabsWrapper}>
          {(['Custom', 'Subscribe', 'Archive'] as InnerTab[]).map(tab => {
            const isActive = activeInnerTab === tab;
            const tabContent = (
              <AnimatedPressable
                key={tab}
                onPress={() => setActiveInnerTab(tab)}
                style={[styles.innerTab, getActiveTabStyle(tab)]}
              >
                <Text
                  style={[
                    styles.innerTabText,
                    isActive ? styles.innerTabTextActive : styles.innerTabTextInactive,
                  ]}
                >
                  {tab}
                </Text>
              </AnimatedPressable>
            );

            return isActive ? (
              <Shadow
                key={tab}
                distance={4}
                startColor="rgba(72,86,92,0.15)"
                offset={[0, 2]}
                style={{ width: '100%', height: '100%', borderRadius: 8 }}
                containerStyle={{ flex: 1, height: 38 }}
              >
                {tabContent}
              </Shadow>
            ) : (
              tabContent
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
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={COLORS.primary} />
          }
        >
          {isLoading ? (
            <>
              <SkeletonLoader width="100%" height={140} borderRadius={16} />
              <SkeletonLoader width="100%" height={140} borderRadius={16} />
            </>
          ) : activeInnerTab === 'Custom' ? (
            activeMoments.length === 0 ? (
              <EmptyState message="No active moments" subMessage="Create a moment to get started" />
            ) : (
              activeMoments.map((moment, index) => {
                const visual = CHIP_VISUAL[moment.categoryName] ?? DEFAULT_CHIP;
                const cardData: MomentCardData = {
                  id: moment.id,
                  category: moment.categoryName,
                  categoryLabel: moment.categoryName,
                  subLabel: moment.subcategoryName,
                  status: moment.active ? 'Active' : 'Scheduled',
                  message: moment.description,
                  timeStr: moment.timeStr,
                  dateStr: moment.dateStr,
                  timeRange: moment.timeRange,

                  headerBg: visual.bg,
                  titleColor: visual.textColor,
                  subColor: visual.textColor + 'CC', // 80% opacity variant
                };
                return (
                  <AnimatedListItem key={moment.id} index={index}>
                    <MomentCard
                      data={cardData}
                      enabled={moment.active}
                      onToggle={(id) => handleToggle(id, moment.active)}
                      onArchive={handleArchive}
                    />
                  </AnimatedListItem>
                );
              })
            )
          ) : (
            /* Archive tab */
            expiredMoments.length === 0 ? (
              <EmptyState message="No archived moments" />
            ) : (
              expiredMoments.map((moment, index) => {
                const visual = CHIP_VISUAL[moment.categoryName] ?? DEFAULT_CHIP;
                // Archive tab: always show full date + time range, never "Ends in Xm".
                const archiveDateStr = formatDate(moment.startDateTime);
                const archiveTimeRange = formatTimeRange(moment.startDateTime, moment.endDateTime);
                const cardData: MomentCardData = {
                  id: moment.id,
                  category: moment.categoryName,
                  categoryLabel: moment.categoryName,
                  subLabel: moment.subcategoryName,
                  status: 'Scheduled',
                  message: moment.description,
                  timeStr: undefined,          // never show "Ends in Xm" in Archive tab
                  dateStr: archiveDateStr,
                  timeRange: archiveTimeRange,
                  headerBg: visual.bg,
                  titleColor: visual.textColor,
                  subColor: visual.textColor + 'CC',
                };
                return (
                  <AnimatedListItem key={moment.id} index={index}>
                    <ArchiveMomentCard data={cardData} />
                  </AnimatedListItem>
                );
              })
            )
          )}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      )}

      {/* ── Archive Confirmation ── */}
      <AppConfirm
        visible={confirmArchiveId !== null}
        onCancel={handleArchiveCancel}
        onConfirm={handleArchiveConfirm}
        title="Archive Moment"
        message="This moment will be moved to your Archive. It won't appear in your active moments."
        confirmLabel="Archive"
        cancelLabel="Cancel"
        confirmStyle="destructive"
      />
    </>
  );
};




const ArchiveMomentCard = React.memo(({ data }: { data: MomentCardData }) => (
  <AnimatedCard style={styles.card}>
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
        </View>
      </View>
    </View>

    {/* Body */}
    <View style={styles.cardDividerContainer}>
      <View style={styles.cardBody}>
        <Text style={styles.cardMessage}>{data.message}</Text>
        <View style={styles.divider} />
        {/* Footer — date + time range only (Figma: calendar icon + M/D/YY + 11:00AM-12:00PM) */}
        <View style={styles.timeRow}>
          {data.dateStr && (
            <>
              <CalendarIcon />
              <Text style={styles.timeText}>{data.dateStr}</Text>
            </>
          )}
          {data.timeRange && (
            <Text style={styles.timeText}>{data.timeRange}</Text>
          )}
          {/* Fallback: if only clock-time available (was live, now expired) */}
          {!data.dateStr && data.timeStr && (
            <>
              <ClockIcon />
              <Text style={styles.timeText}>{data.timeStr}</Text>
            </>
          )}
        </View>
      </View>
    </View>
  </AnimatedCard>
));


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
  },
  // Dark active (Subscribe — matches Figma exactly)
  innerTabActiveSubscribe: {
    backgroundColor: '#263238',
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
    // kept for layout reference — AnimatedSwitch handles its own sizing
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
    // Figma: 1px border #6e767a, borderRadius 6, px 14, py 5, no fill bg
    borderWidth: 1,
    borderColor: '#6e767a',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'transparent',
  },
  archiveText: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.medium,
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: 0.1,
    color: '#515b60',
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
    zIndex: 20,
  },
});
