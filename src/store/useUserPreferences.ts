import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DealCategory, RiskLevel } from '@/types/property';

export interface UserPreferences {
  // Price range
  priceRange: [number, number];
  
  // Cap rate minimum
  minCapRate: number;
  
  // Risk level filter
  riskLevel: RiskLevel | 'any';
  
  // Categories to include
  categories: DealCategory[];
  
  // Markets to include
  markets: string[];
  
  // Additional filters
  maxRiskScore?: number;
  minDiscountPct?: number;
}

export interface UserPreferencesStore extends UserPreferences {
  // Actions
  setPriceRange: (range: [number, number]) => void;
  setMinCapRate: (rate: number) => void;
  setRiskLevel: (level: RiskLevel | 'any') => void;
  setCategories: (categories: DealCategory[]) => void;
  setMarkets: (markets: string[]) => void;
  setMinDiscountPct: (discount?: number) => void;
  setMaxRiskScore: (score?: number) => void;
  
  // Utility actions
  resetPreferences: () => void;
  updatePreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
}

// Default preferences
export const DEFAULT_PREFERENCES: UserPreferences = {
  priceRange: [0, 200000000], // 0 to 20 crores
  minCapRate: 0,
  riskLevel: 'any',
  categories: ['cap_rate_arbitrage', 'mispriced', 'distressed'], // Include all categories by default
  markets: [], // Empty means all markets
  minDiscountPct: undefined,
  maxRiskScore: undefined,
};

// Available options derived from data
export const AVAILABLE_MARKETS = [
  'Mumbai',
  'Delhi', 
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Kolkata',
  'Goa',
  'Gurgaon',
  'Noida'
];

export const AVAILABLE_CATEGORIES: DealCategory[] = [
  'cap_rate_arbitrage',
  'mispriced', 
  'distressed'
];

export const AVAILABLE_RISK_LEVELS: (RiskLevel | 'any')[] = [
  'any',
  'low',
  'medium',
  'high'
];

// Create the store with persistence
export const useUserPreferences = create<UserPreferencesStore>()(
  persist(
    (set, get) => ({
      // Initial state
      ...DEFAULT_PREFERENCES,
      
      // Actions
      setPriceRange: (range) => set({ priceRange: range }),
      
      setMinCapRate: (rate) => set({ minCapRate: rate }),
      
      setRiskLevel: (level) => set({ riskLevel: level }),
      
      setCategories: (categories) => set({ categories }),
      
      setMarkets: (markets) => set({ markets }),
      
      setMinDiscountPct: (discount) => set({ minDiscountPct: discount }),
      
      setMaxRiskScore: (score) => set({ maxRiskScore: score }),
      
      resetPreferences: () => set(DEFAULT_PREFERENCES),
      
      updatePreference: (key, value) => set({ [key]: value }),
    }),
    {
      name: 'user-preferences', // localStorage key
      version: 1,
    }
  )
);
