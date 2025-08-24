export interface Market {
  id: string;
  name: string;
  country: string;
  currency: string;
  defaultMarketCapRate?: number;
}

export interface MarketSettings {
  defaultMarket: string;
  defaultCurrency: string;
  defaultLocale: string;
}

// Common markets for the platform
export const MARKETS: Market[] = [
  {
    id: 'mumbai',
    name: 'Mumbai',
    country: 'India',
    currency: 'INR',
    defaultMarketCapRate: 6.5
  },
  {
    id: 'delhi',
    name: 'Delhi NCR',
    country: 'India',
    currency: 'INR',
    defaultMarketCapRate: 7.0
  },
  {
    id: 'bangalore',
    name: 'Bangalore',
    country: 'India',
    currency: 'INR',
    defaultMarketCapRate: 6.8
  },
  {
    id: 'pune',
    name: 'Pune',
    country: 'India',
    currency: 'INR',
    defaultMarketCapRate: 7.2
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    country: 'India',
    currency: 'INR',
    defaultMarketCapRate: 7.5
  },
  {
    id: 'chennai',
    name: 'Chennai',
    country: 'India',
    currency: 'INR',
    defaultMarketCapRate: 7.3
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    country: 'India',
    currency: 'INR',
    defaultMarketCapRate: 8.0
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    country: 'India',
    currency: 'INR',
    defaultMarketCapRate: 7.8
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'UAE',
    currency: 'AED',
    defaultMarketCapRate: 5.5
  },
  {
    id: 'london',
    name: 'London',
    country: 'UK',
    currency: 'GBP',
    defaultMarketCapRate: 4.2
  },
  {
    id: 'new-york',
    name: 'New York',
    country: 'USA',
    currency: 'USD',
    defaultMarketCapRate: 5.8
  },
  {
    id: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    currency: 'SGD',
    defaultMarketCapRate: 3.8
  },
  {
    id: 'toronto',
    name: 'Toronto',
    country: 'Canada',
    currency: 'CAD',
    defaultMarketCapRate: 4.5
  },
  {
    id: 'sydney',
    name: 'Sydney',
    country: 'Australia',
    currency: 'AUD',
    defaultMarketCapRate: 4.1
  }
];

// Default market settings
export const DEFAULT_MARKET_SETTINGS: MarketSettings = {
  defaultMarket: 'mumbai',
  defaultCurrency: 'INR',
  defaultLocale: 'en-IN'
};

// Currency configurations
export const CURRENCY_CONFIG = {
  INR: { symbol: '₹', locale: 'en-IN', name: 'Indian Rupee' },
  USD: { symbol: '$', locale: 'en-US', name: 'US Dollar' },
  EUR: { symbol: '€', locale: 'en-EU', name: 'Euro' },
  GBP: { symbol: '£', locale: 'en-GB', name: 'British Pound' },
  AED: { symbol: 'د.إ', locale: 'ar-AE', name: 'UAE Dirham' },
  SGD: { symbol: 'S$', locale: 'en-SG', name: 'Singapore Dollar' },
  CAD: { symbol: 'C$', locale: 'en-CA', name: 'Canadian Dollar' },
  AUD: { symbol: 'A$', locale: 'en-AU', name: 'Australian Dollar' }
};

// Helper to get market by ID
export function getMarketById(id: string): Market | undefined {
  return MARKETS.find(market => market.id === id);
}

// Helper to get markets by country
export function getMarketsByCountry(country: string): Market[] {
  return MARKETS.filter(market => market.country === country);
}
