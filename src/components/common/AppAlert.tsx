import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { COLORS, FONTS } from '../../theme';

// ─── Types ────────────────────────────────────────────────────────────────────
export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AppAlertProps {
  visible: boolean;
  onClose: () => void;
  type?: AlertType;
  title: string;
  message?: string;
  buttonLabel?: string;
}

// ─── Type-based config ────────────────────────────────────────────────────────
const TYPE_CONFIG: Record<AlertType, { emoji: string; accent: string; bgTint: string }> = {
  success: { emoji: '✓', accent: '#22C55E', bgTint: '#F0FDF4' },
  error:   { emoji: '✕', accent: '#EF4444', bgTint: '#FFF5F5' },
  warning: { emoji: '!',  accent: '#F59E0B', bgTint: '#FFFBEB' },
  info:    { emoji: 'i',  accent: '#3B82F6', bgTint: '#EFF6FF' },
};

// ─── AppAlert ─────────────────────────────────────────────────────────────────
export const AppAlert: React.FC<AppAlertProps> = ({
  visible,
  onClose,
  type = 'info',
  title,
  message,
  buttonLabel = 'OK',
}) => {
  const config = TYPE_CONFIG[type];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          {/* Icon badge */}
          <View style={[styles.iconBadge, { backgroundColor: config.bgTint, borderColor: config.accent + '33' }]}>
            <Text style={[styles.iconText, { color: config.accent }]}>{config.emoji}</Text>
          </View>

          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}

          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: config.accent }]}
            onPress={onClose}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>{buttonLabel}</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  sheet: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 10,
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconText: {
    fontSize: 22,
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.bold,
  },
  title: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.semiBold,
    fontSize: 17,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24,
  },
  message: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.medium,
    fontSize: 14,
    color: COLORS.textBodyText1,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 4,
  },
  primaryBtn: {
    width: '100%',
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  primaryBtnText: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.semiBold,
    fontSize: 15,
    color: '#FFFFFF',
    letterSpacing: 0.1,
  },
});
