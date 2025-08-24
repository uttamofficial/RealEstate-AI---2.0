"use client";

import { Skeleton } from "./ui/skeleton";
import { Property } from "@/types/property";
import { DealCard } from "./DealCard";
import { useEffect, useState, useMemo } from "react";
import { useUserPreferences } from "@/store/useUserPreferences";
import { applyFiltersAndSort } from "@/lib/filters";

interface TopDealsProps {
  deals?: Property[];
  loading?: boolean;
  maxDeals?: number;
}

export function TopDeals({ deals: propDeals, loading: propLoading, maxDeals = 6 }: TopDealsProps) {
  const [allDeals, setAllDeals] = useState<Property[]>(propDeals || []);
  const [isLoading, setIsLoading] = useState(propLoading ?? true);
  
  // Get preferences from the store
  const preferences = useUserPreferences();

  // Apply filters and get top deals
  const topDeals = useMemo(() => {
    const filtered = applyFiltersAndSort(allDeals, preferences, 'score');
    return filtered.slice(0, maxDeals);
  }, [allDeals, preferences, maxDeals]);

  useEffect(() => {
    // Fetch deals from API if not provided
    if (!propDeals) {
      const fetchDeals = async () => {
        try {
          const response = await fetch('/api/deals?sort=score');
          
          if (!response.ok) {
            throw new Error('Failed to fetch deals');
          }
          
          const data = await response.json();
          setAllDeals(data.deals);
        } catch (error) {
          console.error('Error fetching deals:', error);
          setAllDeals([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchDeals();
    } else {
      setAllDeals(propDeals);
      setIsLoading(propLoading ?? false);
    }
  }, [propDeals, propLoading]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(maxDeals)].map((_, i) => (
          <Skeleton key={i} className="h-[400px] w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!topDeals.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No deals match your filters</h3>
        <p className="text-muted-foreground mt-2">
          Try adjusting your preferences or check back later for new opportunities.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">
          Top Deals
          {allDeals.length > 0 && topDeals.length !== allDeals.length && (
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({topDeals.length} of {allDeals.length})
            </span>
          )}
        </h2>
        <button className="text-sm font-medium text-primary hover:underline">
          View all
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topDeals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </div>
  );
}
