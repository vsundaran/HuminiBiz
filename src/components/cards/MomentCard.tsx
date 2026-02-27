import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, FONTS } from '../../theme';
import { EventChip, EventType } from '../chips/EventChip';
import { ClockIcon } from '../icons/ClockIcon';
import { CalendarIcon } from '../icons/CalendarIcon';
import { HeartFillIcon } from '../icons/HeartFillIcon';
import { HeartOutlineIcon } from '../icons/HeartOutlineIcon';
import { VideoOutlineIcon } from '../icons/VideoOutlineIcon';
import { BellIcon } from '../icons/BellIcon';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AnimatedCard, AnimatedPressable, AnimatedView } from '../animated';
import { Shadow } from 'react-native-shadow-2';

export type RootStackParamList = {
  Home: undefined;
  Ringing: undefined;
  VideoCall: undefined;
  CallCompleted: undefined;
};

export type MomentCardProps = {
  userName: string;
  userRole: string;
  profileImageUrl?: string;
  flagUrl?: string; // Optional right now
  eventType: EventType;
  eventMessage: string;
  dateStr?: string;
  timeStr?: string;
  buttonType: 'NotifyMe' | 'ShareWishes';
  likesCount: number;
  isInCall?: boolean;
};

export const MomentCard: React.FC<MomentCardProps> = ({
  userName,
  userRole,
  profileImageUrl,
  eventType,
  eventMessage,
  dateStr,
  timeStr,
  buttonType,
  likesCount,
  isInCall,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <AnimatedCard style={{ marginBottom: 16, width: '100%' }}>
      <Shadow
        distance={8}
        startColor="#0000000A"
        offset={[0, 8]}
        style={styles.cardContainer}
        containerStyle={{ width: '100%' }}
      >
        {/* Header section */}
        <View style={styles.headerRow}>
          <Image 
            // source={{ uri: profileImageUrl || `https://ui-avatars.com/api/?name=${userName.replace(' ', '+')}&background=EAEAEA&color=263238` }} 
            source={{ uri: 'https://i.pravatar.cc/300?img=68' }}
            style={styles.avatar} 
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userRole}>{userRole}</Text>
          </View>
        </View>

      <View style={styles.divider} />

      {/* Content section */}
      <View style={styles.contentSection}>
        <View style={styles.chipRow}>
          <EventChip type={eventType} />
        </View>
        <Text style={styles.messageText}>{eventMessage}</Text>
      </View>

      {/* Date & Time section */}
      {(dateStr || timeStr) && (
        <View style={styles.dateTimeRow}>
          {dateStr && (
            <View style={styles.iconTextRow}>
              <CalendarIcon size={16} />
              <Text style={styles.dateTimeText}>{dateStr}</Text>
            </View>
          )}
          {timeStr && (
            <View style={styles.iconTextRow}>
              <ClockIcon size={16} />
              <Text style={styles.dateTimeText}>{timeStr}</Text>
            </View>
          )}
        </View>
      )}

      {/* Footer / Actions section */}
      <View style={styles.footerRow}>
        {isInCall && (
          <View style={styles.inCallWrapper}>
            <Shadow
              distance={2}
              startColor="rgba(209,0,0,0.5)"
              style={styles.inCallDot}
            >
              <View />
            </Shadow>
            <Text style={styles.inCallText}>In call</Text>
          </View>
        )}
        
        {/* <Shadow
          distance={buttonType === 'ShareWishes' && !isInCall ? 4 : 0}
          startColor={buttonType === 'ShareWishes' && !isInCall ? "rgba(72,86,92,0.29)" : "transparent"}
          offset={[0, 4]}
          style={{ width: '100%', borderRadius: 10 }}
          containerStyle={{ flex: 1, marginRight: 10 }}
        > */}
          <AnimatedPressable 
            style={[
              styles.mainButton, 
              buttonType === 'NotifyMe' ? styles.notifyButton : styles.wishesButton,
              isInCall && styles.disabledButton
            ]}
            disabled={isInCall}
            onPress={() => {
              navigation.navigate('Ringing');
            }}
          >
            <Text style={[
              buttonType === 'NotifyMe' ? styles.notifyButtonText : styles.wishesButtonText,
              isInCall && styles.disabledButtonText
            ]}>
              {buttonType === 'NotifyMe' ? 'Notify me' : 'Share Your Wishes'}
            </Text>
            {buttonType === 'NotifyMe' ? (
              <BellIcon size={20} color={COLORS.primary} />
            ) : (
              <VideoOutlineIcon size={20} color={isInCall ? '#9b9b9b' : COLORS.white} />
            )}
          </AnimatedPressable>
        {/* </Shadow> */}
        
        <AnimatedPressable style={styles.likeButtonContainer}>
          {likesCount > 0 ? (
            <HeartFillIcon size={28} />
          ) : (
            <HeartOutlineIcon size={28} color={COLORS.textSubHeadline} fill="white" />
          )}
          <Text style={[styles.likeCountText, likesCount > 0 && { color: '#8b7200' }]}>
            {likesCount}
          </Text>
        </AnimatedPressable>
      </View>
      </Shadow>
    </AnimatedCard>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    backgroundColor: COLORS.background2,
    borderWidth: 1.5,
    borderColor: COLORS.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingLeft: 7,
  },
  avatar: {
    width: 53,
    height: 53,
    borderRadius: 26.5,
    backgroundColor: '#ccc',
    marginRight: 8,
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 2,
  },
  userName: {
    ...FONTS.styles.subTitleBold16,
    color: COLORS.textMainHeadline,
    fontSize: 16,
  },
  userRole: {
    ...FONTS.styles.bodyMedium14,
    color: COLORS.textBodyText1,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#EAEAEA',
    marginVertical: 10,
  },
  contentSection: {
    marginTop: 6,
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  messageText: {
    fontFamily: 'DM Sans',
    fontWeight: '600',
    color: COLORS.textSubHeadline,
    fontSize: 15,
    lineHeight: 20,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18, // Gap before buttons
  },
  iconTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  dateTimeText: {
    ...FONTS.styles.bodyMedium14,
    color: COLORS.textBodyText1,
    marginLeft: 5,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 10,
    width: '90%',
    gap: 10, // React Native spacing between text and icon
  },
  notifyButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.surfaceBluePrimary,
  },
  wishesButton: {
    backgroundColor: COLORS.surfaceBluePrimary,
  },
  notifyButtonText: {
    ...FONTS.styles.subTitleSemibold14,
    color: COLORS.primary,
    fontSize: 14,
  },
  wishesButtonText: {
    ...FONTS.styles.subTitleSemibold14,
    color: COLORS.textBlueWhite,
    fontSize: 14,
  },
  inCallWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  inCallDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#d10000',
    marginRight: 4,
  },
  inCallText: {
    fontFamily: 'DM Sans',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 20,
    color: '#d10000',
  },
  disabledButton: {
    backgroundColor: '#ddd',
  },
  disabledButtonText: {
    color: '#9b9b9b',
  },
  likeButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
  },
  likeCountText: {
    fontFamily: 'DM Sans',
    fontWeight: '700',
    fontSize: 8,
    color: COLORS.textSubHeadline,
    marginTop: 2,
  }
});
