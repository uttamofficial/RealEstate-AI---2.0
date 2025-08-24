"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Filter, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Zap, 
  X,
  Lightbulb,
  Settings,
  Search,
  BarChart3,
  AlertCircle,
  Star
} from "lucide-react";

interface FilterState {
  priceRange: [number, number];
  roi: [number, number];
  score: [number, number];
  propertyType: string[];
  location: string[];
  dealCategory: string[];
  bedrooms: number[];
  bathrooms: number[];
  squareFootage: [number, number];
  yearBuilt: [number, number];
}

interface FilterPreset {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  filters: Partial<FilterState>;
  aiScore: number;
}

const AI_PRESETS: FilterPreset[] = [
  {
    id: "hyper-deals",
    name: "🔥 Hyper Deals",
    description: "AI-detected undervalued properties with 90%+ profit potential",
    icon: <Zap className="w-4 h-4" />,
    filters: {
      score: [85, 100],
      roi: [15, 50],
      dealCategory: ["Flip", "Rental"]
    },
    aiScore: 95
  },
  {
    id: "steady-rentals",
    name: "📈 Steady Rentals",
    description: "Long-term rental properties with stable cash flow",
    icon: <TrendingUp className="w-4 h-4" />,
    filters: {
      score: [70, 90],
      roi: [8, 15],
      dealCategory: ["Rental"]
    },
    aiScore: 88
  },
  {
    id: "fixer-uppers",
    name: "🔨 Fixer Uppers",
    description: "High-value-add opportunities for renovation projects",
    icon: <Target className="w-4 h-4" />,
    filters: {
      score: [75, 95],
      roi: [20, 40],
      dealCategory: ["Flip"]
    },
    aiScore: 92
  }
];

const MARKET_INSIGHTS = [
  {
    id: "market-trend",
    title: "Market Trend Analysis",
    description: "AI predicts 15% price increase in Austin over next 12 months",
    icon: <TrendingUp className="w-4 h-4 text-green-400" />,
    confidence: 87,
    type: "positive"
  },
  {
    id: "opportunity-alert",
    title: "Opportunity Alert",
    description: "3 undervalued properties detected in Phoenix market",
    icon: <AlertCircle className="w-4 h-4 text-yellow-400" />,
    confidence: 92,
    type: "warning"
  },
  {
    id: "risk-assessment",
    title: "Risk Assessment",
    description: "Miami market shows increased volatility - proceed with caution",
    icon: <AlertCircle className="w-4 h-4 text-red-400" />,
    confidence: 78,
    type: "negative"
  }
];

