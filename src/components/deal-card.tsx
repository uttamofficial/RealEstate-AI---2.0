"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { AreaChart, Bot, FileText, Gauge, Loader2, MapPin, DollarSign, TrendingUp, Calendar } from "lucide-react";
import { createReport } from "@/lib/actions";
import type { RankedDeal, InvestmentReportInput, InvestmentReportOutput } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import InvestmentScoreRing from "./investment-score-ring";
import DealReportModal from "./deal-report-modal";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ImageService } from "@/lib/image-service";

interface DealCardProps {
  deal: RankedDeal;
  marketInsights: string;
  isHyperDeal?: boolean;
}

export default function DealCard({ deal, marketInsights, isHyperDeal = false }: DealCardProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<InvestmentReportOutput | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [propertyImage, setPropertyImage] = useState<string>("");
  const [imageError, setImageError] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadPropertyImage = async () => {
      const imageUrl = ImageService.getPropertyImageByType(deal.dealCategory || "house", deal.address);
      setPropertyImage(imageUrl);
      setImageError(false);
    };
    
    loadPropertyImage();
  }, [deal.dealCategory, deal.address]);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    const reportInput: InvestmentReportInput = {
      propertyAddress: deal.address,
      propertyDetails: deal.mlsListing || deal.offMarketListing || "No details available.",
      marketAnalysis: marketInsights,
      financialData: `NOI: $${deal.noi.toLocaleString()}, Cap Rate: ${deal.capRate}%, ROI: ${deal.roi}%`,
      mlsListing: deal.mlsListing,
      offMarketListing: deal.offMarketListing,
      taxData: deal.taxData,
      zoningInsights: deal.zoningInsights,
    };

    const result = await createReport(reportInput);

    if (result.success && result.report) {
      setReport(result.report);
      setIsModalOpen(true);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "Could not generate the report.",
      });
    }
    setIsGenerating(false);
  };
  
  const cardVariants = {
    hover: { scale: 1.02, y: -4, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" },
    initial: { scale: 1, y: 0, boxShadow: "0 4px 6px rgba(0,0,0,0.05)" },
  };

  const getDealCategoryIcon = () => {
    const category = deal.dealCategory?.toLowerCase();
    if (category?.includes("flip")) {
      return <Gauge className="w-4 h-4 text-orange-600" />;
    }
    if (category?.includes("rental")) {
      return <AreaChart className="w-4 h-4 text-green-600" />;
    }
    if (category?.includes("luxury")) {
      return <Bot className="w-4 h-4 text-purple-600" />;
    }
    return <Bot className="w-4 h-4 text-blue-600" />;
  };

  return (
    <>
      <motion.div
        variants={cardVariants}
        whileHover="hover"
        initial="initial"
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={cn(
          "group relative p-5 rounded-xl flex flex-col h-full backdrop-blur-sm",
          isHyperDeal 
            ? "bg-gradient-to-br from-blue-900/20 via-indigo-900/30 to-purple-900/20 border-2 border-cyan-400/50 shadow-[0_0_30px_rgba(34,211,238,0.3)]" 
            : "bg-gradient-to-br from-slate-900/20 via-gray-900/30 to-slate-900/20 border border-slate-700/50 shadow-lg"
        )}
        style={{
          backgroundImage: isHyperDeal 
            ? "radial-gradient(circle at 50% 0%, rgba(34,211,238,0.1) 0%, transparent 70%)"
            : "none"
        }}
      >
        {/* Holographic Glow Effect */}
        {isHyperDeal && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/10 via-transparent to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        )}
        
        {/* Animated Border Glow */}
        {isHyperDeal && (
          <motion.div
            className="absolute inset-0 rounded-xl border-2 border-cyan-400/30"
            animate={{
              boxShadow: [
                "0 0 20px rgba(34,211,238,0.3)",
                "0 0 40px rgba(34,211,238,0.5)",
                "0 0 20px rgba(34,211,238,0.3)"
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
        <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
          {propertyImage && !imageError ? (
            <Image
              src={propertyImage}
              alt={`${deal.address} - ${deal.dealCategory || 'Property'}`}
              fill
              className="group-hover:scale-105 transition-transform duration-300 object-cover"
              priority
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  {deal.address.split(',')[0]}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {deal.dealCategory || 'Property'}
                </p>
              </div>
            </div>
          )}
          
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          
          <Badge variant={isHyperDeal ? "default" : "secondary"} className="absolute top-3 right-3 z-10">
            {isHyperDeal ? "🔥 Hyper Deal" : "📊 Market Find"}
          </Badge>
          
          {/* Deal category badge */}
          <Badge variant="outline" className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-sm border-white/50 text-slate-800 font-medium">
            {deal.dealCategory || "AI Analyzed"}
          </Badge>
        </div>

        <div className="flex-grow flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-headline text-lg font-bold truncate text-foreground mb-1 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="truncate">{deal.address}</span>
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {deal.mlsListing || deal.offMarketListing}
              </p>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 my-4">
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">ROI</span>
              </div>
              <p className="font-bold text-xl text-green-600">{deal.roi}%</p>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">Break-even</span>
              </div>
              <p className="font-bold text-lg text-blue-600">{deal.breakEvenTimeline}</p>
            </div>
          </div>

          {/* Investment Score */}
          <div className="flex justify-center mb-4">
            <InvestmentScoreRing score={deal.score} />
          </div>
          
          {/* Profit Potential with Pulsing Animation */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Profit Potential</p>
              <motion.span 
                className="text-sm font-bold text-cyan-400"
                animate={{
                  textShadow: [
                    "0 0 5px rgba(34,211,238,0.5)",
                    "0 0 20px rgba(34,211,238,0.8)",
                    "0 0 5px rgba(34,211,238,0.5)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {deal.profitPotentialGauge}%
              </motion.span>
            </div>
            <div className="relative w-full bg-slate-700/50 rounded-full h-3 overflow-hidden backdrop-blur-sm">
              <motion.div 
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600"
                style={{ width: `${deal.profitPotentialGauge}%` }}
                animate={{
                  background: [
                    "linear-gradient(90deg, #22d3ee, #3b82f6, #6366f1)",
                    "linear-gradient(90deg, #06b6d4, #2563eb, #4f46e5)",
                    "linear-gradient(90deg, #22d3ee, #3b82f6, #6366f1)"
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              {/* Pulsing Glow Effect */}
              <motion.div
                className="absolute inset-0 rounded-full bg-cyan-400/20"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          </div>
          
          {/* Additional Metrics */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="text-center p-2 bg-muted/30 rounded-lg">
              <p className="text-xs text-slate-700 dark:text-slate-300">Cap Rate</p>
              <p className="font-bold text-sm text-foreground">{deal.capRate}%</p>
            </div>
            <div className="text-center p-2 bg-muted/30 rounded-lg">
              <p className="text-xs text-slate-700 dark:text-slate-300">NOI</p>
              <p className="font-bold text-sm text-foreground">${deal.noi.toLocaleString()}</p>
            </div>
          </div>
          
          {/* Bottom Action Area */}
          <div className="flex items-center justify-between text-sm text-slate-700 dark:text-slate-300 mt-auto pt-4 border-t border-border/50">
            <div className="flex items-center gap-2">
              {getDealCategoryIcon()}
              <span className="font-medium">{deal.dealCategory || "AI Analyzed"}</span>
            </div>
            <Button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              size="sm"
              variant="default"
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileText className="mr-2 h-4 w-4" />
              )}
              AI Report
            </Button>
          </div>
        </div>
      </motion.div>
      {report && (
        <DealReportModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          report={report}
          deal={deal}
        />
      )}
    </>
  );
}
