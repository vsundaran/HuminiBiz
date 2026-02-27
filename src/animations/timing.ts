import { Easing, WithTimingConfig } from 'react-native-reanimated';

/**
 * Global timing configurations for Reanimated
 * Goal: Animations duration 180-320ms, non-linear easing.
 */

// Default UI transition duration
const DURATION = 250;

// Easing bezier curves (Material/iOS inspired)
export const easings = {
  // Standard bezier: good for moving elements
  standard: Easing.bezier(0.2, 0.0, 0, 1.0),
  // Decelerate: entering screen
  decelerate: Easing.bezier(0.0, 0.0, 0, 1.0),
  // Accelerate: exiting screen
  accelerate: Easing.bezier(0.3, 0.0, 0.8, 0.15),
  // Linear
  linear: Easing.linear,
};

// Fast timing: 180ms - good for small opacity changes
export const fastTiming: WithTimingConfig = {
  duration: 180,
  easing: easings.standard,
};

// Default timing: 250ms - good for general transitions
export const defaultTiming: WithTimingConfig = {
  duration: DURATION,
  easing: easings.standard,
};

// Slow timing: 320ms - good for larger screen transitions
export const slowTiming: WithTimingConfig = {
  duration: 320,
  easing: easings.decelerate,
};

// Exiting timing: slightly faster exit
export const exitTiming: WithTimingConfig = {
  duration: 200,
  easing: easings.accelerate,
};
