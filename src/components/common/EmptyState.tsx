import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, FONTS } from '../../theme';

interface EmptyStateProps {
  message?: string;
  subMessage?: string;
  style?: ViewStyle;
}

/**
 * Reusable empty state component. Shown when an API returns no data.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'Nothing here yet',
  subMessage,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.emoji}>🌟</Text>
      <Text style={styles.message}>{message}</Text>
      {subMessage ? (
        <Text style={styles.subMessage}>{subMessage}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: 40,
    marginBottom: 16,
  },
  message: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.semiBold,
    fontSize: FONTS.sizes.md,
    color: COLORS.textSubHeadline,
    textAlign: 'center',
    lineHeight: 24,
  },
  subMessage: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.medium,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textBodyText1,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});
