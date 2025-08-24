# AI Image Generation Setup

This document explains how to set up AI image generation functionality in the RealEstate AI platform.

## Environment Variables

Add the following environment variable to your `.env.local` file:

```bash
# OpenAI API Key for DALL-E image generation
OPENAI_API_KEY=your_openai_api_key_here
```

## Getting OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env.local` file

## Features

### 1. Custom Image Generation
- **Prompt-based generation**: Enter any text description to generate real estate images
- **Style selection**: Choose from different styles (realistic, architectural, interior, exterior, aerial)
- **Size options**: Generate images in different sizes (square, landscape, portrait)
- **High quality**: Uses OpenAI's DALL-E with HD quality settings

### 2. Property Preset Images
- **Marketing images**: Generate professional marketing photos for property listings
- **Property visualization**: Create property images based on specifications (bedrooms, bathrooms, location)
- **Floor plans**: Generate architectural floor plan visualizations
- **Renovation concepts**: Create before/after renovation visualizations

### 3. Automated Property Enhancement
- **Property data integration**: Generate images based on actual property data
- **Multiple styles**: Each property can have exterior, interior, and aerial view images
- **Contextual prompts**: AI automatically enhances prompts with real estate context

## API Endpoints

### POST /api/ai-images
Generate custom images with a prompt.

**Request Body:**
```json
{
  "prompt": "Modern luxury home with pool in California",
  "style": "realistic",
  "size": "1024x1024",
  "count": 1
}
```

### GET /api/ai-images
Generate preset images for properties.

**Query Parameters:**
- `type`: "marketing", "visualization", or "floorplan"
- `propertyType`: "house", "condo", "apartment", etc.
- `city`: Property location
- `bedrooms`: Number of bedrooms
- `bathrooms`: Number of bathrooms
- `sqft`: Square footage

**Example:**
```
GET /api/ai-images?type=marketing&propertyType=house&city=San Francisco&bedrooms=3&bathrooms=2&sqft=2000
```

## Usage Examples

### In React Components

```tsx
import { AIImageService } from '@/lib/ai-image-service';

// Generate custom image
const images = await AIImageService.generatePropertyImage({
  prompt: "Beautiful modern house with garden",
  style: "realistic",
  size: "1024x1024"
});

// Generate marketing images for a property
const marketingImages = await AIImageService.generateMarketingImages({
  type: "house",
  city: "San Francisco",
  bedrooms: 3,
  bathrooms: 2,
  price: 850000
});

// Generate floor plan
const floorPlan = await AIImageService.generateFloorPlan({
  bedrooms: 3,
  bathrooms: 2,
  squareFootage: 2000,
  type: "house"
});
```

## Image Styles

1. **Realistic**: Photorealistic, high quality, professional photography
2. **Architectural**: Clean lines, modern design, architectural visualization
3. **Interior**: Interior design, well-lit, spacious, modern furniture
4. **Exterior**: Exterior view, beautiful landscaping, curb appeal
5. **Aerial**: Bird's eye perspective, neighborhood context

## Cost Considerations

- DALL-E API pricing varies by image size and quality
- HD quality images cost more than standard quality
- Consider implementing usage limits or user quotas
- Cache generated images to avoid regenerating the same content

## Error Handling

The system includes comprehensive error handling:
- API key validation
- Rate limiting management
- Fallback to placeholder images when generation fails
- User-friendly error messages

## Integration with Property Listings

The AI image generator can be integrated with:
- Property listing pages
- Marketing material generation
- Property visualization tools
- Real estate presentations
- Social media content creation

## Security Notes

- Never expose your OpenAI API key in client-side code
- Store API keys securely in environment variables
- Implement proper authentication for image generation endpoints
- Consider rate limiting to prevent abuse
- Monitor API usage and costs

## Troubleshooting

### Common Issues

1. **"OpenAI API key not configured"**: Ensure `OPENAI_API_KEY` is set in `.env.local`
2. **Rate limiting**: OpenAI has rate limits; implement retry logic with exponential backoff
3. **Content policy violations**: Some prompts may be rejected by OpenAI's content policy
4. **Network errors**: Implement proper error handling for network failures

### Testing

Test the AI image generation functionality:

1. Navigate to `/ai-images` in your application
2. Try different prompts and styles
3. Test preset image generation
4. Verify error handling with invalid inputs
5. Check download functionality

## Future Enhancements

Potential improvements:
- Image editing and enhancement features
- Batch image generation
- Custom style training
- Integration with property management systems
- Automated social media posting
- Image optimization and compression
- Multi-language support for prompts
