"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, Shield, Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.1),transparent_50%)]" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Enhanced Title with Better Visibility */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight"
        >
          <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            AI-Powered Real Estate
          </span>
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Investment Intelligence
          </span>
        </motion.h1>

        {/* Enhanced Subtitle with Better Contrast */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl lg:text-3xl text-white/95 font-medium mb-8 max-w-4xl mx-auto leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
        >
          Discover high-yield investment opportunities with AI-driven analysis, 
          market insights, and predictive scoring for smarter real estate decisions.
        </motion.p>

        {/* Enhanced CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-8 py-4 text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
            onClick={() => window.location.href = '/ai-assistant'}
          >
            <Search className="w-5 h-5 mr-2" />
            Try AI Assistant
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 font-semibold px-8 py-4 text-lg shadow-2xl transition-all duration-300 transform hover:scale-105"
            onClick={() => window.location.href = '/deals'}
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            Explore Deals
          </Button>
        </motion.div>

        {/* Enhanced Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {/* AI Analysis Card */}
          <motion.div
            whileHover={{ y: -10, scale: 1.05 }}
            className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-cyan-400/50 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                AI Real Estate Assistant
              </h3>
              <p className="text-white/90 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Interactive AI chatbot that provides instant property analysis, market insights, and personalized investment recommendations.
              </p>
            </div>
          </motion.div>

          {/* Market Intelligence Card */}
          <motion.div
            whileHover={{ y: -10, scale: 1.05 }}
            className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-green-400/50 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Market Intelligence
              </h3>
              <p className="text-white/90 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Get real-time market trends, migration patterns, and economic indicators for informed decisions.
              </p>
            </div>
          </motion.div>

          {/* Risk Assessment Card */}
          <motion.div
            whileHover={{ y: -10, scale: 1.05 }}
            className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Risk Assessment
              </h3>
              <p className="text-white/90 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Comprehensive risk analysis with ROI projections, cap rates, and break-even timelines.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-4 h-4 bg-cyan-400 rounded-full opacity-60"
      />
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-3/4 right-1/4 w-3 h-3 bg-purple-400 rounded-full opacity-60"
      />
    </div>
  );
}
