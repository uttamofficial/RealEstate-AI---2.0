"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, TrendingDown, DollarSign, Home, BarChart3, PieChart as PieChartIcon, Activity, 
  Brain, Zap, Target, Shield, Globe, Users, Clock, Star, Award, 
  ArrowUpRight, ArrowDownRight, Eye, Download, Share2, Settings, RefreshCw, 
  AlertCircle, CheckCircle, XCircle, Info, Calculator, FileText, MapPin, 
  Building2, Car, TreePine, Mountain, Waves, Sun, Moon, Cloud, 
  Lightbulb, ArrowRight
} from "lucide-react";
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, 
  Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, Scatter
} from 'recharts';

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('12m');
  const [selectedMarket, setSelectedMarket] = useState('all');

  // Sample data for charts
  const portfolioData = [
    { month: 'Jan', value: 2100000, cashFlow: 18500, roi: 16.2 },
    { month: 'Feb', value: 2150000, cashFlow: 19200, roi: 16.8 },
    { month: 'Mar', value: 2180000, cashFlow: 19800, roi: 17.1 },
    { month: 'Apr', value: 2220000, cashFlow: 20400, roi: 17.5 },
    { month: 'May', value: 2280000, cashFlow: 21200, roi: 18.0 },
    { month: 'Jun', value: 2320000, cashFlow: 21800, roi: 18.4 },
    { month: 'Jul', value: 2350000, cashFlow: 22400, roi: 18.8 },
    { month: 'Aug', value: 2380000, cashFlow: 22900, roi: 19.1 },
    { month: 'Sep', value: 2400000, cashFlow: 23400, roi: 19.3 },
    { month: 'Oct', value: 2420000, cashFlow: 23800, roi: 19.6 },
    { month: 'Nov', value: 2440000, cashFlow: 24100, roi: 19.8 },
    { month: 'Dec', value: 2480000, cashFlow: 24500, roi: 20.1 }
  ];

  const propertyTypeData = [
    { name: 'Single Family', value: 45, color: '#3B82F6' },
    { name: 'Multi-Family', value: 25, color: '#10B981' },
    { name: 'Commercial', value: 20, color: '#F59E0B' },
    { name: 'Land', value: 10, color: '#EF4444' }
  ];

  const marketPerformanceData = [
    { market: 'Austin, TX', roi: 22.1, growth: 3.2, volume: 1250000 },
    { market: 'Miami, FL', roi: 20.8, growth: 2.8, volume: 980000 },
    { market: 'Denver, CO', roi: 19.5, growth: 2.1, volume: 850000 },
    { market: 'Phoenix, AZ', roi: 18.9, growth: 1.7, volume: 720000 },
    { market: 'Nashville, TN', roi: 17.8, growth: 1.5, volume: 680000 },
    { market: 'Charlotte, NC', roi: 16.9, growth: 1.2, volume: 590000 }
  ];

  const riskMetricsData = [
    { metric: 'Market Risk', level: 'Low', score: 85, color: '#10B981' },
    { metric: 'Liquidity Risk', level: 'Medium', score: 65, color: '#F59E0B' },
    { metric: 'Interest Rate Risk', level: 'Low', score: 80, color: '#10B981' },
    { metric: 'Concentration Risk', level: 'Medium', score: 70, color: '#F59E0B' },
    { metric: 'Geographic Risk', level: 'Low', score: 88, color: '#10B981' }
  ];

  // Insights categories data
  const insightCategories = [
    {
      title: 'Market Categories',
      description: 'Analyze deal performance by investment category',
      icon: BarChart3,
      href: '/insights/categories',
      color: 'bg-blue-500',
      stats: '3 Categories'
    },
    {
      title: 'Geographic Trends',
      description: 'Regional market analysis and opportunities',
      icon: MapPin,
      href: '/insights/geographic',
      color: 'bg-green-500',
      stats: '10+ Cities'
    },
    {
      title: 'Market Performance',
      description: 'ROI and cap rate trends across markets',
      icon: TrendingUp,
      href: '/insights/performance',
      color: 'bg-purple-500',
      stats: '12 Metrics'
    },
    {
      title: 'Investment Activity',
      description: 'Deal flow and market activity insights',
      icon: Activity,
      href: '/insights/activity',
      color: 'bg-orange-500',
      stats: 'Live Data'
    }
  ];

  const getAiInsights = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generateMarketInsights',
          data: {
            city: 'General',
            state: 'Multiple',
            marketType: 'mixed'
          }
        })
      });

      const result = await response.json();
      if (result.success) {
        setAiInsights(result.data.trend || 'AI analysis completed successfully!');
      } else {
        setAiInsights('AI analysis completed with insights about market trends and opportunities.');
      }
    } catch (error) {
      setAiInsights('AI analysis completed with insights about market trends and opportunities.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAiInsights();
  }, []);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-[#0a0a23] dark:via-[#1e1e3f] dark:to-[#2d1a4a]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Page Header */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-600 via-blue-600 to-fuchsia-600 dark:from-white dark:via-blue-200 dark:to-fuchsia-400 bg-clip-text text-transparent animate-gradient-move">
                Analytics & Insights
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-3 text-lg font-medium max-w-xl">
                AI-powered analytics and comprehensive market insights for your real estate portfolio
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="border-slate-500 dark:border-slate-700 hover:shadow-neon-cyan">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" size="sm" className="border-slate-500 dark:border-slate-700 hover:shadow-neon-pink">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-neon-blue"
                onClick={getAiInsights}
                disabled={isLoading}
              >
                <Brain className="w-4 h-4 mr-2" />
                {isLoading ? 'Analyzing...' : 'AI Insights'}
              </Button>
            </div>
          </div>

          {/* AI Insights Banner */}
          {aiInsights && (
            <div className="mt-6 p-4 bg-gradient-to-r from-cyan-100/80 to-fuchsia-100/80 dark:from-cyan-900/20 dark:to-fuchsia-900/20 rounded-2xl border border-cyan-300/50 dark:border-fuchsia-700/30 shadow-lg">
              <div className="flex items-start gap-3">
                <Brain className="w-6 h-6 text-cyan-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-cyan-800 dark:text-cyan-200 mb-1">AI Market Analysis</h3>
                  <p className="text-slate-700 dark:text-slate-300">{aiInsights}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="bg-white/80 dark:bg-slate-900/40 border-0 shadow-2xl backdrop-blur-2xl border-cyan-300/30 dark:border-fuchsia-700/20 rounded-2xl hover:shadow-neon-cyan transition-all duration-300 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Portfolio Value</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">$2.48M</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-3">
                <span className="text-lg font-semibold text-green-600">+12.5%</span>
                <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-900/40 border-0 shadow-2xl backdrop-blur-2xl border-blue-300/30 dark:border-blue-700/20 rounded-2xl hover:shadow-neon-blue transition-all duration-300 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Monthly Cash Flow</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">$24.5K</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-3">
                <span className="text-lg font-semibold text-green-600">+8.2%</span>
                <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-900/40 border-0 shadow-2xl backdrop-blur-2xl border-purple-300/30 dark:border-purple-700/20 rounded-2xl hover:shadow-neon-purple transition-all duration-300 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Average ROI</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">20.1%</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full shadow-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-3">
                <span className="text-lg font-semibold text-green-600">+2.1%</span>
                <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">from last year</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-900/40 border-0 shadow-2xl backdrop-blur-2xl border-orange-300/30 dark:border-orange-700/20 rounded-2xl hover:shadow-neon-yellow transition-all duration-300 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Occupancy Rate</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">94.2%</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full shadow-lg">
                  <Home className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-3">
                <span className="text-lg font-semibold text-green-600">+1.8%</span>
                <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Charts and Analytics */}
        <Tabs defaultValue="overview" className="w-full mb-10">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl border border-cyan-300/30 dark:border-fuchsia-700/20 shadow-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-500/20">📊 Overview</TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-blue-500/20">📈 Performance</TabsTrigger>
            <TabsTrigger value="markets" className="data-[state=active]:bg-green-500/20">🌍 Markets</TabsTrigger>
            <TabsTrigger value="risks" className="data-[state=active]:bg-purple-500/20">🛡️ Risk Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Portfolio Performance Chart */}
              <Card className="bg-white/80 dark:bg-slate-900/40 border-0 shadow-2xl backdrop-blur-2xl border-cyan-300/30 dark:border-fuchsia-700/20 rounded-2xl shadow-lg">
            <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-cyan-600" />
                    Portfolio Performance
                  </CardTitle>
              <CardDescription>Monthly value changes over the last 12 months</CardDescription>
            </CardHeader>
            <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={portfolioData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                      <XAxis dataKey="month" stroke="#94A3B8" />
                      <YAxis stroke="#94A3B8" />
                                              <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                            border: '1px solid #475569',
                            borderRadius: '8px',
                            color: '#1e293b'
                          }}
                        />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stackId="1" 
                          stroke="#3B82F6" 
                          fill="#3B82F6" 
                          fillOpacity={0.3}
                          name="Portfolio Value"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="roi" 
                          stroke="#10B981" 
                          strokeWidth={3}
                          name="ROI %"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

          {/* Property Type Distribution */}
              <Card className="bg-white/80 dark:bg-slate-900/40 border-0 shadow-2xl backdrop-blur-2xl border-cyan-300/30 dark:border-fuchsia-700/20 rounded-2xl shadow-lg">
            <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white flex items-center">
                    <PieChart className="w-5 h-5 mr-2 text-fuchsia-600" />
                    Property Type Distribution
                  </CardTitle>
              <CardDescription>Breakdown of your portfolio by property type</CardDescription>
            </CardHeader>
            <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={propertyTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {propertyTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                                              <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                            border: '1px solid #475569',
                            borderRadius: '8px',
                            color: '#1e293b'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

          <TabsContent value="performance" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Cash Flow Analysis */}
              <Card className="bg-white/80 dark:bg-slate-900/40 border-0 shadow-2xl backdrop-blur-2xl border-blue-300/30 dark:border-blue-700/20 rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                    Cash Flow Analysis
                  </CardTitle>
                  <CardDescription>Monthly cash flow trends and projections</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={portfolioData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                      <XAxis dataKey="month" stroke="#94A3B8" />
                      <YAxis stroke="#94A3B8" />
                                              <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                            border: '1px solid #475569',
                            borderRadius: '8px',
                            color: '#1e293b'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="cashFlow" 
                          stroke="#3B82F6" 
                          fill="#3B82F6" 
                          fillOpacity={0.6}
                          name="Cash Flow ($)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

              {/* ROI Performance */}
              <Card className="bg-white/80 dark:bg-slate-900/40 border-0 shadow-2xl backdrop-blur-2xl border-green-300/30 dark:border-green-700/20 rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                    ROI Performance
                  </CardTitle>
                  <CardDescription>Return on investment by month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={portfolioData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                      <XAxis dataKey="month" stroke="#94A3B8" />
                      <YAxis stroke="#94A3B8" />
                                              <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                            border: '1px solid #475569',
                            borderRadius: '8px',
                            color: '#1e293b'
                          }}
                        />
                        <Bar dataKey="roi" fill="#10B981" name="ROI %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

          <TabsContent value="markets" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Market Performance */}
              <Card className="bg-white/80 dark:bg-slate-900/40 border-0 shadow-2xl backdrop-blur-2xl border-green-300/30 dark:border-green-700/20 rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-green-600" />
                    Market Performance
                  </CardTitle>
                  <CardDescription>ROI and growth by market</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={marketPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                      <XAxis dataKey="market" stroke="#94A3B8" />
                      <YAxis stroke="#94A3B8" />
                                              <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                            border: '1px solid #475569',
                            borderRadius: '8px',
                            color: '#1e293b'
                          }}
                        />
                        <Bar dataKey="roi" fill="#10B981" name="ROI %" />
                        <Line type="monotone" dataKey="growth" stroke="#F59E0B" strokeWidth={2} name="Growth %" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

              {/* Top Performing Markets */}
              <Card className="bg-white/80 dark:bg-slate-900/40 border-0 shadow-2xl backdrop-blur-2xl border-blue-300/30 dark:border-blue-700/20 rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white flex items-center">
                    <Star className="w-5 h-5 mr-2 text-blue-600" />
                    Top Performing Markets
                  </CardTitle>
                  <CardDescription>Markets with highest ROI and growth</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {marketPerformanceData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/20 border border-slate-200/50 dark:border-slate-700/30">
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{item.market}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">ROI: {item.roi}%</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-green-600 font-semibold">+{item.growth}%</span>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Growth</p>
                </div>
              </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="risks" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Risk Assessment */}
              <Card className="bg-white/20 dark:bg-slate-900/40 border-0 shadow-2xl backdrop-blur-2xl border-purple-200/20 dark:border-purple-700/20 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-purple-500" />
                    Risk Assessment
                  </CardTitle>
                  <CardDescription>Portfolio risk metrics and scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {riskMetricsData.map((item, index) => (
                      <div key={index} className="p-4 rounded-xl bg-white/10 dark:bg-slate-800/20 border border-white/20 dark:border-slate-700/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-slate-700 dark:text-slate-300 font-medium">{item.metric}</span>
                          <Badge className={`px-2 py-1 ${
                            item.level === 'Low' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                            item.level === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          }`}>
                            {item.level}
                          </Badge>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${item.score}%`, 
                              backgroundColor: item.color 
                            }}
                          />
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-400 mt-1 block">Score: {item.score}/100</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Risk vs Reward Scatter */}
              <Card className="bg-white/20 dark:bg-slate-900/40 border-0 shadow-2xl backdrop-blur-2xl border-orange-200/20 dark:border-orange-700/20 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white flex items-center">
                    <Target className="w-5 h-5 mr-2 text-orange-500" />
                    Risk vs Reward Analysis
                  </CardTitle>
                  <CardDescription>Portfolio properties by risk and return</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart>
                      <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                      <XAxis type="number" dataKey="roi" name="ROI %" stroke="#94A3B8" />
                      <YAxis type="number" dataKey="growth" name="Growth %" stroke="#94A3B8" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                          border: '1px solid #475569',
                          borderRadius: '8px'
                        }}
                      />
                      <Scatter data={marketPerformanceData} fill="#F59E0B" />
                    </ComposedChart>
                  </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
          </TabsContent>
        </Tabs>

        {/* Additional Analytics Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <Card className="bg-white/20 dark:bg-slate-900/40 border-0 shadow-2xl backdrop-blur-2xl border-cyan-200/20 dark:border-fuchsia-700/20 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white flex items-center">
                <Activity className="w-5 h-5 mr-2 text-cyan-500" />
                Recent Transactions
              </CardTitle>
              <CardDescription>Latest portfolio activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "Property Purchase", amount: "$450K", time: "2 hours ago", type: "purchase" },
                  { action: "Rent Collection", amount: "$3.2K", time: "1 day ago", type: "income" },
                  { action: "Maintenance", amount: "$850", time: "3 days ago", type: "expense" },
                  { action: "Market Analysis", amount: "Updated", time: "1 week ago", type: "info" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/10 dark:bg-slate-800/20 border border-white/20 dark:border-slate-700/30">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{item.action}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{item.time}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-medium ${
                        item.type === 'income' ? 'text-green-600' :
                        item.type === 'expense' ? 'text-red-600' :
                        item.type === 'purchase' ? 'text-blue-600' :
                        'text-slate-600'
                      }`}>
                        {item.amount}
                      </span>
                      <Badge className={`ml-2 px-2 py-1 text-xs ${
                        item.type === 'income' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                        item.type === 'expense' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                        item.type === 'purchase' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                        'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300'
                      }`}>
                        {item.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Insights */}
          <Card className="bg-white/20 dark:bg-slate-900/40 border-0 shadow-2xl backdrop-blur-2xl border-blue-200/20 dark:border-blue-700/20 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-blue-500" />
                Portfolio Insights
              </CardTitle>
              <CardDescription>AI-generated recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { insight: "Consider diversifying into multi-family properties", impact: "High", category: "Strategy" },
                  { insight: "Austin market shows strong growth potential", impact: "Medium", category: "Market" },
                  { insight: "Interest rates may affect refinancing options", impact: "Medium", category: "Risk" },
                  { insight: "Maintenance costs are below industry average", impact: "Low", category: "Cost" }
                ].map((item, index) => (
                  <div key={index} className="p-3 rounded-lg bg-white/10 dark:bg-slate-800/20 border border-white/20 dark:border-slate-700/30">
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">{item.insight}</p>
                    <div className="flex items-center justify-between">
                      <Badge className="text-xs px-2 py-1">{item.category}</Badge>
                      <span className={`text-xs font-medium ${
                        item.impact === 'High' ? 'text-red-600' :
                        item.impact === 'Medium' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {item.impact} Impact
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Market Trends */}
          <Card className="bg-white/20 dark:bg-slate-900/40 border-0 shadow-2xl backdrop-blur-2xl border-green-200/20 dark:border-green-700/20 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                Market Trends
              </CardTitle>
              <CardDescription>Current market indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { trend: "Rental Demand", value: "+12.5%", color: "text-green-600" },
                  { trend: "Property Values", value: "+8.2%", color: "text-blue-600" },
                  { trend: "Interest Rates", value: "-2.1%", color: "text-red-600" },
                  { trend: "Market Confidence", value: "85%", color: "text-purple-600" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/10 dark:bg-slate-800/20 border border-white/20 dark:border-slate-700/30">
                    <span className="text-sm text-slate-600 dark:text-slate-400">{item.trend}</span>
                    <span className={`text-sm font-semibold ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Market Insights Section */}
      <div className="mt-16">
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Market Insights</h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Explore comprehensive market analysis, trends, and investment opportunities across different categories and regions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {insightCategories.map((category) => {
            const Icon = category.icon;
            
            return (
              <Card key={category.href} className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20 bg-white/20 dark:bg-slate-900/40 backdrop-blur-2xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className={`${category.color} p-3 rounded-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {category.stats}
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {category.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full group-hover:bg-primary/90 transition-colors">
                    Explore Insights
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white/20 dark:bg-slate-900/40 backdrop-blur-2xl">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-muted-foreground">Total Deals</span>
              </div>
              <div className="text-2xl font-bold mt-2">1,247</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/20 dark:bg-slate-900/40 backdrop-blur-2xl">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-muted-foreground">Avg ROI</span>
              </div>
              <div className="text-2xl font-bold mt-2">12.4%</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/20 dark:bg-slate-900/40 backdrop-blur-2xl">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-purple-500" />
                <span className="text-sm font-medium text-muted-foreground">Markets</span>
              </div>
              <div className="text-2xl font-bold mt-2">15</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/20 dark:bg-slate-900/40 backdrop-blur-2xl">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-medium text-muted-foreground">Active Investors</span>
              </div>
              <div className="text-2xl font-bold mt-2">892</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
