export type CategoryConfig = {
  key: string;
  label: string;
  bg: string;
  selectedBorder: string;
  textColor: string;
};

export const CHIP_VISUAL: Record<string, Omit<CategoryConfig, 'key' | 'label'>> = {
  Wishes: { bg: '#E3F2D9', selectedBorder: '#486333', textColor: '#486333' },
  Celebration: { bg: '#FCECFF', selectedBorder: '#5D4D60', textColor: '#5D4D60' },
  Motivation: { bg: '#FFEAEA', selectedBorder: '#705B5B', textColor: '#705B5B' },
  Others: { bg: '#F3F3F3', selectedBorder: '#515B60', textColor: '#515B60' },
};

export const DEFAULT_CHIP = { bg: '#EFF3FF', selectedBorder: '#3A5CC7', textColor: '#3A5CC7' };
