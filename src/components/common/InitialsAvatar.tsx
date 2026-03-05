import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

// ─── Avatar color palette ─────────────────────────────────────────────────────
// 10 harmonious colors that look great on a white background app
const AVATAR_COLORS = [
  { bg: '#E3F2D9', text: '#090811ff' }
];

/**
 * Pick a deterministic color from the palette based on the name string.
 * Same name always gets the same color.
 */
function pickColor(name: string): { bg: string; text: string } {
  if (!name || name.trim().length === 0) {
    return AVATAR_COLORS[0];
  }

  // let hash = 0;
  // for (let i = 0; i < name.length; i++) {
  //   hash = name.charCodeAt(i) + ((hash << 5) - hash);
  //   hash = hash & hash; // convert to 32bit int
  // }

  // const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[0];
}

/**
 * Extract 1-2 initials from a full name.
 * "John Doe" → "JD", "John" → "J"
 */
function extractInitials(name: string): string {
  if (!name || name.trim().length === 0) {
    return 'U';
  }
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// ─── Component ────────────────────────────────────────────────────────────────

interface InitialsAvatarProps {
  name: string;
  size?: number;
  fontSize?: number;
  style?: ViewStyle;
  borderRadius?: number;
}

/**
 * Renders a colored circle with the user's initials.
 * Used everywhere in the app instead of profile images.
 * Color is deterministic based on the name so it's always consistent.
 */
export const InitialsAvatar: React.FC<InitialsAvatarProps> = ({
  name,
  size = 53,
  fontSize,
  style,
  borderRadius,
}) => {
  const initials = extractInitials(name);
  const color = pickColor(name);
  const resolvedFontSize = fontSize ?? Math.round(size * 0.38);
  const resolvedBorderRadius = borderRadius ?? size / 2;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: resolvedBorderRadius,
          backgroundColor: color.bg,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.initials,
          {
            fontSize: resolvedFontSize,
            color: color.text,
          },
        ]}
        numberOfLines={1}
      >
        {initials}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  initials: {
    fontFamily: 'DM Sans',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
