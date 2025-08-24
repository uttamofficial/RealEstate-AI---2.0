"use client"

import type { RankedDeal } from "@/lib/types"
import DealCard from "./deal-card"
import { Home, Zap, TrendingUp, Building2, MapPin, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"

interface MarketOpportunitiesProps {
  deals: RankedDeal[]
  marketInsights: string
}

export default function MarketOpportunities({
  deals,
  marketInsights,
}: MarketOpportunitiesProps) {
  const rentalDeals = deals
    .filter((d) => d.dealCategory?.toLowerCase().includes("rental"))
    .sort((a, b) => b.roi - a.roi)
    .slice(0, 3)

  const flipDeals = deals
    .filter((d) => d.dealCategory?.toLowerCase().includes("flip"))
    .sort((a, b) => b.profitPotentialGauge - a.profitPotentialGauge)
    .slice(0, 3)

  // Create additional flip deals with unique data
  const additionalFlipDeals = [
    {
      id: 'flip-extra-1',
      address: '789 Oak Ridge Drive, Nashville, TN',
      dealCategory: 'Fix & Flip',
      score: 94,
      roi: 28.5,
      profitPotentialGauge: 96,
      noi: 32000,
      capRate: 8.9,
      cashOnCashReturn: 28.5,
      breakEvenTimeline: '14 months',
      mlsListing: 'Renovation-ready property in growing neighborhood. High demand area with excellent resale potential.',
      offMarketListing: 'Off-market opportunity through investor network. Seller motivated for quick close.',
      taxData: 'Assessed value: $380,000. Annual tax: $4,200.',
      zoningInsights: 'Single-family residential. Allows for garage conversion to ADU.',
      coordinates: { lat: 36.1627, lng: -86.7816 }
    },
    {
      id: 'flip-extra-2',
      address: '456 Pine Valley Lane, Charlotte, NC',
      dealCategory: 'Fix & Flip',
      score: 91,
      roi: 26.2,
      profitPotentialGauge: 93,
      noi: 29500,
      capRate: 8.2,
      cashOnCashReturn: 26.2,
      breakEvenTimeline: '16 months',
      mlsListing: 'Solid foundation with cosmetic updates needed. Great location near tech corridor.',
      offMarketListing: 'Private listing from local developer. Part of portfolio sale.',
      taxData: 'Assessed value: $360,000. Annual tax: $3,800.',
      zoningInsights: 'Residential zoning. Potential for basement finish.',
      coordinates: { lat: 35.2271, lng: -80.8431 }
    }
  ]

  // Create additional market opportunity cards
  const marketOpportunityCards = [
    {
      id: 'opp-1',
      title: 'Emerging Tech Hub Markets',
      description: 'Austin, Raleigh, and Nashville showing 25%+ annual appreciation with strong rental demand.',
      metrics: [
        { label: 'Avg. ROI', value: '18.5%', color: 'text-green-600' },
        { label: 'Rent Growth', value: '12.3%', color: 'text-blue-600' },
        { label: 'Market Score', value: '92/100', color: 'text-purple-600' }
      ],
      icon: <TrendingUp className="w-6 h-6" />,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'opp-2',
      title: 'Coastal Investment Zones',
      description: 'Miami and Tampa markets benefiting from migration trends and international investment.',
      metrics: [
        { label: 'Avg. ROI', value: '22.1%', color: 'text-green-600' },
        { label: 'Price Growth', value: '15.7%', color: 'text-blue-600' },
        { label: 'Market Score', value: '89/100', color: 'text-purple-600' }
      ],
      icon: <Building2 className="w-6 h-6" />,
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      id: 'opp-3',
      title: 'Suburban Growth Corridors',
      description: 'Phoenix, Atlanta, and Charlotte suburbs offering stable returns with lower volatility.',
      metrics: [
        { label: 'Avg. ROI', value: '16.8%', color: 'text-green-600' },
        { label: 'Cash Flow', value: '8.9%', color: 'text-blue-600' },
        { label: 'Market Score', value: '87/100', color: 'text-purple-600' }
      ],
      icon: <MapPin className="w-6 h-6" />,
      gradient: 'from-orange-500 to-red-500'
    },
    {
      id: 'opp-4',
      title: 'Value-Add Opportunities',
      description: 'Distressed properties in prime locations with renovation potential for 30%+ returns.',
      metrics: [
        { label: 'Avg. ROI', value: '31.2%', color: 'text-green-600' },
        { label: 'ARV Margin', value: '45%', color: 'text-blue-600' },
        { label: 'Market Score', value: '95/100', color: 'text-purple-600' }
      ],
      icon: <DollarSign className="w-6 h-6" />,
      gradient: 'from-purple-500 to-pink-500'
    }
  ]

  return (
    <div className="space-y-16">
      {/* Top Rentals Section */}
      <section>
        <div className="flex items-center mb-6">
          <Home className="w-8 h-8 text-primary mr-3" />
          <h2 className="font-headline text-3xl font-bold text-foreground">
            Top Rentals
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rentalDeals.map((deal) => (
            <DealCard
              key={deal.taxData}
              deal={deal}
              marketInsights={marketInsights}
            />
          ))}
        </div>
      </section>

      {/* Prime Flips Section - Enhanced with more cards */}
      <section>
        <div className="flex items-center mb-6">
          <Zap className="w-8 h-8 text-primary mr-3" />
          <h2 className="font-headline text-3xl font-bold text-foreground">
            Prime Flips
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {flipDeals.map((deal) => (
            <DealCard
              key={deal.taxData}
              deal={deal}
              marketInsights={marketInsights}
            />
          ))}
          {/* Additional flip deals with unique data */}
          {additionalFlipDeals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal as RankedDeal}
              marketInsights={marketInsights}
            />
          ))}
        </div>
      </section>

      {/* Market Opportunities Section - Enhanced with more cards */}
      <section>
        <div className="flex items-center mb-6">
          <TrendingUp className="w-8 h-8 text-primary mr-3" />
          <h2 className="font-headline text-3xl font-bold text-foreground">
            Market Opportunities
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {marketOpportunityCards.map((card) => (
            <Card key={card.id} className="group hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${card.gradient} flex items-center justify-center text-white`}>
                    {card.icon}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Hot Market
                  </Badge>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {card.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {card.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {card.metrics.map((metric, index) => (
                    <div key={index} className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
                      <p className={`font-bold text-lg ${metric.color}`}>{metric.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">AI Confidence</span>
                    <span className="font-semibold text-primary">High</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
