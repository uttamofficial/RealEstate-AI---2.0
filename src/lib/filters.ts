import { Property } from '@/types/property';
import { UserPreferences } from '@/store/useUserPreferences';

/**
 * Apply user preferences/filters to a list of deals
 * This is the central filtering logic used across all views
 */
export function applyFilters(deals: Property[], prefs: UserPreferences): Property[] {
  return deals.filter(deal => {
    // Price range filter
    if (deal.price < prefs.priceRange[0] || deal.price > prefs.priceRange[1]) {
      return false;
    }
    
    // Minimum cap rate filter
    if (prefs.minCapRate > 0 && (!deal.capRate || deal.capRate < prefs.minCapRate)) {
      return false;
    }
    
    // Risk level filter
    if (prefs.riskLevel !== 'any' && deal.risk !== prefs.riskLevel) {
      return false;
    }
    
    // Categories filter
    if (prefs.categories.length > 0 && !prefs.categories.includes(deal.category)) {
      return false;
    }
    
    // Markets filter (if markets are selected, only show deals from those markets)
    if (prefs.markets.length > 0) {
      const dealMarket = deal.city;
      if (!prefs.markets.includes(dealMarket)) {
        return false;
      }
    }
    
    // Minimum discount percentage filter (optional)
    if (prefs.minDiscountPct !== undefined && 
        (!deal.discountPct || deal.discountPct < prefs.minDiscountPct)) {
      return false;
    }
    
    // Maximum risk score filter (optional) - if implemented
    if (prefs.maxRiskScore !== undefined) {
      // You can implement custom risk scoring logic here
      // For now, we'll skip this filter
    }
    
    return true;
  });
}

/**
 * Sort deals based on different criteria
 * This ensures consistent sorting across all views
 */
export function sortDeals(
  deals: Property[], 
  sortBy: 'score' | 'price' | 'capRate' | 'discount' = 'score'
): Property[] {
  return [...deals].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'capRate':
        return (b.capRate || 0) - (a.capRate || 0);
      case 'discount':
        return (b.discountPct || 0) - (a.discountPct || 0);
      case 'score':
      default:
        // For score sorting, we'd typically have a calculated score field
        // For now, let's use a combination of cap rate and discount
        const scoreA = (a.capRate || 0) * 0.6 + (a.discountPct || 0) * 0.4;
        const scoreB = (b.capRate || 0) * 0.6 + (b.discountPct || 0) * 0.4;
        return scoreB - scoreA;
    }
  });
}

/**
 * Apply filters and sort deals in one go
 * This is the main function that views should use
 */
export function applyFiltersAndSort(
  deals: Property[], 
  prefs: UserPreferences, 
  sortBy: 'score' | 'price' | 'capRate' | 'discount' = 'score'
): Property[] {
  const filtered = applyFilters(deals, prefs);
  return sortDeals(filtered, sortBy);
}

/**
 * Get available markets from a list of deals
 * Useful for dynamically populating market options
 */
export function getAvailableMarkets(deals: Property[]): string[] {
  const markets = new Set(deals.map(deal => deal.city));
  return Array.from(markets).sort();
}

/**
 * Get filter summary for display
 * Returns a human-readable summary of active filters
 */
export function getFilterSummary(prefs: UserPreferences, totalDeals: number, filteredDeals: number): string {
  const activeFilters: string[] = [];
  
  // Price range
  if (prefs.priceRange[0] > 0 || prefs.priceRange[1] < 200000000) {
    const min = (prefs.priceRange[0] / 10000000).toFixed(1);
    const max = (prefs.priceRange[1] / 10000000).toFixed(1);
    activeFilters.push(`₹${min}Cr - ₹${max}Cr`);
  }
  
  // Cap rate
  if (prefs.minCapRate > 0) {
    activeFilters.push(`Cap Rate ≥ ${prefs.minCapRate}%`);
  }
  
  // Risk level
  if (prefs.riskLevel !== 'any') {
    activeFilters.push(`${prefs.riskLevel} risk`);
  }
  
  // Categories
  if (prefs.categories.length > 0 && prefs.categories.length < 3) {
    activeFilters.push(prefs.categories.join(', '));
  }
  
  // Markets
  if (prefs.markets.length > 0) {
    if (prefs.markets.length <= 2) {
      activeFilters.push(prefs.markets.join(', '));
    } else {
      activeFilters.push(`${prefs.markets.length} markets`);
    }
  }
  
  if (activeFilters.length === 0) {
    return `Showing all ${filteredDeals} deals`;
  }
  
  return `${filteredDeals} of ${totalDeals} deals (${activeFilters.join(' • ')})`;
}
