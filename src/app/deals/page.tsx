'use client';

import { useState, useEffect, useMemo } from 'react';
import { DealTable } from '@/components/DealTable';
import { DealCard } from '@/components/DealCard';
import { Property } from '@/types/property';
import { useUserPreferences } from '@/store/useUserPreferences';
import { applyFiltersAndSort } from '@/lib/filters';
import PreferencesPanel from '@/components/PreferencesPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Grid3X3, 
  List, 
  Search, 
  Filter, 
  TrendingUp, 
  MapPin,
  BarChart3,
  RefreshCw,
  SortAsc,
  SortDesc
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export default function DealsPage() {
  const [allDeals, setAllDeals] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'price' | 'capRate' | 'discount'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  
  // Get preferences from the store
  const preferences = useUserPreferences();

  // Helper function for profitability score - moved to top
  const calculateProfitabilityScore = (deal: Property): number => {
    const capRateScore = (deal.capRate || 0) * 5;
    const discountScore = (deal.discountPct || 0) * 2;
    const riskPenalty = deal.risk === 'high' ? -20 : deal.risk === 'medium' ? -10 : 0;
    let score = Math.min(100, Math.max(0, 50 + capRateScore + discountScore + riskPenalty));
    return Math.round(score * 10) / 10;
  };

  // Apply filters and sorting to deals
  const filteredDeals = useMemo(() => {
    let deals = applyFiltersAndSort(allDeals, preferences, sortBy);
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      deals = deals.filter(deal => 
        deal.title?.toLowerCase().includes(query) ||
        deal.company?.toLowerCase().includes(query) ||
        deal.city?.toLowerCase().includes(query) ||
        deal.address?.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    deals.sort((a, b) => {
      let aValue: number | string | undefined;
      let bValue: number | string | undefined;
      
      switch (sortBy) {
        case 'score':
          aValue = calculateProfitabilityScore(a);
          bValue = calculateProfitabilityScore(b);
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'capRate':
          aValue = a.capRate || 0;
          bValue = b.capRate || 0;
          break;
        case 'discount':
          aValue = a.discountPct || 0;
          bValue = b.discountPct || 0;
          break;
        default:
          return 0;
      }
      
      if (aValue === undefined || bValue === undefined) return 0;
      
      const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return deals;
  }, [allDeals, preferences, searchQuery, sortBy, sortOrder, calculateProfitabilityScore]);

  // Calculate summary stats
  const dealStats = useMemo(() => {
    const totalValue = filteredDeals.reduce((sum, deal) => sum + deal.price, 0);
    const avgCapRate = filteredDeals.reduce((sum, deal) => sum + (deal.capRate || 0), 0) / (filteredDeals.length || 1);
    const highScoreDeals = filteredDeals.filter(deal => calculateProfitabilityScore(deal) >= 80).length;
    
    return {
      total: filteredDeals.length,
      totalValue,
      avgCapRate,
      highScoreDeals
    };
  }, [filteredDeals, calculateProfitabilityScore]);

  // Fetch deals from API
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/deals?sort=score');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch deals: ${response.statusText}`);
        }
        
        const data = await response.json();
        setAllDeals(data.deals);
      } catch (err) {
        console.error('Failed to fetch deals:', err);
        setError('Failed to load deals. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeals();
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-[#000000] dark:via-[#0f0f23] dark:to-[#1a1a3f]">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-600 bg-clip-text text-transparent mb-2">
                Deal Pipeline
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Browse and manage your real estate investment opportunities
              </p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 dark:border-slate-700/50 shadow-lg">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Total Deals</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{dealStats.total}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 dark:border-slate-700/50 shadow-lg">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Avg Cap Rate</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{dealStats.avgCapRate.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 dark:border-slate-700/50 shadow-lg">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">High Score</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{dealStats.highScoreDeals}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 dark:border-slate-700/50 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="h-5 w-5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"></div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Total Value</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">₹{(dealStats.totalValue / 10000000).toFixed(1)}Cr</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="mb-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-white/50 dark:border-slate-700/50 shadow-lg p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search and Filter Toggle */}
            <div className="flex flex-1 gap-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:flex-initial lg:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search deals, companies, locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-lg border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "gap-2 transition-all duration-300 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700",
                  showFilters ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-400" : ""
                )}
              >
                <Filter className="h-4 w-4" />
                Filters
                {Object.keys(preferences).some(key => {
                  const pref = preferences[key as keyof typeof preferences];
                  return Array.isArray(pref) ? pref.length > 0 : pref !== undefined;
                }) && (
                  <Badge variant="secondary" className="ml-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300">
                    Active
                  </Badge>
                )}
              </Button>
            </div>

            {/* Sort and View Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</label>
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-32 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
                    <SelectItem value="score" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700">Score</SelectItem>
                    <SelectItem value="price" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700">Price</SelectItem>
                    <SelectItem value="capRate" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700">Cap Rate</SelectItem>
                    <SelectItem value="discount" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700">Discount</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="h-9 w-9 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700"
                >
                  {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </div>

              <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 px-3"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="h-8 px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                className="h-9 w-9 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-white/50 dark:border-slate-700/50 shadow-lg overflow-hidden">
                <PreferencesPanel 
                  totalDeals={allDeals.length}
                  filteredDeals={filteredDeals.length}
                />
              </div>
            </div>
          )}
          
          {/* Main Content */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center items-center h-64 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-white/50 dark:border-slate-700/50 shadow-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-300">Loading deals...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-white/50 dark:border-slate-700/50 shadow-lg">
                <div className="text-red-600 dark:text-red-400 mb-4">
                  <p className="text-lg font-semibold">Error loading deals</p>
                  <p className="text-sm">{error}</p>
                </div>
                <Button variant="outline" onClick={handleRefresh} className="gap-2 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700">
                  <RefreshCw className="h-4 w-4" />
                  Retry
                </Button>
              </div>
            ) : (
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-white/50 dark:border-slate-700/50 shadow-lg overflow-hidden">
                {viewMode === 'grid' ? (
                  <div className="p-6">
                    {filteredDeals.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-gray-400 dark:text-gray-500 mb-4">
                          <BarChart3 className="h-12 w-12 mx-auto" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No deals found</h3>
                        <p className="text-gray-600 dark:text-gray-300">Try adjusting your filters or search terms.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredDeals.map((deal) => (
                          <DealCard key={deal.id} deal={deal} />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <DealTable 
                    deals={filteredDeals} 
                    isLoading={false}
                    error={null}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
