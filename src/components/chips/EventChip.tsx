import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONTS } from '../../theme';
import { CHIP_VISUAL, DEFAULT_CHIP } from '../../theme/categoryColors';

interface EventChipProps {
  categoryName?: string;
  subcategoryName?: string;
}

export const EventChip: React.FC<EventChipProps> = ({ categoryName, subcategoryName }) => {
  const visual = React.useMemo(() => {
    if (!categoryName) return DEFAULT_CHIP;
    return CHIP_VISUAL[categoryName] ?? DEFAULT_CHIP;
  }, [categoryName]);

  const label = React.useMemo(() => {
    if (categoryName && subcategoryName) {
      return `${categoryName} | ${subcategoryName}`;
    }
    return categoryName || subcategoryName || 'Unknown';
  }, [categoryName, subcategoryName]);

  return (
    <View style={[styles.container, { backgroundColor: visual.bg }]}>
      <Text style={[styles.label, { color: visual.textColor }]}>{label}</Text>
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
