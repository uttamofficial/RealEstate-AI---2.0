import { cn } from "@/lib/utils";
import { Property, RiskLevel } from "@/types/property";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader } from "./ui/card";
import { formatMoneyDisplay, formatPct, getMarketCurrency } from "@/lib/format";
import { profitabilityScore } from "@/lib/scoring";

interface DealCardProps {
  deal: Property;
  className?: string;
}

const RiskBadge = ({ risk }: { risk: RiskLevel }) => {
  const riskStyles = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
    all: "bg-gray-100 text-gray-800",
  };

  return (
    <Badge className={cn("capitalize", riskStyles[risk])}>
      {risk} Risk
    </Badge>
  );
};

const formatCurrency = (value: number, currency?: string) => {
  return formatMoneyDisplay(value, currency);
};

const calculateProfitabilityScore = (deal: Property): number => {
  return profitabilityScore(deal) * 100; // Convert to 0-100 scale for display
};

export function DealCard({ deal, className }: DealCardProps) {
  const profitabilityScore = calculateProfitabilityScore(deal);
  const dealCurrency = deal.currency || getMarketCurrency(deal.marketId);
  const scoreColor = profitabilityScore >= 80 ? 'bg-green-500' : 
                    profitabilityScore >= 60 ? 'bg-blue-500' : 
                    'bg-amber-500';

  return (
    <Card className={cn("h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow", className)}>
      <div className="relative h-48 w-full">
        <Image
          src={deal.images?.[0] || "/placeholder-property.jpg"}
          alt={deal.title || "Property image"}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2">
          <RiskBadge risk={deal.risk} />
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-1">
          {deal.logoUrl && (
            <div className="relative h-6 w-6">
              <Image
                src={deal.logoUrl}
                alt={deal.company || ""}
                fill
                className="rounded-full object-cover"
              />
            </div>
          )}
          <h3 className="font-semibold line-clamp-1">{deal.title}</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          {deal.city}, {deal.country}
        </p>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          <div>
            <p className="text-muted-foreground">Price</p>
            <p className="font-medium">{formatCurrency(deal.price, dealCurrency)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Cap Rate</p>
            <p className="font-medium">{deal.capRate ? formatPct(deal.capRate * 100) : 'N/A'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Discount</p>
            <p className="font-medium text-green-600">
              {deal.discountPct ? formatPct(deal.discountPct) : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Category</p>
            <Badge variant="outline" className="capitalize">
              {deal.category.replace(/_/g, ' ')}
            </Badge>
          </div>
        </div>

        <div className="mt-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-muted-foreground">Profitability</span>
            <span className="text-sm font-medium">{profitabilityScore}/100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${scoreColor}`}
              style={{ width: `${profitabilityScore}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
