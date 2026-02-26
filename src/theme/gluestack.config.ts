import { createConfig } from '@gluestack-style/react';
import { COLORS, SIZES, FONTS } from './index';

export const gluestackConfig = createConfig({
  tokens: {
    colors: {
      ...COLORS,
    },
    space: {
      4: 4,
      8: 8,
      12: 12,
      16: 16,
      24: 24,
      32: 32,
      ...SIZES,
    },
    radii: {
      sm: 4,
      md: 8,
      lg: 12,
      xl: 16,
      full: 9999,
      ...SIZES,
    },
    fontSizes: {
      ...FONTS.sizes,
    },
  },
  aliases: {},
});
type Config = typeof gluestackConfig;

declare module '@gluestack-style/react' {
  interface ICustomConfig extends Config {}
}
