import { DealCategory } from '@/types/property';
import { getCategoryConfig, getCategoryTooltip } from '@/lib/category-utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CategoryChipProps {
  category: DealCategory;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export function CategoryChip({ category, className = '', size = 'md', showTooltip = true }: CategoryChipProps) {
  const config = getCategoryConfig(category);
  const tooltip = getCategoryTooltip(category);
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  const chipElement = (
    <span
      className={`inline-flex items-center rounded-full border ${config.bgColor} ${config.textColor} ${config.borderColor} ${sizeClasses[size]} font-medium ${className}`}
    >
      {config.label}
    </span>
  );

  if (!showTooltip) {
    return chipElement;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {chipElement}
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
