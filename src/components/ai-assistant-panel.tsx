"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Bot, TrendingUp, AlertTriangle, Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MarketInsight {
  id: string;
  type: 'deal' | 'trend' | 'alert' | 'opportunity';
  message: string;
  icon: React.ReactNode;
  priority: 'high' | 'medium' | 'low';
}

interface AIAssistantPanelProps {
  insights: MarketInsight[];
  isVisible?: boolean;
  onToggle?: () => void;
}

export default function AIAssistantPanel({ insights, isVisible = true, onToggle }: AIAssistantPanelProps) {
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (insights.length > 1) {
      const interval = setInterval(() => {
        setCurrentInsightIndex((prev) => (prev + 1) % insights.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [insights.length]);

  const getInsightIcon = (type: MarketInsight['type']) => {
    switch (type) {
      case 'deal':
        return <Zap className="w-4 h-4 text-cyan-400" />;
      case 'trend':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'opportunity':
        return <Bot className="w-4 h-4 text-purple-400" />;
      default:
        return <Bot className="w-4 h-4 text-blue-400" />;
    }
  };

  const getPriorityColor = (priority: MarketInsight['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-red-400/50 shadow-red-400/20';
      case 'medium':
        return 'border-yellow-400/50 shadow-yellow-400/20';
      case 'low':
        return 'border-blue-400/50 shadow-blue-400/20';
      default:
        return 'border-blue-400/50 shadow-blue-400/20';
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.div
          className={`relative backdrop-blur-md rounded-2xl border-2 transition-all duration-300 ${
            isExpanded ? 'w-96 h-auto min-h-40' : 'w-80 h-24'
          } ${getPriorityColor(insights[currentInsightIndex]?.priority || 'low')}`}
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))',
            boxShadow: `0 0 30px ${getPriorityColor(insights[currentInsightIndex]?.priority || 'low').includes('red') ? 'rgba(248, 113, 113, 0.3)' : 
              getPriorityColor(insights[currentInsightIndex]?.priority || 'low').includes('yellow') ? 'rgba(251, 191, 36, 0.3)' : 
              'rgba(59, 130, 246, 0.3)'}`
          }}
        >
          {/* Holographic Border Effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/10 via-transparent to-blue-400/10 opacity-50" />
          
          {/* Header - Always visible */}
          <div className="relative z-10 p-3 border-b border-slate-600/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="w-7 h-7 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0"
                >
                  <Bot className="w-4 h-4 text-white" />
                </motion.div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-white text-sm truncate">AI Market Assistant</h3>
                  <p className="text-xs text-slate-300 truncate">Live Intelligence Feed</p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-slate-300 hover:text-white hover:bg-slate-700/50 h-7 w-7 p-0"
                >
                  {isExpanded ? '−' : '+'}
                </Button>
                {onToggle && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onToggle}
                    className="text-slate-300 hover:text-white hover:bg-slate-700/50 h-7 w-7 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Content - Show when expanded with smooth transitions */}
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 p-3 overflow-hidden"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getInsightIcon(insights[currentInsightIndex]?.type || 'opportunity')}
                </div>
                <div className="flex-1 min-w-0">
                  <motion.p
                    key={currentInsightIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm text-slate-200 leading-relaxed break-words"
                  >
                    {insights[currentInsightIndex]?.message || 'No insights available'}
                  </motion.p>
                  <div className="mt-3 pt-3 border-t border-slate-600/30">
                    <div className="text-xs text-slate-400 space-y-1">
                      <p>Priority: <span className="capitalize">{insights[currentInsightIndex]?.priority || 'low'}</span></p>
                      <p>Updated: {new Date().toLocaleTimeString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Progress Indicator - Always visible at bottom */}
          {insights.length > 1 && (
            <div className="absolute bottom-2 left-3 right-3">
              <div className="flex gap-1 justify-center">
                {insights.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      index === currentInsightIndex ? 'bg-cyan-400' : 'bg-slate-600'
                    }`}
                    style={{
                      width: index === currentInsightIndex ? '32px' : '6px'
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
