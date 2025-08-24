import { CURRENCY_CONFIG, DEFAULT_MARKET_SETTINGS, getMarketById } from '@/types/market';

// Get market settings from localStorage with fallback
export function getMarketSettings() {
  if (typeof window === 'undefined') {
    return DEFAULT_MARKET_SETTINGS;
  }
  
  try {
    const stored = localStorage.getItem('marketSettings');
    return stored ? JSON.parse(stored) : DEFAULT_MARKET_SETTINGS;
  } catch {
    return DEFAULT_MARKET_SETTINGS;
  }
}

// Save market settings to localStorage
export function saveMarketSettings(settings: Partial<typeof DEFAULT_MARKET_SETTINGS>) {
  if (typeof window === 'undefined') return;
  
  try {
    const current = getMarketSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem('marketSettings', JSON.stringify(updated));
  } catch (error) {
    console.warn('Failed to save market settings:', error);
  }
}

// Format money with proper currency and locale
export function formatMoney(
  amount: number, 
  currency?: string, 
  locale?: string,
  options: Intl.NumberFormatOptions = {}
): string {
  // Get defaults from market settings
  const settings = getMarketSettings();
  const finalCurrency = currency || settings.defaultCurrency;
  const finalLocale = locale || settings.defaultLocale;
  
  // Get currency config
  const currencyConfig = CURRENCY_CONFIG[finalCurrency as keyof typeof CURRENCY_CONFIG];
  
  try {
    // Use Intl.NumberFormat for proper formatting
    const formatter = new Intl.NumberFormat(finalLocale, {
      style: 'currency',
      currency: finalCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      ...options
    });
    
    return formatter.format(amount);
  } catch (error) {
    // Fallback to simple formatting
    const symbol = currencyConfig?.symbol || finalCurrency;
    
    // Format with commas for readability
    const formattedAmount = amount.toLocaleString(finalLocale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      ...options
    });
    
    return `${symbol}${formattedAmount}`;
  }
}

// Format percentage with proper locale
export function formatPct(
  value: number,
  locale?: string,
  decimals: number = 1
): string {
  const settings = getMarketSettings();
  const finalLocale = locale || settings.defaultLocale;
  
  try {
    return new Intl.NumberFormat(finalLocale, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value / 100);
  } catch (error) {
    // Fallback
    return `${value.toFixed(decimals)}%`;
  }
}

// Format money for display with intelligent units (L, Cr, K, M, B)
export function formatMoneyDisplay(
  amount: number,
  currency?: string,
  locale?: string
): string {
  const settings = getMarketSettings();
  const finalCurrency = currency || settings.defaultCurrency;
  
  // Get currency config for symbol
  const currencyConfig = CURRENCY_CONFIG[finalCurrency as keyof typeof CURRENCY_CONFIG];
  const symbol = currencyConfig?.symbol || finalCurrency;
  
  // For Indian currency, use Lakh and Crore
  if (finalCurrency === 'INR') {
    if (amount >= 10000000) { // 1 Crore
      return `${symbol}${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) { // 1 Lakh
      return `${symbol}${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) { // 1 Thousand
      return `${symbol}${(amount / 1000).toFixed(1)}K`;
    }
  } else {
    // For other currencies, use standard K, M, B notation
    if (amount >= 1000000000) { // 1 Billion
      return `${symbol}${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) { // 1 Million
      return `${symbol}${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) { // 1 Thousand
      return `${symbol}${(amount / 1000).toFixed(1)}K`;
    }
  }
  
  // For smaller amounts, use regular formatting
  return formatMoney(amount, finalCurrency, locale, { maximumFractionDigits: 0 });
}

// Get default cap rate for a market
export function getMarketCapRate(marketId?: string): number {
  const settings = getMarketSettings();
  const finalMarketId = marketId || settings.defaultMarket;
  
  const market = getMarketById(finalMarketId);
  return market?.defaultMarketCapRate || 7.0; // Default fallback
}

// Get currency for a market
export function getMarketCurrency(marketId?: string): string {
  const settings = getMarketSettings();
  const finalMarketId = marketId || settings.defaultCurrency;
  
  if (!marketId) {
    return settings.defaultCurrency;
  }
  
  const market = getMarketById(finalMarketId);
  return market?.currency || settings.defaultCurrency;
}

// Format number with locale-aware separators
export function formatNumber(
  value: number,
  locale?: string,
  options: Intl.NumberFormatOptions = {}
): string {
  const settings = getMarketSettings();
  const finalLocale = locale || settings.defaultLocale;
  
  try {
    return new Intl.NumberFormat(finalLocale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      ...options
    }).format(value);
  } catch (error) {
    return value.toLocaleString();
  }
}
