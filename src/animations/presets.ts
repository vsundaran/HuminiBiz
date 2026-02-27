import { 
  FadeIn, 
  FadeOut, 
  FadeInDown, 
  FadeInUp,
  FadeOutDown,
  FadeOutUp,
  SlideInRight,
  SlideOutLeft,
  ZoomIn,
  ZoomOut
} from 'react-native-reanimated';

/**
 * Curated entering/exiting presets using Reanimated layout animations.
 * Tuned with consistent durations based on our motion philosophy.
 */

const SPRING_DAMPING = 15;
const SPRING_STIFFNESS = 150;
const DURATION = 250;

export const presets = {
  // Simple fades
  fade: {
    entering: FadeIn.duration(DURATION),
    exiting: FadeOut.duration(DURATION),
  },
  
  // Slide up with fade (Cards, List Items)
  slideUp: {
    entering: FadeInDown.springify().damping(SPRING_DAMPING).stiffness(SPRING_STIFFNESS),
    exiting: FadeOutDown.duration(200),
  },
  
  // Slide down with fade (Dropdowns, Top notifications)
  slideDown: {
    entering: FadeInUp.springify().damping(SPRING_DAMPING).stiffness(SPRING_STIFFNESS),
    exiting: FadeOutUp.duration(200),
  },
  
  // Subtle scale in (Modals, Dialogs)
  scale: {
    entering: ZoomIn.duration(DURATION).springify().damping(SPRING_DAMPING).stiffness(SPRING_STIFFNESS),
    exiting: ZoomOut.duration(200),
  },
  
  // Staggered list items - factory function
  staggeredSlideUp: (index: number) => ({
    entering: FadeInDown.delay(index * 50)
      .springify()
      .damping(SPRING_DAMPING)
      .stiffness(SPRING_STIFFNESS),
    exiting: FadeOut.duration(150),
  }),
};
