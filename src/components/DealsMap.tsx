'use client';

import dynamic from 'next/dynamic';
import { useMemo, useEffect, useState, useCallback } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { Property, DealCategory } from '@/types/property';
import { MapPreferences, DEFAULT_PREFERENCES } from '@/types/map';
import Link from 'next/link';
import { MapLegend } from './MapLegend';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Home, TrendingUp, DollarSign, MapPin, Eye, Star } from 'lucide-react';

// Import styles
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

// Import the markercluster plugin
import 'leaflet.markercluster';

// Extend Leaflet types for markercluster
declare module 'leaflet' {
  function markerClusterGroup(options?: any): any;
}

// Custom hook for marker clustering
function useMarkerCluster(deals: Property[], randomBuildings: any[]) {
  const map = useMap();
  
  useEffect(() => {
    if (!map || !(L as any).markerClusterGroup) return;
    
    // Create marker cluster group
    const markerClusterGroup = (L as any).markerClusterGroup({
      chunkedLoading: true,
      showCoverageOnHover: false,
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      zoomToBoundsOnClick: true,
      spiderfyDistanceMultiplier: 2,
      disableClusteringAtZoom: 15,
      animate: true,
      animateAddingMarkers: true,
      iconCreateFunction: (cluster: any) => {
        const count = cluster.getChildCount();
        const size = count < 10 ? 'small' : count < 100 ? 'medium' : 'large';
        return L.divIcon({
          html: `<div><span>${count}</span></div>`,
          className: `marker-cluster marker-cluster-${size}`,
          iconSize: L.point(40, 40)
        });
      }
    });
    
    // Add property markers
    deals.forEach((deal) => {
      const marker = L.marker([deal.lat, deal.lng], {
        icon: createPropertyIcon(deal)
      });
      
      // Create popup content
      const popupContent = document.createElement('div');
      popupContent.style.width = '288px'; // w-72
      popupContent.style.padding = '4px';
      
      // You can render React content here if needed
      popupContent.innerHTML = `
        <div style="margin-bottom: 12px;">
          ${deal.images?.[0] || deal.imageUrl ? `
            <img src="${deal.images?.[0] || deal.imageUrl}" 
                 alt="${deal.title}"
                 style="width: 100%; height: 128px; object-fit: cover; border-radius: 8px; margin-bottom: 12px;" />
          ` : ''}
          
          <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 8px;">
            <h3 style="font-weight: 600; font-size: 14px; color: #111827; line-height: 1.25;">
              ${deal.title || 'Investment Property'}
            </h3>
            <span style="font-size: 12px; padding: 2px 6px; border: 1px solid #d1d5db; border-radius: 4px; margin-left: 8px;">
              ${deal.risk} risk
            </span>
          </div>
          
          <div style="display: flex; align-items: center; font-size: 12px; color: #6b7280; margin-bottom: 8px;">
            📍 ${deal.address}, ${deal.city}, ${deal.country}
          </div>
          
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <div style="display: flex; align-items: center;">
              💰 <span style="font-weight: bold; font-size: 18px; color: #111827; margin-left: 4px;">
                ₹${formatPrice(deal.price)}
              </span>
            </div>
            ${deal.discountPct && deal.discountPct > 0 ? `
              <span style="font-size: 12px; padding: 2px 6px; background: #fef2f2; color: #991b1b; border-radius: 4px;">
                ${deal.discountPct.toFixed(1)}% off
              </span>
            ` : ''}
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
            ${deal.capRate ? `
              <div style="display: flex; align-items: center; font-size: 12px;">
                📈 <span style="color: #6b7280; margin-left: 4px;">Cap Rate:</span>
                <span style="font-weight: 500; margin-left: 4px; color: #059669;">${deal.capRate}%</span>
              </div>
            ` : ''}
            ${deal.bedrooms ? `
              <div style="display: flex; align-items: center; font-size: 12px;">
                🏠 <span style="color: #6b7280; margin-left: 4px;">${deal.bedrooms}BR/${deal.bathrooms}BA</span>
              </div>
            ` : ''}
          </div>
          
          <div style="display: flex; gap: 8px; padding-top: 8px; border-top: 1px solid #f3f4f6;">
            <button onclick="window.open('/deals/${deal.id}', '_blank')" 
                    style="flex: 1; padding: 6px 12px; background: #3b82f6; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">
              👁️ View Details
            </button>
            <button style="padding: 6px 12px; border: 1px solid #d1d5db; background: white; border-radius: 4px; font-size: 12px; cursor: pointer;">
              ⭐
            </button>
          </div>
        </div>
      `;
      
      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'property-popup',
        closeButton: true,
        autoClose: false,
        closeOnEscapeKey: true
      });
      
      markerClusterGroup.addLayer(marker);
    });
    
    // Add building markers (not clustered)
    randomBuildings.forEach((building) => {
      const marker = L.marker([building.lat, building.lng], {
        icon: createBuildingIcon(building),
        opacity: 0.6
      });
      
      const buildingPopup = `
        <div style="padding: 8px;">
          <h4 style="font-weight: 500; font-size: 14px; color: #374151; margin-bottom: 4px;">
            ${building.name}
          </h4>
          <div style="display: flex; align-items: center; font-size: 12px; color: #6b7280;">
            <span style="margin-right: 4px;">${building.icon}</span>
            <span style="text-transform: capitalize;">${building.type}</span>
          </div>
          <div style="font-size: 12px; color: #9ca3af; margin-top: 4px;">
            ${building.lat.toFixed(4)}, ${building.lng.toFixed(4)}
          </div>
        </div>
      `;
      
      marker.bindPopup(buildingPopup, { maxWidth: 200, className: 'building-popup' });
      marker.addTo(map);
    });
    
    // Add cluster group to map
    map.addLayer(markerClusterGroup);
    
    // Cleanup function
    return () => {
      map.removeLayer(markerClusterGroup);
      randomBuildings.forEach((building) => {
        // Remove building markers if they exist
        map.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            const pos = layer.getLatLng();
            if (pos.lat === building.lat && pos.lng === building.lng) {
              map.removeLayer(layer);
            }
          }
        });
      });
    };
  }, [map, deals, randomBuildings]);
  
  return null;
}

