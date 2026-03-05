import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Path,
} from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { COLORS, FONTS } from '../theme';
import { AnimatedScreen, AnimatedView, AnimatedPressable } from '../components/animated';
import { useReportReasons, useSubmitReport } from '../hooks/useCallReport';

// ─── Navigation Types ─────────────────────────────────────────────────────────

type RootStackParamList = {
  Home: undefined;
  CallCompleted: undefined;
  SelectReason: undefined;
  ReportSubmitted: undefined;
};

// ─── SVG Icons ────────────────────────────────────────────────────────────────

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

const CheckIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 6L9 17l-5-5"
      stroke="#263238"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ─── Reason Data ──────────────────────────────────────────────────────────────

// NOTE: Static REASONS removed — now dynamically fetched from useReportReasons()
// 'others' id is a fallback for the last item assumed to be 'others'

const MAX_CHARS = 60;

// ─── ReasonRow Component ──────────────────────────────────────────────────────

type ReasonRowProps = {
  emoji: string;
  label: string;
  selected: boolean;
  isOthers?: boolean;
  onPress: () => void;
};

const ReasonRow = React.memo(
  ({ emoji, label, selected, isOthers = false, onPress }: ReasonRowProps) => {
    const isSelectedOthers = selected && isOthers;

    return (
      
      <AnimatedPressable
        style={[
          styles.reasonRow,
          selected && styles.reasonRowSelected,
          isSelectedOthers && styles.reasonRowOthersSelected,
        ]}
        onPress={onPress}>
        {/* Emoji icon */}
        <View style={styles.emojiBox}>
          <Text style={styles.emojiText}>{emoji}</Text>
        </View>

        {/* Label */}
        <Text
          style={[
            styles.reasonLabel,
            isSelectedOthers && styles.reasonLabelOthersSelected,
          ]}>
          {label}
        </Text>

        {/* Checkmark – only shown when selected */}
        {selected && (
          <View style={styles.checkIcon}>
            <CheckIcon />
          </View>
        )}
      </AnimatedPressable>
    );
  },
);

// ─── Screen ───────────────────────────────────────────────────────────────────

