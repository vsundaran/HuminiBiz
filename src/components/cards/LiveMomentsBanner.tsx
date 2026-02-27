import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { VideoOutlineIcon } from '../icons/VideoOutlineIcon';
import { LiveMomentsFace1Icon } from '../../assets/icons/LiveMomentsFace1Icon';
import { LiveMomentsFace2Icon } from '../../assets/icons/LiveMomentsFace2Icon';
import { LiveMomentsFace3Icon } from '../../assets/icons/LiveMomentsFace3Icon';
import { LiveMomentsFace5Icon } from '../../assets/icons/LiveMomentsFace5Icon';
import { LiveMomentsFace6Icon } from '../../assets/icons/LiveMomentsFace6Icon';
import { LiveMomentsFace7Icon } from '../../assets/icons/LiveMomentsFace7Icon';
import { LiveMomentsGlowIcon } from '../../assets/icons/LiveMomentsGlowIcon';

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
      
      {/* Abstract Background SVGs */}
      <View style={[StyleSheet.absoluteFill, { overflow: 'hidden', borderRadius: 16 }]}>
        <View style={{ position: 'absolute', top: -54.5, left: '50%', marginLeft: -61, width: 122, height: 122 }}>
          <LiveMomentsGlowIcon width="100%" height="100%" />
        </View>

        <View style={{ position: 'absolute', top: 13.8, left: 15.5, width: 68, height: 82.5 }}>
          <LiveMomentsFace7Icon width="100%" height="100%" />
        </View>

        <View style={{ position: 'absolute', top: 16.5, left: 248.5, width: 53.8, height: 97.5 }}>
          <LiveMomentsFace6Icon width="100%" height="100%" />
        </View>

        <View style={{ position: 'absolute', top: 78.5, left: 50, width: 54.7, height: 78.3, transform: [{ rotate: '17.18deg' }] }}>
          <LiveMomentsFace2Icon width="100%" height="100%" />
        </View>

        <View style={{ position: 'absolute', top: 73, left: 198, width: 52.7, height: 74, transform: [{ rotate: '-23.5deg' }] }}>
          <LiveMomentsFace3Icon width="100%" height="100%" />
        </View>

        <View style={{ position: 'absolute', top: 72, left: -20, width: 68, height: 90.8, transform: [{ rotate: '-6.81deg' }] }}>
          <LiveMomentsFace5Icon width="100%" height="100%" />
        </View>

        <View style={{ position: 'absolute', top: 64, left: 272.4, width: 93.5, height: 103.6, transform: [{ rotate: '21.97deg' }] }}>
          <LiveMomentsFace1Icon width="100%" height="100%" />
        </View>
      </View>
      
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
