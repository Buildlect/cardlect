// Cardlect Color Palette & Theming System
// Primary Darker (#E65100) is the main brand color used for charts, lines, buttons, and primary elements
export const CARDLECT_COLORS = {
  // Cardlect's main color => #d96126, #d96126ff, rgba(217, 97, 38, 1), hsla(20, 70%, 50%, 1.00)
  // Adjust or change only others - to make them perfect
  primary: { light: '#FFA726', main: '#d96126', dark: '#d96126', darker: '#d96126' },
  secondary: { light: '#4DD0E1', main: '#00BCD4', dark: '#0097A7', darker: '#006064' },
  success: { light: '#66BB6A', main: '#4CAF50', dark: '#388E3C', darker: '#1B5E20' },
  warning: { light: '#FFD54F', main: '#FFC107', dark: '#FFA000', darker: '#FF6F00' },
  danger: { light: '#EF5350', main: '#F44336', dark: '#D32F2F', darker: '#B71C1C' },
  info: { light: '#64B5F6', main: '#2196F3', dark: '#1976D2', darker: '#0D47A1' },
  accent: { light: '#F06292', main: '#EC407A', dark: '#C2185B', darker: '#880E4F' },
}

export const ROLE_COLORS: Record<string, typeof CARDLECT_COLORS.primary> = {
  'super-user': CARDLECT_COLORS.primary,
  'admin': CARDLECT_COLORS.primary,
  'security': CARDLECT_COLORS.primary,
  'finance': CARDLECT_COLORS.primary,
  'teacher': CARDLECT_COLORS.primary,
  'parents': CARDLECT_COLORS.primary,
  'students': CARDLECT_COLORS.primary,
  'clinic': CARDLECT_COLORS.primary,
  'store': CARDLECT_COLORS.primary,
  'approved-stores': CARDLECT_COLORS.primary,
  'exam-officer': CARDLECT_COLORS.primary,
  'librarian': CARDLECT_COLORS.primary,
  'visitor': CARDLECT_COLORS.primary,
}

export const SEMANTIC_COLORS = {
  status: {
    online: CARDLECT_COLORS.success.main,
    away: CARDLECT_COLORS.warning.main,
    offline: '#9E9E9E',
    busy: CARDLECT_COLORS.danger.main,
  },
  action: {
    positive: CARDLECT_COLORS.success.main,
    negative: CARDLECT_COLORS.danger.main,
    neutral: '#9E9E9E',
    pending: CARDLECT_COLORS.warning.main,
  },
  attendance: {
    present: CARDLECT_COLORS.success.main,
    absent: CARDLECT_COLORS.danger.main,
    late: CARDLECT_COLORS.warning.main,
    excused: CARDLECT_COLORS.primary.darker,
  },
  financial: {
    income: CARDLECT_COLORS.success.main,
    expense: CARDLECT_COLORS.danger.main,
    pending: CARDLECT_COLORS.warning.main,
    balance: CARDLECT_COLORS.primary.darker,
  },
  card: {
    active: CARDLECT_COLORS.primary.darker,
    blocked: CARDLECT_COLORS.danger.main,
    lost: CARDLECT_COLORS.warning.main,
    inactive: '#BDBDBD',
  },
}

export function getRoleColor(role: string) {
  return ROLE_COLORS[role] || CARDLECT_COLORS.primary
}