// Helper function to format price
function formatPrice(price: number) {
  if (price >= 10000000) return `${(price / 10000000).toFixed(1)}Cr`;
  if (price >= 100000) return `${(price / 100000).toFixed(1)}L`;
  return price.toLocaleString();
}

// Create random building markers for better map visualization
const generateRandomBuildings = (centerLat: number, centerLng: number, count: number = 50) => {
  const buildings = [];
  const buildingTypes = [
    { type: 'residential', color: '#94a3b8', icon: '🏠' },
    { type: 'commercial', color: '#64748b', icon: '🏢' },
    { type: 'apartment', color: '#475569', icon: '🏬' },
    { type: 'office', color: '#334155', icon: '🏗️' },
  ];

  for (let i = 0; i < count; i++) {
    // Generate random coordinates within ~10km radius
    const radius = 0.1; // Approximately 10km
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * radius;
    
    const lat = centerLat + (distance * Math.cos(angle));
    const lng = centerLng + (distance * Math.sin(angle));
    
    const buildingType = buildingTypes[Math.floor(Math.random() * buildingTypes.length)];
    
    buildings.push({
      id: `building-${i}`,
      lat,
      lng,
      type: buildingType.type,
      color: buildingType.color,
      icon: buildingType.icon,
      name: `${buildingType.type.charAt(0).toUpperCase() + buildingType.type.slice(1)} Building ${i + 1}`
    });
  }
  
  return buildings;
};

