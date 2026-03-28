const tintLight = '#208AEF';
const tintDark = '#6eb6ff';

export const colors = {
  WHITE: '#FFF',
  ORANGE_600: '#FF6B57',
  GRAY_100: '#F6F6F6',
  GRAY_200: '#E2E8F0',
  GRAY_300: '#D1D5DB',
  GRAY_500: '#6B7280',
  GRAY_600: '#4B5563',
  GRAY_700: '#374151',
  BLACK: '#000',
} as const;

export default {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintDark,
  },
} as const;
