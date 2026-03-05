import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS } from '../../theme';
import { HuminiMarkIcon } from '../icons/HuminiMarkIcon';
import { AnimatedView, AnimatedPressable } from '../../components/animated';
import { Shadow } from 'react-native-shadow-2';
import { InitialsAvatar } from '../common/InitialsAvatar';
import { useUserProfile, useUserStats, useLeaderboard, useUpdateProfile } from '../../hooks/useUserProfile';
import { useAuthStore } from '../../store/auth.store';
import { SkeletonLoader } from '../common/SkeletonLoader';
import { PenIcon } from '../../assets/icons/PenIcon';
import { AppAlert } from '../common/AppAlert';
import { AppConfirm } from '../common/AppConfirm';
import authService from '../../services/auth.service';


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

// ─── Edit Profile Modal ───────────────────────────────────────────────────────
interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  initialName: string;
  initialDepartment: string;
  initialJobRole: string;
  email: string;
  /** When true, the user cannot dismiss without saving (new user onboarding) */
  mandatory?: boolean;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  initialName,
  initialDepartment,
  initialJobRole,
  email,
  mandatory = false,
}) => {
  const [name, setName] = useState(initialName);
  const [department, setDepartment] = useState(initialDepartment);
  const [jobRole, setJobRole] = useState(initialJobRole);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; department?: string; jobRole?: string }>({});

  const { mutate: updateProfile, isPending } = useUpdateProfile();

  // Sync when modal opens with fresh data
  useEffect(() => {
    if (visible) {
      setName(initialName);
      setDepartment(initialDepartment);
      setJobRole(initialJobRole);
      setFieldErrors({});
    }
  }, [visible, initialName, initialDepartment, initialJobRole]);

  const validate = (): boolean => {
    const errors: { name?: string; department?: string; jobRole?: string } = {};
    if (!name.trim()) errors.name = 'Name is required.';
    if (!department.trim()) errors.department = 'Department is required.';
    if (!jobRole.trim()) errors.jobRole = 'Job role is required.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Alert state for update errors
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const showError = (msg: string) => {
    setAlertMessage(msg);
    setAlertVisible(true);
  };

  const handleUpdate = () => {
    if (!validate()) return;

    updateProfile(
      { name: name.trim(), department: department.trim(), jobRole: jobRole.trim() },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (error: any) => {
          const message =
            error?.response?.data?.message || 'Failed to update profile. Please try again.';
          showError(message);
        },
      }
    );
  };

  // Allow overlay dismiss only when not mandatory
  const handleOverlayPress = () => {
    if (!mandatory) onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={mandatory ? undefined : onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={handleOverlayPress}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalKAV}
        >
          {/* Stop press propagation so tapping inside modal doesn't close it */}
          <Pressable style={styles.modalSheet} onPress={(e) => e.stopPropagation()}>
            {/* Handle bar */}
            <View style={styles.modalHandle} />

            <Text style={styles.modalTitle}>
              {mandatory ? 'Complete Your Profile' : 'Edit Profile'}
            </Text>
            {mandatory && (
              <Text style={styles.mandatoryHint}>
                Please complete your profile to get started.
              </Text>
            )}

            {/* Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Name</Text>
              <TextInput
                style={[styles.fieldInput, fieldErrors.name ? styles.fieldInputError : null]}
                value={name}
                onChangeText={(v) => { setName(v); setFieldErrors(prev => ({ ...prev, name: undefined })); }}
                placeholder="Enter your name"
                placeholderTextColor={COLORS.textPlaceholder}
                autoCapitalize="words"
              />
              {fieldErrors.name ? <Text style={styles.errorText}>{fieldErrors.name}</Text> : null}
            </View>

            {/* Department */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Department</Text>
              <TextInput
                style={[styles.fieldInput, fieldErrors.department ? styles.fieldInputError : null]}
                value={department}
                onChangeText={(v) => { setDepartment(v); setFieldErrors(prev => ({ ...prev, department: undefined })); }}
                placeholder="Enter your department"
                placeholderTextColor={COLORS.textPlaceholder}
              />
              {fieldErrors.department ? <Text style={styles.errorText}>{fieldErrors.department}</Text> : null}
            </View>

            {/* Job Role */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Job Role</Text>
              <TextInput
                style={[styles.fieldInput, fieldErrors.jobRole ? styles.fieldInputError : null]}
                value={jobRole}
                onChangeText={(v) => { setJobRole(v); setFieldErrors(prev => ({ ...prev, jobRole: undefined })); }}
                placeholder="Enter your job role"
                placeholderTextColor={COLORS.textPlaceholder}
              />
              {fieldErrors.jobRole ? <Text style={styles.errorText}>{fieldErrors.jobRole}</Text> : null}
            </View>

            {/* Email (disabled) */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email</Text>
              <TextInput
                style={[styles.fieldInput, styles.fieldInputDisabled]}
                value={email}
                editable={false}
                selectTextOnFocus={false}
              />
              <Text style={styles.fieldHint}>Email address cannot be changed.</Text>
            </View>

            {/* Update Button */}
            <TouchableOpacity
              style={[styles.updateButton, isPending && styles.updateButtonDisabled]}
              onPress={handleUpdate}
              disabled={isPending}
              activeOpacity={0.85}
            >
              {isPending ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.updateButtonText}>Update Profile</Text>
              )}
            </TouchableOpacity>

            {/* Cancel — hidden in mandatory mode */}
            {!mandatory && (
              <TouchableOpacity style={styles.cancelButton} onPress={onClose} disabled={isPending}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>

      {/* Inline error alert inside the modal */}
      <AppAlert
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        type="error"
        title="Update Failed"
        message={alertMessage}
      />
    </Modal>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
interface ProfileContentProps {
  showEditModal?: boolean;
  isNewUser?: boolean;
  onModalDismissed?: () => void;
}

export const ProfileContent: React.FC<ProfileContentProps> = ({
  showEditModal = false,
  isNewUser = false,
  onModalDismissed,
}) => {
  const logout = useAuthStore(s => s.logout);
  const navigation = useNavigation<any>();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [logoutConfirmVisible, setLogoutConfirmVisible] = useState(false);

  // Auto-open modal when parent requests it (new user profile setup)
  useEffect(() => {
    if (showEditModal) {
      setEditModalVisible(true);
    }
  }, [showEditModal]);

  const handleModalClose = () => {
    setEditModalVisible(false);
    onModalDismissed?.();
  };

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
    setLogoutConfirmVisible(true);
  };

  const confirmLogout = async () => {
    setLogoutConfirmVisible(false);
    try {
      // Best-effort: tell the server to revoke all refresh tokens for this user.
      // Even if this fails (e.g. no network), we still clear local state.
      await authService.logout();
    } catch {
      // Ignore — local logout always proceeds
    } finally {
      logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
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
    <>
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
                {/* Edit Icon */}
                <TouchableOpacity
                  onPress={() => setEditModalVisible(true)}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  style={styles.editIconBtn}
                  activeOpacity={0.7}
                >
                  <PenIcon size={20} color={COLORS.textBodyText1} />
                </TouchableOpacity>
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

      {/* ── Edit Profile Modal ─────────────────────────────────────────────── */}
      <EditProfileModal
        visible={editModalVisible}
        onClose={handleModalClose}
        initialName={profile?.name ?? ''}
        initialDepartment={profile?.department ?? ''}
        initialJobRole={profile?.jobRole ?? ''}
        email={profile?.email ?? ''}
        mandatory={isNewUser}
      />

      {/* ── Logout Confirm Dialog ──────────────────────────────────────────── */}
      <AppConfirm
        visible={logoutConfirmVisible}
        onCancel={() => setLogoutConfirmVisible(false)}
        onConfirm={confirmLogout}
        title="Log out"
        message="You will be signed out of your account and returned to the login screen."
        confirmLabel="Log out"
        cancelLabel="Stay"
        confirmStyle="destructive"
      />
    </>
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
  editIconBtn: {
    padding: 4,
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

  // ── Modal Styles ────────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalKAV: {
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    paddingTop: 12,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.semiBold,
    fontSize: 18,
    lineHeight: 26,
    letterSpacing: -0.36,
    color: COLORS.primary,
    marginBottom: 24,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.semiBold,
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: 0.1,
    color: '#515B60',
    marginBottom: 6,
  },
  fieldInput: {
    height: 48,
    backgroundColor: '#F7F8FA',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E4E8',
    paddingHorizontal: 14,
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.medium,
    fontSize: 14,
    color: COLORS.primary,
  },
  fieldInputError: {
    borderColor: COLORS.error,
    backgroundColor: '#FFF5F5',
  },
  fieldInputDisabled: {
    backgroundColor: '#F0F0F0',
    color: COLORS.textPlaceholder,
    borderColor: '#E8E8E8',
  },
  errorText: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.medium,
    fontSize: 12,
    color: COLORS.error,
    marginTop: 4,
    marginLeft: 2,
  },
  fieldHint: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.medium,
    fontSize: 12,
    color: COLORS.textBodyText1,
    marginTop: 4,
    marginLeft: 2,
  },
  updateButton: {
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  updateButtonDisabled: {
    backgroundColor: COLORS.surfaceDisabledBackground,
  },
  updateButtonText: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.semiBold,
    fontSize: 15,
    color: COLORS.white,
    letterSpacing: 0.1,
  },
  cancelButton: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.medium,
    fontSize: 14,
    color: COLORS.textBodyText1,
  },
  mandatoryHint: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.medium,
    fontSize: 13,
    color: COLORS.textBodyText1,
    marginBottom: 20,
    lineHeight: 18,
  },
});
