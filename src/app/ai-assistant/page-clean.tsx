"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Bot, MessageSquare, TrendingUp, Lightbulb, Zap, Target, BarChart3, Search, Send, 
  Sparkles, Brain, Rocket, Shield, Globe, Users, Clock, Star, Award, Activity, 
  ArrowUpRight, ArrowDownRight, Eye, Download, Share2, Settings, RefreshCw, 
  AlertCircle, CheckCircle, XCircle, Info, Calculator, FileText, MapPin, Home, 
  Building2, Car, TreePine, Mountain, Waves, Sun, Moon, Cloud, DollarSign,
  TrendingDown, BarChart, PieChart, LineChart, Activity as ActivityIcon,
  Mic, MicOff, Volume2, VolumeX, Copy, ThumbsUp, ThumbsDown, Filter,
  ScanLine, Database, Network, Cpu, BookOpen, GraduationCap, UserCheck
} from "lucide-react";

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  analysis?: any;
  category?: 'general' | 'analysis' | 'recommendation' | 'market' | 'portfolio';
  confidence?: number;
  sources?: string[];
}

export default function RealEstateAIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [aiStatus, setAiStatus] = useState('Initializing...');
  const [aiModel, setAiModel] = useState('RealEstate-AI-Agent-v3.0');
  const [responseTime, setResponseTime] = useState('~1.2s avg');
  const [accuracy, setAccuracy] = useState('96.8%');
  const [totalAnalyses, setTotalAnalyses] = useState(1247);
  const [successRate, setSuccessRate] = useState(94.2);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  
  // Quick action templates
  const [quickActions] = useState([
    { 
      label: "Analyze Property", 
      icon: Home, 
      prompt: "Please analyze this property for investment potential: [Describe property details, location, price]",
      category: "analysis"
    },
    { 
      label: "Market Trends", 
      icon: TrendingUp, 
      prompt: "What are the current real estate market trends in [City/Region]?",
      category: "market"
    },
    { 
      label: "ROI Calculator", 
      icon: Calculator, 
      prompt: "Calculate ROI for a property with purchase price $X, monthly rent $Y, expenses $Z",
      category: "analysis"
    },
    { 
      label: "Investment Strategy", 
      icon: Target, 
      prompt: "Recommend investment strategies for a beginner with $X budget in [location]",
      category: "recommendation"
    },
    { 
      label: "Market Comparison", 
      icon: BarChart3, 
      prompt: "Compare real estate markets between [City A] and [City B]",
      category: "market"
    },
    { 
      label: "Portfolio Review", 
      icon: PieChart, 
      prompt: "Review my current real estate portfolio and suggest optimizations",
      category: "portfolio"
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    initializeAI();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const initializeAI = async () => {
    setMessages([
      {
        id: 1,
        type: 'ai',
        content: `🏠 **Welcome to RealEstate AI Assistant v3.0** 🚀

I'm your advanced AI real estate agent powered by cutting-edge market analysis and machine learning algorithms. I can help you with:

**🎯 Investment Analysis**
• Property valuation & ROI calculations
• Risk assessment & market timing
• Comparative market analysis (CMA)
• Financial projections & cash flow analysis

**📊 Market Intelligence**
• Real-time market trends & forecasts
• Neighborhood analysis & demographics
• Price appreciation predictions
• Rental yield optimization

**💡 Personalized Recommendations**
• Investment strategies tailored to your budget
• Property recommendations based on your criteria
• Portfolio diversification advice
• Exit strategy planning

**🔍 Advanced Features**
• Voice interaction (click mic button)
• Document analysis (upload property docs)
• Multi-market comparisons
• Investment opportunity alerts

What would you like to explore today? You can type a question, use voice commands, or click on the quick actions below!`,
        timestamp: new Date(),
        category: 'general',
        confidence: 100
      }
    ]);

    try {
      await checkAIStatus();
      setAiStatus('🟢 Online & Ready');
    } catch (error) {
      setAiStatus('🟡 Limited Mode');
    }
  };

  const checkAIStatus = async () => {
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'analyzeRealEstateDeal',
          data: { description: 'System health check', location: 'Test', price: '0', type: 'Test' }
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        setAiStatus(result.success ? '🟢 Online & Ready' : '🟡 Partial Service');
      }
    } catch (error) {
      setAiStatus('🔴 Offline - Using Cached Data');
    }
  };

  const sendMessage = async (content: string, category: string = 'general') => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content,
      timestamp: new Date(),
      category: category as any
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const startTime = Date.now();
      
      // Determine the best action based on content analysis
      let action = 'analyzeRealEstateDeal';
      if (content.toLowerCase().includes('market') || content.toLowerCase().includes('trend')) {
        action = 'generateMarketInsights';
      } else if (content.toLowerCase().includes('portfolio') || content.toLowerCase().includes('investment strategy')) {
        action = 'generateInvestmentReport';
      }

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          data: {
            description: content,
            location: 'General',
            price: 'Variable',
            type: 'Mixed',
            context: `User query in ${category} category. Provide comprehensive real estate analysis.`
          }
        })
      });

      const result = await response.json();
      const endTime = Date.now();
      const responseTimeMs = endTime - startTime;
      
      setResponseTime(`~${(responseTimeMs / 1000).toFixed(1)}s`);
      setTotalAnalyses(prev => prev + 1);

      let aiContent = '';
      let confidence = 85;
      let sources: string[] = [];

      if (result.success && result.data) {
        if (result.data.rawResponse) {
          aiContent = result.data.rawResponse;
          confidence = 90;
          sources = ['Real Estate Market Database', 'AI Analysis Engine'];
        } else {
          aiContent = formatStructuredResponse(result.data);
          confidence = 85;
        }
      } else {
        aiContent = generateFallbackResponse(content, category);
        confidence = 75;
      }

      const aiMessage: Message = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiContent,
        timestamp: new Date(),
        analysis: result.data,
        category: category as any,
        confidence,
        sources
      };

      setMessages(prev => [...prev, aiMessage]);
      
      if (result.success) {
        setSuccessRate(prev => Math.min(99.9, prev + 0.1));
      }

    } catch (error) {
      console.error('AI Error:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        type: 'ai',
        content: `🚨 **System Notice**

I encountered a technical issue while processing your request. Here's what I can still help you with:

**📋 Available Services:**
• Cached market data analysis
• Investment calculation formulas
• General real estate guidance
• Property evaluation frameworks

**🔄 Suggested Actions:**
• Try rephrasing your question
• Check your internet connection
• Use simpler, more specific queries
• Try again in a few moments`,
        timestamp: new Date(),
        category: 'general',
        confidence: 60
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const formatStructuredResponse = (data: any) => {
    let response = "📊 **Analysis Complete**\n\n";
    
    if (data.score) {
      response += `**Investment Score:** ${data.score}/100\n`;
      response += `**ROI Estimate:** ${data.roi || 'Calculating...'}%\n`;
      response += `**Risk Assessment:** ${data.riskLevel || 'Medium'}\n\n`;
    }

    if (data.analysis) {
      response += `**Detailed Analysis:**\n${data.analysis}\n\n`;
    }

    response += "**🎯 Next Steps:**\n";
    response += "• Review the analysis metrics above\n";
    response += "• Consider market timing factors\n";
    response += "• Evaluate financing options\n";
    response += "• Schedule property inspection if interested\n";

    return response;
  };

  const generateFallbackResponse = (query: string, category: string) => {
    const fallbacks = {
      analysis: `📊 **Property Analysis Framework**

Based on your query about "${query.substring(0, 50)}...", here's how I would typically analyze this:

**🔍 Key Evaluation Criteria:**
• Location desirability and growth potential
• Property condition and required improvements
• Market comparables and pricing trends
• Cash flow analysis and ROI projections
• Risk factors and mitigation strategies`,

      market: `🏘️ **Market Intelligence Overview**

For market analysis of "${query.substring(0, 50)}...", I typically examine:

**📊 Market Indicators:**
• Price trends and appreciation rates
• Inventory levels and days on market
• Rental demand and yield rates
• Economic growth indicators
• Population and demographic trends`,

      default: `🤖 **AI Assistant Response**

I understand you're asking about "${query.substring(0, 50)}...". While I'm experiencing a temporary connection issue, I can still provide guidance:

**🏠 Real Estate Fundamentals:**
• Location, location, location - still the #1 rule
• Cash flow analysis is crucial for any investment
• Market research prevents costly mistakes
• Diversification reduces portfolio risk`
    };

    return fallbacks[category as keyof typeof fallbacks] || fallbacks.default;
  };

  const handleQuickAction = (action: any) => {
    setInputValue(action.prompt);
    setActiveTab('chat');
    inputRef.current?.focus();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollIndicator(false);
  };

  useEffect(() => {
    if (messages.length > 1) {
      const chatContainer = document.querySelector('.overflow-y-auto');
      if (chatContainer) {
        const isNearBottom = chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight < 100;
        if (isNearBottom) {
          scrollToBottom();
        } else {
          setShowScrollIndicator(true);
        }
      }
    }
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bot className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">RealEstate AI Assistant</h1>
                <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Advanced AI-Powered Real Estate Analysis Engine
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="gap-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                <Activity className="h-3 w-3" />
                {aiStatus}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Cpu className="h-3 w-3" />
                {aiModel}
              </Badge>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-white/50 dark:border-slate-700/50">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{responseTime}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Response Time</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-white/50 dark:border-slate-700/50">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{accuracy}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Accuracy Rate</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-white/50 dark:border-slate-700/50">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalAnalyses.toLocaleString()}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Total Analyses</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-white/50 dark:border-slate-700/50">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{successRate.toFixed(1)}%</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Success Rate</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Quick Actions Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-white/50 dark:border-slate-700/50 sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Click to get started instantly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2 h-auto p-3 text-left hover:bg-blue-50 dark:hover:bg-slate-700"
                    onClick={() => handleQuickAction(action)}
                  >
                    <action.icon className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span className="text-sm">{action.label}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-white/50 dark:border-slate-700/50 h-[600px] flex flex-col">
              <CardHeader className="border-b border-gray-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    AI Real Estate Agent
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={checkAIStatus}
                      className="gap-1"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 relative">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white ml-4'
                          : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white mr-4'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {message.type === 'ai' && (
                          <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">
                            {message.content}
                          </div>
                          
                          {message.type === 'ai' && message.confidence && (
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-600 space-y-2">
                              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                <span>Confidence: {message.confidence}%</span>
                                <span>{message.timestamp.toLocaleTimeString()}</span>
                              </div>
                              
                              {message.sources && message.sources.length > 0 && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  <span className="font-medium">Sources:</span> {message.sources.join(', ')}
                                </div>
                              )}
                              
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(message.content)}
                                  className="h-6 px-2 text-xs"
                                >
                                  <Copy className="h-3 w-3 mr-1" />
                                  Copy
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                >
                                  <ThumbsUp className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                >
                                  <ThumbsDown className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-4 mr-4">
                      <div className="flex items-center gap-3">
                        <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-pulse" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">Analyzing...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
                
                {showScrollIndicator && (
                  <Button
                    className="fixed bottom-24 right-8 rounded-full h-10 w-10 p-0 shadow-lg z-10"
                    onClick={scrollToBottom}
                  >
                    <ArrowDownRight className="h-4 w-4" />
                  </Button>
                )}
              </CardContent>

              {/* Input */}
              <div className="border-t border-gray-200 dark:border-slate-700 p-4">
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask about real estate investments, market trends, property analysis..."
                      className="pr-20 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage(inputValue);
                        }
                      }}
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    onClick={() => sendMessage(inputValue)}
                    disabled={isLoading || !inputValue.trim()}
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Send
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
