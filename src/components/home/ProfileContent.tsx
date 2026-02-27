import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { COLORS, FONTS } from '../../theme';
import { HuminiMarkIcon } from '../icons/HuminiMarkIcon';
import { AnimatedView, AnimatedPressable } from '../../components/animated';

// ─── Figma Asset URLs (served by Figma Dev MCP localhost server) ──────────────
// Profile avatar
const avatarUrl =
  'http://localhost:3845/assets/0b86ecc1e1b90e5feb6cb643d33d623e7234522a.png';

// Top-3 leaderboard user photos
const johnPhoto =
  'http://localhost:3845/assets/20b72e145bb4c728a65fd512e641a4a342268287.png';
const priyaPhoto =
  'http://localhost:3845/assets/b86b2440b1f72ece516e354796e6b247f074f191.png';
const rahulPhoto =
  'http://localhost:3845/assets/b8a1d8888947ab33f27298d7905cfc41511e1d06.png';

// ─── Divider line as a thin View ─────────────────────────────────────────────
const Divider = () => <View style={styles.divider} />;

// ─── Vertical divider ─────────────────────────────────────────────────────────
const VerticalDivider = () => <View style={styles.verticalDivider} />;

// ─── Bar chart for "Top 3 Minutes In Humini" ─────────────────────────────────
interface BarEntryProps {
  photo: string;
  name: string;
  barHeight: number;
  barColor: string;
  minutes: string;
  minutesColor: string;
  /** Raw hex color for the Humini mark SVG (e.g. '#655200') */
  iconColor: string;
  /** Opacity for the Humini mark SVG (0–1) */
  iconOpacity: number;
  rank: 'gold' | 'teal' | 'pink';
  topOffset: number; // vertical offset so bars align at bottom
}

const BAR_WIDTH = 90;
const MAX_BAR_HEIGHT = 191; // tallest bar (1st place)

const BarEntry: React.FC<BarEntryProps> = ({
  photo,
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
        <Image source={{ uri: photo }} style={styles.barAvatar} />
        <Text style={styles.barName}>{name}</Text>
      </View>

      {/* Decorative bar */}
      <View
        style={[
          styles.barShape,
          { height: barHeight, backgroundColor: barColor },
        ]}>
        {/* Humini brand mark SVG */}
        <HuminiMarkIcon width={22} height={26} color={iconColor} opacity={iconOpacity} />
        <Text style={[styles.barMinutes, { color: minutesColor }]}>
          {minutes}
        </Text>
      </View>
    </View>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const ProfileContent: React.FC = () => {
  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: () => {} },
    ]);
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>

      {/* ── User Info Card ─────────────────────────────────────────────── */}
      <AnimatedView animation="slideUp" delay={0} style={styles.card}>
        <View style={styles.userInfoTop}>
          <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' }} 
          style={styles.avatar} />
          <View style={styles.userTextBlock}>
            <Text style={styles.userName}>Tamilselvan</Text>
            <Text style={styles.userRole}>UX Designer</Text>
          </View>
        </View>

        <Divider />

        <View style={styles.userInfoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>tamil.selvan@arus.co.in</Text>
        </View>

        <View style={styles.userInfoRow}>
          <Text style={styles.infoLabel}>Department:</Text>
          <Text style={styles.infoValue}>Product Engineering</Text>
        </View>
      </AnimatedView>

      {/* ── Top 3 Minutes Card ────────────────────────────────────────── */}
      <AnimatedView animation="slideUp" delay={100} style={[styles.card, styles.leaderboardCard]}>
        <Text style={styles.leaderboardTitle}>Top 3 Minutes In Humini</Text>

        <View style={styles.barsRow}>
          {/* 1st place — John (tallest, leftmost) */}
          <BarEntry
            photo={johnPhoto}
            name="John"
            barHeight={MAX_BAR_HEIGHT}
            barColor="#F2E05A"
            minutes="400M"
            minutesColor="rgba(101,82,0,0.4)"
            iconColor="#655200"
            iconOpacity={0.4}
            rank="gold"
            topOffset={0}
          />
          {/* 2nd place — Priya */}
          <BarEntry
            photo={priyaPhoto}
            name="Priya"
            barHeight={123}
            barColor="#A8EEF0"
            minutes="200M"
            minutesColor="rgba(21,120,126,0.5)"
            iconColor="#15787E"
            iconOpacity={0.5}
            rank="teal"
            topOffset={MAX_BAR_HEIGHT - 123 - 58}
          />
          {/* 3rd place — Rahul */}
          <BarEntry
            photo={rahulPhoto}
            name="Rahul"
            barHeight={88}
            barColor="#F5B8D9"
            minutes="100M"
            minutesColor="rgba(100,27,68,0.5)"
            iconColor="#641B44"
            iconOpacity={0.5}
            rank="pink"
            topOffset={MAX_BAR_HEIGHT - 88 - 58}
          />
        </View>
      </AnimatedView>

      {/* ── Stats Card ────────────────────────────────────────────────── */}
      <AnimatedView animation="slideUp" delay={200} style={[styles.card, styles.statsCard]}>
        {/* Top centred: total minutes */}
        <View style={styles.statsTotalSection}>
          <Text style={styles.statsNumber}>500</Text>
          <Text style={styles.statsLabel}>Total minutes spent</Text>
        </View>

        <Divider />

        {/* Bottom row: Joy Given | Joy Received */}
        <View style={styles.statsBottomRow}>
          <View style={styles.statItem}>
            <Text style={styles.statsNumber}>75</Text>
            <Text style={styles.statsLabel}>Joy Given</Text>
          </View>
          <VerticalDivider />
          <View style={styles.statItem}>
            <Text style={styles.statsNumber}>32</Text>
            <Text style={styles.statsLabel}>Joy Received</Text>
          </View>
        </View>
      </AnimatedView>

      {/* ── Logout Button ─────────────────────────────────────────────── */}
      <AnimatedView animation="slideUp" delay={300}>
        <AnimatedPressable
          style={styles.logoutButton}
          onPress={handleLogout}>
          <Text style={styles.logoutText}>Log out</Text>
        </AnimatedPressable>
      </AnimatedView>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },

  // ── Card shared ──
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.white,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
  },

  // ── User info card ──
  userInfoTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
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
  },

  // ── Leaderboard card ──
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
    height: MAX_BAR_HEIGHT + 60, // room for bar + avatar/name column
  },
  barEntryWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  barAvatarSection: {
    alignItems: 'center',
    marginBottom: 4,
  },
  barAvatar: {
    width: 36,
    height: 36,
    borderRadius: 8,
    marginBottom: 4,
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
  huminiMark: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '700',
  },
  barMinutes: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.medium,
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: 0.1,
    textAlign: 'center',
  },

  // ── Stats card ──
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

  // ── Logout button ──
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
