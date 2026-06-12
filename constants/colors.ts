// ResetOS Color Palette — Premium Wellness Design System

export const Colors = {
  // Core backgrounds
  background:      '#FAFBFD',
  backgroundAlt:   '#F5F6FA',
  surface:         '#FFFFFF',
  surfaceElevated: '#FFFFFF',

  // Primary accent — calming teal
  primary:   '#2DB5A3',  // Mint teal — primary action
  secondary: '#7C6BF0',  // Soft lavender — secondary / depth
  positive:  '#34C585',  // Fresh green — healthy state
  warning:   '#F0A949',  // Warm amber — caution
  danger:    '#E85D6F',  // Soft rose — high burnout / alert
  energy:    '#EF8B5A',  // Soft orange — energy metric

  // Text
  textPrimary:   '#1A1D2E',
  textSecondary: '#6B7194',
  textMuted:     '#9BA2BE',
  textInverse:   '#FFFFFF',

  // Surface layers
  glass10:  'rgba(0,0,0,0.02)',
  glass20:  'rgba(0,0,0,0.04)',
  glass30:  'rgba(0,0,0,0.06)',
  glass50:  'rgba(0,0,0,0.08)',

  // Soft tinted overlays
  glowCyan:    'rgba(45, 181, 163, 0.08)',
  glowPurple:  'rgba(124, 107, 240, 0.08)',
  glowGreen:   'rgba(52, 197, 133, 0.08)',
  glowDanger:  'rgba(232, 93, 111, 0.08)',

  // Border tints
  borderSubtle:  'rgba(0,0,0,0.06)',
  borderActive:  'rgba(45, 181, 163, 0.30)',
  borderMuted:   'rgba(124, 107, 240, 0.20)',

  // Gradients (defined as arrays for LinearGradient)
  gradientPrimary:   ['#2DB5A3', '#7C6BF0'],
  gradientEnergy:    ['#34C585', '#2DB5A3'],
  gradientDanger:    ['#E85D6F', '#EF8B5A'],
  gradientDark:      ['#FAFBFD', '#F0F1F7'],
  gradientSurface:   ['#FFFFFF', '#F8F9FC'],
  gradientHero:      ['rgba(45,181,163,0.06)', 'rgba(124,107,240,0.03)', '#FAFBFD'],
} as const;

// Burnout Score → color mapping
export const BurnoutColors = {
  safe:     Colors.positive,    // 0–30
  moderate: Colors.warning,     // 31–60
  high:     Colors.energy,      // 61–80
  critical: Colors.danger,      // 81–100
} as const;

export type ColorKey = keyof typeof Colors;