export const SelectReasonScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // ── API hooks ────────────────────────────────────────────────────────────
  const { data: reasons = [], isLoading: reasonsLoading } = useReportReasons();
  const { mutate: submitReport, isPending: isSubmitting } = useSubmitReport();

  // Emojis mapped by label keywords (server doesn't return emojis)
  const getEmoji = (label: string): string => {
    const l = label.toLowerCase();
    if (l.includes('inappropri')) { return '⚠️'; }
    if (l.includes('personal')) { return '🔒'; }
    if (l.includes('sexual')) { return '🔞'; }
    if (l.includes('abusive') || l.includes('language')) { return '🚫'; }
    return '💬';
  };

  const [selectedReasonIds, setSelectedReasonIds] = useState<Set<string>>(new Set());
  const [othersText, setOthersText] = useState('');
  const inputRef = useRef<TextInput>(null);

  const toggleReason = useCallback(
    (id: string) => {
      setSelectedReasonIds(prev => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    },
    [],
  );

  const hasSelection = selectedReasonIds.size > 0;
  const canSubmit = hasSelection && !isSubmitting;

  const handleCancel = () => {
    Keyboard.dismiss();
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('CallCompleted');
    }
  };

  const handleSubmit = () => {
    if (!canSubmit) { return; }
    // Submit with selected reason IDs
    submitReport(
      {
        callId: '',           // Will be populated once call state is tracked
        reportedUserId: '',   // Same
        reasons: Array.from(selectedReasonIds),
        additionalNote: othersText.trim() || undefined,
      },
      {
        onSuccess: () => {
          navigation.navigate('ReportSubmitted');
        },
      },
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Background gradient */}
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

      <SafeAreaView style={styles.flex}>
        {/* Header */}
        <AnimatedView animation="slideDown" style={styles.header}>
          <AnimatedPressable
            style={styles.backButton}
            onPress={handleCancel}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <BackArrowIcon />
          </AnimatedPressable>
          <Text style={styles.headerTitle}>Report</Text>
        </AnimatedView>

        {/* Scrollable content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets={true}
          showsVerticalScrollIndicator={false}>
            {/* Safety banner */}
            <AnimatedView animation="slideUp" delay={100} style={styles.safetyBanner}>
              <AlertTriangleIcon />
              <View style={styles.safetyTextBlock}>
                <Text style={styles.safetyTitle}>Your safety matters</Text>
                <Text style={styles.safetyBody}>
                  All reports are reviewed by our team. Users who violate our
                  community guidelines may be permanently banned. Your identity
                  will remain confidential.
                </Text>
              </View>
            </AnimatedView>

            {/* Reason rows */}
            <View style={styles.reasonList}>
              {reasons.map(reason => (
                <React.Fragment key={reason._id}>
                  <ReasonRow
                    emoji={getEmoji(reason.label)}
                    label={reason.label}
                    selected={selectedReasonIds.has(reason._id)}
                    onPress={() => toggleReason(reason._id)}
                  />
                </React.Fragment>
              ))}

              {/* Others text input shown when Others is among the reasons and selected */}
              {selectedReasonIds.size > 0 && othersText !== undefined && (
                <View style={styles.othersInputWrapper}>
                  <TextInput
                    ref={inputRef}
                    style={styles.othersInput}
                    placeholder="Add any additional note (optional)"
                    placeholderTextColor={COLORS.textPlaceholder}
                    value={othersText}
                    onChangeText={t =>
                      setOthersText(t.slice(0, MAX_CHARS))
                    }
                    maxLength={MAX_CHARS}
                    multiline
                    textAlignVertical="top"
                    returnKeyType="done"
                    blurOnSubmit
                  />
                  <Text style={styles.charCount}>
                    {othersText.length}/{MAX_CHARS}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>

        {/* Bottom action row */}
        <AnimatedView animation="slideUp" delay={200} style={styles.bottomActionRow}>
          <AnimatedPressable
            style={styles.cancelButton}
            onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </AnimatedPressable>

          <AnimatedPressable
            style={[
              styles.submitButton,
              canSubmit ? styles.submitActive : styles.submitDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!canSubmit}>
            <Text
              style={[
                styles.submitText,
                canSubmit ? styles.submitTextActive : styles.submitTextDisabled,
              ]}>
              Submit
            </Text>
          </AnimatedPressable>
        </AnimatedView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  /* Header */
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
    fontSize: FONTS.sizes.md,
    lineHeight: 24,
    color: COLORS.textMainHeadline,
  },

  /* Scroll */
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 16,
  },

  /* Safety banner */
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
    fontSize: FONTS.sizes.sm,
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

  /* Reason list */
  reasonList: {
    gap: 8,
  },

  /* Reason row – default */
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  /* Any selected row */
  reasonRowSelected: {
    borderColor: COLORS.textMainHeadline,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  /* "Others" row when selected — blue tint from Figma */
  reasonRowOthersSelected: {
    backgroundColor: '#E6F6FF',
    borderColor: '#E1EFF7',
  },

  emojiBox: {
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
    flex: 1,
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.medium,
    fontSize: FONTS.sizes.sm,
    lineHeight: 20,
    color: COLORS.textSubHeadline,
    marginLeft: 8,
  },
  reasonLabelOthersSelected: {
    color: COLORS.textMainHeadline,
  },

  checkIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },

  /* Others text input */
  othersInputWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    height: 88,
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 8,
    justifyContent: 'space-between',
  },
  othersInput: {
    flex: 1,
    fontFamily: FONTS.family,
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textMainHeadline,
    padding: 0,
    margin: 0,
    textAlignVertical: 'top',
  },
  charCount: {
    fontFamily: FONTS.family,
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textPlaceholder,
    textAlign: 'right',
    alignSelf: 'flex-end',
  },

  /* Bottom action row */
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
  },
  cancelText: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.semiBold,
    fontSize: FONTS.sizes.sm,
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
  submitActive: {
    backgroundColor: COLORS.surfaceBluePrimary,
  },
  submitDisabled: {
    backgroundColor: COLORS.surfaceDisabledBackground,
  },
  submitText: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.semiBold,
    fontSize: FONTS.sizes.sm,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  submitTextActive: {
    color: COLORS.white,
  },
  submitTextDisabled: {
    color: COLORS.textDisabled,
  },
});
