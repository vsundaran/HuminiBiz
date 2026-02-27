import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { COLORS, FONTS } from '../../theme';
import { VideoOutlineIcon } from '../icons/VideoOutlineIcon';
import { SubscribeBg1Icon } from '../icons/SubscribeBg1Icon';
import { SubscribeBg2Icon } from '../icons/SubscribeBg2Icon';
import { SubscribeBg3Icon } from '../icons/SubscribeBg3Icon';
interface SubscribeCardProps {
  onSubscribePress?: () => void;
  subscriberCount?: number;
}

export const SubscribeCard: React.FC<SubscribeCardProps> = ({ 
  onSubscribePress,
  subscriberCount = 55
}) => {
  return (
    <View style={styles.subscribeCard}>
      {/* Background Gradient */}
      <View style={[StyleSheet.absoluteFill, { borderRadius: 16, overflow: 'hidden' }]}>
        <Svg height="100%" width="100%">
          <Defs>
            <LinearGradient id="subBg" x1="50%" y1="0%" x2="50%" y2="100%">
              <Stop offset="5%" stopColor="rgba(255, 237, 177, 0.9)" />
              <Stop offset="95%" stopColor="rgba(255, 236, 226, 1)" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#subBg)" />
        </Svg>
        
        {/* Illustrations placed inside the same container with overflow hidden */}
        <View style={StyleSheet.absoluteFillObject}>
          <View style={styles.illust3}><SubscribeBg3Icon width={49} height={88} /></View>
          <View style={styles.illust2}><SubscribeBg2Icon width={48} height={67} /></View>
          <View style={styles.illust1}><SubscribeBg1Icon width={60} height={77} /></View>
        </View>
      </View>

      <View style={styles.subscribeCardContent}>
        {/* <Text style={styles.subscribeTitle}>
          <Text style={{ fontWeight: '700' }}>Subscribe</Text> to receive morning wishes
        </Text> */}
        <Text style={styles.subscribeSubtitle}>Start someone’s day with a simple good morning.</Text>
        
        <TouchableOpacity style={styles.morningButton} onPress={onSubscribePress}>
          <Text style={styles.morningButtonText}>Say good morning ({subscriberCount})</Text>
          <VideoOutlineIcon size={16} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.subscribeTitle}>
          <Text style={{ fontWeight: '700' }}>Subscribe</Text> to receive morning wishes
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  subscribeCard: {
    height: 135,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 1)',
    marginBottom: 32,
    position: 'relative',
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 0,
  },
  illust1: { position: 'absolute', right: -10, top: 50, transform: [{rotate: '22deg'}] },
  illust2: { position: 'absolute', right: 80, bottom: 10, transform: [{rotate: '-23.5deg'}] },
  illust3: { position: 'absolute', right: 40, top: 5 },
  subscribeCardContent: {
    padding: 16,
    flex: 1,
    justifyContent: 'flex-start',
  },
  subscribeTitle: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    color: COLORS.textBodyText1,
    marginTop: 11,
  },
  subscribeSubtitle: {
    ...FONTS.styles.subTitleSemibold14,
    fontSize: FONTS.sizes.sm,
    color: '#7d6500', // Kept specific color as it's not in theme yet
    width: '60%', 
    lineHeight: 18,
  },
  morningButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe057', // Kept specific yellow button color
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 200,
    marginTop: 20,
    gap: 8,
  },
  morningButtonText: {
    fontFamily: FONTS.family,
    fontWeight: '500',
    fontSize: FONTS.sizes.xs,
    color: COLORS.primary,
  },
});
