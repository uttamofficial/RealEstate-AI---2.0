"use client";

import { useState, useMemo } from "react";
import type { RankedDeal } from "@/lib/types";
import DealCard from "./deal-card";
import { Button } from "./ui/button";
import { ArrowDown, ArrowUp, Zap } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type SortKey = "score" | "roi";
type SortDirection = "asc" | "desc";

interface DealViewProps {
  initialDeals: RankedDeal[];
  marketInsights: string;
}

export default function DealView({ initialDeals, marketInsights }: DealViewProps) {
  const [deals, setDeals] = useState<RankedDeal[]>(initialDeals);
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const sortedDeals = useMemo(() => {
    return [...deals].sort((a, b) => {
      if (sortDirection === "asc") {
        return a[sortKey] - b[sortKey];
      }
      return b[sortKey] - a[sortKey];
    });
  }, [deals, sortKey, sortDirection]);
  
  const hyperDeals = sortedDeals.slice(0, 3);
  const otherDeals = sortedDeals.slice(3);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  };

  const SortButton = ({ a_sortKey, label }: { a_sortKey: SortKey, label: string }) => (
    <Button
      variant={sortKey === a_sortKey ? "secondary" : "ghost"}
      onClick={() => handleSort(a_sortKey)}
      className="flex items-center gap-2 transition-colors"
    >
      {label}
      {sortKey === a_sortKey && (
        sortDirection === 'desc' ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />
      )}
    </Button>
  );

  return (
    <div className="space-y-12">
      <section>
        <div className="flex items-center mb-6">
          <Zap className="w-8 h-8 text-primary mr-3" />
          <h2 className="font-headline text-3xl font-bold text-foreground">
            Hyper Deals
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {hyperDeals.map((deal, index) => (
              <motion.div
                key={deal.taxData}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <DealCard deal={deal} marketInsights={marketInsights} isHyperDeal />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      <section>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="font-headline text-3xl font-bold text-foreground">
            Market Opportunities
          </h2>
          <div className="bg-card/60 p-1 flex items-center gap-1 rounded-full border">
            <SortButton a_sortKey="score" label="AI Score" />
            <SortButton a_sortKey="roi" label="ROI" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <AnimatePresence>
            {otherDeals.map((deal, index) => (
              <motion.div
                key={deal.taxData}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (index + hyperDeals.length) * 0.05 }}
              >
                <DealCard deal={deal} marketInsights={marketInsights} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
