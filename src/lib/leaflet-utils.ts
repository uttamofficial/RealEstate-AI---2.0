import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export const createMapIcon = (iconUrl: string, iconSize: [number, number] = [25, 41]) => {
  return L.icon({
    iconUrl,
    iconRetinaUrl: iconUrl,
    iconSize,
    iconAnchor: [iconSize[0] / 2, iconSize[1]],
    popupAnchor: [0, -iconSize[1] / 2],
    shadowUrl: undefined,
    shadowSize: undefined,
    shadowAnchor: undefined,
  });
};

export const defaultMapIcon = createMapIcon('/marker-icon.png');

// Initialize the default icon for all markers
if (typeof window !== 'undefined') {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/marker-icon-2x.png',
    iconUrl: '/marker-icon.png',
    shadowUrl: '/marker-shadow.png',
  });
}
