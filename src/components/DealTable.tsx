'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Property, DealCategory, RiskLevel } from '@/types/property';
import { Button } from './ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import Image from 'next/image';
import { PlaceholderImage } from './PlaceholderImage';
import { CategoryChip } from './CategoryChip';

type SortConfig = {
  key: keyof Property | 'discount' | 'score';
  direction: 'asc' | 'desc';
};

interface DealTableProps {
  deals: Property[];
  isLoading?: boolean;
  error?: string | null;
}

const categoryStyles: Record<DealCategory, string> = {
  cap_rate_arbitrage: 'bg-blue-100 text-blue-800',
  mispriced: 'bg-purple-100 text-purple-800',
  distressed: 'bg-amber-100 text-amber-800',
};

const riskStyles: Record<RiskLevel, string> = {
  low: 'text-green-600',
  medium: 'text-yellow-600',
  high: 'text-red-600',
  all: 'text-gray-600',
};

export function DealTable({ deals, isLoading, error }: DealTableProps) {
  const router = useRouter();
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'score',
    direction: 'desc',
  });

  // Calculate derived values
  const enhancedDeals = useMemo(() => {
    return deals.map(deal => ({
      ...deal,
      discount: deal.discountPct || 0,
      score: calculateProfitabilityScore(deal),
    }));
  }, [deals]);

  // Sort deals
  const sortedDeals = useMemo(() => {
    if (!sortConfig) return enhancedDeals;

    return [...enhancedDeals].sort((a, b) => {
      let aValue = a[sortConfig.key as keyof typeof a];
      let bValue = b[sortConfig.key as keyof typeof b];

      // Handle derived values
      if (sortConfig.key === 'discount') {
        aValue = a.discountPct || 0;
        bValue = b.discountPct || 0;
      } else if (sortConfig.key === 'score') {
        aValue = calculateProfitabilityScore(a);
        bValue = calculateProfitabilityScore(b);
      }

      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [enhancedDeals, sortConfig]);

  const requestSort = (key: keyof Property | 'discount' | 'score') => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="ml-1 h-4 w-4" />;
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="ml-1 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-1 h-4 w-4" />
    );
  };

  const handleRowClick = (id: string) => {
    router.push(`/deals/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        <p>Error loading deals: {error}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('title')}
            >
              <div className="flex items-center">
                Company / Title
                {getSortIcon('title')}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Category
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('price')}
            >
              <div className="flex items-center">
                Price
                {getSortIcon('price')}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('capRate')}
            >
              <div className="flex items-center">
                Cap Rate
                {getSortIcon('capRate')}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('discount')}
            >
              <div className="flex items-center">
                Discount
                {getSortIcon('discount')}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Risk
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('score')}
            >
              <div className="flex items-center">
                Score
                {getSortIcon('score')}
              </div>
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedDeals.map((deal) => (
            <tr 
              key={deal.id} 
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => handleRowClick(deal.id)}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    {deal.logoUrl ? (
                      <Image
                        className="h-10 w-10 rounded-full object-cover"
                        src={deal.logoUrl}
                        alt={deal.company || deal.title || 'Company'}
                        width={40}
                        height={40}
                        onError={(e) => {
                          // Fallback to placeholder on error
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const placeholder = target.nextSibling as HTMLElement;
                          if (placeholder) {
                            placeholder.style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    <PlaceholderImage 
                      text={deal.company || deal.title || 'NA'} 
                      className="h-10 w-10 text-xs"
                      style={deal.logoUrl ? { display: 'none' } : {}}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {deal.company || deal.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {deal.city}, {deal.country}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <CategoryChip category={deal.category} size="sm" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ₹{deal.price.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {deal.capRate?.toFixed(1)}%
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span className={deal.discountPct && deal.discountPct > 0 ? 'text-green-600' : ''}>
                  {deal.discountPct?.toFixed(1) || '0.0'}%
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`text-sm ${riskStyles[deal.risk] || ''}`}>
                  {deal.risk.charAt(0).toUpperCase() + deal.risk.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {calculateProfitabilityScore(deal).toFixed(1)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRowClick(deal.id);
                  }}
                >
                  Open
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Helper function to calculate profitability score (0-100)
function calculateProfitabilityScore(deal: Property): number {
  // Base score components (adjust weights as needed)
  const capRateScore = (deal.capRate || 0) * 5; // Higher cap rate is better
  const discountScore = (deal.discountPct || 0) * 2; // Higher discount is better
  const riskPenalty = deal.risk === 'high' ? -20 : deal.risk === 'medium' ? -10 : 0;
  
  // Calculate base score (0-100)
  let score = Math.min(100, Math.max(0, 50 + capRateScore + discountScore + riskPenalty));
  
  // Ensure score is within bounds
  return Math.round(score * 10) / 10; // Round to 1 decimal place
}
