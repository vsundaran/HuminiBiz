import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import { COLORS, FONTS } from '../../theme';
import { HuminiMarkIcon } from '../icons/HuminiMarkIcon';
import { AnimatedView, AnimatedPressable } from '../../components/animated';
import { Shadow } from 'react-native-shadow-2';
import { InitialsAvatar } from '../common/InitialsAvatar';
import { useUserProfile, useUserStats, useLeaderboard } from '../../hooks/useUserProfile';
import { useAuthStore } from '../../store/auth.store';
import { SkeletonLoader } from '../common/SkeletonLoader';

// ─── Divider line as a thin View ─────────────────────────────────────────────
const Divider = () => <View style={styles.divider} />;
const VerticalDivider = () => <View style={styles.verticalDivider} />;

// ─── Bar chart colors ─────────────────────────────────────────────────────────
const BAR_COLORS = [
  { bar: '#F2E05A', text: 'rgba(101,82,0,0.4)', icon: '#655200', opacity: 0.4 },
  { bar: '#A8EEF0', text: 'rgba(21,120,126,0.5)', icon: '#15787E', opacity: 0.5 },
  { bar: '#F5B8D9', text: 'rgba(100,27,68,0.5)', icon: '#641B44', opacity: 0.5 },
];
const BAR_HEIGHTS = [191, 123, 88];
const MAX_BAR_HEIGHT = 191;
const BAR_WIDTH = 90;

interface BarEntryProps {
  name: string;
  barHeight: number;
  barColor: string;
  minutes: string;
  minutesColor: string;
  iconColor: string;
  iconOpacity: number;
  topOffset: number;
}

