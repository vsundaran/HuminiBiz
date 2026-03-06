import React, { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

// ─── AnimatedSwitch ────────────────────────────────────────────────────────────
// Pixel-perfect custom switch based on Figma:
//   ON  (node 1163:6359): horizontal gradient #3f5763 (3.125%) → #2482b1 (103.13%)
//   OFF (node 1163:6401): bg #EDEDED
//
// Track:  42 × 24pt, borderRadius 170
// Thumb:  20 × 20pt white circle, subtle shadow
// Easing: cubic-bezier(0.4, 0, 0.2, 1), 220ms

const TRACK_WIDTH = 42;
const TRACK_HEIGHT = 24;
const THUMB_SIZE = 20;
const THUMB_OFF_X = 2;
const THUMB_ON_X = TRACK_WIDTH - THUMB_SIZE - 2; // = 20
const DURATION = 220;

interface AnimatedSwitchProps {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
  disabled?: boolean;
}

const EASING = Easing.bezier(0.4, 0, 0.2, 1);

export const AnimatedSwitch: React.FC<AnimatedSwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
}) => {
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, { duration: DURATION, easing: EASING });
  }, [value, progress]);

  // Thumb slides left ↔ right
  const thumbStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(progress.value, [0, 1], [THUMB_OFF_X, THUMB_ON_X]),
      },
    ],
  }));

  // OFF grey track fades out as we switch ON
  const offTrackStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.6], [1, 0]),
  }));

  // ON gradient track fades in as we switch ON
  const onTrackStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.4, 1], [0, 1]),
  }));

  return (
    <Pressable
      onPress={() => !disabled && onValueChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      {/* Wrapper keeps both tracks stacked and clips the thumb */}
      <Animated.View style={styles.track}>

        {/* OFF layer — solid #EDEDED */}
        <Animated.View style={[StyleSheet.absoluteFill, styles.offTrack, offTrackStyle]} />

        {/* ON layer — Figma linear gradient #3f5763 → #2482b1 */}
        <Animated.View style={[StyleSheet.absoluteFill, onTrackStyle, styles.onTrackWrapper]}>
          <LinearGradient
            colors={['#3f5763', '#2482b1']}
            start={{ x: 0.03125, y: 0.5 }}  // 3.125% from Figma
            end={{ x: 1.03, y: 0.5 }}        // 103.13% from Figma
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        {/* Thumb */}
        <Animated.View style={[styles.thumb, thumbStyle]} />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: 170,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  offTrack: {
    borderRadius: 170,
    backgroundColor: '#EDEDED',
  },
  onTrackWrapper: {
    borderRadius: 170,
    overflow: 'hidden',
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 4,
  },
});
