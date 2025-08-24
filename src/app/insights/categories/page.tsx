'use client';

import { mockDeals } from '@/data/mockDeals';
import { getCategoryStats, getCategoryConfig } from '@/lib/category-utils';

export default function CategoriesInsightsPage() {
  const stats = getCategoryStats(mockDeals);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Deal Categories Insights</h1>
      
      <div className="space-y-6">
        {Object.entries(stats.byCategory).map(([category, data]) => (
          <div key={category} className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">
              {getCategoryConfig(category as any).label} Deals
            </h2>
            <p className="text-gray-600 mb-4">
              {data.count} deals ({data.percentage}% of total)
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-500">Avg Cap Rate</p>
                <p className="text-lg font-medium">
                  {mockDeals
                    .filter(d => d.category === category)
                    .reduce((sum, d) => sum + (d.capRate || 0), 0) / data.count || 0}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
