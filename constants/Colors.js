// ============================================
// DOKKANI COLOR PALETTE
// ============================================

// Primary Colors
const primary = '#000';
const onPrimary = '#fff';
const primaryContainer = '#e0e0e0';
const onPrimaryContainer = '#1a1c1e';

// Secondary Colors  
const secondary = '#fff';
const onSecondary = '#000';
const secondaryContainer = '#f5f5f5';
const onSecondaryContainer = '#1a1c1e';

// Accent Colors
const accent = '#2c3e50';
const onAccent = '#fff';
const accentContainer = '#d4e3ff';
const onAccentContainer = '#001c3a';

// Surface Colors
const surface = '#fff';
const onSurface = '#1a1c1e';
const surfaceVariant = '#e0e2ec';
const onSurfaceVariant = '#43474e';
const surfaceDisabled = 'rgba(26, 28, 30, 0.12)';
const onSurfaceDisabled = 'rgba(26, 28, 30, 0.38)';

// Background Colors
const background = '#fff';
const onBackground = '#1a1c1e';
const backgroundLight = '#f5f5f5';
const backgroundGray = '#ecf0f1';
const backgroundDark = '#121011';

// Text Colors
const textPrimary = '#000';
const textSecondary = '#333';
const textMuted = '#666';
const textLight = '#999';
const textWhite = '#fff';
const subTitleText = 'rgb(102, 102, 102)';

// Border & Outline Colors
const border = '#e6e6e6';
const borderLight = '#d9d9d9';
const borderMuted = '#cccccc';
const borderDark = 'rgba(0,0,0,0.5)';
const outline = 'rgb(116, 119, 127)';
const outlineVariant = 'rgb(195, 198, 207)';

// Status Colors - Success
const success = '#26AE89';
const onSuccess = '#fff';
const successContainer = 'rgb(163, 246, 156)';
const onSuccessContainer = 'rgb(0, 34, 4)';

// Status Colors - Error
const error = '#ff4444';
const onError = '#fff';
const errorContainer = 'rgb(255, 218, 214)';
const onErrorContainer = 'rgb(65, 0, 3)';

// Status Colors - Warning
const warning = '#EAEB5E';
const onWarning = '#000';
const warningContainer = 'rgb(255, 219, 202)';
const onWarningContainer = 'rgb(51, 18, 0)';

// Status Colors - Info
const info = 'rgb(2, 136, 209)';
const onInfo = '#fff';
const infoContainer = 'rgb(206, 229, 255)';
const onInfoContainer = 'rgb(0, 29, 50)';

// Wishlist
const wishlistActive = '#ff3b30';

// Shadow & Scrim
const shadow = '#000';
const scrim = '#000';
const backdrop = 'rgba(45, 49, 56, 0.4)';
const backdropText = '#fff';

// Icon Colors
const iconMuted = '#ccc';
const iconDefault = '#7f8c8d';
const iconColor = '#000';

// Inverse Colors (for dark surfaces)
const inverseSurface = 'rgb(47, 48, 51)';
const inverseOnSurface = 'rgb(241, 240, 244)';
const inversePrimary = 'rgb(165, 200, 255)';

// Elevation Levels
const elevation = {
  level0: 'transparent',
  level1: 'rgb(240, 244, 251)',
  level2: 'rgb(233, 239, 249)',
  level3: 'rgb(225, 235, 246)',
  level4: 'rgb(223, 233, 245)',
  level5: 'rgb(218, 230, 244)',
};

// Chip Colors
const chipBackground = 'rgb(235, 235, 235)';
const chipBackgroundText = '#000';

// Navigation
const tabBackground = '#eeeeee';
const inActiveNavButtonBackground = 'rgb(224, 224, 224)';

// Special Purpose
const pastColor = 'rgb(255, 171, 171)';
const iconClockBackground = 'rgb(223, 241, 255)';
const iconAirplaneBackground = 'rgb(244, 216, 201)';
const chipAbsenceBackground = 'rgb(156, 39, 176)';
const chipVacationBackground = 'rgb(46, 125, 50)';

export default {
  // Primary
  primary,
  onPrimary,
  primaryContainer,
  onPrimaryContainer,
  
  // Secondary
  secondary,
  onSecondary,
  secondaryContainer,
  onSecondaryContainer,
  
  // Accent
  accent,
  onAccent,
  accentContainer,
  onAccentContainer,
  
  // Surface
  surface,
  onSurface,
  surfaceVariant,
  onSurfaceVariant,
  surfaceDisabled,
  onSurfaceDisabled,
  
  // Backgrounds
  background,
  onBackground,
  backgroundLight,
  backgroundGray,
  backgroundDark,
  
  // Text
  textPrimary,
  textSecondary,
  textMuted,
  textLight,
  textWhite,
  subTitleText,
  
  // Borders & Outlines
  border,
  borderLight,
  borderMuted,
  borderDark,
  outline,
  outlineVariant,
  
  // Success
  success,
  onSuccess,
  successContainer,
  onSuccessContainer,
  
  // Error
  error,
  onError,
  errorContainer,
  onErrorContainer,
  
  // Warning
  warning,
  onWarning,
  warningContainer,
  onWarningContainer,
  
  // Info
  info,
  onInfo,
  infoContainer,
  onInfoContainer,
  
  // Wishlist
  wishlistActive,
  
  // Shadow & Scrim
  shadow,
  scrim,
  backdrop,
  backdropText,
  
  // Icons
  iconMuted,
  iconDefault,
  iconColor,
  
  // Inverse
  inverseSurface,
  inverseOnSurface,
  inversePrimary,
  
  // Elevation
  elevation,
  
  // Chips
  chipBackground,
  chipBackgroundText,
  
  // Navigation
  tabBackground,
  inActiveNavButtonBackground,
  
  // Special Purpose
  pastColor,
  iconClockBackground,
  iconAirplaneBackground,
  chipAbsenceBackground,
  chipVacationBackground,
  
  // Legacy (for compatibility)
  tintColor: secondary,
  tabIconDefault: iconDefault,
  tabIconSelected: secondary,
  tabBar: '#fefefe',
  errorBackground: error,
  errorText: secondary,
  warningBackground: warning,
  warningText: '#666804',
  noticeBackground: secondary,
  noticeText: secondary,
};
