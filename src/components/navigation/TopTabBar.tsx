import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS } from '../../theme';
import { HomeIcon } from '../icons/HomeIcon';
import { UserIcon } from '../icons/UserIcon';
import { HeartOutlineIcon } from '../icons/HeartOutlineIcon';

type Tab = 'Home' | 'Your Moments' | 'Profile';

interface TopTabBarProps {
  activeTab: Tab;
  onTabPress: (tab: Tab) => void;
}

export const TopTabBar: React.FC<TopTabBarProps> = ({ activeTab, onTabPress }) => {
  return (
    <View style={styles.container}>
      {/* Background shadow layer matching Figma is approximated here */}
      <View style={styles.tabsWrapper}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onTabPress('Home')}
        >
          <HomeIcon size={24} color={activeTab === 'Home' ? COLORS.selectedTabBlue : COLORS.textBodyText1} />
          <Text style={[
            styles.tabText, 
            activeTab === 'Home' ? styles.activeText : styles.inactiveText
          ]}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onTabPress('Your Moments')}
        >
          <HeartOutlineIcon size={24} color={activeTab === 'Your Moments' ? COLORS.selectedTabBlue : COLORS.textBodyText1} fill="transparent" />
          <Text style={[
            styles.tabText, 
            activeTab === 'Your Moments' ? styles.activeText : styles.inactiveText
          ]}>
            Your Moments
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onTabPress('Profile')}
        >
          <UserIcon size={24} color={activeTab === 'Profile' ? COLORS.selectedTabBlue : COLORS.textBodyText1} />
          <Text style={[
            styles.tabText, 
            activeTab === 'Profile' ? styles.activeText : styles.inactiveText
          ]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 108,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  tabsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  tabText: {
    fontFamily: 'DM Sans',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  activeText: {
    fontWeight: '600',
    color: COLORS.selectedTabBlue,
  },
  inactiveText: {
    fontWeight: '500',
    color: COLORS.textBodyText1,
  },
});
