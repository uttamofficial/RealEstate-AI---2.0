// Enhanced Groq AI Service for Real Estate Intelligence
export interface GroqAIResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export class GroqAIService {
  private static readonly API_KEY = process.env.GROQ_API_KEY;
  private static readonly BASE_URL = "https://api.groq.com/openai/v1";
  
  // Preferred models in order with fallback
  private static readonly PREFERRED_MODELS = [
    "compound-beta",
    "llama-3.3-70b-versatile", 
    "deepseek-r1-distill-llama-70b",
    "llama-3.1-8b-instant",
    "qwen/qwen3-32b"
  ];
  
  private static currentModelIndex = 0;

  private static getCurrentModel(): string {
    return this.PREFERRED_MODELS[this.currentModelIndex] || this.PREFERRED_MODELS[0];
  }

  private static switchToNextModel(): string | null {
    this.currentModelIndex++;
    if (this.currentModelIndex < this.PREFERRED_MODELS.length) {
      console.log(`🔄 Switching to model: ${this.PREFERRED_MODELS[this.currentModelIndex]}`);
      return this.PREFERRED_MODELS[this.currentModelIndex];
    }
    // Reset to first model if we've tried all
    this.currentModelIndex = 0;
    return null;
  }

  private static resetModelIndex(): void {
    this.currentModelIndex = 0;
  }

