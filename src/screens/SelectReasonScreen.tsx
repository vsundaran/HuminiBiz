import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Path,
  Polygon,
} from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { COLORS, FONTS } from '../theme';

type RootStackParamList = {
  Home: undefined;
  CallCompleted: undefined;
  SelectReason: undefined;
};

// ─── Inline SVG Icons ────────────────────────────────────────────────────────

/** fi:alert-triangle outline */
const AlertTriangleIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
      stroke="#F5A623"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 9v4"
      stroke="#F5A623"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 17h.01"
      stroke="#F5A623"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Back arrow (chevron left) */
const BackArrowIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 18l-6-6 6-6"
      stroke={COLORS.textMainHeadline}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ─── Reason Item ──────────────────────────────────────────────────────────────

type ReasonItemProps = {
  emoji: string;
  label: string;
  selected: boolean;
  onPress: () => void;
};

const ReasonItem = ({ emoji, label, selected, onPress }: ReasonItemProps) => (
  <TouchableOpacity
    style={[styles.reasonButton, selected && styles.reasonButtonSelected]}
    activeOpacity={0.75}
    onPress={onPress}>
    <View style={styles.emojiWrapper}>
      <Text style={styles.emojiText}>{emoji}</Text>
    </View>
    <Text style={styles.reasonLabel}>{label}</Text>
  </TouchableOpacity>
);

// ─── Reasons Data ─────────────────────────────────────────────────────────────

const REASONS = [
  { id: 'inappropriate', emoji: '⚠️', label: 'Inappropriate Behavior' },
  { id: 'personal', emoji: '🔒', label: 'Asked for Personal Info' },
  { id: 'sexual', emoji: '🔞', label: 'Sexual Content' },
  { id: 'abusive', emoji: '🚫', label: 'Abusive Language' },
  { id: 'others', emoji: '💬', label: 'Others' },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export const SelectReasonScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  const handleCancel = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('CallCompleted');
    }
  };

  const handleSubmit = () => {
    if (!selectedReason) return;
    // TODO: wire up submission logic (API call)
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      {/* Background gradient: #FFFBEA → #F4F4F4 (top ~30%) */}
      <View style={StyleSheet.absoluteFillObject}>
        <Svg height="100%" width="100%" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#FFFBEA" stopOpacity="1" />
              <Stop offset="0.30" stopColor="#F4F4F4" stopOpacity="1" />
              <Stop offset="1" stopColor="#F4F4F4" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#bg)" />
        </Svg>
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleCancel}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <BackArrowIcon />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Report</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Safety message banner */}
          <View style={styles.safetyBanner}>
            <AlertTriangleIcon />
            <View style={styles.safetyTextBlock}>
              <Text style={styles.safetyTitle}>Your safety matters</Text>
              <Text style={styles.safetyBody}>
                Reports are reviewed by our team to ensure a respectful
                workplace. Employees who violate community guidelines may face
                action. Your identity will remain confidential.
              </Text>
            </View>
          </View>

          {/* Reason list */}
          <View style={styles.reasonList}>
            {REASONS.map(reason => (
              <ReasonItem
                key={reason.id}
                emoji={reason.emoji}
                label={reason.label}
                selected={selectedReason === reason.id}
                onPress={() => setSelectedReason(reason.id)}
              />
            ))}
          </View>
        </ScrollView>

        {/* Bottom action row */}
        <View style={styles.bottomActionRow}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            activeOpacity={0.7}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.submitButton,
              selectedReason ? styles.submitButtonActive : styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            activeOpacity={selectedReason ? 0.85 : 1}
            disabled={!selectedReason}>
            <Text
              style={[
                styles.submitText,
                selectedReason ? styles.submitTextActive : styles.submitTextDisabled,
              ]}>
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },

  /* ── Header ── */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FAF8EE',
  },
  backButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerTitle: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.semiBold,
    fontSize: FONTS.sizes.md, // 16
    lineHeight: 24,
    letterSpacing: 0,
    color: COLORS.textMainHeadline,
  },

  /* ── Scroll area ── */
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 16,
  },

  /* ── Safety Banner ── */
  safetyBanner: {
    backgroundColor: '#FEF1E7',
    borderRadius: 8,
    padding: 16,
    gap: 9,
  },
  safetyTextBlock: {
    gap: 6,
  },
  safetyTitle: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.semiBold,
    fontSize: FONTS.sizes.sm, // 14
    lineHeight: 20,
    letterSpacing: 0.1,
    color: COLORS.textMainHeadline,
  },
  safetyBody: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.medium,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textSubHeadline,
  },

  /* ── Reason List ── */
  reasonList: {
    gap: 8,
  },
  reasonButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  reasonButtonSelected: {
    borderColor: COLORS.textMainHeadline,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  emojiWrapper: {
    width: 44,
    height: 44,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 3,
  },
  emojiText: {
    fontSize: 24,
    lineHeight: 32,
  },
  reasonLabel: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.medium,
    fontSize: FONTS.sizes.sm, // 14
    lineHeight: 20,
    color: COLORS.textSubHeadline,
    marginLeft: 8,
  },

  /* ── Bottom Actions ── */
  bottomActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
  },
  cancelButton: {
    flex: 1,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingHorizontal: 32,
  },
  cancelText: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.semiBold,
    fontSize: FONTS.sizes.sm, // 14
    lineHeight: 20,
    letterSpacing: 0.1,
    color: '#2E566B',
  },
  submitButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.surfaceDisabledBackground,
  },
  submitButtonActive: {
    backgroundColor: COLORS.surfaceBluePrimary,
  },
  submitText: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.semiBold,
    fontSize: FONTS.sizes.sm,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  submitTextDisabled: {
    color: COLORS.textDisabled,
  },
  submitTextActive: {
    color: COLORS.white,
  },
});
