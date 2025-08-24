import { NextRequest, NextResponse } from 'next/server';
import { Property } from '@/types/property';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { property }: { property: Property } = body;

    if (!property) {
      return NextResponse.json(
        { error: 'Property data is required' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!property.price || property.price <= 0) {
      return NextResponse.json(
        { error: 'Valid property price is required' },
        { status: 400 }
      );
    }

    // Calculate cap rate if NOI is present
    let capRate = property.capRate;
    if (property.noi && property.price) {
      capRate = (property.noi / property.price) * 100;
    }

    // Use market cap rate or fallback to 7.5%
    const marketCapRate = property.marketCapRate || 7.5;
    
    // Calculate AI estimated value
    let aiEstimatedValue = property.aiEstimatedValue;
    
    if (property.noi) {
      // If we have NOI, use it to calculate fair value
      aiEstimatedValue = property.noi / (marketCapRate / 100);
    } else if (capRate) {
      // If we have cap rate but no NOI, reverse calculate NOI and then fair value
      const estimatedNOI = property.price * (capRate / 100);
      aiEstimatedValue = estimatedNOI / (marketCapRate / 100);
    } else {
      // Fallback: use simple market adjustment based on location/features
      aiEstimatedValue = property.price * getLocationMultiplier(property);
    }

    // Calculate discount percentage
    const discountPct = aiEstimatedValue > 0 
      ? ((aiEstimatedValue - property.price) / aiEstimatedValue) * 100 
      : 0;

    return NextResponse.json({
      aiEstimatedValue: Math.round(aiEstimatedValue),
      capRate: capRate ? Number(capRate.toFixed(2)) : null,
      discountPct: Number(discountPct.toFixed(2)),
      marketCapRate: Number(marketCapRate.toFixed(2))
    });

  } catch (error) {
    console.error('Error in estimation API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to get location-based multiplier for estimation
function getLocationMultiplier(property: Property): number {
  const premiumCities = ['Mumbai', 'Delhi', 'Bangalore', 'New York', 'San Francisco', 'London'];
  const city = property.city?.toLowerCase();
  
  // Base multiplier
  let multiplier = 1.0;
  
  // Premium city bonus
  if (premiumCities.some(pc => city?.includes(pc.toLowerCase()))) {
    multiplier += 0.15;
  }
  
  // Year built bonus (newer properties)
  if (property.yearBuilt && property.yearBuilt > 2015) {
    multiplier += 0.1;
  } else if (property.yearBuilt && property.yearBuilt < 1990) {
    multiplier -= 0.05;
  }
  
  // Size bonus (larger properties often have better economies of scale)
  if (property.sqft && property.sqft > 5000) {
    multiplier += 0.08;
  }
  
  // Ensure multiplier stays within reasonable bounds
  return Math.max(0.8, Math.min(1.4, multiplier));
}
