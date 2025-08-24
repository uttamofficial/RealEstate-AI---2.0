'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Download, RefreshCw, Wand2, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  size: string;
  createdAt: Date;
  style?: string;
}

export default function AIImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [size, setSize] = useState('1024x1024');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [propertySpecs, setPropertySpecs] = useState({
    propertyType: 'house',
    city: 'Modern City',
    bedrooms: '3',
    bathrooms: '2',
    sqft: '2000'
  });
  const { toast } = useToast();

  const generateCustomImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt for image generation",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          style,
          size,
          count: 1
        }),
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedImages(prev => [...data.images, ...prev]);
        toast({
          title: "Success!",
          description: `Generated ${data.count} image(s) successfully`,
        });
        setPrompt(''); // Clear prompt after successful generation
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate image",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePresetImages = async (type: string) => {
    setIsGenerating(true);
    try {
      const params = new URLSearchParams({
        type,
        propertyType: propertySpecs.propertyType,
        city: propertySpecs.city,
        bedrooms: propertySpecs.bedrooms,
        bathrooms: propertySpecs.bathrooms,
        sqft: propertySpecs.sqft,
        propertyId: `preset_${Date.now()}`
      });

      const response = await fetch(`/api/ai-images?${params}`);
      const data = await response.json();

      if (data.success) {
        setGeneratedImages(prev => [...data.images, ...prev]);
        toast({
          title: "Success!",
          description: `Generated ${data.count} ${type} image(s) successfully`,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate images",
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
      a.download = `${imageName}.png`;
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
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Wand2 className="h-8 w-8 text-purple-600" />
          AI Image Generator
        </h1>
        <p className="text-gray-600">
          Generate stunning real estate images using AI. Create custom property visualizations, marketing images, and more.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Custom Image Generation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Custom Image Generation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Describe the image you want to generate... (e.g., 'Modern luxury home with a pool in California, sunset lighting')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Style</label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realistic">Realistic</SelectItem>
                    <SelectItem value="architectural">Architectural</SelectItem>
                    <SelectItem value="interior">Interior</SelectItem>
                    <SelectItem value="exterior">Exterior</SelectItem>
                    <SelectItem value="aerial">Aerial View</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Size</label>
                <Select value={size} onValueChange={setSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1024x1024">Square (1024x1024)</SelectItem>
                    <SelectItem value="1792x1024">Landscape (1792x1024)</SelectItem>
                    <SelectItem value="1024x1792">Portrait (1024x1792)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={generateCustomImage}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Wand2 className="h-4 w-4 mr-2" />
              )}
              Generate Custom Image
            </Button>
          </CardContent>
        </Card>

        {/* Preset Property Images */}
        <Card>
          <CardHeader>
            <CardTitle>Property Image Presets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Property Type</label>
                <Select 
                  value={propertySpecs.propertyType} 
                  onValueChange={(value) => setPropertySpecs(prev => ({ ...prev, propertyType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">City</label>
                <Input
                  value={propertySpecs.city}
                  onChange={(e) => setPropertySpecs(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="San Francisco"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Bedrooms</label>
                <Input
                  type="number"
                  value={propertySpecs.bedrooms}
                  onChange={(e) => setPropertySpecs(prev => ({ ...prev, bedrooms: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Bathrooms</label>
                <Input
                  type="number"
                  value={propertySpecs.bathrooms}
                  onChange={(e) => setPropertySpecs(prev => ({ ...prev, bathrooms: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Sq Ft</label>
                <Input
                  type="number"
                  value={propertySpecs.sqft}
                  onChange={(e) => setPropertySpecs(prev => ({ ...prev, sqft: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Button 
                onClick={() => generatePresetImages('marketing')}
                disabled={isGenerating}
                variant="outline"
                className="w-full"
              >
                Generate Marketing Images
              </Button>
              <Button 
                onClick={() => generatePresetImages('visualization')}
                disabled={isGenerating}
                variant="outline"
                className="w-full"
              >
                Generate Property Visualization
              </Button>
              <Button 
                onClick={() => generatePresetImages('floorplan')}
                disabled={isGenerating}
                variant="outline"
                className="w-full"
              >
                Generate Floor Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generated Images Gallery */}
      {generatedImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Generated Images ({generatedImages.length})
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setGeneratedImages([])}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatedImages.map((image, index) => (
                <div key={image.id} className="group relative">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={image.url}
                      alt={image.prompt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button
                      size="sm"
                      onClick={() => downloadImage(image.url, `ai-generated-${index + 1}`)}
                      className="bg-white/90 text-black hover:bg-white"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                  <div className="mt-2 space-y-1">
                    {image.style && (
                      <Badge variant="secondary" className="text-xs">
                        {image.style}
                      </Badge>
                    )}
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {image.prompt}
                    </p>
                    <p className="text-xs text-gray-400">
                      {image.size} • {new Date(image.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
