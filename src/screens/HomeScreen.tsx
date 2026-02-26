import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { MomentCard } from '../components/cards/MomentCard';
import { TopTabBar } from '../components/navigation/TopTabBar';
import { COLORS, FONTS } from '../theme';
import { HuminiLogo } from '../assets/icons/HuminiLogo';
import { BellIcon } from '../components/icons/BellIcon';
import { PlusIcon } from '../components/icons/PlusIcon';
import { ViewAllButton } from '../components/buttons/ViewAllButton';
import { SubscribeCard } from '../components/cards/SubscribeCard';

type Tab = 'Home' | 'Your Moments' | 'Profile';

export const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Home');
  const navigation = useNavigation<any>();


  const handleNavigateToLiveMoments = () => {
    navigation.navigate('LiveMoments');
  };

  const handleTabPress = (tab: Tab) => {
    if (tab === 'Your Moments') {
      navigation.navigate('YourMoments');
    } else {
      setActiveTab(tab);
    }
  };


  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Main Background Gradient using SVG */}
        <View style={StyleSheet.absoluteFill}>
          <Svg height="100%" width="100%">
            <Defs>
              <LinearGradient id="mainBg" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#FFFBEA" />
                <Stop offset="30%" stopColor="#F4F4F4" />
                <Stop offset="100%" stopColor="#F4F4F4" />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#mainBg)" />
          </Svg>
        </View>

        {/* Header Section */}
        <View style={styles.headerSection}>
          <HuminiLogo width={55} height={55}/>
          <TouchableOpacity style={styles.notificationBell}>
            <BellIcon size={30} color={COLORS.primary} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Subscribe Card */}
          <SubscribeCard />

          {/* Live moments section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Live moments</Text>
            
            <MomentCard
              userName="Gnani Gnanasekaran"
              userRole="Frappe Manager"
              eventType="Birthday"
              eventMessage="Today is my work anniversary! Feel free to call me and share your wishes or celebrate this moment together."
              timeStr="Ends in 50m"
              buttonType="ShareWishes"
              likesCount={100}
            />

            <MomentCard
              userName="Rajashekar Reddy"
              userRole="Associate Developer"
              eventType="Promotion"
              eventMessage="I’ve been promoted today, feel free to call and celebrate this moment."
              timeStr="Ends in 45m"
              buttonType="ShareWishes"
              likesCount={0}
            />

            <MomentCard
              userName="Tamilselvan G"
              userRole="UX/UI Designer"
              eventType="Birthday"
              eventMessage="It’s my birthday today, feel free to call me and share your wishes."
              timeStr="Ends in 45m"
              buttonType="ShareWishes"
              likesCount={0}
            />

            <ViewAllButton
              label="View All (122)"
              onPress={() => navigation.navigate('LiveMoments')}
            />
          </View>

          {/* In Next 2h section */}
          <View style={[styles.sectionContainer, styles.greyBackgroundContainer]}>
            <Text style={styles.sectionTitle}>In Next 2h</Text>
            
            <MomentCard
              userName="Krishanmoorthy"
              userRole="Associate Developer"
              eventType="Promotion"
              eventMessage="I’ve been promoted today, feel free to call and celebrate this moment."
              timeStr="11:00AM - 12:00PM"
              buttonType="NotifyMe"
              likesCount={0}
            />
          </View>

          {/* Others section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Others</Text>

            <MomentCard
              userName="Jeeva Santiago"
              userRole="UX Designer"
              eventType="NewJoinee"
              eventMessage="I’ve just joined the team, feel free to call and say hello."
              dateStr="12/3/26"
              timeStr="11:00AM - 12:00PM"
              buttonType="NotifyMe"
              likesCount={0}
            />

            <MomentCard
              userName="Surya M S"
              userRole="Full-stack developer"
              eventType="DeadlineStress"
              eventMessage="I’ve just joined the team, feel free to call and say hello."
              dateStr="12/3/26"
              timeStr="11:00AM - 12:00PM"
              buttonType="NotifyMe"
              likesCount={0}
            />
          </View>
          
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity style={styles.fab}>
          <PlusIcon size={24} color={COLORS.primary} />
        </TouchableOpacity>

        {/* Tab Bar at the bottom */}
        <TopTabBar activeTab={activeTab} onTabPress={handleTabPress} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fffbea', // Base color before gradient takes over
  },
  container: {
    flex: 1,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  notificationBell: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    // borderWidth: 1.5,
    // borderColor: '#EAEAEA',
    justifyContent: 'center',
    alignItems: 'center',
    // // shadowColor: '#000',
    // // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.05,
    // shadowRadius: 10,
    // elevation: 3,
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.error,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  sectionContainer: {
    marginBottom: 32,
  },
  greyBackgroundContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 24,
    padding: 16,
    marginHorizontal: -16, 
  },
  sectionTitle: {
    ...FONTS.styles.headlineBold24,
    color: COLORS.textMainHeadline,
    fontSize: 18,
    marginBottom: 16,
    letterSpacing: 0.5
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#263238',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
    marginTop: 10,
    gap: 10,
  },
  viewAllText: {
    ...FONTS.styles.subTitleSemibold14,
    color: COLORS.white,
    fontSize: 13,
  },
  bottomSpacer: {
    height: 120, // space for tab bar
  },
  fab: {
    position: 'absolute',
    bottom: 110, 
    right: 16,
    width: 60,
    height: 60,
    backgroundColor: '#FFE15B',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 20,
  },
});