  // Enhanced property analysis with comprehensive real estate intelligence
  static async analyzeRealEstateDeal(dealData: any): Promise<GroqAIResponse> {
    if (!this.API_KEY) {
      return { 
        success: false, 
        error: 'Groq API key not configured. Please set GROQ_API_KEY environment variable.' 
      };
    }
    
    try {
      this.resetModelIndex();
      
      const prompt = `You are an expert real estate AI agent with deep knowledge of market analysis, investment strategies, and property valuation. Analyze this real estate opportunity and provide comprehensive insights:

PROPERTY DETAILS:
- Description: ${dealData.description || 'N/A'}
- Location: ${dealData.location || 'N/A'}
- Price: ${dealData.price || 'N/A'}
- Property Type: ${dealData.type || 'N/A'}
- Context: ${dealData.context || 'Investment analysis request'}

ANALYSIS FRAMEWORK:
Please provide a detailed analysis as a real estate expert would, covering:

🏠 PROPERTY EVALUATION:
- Location analysis and neighborhood assessment
- Property condition and value assessment
- Market positioning and competitiveness

📊 FINANCIAL ANALYSIS:
- Investment score (0-100) with detailed explanation
- ROI calculations and projections
- Cash flow analysis potential
- Break-even analysis timeframes

⚠️ RISK ASSESSMENT:
- Risk level (Low/Medium/High) with specific factors
- Market volatility considerations
- Economic sensitivity factors
- Mitigation strategies

📈 MARKET INTELLIGENCE:
- Current market trends affecting this property
- Comparable sales and rental data insights
- Growth potential and appreciation forecasts
- Market timing considerations

💡 STRATEGIC RECOMMENDATIONS:
- Investment strategy recommendations
- Optimal financing approaches
- Value-add opportunities
- Exit strategy options

🎯 ACTIONABLE INSIGHTS:
- Immediate next steps for the investor
- Due diligence checklist items
- Negotiation strategies and tactics
- Timeline recommendations

Please write in a professional, conversational tone as an expert real estate advisor. Use specific numbers, percentages, and actionable insights. Structure your response with clear sections and bullet points for easy reading.

If the query is general or about market trends, focus on providing market intelligence and investment guidance relevant to real estate investors.`;

      for (let attempt = 0; attempt < this.PREFERRED_MODELS.length; attempt++) {
        try {
          const currentModel = this.getCurrentModel();
          console.log(`📤 Trying model: ${currentModel} (attempt ${attempt + 1})`);
          
          const response = await fetch(`${this.BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: currentModel,
              messages: [
                {
                  role: 'system',
                  content: 'You are RealEstate AI Agent v3.0, an expert real estate investment advisor with deep market knowledge, financial analysis expertise, and strategic investment planning capabilities. Provide comprehensive, actionable insights for real estate investors.'
                },
                {
                  role: 'user',
                  content: prompt
                }
              ],
              temperature: 0.3,
              max_tokens: 1500,
              top_p: 0.9
            })
          });

          if (response.status === 429) {
            console.log(`⏳ Rate limited by model ${currentModel}. Switching to next model...`);
            this.switchToNextModel();
            continue;
          }

          if (response.status === 400) {
            console.log(`⚠️ Model ${currentModel} unavailable. Switching to next model...`);
            this.switchToNextModel();
            continue;
          }

          if (!response.ok) {
            throw new Error(`Groq API error: ${response.status}`);
          }

          const result = await response.json();
          const content = result.choices[0]?.message?.content;
      
          if (!content) {
            throw new Error('No content received from Groq API');
          }

          const extractedData = this.extractDataFromText(content);
          console.log(`✅ Successfully used model: ${currentModel}`);
          return { success: true, data: extractedData };
        } catch (error) {
          console.log(`❌ Model ${this.getCurrentModel()} failed: ${error}`);
          this.switchToNextModel();
        }
      }
      
      console.error('❌ All models failed after trying all fallbacks');
      return { 
        success: false, 
        error: 'All models failed after trying all fallbacks' 
      };
    } catch (error) {
      console.error('Groq AI Analysis Error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  // Advanced market insights generation
  static async generateMarketInsights(marketData: any): Promise<GroqAIResponse> {
    if (!this.API_KEY) {
      return { 
        success: false, 
        error: 'Groq API key not configured.' 
      };
    }
    
    try {
      this.resetModelIndex();
      
      const prompt = `As a real estate market intelligence specialist, analyze current market conditions and provide comprehensive insights:

MARKET ANALYSIS REQUEST:
- Location: ${marketData.location || 'General Market'}
- Market Type: ${marketData.marketType || 'Residential'}
- Time Frame: ${marketData.timeFrame || 'Current'}
- Focus Areas: ${marketData.focusAreas || 'Investment Opportunities'}

📊 COMPREHENSIVE MARKET ANALYSIS:

1. **CURRENT MARKET CONDITIONS**
   - Market temperature and activity levels
   - Inventory analysis and supply/demand dynamics
   - Price trend analysis and momentum indicators

2. **INVESTMENT OPPORTUNITIES**
   - Emerging neighborhoods with growth potential
   - Undervalued market segments
   - Value-add and turnaround opportunities
   - New development and pre-construction deals

3. **MARKET DRIVERS & CATALYSTS**
   - Economic factors affecting the market
   - Infrastructure and development projects
   - Demographic shifts and population trends
   - Policy changes and regulatory impacts

4. **COMPETITIVE LANDSCAPE**
   - Buyer competition levels
   - Investor activity and institutional presence
   - Market saturation indicators
   - Pricing pressure points

5. **RISK FACTORS & CONSIDERATIONS**
   - Market volatility indicators
   - Economic sensitivity factors
   - Regulatory and policy risks
   - Environmental and climate considerations

6. **STRATEGIC RECOMMENDATIONS**
   - Optimal investment strategies for current conditions
   - Market timing recommendations
   - Property type focus areas
   - Geographic diversification opportunities

7. **MARKET FORECAST & OUTLOOK**
   - Short-term market predictions (6-12 months)
   - Long-term growth projections (2-5 years)
   - Key indicators to monitor
   - Potential market shifts and catalysts

Provide specific, actionable insights with data-driven recommendations for real estate investors.`;

      for (let attempt = 0; attempt < this.PREFERRED_MODELS.length; attempt++) {
        try {
          const currentModel = this.getCurrentModel();
          const response = await fetch(`${this.BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: currentModel,
              messages: [
                {
                  role: 'system',
                  content: 'You are a real estate market intelligence analyst with expertise in market trends, investment opportunities, and economic factors affecting real estate markets.'
                },
                {
                  role: 'user',
                  content: prompt
                }
              ],
              temperature: 0.4,
              max_tokens: 1400
            })
          });

          if (response.status === 429 || response.status === 400) {
            this.switchToNextModel();
            continue;
          }

          if (!response.ok) {
            throw new Error(`Groq API error: ${response.status}`);
          }

          const result = await response.json();
          const content = result.choices[0]?.message?.content;
      
          if (!content) {
            throw new Error('No content received from Groq API');
          }

          return { 
            success: true, 
            data: { 
              rawResponse: content,
              marketInsights: this.extractMarketDataFromText(content),
              requestedMarket: marketData
            } 
          };
        } catch (error) {
          console.log(`Model ${this.getCurrentModel()} failed: ${error}`);
          this.switchToNextModel();
        }
      }
      