const BarEntry: React.FC<BarEntryProps> = ({
  name,
  barHeight,
  barColor,
  minutes,
  minutesColor,
  iconColor,
  iconOpacity,
  topOffset,
}) => {
  return (
    <View style={[styles.barEntryWrapper, { marginTop: topOffset }]}>
      {/* Avatar + name above bar */}
      <View style={styles.barAvatarSection}>
        <InitialsAvatar name={name} size={36} borderRadius={8} />
        <Text style={styles.barName}>{name.split(' ')[0]}</Text>
      </View>

      {/* Decorative bar */}
      <View
        style={[
          styles.barShape,
          { height: barHeight, backgroundColor: barColor },
        ]}
      >
        <HuminiMarkIcon width={22} height={26} color={iconColor} opacity={iconOpacity} />
        <Text style={[styles.barMinutes, { color: minutesColor }]}>{minutes}</Text>
      </View>
    </View>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const ProfileContent: React.FC = () => {
  const logout = useAuthStore(s => s.logout);

  const {
    data: profile,
    isLoading: profileLoading,
    refetch: refetchProfile,
  } = useUserProfile();

  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useUserStats();

  const {
    data: leaderboard,
    isLoading: leaderboardLoading,
    refetch: refetchLeaderboard,
  } = useLeaderboard();

  const isLoading = profileLoading || statsLoading || leaderboardLoading;

  const onRefresh = useCallback(() => {
    refetchProfile();
    refetchStats();
    refetchLeaderboard();
  }, [refetchProfile, refetchStats, refetchLeaderboard]);

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => {
          logout();
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <SkeletonLoader width="100%" height={120} borderRadius={16} style={{ marginBottom: 16 }} />
        <SkeletonLoader width="100%" height={280} borderRadius={16} style={{ marginBottom: 16 }} />
        <SkeletonLoader width="100%" height={140} borderRadius={16} style={{ marginBottom: 16 }} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={onRefresh} tintColor={COLORS.primary} />
      }
    >
      {/* ── User Info Card ────────────────────────────────────────────────── */}
      <AnimatedView animation="slideUp" delay={0} style={{ marginBottom: 16 }}>
        <Shadow
          distance={8}
          startColor="#0000000A"
          offset={[0, 8]}
          style={{ width: '100%', borderRadius: 16 }}
          containerStyle={{ width: '100%' }}
        >
          <View style={styles.card}>
            <View style={styles.userInfoTop}>
              <InitialsAvatar name={profile?.name ?? 'U'} size={64} />
              <View style={styles.userTextBlock}>
                <Text style={styles.userName}>{profile?.name ?? '—'}</Text>
                <Text style={styles.userRole}>{profile?.jobRole ?? '—'}</Text>
              </View>
            </View>

            <Divider />

            <View style={styles.userInfoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue} numberOfLines={1}>{profile?.email ?? '—'}</Text>
            </View>

            <View style={styles.userInfoRow}>
              <Text style={styles.infoLabel}>Department:</Text>
              <Text style={styles.infoValue}>{profile?.department ?? '—'}</Text>
            </View>
          </View>
        </Shadow>
      </AnimatedView>

      {/* ── Top 3 Minutes Card ─────────────────────────────────────────────── */}
      {(leaderboard && leaderboard.length > 0) && (
        <AnimatedView animation="slideUp" delay={100} style={{ marginBottom: 16 }}>
          <Shadow
            distance={8}
            startColor="#0000000A"
            offset={[0, 8]}
            style={{ width: '100%', borderRadius: 16 }}
            containerStyle={{ width: '100%' }}
          >
            <View style={[styles.card, styles.leaderboardCard]}>
              <Text style={styles.leaderboardTitle}>Top 3 Minutes In Humini</Text>
              <View style={styles.barsRow}>
                {leaderboard.map((entry, idx) => {
                  const colorConfig = BAR_COLORS[idx] ?? BAR_COLORS[0];
                  const barHeight = BAR_HEIGHTS[idx] ?? 70;
                  const topOffset = idx === 0 ? 0 : MAX_BAR_HEIGHT - barHeight - 58;
                  return (
                    <BarEntry
                      key={entry.userId}
                      name={entry.name}
                      barHeight={barHeight}
                      barColor={colorConfig.bar}
                      minutes={`${entry.minutes}M`}
                      minutesColor={colorConfig.text}
                      iconColor={colorConfig.icon}
                      iconOpacity={colorConfig.opacity}
                      topOffset={topOffset}
                    />
                  );
                })}
              </View>
            </View>
          </Shadow>
        </AnimatedView>
      )}

      {/* ── Stats Card ─────────────────────────────────────────────────────── */}
      <AnimatedView animation="slideUp" delay={200} style={{ marginBottom: 16 }}>
        <Shadow
          distance={8}
          startColor="#0000000A"
          offset={[0, 8]}
          style={{ width: '100%', borderRadius: 16 }}
          containerStyle={{ width: '100%' }}
        >
          <View style={[styles.card, styles.statsCard]}>
            <View style={styles.statsTotalSection}>
              <Text style={styles.statsNumber}>{stats?.totalMinutes ?? 0}</Text>
              <Text style={styles.statsLabel}>Total minutes spent</Text>
            </View>

            <Divider />

            <View style={styles.statsBottomRow}>
              <View style={styles.statItem}>
                <Text style={styles.statsNumber}>{stats?.joyGiven ?? 0}</Text>
                <Text style={styles.statsLabel}>Joy Given</Text>
              </View>
              <VerticalDivider />
              <View style={styles.statItem}>
                <Text style={styles.statsNumber}>{stats?.joyReceived ?? 0}</Text>
                <Text style={styles.statsLabel}>Joy Received</Text>
              </View>
            </View>
          </View>
        </Shadow>
      </AnimatedView>

      {/* ── Logout Button ──────────────────────────────────────────────────── */}
      <AnimatedView animation="slideUp" delay={300}>
        <AnimatedPressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log out</Text>
        </AnimatedPressable>
      </AnimatedView>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.white,
    overflow: 'hidden',
  },
  userInfoTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 16,
  },
  userTextBlock: {
    flex: 1,
    gap: 2,
  },
  userName: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.semiBold,
    fontSize: 18,
    lineHeight: 26,
    letterSpacing: -0.36,
    color: '#314C5A',
  },
  userRole: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.medium,
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: 0.1,
    color: '#777777',
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginHorizontal: 0,
  },
  userInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 8,
  },
  infoLabel: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.semiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
    color: '#314C5A',
  },
  infoValue: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.semiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
    color: '#777777',
    flexShrink: 1,
    textAlign: 'right',
  },
  leaderboardCard: {
    paddingTop: 18,
    paddingBottom: 0,
    paddingHorizontal: 0,
    minHeight: 271,
  },
  leaderboardTitle: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.semiBold,
    fontSize: 18,
    lineHeight: 26,
    letterSpacing: -0.36,
    color: '#515B60',
    paddingHorizontal: 18,
    marginBottom: 16,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 0,
    height: MAX_BAR_HEIGHT + 60,
  },
  barEntryWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  barAvatarSection: {
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  barName: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.medium,
    fontSize: 12,
    lineHeight: 18,
    color: '#777777',
    textAlign: 'center',
  },
  barShape: {
    width: BAR_WIDTH,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 12,
  },
  barMinutes: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.medium,
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: 0.1,
    textAlign: 'center',
  },
  statsCard: {
    paddingBottom: 0,
  },
  statsTotalSection: {
    alignItems: 'center',
    paddingVertical: 18,
  },
  statsNumber: {
    fontFamily: FONTS.family,
    fontWeight: '900',
    fontSize: 32,
    lineHeight: 40,
    color: '#515B60',
  },
  statsLabel: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.medium,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textBodyText1,
    textAlign: 'center',
  },
  statsBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  verticalDivider: {
    width: 1,
    height: 88,
    backgroundColor: '#E8E8E8',
  },
  logoutButton: {
    backgroundColor: COLORS.redBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.white,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    overflow: 'hidden',
  },
  logoutText: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.semiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
    color: '#D10000',
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 80,
  },
});
