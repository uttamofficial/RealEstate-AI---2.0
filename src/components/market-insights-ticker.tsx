"use client";
import { Building } from "lucide-react";

export default function MarketInsightsTicker({ insights }: { insights: string[] }) {
  if (!insights || insights.length === 0) {
    return null;
  }
  const extendedInsights = [...insights, ...insights, ...insights];
  return (
    <div className="relative flex overflow-hidden bg-card p-2 rounded-md border">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pr-2 bg-card z-10">
         <Building className="w-5 h-5 text-primary" />
      </div>
      <div className="flex animate-ticker whitespace-nowrap pl-12">
        {extendedInsights.map((insight, index) => (
          <span key={index} className="text-sm text-foreground mx-4 font-medium">
             {insight} <span className="text-primary mx-2">&#x25C6;</span>
          </span>
        ))}
      </div>
       <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-card to-transparent z-10"/>
       <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-card to-transparent z-10"/>
    </div>
  );
}
