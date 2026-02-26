import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../theme';

export type EventType = 'NewJoinee' | 'Promotion' | 'Birthday' | 'DeadlineStress' | 'WorkAnniversary';

interface EventChipProps {
  type: EventType;
}

export const EventChip: React.FC<EventChipProps> = ({ type }) => {
  let backgroundColor = COLORS.greenBackground;
  let textColor = COLORS.textGreenDark;
  let label = '';

  switch (type) {
    case 'NewJoinee':
      label = 'Wishes | New Joinee';
      break;
    case 'Promotion':
      backgroundColor = COLORS.purpleBackground;
      textColor = COLORS.textPurpleDark;
      label = 'Celebration | Promotion';
      break;
    case 'Birthday':
      label = 'Wishes | Birthday';
      break;
    case 'WorkAnniversary':
      label = 'Wishes | Work anniversery';
      break;
    case 'DeadlineStress':
      backgroundColor = COLORS.redBackground;
      textColor = COLORS.textRedDarkest;
      label = 'Motivation | Deadline Stress';
      break;
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 210,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    ...FONTS.styles.subTitleSemibold14, // Roughly matching the expected styling
    fontSize: 11,
    lineHeight: 18,
    fontFamily: 'DM Sans',
    fontWeight: '600',
  },
});
