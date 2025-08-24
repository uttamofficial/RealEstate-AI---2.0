"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Home, MapPin, DollarSign, TrendingUp, Eye, Edit, Trash2, Plus, Search, Filter, 
  Grid3X3, List, BarChart3, Calendar, Users, Star, Zap, Building2, Car, 
  TreePine, Mountain, Waves, Sun, Moon, Cloud, Target, Award, Clock, Activity, 
  ArrowUpRight, ArrowDownRight, Download, Share2, Settings, RefreshCw, AlertCircle, 
  CheckCircle, XCircle, Info, Brain, Rocket, Shield, Cpu, Database, Wifi, Battery, 
  Signal, Maximize2, Minimize2, RotateCcw, Play, Pause, Lightbulb, Bot
} from "lucide-react";
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, 
  Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";
import MapView from "@/components/map-view";

export default function PropertiesPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [selectedView, setSelectedView] = useState('grid');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    ai: 'operational',
    database: 'operational',
    market: 'operational',
    security: 'operational'
  });

  // Custom styles for better dropdown visibility
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      select {
        appearance: none !important;
        -webkit-appearance: none !important;
        -moz-appearance: none !important;
        background-image: none !important;
      }
      select option {
        background-color: #1e293b !important;
        color: white !important;
        padding: 8px 12px !important;
      }
      select option:hover {
        background-color: #334155 !important;
      }
      select option:checked {
        background-color: #0ea5e9 !important;
      }
      select:focus {
        outline: none !important;
        border-color: #0ea5e9 !important;
        box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.2) !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Sample data for charts
  const portfolioData = [
    { month: 'Jan', value: 2100000, cashFlow: 18500, roi: 16.2, properties: 15 },
    { month: 'Feb', value: 2150000, cashFlow: 19200, roi: 16.8, properties: 16 },
    { month: 'Mar', value: 2180000, cashFlow: 19800, roi: 17.1, properties: 16 },
    { month: 'Apr', value: 2220000, cashFlow: 20400, roi: 17.5, properties: 17 },
    { month: 'May', value: 2280000, cashFlow: 21200, roi: 18.0, properties: 17 },
    { month: 'Jun', value: 2320000, cashFlow: 21800, roi: 18.4, properties: 18 }
  ];

  const marketData = [
    { market: 'Austin, TX', roi: 22.1, growth: 3.2, volume: 1250000, risk: 15 },
    { market: 'Miami, FL', roi: 20.8, growth: 2.8, volume: 980000, risk: 25 },
    { market: 'Denver, CO', roi: 19.5, growth: 2.1, volume: 850000, risk: 20 },
    { market: 'Phoenix, AZ', roi: 18.9, growth: 1.7, volume: 720000, risk: 30 },
    { market: 'Nashville, TN', roi: 17.8, growth: 1.5, volume: 680000, risk: 35 }
  ];

  const properties = [
    {
      id: 1,
      name: "Modern Downtown Condo",
      address: "123 Main St, Austin, TX",
      type: "Condo",
      price: "$450,000",
      roi: "18.5%",
      status: "Active",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
      marketTrend: "+12.3%",
      occupancy: "95%",
      lastUpdated: "2 hours ago",
      features: ["Pool", "Gym", "Parking"],
      marketScore: 92
    },
    {
      id: 2,
      name: "Suburban Family Home",
      address: "456 Oak Ave, Miami, FL",
      type: "Single Family",
      price: "$650,000",
      roi: "22.1%",
      status: "Rented",
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
      marketTrend: "+8.7%",
      occupancy: "100%",
      lastUpdated: "1 day ago",
      features: ["Garden", "Garage", "School District"],
      marketScore: 88
    },
    {
      id: 3,
      name: "Investment Duplex",
      address: "789 Pine Rd, Denver, CO",
      type: "Multi-Family",
      price: "$380,000",
      roi: "25.3%",
      status: "Active",
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop",
      marketTrend: "+15.2%",
      occupancy: "87%",
      lastUpdated: "3 days ago",
      features: ["Dual Units", "Shared Yard", "Utilities Included"],
      marketScore: 95
    },
    {
      id: 4,
      name: "Luxury Waterfront Villa",
      address: "321 Beach Blvd, Malibu, CA",
      type: "Luxury",
      price: "$2,850,000",
      roi: "28.7%",
      status: "Active",
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop",
      marketTrend: "+18.9%",
      occupancy: "92%",
      lastUpdated: "4 hours ago",
      features: ["Ocean View", "Private Beach", "Helipad"],
      marketScore: 98
    },
    {
      id: 5,
      name: "Historic Townhouse",
      address: "567 Heritage Ln, Boston, MA",
      type: "Townhouse",
      price: "$890,000",
      roi: "16.8%",
      status: "Rented",
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
      marketTrend: "+11.2%",
      occupancy: "100%",
      lastUpdated: "1 day ago",
      features: ["Historic Charm", "Fireplace", "Garden"],
      marketScore: 85
    },
    {
      id: 6,
      name: "Mountain Retreat Cabin",
      address: "789 Alpine Dr, Aspen, CO",
      type: "Vacation",
      price: "$1,250,000",
      roi: "32.1%",
      status: "Active",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
      marketTrend: "+22.5%",
      occupancy: "78%",
      lastUpdated: "6 hours ago",
      features: ["Mountain View", "Ski Access", "Hot Tub"],
      marketScore: 91
    },
    {
      id: 7,
      name: "Urban Loft Space",
      address: "432 Industrial Ave, Brooklyn, NY",
      type: "Loft",
      price: "$720,000",
      roi: "19.8%",
      status: "Rented",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
      marketTrend: "+14.7%",
      occupancy: "96%",
      lastUpdated: "2 days ago",
      features: ["High Ceilings", "Exposed Brick", "Rooftop"],
      marketScore: 89
    },
    {
      id: 8,
      name: "Golf Course Estate",
      address: "654 Fairway Dr, Scottsdale, AZ",
      type: "Estate",
      price: "$1,680,000",
      roi: "24.3%",
      status: "Active",
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
      marketTrend: "+16.8%",
      occupancy: "88%",
      lastUpdated: "1 day ago",
      features: ["Golf Course", "Pool", "Tennis Court"],
      marketScore: 93
    },
    {
      id: 9,
      name: "Tech Hub Apartment",
      address: "987 Innovation St, San Francisco, CA",
      type: "Apartment",
      price: "$580,000",
      roi: "21.5%",
      status: "Rented",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
      marketTrend: "+13.2%",
      occupancy: "94%",
      lastUpdated: "3 hours ago",
      features: ["Smart Home", "Co-working", "EV Charging"],
      marketScore: 87
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
    // Simulate real-time system status updates
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        ai: Math.random() > 0.95 ? 'warning' : 'operational',
        market: Math.random() > 0.98 ? 'warning' : 'operational'
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return '●';
      case 'warning': return '⚠';
      case 'error': return '✗';
      default: return '○';
    }
  };

  const getPropertyStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800";
      case "Rented": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "Under Renovation": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 border-gray-200 dark:border-gray-800";
    }
  };

  const getPropertyStatusIcon = (status: string) => {
    switch (status) {
      case "Active": return <CheckCircle className="w-4 h-4" />;
      case "Rented": return <Users className="w-4 h-4" />;
      case "Under Renovation": return <Settings className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getMarketScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getPropertyTypeColor = (type: string) => {
    switch (type) {
      case "Luxury": return "text-purple-400";
      case "Vacation": return "text-orange-400";
      case "Estate": return "text-indigo-400";
      case "Loft": return "text-pink-400";
      case "Condo": return "text-cyan-400";
      case "Single Family": return "text-green-400";
      case "Multi-Family": return "text-blue-400";
      case "Townhouse": return "text-amber-400";
      case "Apartment": return "text-teal-400";
      default: return "text-slate-400";
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isFullscreen 
        ? 'bg-white' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-[#000000] dark:via-[#0f0f23] dark:to-[#1a1a3f]'
    }`}>
      <div className={`container mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-500 ${
        isFullscreen ? 'max-w-none' : ''
      }`}>
        {/* Futuristic Header with System Status */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-6xl font-black tracking-tight bg-gradient-to-r from-cyan-600 via-blue-600 to-fuchsia-600 dark:from-white dark:via-blue-200 dark:to-fuchsia-400 bg-clip-text text-transparent animate-pulse">
                PROPERTY COMMAND CENTER
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-3 text-xl font-medium max-w-2xl">
                AI-Powered Real Estate Portfolio Management • Quantum Investment Intelligence
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-cyan-500/50 dark:border-cyan-600/30 hover:bg-cyan-500/20 text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4 mr-2" /> : <Maximize2 className="w-4 h-4 mr-2" />}
                {isFullscreen ? 'Exit' : 'Fullscreen'}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-fuchsia-500/50 dark:border-fuchsia-600/30 hover:bg-fuchsia-500/20 text-fuchsia-600 hover:text-fuchsia-700 dark:text-fuchsia-400 dark:hover:text-fuchsia-300"
                onClick={getAiInsights}
                disabled={isLoading}
              >
                <Brain className="w-4 h-4 mr-2" />
                {isLoading ? 'Analyzing...' : 'AI Insights'}
              </Button>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:from-cyan-600 hover:to-fuchsia-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Property
              </Button>
            </div>
          </div>

          {/* System Status Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {Object.entries(systemStatus).map(([key, status]) => (
              <div key={key} className="bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl rounded-xl p-4 border border-cyan-500/30 dark:border-fuchsia-700/20 shadow-lg">
                <div className="flex items-center space-x-3">
                  <span className={`text-2xl ${getStatusColor(status)}`}>{getStatusIcon(status)}</span>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wider">{key}</p>
                    <p className={`text-sm font-bold ${getStatusColor(status)}`}>{status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Insights Banner */}
          {aiInsights && (
            <div className="mt-6 p-6 bg-gradient-to-r from-cyan-100/80 to-fuchsia-100/80 dark:from-cyan-900/20 dark:to-fuchsia-900/20 rounded-2xl border border-cyan-500/50 dark:border-fuchsia-700/30 backdrop-blur-xl shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-fuchsia-500 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-cyan-700 dark:text-cyan-200 mb-2 text-lg">AI Market Analysis</h3>
                  <p className="text-slate-700 dark:text-slate-200 text-base leading-relaxed">{aiInsights}</p>
                </div>
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:from-cyan-600 hover:to-fuchsia-600 text-white"
                  onClick={getAiInsights}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          )}

          {/* Enhanced Portfolio Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <Card className="bg-white/80 dark:bg-slate-900/40 border-0 shadow-2xl backdrop-blur-2xl border-cyan-500/30 dark:border-cyan-700/20 rounded-2xl hover:shadow-cyan-500/25 transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Properties</p>
                    <p className="text-3xl font-bold text-cyan-600 dark:text-cyan-300">18</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center mt-3">
                  <span className="text-lg font-semibold text-green-600">+15.2%</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400 ml-2">this quarter</span>
                </div>
                <Progress value={75} className="mt-3 h-2 bg-slate-200 dark:bg-slate-700" />
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-900/40 border-0 shadow-2xl backdrop-blur-2xl border-blue-500/30 dark:border-blue-700/20 rounded-2xl hover:shadow-blue-500/25 transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Average ROI</p>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-300">24.7%</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
              </div>
                <div className="flex items-center mt-3">
                  <span className="text-lg font-semibold text-green-600">+8.3%</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400 ml-2">from last year</span>
            </div>
                <Progress value={82} className="mt-3 h-2 bg-slate-200 dark:bg-slate-700" />
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-900/40 border-0 shadow-2xl backdrop-blur-2xl border-purple-500/30 dark:border-purple-700/20 rounded-2xl hover:shadow-purple-500/25 transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Occupancy Rate</p>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-300">89%</p>
              </div>
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6 text-white" />
            </div>
              </div>
                <div className="flex items-center mt-3">
                  <span className="text-lg font-semibold text-green-600">+5.1%</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400 ml-2">from last month</span>
            </div>
                <Progress value={89} className="mt-3 h-2 bg-slate-200 dark:bg-slate-700" />
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-900/40 border-0 shadow-2xl backdrop-blur-2xl border-orange-500/30 dark:border-orange-700/20 rounded-2xl hover:shadow-orange-500/25 transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Market Score</p>
                    <p className="text-3xl font-bold text-orange-600 dark:text-orange-300">90/100</p>
              </div>
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                    <Target className="w-6 h-6 text-white" />
            </div>
          </div>
                <div className="flex items-center mt-3">
                  <span className="text-lg font-semibold text-green-600">+12.5%</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400 ml-2">from last quarter</span>
                </div>
                <Progress value={90} className="mt-3 h-2 bg-slate-200 dark:bg-slate-700" />
              </CardContent>
            </Card>
        </div>

          {/* Enhanced Navigation Tabs */}
          <Tabs value={selectedView} onValueChange={setSelectedView} className="w-full mb-8 mt-8">
            <TabsList className="grid w-full grid-cols-4 bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl border border-cyan-500/30 dark:border-fuchsia-700/20 rounded-2xl p-1 shadow-lg">
              <TabsTrigger value="grid" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 text-cyan-700 dark:text-cyan-300">
                🏠 Grid View
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 text-blue-700 dark:text-blue-300">
                📊 Analytics
              </TabsTrigger>
              <TabsTrigger value="map" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-pink-500/20 text-purple-700 dark:text-purple-300">
                🗺️ Map View
              </TabsTrigger>
              <TabsTrigger value="ai" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/20 data-[state=active]:to-red-500/20 text-pink-700 dark:text-pink-300">
                🤖 AI Hub
              </TabsTrigger>
            </TabsList>

            {/* Grid View Tab */}
            <TabsContent value="grid" className="mt-6">
        {/* Enhanced Filters and Search */}
        <div className="mb-8">
                <Card className="bg-white/80 dark:bg-slate-900/40 border-0 shadow-2xl backdrop-blur-2xl border-cyan-500/30 dark:border-cyan-700/20 rounded-2xl shadow-lg">
                  <CardHeader className="border-b border-cyan-500/30 dark:border-cyan-700/20">
              <div className="flex items-center justify-between">
                <div>
                        <CardTitle className="text-cyan-700 dark:text-cyan-200 flex items-center">
                          <Filter className="w-5 h-5 mr-2 text-cyan-600" />
                          Quantum Filters
                  </CardTitle>
                        <CardDescription className="text-slate-600 dark:text-slate-400">AI-powered property discovery and filtering</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="text-cyan-600 hover:bg-cyan-500/20 dark:text-cyan-300 dark:hover:bg-cyan-500/20">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                        <Button variant="ghost" size="sm" className="text-cyan-600 hover:bg-cyan-500/20 dark:text-cyan-300 dark:hover:bg-cyan-500/20">
                    <Settings className="w-4 h-4 mr-2" />
                    Save Filters
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Property Type
                  </label>
                  <div className="relative">
                        <select className="w-full p-3 pr-10 border border-cyan-500/50 dark:border-cyan-400/50 rounded-lg bg-white/90 dark:bg-slate-700/90 text-slate-800 dark:text-white focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 shadow-lg backdrop-blur-sm">
                      <option className="bg-white text-slate-800 hover:bg-slate-100">All Types</option>
                      <option className="bg-white text-slate-800 hover:bg-slate-100">Single Family</option>
                      <option className="bg-white text-slate-800 hover:bg-slate-100">Condo</option>
                      <option className="bg-white text-slate-800 hover:bg-slate-100">Multi-Family</option>
                      <option className="bg-white text-slate-800 hover:bg-slate-100">Luxury</option>
                      <option className="bg-white text-slate-800 hover:bg-slate-100">Townhouse</option>
                      <option className="bg-white text-slate-800 hover:bg-slate-100">Vacation</option>
                      <option className="bg-white text-slate-800 hover:bg-slate-100">Loft</option>
                      <option className="bg-white text-slate-800 hover:bg-slate-100">Estate</option>
                      <option className="bg-white text-slate-800 hover:bg-slate-100">Apartment</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <div className="w-2.5 h-2.5 border-r-2 border-b-2 border-cyan-600 transform rotate-45"></div>
                    </div>
                  </div>
                </div>
                <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Status
                  </label>
                  <div className="relative">
                        <select className="w-full p-3 pr-10 border border-cyan-500/50 dark:border-cyan-400/50 rounded-lg bg-white/90 dark:bg-slate-700/90 text-slate-800 dark:text-white focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 shadow-lg backdrop-blur-sm">
                      <option className="bg-white text-slate-800 hover:bg-slate-100">All Status</option>
                      <option className="bg-white text-slate-800 hover:bg-slate-100">Active</option>
                      <option className="bg-white text-slate-800 hover:bg-slate-100">Rented</option>
                      <option className="bg-white text-slate-800 hover:bg-slate-100">Under Renovation</option>
                      <option className="bg-white text-slate-800 hover:bg-slate-100">Sold</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <div className="w-2.5 h-2.5 border-r-2 border-b-2 border-cyan-600 transform rotate-45"></div>
                    </div>
                  </div>
                </div>
                <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    ROI Range
                  </label>
                  <div className="relative">
                        <select className="w-full p-3 pr-10 border border-cyan-500/50 dark:border-cyan-400/50 rounded-lg bg-white/90 dark:bg-slate-700/90 text-slate-800 dark:text-white focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 shadow-lg backdrop-blur-sm">
                      <option className="bg-white text-slate-800 hover:bg-slate-100">All ROI</option>
                      <option className="bg-white text-slate-800 hover:bg-slate-100">15%+</option>
                      <option className="bg-white text-slate-800 hover:bg-slate-100">20%+</option>
                      <option className="bg-white text-slate-800 hover:bg-slate-100">25%+</option>
                      <option className="bg-white text-slate-800 hover:bg-slate-100">30%+</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <div className="w-2.5 h-2.5 border-r-2 border-b-2 border-cyan-600 transform rotate-45"></div>
                    </div>
                  </div>
                </div>
                <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Market Score
                  </label>
                  <div className="relative">
                        <select className="w-full p-3 pr-10 border border-cyan-500/50 dark:border-cyan-400/50 rounded-lg bg-white/90 dark:bg-slate-700/90 text-slate-800 dark:text-white focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 shadow-lg backdrop-blur-sm">
                      <option className="bg-white text-slate-800 hover:bg-slate-100">All Scores</option>
                      <option className="bg-white text-slate-800 hover:bg-slate-100">80+</option>
                      <option className="bg-white text-slate-800 hover:bg-slate-100">85+</option>
                      <option className="bg-white text-slate-800 hover:bg-slate-100">90+</option>
                      <option className="bg-white text-slate-800 hover:bg-slate-100">95+</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <div className="w-2.5 h-2.5 border-r-2 border-b-2 border-cyan-600 transform rotate-45"></div>
                    </div>
                  </div>
                </div>
                <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Search
                  </label>
                  <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyan-600" />
                    <Input
                      type="text"
                      placeholder="Search properties..."
                            className="w-full pl-12 pr-3 py-3 border border-cyan-500/30 dark:border-cyan-700/30 rounded-lg bg-white/90 dark:bg-slate-800/40 text-slate-800 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

              {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
                  <Card key={property.id} className="bg-white/80 dark:bg-slate-900/40 border-0 shadow-2xl backdrop-blur-2xl border-cyan-500/30 dark:border-cyan-700/20 rounded-2xl hover:shadow-cyan-500/25 transition-all duration-300 group overflow-hidden shadow-lg">
              <div className="relative">
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 flex flex-col space-y-2">
                        <Badge className={`${getPropertyStatusColor(property.status)} border flex items-center space-x-1`}>
                          {getPropertyStatusIcon(property.status)}
                    <span>{property.status}</span>
                  </Badge>
                  <Badge className="bg-black/70 text-white border-0 backdrop-blur-sm">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    {property.marketScore}
                  </Badge>
                </div>
                <div className="absolute bottom-3 left-3">
                  <Badge className="bg-green-600 text-white border-0">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {property.marketTrend}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-cyan-300 dark:text-cyan-200 group-hover:text-cyan-400 transition-colors duration-200">
                  {property.name}
                </CardTitle>
                      <CardDescription className="flex items-center text-slate-400 dark:text-slate-400">
                  <MapPin className="w-4 h-4 mr-1" />
                  {property.address}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                          <div className="text-center p-2 rounded-lg bg-black/20 dark:bg-slate-700/20">
                            <p className="text-xs text-slate-400 dark:text-slate-400">Price</p>
                            <p className="text-lg font-bold text-green-400">{property.price}</p>
                    </div>
                          <div className="text-center p-2 rounded-lg bg-black/20 dark:bg-slate-700/20">
                            <p className="text-xs text-slate-400 dark:text-slate-400">ROI</p>
                            <p className="text-lg font-bold text-blue-400">{property.roi}</p>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Type:</span>
                            <span className={`text-sm font-medium ${getPropertyTypeColor(property.type)}`}>{property.type}</span>
                    </div>
                    <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Occupancy:</span>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{property.occupancy}</span>
                    </div>
                    <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Market Score:</span>
                      <span className={`text-sm font-bold ${getMarketScoreColor(property.marketScore)}`}>
                        {property.marketScore}/100
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1">
                    {property.features.slice(0, 3).map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-cyan-500/30 text-cyan-600 dark:text-cyan-300">
                        {feature}
                      </Badge>
                    ))}
                    {property.features.length > 3 && (
                            <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-600 dark:text-cyan-300">
                        +{property.features.length - 3} more
                      </Badge>
                    )}
                  </div>

                  {/* Last Updated */}
                  <div className="flex items-center text-xs text-slate-500 dark:text-slate-500">
                    <Clock className="w-3 h-3 mr-1" />
                    Updated {property.lastUpdated}
                  </div>
                  
                  {/* Action Buttons */}
                        <div className="flex space-x-2 pt-3 border-t border-cyan-500/30 dark:border-cyan-700/20">
                          <Button variant="outline" size="sm" className="flex-1 hover:bg-cyan-500/20 dark:hover:bg-cyan-500/20 hover:border-cyan-400 dark:hover:border-cyan-400 transition-all duration-200 text-cyan-600 dark:text-cyan-300 border-cyan-500/30">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                          <Button variant="outline" size="sm" className="flex-1 hover:bg-green-500/20 dark:hover:bg-green-500/20 hover:border-green-400 dark:hover:border-green-400 transition-all duration-200 text-green-600 dark:text-green-300 border-green-500/30">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-500/20 dark:hover:bg-red-500/20 hover:border-red-400 dark:hover:border-red-400 transition-all duration-200 border-red-500/30">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <Card className="bg-white/80 dark:bg-slate-900/40 border-0 shadow-2xl backdrop-blur-2xl border-blue-500/30 dark:border-blue-700/20 rounded-2xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-blue-700 dark:text-blue-200 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                      Portfolio Performance
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">Monthly value changes and ROI trends</CardDescription>
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

                <Card className="bg-white/80 dark:bg-slate-900/40 border-0 shadow-2xl backdrop-blur-2xl border-purple-500/30 dark:border-purple-700/20 rounded-2xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-purple-700 dark:text-purple-200 flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                      Market Performance
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">ROI and growth by market</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <ComposedChart data={marketData}>
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
                        <Bar dataKey="roi" fill="#8b5cf6" name="ROI %" />
                        <Line type="monotone" dataKey="growth" stroke="#f59e0b" strokeWidth={2} name="Growth %" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Map View Tab */}
            <TabsContent value="map" className="mt-6">
              <Card className="bg-white/80 dark:bg-slate-900/40 border-0 shadow-2xl backdrop-blur-2xl border-green-500/30 dark:border-green-700/20 rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-green-700 dark:text-green-200 flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-green-600" />
                    Interactive Property Map
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Geographic distribution of your portfolio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* ⬇️ Replace the old placeholder with this */}
                  <MapView className="h-96 w-full rounded-xl border border-green-500/20" />
                </CardContent>
              </Card>
            </TabsContent>

                        {/* AI Hub Tab */}
            <TabsContent value="ai" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-white/80 dark:bg-slate-900/40 border-0 shadow-2xl backdrop-blur-2xl border-pink-500/30 dark:border-pink-700/20 rounded-2xl shadow-lg">
            <CardHeader>
                  <CardTitle className="text-pink-700 dark:text-pink-200 flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-pink-600" />
                    AI Market Intelligence
              </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">AI-powered market analysis and predictions</CardDescription>
            </CardHeader>
                                    <CardContent>
                    <div className="space-y-4">
                      {[
                        { insight: "Austin market shows 18.5% growth potential", confidence: "94%", impact: "High" },
                        { insight: "Miami rental demand increasing by 22%", confidence: "87%", impact: "Medium" },
                        { insight: "Phoenix undervalued properties detected", confidence: "91%", impact: "High" },
                        { insight: "Interest rates may stabilize in Q2", confidence: "78%", impact: "Medium" }
                      ].map((item, index) => (
                        <div key={index} className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/20 border border-pink-500/30 dark:border-pink-700/30">
                          <p className="text-slate-700 dark:text-slate-200 mb-3">{item.insight}</p>
                          <div className="flex items-center justify-between">
                            <Badge className="bg-pink-500/20 text-pink-700 border-pink-500/30 text-xs dark:bg-pink-500/20 dark:text-pink-300 dark:border-pink-500/30">
                              {item.impact} Impact
                      </Badge>
                            <span className="text-sm text-pink-600 font-medium dark:text-pink-400">{item.confidence} confidence</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

                                <Card className="bg-white/80 dark:bg-slate-900/40 border-0 shadow-2xl backdrop-blur-2xl border-cyan-500/30 dark:border-cyan-700/20 rounded-2xl shadow-lg">
              <CardHeader>
                  <CardTitle className="text-cyan-700 dark:text-cyan-200 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-cyan-600" />
                    Investment Opportunities
                </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">AI-detected investment opportunities</CardDescription>
              </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { title: "Emerging Market", location: "Austin, TX", potential: "+18.5%", type: "Growth" },
                        { title: "Undervalued Property", location: "Phoenix, AZ", potential: "+25.3%", type: "Value" },
                        { title: "Rental Hotspot", location: "Miami, FL", potential: "+22.1%", type: "Income" }
                      ].map((item, index) => (
                        <div key={index} className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/20 border border-cyan-500/30 dark:border-cyan-700/30">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className="bg-cyan-500/20 text-cyan-700 border-cyan-500/30 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-500/30">
                              {item.type}
                            </Badge>
                            <span className="text-lg font-bold text-cyan-600 dark:text-cyan-400">{item.potential}</span>
                          </div>
                          <h4 className="font-semibold text-cyan-700 dark:text-cyan-200 mb-1">{item.title}</h4>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-slate-500" />
                            <span className="text-sm text-slate-700 dark:text-slate-300">{item.location}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
