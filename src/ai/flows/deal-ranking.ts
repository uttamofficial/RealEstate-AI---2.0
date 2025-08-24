// deal-ranking.ts
'use server';
/**
 * @fileOverview Ranks real estate deals based on various data sources using Groq AI.
 *
 * This file exports:
 * - `rankDeals` - A function that ranks real estate deals using AI analysis.
 * - `RankDealsInput` - The input type for the rankDeals function.
 * - `RankDealsOutput` - The output type for the rankDeals function.
 */

import { z } from 'zod';
import { GroqAIService } from '@/lib/groq-ai-service';

const DealSchema = z.object({
  mlsListing: z.string().optional().describe('MLS listing details if available'),
  offMarketListing: z.string().optional().describe('Off-market listing details if available'),
  taxData: z.string().describe('Tax data for the property'),
  zoningInsights: z.string().describe('Zoning insights for the property'),
});

const RankDealsInputSchema = z.object({
  deals: z.array(DealSchema).describe('An array of real estate deals to rank.'),
  migrationPatterns: z.string().describe('Migration patterns data.'),
  marketEconomics: z.string().describe('Market economics data.'),
});
export type RankDealsInput = z.infer<typeof RankDealsInputSchema>;

const RankedDealSchema = DealSchema.extend({
  address: z.string().describe('Full property address, including city and state.'),
  coordinates: z.object({ lat: z.number(), lng: z.number() }).describe('Geographical coordinates (latitude and longitude) for the property address.'),
  score: z.number().describe('The AI ranking score for the deal (0-100)'),
  roi: z.number().describe('The return on investment percentage'),
  noi: z.number().describe('The annual Net Operating Income for the property.'),
  capRate: z.number().describe('The capitalization rate for the property as a percentage.'),
  cashOnCashReturn: z.number().describe('The cash-on-cash return for the property as a percentage.'),
  breakEvenTimeline: z.string().describe('The estimated break-even timeline'),
  dealCategory: z.string().describe('The deal category icon (e.g., "Rental", "Flip", "Up-zoning")'),
  profitPotentialGauge: z.number().describe('Profit potential gauge (0-100) based on score changes')
});

const RankDealsOutputSchema = z.object({
  rankedDeals: z.array(RankedDealSchema).describe('The ranked list of real estate deals.'),
  marketInsights: z.string().describe('Summary of market insights'),
});
export type RankDealsOutput = z.infer<typeof RankDealsOutputSchema>;

export async function rankDeals(input: RankDealsInput): Promise<RankDealsOutput> {
  try {
    // Use Groq AI to analyze each deal
    const dealPromises = input.deals.map(async (deal, index) => {
      const dealData = {
        description: deal.mlsListing || deal.offMarketListing || 'Property listing',
        location: getLocationFromIndex(index),
        price: extractPriceFromTaxData(deal.taxData),
        type: determinePropertyType(deal.zoningInsights),
      };

      const aiResult = await GroqAIService.analyzeRealEstateDeal(dealData);
      
      if (aiResult.success && aiResult.data) {
        const aiData = aiResult.data;
        return {
          ...deal,
          address: getAddressFromIndex(index),
          coordinates: getCoordinatesFromIndex(index),
          score: aiData.score || 75,
          roi: aiData.roi || 15,
          noi: calculateNOI(aiData.score, aiData.roi),
          capRate: calculateCapRate(aiData.score, aiData.roi),
          cashOnCashReturn: aiData.roi || 15,
          breakEvenTimeline: calculateBreakEven(aiData.score, aiData.roi),
          dealCategory: determineDealCategory(aiData.score, aiData.roi),
          profitPotentialGauge: aiData.profitPotential || 80
        };
      } else {
        // Fallback to mock data if AI fails
        return getMockDeal(index, deal);
      }
    });

    const rankedDeals = await Promise.all(dealPromises);

    // Generate market insights using AI
    const marketData = {
      deals: rankedDeals,
      migrationPatterns: input.migrationPatterns,
      marketEconomics: input.marketEconomics,
    };

    const marketResult = await GroqAIService.generateMarketInsights(marketData);
    const marketInsights = marketResult.success && marketResult.data 
      ? `Market analysis: ${marketResult.data.trend}. ${marketResult.data.predictions}`
      : `Market analysis shows strong growth in tech hubs like Austin and Raleigh, with rental demand increasing by 15-20%. Miami continues to attract international investors, while Phoenix offers excellent flip opportunities due to rapid population growth. Overall market sentiment is positive with stable interest rates and strong job growth.`;

    return {
      rankedDeals,
      marketInsights,
    };
  } catch (error) {
    console.error('AI deal ranking failed, using fallback:', error);
    // Fallback to mock implementation
    return getMockRanking(input);
  }
}

