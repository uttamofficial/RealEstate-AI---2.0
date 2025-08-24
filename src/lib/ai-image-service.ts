// AI Image Generation Service for Real Estate
export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  size: string;
  createdAt: Date;
  style?: 'realistic' | 'architectural' | 'interior' | 'exterior' | 'aerial';
}

export interface ImageGenerationRequest {
  prompt: string;
  style?: 'realistic' | 'architectural' | 'interior' | 'exterior' | 'aerial';
  size?: '1024x1024' | '1792x1024' | '1024x1792';
  count?: number;
  propertyId?: string;
}

export class AIImageService {
  private static readonly OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  private static readonly OPENAI_API_URL = 'https://api.openai.com/v1/images/generations';
  
  // Style presets for different types of real estate images
  private static readonly STYLE_PRESETS = {
    realistic: 'photorealistic, high quality, professional photography',
    architectural: 'architectural visualization, clean lines, modern design',
    interior: 'interior design, well-lit, spacious, modern furniture',
    exterior: 'exterior view, beautiful landscaping, curb appeal',
    aerial: 'aerial view, bird\'s eye perspective, neighborhood context'
  };

  static async generatePropertyImage(request: ImageGenerationRequest): Promise<GeneratedImage[]> {
    if (!this.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.');
    }

    const { prompt, style = 'realistic', size = '1024x1024', count = 1 } = request;
    
    // Enhance prompt with real estate specific context and style
    const enhancedPrompt = this.enhancePromptForRealEstate(prompt, style);

    try {
      console.log(`🎨 Generating ${count} image(s) with prompt: "${enhancedPrompt}"`);
      
      const response = await fetch(this.OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: enhancedPrompt,
          n: count,
          size: size,
          quality: 'hd',
          style: 'vivid' // More vibrant and appealing for real estate
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      return data.data.map((imageData: any, index: number) => ({
        id: `generated_${Date.now()}_${index}`,
        url: imageData.url,
        prompt: enhancedPrompt,
        size: size,
        createdAt: new Date(),
        style: style
      }));

    } catch (error) {
      console.error('Failed to generate image:', error);
      throw error;
    }
  }

  private static enhancePromptForRealEstate(prompt: string, style: string): string {
    const stylePreset = this.STYLE_PRESETS[style as keyof typeof this.STYLE_PRESETS];
    
    // Add real estate specific context and quality enhancers
    const realEstateContext = [
      'real estate photography',
      'professional quality',
      'well-lit',
      'inviting atmosphere',
      'high resolution'
    ].join(', ');

    return `${prompt}, ${stylePreset}, ${realEstateContext}`;
  }

  // Generate property visualization based on property details
  static async generatePropertyVisualization(propertyData: any): Promise<GeneratedImage[]> {
    const { type, city, bedrooms, bathrooms, price, description } = propertyData;
    
    // Create contextual prompts based on property data
    const prompts = [
      `Beautiful ${type} in ${city} with ${bedrooms} bedrooms and ${bathrooms} bathrooms, modern and inviting`,
      `Exterior view of a ${type} property in ${city}, beautiful landscaping and curb appeal`,
      `Interior living space of a ${type}, modern furniture, spacious and well-lit`
    ];

    const images: GeneratedImage[] = [];
    
    for (let i = 0; i < prompts.length; i++) {
      try {
        const style = i === 0 ? 'realistic' : i === 1 ? 'exterior' : 'interior';
        const generatedImages = await this.generatePropertyImage({
          prompt: prompts[i],
          style: style as any,
          count: 1,
          propertyId: propertyData.id
        });
        images.push(...generatedImages);
      } catch (error) {
        console.warn(`Failed to generate image ${i + 1}:`, error);
      }
    }

    return images;
  }

  // Generate renovation/improvement visualizations
  static async generateRenovationVisualization(
    currentState: string, 
    renovationPlan: string
  ): Promise<{ before: GeneratedImage[], after: GeneratedImage[] }> {
    
    const beforePrompt = `${currentState}, current state, needs renovation, real estate photography`;
    const afterPrompt = `${renovationPlan}, renovated, modern, beautiful, real estate photography`;

    try {
      const [beforeImages, afterImages] = await Promise.all([
        this.generatePropertyImage({
          prompt: beforePrompt,
          style: 'realistic',
          count: 1
        }),
        this.generatePropertyImage({
          prompt: afterPrompt,
          style: 'realistic',
          count: 1
        })
      ]);

      return {
        before: beforeImages,
        after: afterImages
      };
    } catch (error) {
      console.error('Failed to generate renovation visualization:', error);
      throw error;
    }
  }

  // Generate marketing images for property listings
  static async generateMarketingImages(propertyData: any): Promise<GeneratedImage[]> {
    const marketingPrompts = [
      `Stunning ${propertyData.type} for sale in ${propertyData.city}, professional real estate photography, golden hour lighting`,
      `Luxurious interior of ${propertyData.type}, modern design, spacious living area, high-end finishes`,
      `Beautiful neighborhood view of ${propertyData.city}, tree-lined streets, family-friendly community`,
      `Aerial view of ${propertyData.type} property in ${propertyData.city}, showing surrounding area and location`
    ];

    const styles: Array<'realistic' | 'architectural' | 'interior' | 'exterior' | 'aerial'> = 
      ['realistic', 'interior', 'exterior', 'aerial'];

    const images: GeneratedImage[] = [];

    for (let i = 0; i < marketingPrompts.length; i++) {
      try {
        const generatedImages = await this.generatePropertyImage({
          prompt: marketingPrompts[i],
          style: styles[i],
          count: 1,
          propertyId: propertyData.id
        });
        images.push(...generatedImages);
      } catch (error) {
        console.warn(`Failed to generate marketing image ${i + 1}:`, error);
      }
    }

    return images;
  }

  // Generate floor plan visualizations (conceptual)
  static async generateFloorPlan(propertySpecs: {
    bedrooms: number;
    bathrooms: number;
    squareFootage: number;
    type: string;
  }): Promise<GeneratedImage[]> {
    
    const floorPlanPrompt = `Architectural floor plan for ${propertySpecs.type} with ${propertySpecs.bedrooms} bedrooms, ${propertySpecs.bathrooms} bathrooms, ${propertySpecs.squareFootage} square feet, clean architectural drawing, top-down view, professional blueprint style`;

    return await this.generatePropertyImage({
      prompt: floorPlanPrompt,
      style: 'architectural',
      count: 1
    });
  }
}
