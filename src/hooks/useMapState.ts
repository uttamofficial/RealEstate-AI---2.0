import { useState, useEffect, useMemo, useCallback } from 'react';
import { MapPreferences, DEFAULT_PREFERENCES } from '@/types/map';
import { Property } from '@/types/property';

interface UseMapStateOptions {
  initialDeals?: Property[];
  initialPreferences?: Partial<MapPreferences>;
}

export function useMapState({
  initialDeals = [],
  initialPreferences = {}
}: UseMapStateOptions = {}) {
  const [deals, setDeals] = useState<Property[]>(initialDeals);
  const [preferences, setPreferences] = useState<MapPreferences>({
    ...DEFAULT_PREFERENCES,
    ...initialPreferences
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter deals based on preferences
  const filteredDeals = useMemo(() => {
    return deals.filter(deal => {
      // Filter by price range
      if (deal.price < preferences.priceRange[0] || deal.price > preferences.priceRange[1]) {
        return false;
      }
      
      // Filter by cap rate if specified
      if (preferences.minCapRate !== undefined && (deal.capRate ?? 0) < preferences.minCapRate) {
        return false;
      }
      
      // Filter by risk level if specified
      if (preferences.riskLevel && preferences.riskLevel !== 'all' && deal.risk !== preferences.riskLevel) {
        return false;
      }
      
      // Filter by categories if any are selected
      if (preferences.categories && preferences.categories.length > 0) {
        if (!preferences.categories.includes(deal.category)) {
          return false;
        }
      }
      
      return true;
    });
  }, [deals, preferences]);
  
  // Reset preferences to default
  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
  }, []);

  // Load deals from API
  useEffect(() => {
    const loadDeals = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/deals?sort=score');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch deals: ${response.statusText}`);
        }
        
        const data = await response.json();
        setDeals(data.deals);
      } catch (err) {
        console.error('Failed to load deals:', err);
        setError('Failed to load property data');
      } finally {
        setIsLoading(false);
      }
    };

    loadDeals();
  }, []);

  return {
    deals,
    preferences,
    setPreferences,
    filteredDeals,
    resetPreferences,
    isLoading,
    error,
  };
}
