// Image service for fetching real estate images
export interface PropertyImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
}

export class ImageService {
  private static readonly UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
  private static readonly UNSPLASH_API_URL = 'https://api.unsplash.com';

  static async getPropertyImages(query: string, count: number = 1): Promise<PropertyImage[]> {
    if (!this.UNSPLASH_ACCESS_KEY) {
      // Fallback to placeholder images if no API key
      return this.getFallbackImages(query, count);
    }

    try {
      const response = await fetch(
        `${this.UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`,
        {
          headers: {
            'Authorization': `Client-ID ${this.UNSPLASH_ACCESS_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }

      const data = await response.json();
      return data.results.map((photo: any) => ({
        id: photo.id,
        url: photo.urls.regular,
        alt: photo.alt_description || query,
        width: photo.width,
        height: photo.height,
      }));
    } catch (error) {
      console.warn('Failed to fetch Unsplash images, using fallback:', error);
      return this.getFallbackImages(query, count);
    }
  }

  private static getFallbackImages(query: string, count: number): PropertyImage[] {
    // Use reliable placeholder images instead of external APIs
    const placeholderImages = [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop'
    ];
    
    return Array.from({ length: count }, (_, i) => ({
      id: `fallback-${i}`,
      url: placeholderImages[i % placeholderImages.length],
      alt: `${query} - Modern Property`,
      width: 800,
      height: 600,
    }));
  }

  static getPropertyImageByType(propertyType: string, address: string): string {
    const type = propertyType?.toLowerCase() || 'house';
    const city = address.split(',')[1]?.trim() || 'real estate';
    
    // Use more reliable image sources with fallbacks
    const imageQueries = {
      rental: ['rental house', 'apartment building', 'residential property'],
      flip: ['fixer upper house', 'renovation project', 'construction house'],
      luxury: ['luxury home', 'mansion', 'high end property'],
      default: ['modern house', 'real estate', 'property exterior']
    };
    
    let query = imageQueries.default;
    if (type.includes('rental')) {
      query = imageQueries.rental;
    } else if (type.includes('flip')) {
      query = imageQueries.flip;
    } else if (type.includes('luxury')) {
      query = imageQueries.luxury;
    }
    
    // Use reliable, specific Unsplash photo IDs instead of random queries
    const reliableImages = {
      rental: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop'
      ],
      flip: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop'
      ],
      luxury: [
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop'
      ],
      default: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop'
      ]
    };
    
    let imageSet = reliableImages.default;
    if (type.includes('rental')) {
      imageSet = reliableImages.rental;
    } else if (type.includes('flip')) {
      imageSet = reliableImages.flip;
    } else if (type.includes('luxury')) {
      imageSet = reliableImages.luxury;
    }
    
    // Return a random image from the appropriate set
    return imageSet[Math.floor(Math.random() * imageSet.length)];
  }
}
