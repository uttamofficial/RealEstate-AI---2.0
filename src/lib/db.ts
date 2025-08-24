import { Property } from '@/types/property';

export const DEALS: Property[] = [
  {
    id: '1',
    title: 'Downtown Office Building',
    company: 'Metro Properties',
    logoUrl: '/logos/metro.png',
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800'
    ],
    address: '123 Main St',
    city: 'Mumbai',
    country: 'India',
    lat: 19.0760,
    lng: 72.8777,
    price: 2500000,
    noi: 187500,
    capRate: 0.075,
    marketCapRate: 0.065,
    aiEstimatedValue: 2800000,
    risk: 'medium',
    category: 'cap_rate_arbitrage',
    status: 'new',
    createdAt: '2025-08-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Luxury Apartment Complex',
    company: 'Elite Living',
    logoUrl: '/logos/elite.png',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'
    ],
    address: '456 Palm Avenue',
    city: 'Bangalore',
    country: 'India',
    lat: 12.9716,
    lng: 77.5946,
    price: 1800000,
    noi: 135000,
    capRate: 0.075,
    marketCapRate: 0.07,
    aiEstimatedValue: 2000000,
    risk: 'low',
    category: 'mispriced',
    status: 'review',
    createdAt: '2025-08-10T14:30:00Z'
  },
  {
    id: '3',
    title: 'Retail Plaza',
    company: 'Urban Retail',
    logoUrl: '/logos/urban.png',
    images: [
      'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800',
      'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=800'
    ],
    address: '789 Market St',
    city: 'Delhi',
    country: 'India',
    lat: 28.6139,
    lng: 77.2090,
    price: 3500000,
    noi: 227500,
    capRate: 0.065,
    marketCapRate: 0.06,
    aiEstimatedValue: 4000000,
    risk: 'high',
    category: 'distressed',
    status: 'new',
    createdAt: '2025-08-05T09:15:00Z'
  },
  {
    id: '4',
    title: 'Tech Park Office Space',
    company: 'TechHaven',
    logoUrl: '/logos/techhaven.png',
    images: [
      'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800'
    ],
    address: '101 Innovation Drive',
    city: 'Hyderabad',
    country: 'India',
    lat: 17.3850,
    lng: 78.4867,
    price: 4200000,
    noi: 336000,
    capRate: 0.08,
    marketCapRate: 0.07,
    aiEstimatedValue: 4500000,
    risk: 'medium',
    category: 'cap_rate_arbitrage',
    status: 'new',
    createdAt: '2025-08-18T11:20:00Z'
  },
  {
    id: '5',
    title: 'Lakeside Villas',
    company: 'Serene Living',
    logoUrl: '/logos/serene.png',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800'
    ],
    address: '22 Lakeview Road',
    city: 'Pune',
    country: 'India',
    lat: 18.5204,
    lng: 73.8567,
    price: 3200000,
    noi: 224000,
    capRate: 0.07,
    marketCapRate: 0.065,
    aiEstimatedValue: 3500000,
    risk: 'low',
    category: 'mispriced',
    status: 'review',
    createdAt: '2025-08-12T16:45:00Z'
  }
];

// Calculate discount percentages
DEALS.forEach(deal => {
  if (deal.aiEstimatedValue && !deal.discountPct) {
    deal.discountPct = (deal.aiEstimatedValue - deal.price) / deal.aiEstimatedValue;
  }
});
