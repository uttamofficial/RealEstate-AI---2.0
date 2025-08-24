"use client"

import { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Home, DollarSign, Calendar, ExternalLink, Loader2 } from 'lucide-react';
import { ScrapedProperty } from '@/lib/scraping-service';
import { GroqAIService } from '@/lib/groq-ai-service';

interface ScrapingResult {
  success: boolean;
  properties: ScrapedProperty[];
  error?: string;
  totalFound: number;
  cached?: boolean;
  cacheAge?: number;
}

export default function PropertyScraper() {
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ScrapingResult | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<ScrapedProperty | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Memoized search suggestions
  const searchSuggestions = useMemo(() => [
    'Austin, TX', 'Miami, FL', 'Denver, CO', 'Phoenix, AZ', 
    'Atlanta, GA', 'Charlotte, NC', 'Raleigh, NC', 'Nashville, TN'
  ], []);

  const handleSearch = useCallback(async () => {
    if (!location.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location, propertyType })
      });
      
      const data = await response.json();
      setResults(data);
      
      // Add to search history
      if (!searchHistory.includes(location)) {
        setSearchHistory(prev => [location, ...prev.slice(0, 4)]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults({ success: false, properties: [], error: 'Search failed', totalFound: 0 });
    } finally {
      setIsLoading(false);
    }
  }, [location, propertyType, searchHistory]);

  const handlePropertySelect = useCallback((property: ScrapedProperty) => {
    setSelectedProperty(property);
    setAiAnalysis(null);
  }, []);

  const analyzeProperty = useCallback(async (property: ScrapedProperty) => {
    setAnalyzing(true);
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'analyzeDeal',
          data: {
            description: property.description,
            location: property.location,
            price: property.price,
            type: property.propertyType
          }
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setAiAnalysis(data.data);
      }
    } catch (error) {
      console.error('AI analysis error:', error);
    } finally {
      setAnalyzing(false);
    }
  }, []);

  const handleQuickSearch = useCallback((suggestion: string) => {
    setLocation(suggestion);
    // Auto-search after setting location
    setTimeout(() => handleSearch(), 100);
  }, [handleSearch]);

  return (
    <div className="space-y-6">
      {/* Search Controls */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Property Scraper
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter location (e.g., Austin, TX)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="border-2 border-blue-200 focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="w-48 border-2 border-blue-200">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="single-family">Single Family</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={handleSearch} 
                disabled={isLoading || !location.trim()}
                className="bg-blue-600 hover:bg-blue-700 min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>

            {/* Quick Search Suggestions */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-slate-700 dark:text-slate-300 mr-2 font-medium">Quick search:</span>
              {searchSuggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickSearch(suggestion)}
                  className="text-xs h-8 px-3 border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  {suggestion}
                </Button>
              ))}
            </div>

            {/* Search History */}
            {searchHistory.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-slate-700 dark:text-slate-300 mr-2 font-medium">Recent:</span>
                {searchHistory.map((item) => (
                  <Button
                    key={item}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuickSearch(item)}
                    className="text-xs h-7 px-2 text-blue-700 hover:text-blue-800 hover:bg-blue-50"
                  >
                    {item}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold">
                Found {results.totalFound} properties
              </h3>
              {results.cached && (
                <Badge variant="secondary" className="text-xs">
                  Cached ({Math.round((results.cacheAge || 0) / 1000)}s ago)
                </Badge>
              )}
            </div>
            {results.error && (
              <Badge variant="destructive">{results.error}</Badge>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.properties.map((property) => (
              <Card 
                key={property.id} 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedProperty?.id === property.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                    : ''
                }`}
                onClick={() => handlePropertySelect(property)}
              >
                <CardContent className="p-4">
                  <div className="aspect-video mb-3 rounded-md overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    {property.images[0] && (
                      <img 
                        src={property.images[0]} 
                        alt={property.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </div>
                  
                  <h4 className="font-semibold text-sm mb-2 line-clamp-2">
                    {property.title}
                  </h4>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-green-700 font-semibold">
                      <DollarSign className="w-4 h-4" />
                      {property.price}
                    </div>
                    
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">{property.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Home className="w-4 h-4" />
                      <span>{property.propertyType}</span>
                    </div>
                    
                    {property.bedrooms && property.bathrooms && (
                      <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                        <span>{property.bedrooms} beds</span>
                        <span>{property.bathrooms} baths</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <Calendar className="w-3 h-3" />
                      <span>Scraped from {property.source}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Selected Property Details & AI Analysis */}
      {selectedProperty && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Property Analysis</span>
              <Button
                onClick={() => analyzeProperty(selectedProperty)}
                disabled={analyzing}
                variant="outline"
                size="sm"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'AI Analysis'
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Property Details */}
              <div>
                <h4 className="font-semibold mb-3">Property Details</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Title:</strong> {selectedProperty.title}</p>
                  <p><strong>Description:</strong> {selectedProperty.description}</p>
                  <p><strong>Price:</strong> {selectedProperty.price}</p>
                  <p><strong>Location:</strong> {selectedProperty.location}</p>
                  <p><strong>Type:</strong> {selectedProperty.propertyType}</p>
                  {selectedProperty.bedrooms && (
                    <p><strong>Bedrooms:</strong> {selectedProperty.bedrooms}</p>
                  )}
                  {selectedProperty.bathrooms && (
                    <p><strong>Bathrooms:</strong> {selectedProperty.bathrooms}</p>
                  )}
                  {selectedProperty.squareFootage && (
                    <p><strong>Square Footage:</strong> {selectedProperty.squareFootage} sq ft</p>
                  )}
                  <div className="pt-2">
                    <Button asChild variant="outline" size="sm">
                      <a href={selectedProperty.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View on {selectedProperty.source}
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

              {/* AI Analysis */}
              <div>
                <h4 className="font-semibold mb-3">AI Analysis</h4>
                {aiAnalysis ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant={aiAnalysis.riskLevel === 'low' ? 'default' : 
                                   aiAnalysis.riskLevel === 'medium' ? 'secondary' : 'destructive'}>
                        Risk: {aiAnalysis.riskLevel}
                      </Badge>
                      <Badge variant="outline">
                        Score: {aiAnalysis.score}/100
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <p><strong>ROI:</strong> {aiAnalysis.roi}%</p>
                      <p><strong>Profit Potential:</strong> {aiAnalysis.profitPotential}/100</p>
                      <p><strong>Market Trend:</strong> {aiAnalysis.marketTrend}</p>
                      <p><strong>Analysis:</strong> {aiAnalysis.analysis}</p>
                    </div>
                    
                    {aiAnalysis.recommendations && (
                      <div>
                        <strong>Recommendations:</strong>
                        <ul className="list-disc list-inside mt-1 text-sm">
                          {aiAnalysis.recommendations.map((rec: string, index: number) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <p>Click &quot;AI Analysis&quot; to get insights</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
