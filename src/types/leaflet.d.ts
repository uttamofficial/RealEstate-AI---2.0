import 'leaflet';

declare module 'leaflet' {
  interface MapOptions {
    zoomControl?: boolean;
  }
}

declare module 'react-leaflet' {
  export * from 'react-leaflet/src';
}

declare module 'react-leaflet-markercluster' {
  import { ComponentType } from 'react';
  import { MarkerClusterGroupProps } from 'leaflet';
  
  const MarkerClusterGroup: ComponentType<MarkerClusterGroupProps>;
  export default MarkerClusterGroup;
}
