import { rankDeals, RankDealsInput } from '@/ai/flows/deal-ranking';
import DealView from '@/components/deal-view';
import Footer from '@/components/layout/footer';
import MarketInsightsTicker from '@/components/market-insights-ticker';
import MarketOverviewChart from '@/components/market-overview-chart';
import AdvancedFilters from '@/components/advanced-filters';
import { Suspense } from 'react';
import Loading from './loading';
import { Card, CardContent } from '@/components/ui/card';
import MarketOpportunities from '@/components/market-opportunities';
import HeroSection from '@/components/hero-section';
import AIAssistantPanel from '@/components/ai-assistant-panel';
import PropertyScraper from '@/components/property-scraper';

export default async function Home() {
  // Mock data for AI flows
  const rankDealsInput: RankDealsInput = {
    deals: [
      {
        mlsListing: '4 bed, 3 bath single family home in Austin, TX. 2500 sqft. Recently renovated.',
        taxData: 'Assessed value: $750,000. Annual tax: $15,000.',
        zoningInsights: 'Zoned for single-family residential. Potential for ADU.',
      },
      {
        offMarketListing: 'Duplex in a developing neighborhood of Miami, FL. Needs some work.',
        taxData: 'Assessed value: $450,000. Annual tax: $7,000.',
        zoningInsights: 'Multi-family zoning. High rental demand area.',
      },
      {
        mlsListing: 'Modern downtown condo in Denver, CO. 1200 sqft, 2 bed, 2 bath. Great amenities.',
        taxData: 'Assessed value: $600,000. Annual tax: $9,000.',
        zoningInsights: 'High-density residential. Strong appreciation potential.',
      },
       {
        mlsListing: 'Suburban home in Raleigh, NC. 3 bed, 2.5 bath. 2200 sqft. Good school district.',
        taxData: 'Assessed value: $500,000. Annual tax: $6,500.',
        zoningInsights: 'Standard residential zoning. Stable rental market.',
      },
      {
        offMarketListing: 'Fixer-upper in Phoenix, AZ. Large lot. High potential for flip.',
        taxData: 'Assessed value: $300,000. Annual tax: $3,500.',
        zoningInsights: 'Zoning allows for expansion. Popular area for developers.',
      },
       {
        offMarketListing: 'Single family home in Atlanta, GA. Needs cosmetic updates.',
        taxData: 'Assessed value: $350,000. Annual tax: $4,000.',
        zoningInsights: 'Zoned for single-family residential. Potential for rental.',
      },
      {
        mlsListing: 'Townhouse in Charlotte, NC. 1800 sqft, 3 bed, 2.5 bath. Community pool.',
        taxData: 'Assessed value: $400,000. Annual tax: $5,000.',
        zoningInsights: 'Townhouse zoning. Good for long-term rental.',
      }
    ],
    migrationPatterns: 'High influx of tech workers to Austin and Raleigh. Miami sees international investment growth. Atlanta and Charlotte are growing steadily.',
    marketEconomics: 'Interest rates are stable. Strong job growth in tech and healthcare sectors in target cities.',
  };

  const { rankedDeals, marketInsights } = await rankDeals(rankDealsInput);
  const tickerInsights = marketInsights.split('. ').filter(insight => insight);

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 w-full">
          {/* Hero Section */}
          <HeroSection />
          
          {/* Main Content */}
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="space-y-12">
              <MarketInsightsTicker insights={tickerInsights} />
              
              <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                  <AdvancedFilters />
                </div>
                <div className="md:col-span-1">
                   <MarketOverviewChart deals={rankedDeals} />
                </div>
              </div>

              <DealView initialDeals={rankedDeals} marketInsights={marketInsights} />
              
              {/* Property Scraper Section */}
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    AI-Powered Property Discovery
                  </h2>
                  <p className="text-muted-foreground mt-2">
                    Search and analyze real estate properties from across the web with AI insights
                  </p>
                </div>
                <PropertyScraper />
              </div>
              
              <MarketOpportunities deals={rankedDeals} marketInsights={marketInsights} />
            </div>
          </div>
        </main>
        
        {/* AI Assistant Panel */}
        <AIAssistantPanel 
          insights={[
            {
              id: '1',
              type: 'deal',
              message: '🔥 2 Hyper Deals emerged today in Austin market. Rent growth forecast up by 3.2%',
              icon: null,
              priority: 'high'
            },
            {
              id: '2',
              type: 'trend',
              message: '📈 Miami market shows 15% increase in off-market opportunities. Tech sector expansion driving demand.',
              icon: null,
              priority: 'medium'
            },
            {
              id: '3',
              type: 'opportunity',
              message: '💡 AI detected 3 undervalued properties in Phoenix. Potential 25%+ ROI with renovation.',
              icon: null,
              priority: 'high'
            }
          ]}
        />
      </div>
    </Suspense>
  );
}
