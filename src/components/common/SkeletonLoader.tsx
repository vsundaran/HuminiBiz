import React, { useEffect } from 'react';
import { View, StyleSheet, LayoutChangeEvent, DimensionValue } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';

interface SkeletonLoaderProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: any;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const animatedValue = useSharedValue(0);
  const [layoutWidth, setLayoutWidth] = React.useState(0);

  useEffect(() => {
    animatedValue.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.linear }),
      -1, // infinite
      false // do not reverse
    );
  }, [animatedValue]);

  const onLayout = (event: LayoutChangeEvent) => {
    setLayoutWidth(event.nativeEvent.layout.width);
  };

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      animatedValue.value,
      [0, 1],
      [-layoutWidth, layoutWidth]
    );

    return {
      transform: [{ translateX }],
    };
  });

  return (
    <View
      style={[
        styles.container,
        { width, height, borderRadius },
        style,
      ]}
      onLayout={onLayout}
    >
      <Animated.View style={[styles.shimmer, animatedStyle]}>
        {/* Simulating a gradient shimmer using opacity */}
        <Animated.View style={styles.gradient} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E1E9EE', // Generic skeleton background color
    overflow: 'hidden',
  },
  shimmer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
  gradient: {
    flex: 1,
    backgroundColor: '#F2F8FC', // Lighter color for the sweep
    opacity: 0.6,
    // Note: React Native Doesn't support LinearGradient without react-native-linear-gradient.
    // Using simple opacity trick for 60fps shimmer instead of pulling more dependencies.
  },
});
