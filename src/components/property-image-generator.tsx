'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Wand2, Download, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface PropertyImageGeneratorProps {
  propertyData: {
    id: string;
    type: string;
    city: string;
    bedrooms?: number;
    bathrooms?: number;
    squareFootage?: number;
    price?: number;
    description?: string;
  };
  onImagesGenerated?: (images: any[]) => void;
}

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  style?: string;
}

export default function PropertyImageGenerator({ 
  propertyData, 
  onImagesGenerated 
}: PropertyImageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [showGallery, setShowGallery] = useState(false);
  const { toast } = useToast();

  const generatePropertyImages = async (type: 'marketing' | 'visualization' | 'floorplan') => {
    setIsGenerating(true);
    
    try {
      const params = new URLSearchParams({
        type,
        propertyType: propertyData.type,
        city: propertyData.city,
        bedrooms: (propertyData.bedrooms || 3).toString(),
        bathrooms: (propertyData.bathrooms || 2).toString(),
        sqft: (propertyData.squareFootage || 2000).toString(),
        propertyId: propertyData.id
      });

      const response = await fetch(`/api/ai-images?${params}`);
      const data = await response.json();

      if (data.success && data.images) {
        const newImages = data.images;
        setGeneratedImages(prev => [...newImages, ...prev]);
        
        if (onImagesGenerated) {
          onImagesGenerated(newImages);
        }

        toast({
          title: "Success!",
          description: `Generated ${newImages.length} ${type} image(s) for this property`,
        });
      } else {
        throw new Error(data.error || 'Failed to generate images');
      }
    } catch (error: any) {
      console.error('Error generating images:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate property images",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async (imageUrl: string, imageName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${propertyData.city}-${propertyData.type}-${imageName}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download image",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-purple-600" />
          AI Property Images
        </CardTitle>
        <p className="text-sm text-gray-600">
          Generate stunning AI images for this {propertyData.type} in {propertyData.city}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Generation Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button
            onClick={() => generatePropertyImages('marketing')}
            disabled={isGenerating}
            variant="outline"
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4" />
            )}
            Marketing Images
          </Button>
          
          <Button
            onClick={() => generatePropertyImages('visualization')}
            disabled={isGenerating}
            variant="outline"
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4" />
            )}
            Property Views
          </Button>
          
          <Button
            onClick={() => generatePropertyImages('floorplan')}
            disabled={isGenerating}
            variant="outline"
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4" />
            )}
            Floor Plan
          </Button>
        </div>

        {/* Property Details */}
        <div className="flex flex-wrap gap-2 text-sm text-gray-600">
          <Badge variant="secondary">{propertyData.type}</Badge>
          <Badge variant="secondary">{propertyData.city}</Badge>
          {propertyData.bedrooms && (
            <Badge variant="secondary">{propertyData.bedrooms} bed</Badge>
          )}
          {propertyData.bathrooms && (
            <Badge variant="secondary">{propertyData.bathrooms} bath</Badge>
          )}
          {propertyData.squareFootage && (
            <Badge variant="secondary">{propertyData.squareFootage.toLocaleString()} sq ft</Badge>
          )}
        </div>

        {/* Generated Images Preview */}
        {generatedImages.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Generated Images ({generatedImages.length})</h4>
              <Dialog open={showGallery} onOpenChange={setShowGallery}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View All
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Generated Property Images</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {generatedImages.map((image, index) => (
                      <div key={image.id} className="space-y-2">
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={image.url}
                            alt={image.prompt}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          {image.style && (
                            <Badge variant="secondary" className="text-xs">
                              {image.style}
                            </Badge>
                          )}
                          <Button
                            size="sm"
                            onClick={() => downloadImage(image.url, `image-${index + 1}`)}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {image.prompt}
                        </p>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Image Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {generatedImages.slice(0, 4).map((image, index) => (
                <div 
                  key={image.id} 
                  className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                  onClick={() => setShowGallery(true)}
                >
                  <img
                    src={image.url}
                    alt={`Generated ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {generatedImages.length > 4 && (
                <div 
                  className="flex-shrink-0 w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors text-xs font-medium"
                  onClick={() => setShowGallery(true)}
                >
                  +{generatedImages.length - 4}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <div className="flex items-center justify-center py-4 text-sm text-gray-600">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Generating AI images for your property...
          </div>
        )}
      </CardContent>
    </Card>
  );
}
