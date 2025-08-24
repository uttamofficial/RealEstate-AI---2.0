import { NextRequest, NextResponse } from 'next/server';
import { ScrapingService } from '@/lib/scraping-service';

// Cache for storing recent scraping results
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function POST(request: NextRequest) {
  try {
    const { location, propertyType, filters } = await request.json();
    
    if (!location) {
      return NextResponse.json(
        { error: 'Location is required' },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = `${location}-${propertyType}-${JSON.stringify(filters)}`;
    const cachedResult = cache.get(cacheKey);
    
    if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        ...cachedResult.data,
        cached: true,
        cacheAge: Date.now() - cachedResult.timestamp
      });
    }

    // Perform scraping
    const result = await ScrapingService.scrapeRealEstateData(location, propertyType);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Scraping failed' },
        { status: 500 }
      );
    }

    // Cache the result
    cache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    // Clean up old cache entries
    if (cache.size > 100) {
      const now = Date.now();
      for (const [key, value] of cache.entries()) {
        if (now - value.timestamp > CACHE_DURATION) {
          cache.delete(key);
        }
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Scraping API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const filters = searchParams.get('filters');
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // Check cache for search results
    const cacheKey = `search-${query}-${filters || 'no-filters'}`;
    const cachedResult = cache.get(cacheKey);
    
    if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        ...cachedResult.data,
        cached: true,
        cacheAge: Date.now() - cachedResult.timestamp
      });
    }

    const parsedFilters = filters ? JSON.parse(filters) : {};
    const result = await ScrapingService.searchProperties(query, parsedFilters);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Search failed' },
        { status: 500 }
      );
    }

    // Cache search results
    cache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
