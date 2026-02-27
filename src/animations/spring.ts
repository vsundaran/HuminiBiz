import { WithSpringConfig } from 'react-native-reanimated';

/**
 * Global spring configurations for Reanimated
 * Goal: Animations must feel invisible but premium, 180-320ms duration.
 */

// Default spring: smooth and natural, no excessive bounce
export const defaultSpring: WithSpringConfig = {
  damping: 15,
  stiffness: 150,
  mass: 1,
  overshootClamping: false,
};

// Smooth spring: heavily damped for subtle interactions without bounce
export const smoothSpring: WithSpringConfig = {
  damping: 20,
  stiffness: 100,
  mass: 1,
  overshootClamping: true,
};

// Bouncy spring: slightly more playful, use sparingly (e.g., success checkmarks)
export const bouncySpring: WithSpringConfig = {
  damping: 10,
  stiffness: 200,
  mass: 1,
  overshootClamping: false,
};