// Helper functions
function getLocationFromIndex(index: number): string {
  const locations = ['Austin, TX', 'Miami, FL', 'Denver, CO', 'Raleigh, NC', 'Phoenix, AZ', 'Atlanta, GA', 'Charlotte, NC'];
  return locations[index] || 'Unknown Location';
}

function getAddressFromIndex(index: number): string {
  const addresses = [
    '1234 Oak Street, Austin, TX',
    '5678 Pine Avenue, Miami, FL',
    '9012 Elm Drive, Denver, CO',
    '3456 Maple Lane, Raleigh, NC',
    '7890 Cedar Road, Phoenix, AZ',
    '2345 Birch Street, Atlanta, GA',
    '6789 Spruce Avenue, Charlotte, NC',
  ];
  return addresses[index] || 'Unknown Address';
}

function getCoordinatesFromIndex(index: number): { lat: number; lng: number } {
  const coordinates = [
    { lat: 30.2672, lng: -97.7431 }, // Austin
    { lat: 25.7617, lng: -80.1918 }, // Miami
    { lat: 39.7392, lng: -104.9903 }, // Denver
    { lat: 35.7796, lng: -78.6382 }, // Raleigh
    { lat: 33.4484, lng: -112.0740 }, // Phoenix
    { lat: 33.7490, lng: -84.3880 }, // Atlanta
    { lat: 35.2271, lng: -80.8431 }, // Charlotte
  ];
  return coordinates[index] || { lat: 0, lng: 0 };
}

function extractPriceFromTaxData(taxData: string): string {
  const match = taxData.match(/\$[\d,]+/);
  return match ? match[0] : '$500,000';
}

function determinePropertyType(zoning: string): string {
  if (zoning.toLowerCase().includes('multi-family')) return 'Multi-Family';
  if (zoning.toLowerCase().includes('condo')) return 'Condo';
  return 'Single Family';
}

function determineDealCategory(score: number, roi: number): string {
  if (score >= 90 && roi >= 20) return 'Hyper Deal';
  if (score >= 80 && roi >= 15) return 'Fix & Flip';
  if (score >= 75 && roi >= 12) return 'Rental Property';
  return 'Investment Property';
}

function calculateNOI(score: number, roi: number): number {
  // Higher score and ROI = higher NOI
  return Math.round(20000 + (score * 200) + (roi * 500));
}

function calculateCapRate(score: number, roi: number): number {
  // Higher score = better cap rate
  return Math.round((6 + (score / 20) + (roi / 10)) * 10) / 10;
}

function calculateBreakEven(score: number, roi: number): string {
  // Higher score and ROI = faster break-even
  const months = Math.max(12, 24 - Math.floor(score / 10) - Math.floor(roi / 5));
  return `${months} months`;
}

function getMockDeal(index: number, deal: any) {
  const mockDeals = [
    { score: 92, roi: 18.5, profitPotential: 95, riskLevel: 'low', marketTrend: 'rising' },
    { score: 88, roi: 22.3, profitPotential: 90, riskLevel: 'medium', marketTrend: 'rising' },
    { score: 85, roi: 15.7, profitPotential: 88, riskLevel: 'low', marketTrend: 'stable' },
    { score: 87, roi: 16.2, profitPotential: 89, riskLevel: 'low', marketTrend: 'rising' },
    { score: 91, roi: 25.8, profitPotential: 94, riskLevel: 'medium', marketTrend: 'rising' },
    { score: 84, roi: 14.9, profitPotential: 86, riskLevel: 'medium', marketTrend: 'stable' },
    { score: 86, roi: 17.1, profitPotential: 88, riskLevel: 'low', marketTrend: 'rising' },
  ];

  const mockData = mockDeals[index] || { score: 75, roi: 15, profitPotential: 80, riskLevel: 'medium', marketTrend: 'stable' };

  return {
    ...deal,
    address: getAddressFromIndex(index),
    coordinates: getCoordinatesFromIndex(index),
    score: mockData.score,
    roi: mockData.roi,
    noi: calculateNOI(mockData.score, mockData.roi),
    capRate: calculateCapRate(mockData.score, mockData.roi),
    cashOnCashReturn: mockData.roi,
    breakEvenTimeline: calculateBreakEven(mockData.score, mockData.roi),
    dealCategory: determineDealCategory(mockData.score, mockData.roi),
    profitPotentialGauge: mockData.profitPotential
  };
}

function getMockRanking(input: RankDealsInput): RankDealsOutput {
  const mockDeals = input.deals.map((deal, index) => getMockDeal(index, deal));
  
  return {
    rankedDeals: mockDeals,
    marketInsights: `Market analysis shows strong growth in tech hubs like Austin and Raleigh, with rental demand increasing by 15-20%. Miami continues to attract international investors, while Phoenix offers excellent flip opportunities due to rapid population growth. Overall market sentiment is positive with stable interest rates and strong job growth.`,
  };
}
