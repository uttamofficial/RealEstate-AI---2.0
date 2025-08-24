'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Create a very simple map component to test basic functionality
const SimpleLeafletMap = dynamic(
  () => import('react-leaflet').then((mod) => {
    const { MapContainer, TileLayer, Marker, Popup } = mod;
    
    return function SimpleMap() {
      console.log('SimpleMap component rendering...');
      
      return (
        <MapContainer
          center={[19.0760, 72.8777]}
          zoom={10}
          style={{ height: '400px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[19.0760, 72.8777]}>
            <Popup>
              Test marker - if you can see this, Leaflet is working!
            </Popup>
          </Marker>
        </MapContainer>
      );
    };
  }),
  { 
    ssr: false,
    loading: () => <div>Loading simple map...</div>
  }
);

export default function TestMapComponent() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div>Initializing map...</div>;
  }

  return (
    <div className="w-full h-96 border border-gray-300 rounded-lg overflow-hidden">
      <SimpleLeafletMap />
    </div>
  );
}
