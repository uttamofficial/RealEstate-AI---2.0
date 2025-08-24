'use server';

/**
 * @fileOverview Ranks real estate properties based on profitability, risk, and timeline.
 *
 * This file exports:
 * - `rankProperties` - A function that ranks real estate properties.
 * - `RankPropertiesInput` - The input type for the rankProperties function.
 * - `RankPropertiesOutput` - The output type for the rankProperties function.
 */

import { z } from 'zod';

const PropertySchema = z.object({
  address: z.string().describe('Full property address, including city and state.'),
  propertyDetails: z.string().describe('Detailed information about the property, including size, features, and condition.'),
  marketAnalysis: z.string().describe('Analysis of the local real estate market, including recent trends and comparable sales.'),
  financialData: z.string().describe('Financial data related to the property, such as purchase price, potential rental income, and expenses.'),
  mlsListing: z.string().optional().describe('MLS listing details if available'),
  offMarketListing: z.string().optional().describe('Off-market listing details if available'),
  taxData: z.string().describe('Tax data for the property'),
  zoningInsights: z.string().describe('Zoning insights for the property'),
});

const RankPropertiesInputSchema = z.object({
  properties: z.array(PropertySchema).describe('An array of real estate properties to rank.'),
  migrationPatterns: z.string().describe('Migration patterns data.'),
  marketEconomics: z.string().describe('Market economics data.'),
});
export type RankPropertiesInput = z.infer<typeof RankPropertiesInputSchema>;

const RankedPropertySchema = PropertySchema.extend({
  score: z.number().describe('The AI ranking score for the property (0-100)'),
  roi: z.number().describe('The return on investment percentage'),
  noi: z.number().describe('The annual Net Operating Income for the property.'),
  capRate: z.number().describe('The capitalization rate for the property as a percentage.'),
  cashOnCashReturn: z.number().describe('The cash-on-cash return for the property as a percentage.'),
  breakEvenTimeline: z.string().describe('The estimated break-even timeline'),
  dealCategory: z.string().describe('The deal category icon (e.g., "Rental", "Flip", "Up-zoning")'),
  profitPotentialGauge: z.number().describe('Profit potential gauge (0-100) based on score changes')
});

const RankPropertiesOutputSchema = z.object({
  rankedProperties: z.array(RankedPropertySchema).describe('The ranked list of real estate properties.'),
  marketInsights: z.string().describe('Summary of market insights'),
});
export type RankPropertiesOutput = z.infer<typeof RankPropertiesOutputSchema>;

export async function rankProperties(input: RankPropertiesInput): Promise<RankPropertiesOutput> {
  // Mock implementation for now - you can integrate with Google AI later
  const mockRankedProperties = input.properties.map((property, index) => ({
    ...property,
    score: 90 - (index * 5),
    roi: 15 - (index * 1.5),
    noi: 30000 - (index * 2500),
    capRate: 9.5 - (index * 0.6),
    cashOnCashReturn: 18 - (index * 2),
    breakEvenTimeline: `${20 - index} months`,
    dealCategory: index % 2 === 0 ? "Rental" : "Flip",
    profitPotentialGauge: 95 - (index * 4)
  }));

  const mockMarketInsights = "Market analysis shows strong growth potential with increasing demand for investment properties. Interest rates remain favorable for investors. Tech sector expansion continues to drive property values in target markets.";

  return {
    rankedProperties: mockRankedProperties,
    marketInsights: mockMarketInsights
  };
}
