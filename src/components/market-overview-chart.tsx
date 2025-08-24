"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts"
import { TrendingUp, MapPin, DollarSign, Home } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { RankedDeal } from "@/lib/types"

export default function MarketOverviewChart({ deals }: { deals: RankedDeal[] }) {
  const chartData = [
    { city: "Austin", score: 94, color: "#3b82f6" },
    { city: "Miami", score: 89, color: "#06b6d4" },
    { city: "Denver", score: 87, color: "#8b5cf6" },
    { city: "Phoenix", score: 91, color: "#10b981" },
    { city: "Charlotte", score: 88, color: "#f59e0b" }
  ];

  const marketSummary = {
    totalDeals: deals.length,
    avgScore: Math.round(deals.reduce((sum, deal) => sum + deal.score, 0) / deals.length),
    avgROI: Math.round(deals.reduce((sum, deal) => sum + deal.roi, 0) / deals.length * 10) / 10,
    topMarket: chartData.reduce((max, city) => city.score > max.score ? city : max)
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards - Reduced spacing */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-0 shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-muted-foreground font-medium">Total Deals</span>
            </div>
            <p className="text-xl font-bold text-blue-600 mt-1">{marketSummary.totalDeals}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-0 shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs text-muted-foreground font-medium">Avg Score</span>
            </div>
            <p className="text-xl font-bold text-green-600 mt-1">{marketSummary.avgScore}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-0 shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-purple-600" />
              <span className="text-xs text-muted-foreground font-medium">Avg ROI</span>
            </div>
            <p className="text-xl font-bold text-purple-600 mt-1">{marketSummary.avgROI}%</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-0 shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-600" />
              <span className="text-xs text-muted-foreground font-medium">Top Market</span>
            </div>
            <p className="text-lg font-bold text-orange-600 mt-1">{marketSummary.topMarket.city}</p>
            <p className="text-xs text-muted-foreground">{marketSummary.topMarket.score}/100</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart - Balanced height to match Advanced Filters */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Market Performance Overview</CardTitle>
              <CardDescription className="text-sm">AI-powered market analysis across top investment cities</CardDescription>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>AI Score</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-5">
            {/* Chart - Balanced height */}
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 15, right: 25, left: 25, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="city" 
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickMargin={10}
                  />
                  <YAxis 
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value, name) => [
                      `${value}/100`,
                      name === 'score' ? 'AI Score' : name
                    ]}
                  />
                  <Bar 
                    dataKey="score" 
                    radius={[4, 4, 0, 0]}
                    maxBarSize={50}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Market Insights - Enhanced layout */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Highest Score</p>
                <p className="text-lg font-bold text-blue-600">{marketSummary.topMarket.city}</p>
                <p className="text-sm text-muted-foreground">{marketSummary.topMarket.score}/100</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Best ROI</p>
                <p className="text-lg font-bold text-green-600">Miami</p>
                <p className="text-sm text-muted-foreground">22.1%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Growth Leader</p>
                <p className="text-lg font-bold text-purple-600">Raleigh</p>
                <p className="text-sm text-muted-foreground">13.1%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
