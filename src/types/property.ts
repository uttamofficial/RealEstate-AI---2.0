export type DealCategory = 'cap_rate_arbitrage' | 'mispriced' | 'distressed';
export type RiskLevel = 'low' | 'medium' | 'high' | 'all';

export interface Property {
  id: string;
  title?: string;
  company?: string;
  logoUrl?: string;
  images?: string[];
  imageUrl?: string;          // Single image URL (for backward compatibility)
  address: string;
  city: string;
  state?: string;
  country: string;
  marketId?: string;          // Market identifier for global scaling
  currency?: string;          // Currency for this specific deal
  lat: number;
  lng: number;
  price: number;              // asking price
  noi?: number;               // net operating income
  capRate?: number;           // NOI / price
  marketCapRate?: number;     // estimated market cap rate for area
  aiEstimatedValue?: number;  // backend AI fair value
  // Additional property details
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  yearBuilt?: number;
  description?: string;
  discountPct?: number;       // (aiEstimatedValue - price)/aiEstimatedValue
  risk: RiskLevel;
  category: DealCategory;
  status?: 'new' | 'review' | 'offer' | 'closed';
  createdAt?: string;
}

export interface UserPrefs {
  minPrice?: number;
  maxPrice?: number;
  markets?: string[];               // e.g., ["Mumbai, IN", "NYC, US"]
  capRateMin?: number;
  capRateMax?: number;
  risk?: RiskLevel | 'any';
  categories?: DealCategory[];
}