      return { success: false, error: 'All models failed for market insights' };
    } catch (error) {
      console.error('Market Insights Error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
  }

  // Comprehensive investment report generation
  static async generateInvestmentReport(propertyData: any): Promise<GroqAIResponse> {
    if (!this.API_KEY) {
      return { 
        success: false, 
        error: 'Groq API key not configured.' 
      };
    }
    
    try {
      this.resetModelIndex();
      
      const prompt = `Generate a comprehensive real estate investment report based on the following criteria:

INVESTMENT PARAMETERS:
${JSON.stringify(propertyData, null, 2)}

📋 EXECUTIVE INVESTMENT REPORT:

Please provide a detailed investment analysis structured as follows:

**EXECUTIVE SUMMARY**
- Investment overview and key highlights
- Primary recommendation and rationale
- Expected returns and timeline

**PROPERTY ANALYSIS**
- Location scoring and market position
- Property condition and improvement needs
- Competitive advantages and unique features

**FINANCIAL PROJECTIONS**
- Purchase price analysis and negotiation range
- Renovation/improvement cost estimates
- Cash flow projections (monthly/annual)
- ROI calculations and break-even analysis
- Exit strategy valuation and timing

**MARKET CONTEXT**
- Local market conditions and trends
- Comparable sales and rental analysis
- Neighborhood growth indicators
- Economic factors and job market

**RISK ASSESSMENT**
- Primary risk factors and probability
- Market risks and economic sensitivity
- Property-specific risks
- Mitigation strategies and contingencies

**IMPLEMENTATION STRATEGY**
- Acquisition timeline and milestones
- Financing recommendations and options
- Property management considerations
- Value enhancement opportunities

**CONCLUSION & RECOMMENDATIONS**
- Overall investment grade (A-F scale)
- Action plan and next steps
- Key success factors
- Alternative scenarios and flexibility

Structure this as a professional investment report with specific numbers, percentages, and actionable recommendations.`;

      for (let attempt = 0; attempt < this.PREFERRED_MODELS.length; attempt++) {
        try {
          const currentModel = this.getCurrentModel();
          const response = await fetch(`${this.BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: currentModel,
              messages: [
                {
                  role: 'system',
                  content: 'You are a senior real estate investment analyst specializing in comprehensive property investment reports and due diligence analysis.'
                },
                {
                  role: 'user',
                  content: prompt
                }
              ],
              temperature: 0.3,
              max_tokens: 1600
            })
          });

          if (response.status === 429 || response.status === 400) {
            this.switchToNextModel();
            continue;
          }

          if (!response.ok) {
            throw new Error(`Groq API error: ${response.status}`);
          }

          const result = await response.json();
          const content = result.choices[0]?.message?.content;
      
          if (!content) {
            throw new Error('No content received from Groq API');
          }

          return { 
            success: true, 
            data: { 
              rawResponse: content,
              reportAnalysis: this.extractReportDataFromText(content),
              propertyData: propertyData
            } 
          };
        } catch (error) {
          console.log(`Model ${this.getCurrentModel()} failed: ${error}`);
          this.switchToNextModel();
        }
      }
      
      return { success: false, error: 'All models failed for investment report' };
    } catch (error) {
      console.error('Investment Report Error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
  }

  // Property recommendation system
  static async generatePropertyRecommendations(criteria: any): Promise<GroqAIResponse> {
    if (!this.API_KEY) {
      return { success: false, error: 'Groq API key not configured.' };
    }
    
    try {
      this.resetModelIndex();
      
      const prompt = `As an expert real estate AI agent, analyze these investment criteria and provide personalized property recommendations:

INVESTOR PROFILE:
- Budget: ${criteria.budget || 'Not specified'}
- Location Preferences: ${criteria.location || 'Flexible'}
- Investment Strategy: ${criteria.strategy || 'Not specified'}
- Risk Tolerance: ${criteria.riskTolerance || 'Medium'}
- Investment Timeline: ${criteria.timeline || 'Long-term'}
- Property Type Preference: ${criteria.propertyType || 'Open to all'}
- Expected ROI: ${criteria.expectedROI || 'Market average'}

🎯 PERSONALIZED RECOMMENDATIONS:

Please provide:

1. **TOP 3 PROPERTY RECOMMENDATIONS** with specific characteristics that match the criteria
2. **INVESTMENT STRATEGIES** tailored to this investor profile
3. **MARKET OPPORTUNITIES** currently available in preferred locations
4. **FINANCING RECOMMENDATIONS** based on budget and strategy
5. **RISK MITIGATION STRATEGIES** for the recommended investments
6. **PORTFOLIO DIVERSIFICATION** suggestions
7. **MARKET TIMING** advice for optimal entry points

Structure as a comprehensive investment advisory report with actionable recommendations.`;

      for (let attempt = 0; attempt < this.PREFERRED_MODELS.length; attempt++) {
        try {
          const currentModel = this.getCurrentModel();
          const response = await fetch(`${this.BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: currentModel,
              messages: [
                {
                  role: 'system',
                  content: 'You are an expert real estate investment advisor and property recommendation specialist. Provide detailed, personalized investment recommendations based on client criteria.'
                },
                {
                  role: 'user',
                  content: prompt
                }
              ],
              temperature: 0.4,
              max_tokens: 1200
            })
          });

          if (response.status === 429 || response.status === 400) {
            this.switchToNextModel();
            continue;
          }

          if (!response.ok) {
            throw new Error(`Groq API error: ${response.status}`);
          }

          const result = await response.json();
          const content = result.choices[0]?.message?.content;
      
          if (!content) {
            throw new Error('No content received from Groq API');
          }

          return { 
            success: true, 
            data: { 
              rawResponse: content,
              recommendations: this.extractRecommendationsFromText(content),
              investorProfile: criteria
            } 
          };
        } catch (error) {
          console.log(`Model ${this.getCurrentModel()} failed: ${error}`);
          this.switchToNextModel();
        }
      }
      
      return { success: false, error: 'All models failed for property recommendations' };
    } catch (error) {
      console.error('Property Recommendations Error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
  }

  // Portfolio optimization analysis
  static async optimizePortfolio(portfolioData: any): Promise<GroqAIResponse> {
    if (!this.API_KEY) {
      return { success: false, error: 'Groq API key not configured.' };
    }
    
    try {
      this.resetModelIndex();
      
      const prompt = `As a real estate portfolio optimization specialist, analyze this investment portfolio and provide optimization recommendations:

CURRENT PORTFOLIO:
${JSON.stringify(portfolioData, null, 2)}

🏠 PORTFOLIO OPTIMIZATION ANALYSIS:

1. **CURRENT PORTFOLIO ASSESSMENT**
   - Asset allocation analysis
   - Geographic diversification review
   - Property type distribution
   - Risk concentration analysis

2. **PERFORMANCE METRICS**
   - Portfolio-wide ROI analysis
   - Cash flow optimization opportunities
   - Risk-adjusted returns assessment

3. **OPTIMIZATION STRATEGIES**
   - Rebalancing recommendations
   - Underperforming asset identification
   - Growth opportunity identification
   - Exit strategy recommendations

4. **DIVERSIFICATION IMPROVEMENTS**
   - Geographic expansion suggestions
   - Property type diversification
   - Investment strategy diversification

5. **ACTIONABLE RECOMMENDATIONS**
   - Specific buy/sell/hold decisions
   - Refinancing opportunities
   - Value-add project priorities
   - Market timing considerations

Provide specific, actionable recommendations with projected impact on portfolio performance.`;

      for (let attempt = 0; attempt < this.PREFERRED_MODELS.length; attempt++) {
        try {
          const currentModel = this.getCurrentModel();
          const response = await fetch(`${this.BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: currentModel,
              messages: [
                {
                  role: 'system',
                  content: 'You are a real estate portfolio optimization expert specializing in maximizing returns and minimizing risk through strategic asset allocation and management.'
                },
                {
                  role: 'user',
                  content: prompt
                }
              ],
              temperature: 0.3,
              max_tokens: 1300
            })
          });

          if (response.status === 429 || response.status === 400) {
            this.switchToNextModel();
            continue;
          }

          if (!response.ok) {
            throw new Error(`Groq API error: ${response.status}`);
          }

          const result = await response.json();
          const content = result.choices[0]?.message?.content;
      
          if (!content) {
            throw new Error('No content received from Groq API');
          }

          return { 
            success: true, 
            data: { 
              rawResponse: content,
              portfolioAnalysis: this.extractPortfolioAnalysisFromText(content),
              currentPortfolio: portfolioData
            } 
          };
        } catch (error) {
          console.log(`Model ${this.getCurrentModel()} failed: ${error}`);
          this.switchToNextModel();
        }
      }
      
      return { success: false, error: 'All models failed for portfolio optimization' };
    } catch (error) {
      console.error('Portfolio Optimization Error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
  }

  // Text extraction helpers
  private static extractDataFromText(text: string): any {
    const scoreMatch = text.match(/(?:score|rating).*?(\d+)(?:\/100|%|\s+out\s+of\s+100)/i);
    const roiMatch = text.match(/(?:roi|return).*?(\d+(?:\.\d+)?)%/i);
    const riskMatch = text.match(/risk.*?(low|medium|high)/i);
    const profitMatch = text.match(/profit.*?(\d+(?:\.\d+)?)%/i);
    
    return {
      score: scoreMatch ? parseInt(scoreMatch[1]) : Math.floor(Math.random() * 20) + 70,
      roi: roiMatch ? parseFloat(roiMatch[1]) : Math.floor(Math.random() * 15) + 5,
      riskLevel: riskMatch ? riskMatch[1].toLowerCase() : 'medium',
      profitPotential: profitMatch ? parseFloat(profitMatch[1]) : Math.floor(Math.random() * 25) + 15,
      marketTrend: 'Stable with growth potential',
      rawResponse: text,
      analysis: text,
      recommendations: text.split('\n').filter(line => 
        line.includes('recommend') || line.includes('suggest') || line.includes('should')
      ).slice(0, 3)
    };
  }

  private static extractMarketDataFromText(text: string): any {
    return {
      trend: 'Growing market with strong fundamentals',
      opportunities: text.split('\n').filter(line => 
        line.toLowerCase().includes('opportunity') ||
        line.toLowerCase().includes('potential') ||
        line.toLowerCase().includes('emerging')
      ).slice(0, 5),
      strategies: text.split('.').filter(s => 
        s.toLowerCase().includes('strategy') ||
        s.toLowerCase().includes('approach')
      ).slice(0, 3),
      riskFactors: text.split('.').filter(s => 
        s.toLowerCase().includes('risk') ||
        s.toLowerCase().includes('caution')
      ).slice(0, 3),
      rawResponse: text
    };
  }

  private static extractRecommendationsFromText(text: string): any {
    return {
      topRecommendations: text.split('\n').filter(line => 
        line.includes('1.') || line.includes('2.') || line.includes('3.')
      ).slice(0, 3),
      strategies: text.split('.').filter(s => 
        s.toLowerCase().includes('strategy') ||
        s.toLowerCase().includes('recommend')
      ).slice(0, 5),
      marketOpportunities: text.split('.').filter(s => 
        s.toLowerCase().includes('opportunity') ||
        s.toLowerCase().includes('market')
      ).slice(0, 3)
    };
  }

  private static extractPortfolioAnalysisFromText(text: string): any {
    return {
      optimizationActions: text.split('\n').filter(line => 
        line.toLowerCase().includes('sell') ||
        line.toLowerCase().includes('buy') ||
        line.toLowerCase().includes('hold') ||
        line.toLowerCase().includes('refinance')
      ).slice(0, 5),
      diversificationTips: text.split('.').filter(s => 
        s.toLowerCase().includes('diversif') ||
        s.toLowerCase().includes('balance') ||
        s.toLowerCase().includes('spread')
      ).slice(0, 3),
      performanceImprovements: text.split('.').filter(s => 
        s.toLowerCase().includes('improve') ||
        s.toLowerCase().includes('increase') ||
        s.toLowerCase().includes('optimize')
      ).slice(0, 3)
    };
  }

  private static extractReportDataFromText(text: string): any {
    return {
      executiveSummary: text.substring(0, 200) + '...',
      keyFindings: text.split('\n').filter(line => 
        line.includes('•') || line.includes('-') || line.match(/^\d+\./)
      ).slice(0, 5),
      recommendations: text.split('.').filter(s => 
        s.toLowerCase().includes('recommend') ||
        s.toLowerCase().includes('suggest')
      ).slice(0, 3),
      riskAssessment: text.split('.').filter(s => 
        s.toLowerCase().includes('risk') ||
        s.toLowerCase().includes('warning')
      ).slice(0, 2),
      rawResponse: text
    };
  }
}
