const tintLight = '#208AEF';
const tintDark = '#6eb6ff';

export const colors = {
  PRIMARY: tintLight,
  WHITE: "#FFF",
  RED_100: "#FFDFDF",
  RED_500: "#FF5F5F",
  ORANGE_200: "#FFE8E4",
  ORANGE_300: "#FFC9C0",
  ORANGE_600: "#FF6B57",
  VOTE_PREVIEW_BG: "#FFF5F2",
  VOTE_PREVIEW_BORDER: "#FF8A7A",
  VOTE_LABEL: "#FF5C4D",
  VOTE_BAR_TRACK: "#FFE5D4",
  GRAY_100: "#F6F6F6",
  GRAY_200: "#E2E8F0",
  GRAY_300: "#D1D5DB",
  GRAY_500: "#6B7280",
  GRAY_600: "#4B5563",
  GRAY_700: "#374151",
  BLACK: "#000",
};

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