// Create custom building icon
const createBuildingIcon = (building: any) => {
  const svgIcon = `
    <svg width="14" height="18" viewBox="0 0 14 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 0c-3.85 0-7 3.15-7 7 0 7 7 11 7 11s7-4 7-11c0-3.85-3.15-7-7-7z" 
            fill="${building.color}" stroke="#fff" stroke-width="1" opacity="0.6"/>
      <circle cx="7" cy="7" r="3" fill="white" opacity="0.8"/>
      <rect x="5" y="5" width="4" height="4" fill="${building.color}" opacity="0.7" rx="0.5"/>
      <rect x="5.5" y="5.5" width="1" height="1" fill="white" opacity="0.9"/>
      <rect x="7.5" y="5.5" width="1" height="1" fill="white" opacity="0.9"/>
      <rect x="5.5" y="7.5" width="1" height="1" fill="white" opacity="0.9"/>
      <rect x="7.5" y="7.5" width="1" height="1" fill="white" opacity="0.9"/>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'custom-building-marker',
    iconSize: [14, 18],
    iconAnchor: [7, 18],
    popupAnchor: [0, -18]
  });
};

// Create custom property icons based on category and risk
const createPropertyIcon = (property: Property) => {
  const getColorByCategory = (category: DealCategory) => {
    switch (category) {
      case 'cap_rate_arbitrage': return '#10b981'; // Green
      case 'mispriced': return '#f59e0b'; // Orange  
      case 'distressed': return '#ef4444'; // Red
      default: return '#6366f1'; // Blue
    }
  };

  const getColorByRisk = (risk: string) => {
    switch (risk) {
      case 'low': return '#10b981'; // Green
      case 'medium': return '#f59e0b'; // Orange
      case 'high': return '#ef4444'; // Red
      default: return '#6366f1'; // Blue
    }
  };

  const color = getColorByCategory(property.category);
  const size: [number, number] = property.price > 50000000 ? [35, 45] : [25, 35]; // Larger icons for expensive properties

  const svgIcon = `
    <svg width="${size[0]}" height="${size[1]}" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0c-6.627 0-12 5.373-12 12 0 12 12 20 12 20s12-8 12-20c0-6.627-5.373-12-12-12z" 
            fill="${color}" stroke="#fff" stroke-width="2"/>
      <circle cx="12" cy="12" r="6" fill="white"/>
      <path d="M9 12l2 2 4-4" stroke="${color}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'custom-property-marker',
    iconSize: size,
    iconAnchor: [size[0] / 2, size[1]],
    popupAnchor: [0, -size[1]]
  });
};

