import { DealCategory, RiskLevel } from "./property";

export interface MapPreferences {
  priceRange: [number, number];
  minCapRate: number;
  riskLevel?: RiskLevel;
  categories: DealCategory[];
  markets: string[];
}

export const DEFAULT_PREFERENCES: MapPreferences = {
  priceRange: [1000000, 5000000],
  minCapRate: 5,
  riskLevel: 'medium',
  categories: [],
  markets: []
};

export interface MapViewport {
  center: [number, number];
  zoom: number;
}
