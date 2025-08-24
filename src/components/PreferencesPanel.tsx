"use client";

import { useState, useCallback } from 'react';
import { Slider } from "./ui/slider";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { X } from "lucide-react";
import { 
  useUserPreferences,
  AVAILABLE_MARKETS,
  AVAILABLE_CATEGORIES,
  AVAILABLE_RISK_LEVELS 
} from "@/store/useUserPreferences";
import { getFilterSummary } from "@/lib/filters";

interface PreferencesPanelProps {
  className?: string;
  totalDeals?: number;
  filteredDeals?: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  'cap_rate_arbitrage': 'Cap Rate Arbitrage',
  'mispriced': 'Mispriced',
  'distressed': 'Distressed'
};

const RISK_LABELS: Record<string, string> = {
  'any': 'Any Risk',
  'low': 'Low Risk',
  'medium': 'Medium Risk',
  'high': 'High Risk'
};

export default function PreferencesPanel({ 
  className,
  totalDeals = 0,
  filteredDeals = 0
}: PreferencesPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  
  // Get preferences from Zustand store
  const {
    priceRange,
    minCapRate,
    riskLevel,
    categories,
    markets,
    minDiscountPct,
    setPriceRange,
    setMinCapRate,
    setRiskLevel,
    setCategories,
    setMarkets,
    setMinDiscountPct,
    resetPreferences,
  } = useUserPreferences();

  // Create preferences object for filter summary
  const prefsData = {
    priceRange,
    minCapRate,
    riskLevel,
    categories,
    markets,
    minDiscountPct,
  };

  // Handle price range change
  const handlePriceChange = useCallback((values: number[]) => {
    setPriceRange([values[0], values[1]] as [number, number]);
  }, [setPriceRange]);

  // Handle cap rate change
  const handleCapRateChange = useCallback((values: number[]) => {
    setMinCapRate(values[0]);
  }, [setMinCapRate]);

  // Handle discount percentage change
  const handleDiscountChange = useCallback((values: number[]) => {
    setMinDiscountPct(values[0] === 0 ? undefined : values[0]);
  }, [setMinDiscountPct]);

  // Handle category toggle
  const toggleCategory = useCallback((category: string) => {
    if (categories.includes(category as any)) {
      setCategories(categories.filter(c => c !== category));
    } else {
      setCategories([...categories, category as any]);
    }
  }, [categories, setCategories]);

  // Handle market toggle
  const toggleMarket = useCallback((market: string) => {
    if (markets.includes(market)) {
      setMarkets(markets.filter(m => m !== market));
    } else {
      setMarkets([...markets, market]);
    }
  }, [markets, setMarkets]);

  // Format price for display
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  // Get filter summary
  const filterSummary = getFilterSummary(prefsData, totalDeals, filteredDeals);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Filters</CardTitle>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetPreferences}
              className="text-xs"
            >
              Reset All
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? 'Hide' : 'Show'}
            </Button>
          </div>
        </div>
        {totalDeals > 0 && (
          <p className="text-xs text-muted-foreground">{filterSummary}</p>
        )}
      </CardHeader>
      
      <CardContent className={`space-y-6 ${!isOpen ? 'hidden md:block' : ''}`}>
        {/* Price Range */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium">Price Range</label>
            <span className="text-sm text-muted-foreground">
              {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
            </span>
          </div>
          <Slider
            min={0}
            max={200000000} // 20 crores
            step={1000000}  // 10 lakhs
            value={priceRange}
            onValueChange={handlePriceChange}
            minStepsBetweenThumbs={1}
            className="w-full"
          />
        </div>

        {/* Minimum Cap Rate */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium">Min Cap Rate</label>
            <span className="text-sm text-muted-foreground">
              {minCapRate === 0 ? 'Any' : `${minCapRate}%`}
            </span>
          </div>
          <Slider
            min={0}
            max={20}
            step={0.5}
            value={[minCapRate]}
            onValueChange={handleCapRateChange}
            className="w-full"
          />
        </div>

        {/* Minimum Discount Percentage */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium">Min Discount</label>
            <span className="text-sm text-muted-foreground">
              {(minDiscountPct || 0) === 0 ? 'Any' : `${minDiscountPct}%`}
            </span>
          </div>
          <Slider
            min={0}
            max={50}
            step={1}
            value={[minDiscountPct || 0]}
            onValueChange={handleDiscountChange}
            className="w-full"
          />
        </div>

        {/* Risk Level */}
        <div>
          <label className="text-sm font-medium block mb-3">Risk Level</label>
          <RadioGroup 
            value={riskLevel} 
            onValueChange={(value) => setRiskLevel(value as any)}
            className="grid grid-cols-2 gap-2"
          >
            {AVAILABLE_RISK_LEVELS.map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <RadioGroupItem value={level} id={`risk-${level}`} />
                <Label htmlFor={`risk-${level}`} className="text-sm">
                  {RISK_LABELS[level]}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Categories */}
        <div>
          <label className="text-sm font-medium block mb-3">Property Types</label>
          <div className="space-y-2">
            {AVAILABLE_CATEGORIES.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`cat-${category}`}
                  checked={categories.includes(category)}
                  onCheckedChange={() => toggleCategory(category)}
                />
                <Label htmlFor={`cat-${category}`} className="text-sm">
                  {CATEGORY_LABELS[category]}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Markets */}
        <div>
          <label className="text-sm font-medium block mb-3">Markets</label>
          
          {/* Selected markets */}
          {markets.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {markets.map((market) => (
                <Badge key={market} variant="secondary" className="text-xs">
                  {market}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1 hover:bg-transparent"
                    onClick={() => toggleMarket(market)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
          
          {/* Available markets */}
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {AVAILABLE_MARKETS.map((market) => (
              <div key={market} className="flex items-center space-x-2">
                <Checkbox
                  id={`market-${market}`}
                  checked={markets.includes(market)}
                  onCheckedChange={() => toggleMarket(market)}
                />
                <Label htmlFor={`market-${market}`} className="text-sm">
                  {market}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="pt-2 space-y-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={resetPreferences}
            className="w-full"
          >
            Reset to Defaults
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
