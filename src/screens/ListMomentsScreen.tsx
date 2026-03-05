import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { MomentCard } from '../components/cards/MomentCard';
import { LiveMomentsBanner } from '../components/cards/LiveMomentsBanner';
import { COLORS, FONTS } from '../theme';
import { ArrowRightThinIcon } from '../components/icons/ArrowRightThinIcon';
import { AnimatedScreen, AnimatedPressable, AnimatedView } from '../components/animated';
import {
  useInfiniteLiveMoments,
  useInfiniteUpcomingMoments,
  useInfiniteLaterMoments,
} from '../hooks/useMoments';
import { useCategories } from '../hooks/useCategories';
import { momentToCardProps } from '../utils/momentMapper';
import { Moment } from '../types/moment.types';
import { SkeletonLoader } from '../components/common/SkeletonLoader';

// ─── Types ────────────────────────────────────────────────────────────────────
type FeedType = 'live' | 'upcoming' | 'later';

type RootStackParamList = {
  ListMoments: { feedType?: FeedType } | undefined;
};

// ─── Helper: flatten pages from infinite query result ─────────────────────────
const flatPages = (data: any): Moment[] =>
  data?.pages?.flatMap((p: Moment[]) => p) ?? [];

// ─── LiveMomentsScreen ────────────────────────────────────────────────────────
export const ListMomentsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'ListMoments'>>();

  const activeFeed = route.params?.feedType || 'live';
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  const filterTabs = useMemo(() => {
    return [{ _id: 'all', name: 'All' }, ...categories];
  }, [categories]);

  const filterId = activeCategoryId === 'all' ? undefined : activeCategoryId;

  // ── Infinite queries for each feed type ───────────────────────────────────
  const liveQuery     = useInfiniteLiveMoments(filterId);
  const upcomingQuery = useInfiniteUpcomingMoments(filterId);
  const laterQuery    = useInfiniteLaterMoments(filterId);

  const queryMap: Record<FeedType, typeof liveQuery> = {
    live:     liveQuery,
    upcoming: upcomingQuery,
    later:    laterQuery,
  };

  const activeQuery = queryMap[activeFeed];
  const allMoments  = useMemo(() => flatPages(activeQuery.data), [activeQuery.data]);

  // Load next page when user scrolls to the end
  const loadMore = useCallback(() => {
    if (activeQuery.hasNextPage && !activeQuery.isFetchingNextPage) {
      activeQuery.fetchNextPage();
    }
  }, [activeQuery]);

  // ── Render footer spinner / end-of-list indicator ─────────────────────────
  const renderFooter = () => {
    if (activeQuery.isFetchingNextPage) {
      return <ActivityIndicator size="small" color={COLORS.primary} style={{ marginVertical: 20 }} />;
    }
    if (!activeQuery.hasNextPage && allMoments.length > 0) {
      return <Text style={styles.endText}>You're all caught up 🎉</Text>;
    }
    return <View style={{ height: 40 }} />;
  };

  // ── Render each card ──────────────────────────────────────────────────────
  const renderItem = useCallback(
    ({ item }: { item: Moment }) => (
      <MomentCard key={item._id} {...momentToCardProps(item, activeFeed)} />
    ),
    [activeFeed]
  );

  // ── Skeleton loading state ─────────────────────────────────────────────────
  const renderSkeletons = () => (
    <View style={styles.skeletonContainer}>
      {[0, 1, 2].map((i) => (
        <SkeletonLoader
          key={i}
          width="100%"
          height={170}
          borderRadius={16}
          style={{ marginBottom: 16 }}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AnimatedScreen style={styles.container}>
        {/* Background */}
        <View style={StyleSheet.absoluteFill}>
          <Svg height="100%" width="100%">
            <Defs>
              <LinearGradient id="mainBg" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#FFFBEA" />
                <Stop offset="30%" stopColor="#F4F4F4" />
                <Stop offset="100%" stopColor="#F4F4F4" />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#mainBg)" />
          </Svg>
        </View>

        {/* Top Navigation */}
        <AnimatedView animation="slideDown" style={styles.topNav}>
          <AnimatedPressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <View style={{ transform: [{ rotate: '270deg' }] }}>
              <ArrowRightThinIcon size={14} color="#000" />
            </View>
          </AnimatedPressable>
          <Text style={styles.title}>
            {activeFeed === 'upcoming' ? 'In Next 2h' : activeFeed === 'later' ? 'Others' : 'Live moments'}
          </Text>
        </AnimatedView>

        {/* Feed type selector (Live / In Next 2h / Others) */}
        {/* <AnimatedView animation="slideDown" delay={50} style={styles.feedTabsRow}>
          {(['live', 'upcoming', 'later'] as FeedType[]).map((feed) => (
            <TouchableOpacity
              key={feed}
              style={[styles.feedChip, activeFeed === feed && styles.feedChipActive]}
              onPress={() => setActiveFeed(feed)}
              activeOpacity={0.75}
            >
              <Text style={[styles.feedChipText, activeFeed === feed && styles.feedChipTextActive]}>
                {SECTION_LABELS[feed]}
              </Text>
            </TouchableOpacity>
          ))}
        </AnimatedView> */}

        {/* Category filter chips */}
        <AnimatedView animation="slideDown" delay={100}>
          {categoriesLoading ? (
            <View style={[styles.tabsWrapper, { justifyContent: 'center', paddingHorizontal: 16 }]}>
               <ActivityIndicator size="small" color={COLORS.primary} />
            </View>
          ) : (
            <FlatList
              data={filterTabs}
              horizontal
              keyExtractor={(t) => t._id}
              showsHorizontalScrollIndicator={false}
              style={styles.tabsWrapper}
              contentContainerStyle={styles.tabsContainer}
              renderItem={({ item: tab }) => (
                <AnimatedPressable
                  style={[styles.filterChip, activeCategoryId === tab._id && styles.filterChipActive]}
                  onPress={() => setActiveCategoryId(tab._id)}
                >
                  <Text style={[styles.filterChipText, activeCategoryId === tab._id && styles.filterChipTextActive]}>
                    {tab.name}
                  </Text>
                </AnimatedPressable>
              )}
            />
          )}
        </AnimatedView>

        {/* Content List — Infinite Scroll */}
        {activeQuery.isLoading ? (
          renderSkeletons()
        ) : (
          <FlatList
            data={allMoments}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            onEndReached={loadMore}
            onEndReachedThreshold={0.4}
            ListHeaderComponent={
              activeFeed === 'live' ? (
                <AnimatedView animation="slideDown" delay={200}>
                  <LiveMomentsBanner count={allMoments.length} />
                </AnimatedView>
              ) : null
            }
            ListFooterComponent={renderFooter}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No moments in this section right now.</Text>
              </View>
            }
            removeClippedSubviews
          />
        )}
      </AnimatedScreen>
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFBEA',
  },
  container: {
    flex: 1,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backButton: {
    marginRight: 8,
    padding: 4,
    transform: [{ rotate: '90deg' }],
  },
  title: {
    ...FONTS.styles.headlineBold24,
    fontSize: 18,
    color: '#263238',
    letterSpacing: 0.5,
  },
  // ── Feed type row ──────────────────────────────────────────────────────────
  feedTabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  feedChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#FCFCFC',
    borderWidth: 0.7,
    borderColor: '#E9EBEB',
  },
  feedChipActive: {
    backgroundColor: '#263238',
    borderColor: '#263238',
  },
  feedChipText: {
    ...FONTS.styles.bodyMedium14,
    fontSize: 12,
    color: '#515b60',
  },
  feedChipTextActive: {
    color: '#FFFFFF',
  },
  // ── Category filter ────────────────────────────────────────────────────────
  tabsWrapper: {
    maxHeight: 45,
    marginBottom: 16,
  },
  tabsContainer: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#FCFCFC',
    borderWidth: 0.7,
    borderColor: '#E9EBEB',
  },
  filterChipActive: {
    backgroundColor: '#263238',
    borderColor: '#263238',
  },
  filterChipText: {
    ...FONTS.styles.bodyMedium14,
    fontSize: 14,
    color: '#515b60',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  // ── Content ────────────────────────────────────────────────────────────────
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  skeletonContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.medium,
    fontSize: 14,
    color: COLORS.textBodyText1,
    textAlign: 'center',
  },
  endText: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.medium,
    fontSize: 13,
    color: COLORS.textBodyText1,
    textAlign: 'center',
    marginVertical: 20,
  },
});
