import { notFound } from 'next/navigation';
import { mockDeals } from '@/data/mockDeals';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function DealDetailsPage({ params }: { params: { id: string } }) {
  const deal = mockDeals.find(d => d.id === params.id);
  
  if (!deal) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/deals" className="inline-block mb-6">
        <Button variant="ghost" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Deals
        </Button>
      </Link>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{deal.title}</h1>
              <p className="mt-1 text-sm text-gray-500">
                {deal.city}, {deal.country}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">₹{deal.price.toLocaleString()}</p>
              <p className="text-sm text-gray-500">
                {deal.sqft} sqft • {deal.bedrooms} Beds • {deal.bathrooms} Baths
              </p>
            </div>
          </div>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={deal.imageUrl || '/placeholder-property.jpg'}
                  alt={deal.title || 'Property'}
                  width={800}
                  height={450}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="mt-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Property Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Year Built</p>
                    <p className="font-medium">{deal.yearBuilt}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Property Type</p>
                    <p className="font-medium">Residential</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cap Rate</p>
                    <p className="font-medium">{deal.capRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Market Cap Rate</p>
                    <p className="font-medium">{deal.marketCapRate}%</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900">Description</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {deal.description}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Investment Summary</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Asking Price</span>
                    <span className="text-sm font-medium">₹{deal.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">AI Estimated Value</span>
                    <span className="text-sm font-medium">₹{deal.aiEstimatedValue?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Discount</span>
                    <span className={`text-sm font-medium ${deal.discountPct && deal.discountPct > 0 ? 'text-green-600' : ''}`}>
                      {deal.discountPct?.toFixed(1) || '0.0'}%
                    </span>
                  </div>
                  
                  <div className="pt-4 mt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Risk Level</span>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        deal.risk === 'low' ? 'bg-green-100 text-green-800' :
                        deal.risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {deal.risk.charAt(0).toUpperCase() + deal.risk.slice(1)}
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-sm font-medium">Category</span>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        deal.category === 'cap_rate_arbitrage' ? 'bg-blue-100 text-blue-800' :
                        deal.category === 'mispriced' ? 'bg-purple-100 text-purple-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {deal.category.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-4 mt-4 border-t border-gray-200">
                    <Button className="w-full" size="lg">
                      Express Interest
                    </Button>
                    <p className="mt-2 text-xs text-center text-gray-500">
                      Our team will contact you within 24 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
