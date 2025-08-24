import { Property, UserPrefs } from '@/types/property';
import { getMarketCapRate } from '@/lib/format';

export function profitabilityScore(p: Property, prefs?: UserPrefs) {
  // Get cap rate with fallbacks to market defaults
  let cap = p.capRate;
  
  // If no cap rate, try to calculate from NOI and price
  if (!cap && p.noi && p.price && p.price > 0) {
    cap = p.noi / p.price;
  }
  
  // If still no cap rate, use market default or fall back to marketCapRate
  if (!cap) {
    cap = p.marketCapRate || getMarketCapRate(p.marketId) || 0.07; // 7% default
  }
  
  // Normalize cap rate (15% treated as excellent)
  const capNorm = Math.min(Math.max(cap / 0.15, 0), 1);
  
  // Calculate discount with multiple fallbacks
  let discount = 0;
  
  if (p.aiEstimatedValue && p.price && p.aiEstimatedValue > 0) {
    discount = (p.aiEstimatedValue - p.price) / p.aiEstimatedValue;
  } else if (p.discountPct !== undefined) {
    discount = p.discountPct / 100; // Convert percentage to decimal
  } else if (p.marketCapRate && cap) {
    // Estimate discount based on cap rate vs market cap rate
    const marketCap = p.marketCapRate || getMarketCapRate(p.marketId) || 0.07;
    discount = (cap - marketCap) / marketCap; // Higher cap rate = potential discount
  }
  
  // Normalize discount (-100% to +100% mapped to 0..1)
  const discountNorm = Math.min(Math.max((discount + 1) / 2, 0), 1);
  
  // Risk penalty with safer defaults
  const riskPenalty = p.risk === 'low' ? 0 : 
                     p.risk === 'medium' ? 0.15 : 
                     p.risk === 'high' ? 0.3 : 0.1; // Default penalty for unknown risk
  
  // Preference boosts
  let prefBoost = 0;
  if (prefs?.capRateMin && cap >= prefs.capRateMin) prefBoost += 0.05;
  if (prefs?.risk && prefs.risk !== 'any' && p.risk === prefs.risk) prefBoost += 0.05;
  if (prefs?.categories?.includes(p.category)) prefBoost += 0.05;
  
  // Market bonus for properties with complete data
  let dataQualityBonus = 0;
  if (p.capRate && p.aiEstimatedValue) dataQualityBonus += 0.02;
  if (p.marketId && p.currency) dataQualityBonus += 0.01;
  
  // Category-specific weighting
  let score;
  if (p.category === 'distressed') {
    // Distressed assets: Higher emphasis on discount (55%), lower on cap rate (35%)
    score = 0.35 * capNorm + 0.55 * discountNorm + prefBoost + dataQualityBonus - riskPenalty;
  } else {
    // Standard weighting for cap_rate_arbitrage and mispriced
    score = 0.5 * capNorm + 0.4 * discountNorm + prefBoost + dataQualityBonus - riskPenalty;
  }
  
  // Ensure score is between 0 and 1, round to 2 decimal places
  return Math.round(Math.max(Math.min(score, 1), 0) * 100) / 100;
}
