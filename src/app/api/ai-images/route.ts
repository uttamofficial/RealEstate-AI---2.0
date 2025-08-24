import { NextRequest, NextResponse } from 'next/server';
import { AIImageService, ImageGenerationRequest } from '@/lib/ai-image-service';

export async function POST(request: NextRequest) {
  try {
    const body: ImageGenerationRequest = await request.json();
    
    // Validate required fields
    if (!body.prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Generate images using AI service
    const images = await AIImageService.generatePropertyImage(body);

    return NextResponse.json({
      success: true,
      images: images,
      count: images.length
    });

  } catch (error: any) {
    console.error('AI Image Generation Error:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to generate images',
        success: false 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const propertyId = searchParams.get('propertyId');

  if (!type) {
    return NextResponse.json(
      { error: 'Type parameter is required' },
      { status: 400 }
    );
  }

  try {
    let images;

    switch (type) {
      case 'marketing':
        // Generate marketing images for a property
        const marketingData = {
          type: searchParams.get('propertyType') || 'house',
          city: searchParams.get('city') || 'Modern City',
          id: propertyId
        };
        images = await AIImageService.generateMarketingImages(marketingData);
        break;

      case 'floorplan':
        // Generate floor plan
        const specs = {
          bedrooms: parseInt(searchParams.get('bedrooms') || '3'),
          bathrooms: parseInt(searchParams.get('bathrooms') || '2'),
          squareFootage: parseInt(searchParams.get('sqft') || '2000'),
          type: searchParams.get('propertyType') || 'house'
        };
        images = await AIImageService.generateFloorPlan(specs);
        break;

      case 'visualization':
        // Generate property visualization
        const propertyData = {
          type: searchParams.get('propertyType') || 'house',
          city: searchParams.get('city') || 'Modern City',
          bedrooms: parseInt(searchParams.get('bedrooms') || '3'),
          bathrooms: parseInt(searchParams.get('bathrooms') || '2'),
          price: parseInt(searchParams.get('price') || '500000'),
          id: propertyId
        };
        images = await AIImageService.generatePropertyVisualization(propertyData);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid type parameter' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      images: images,
      count: images.length,
      type: type
    });

  } catch (error: any) {
    console.error('AI Image Generation Error:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to generate images',
        success: false 
      },
      { status: 500 }
    );
  }
}