export default function AdvancedFilters() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [100000, 1000000],
    roi: [5, 25],
    score: [60, 100],
    propertyType: [],
    location: [],
    dealCategory: [],
    bedrooms: [],
    bathrooms: [],
    squareFootage: [500, 5000],
    yearBuilt: [1950, 2024]
  });

  const handlePriceRangeChange = useCallback((value: number[]) => {
    setFilters(prev => ({ ...prev, priceRange: value as [number, number] }));
  }, []);

  const handleRoiChange = useCallback((value: number[]) => {
    setFilters(prev => ({ ...prev, roi: value as [number, number] }));
  }, []);

  const handleScoreChange = useCallback((value: number[]) => {
    setFilters(prev => ({ ...prev, score: value as [number, number] }));
  }, []);

  const handleSquareFootageChange = useCallback((value: number[]) => {
    setFilters(prev => ({ ...prev, squareFootage: value as [number, number] }));
  }, []);

  const handleYearBuiltChange = useCallback((value: number[]) => {
    setFilters(prev => ({ ...prev, yearBuilt: value as [number, number] }));
  }, []);

  const handlePresetSelect = (preset: FilterPreset) => {
    setActivePreset(preset.id);
    setFilters(prev => ({ ...prev, ...preset.filters }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [100000, 1000000],
      roi: [5, 25],
      score: [60, 100],
      propertyType: [],
      location: [],
      dealCategory: [],
      bedrooms: [],
      bathrooms: [],
      squareFootage: [500, 5000],
      yearBuilt: [1950, 2024]
    });
    setActivePreset(null);
  };

  return (
    <div className="relative">
      {/* Main Filter Bar */}
      <motion.div
        className="backdrop-blur-md bg-gradient-to-r from-slate-900/80 via-blue-900/60 to-indigo-900/80 rounded-2xl border border-slate-700/50 shadow-2xl"
        style={{
          boxShadow: "0 0 40px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
        }}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-700/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                <Filter className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Advanced Filters</h3>
                <p className="text-xs text-slate-300">AI-Powered Property Discovery</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-slate-300 hover:text-white hover:bg-slate-700/50 text-xs h-7 px-2"
              >
                Clear All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-slate-300 hover:text-white hover:bg-slate-700/50 h-7 w-7 p-0"
              >
                {isExpanded ? <X className="w-3 h-3" /> : <Settings className="w-3 h-3" />}
              </Button>
            </div>
          </div>
        </div>

        {/* AI Presets */}
        <div className="p-4 border-b border-slate-700/30">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <h4 className="font-semibold text-white text-sm">AI-Suggested Presets</h4>
            <Badge variant="secondary" className="bg-gradient-to-r from-cyan-400/20 to-blue-500/20 text-cyan-300 border-cyan-400/30 text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              Smart
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {AI_PRESETS.map((preset) => (
              <motion.div
                key={preset.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  activePreset === preset.id
                    ? 'border-cyan-400/50 bg-cyan-400/10 shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                    : 'border-slate-600/50 bg-slate-800/30 hover:border-slate-500/50'
                }`}
                onClick={() => handlePresetSelect(preset)}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-1">
                    {preset.icon}
                    <span className="font-semibold text-white text-xs">{preset.name}</span>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${
                      preset.aiScore >= 90 ? 'bg-green-500/20 text-green-300 border-green-400/30' :
                      preset.aiScore >= 80 ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30' :
                      'bg-blue-500/20 text-blue-300 border-blue-400/30'
                    }`}
                  >
                    {preset.aiScore}%
                  </Badge>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{preset.description}</p>
                
                {/* Holographic Effect */}
                {activePreset === preset.id && (
                  <motion.div
                    className="absolute inset-0 rounded-lg border border-cyan-400/30"
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(34,211,238,0.3)",
                        "0 0 40px rgba(34,211,238,0.5)",
                        "0 0 20px rgba(34,211,238,0.3)"
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Market Insights */}
        <div className="p-4 border-b border-slate-700/30">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <h4 className="font-semibold text-white text-sm">AI Market Insights</h4>
            <Badge variant="secondary" className="bg-gradient-to-r from-blue-400/20 to-purple-500/20 text-blue-300 border-blue-400/30 text-xs">
              <Star className="w-3 h-3 mr-1" />
              Live
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {MARKET_INSIGHTS.map((insight) => (
              <motion.div
                key={insight.id}
                whileHover={{ scale: 1.02 }}
                className={`p-2 rounded-lg border border-slate-600/50 bg-slate-800/20 ${
                  insight.type === 'positive' ? 'border-green-500/30' :
                  insight.type === 'warning' ? 'border-yellow-500/30' :
                  'border-red-500/30'
                }`}
              >
                <div className="flex items-start gap-2 mb-1">
                  {insight.icon}
                  <div className="flex-1">
                    <h5 className="text-xs font-medium text-white mb-1">{insight.title}</h5>
                    <p className="text-xs text-slate-300 leading-relaxed">{insight.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Confidence</span>
                  <Badge variant="outline" className="text-xs">
                    {insight.confidence}%
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Search & Location */}
        <div className="p-4 border-b border-slate-700/30">
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-4 h-4 text-cyan-400" />
            <h4 className="font-semibold text-white text-sm">Quick Search & Location</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs font-medium text-white">Search Properties</label>
              <Input 
                placeholder="Enter keywords, addresses, or MLS numbers..."
                className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 h-8 text-xs"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-white">Target Markets</label>
              <Select>
                <SelectTrigger className="bg-slate-800/50 border-slate-600/50 text-white h-8 text-xs">
                  <SelectValue placeholder="Select markets" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="austin">Austin, TX</SelectItem>
                  <SelectItem value="miami">Miami, FL</SelectItem>
                  <SelectItem value="denver">Denver, CO</SelectItem>
                  <SelectItem value="phoenix">Phoenix, AZ</SelectItem>
                  <SelectItem value="atlanta">Atlanta, GA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Expandable Advanced Filters */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-4">
                {/* Price Range */}
                <div>
                  <label className="block text-xs font-medium text-white mb-2">
                    Price Range: ${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()}
                  </label>
                  <Slider
                    value={filters.priceRange}
                    onValueChange={handlePriceRangeChange}
                    max={2000000}
                    min={50000}
                    step={10000}
                    className="w-full"
                  />
                </div>

                {/* ROI Range */}
                <div>
                  <label className="block text-xs font-medium text-white mb-2">
                    ROI Range: {filters.roi[0]}% - {filters.roi[1]}%
                  </label>
                  <Slider
                    value={filters.roi}
                    onValueChange={handleRoiChange}
                    max={50}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Score Range */}
                <div>
                  <label className="block text-xs font-medium text-white mb-2">
                    AI Score: {filters.score[0]} - {filters.score[1]}
                  </label>
                  <Slider
                    value={filters.score}
                    onValueChange={handleScoreChange}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* Property Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-white mb-2">
                      Square Footage: {filters.squareFootage[0]} - {filters.squareFootage[1]} sq ft
                    </label>
                    <Slider
                      value={filters.squareFootage}
                      onValueChange={handleSquareFootageChange}
                      max={10000}
                      min={100}
                      step={100}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white mb-2">
                      Year Built: {filters.yearBuilt[0]} - {filters.yearBuilt[1]}
                    </label>
                    <Slider
                      value={filters.yearBuilt}
                      onValueChange={handleYearBuiltChange}
                      max={2024}
                      min={1900}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Property Type & Deal Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-white">Property Type</label>
                    <div className="flex flex-wrap gap-1">
                      {['Single Family', 'Condo', 'Townhouse', 'Multi-Family', 'Land'].map((type) => (
                        <Button
                          key={type}
                          variant="outline"
                          size="sm"
                          className={`text-xs h-6 px-2 ${
                            filters.propertyType.includes(type)
                              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                              : 'border-slate-600 text-slate-300 hover:border-slate-500'
                          }`}
                          onClick={() => {
                            const newTypes = filters.propertyType.includes(type)
                              ? filters.propertyType.filter(t => t !== type)
                              : [...filters.propertyType, type];
                            setFilters(prev => ({ ...prev, propertyType: newTypes }));
                          }}
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-white">Deal Category</label>
                    <div className="flex flex-wrap gap-1">
                      {['Flip', 'Rental', 'Buy & Hold', 'Wholesale', 'Development'].map((category) => (
                        <Button
                          key={category}
                          variant="outline"
                          size="sm"
                          className={`text-xs h-6 px-2 ${
                            filters.dealCategory.includes(category)
                              ? 'bg-green-500/20 border-green-400 text-green-300'
                              : 'border-slate-600 text-slate-300 hover:border-slate-500'
                          }`}
                          onClick={() => {
                            const newCategories = filters.dealCategory.includes(category)
                              ? filters.dealCategory.filter(c => c !== category)
                              : [...filters.dealCategory, category];
                            setFilters(prev => ({ ...prev, dealCategory: newCategories }));
                          }}
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
