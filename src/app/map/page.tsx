"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Property } from "@/types/property";
import { useUserPreferences } from "@/store/useUserPreferences";
import { applyFiltersAndSort } from "@/lib/filters";
import PreferencesPanel from "@/components/PreferencesPanel";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Dynamic import to avoid SSR issues with Leaflet
const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => <div className="h-full bg-muted animate-pulse rounded-lg" />,
});

export default function MapPage() {
  const [deals, setDeals] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const preferences = useUserPreferences();

  // Apply filters to deals
  const filteredDeals = useMemo(() => {
    return applyFiltersAndSort(deals, preferences, 'score');
  }, [deals, preferences]);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await fetch('/api/deals');
        if (response.ok) {
          const data = await response.json();
          setDeals(data.deals || []);
        }
      } catch (error) {
        console.error('Failed to fetch deals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeals();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen bg-muted animate-pulse">
        <div className="flex items-center justify-center h-full">
          <p>Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen">
      {/* Map Container */}
      <div className="h-full">
        <MapView initialDeals={filteredDeals} />
      </div>

      {/* Filters Button - Fixed Position */}
      <div className="absolute top-4 right-4 z-[1000]">
        <Sheet open={showFilters} onOpenChange={setShowFilters}>
          <SheetTrigger asChild>
            <Button variant="secondary" size="sm" className="shadow-lg">
              <Settings className="h-4 w-4 mr-2" />
              Filters
              {filteredDeals.length !== deals.length && (
                <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                  {filteredDeals.length}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Properties</SheetTitle>
              <SheetDescription>
                Customize your search criteria to find the perfect investment opportunities.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <PreferencesPanel />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Results Counter */}
      <div className="absolute bottom-4 left-4 z-[1000]">
        <div className="bg-background/90 backdrop-blur-sm border rounded-lg px-3 py-2 shadow-lg">
          <p className="text-sm font-medium">
            {filteredDeals.length} of {deals.length} properties shown
          </p>
        </div>
      </div>
    </div>
  );
}
