/**
 * Currency Configuration for Cardlect
 * All financial values use Nigerian Naira (₦)
 */

export const CURRENCY = {
  symbol: '₦',
  code: 'NGN',
  name: 'Nigerian Naira',
  locale: 'en-NG',
} as const

/**
 * Format amount as currency with Naira symbol
 * @param amount - Numeric amount to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted currency string (e.g., "₦50,000")
 */
export const formatCurrency = (amount: number, decimals: number = 0): string => {
  return `${CURRENCY.symbol}${amount.toLocaleString('en-NG', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`
}

/**
 * Format amount as compact currency (thousands/millions)
 * @param amount - Numeric amount to format
 * @returns Formatted currency string (e.g., "₦50k", "₦2.5m")
 */
export const formatCompactCurrency = (amount: number): string => {
  if (amount >= 1000000) {
    return `${CURRENCY.symbol}${(amount / 1000000).toFixed(1)}m`
  }
  if (amount >= 1000) {
    return `${CURRENCY.symbol}${(amount / 1000).toFixed(1)}k`
  }
  return `${CURRENCY.symbol}${amount}`
}

/**
 * Parse currency string to number (removes symbol and formatting)
 * @param currencyString - Currency string (e.g., "₦50,000")
 * @returns Numeric value
 */
export const parseCurrency = (currencyString: string): number => {
  const cleaned = currencyString.replace(/[₦,]/g, '').trim()
  return parseFloat(cleaned) || 0
}

/**
 * Convert amount between currency units
 * @param amount - Amount to convert
 * @param from - From unit ('kobo', 'naira')
 * @param to - To unit ('kobo', 'naira')
 * @returns Converted amount
 */
export const convertCurrency = (amount: number, from: 'kobo' | 'naira', to: 'kobo' | 'naira'): number => {
  if (from === to) return amount
  if (from === 'naira' && to === 'kobo') return amount * 100
  if (from === 'kobo' && to === 'naira') return amount / 100
  return amount
}

export default CURRENCY
