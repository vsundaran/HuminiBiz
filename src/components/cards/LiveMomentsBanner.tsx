import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { VideoOutlineIcon } from '../icons/VideoOutlineIcon';

export const LiveMomentsBanner: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <View style={StyleSheet.absoluteFill}>
        <Svg height="100%" width="100%">
          <Defs>
            <LinearGradient id="bannerBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#c3003b" />
              <Stop offset="100%" stopColor="#790024" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#bannerBg)" />
        </Svg>
      </View>
      
      {/* Abstract SVGs from Figma would go here if needed... but text looks good without it */}
      
      <Text style={styles.countText}>122</Text>
      <Text style={styles.subtitleText}>Live moments</Text>
      
      <TouchableOpacity style={styles.meetButton}>
        <Text style={styles.meetButtonText}>Meet someone new</Text>
        <VideoOutlineIcon size={20} color="#fdfcf9" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 157,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#ff4179',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: '100%',
  },
  countText: {
    fontFamily: 'Inter',
    fontWeight: '900', // Black
    fontSize: 36,
    color: '#ff4e83',
    letterSpacing: 1.8,
    marginBottom: 4,
    // Add text shadow if needed to match design exactly
  },
  subtitleText: {
    fontFamily: 'DM Sans',
    fontWeight: '500', // Medium
    fontSize: 12,
    color: 'rgba(255, 189, 208, 0.9)',
    marginBottom: 16,
  },
  meetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 17,
    paddingVertical: 9,
    borderRadius: 200,
    borderWidth: 1,
    borderColor: 'rgba(255, 232, 208, 0.4)',
    backgroundColor: 'transparent',
  },
  meetButtonText: {
    fontFamily: 'DM Sans',
    fontWeight: '500', // Medium
    fontSize: 12,
    color: '#fdfcf9',
  },
});
