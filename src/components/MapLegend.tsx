'use client';

import { cn } from '@/lib/utils';

type RiskLevel = 'high' | 'medium' | 'low';
type DealCategory = 'cap_rate_arbitrage' | 'mispriced' | 'distressed';

const RISK_COLORS: Record<RiskLevel, string> = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500',
};

const CATEGORY_INFO: Record<DealCategory, { color: string; icon: string; label: string }> = {
  cap_rate_arbitrage: { color: '#10b981', icon: '📊', label: 'Cap Rate Arbitrage' },
  mispriced: { color: '#f59e0b', icon: '💰', label: 'Mispriced' },
  distressed: { color: '#ef4444', icon: '🏚️', label: 'Distressed Sale' },
};

interface MapLegendProps {
  className?: string;
  showRiskLevels?: boolean;
  showCategories?: boolean;
  showClusters?: boolean;
  showBuildings?: boolean;
}

export function MapLegend({
  className,
  showRiskLevels = true,
  showCategories = true,
  showClusters = true,
  showBuildings = true,
}: MapLegendProps) {
  return (
    <div className={cn(
      'bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 text-sm text-gray-700',
      'border border-gray-200 max-w-xs',
      className
    )}>
      <h3 className="font-semibold mb-3 text-gray-800 text-xs uppercase tracking-wider">Map Legend</h3>
      
      {showCategories && (
        <div className="mb-3">
          <h4 className="font-medium text-xs uppercase tracking-wider text-gray-500 mb-2">Property Types</h4>
          <div className="space-y-1">
            {Object.entries(CATEGORY_INFO).map(([category, info]) => (
              <div key={category} className="flex items-center text-xs">
                <div 
                  className="w-3 h-3 rounded-full mr-2 border border-white"
                  style={{ backgroundColor: info.color }}
                />
                <span className="text-xs">{info.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showRiskLevels && (
        <div className="mb-3">
          <h4 className="font-medium text-xs uppercase tracking-wider text-gray-500 mb-2">Risk Level</h4>
          <div className="space-y-1">
            {Object.entries(RISK_COLORS).map(([level, color]) => (
              <div key={level} className="flex items-center text-xs">
                <div className={cn('w-3 h-3 rounded-full mr-2', color)} />
                <span className="capitalize">{level} Risk</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showClusters && (
        <div className="mb-2">
          <h4 className="font-medium text-xs uppercase tracking-wider text-gray-500 mb-2">Clusters</h4>
          <div className="space-y-1">
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full mr-2 bg-green-400 border border-green-600" />
              <span>1-9 properties</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full mr-2 bg-yellow-400 border border-yellow-600" />
              <span>10-99 properties</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full mr-2 bg-orange-400 border border-orange-600" />
              <span>100+ properties</span>
            </div>
          </div>
        </div>
      )}

      {showBuildings && (
        <div className="mb-3">
          <h4 className="font-medium text-xs uppercase tracking-wider text-gray-500 mb-2">Buildings</h4>
          <div className="space-y-1">
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full mr-2 bg-slate-400 border border-slate-600 opacity-70" />
              <span>Other Buildings</span>
            </div>
            <div className="text-xs text-gray-400 ml-5">
              (Background visualization)
            </div>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
        Click markers for details
      </div>
    </div>
  );
}
