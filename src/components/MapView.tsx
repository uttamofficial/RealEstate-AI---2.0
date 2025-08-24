'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from './ui/skeleton';
import { useMapState } from '@/hooks/useMapState';
import ErrorBoundary from './ErrorBoundary';
import { useEffect, useState, useMemo } from 'react';
import { MapPreferences, MapViewport, DEFAULT_PREFERENCES } from '@/types/map';
import { Property } from '@/types/property';
import { Button } from './ui/button';
import { RefreshCw } from 'lucide-react';

// Import DealsMap type for type safety
type DealsMapProps = {
  deals: Property[];
  preferences: MapPreferences & {
    center?: [number, number];
    zoom?: number;
  };
  onPreferencesChange?: (prefs: MapPreferences) => void;
  className?: string;
};

// Dynamically import the DealsMap component with no SSR
const DealsMap = dynamic<DealsMapProps>(
  () => import('@/components/DealsMap') as Promise<{
    default: React.ComponentType<DealsMapProps>;
  }>,
  { 
    ssr: false,
    loading: () => <MapLoadingState />
  }
);

// Loading state component
function MapLoadingState() {
  return (
    <div className="w-full h-full bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading map...</p>
      </div>
    </div>
  );
}

// Error state component
function MapErrorState({ 
  error, 
  onRetry 
}: { 
  error?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="w-full h-full bg-red-50 rounded-lg overflow-hidden p-4 flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="text-red-500 font-medium text-lg mb-2">Error loading map</div>
        {error && <div className="text-sm text-red-600 mb-4">{error}</div>}
        {onRetry && (
          <Button 
            onClick={onRetry}
            variant="outline"
            className="flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}

interface MapViewProps {
  initialDeals?: Property[];
  initialPreferences?: Partial<MapPreferences> & Partial<MapViewport>;
  className?: string;
  onPreferencesChange?: (prefs: MapPreferences) => void;
}

export default function MapView({ 
  initialDeals = [], 
  initialPreferences,
  className = '',
  onPreferencesChange
}: MapViewProps) {
  // Separate viewport and preferences
  const { 
    preferences, 
    setPreferences, 
    filteredDeals: deals = [], 
    isLoading,
    error
  } = useMapState({
    initialDeals: initialDeals || [],
    initialPreferences: {
      ...DEFAULT_PREFERENCES,
      ...initialPreferences
    }
  });
  
  // Extract viewport from preferences
  const viewport = useMemo<MapViewport>(() => ({
    center: initialPreferences?.center || [0, 0],
    zoom: initialPreferences?.zoom || 12
  }), [initialPreferences]);
  const [retryCount, setRetryCount] = useState(0);

  // Update deals when initialDeals changes
  useEffect(() => {
    // The useMapState hook should handle initialDeals internally
    // We'll rely on the hook to manage the deals state
  }, [initialDeals]);

  // Update preferences when initialPreferences changes
  useEffect(() => {
    if (initialPreferences) {
      setPreferences(prev => ({
        ...prev,
        ...initialPreferences
      }));
    }
  }, [initialPreferences, setPreferences]);

  const handlePreferencesChange = (newPrefs: MapPreferences) => {
    setPreferences(newPrefs);
    if (onPreferencesChange) {
      onPreferencesChange(newPrefs);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  // Combine viewport and preferences for the map
  const mapPreferences = useMemo(() => ({
    ...preferences,
    ...viewport
  }), [preferences, viewport]);

  if (isLoading && retryCount === 0) {
    return <MapLoadingState />;
  }

  if (error) {
    return <MapErrorState error={error} onRetry={handleRetry} />;
  }

  const mapKey = `map-${retryCount}`; // Force remount on retry

  return (
    <ErrorBoundary 
      key={mapKey}
      fallback={
        <MapErrorState 
          error="Something went wrong with the map" 
          onRetry={handleRetry} 
        />
      }
    >
      <div className={`w-full h-full ${className}`}>
        <DealsMap 
          deals={deals} 
          preferences={mapPreferences} 
          onPreferencesChange={handlePreferencesChange}
          className={className}
        />
      </div>
    </ErrorBoundary>
  );
}
