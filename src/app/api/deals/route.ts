import { NextRequest, NextResponse } from 'next/server';
import { Property, DealCategory, RiskLevel } from '@/types/property';
import { generateMockDeals } from '@/data/mockDeals';

// Extended property type with score
interface PropertyWithScore extends Property {
  score: number;
}

// Calculate score for a deal based on various factors
function calculateDealScore(deal: Property): number {
  let score = 0;
  
  // Discount percentage contributes heavily to score (0-40 points)
  if (deal.discountPct) {
    score += Math.min(40, Math.max(0, deal.discountPct * 2));
  }
  
  // Cap rate contributes to score (0-30 points)
  if (deal.capRate) {
    // Higher cap rates get more points, normalized around 8%
    score += Math.min(30, Math.max(0, (deal.capRate - 4) * 3));
  }
  
  // Market cap rate differential (0-20 points)
  if (deal.capRate && deal.marketCapRate) {
    const differential = deal.capRate - deal.marketCapRate;
    score += Math.min(20, Math.max(0, differential * 10));
  }
  
  // Risk adjustment (0-10 points, lower risk gets more points)
  switch (deal.risk) {
    case 'low':
      score += 10;
      break;
    case 'medium':
      score += 6;
      break;
    case 'high':
      score += 2;
      break;
  }
  
  // Property age bonus (0-5 points)
  if (deal.yearBuilt) {
    const age = new Date().getFullYear() - deal.yearBuilt;
    if (age < 5) score += 5;
    else if (age < 15) score += 3;
    else if (age < 30) score += 1;
  }
  
  return Math.min(100, Math.max(0, score));
}

// Ensure all derived fields are calculated
function enrichDeal(deal: Property): Property {
  const enriched = { ...deal };
  
  // Calculate cap rate if missing but we have NOI and price
  if (!enriched.capRate && enriched.noi && enriched.price) {
    enriched.capRate = (enriched.noi / enriched.price) * 100;
  }
  
  // Calculate discount percentage if missing but we have AI estimated value
  if (!enriched.discountPct && enriched.aiEstimatedValue && enriched.price) {
    enriched.discountPct = ((enriched.aiEstimatedValue - enriched.price) / enriched.aiEstimatedValue) * 100;
  }
  
  // Calculate AI estimated value if missing but we have NOI
  if (!enriched.aiEstimatedValue && enriched.noi) {
    const marketCapRate = enriched.marketCapRate || 7.5;
    enriched.aiEstimatedValue = enriched.noi / (marketCapRate / 100);
  }
  
  // Set market cap rate default if missing
  if (!enriched.marketCapRate) {
    enriched.marketCapRate = 7.5;
  }
  
  return enriched;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const sort = searchParams.get('sort') || 'score';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const markets = searchParams.get('markets');
    const category = searchParams.get('category') as DealCategory;
    const risk = searchParams.get('risk') as RiskLevel;
    const capRateMin = searchParams.get('capRateMin');
    const capRateMax = searchParams.get('capRateMax');
    
    // Get mock deals (in production, this would fetch from database)
    let deals: PropertyWithScore[] = generateMockDeals().map(deal => {
      const enriched = enrichDeal(deal);
      
      // Calculate score for this deal
      const score = calculateDealScore(enriched);
      return { ...enriched, score } as PropertyWithScore;
    });
    
    // Apply filters
    if (minPrice) {
      deals = deals.filter(deal => deal.price >= parseInt(minPrice));
    }
    
    if (maxPrice) {
      deals = deals.filter(deal => deal.price <= parseInt(maxPrice));
    }
    
    if (markets) {
      const marketList = markets.split(',').map(m => m.trim().toLowerCase());
      deals = deals.filter(deal => 
        marketList.some(market => 
          deal.city.toLowerCase().includes(market) || 
          deal.country.toLowerCase().includes(market)
        )
      );
    }
    
    if (category) {
      deals = deals.filter(deal => deal.category === category);
    }
    
    if (risk && risk !== 'all') {
      deals = deals.filter(deal => deal.risk === risk);
    }
    
    if (capRateMin) {
      deals = deals.filter(deal => deal.capRate && deal.capRate >= parseFloat(capRateMin));
    }
    
    if (capRateMax) {
      deals = deals.filter(deal => deal.capRate && deal.capRate <= parseFloat(capRateMax));
    }
    
    // Sort deals
    deals.sort((a, b) => {
      switch (sort) {
        case 'price':
          return a.price - b.price;
        case 'capRate':
          return (b.capRate || 0) - (a.capRate || 0);
        case 'discount':
          return (b.discountPct || 0) - (a.discountPct || 0);
        case 'score':
        default:
          return b.score - a.score;
      }
    });
    
    return NextResponse.json({
      deals,
      total: deals.length,
      filters: {
        sort,
        minPrice: minPrice ? parseInt(minPrice) : null,
        maxPrice: maxPrice ? parseInt(maxPrice) : null,
        markets: markets ? markets.split(',').map(m => m.trim()) : null,
        category,
        risk,
        capRateMin: capRateMin ? parseFloat(capRateMin) : null,
        capRateMax: capRateMax ? parseFloat(capRateMax) : null,
      }
    });

  } catch (error) {
    console.error('Error in deals API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
