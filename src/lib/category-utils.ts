import { DealCategory } from '@/types/property';

type CategoryConfig = {
  label: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  description: string;
  tooltip: string;
};

export const CATEGORY_CONFIG: Record<DealCategory, CategoryConfig> = {
  'cap_rate_arbitrage': {
    label: 'Cap Rate Arbitrage',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200',
    description: 'Properties with cap rates above market average',
    tooltip: 'Focus on cash flow and yield optimization'
  },
  'mispriced': {
    label: 'Mispriced',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-800',
    borderColor: 'border-purple-200',
    description: 'Properties trading below estimated fair value',
    tooltip: 'Balanced approach to value and yield'
  },
  'distressed': {
    label: 'Distressed',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-800',
    borderColor: 'border-amber-200',
    description: 'Properties requiring quick sale or turnaround',
    tooltip: 'Higher discount focus - potential for significant value appreciation'
  }
};

export const DEFAULT_CATEGORIES: DealCategory[] = ['cap_rate_arbitrage', 'mispriced'];

export function getCategoryConfig(category: DealCategory): CategoryConfig {
  return CATEGORY_CONFIG[category] || {
    label: category,
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-800',
    borderColor: 'border-gray-200'
  };
}

export function getCategoryLabel(category: DealCategory): string {
  return getCategoryConfig(category).label;
}

export function getCategoryDescription(category: DealCategory): string {
  return getCategoryConfig(category).description;
}

export function getCategoryTooltip(category: DealCategory): string {
  return getCategoryConfig(category).tooltip;
}

export function getCategoryStats(deals: { category: DealCategory }[]) {
  const stats = {
    total: deals.length,
    byCategory: {} as Record<DealCategory, { count: number; percentage: number }>,
    avgScores: {
      capRate: 0,
      discount: 0,
      risk: 0
    }
  };

  // Initialize category counts
  Object.keys(CATEGORY_CONFIG).forEach(category => {
    stats.byCategory[category as DealCategory] = { count: 0, percentage: 0 };
  });

  // Count deals by category
  deals.forEach(deal => {
    if (stats.byCategory[deal.category]) {
      stats.byCategory[deal.category].count += 1;
    }
  });

  // Calculate percentages
  Object.keys(stats.byCategory).forEach(category => {
    const cat = category as DealCategory;
    stats.byCategory[cat].percentage = Math.round((stats.byCategory[cat].count / stats.total) * 100);
  });

  // Calculate average scores (simplified example)
  if (deals.length > 0) {
    const totals = deals.reduce((acc, deal) => {
      const d = deal as any; // Type assertion for simplicity
      return {
        capRate: acc.capRate + (d.capRate || 0),
        discount: acc.discount + (d.discountPct || 0),
        risk: acc.risk + (d.risk === 'high' ? 1 : d.risk === 'medium' ? 0.5 : 0)
      };
    }, { capRate: 0, discount: 0, risk: 0 });

    stats.avgScores = {
      capRate: totals.capRate / deals.length,
      discount: totals.discount / deals.length,
      risk: totals.risk / deals.length
    };
  }

  return stats;
}