// Enhanced popup content component
const PropertyPopup = ({ property }: { property: Property }) => {
  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
    return `₹${price.toLocaleString()}`;
  };

  const getCategoryLabel = (category: DealCategory) => {
    switch (category) {
      case 'cap_rate_arbitrage': return 'Cap Rate Arbitrage';
      case 'mispriced': return 'Mispriced';
      case 'distressed': return 'Distressed Sale';
      default: return 'Property';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="w-72 p-1">
      {/* Property Image */}
      {(property.images?.[0] || property.imageUrl) && (
        <img 
          src={property.images?.[0] || property.imageUrl} 
          alt={property.title}
          className="w-full h-32 object-cover rounded-lg mb-3"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      )}
      
      {/* Property Details */}
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">
            {property.title || 'Investment Property'}
          </h3>
          <Badge variant="outline" className={`text-xs ml-2 ${getRiskColor(property.risk)}`}>
            {property.risk} risk
          </Badge>
        </div>

        <div className="flex items-center text-xs text-gray-600 mb-2">
          <MapPin className="h-3 w-3 mr-1" />
          {property.address}, {property.city}, {property.country}
        </div>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 text-green-600 mr-1" />
            <span className="font-bold text-lg text-gray-900">
              {formatPrice(property.price)}
            </span>
          </div>
          {property.discountPct && property.discountPct > 0 && (
            <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs">
              {property.discountPct.toFixed(1)}% off
            </Badge>
          )}
        </div>

        {/* Property Stats */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {property.capRate && (
            <div className="flex items-center text-xs">
              <TrendingUp className="h-3 w-3 text-blue-600 mr-1" />
              <span className="text-gray-600">Cap Rate:</span>
              <span className="font-medium ml-1 text-green-600">{property.capRate}%</span>
            </div>
          )}
          {property.bedrooms && (
            <div className="flex items-center text-xs">
              <Home className="h-3 w-3 text-gray-600 mr-1" />
              <span className="text-gray-600">{property.bedrooms}BR/{property.bathrooms}BA</span>
            </div>
          )}
          {property.sqft && (
            <div className="text-xs text-gray-600">
              {property.sqft.toLocaleString()} sqft
            </div>
          )}
          <div className="text-xs">
            <Badge variant="outline" className="text-xs">
              {getCategoryLabel(property.category)}
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t border-gray-100">
          <Link 
            href={`/deals/${property.id}`}
            className="flex-1"
          >
            <Button size="sm" className="w-full text-xs">
              <Eye className="h-3 w-3 mr-1" />
              View Details
            </Button>
          </Link>
          <Button size="sm" variant="outline" className="text-xs">
            <Star className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

interface DealsMapProps {
  deals: Property[];
  preferences: MapPreferences & {
    center?: [number, number];
    zoom?: number;
  };
  onPreferencesChange?: (prefs: MapPreferences) => void;
  className?: string;
}

// Extend MapPreferences with viewport properties
interface ExtendedMapPreferences extends Omit<MapPreferences, 'categories' | 'riskLevel'> {
  center?: [number, number];
  zoom?: number;
  priceRange: [number, number];
  minCapRate: number;
  riskLevel: 'low' | 'medium' | 'high' | 'all';
  categories: DealCategory[];
  markets: string[];
}

// Map interaction component for handling events
function MapInteraction({ onLocationSelect }: { onLocationSelect?: (lat: number, lng: number) => void }) {
  const map = useMapEvents({
    click: (event) => {
      if (onLocationSelect) {
        const { lat, lng } = event.latlng;
        onLocationSelect(lat, lng);
      }
    },
  });

  return null;
}

function MapContent({ 
  deals, 
  preferences,
  onLocationSelect,
  randomBuildings = []
}: { 
  deals: Property[], 
  preferences: ExtendedMapPreferences,
  onLocationSelect?: (lat: number, lng: number) => void,
  randomBuildings?: any[]
}) {
  const map = useMap();
  
  // Filter deals based on preferences
  const filteredDeals = useMemo(() => {
    // Ensure we have the required preference values with defaults
    const {
      priceRange = [0, Number.MAX_SAFE_INTEGER],
      minCapRate = 0,
      riskLevel = 'all',
      categories = [],
      markets = []
    } = preferences;

    return deals.filter(deal => {
      // Filter by price range
      if (priceRange && (deal.price < priceRange[0] || deal.price > priceRange[1])) {
        return false;
      }
      
      // Filter by cap rate
      if (deal.capRate !== undefined && deal.capRate < minCapRate) {
        return false;
      }
      
      // Filter by risk level
      if (riskLevel !== 'all' && deal.risk && deal.risk !== riskLevel) {
        return false;
      }
      
      // Filter by categories if deal has a category and we have categories to filter by
      if (categories.length > 0 && deal.category && !categories.includes(deal.category)) {
        return false;
      }
      
      // Filter by markets (city, country) if we have markets to filter by
      if (markets.length > 0 && deal.city && deal.country) {
        const location = `${deal.city}, ${deal.country}`.toLowerCase();
        if (!markets.some(market => 
          market && typeof market === 'string' && location.includes(market.toLowerCase())
        )) {
          return false;
        }
      }
      
      return true;
    });
  }, [deals, preferences]);
  
  // Fit map bounds to show all markers when deals change
  useEffect(() => {
    if (filteredDeals.length > 0) {
      const bounds = L.latLngBounds(
        filteredDeals.map(deal => [deal.lat, deal.lng])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [filteredDeals, map]);
  
  // Add map interaction for clicking
  const mapInteraction = onLocationSelect ? <MapInteraction onLocationSelect={onLocationSelect} /> : null;
  
  // Use custom clustering hook
  useMarkerCluster(filteredDeals, randomBuildings);
  
  return (
    <>
      {mapInteraction}
    </>
  );
}

export default function DealsMap({ 
  deals, 
  preferences: initialPreferences, 
  className = '' 
}: DealsMapProps) {
  // Merge with default preferences to ensure all required fields are present
  const preferences: ExtendedMapPreferences = {
    ...DEFAULT_PREFERENCES,
    ...initialPreferences,
    riskLevel: initialPreferences.riskLevel || 'all',
    categories: initialPreferences.categories || [],
    markets: initialPreferences.markets || [],
    priceRange: initialPreferences.priceRange || [0, Number.MAX_SAFE_INTEGER],
    minCapRate: initialPreferences.minCapRate || 0
  };
  
  const [isMounted, setIsMounted] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  
  // Default to Mumbai if no deals or center provided
  const defaultCenter: [number, number] = [19.0760, 72.8777]; // Mumbai
  const defaultZoom = 10;

  // Calculate center from deals or use preferences/default
  const center = useMemo(() => {
    if (preferences.center) return preferences.center;
    if (deals.length > 0) {
      const avgLat = deals.reduce((sum, deal) => sum + deal.lat, 0) / deals.length;
      const avgLng = deals.reduce((sum, deal) => sum + deal.lng, 0) / deals.length;
      return [avgLat, avgLng] as [number, number];
    }
    return defaultCenter;
  }, [deals, preferences.center]);

  const zoom = preferences.zoom || defaultZoom;

  // Generate random buildings around the map center for better visualization
  const randomBuildings = useMemo(() => {
    try {
      return generateRandomBuildings(center[0], center[1], 20); // Reduced count to 20
    } catch (error) {
      console.error('Error generating random buildings:', error);
      return []; // Return empty array on error
    }
  }, [center]);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleLocationSelect = useCallback((lat: number, lng: number) => {
    setSelectedLocation([lat, lng]);
    // You can add functionality here to handle location selection
    console.log('Selected location:', { lat, lng });
  }, []);

  if (!isMounted) {
    return (
      <div className={`relative w-full h-full bg-gray-100 ${className}`}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading interactive map...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Map Container */}
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%', minHeight: '500px' }}
        zoomControl={true}
        className="z-0 rounded-lg"
        worldCopyJump={true}
        maxBounds={[[-90, -180], [90, 180]]}
        maxBoundsViscosity={1.0}
      >
        {/* Map Tiles */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
          minZoom={2}
        />
        
        {/* Alternative Satellite View */}
        {/* <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; <a href="https://www.arcgis.com/">ArcGIS</a>'
        /> */}
        
        <MapContent 
          deals={deals} 
          preferences={preferences as ExtendedMapPreferences}
          onLocationSelect={handleLocationSelect}
          randomBuildings={randomBuildings}
        />
      </MapContainer>

      {/* Map Controls Overlay */}
      <div className="absolute top-4 left-4 z-[1000] space-y-2">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
          <p className="text-xs font-medium text-gray-700">
            Properties: <span className="text-blue-600">{deals.length}</span>
          </p>
        </div>
        
        {selectedLocation && (
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
            <p className="text-xs font-medium text-gray-700">Selected:</p>
            <p className="text-xs text-gray-600">
              {selectedLocation[0].toFixed(4)}, {selectedLocation[1].toFixed(4)}
            </p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-[1000]">
        <MapLegend />
      </div>

      {/* Map Type Toggle */}
      <div className="absolute top-4 right-4 z-[1000]">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-lg">
          <Button
            size="sm"
            variant="ghost"
            className="text-xs h-7 px-2"
            onClick={() => {
              // Toggle between map types - you can implement this
              console.log('Toggle map type');
            }}
          >
            🛰️ Satellite
          </Button>
        </div>
      </div>
      
      {/* Custom Styles for Markers */}
      <style jsx global>{`
        .custom-property-marker {
          background: none !important;
          border: none !important;
        }
        
        .custom-building-marker {
          background: none !important;
          border: none !important;
          transition: opacity 0.3s ease;
        }
        
        .custom-building-marker:hover {
          opacity: 1 !important;
        }
        
        .property-popup .leaflet-popup-content {
          margin: 8px 12px 8px 12px;
          line-height: 1.4;
          font-size: 13px;
          min-height: 1px;
        }
        
        .property-popup .leaflet-popup-content-wrapper {
          padding: 0;
          border-radius: 8px;
          box-shadow: 0 3px 14px rgba(0,0,0,0.4);
        }
        
        .marker-cluster-small {
          background-color: rgba(181, 226, 140, 0.6);
          border: 2px solid rgba(110, 204, 57, 0.6);
        }
        
        .marker-cluster-medium {
          background-color: rgba(241, 211, 87, 0.6);
          border: 2px solid rgba(240, 194, 12, 0.6);
        }
        
        .marker-cluster-large {
          background-color: rgba(253, 156, 115, 0.6);
          border: 2px solid rgba(241, 128, 23, 0.6);
        }
        
        .marker-cluster {
          border-radius: 50%;
          text-align: center;
          color: #fff;
          font-weight: bold;
          font-size: 12px;
        }
        
        .marker-cluster div {
          width: 30px;
          height: 30px;
          margin-left: 5px;
          margin-top: 5px;
          text-align: center;
          border-radius: 15px;
          background-color: rgba(0, 0, 0, 0.6);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}
