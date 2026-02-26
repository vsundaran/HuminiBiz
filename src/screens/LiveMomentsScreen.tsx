import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { MomentCard } from '../components/cards/MomentCard';
import { LiveMomentsBanner } from '../components/cards/LiveMomentsBanner';
import { COLORS, FONTS } from '../theme';
import { ArrowRightThinIcon } from '../components/icons/ArrowRightThinIcon';

type FilterTab = 'All' | 'Wishes' | 'Motivation' | 'Celebration';

export const LiveMomentsScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<FilterTab>('All');

  const filterTabs: FilterTab[] = ['All', 'Wishes', 'Motivation', 'Celebration'];

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

        {/* Top Navigation */}
        <View style={styles.topNav}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <View style={[{ transform: [{ rotate: '180deg' }] }]}>
              <ArrowRightThinIcon size={14} color="#000" />
            </View>
          </TouchableOpacity>
          <Text style={styles.title}>Live moments</Text>
        </View>

        {/* Filter Tabs Row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsWrapper} contentContainerStyle={styles.tabsContainer}>
          {filterTabs.map((tab) => (
            <TouchableOpacity 
              key={tab} 
              style={[styles.filterChip, activeTab === tab && styles.filterChipActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.filterChipText, activeTab === tab && styles.filterChipTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Content List */}
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <LiveMomentsBanner />

          <MomentCard
            userName="Gnani Gnanasekaran"
            userRole="Frappe Manager"
            eventType="WorkAnniversary"
            eventMessage="Today is my work anniversary! Feel free to call me and share your wishes or celebrate this moment together."
            timeStr="Ends in 50m"
            buttonType="ShareWishes"
            likesCount={0}
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
          
          <MomentCard
            userName="Jones Israel"
            userRole="Human Resources"
            eventType="DeadlineStress"
            eventMessage="I’m facing a tough deadline today, feel free to call and motivate me."
            timeStr="Ends in 45m"
            buttonType="ShareWishes"
            likesCount={0}
            isInCall={true}
          />
          
          <MomentCard
            userName="Prasad Kumar O"
            userRole="Admin"
            eventType="Birthday"
            eventMessage="It’s my birthday today, feel free to call me and share your wishes."
            timeStr="Ends in 45m"
            buttonType="ShareWishes"
            likesCount={0}
          />
          
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFBEA',
  },
  container: {
    flex: 1,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 8,
    padding: 4,
    transform: [{rotate: '90deg'}]
  },
  title: {
    ...FONTS.styles.headlineBold24,
    fontSize: 18,
    color: '#263238',
  },
  tabsWrapper: {
    maxHeight: 45,
    marginBottom: 20,
  },
  tabsContainer: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#FCFCFC',
    borderWidth: 0.7,
    borderColor: '#E9EBEB',
  },
  filterChipActive: {
    backgroundColor: '#263238',
    borderColor: '#263238',
  },
  filterChipText: {
    ...FONTS.styles.bodyMedium14,
    fontSize: 14,
    // marginBottom: 2,
    color: '#515b60',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  bottomSpacer: {
    height: 40, // some extra space at bottom
  }
});
