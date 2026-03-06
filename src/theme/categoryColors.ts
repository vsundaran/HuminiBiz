export type CategoryConfig = {
  key: string;
  label: string;
  bg: string;
  headerBg: string;
  selectedBorder: string;
  textColor: string;
  subTextColor: string;
  chipBg: string;
};

export const CHIP_VISUAL: Record<string, Omit<CategoryConfig, 'key' | 'label'>> = {
  Wishes: {
    bg: '#E3FFCF',
    headerBg: '#F3FDEC',
    selectedBorder: '#486333',
    textColor: '#486333',
    subTextColor: 'rgba(72,99,51,0.9)',
    chipBg: 'rgba(223, 255, 212, 0.60)',
  },
  Celebration: {
    bg: '#FCECFF',
    headerBg: '#FDF2FF',
    selectedBorder: '#5D4D60',
    textColor: '#5D3D60',
    subTextColor: 'rgba(93,61,96,0.9)',
    chipBg:'#FCECFF'
  },
  Motivation: {
    bg: '#FFE7E7',
    headerBg: '#FFF3EF',
    selectedBorder: '#705B5B',
    textColor: '#804343',
    subTextColor: 'rgba(128,67,67,0.9)',
    chipBg: '#FFEAEA',
  },
  Others: {
    bg: '#F3F3F3',
    headerBg: '#F8F8F8',
    selectedBorder: '#515B60',
    textColor: '#515B60',
    subTextColor: 'rgba(81,91,96,0.9)',
    chipBg: '#F3F3F3',
  },
};

export const DEFAULT_CHIP: Omit<CategoryConfig, 'key' | 'label'> = {
  bg: '#EFF3FF',
  headerBg: '#F5F8FF',
  selectedBorder: '#3A5CC7',
  textColor: '#3A5CC7',
  subTextColor: 'rgba(58,92,199,0.9)',
  chipBg: '#EFF3FF',
};
