'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPreferences, DEFAULT_PREFERENCES, MapViewport } from '@/types/map';
import { Property } from '@/types/property';

// Dynamically import the MapView component with no SSR
const MapView = dynamic(
  () => import('@/components/MapView'),
  { ssr: false, loading: () => <div>Loading map...</div> }
);

export default function TestMapPage() {
  const [mapViewport, setMapViewport] = useState<MapViewport>({
    center: [40.7128, -74.0060],  // Default to New York
    zoom: 12,
  });
  
  const [mapPreferences, setMapPreferences] = useState<MapPreferences>(DEFAULT_PREFERENCES);

  // Sample property data with required fields
  const sampleProperties: Property[] = [
    {
      id: '1',
      title: 'Luxury Downtown Apartment',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      price: 1000000,
      bedrooms: 3,
      bathrooms: 2,
      sqft: 2000,
      yearBuilt: 1990,
      lat: 40.7128,
      lng: -74.0060,
      description: 'Beautiful property in downtown',
      imageUrl: 'https://via.placeholder.com/300x200',
      risk: 'medium',
      category: 'mispriced',
      capRate: 5.5,
      marketCapRate: 6.0,
      aiEstimatedValue: 1200000,
      discountPct: 16.67
    },
    {
      id: '2',
      title: 'Modern Park Avenue Residence',
      address: '456 Park Ave',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      price: 1500000,
      bedrooms: 4,
      bathrooms: 3,
      sqft: 3000,
      yearBuilt: 2005,
      lat: 40.7245,
      lng: -73.9979,
      description: 'Luxury apartment with great views',
      imageUrl: 'https://via.placeholder.com/300x200',
      risk: 'low',
      category: 'cap_rate_arbitrage',
      capRate: 6.2,
      marketCapRate: 5.8,
      aiEstimatedValue: 1450000,
      discountPct: 3.45
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Property Map</h1>
      <div className="h-[600px] w-full rounded-lg overflow-hidden border border-gray-200">
        <MapView 
          initialDeals={sampleProperties}
          initialPreferences={{
            ...mapPreferences,
            ...mapViewport
          }}
        />
      </div>
    </div>
  );
}
