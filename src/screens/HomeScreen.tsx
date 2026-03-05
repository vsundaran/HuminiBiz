import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { MomentCard } from '../components/cards/MomentCard';
import { TopTabBar } from '../components/navigation/TopTabBar';
import { COLORS, FONTS } from '../theme';
import { HuminiLogo } from '../assets/icons/HuminiLogo';
import { BellIcon } from '../components/icons/BellIcon';
import { PlusIcon } from '../components/icons/PlusIcon';
import { ViewAllButton } from '../components/buttons/ViewAllButton';
import { SubscribeCard } from '../components/cards/SubscribeCard';
import { YourMomentsContent } from '../components/home/YourMomentsContent';
import { ProfileContent } from '../components/home/ProfileContent';
import { AnimatedScreen, AnimatedPressable, AnimatedView } from '../components/animated';
import { Shadow } from 'react-native-shadow-2';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { useLiveMoments, useUpcomingMoments, useLaterMoments } from '../hooks/useMoments';
import { momentToCardProps } from '../utils/momentMapper';
import { Moment, PaginatedMoments } from '../types/moment.types';

type Tab = 'Home' | 'Your Moments' | 'Profile';
type HomeRouteParams = {
  Home: { openProfileSetup?: boolean } | undefined;
};

// ─── Home Tab Content ─────────────────────────────────────────────────────────
/**
 * Extracted to avoid calling hooks conditionally inside HomeScreen JSX.
 * Fetches 3 cards per section from the real API.
 */
const HomeTabContent: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { data: live,     isLoading: loadingLive }     = useLiveMoments({ limit: 3 });
  const { data: upcoming, isLoading: loadingUpcoming } = useUpcomingMoments({ limit: 3 });
  const { data: later,    isLoading: loadingLater }    = useLaterMoments({ limit: 3 });

  const renderSectionCards = (
    data: PaginatedMoments | undefined,
    feedType: 'live' | 'upcoming' | 'later',
    isLoading: boolean
  ) => {
    if (isLoading) {
      return (
        <>
          <SkeletonLoader width="100%" height={160} borderRadius={16} style={{ marginBottom: 12 }} />
          <SkeletonLoader width="100%" height={160} borderRadius={16} style={{ marginBottom: 12 }} />
        </>
      );
    }
    const moments = data?.moments;
    if (!moments || moments.length === 0) {
      return (
        <AnimatedView animation="slideUp" delay={200}>
          <Text style={styles.emptyText}>No moments right now.</Text>
        </AnimatedView>
      );
    }
    return moments.map((m) => (
      <MomentCard key={m._id} {...momentToCardProps(m, feedType)} />
    ));
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Subscribe Card */}
        <SubscribeCard />

        {/* ── Live moments ────────────────────────────────────────────────── */}
        <View style={styles.sectionContainer}>
          <AnimatedView animation="slideUp" delay={100}>
            <Text style={styles.sectionTitle}>Live moments</Text>
          </AnimatedView>

          {renderSectionCards(live, 'live', loadingLive)}

          <AnimatedView animation="slideUp" delay={100}>
            {!loadingLive && (live?.totalCount ?? 0) > 0 && (
              <ViewAllButton
                label={`View All (${live!.totalCount})`}
                onPress={() => navigation.navigate('ListMoments', { feedType: 'live' })}
            />
          )}
          </AnimatedView>
        </View>

        {/* ── In Next 2h ──────────────────────────────────────────────────── */}
        <View style={[styles.sectionContainer, styles.greyBackgroundContainer]}>
          <AnimatedView animation="slideUp" delay={200}>
            <Text style={styles.sectionTitle}>In Next 2h</Text>
          </AnimatedView>

          {renderSectionCards(upcoming, 'upcoming', loadingUpcoming)}

          <AnimatedView animation="slideUp" delay={200}>
            {!loadingUpcoming && (upcoming?.totalCount ?? 0) > 0 && (
              <ViewAllButton
                label={`View All (${upcoming!.totalCount})`}
                onPress={() => navigation.navigate('ListMoments', { feedType: 'upcoming' })}
            />

          )}
          </AnimatedView>
        </View>

        {/* ── Others (later) ──────────────────────────────────────────────── */}
        <View style={styles.sectionContainer}>
          <AnimatedView animation="slideUp" delay={300}>
            <Text style={styles.sectionTitle}>Others</Text>
          </AnimatedView>

          {renderSectionCards(later, 'later', loadingLater)}

          <AnimatedView animation="slideUp" delay={200}>
          {!loadingLater && (later?.totalCount ?? 0) > 0 && (
            <ViewAllButton
              label={`View All (${later!.totalCount})`}
              onPress={() => navigation.navigate('ListMoments', { feedType: 'later' })}
            />
          )}
          </AnimatedView>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* FAB */}
      <AnimatedView animation="scale" delay={400} style={styles.fabContainer}>
        <Shadow
          distance={5}
          startColor="rgba(255,255,255,0.5)"
          offset={[0, 2]}
          style={styles.fab}
          containerStyle={styles.fab}
        >
          <AnimatedPressable
            style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
            onPress={() => navigation.navigate('CreateMoment')}
          >
            <PlusIcon size={24} color={COLORS.primary} />
          </AnimatedPressable>
        </Shadow>
      </AnimatedView>
    </>
  );
};

// ─── HomeScreen ───────────────────────────────────────────────────────────────
export const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Home');
  const [showProfileSetupModal, setShowProfileSetupModal] = useState(false);
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<HomeRouteParams, 'Home'>>();

  useEffect(() => {
    if (route.params?.openProfileSetup) {
      setActiveTab('Profile');
      setShowProfileSetupModal(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabPress = (tab: Tab) => {
    if (tab !== 'Profile') {
      setShowProfileSetupModal(false);
    }
    setActiveTab(tab);
  };

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

        {/* Header — only on Home tab */}
        {activeTab === 'Home' && (
          <AnimatedView animation="slideDown" style={styles.headerSection}>
            <HuminiLogo width={55} height={55} />
            <AnimatedPressable style={styles.notificationBell}>
              <BellIcon size={30} color={COLORS.primary} />
              <View style={styles.notificationBadge} />
            </AnimatedPressable>
          </AnimatedView>
        )}

        {/* Tab Content */}
        {activeTab === 'Home' ? (
          <HomeTabContent navigation={navigation} />
        ) : activeTab === 'Your Moments' ? (
          <YourMomentsContent />
        ) : activeTab === 'Profile' ? (
          <ProfileContent
            showEditModal={showProfileSetupModal}
            isNewUser={showProfileSetupModal}
            onModalDismissed={() => setShowProfileSetupModal(false)}
          />
        ) : null}

        {/* Shared Tab Bar */}
        <TopTabBar activeTab={activeTab} onTabPress={handleTabPress} />
      </AnimatedScreen>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fffbea',
  },
  container: {
    flex: 1,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  notificationBell: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.error,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  sectionContainer: {
    marginBottom: 32,
  },
  greyBackgroundContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 24,
    padding: 16,
    marginHorizontal: -16,
  },
  sectionTitle: {
    ...FONTS.styles.headlineBold24,
    color: COLORS.textMainHeadline,
    fontSize: 18,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  bottomSpacer: {
    height: 120,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 110,
    right: 16,
    zIndex: 20,
  },
  fab: {
    width: 60,
    height: 60,
    backgroundColor: '#FFE15B',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.medium,
    fontSize: 14,
    color: COLORS.textBodyText1,
    marginVertical: 12,
  },
});
