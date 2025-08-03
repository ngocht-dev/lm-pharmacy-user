/**
 * Format a number as Vietnamese currency (VND)
 * @param amount - The amount to format
 * @param showSymbol - Whether to show the currency symbol (₫)
 * @returns Formatted currency string
 */
export function formatVND(amount: number, showSymbol: boolean = true): string {
  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  if (showSymbol) {
    return formatter.format(amount);
  } else {
    // Remove the currency symbol and return just the formatted number
    return formatter.format(amount).replace(/[₫\s]/g, '');
  }
}

/**
 * Format a number as Vietnamese currency without symbol
 * @param amount - The amount to format
 * @returns Formatted number string with thousand separators
 */
export function formatVNDNumber(amount: number): string {
  return formatVND(amount, false);
}

/**
 * Format a number as Vietnamese currency with custom suffix
 * @param amount - The amount to format
 * @param suffix - Custom suffix (default: 'VND')
 * @returns Formatted currency string with custom suffix
 */
export function formatVNDWithSuffix(amount: number, suffix: string = 'VND'): string {
  const formattedNumber = formatVNDNumber(amount);
  return `${formattedNumber} ${suffix}`;
}
