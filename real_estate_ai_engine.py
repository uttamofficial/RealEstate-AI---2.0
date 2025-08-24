#!/usr/bin/env python3
"""AI-Powered Real Estate Investment System using Groq API"""

import requests
import json
import time
import logging
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
API_KEY = os.getenv("GROQ_API_KEY")
if not API_KEY:
    raise ValueError("GROQ_API_KEY environment variable not set")

BASE_URL = "https://api.groq.com/openai/v1"

# Preferred models in order (using stable models only)
PREFERRED_MODELS = [
    "llama3-70b-8192",
    "llama3-8b-8192",
    "mixtral-8x7b-32768"
]

MAX_RETRIES = 3
BASE_DELAY = 2

@dataclass
class Property:
    id: str
    address: str
    purchase_price: float
    annual_rent: float
    operating_expenses: float
    market_cap_rate: float
    
    def calculate_noi(self) -> float:
        return self.annual_rent - self.operating_expenses
    
    def calculate_cap_rate(self) -> float:
        noi = self.calculate_noi()
        return (noi / self.purchase_price) * 100 if self.purchase_price > 0 else 0

@dataclass
class AnalysisResult:
    property_id: str
    noi: float
    cap_rate: float
    rank: int
    recommendation: str
    score: float = 0.0

class GroqAIService:
    def __init__(self, api_key: str, base_url: str):
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        self.available_models = []
        self.current_model_index = 0
    
    def get_available_models(self):
        """Get list of available models from Groq API"""
        try:
            response = requests.get(
                f"{self.base_url}/models",
                headers=self.headers,
                timeout=10
            )
            response.raise_for_status()
            models_data = response.json()
            available_models = [model['id'] for model in models_data.get('data', [])]
            logger.info(f"Available models: {available_models}")
            return available_models
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching available models: {e}")
            # Return a default set of models if API call fails
            return ["llama3-70b-8192", "llama3-8b-8192"]
        except Exception as e:
            logger.error(f"Unexpected error in get_available_models: {e}")
            return ["llama3-70b-8192"]  # Fallback to most reliable model
    
    def select_best_model(self) -> Optional[str]:
        if not self.available_models:
            self.available_models = self.get_available_models()
        
        for preferred_model in PREFERRED_MODELS:
            if preferred_model in self.available_models:
                logger.info(f"Selected model: {preferred_model}")
                return preferred_model
        
        if self.available_models:
            fallback_model = self.available_models[0]
            logger.warning(f"Using fallback model: {fallback_model}")
            return fallback_model
        
        return None
    
    def switch_to_next_model(self) -> Optional[str]:
        self.current_model_index += 1
        
        if self.current_model_index < len(PREFERRED_MODELS):
            next_model = PREFERRED_MODELS[self.current_model_index]
            if next_model in self.available_models:
                logger.info(f"Switching to model: {next_model} (attempt {self.current_model_index + 1}/{len(PREFERRED_MODELS)})")
                return next_model
        
        # Try to find any available model as last resort
        for available_model in self.available_models:
            if available_model not in PREFERRED_MODELS:
                logger.warning(f"Using emergency fallback model: {available_model}")
                return available_model
        
        # If still no model, try the first available one
        if self.available_models:
            emergency_model = self.available_models[0]
            logger.warning(f"Using last resort model: {emergency_model}")
            return emergency_model
        
        logger.error("No more models available for fallback")
        return None
    
    def send_chat_completion(self, messages: List[Dict[str, str]], model: str = None) -> Dict[str, Any]:
        if not model:
            model = self.select_best_model()
            
        for attempt in range(MAX_RETRIES):
            try:
                logger.info(f"Sending request to model: {model}")
                response = requests.post(
                    f"{self.base_url}/chat/completions",
                    headers=self.headers,
                    json={
                        "model": model,
                        "messages": messages,
                        "temperature": 0.7,
                        "max_tokens": 2000
                    },
                    timeout=30
                )
                response.raise_for_status()
                return response.json()
                
            except requests.exceptions.HTTPError as e:
                error_msg = str(e)
                if e.response is not None:
                    error_msg += f" | Response: {e.response.text}"
                    
                if e.response is not None and e.response.status_code == 429:  # Rate limit
                    retry_after = int(e.response.headers.get('Retry-After', BASE_DELAY * (attempt + 1)))
                    logger.warning(f"Rate limited. Retrying after {retry_after} seconds...")
                    time.sleep(retry_after)
                
                elif response.status_code == 400:
                    logger.warning(f"⚠️ Model {model} unavailable, switching...")
                    new_model = self.switch_to_next_model()
                    if new_model:
                        model = new_model
                        continue
                    else:
                        break
                
                else:
                    response.raise_for_status()
                    
            except requests.exceptions.RequestException as e:
                logger.error(f"❌ Request error (attempt {attempt + 1}): {e}")
                if attempt < MAX_RETRIES - 1:
                    logger.info(f"🔄 Retrying immediately with next model...")
                    new_model = self.switch_to_next_model()
                    if new_model:
                        model = new_model
                        continue
                else:
                    raise Exception(f"Max retries exceeded: {e}")
        
        raise Exception(f"All models failed after {MAX_RETRIES} retries. Tried models: {PREFERRED_MODELS[:self.current_model_index + 1]}")

class RealEstateAnalysisEngine:
    def __init__(self, groq_service: GroqAIService):
        self.groq_service = groq_service
    
    def analyze_properties(self, properties: List[Property]) -> List[AnalysisResult]:
        analysis_results = []
        for prop in properties:
            noi = prop.calculate_noi()
            cap_rate = prop.calculate_cap_rate()
            
            result = AnalysisResult(
                property_id=prop.id,
                noi=noi,
                cap_rate=cap_rate,
                rank=0,
                recommendation="",
                score=0.0
            )
            analysis_results.append(result)
        
        analysis_results.sort(key=lambda x: x.cap_rate, reverse=True)
        for i, result in enumerate(analysis_results):
            result.rank = i + 1
        
        self._generate_ai_recommendations(analysis_results, properties)
        return analysis_results
    
    def _extract_json_from_response(self, content: str) -> Optional[Dict[str, Any]]:
        """Extract JSON from AI response, handling various response formats"""
        import re
        
        try:
            # Try direct JSON parsing first
            return json.loads(content)
        except json.JSONDecodeError:
            # Try to find JSON in markdown code blocks
            json_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', content, re.DOTALL)
            if json_match:
                try:
                    return json.loads(json_match.group(1))
                except json.JSONDecodeError:
                    pass
            
            # Try to find any JSON object in the content
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                try:
                    return json.loads(json_match.group(0))
                except json.JSONDecodeError:
                    pass
            
            logger.warning(f"⚠️ Could not extract JSON from AI response: {content[:200]}...")
            return None
    
    def _generate_ai_recommendations(self, results: List[AnalysisResult], properties: List[Property]):
        property_data = []
        for prop in properties:
            property_data.append({
                "id": prop.id,
                "address": prop.address,
                "purchase_price": prop.purchase_price,
                "annual_rent": prop.annual_rent,
                "operating_expenses": prop.operating_expenses,
                "market_cap_rate": prop.market_cap_rate,
                "calculated_noi": prop.calculate_noi(),
                "calculated_cap_rate": prop.calculate_cap_rate()
            })
        
        prompt = f"""You are a financial intelligence engine for real estate investment. 

Analyze these properties and provide investment recommendations:

Properties: {json.dumps(property_data, indent=2)}

For each property, calculate:
1. NOI (Net Operating Income = Annual Rent - Operating Expenses)
2. Cap Rate (NOI / Purchase Price)
3. Investment Score (0-100 based on cap rate, market position, and risk)
4. Brief recommendation (buy, hold, or pass with reasoning)

Return JSON in this exact format:
{{
  "analysis": [
    {{
      "property_id": "string",
      "noi": number,
      "cap_rate": number,
      "score": number,
      "recommendation": "string"
    }}
  ]
}}"""

        try:
            ai_response = self.groq_service.send_chat_completion([
                {"role": "user", "content": prompt}
            ])
            
            if ai_response["success"]:
                try:
                    # Try to extract JSON from the response (handle markdown code blocks)
                    content = ai_response["content"]
                    ai_data = self._extract_json_from_response(content)
                    
                    if ai_data:
                        for ai_result in ai_data.get("analysis", []):
                            for result in results:
                                if result.property_id == ai_result.get("property_id"):
                                    result.recommendation = ai_result.get("recommendation", "")
                                    result.score = ai_result.get("score", 0.0)
                                    break
                                    
                        logger.info("✅ AI recommendations generated successfully")
                    else:
                        logger.warning("⚠️ Could not extract JSON from AI response")
                        self._generate_basic_recommendations(results)
                        
                except Exception as parse_error:
                    logger.warning(f"⚠️ Response parsing failed: {parse_error}")
                    logger.warning("⚠️ Using basic recommendations due to parsing error")
                    self._generate_basic_recommendations(results)
            else:
                logger.warning("⚠️ AI analysis failed, using basic recommendations")
                self._generate_basic_recommendations(results)
                
        except Exception as e:
            logger.error(f"❌ Error generating AI recommendations: {e}")
            self._generate_basic_recommendations(results)
    
    def _generate_basic_recommendations(self, results: List[AnalysisResult]):
        for result in results:
            if result.cap_rate > 8.0:
                result.recommendation = "Strong buy - Excellent cap rate"
                result.score = 90.0
            elif result.cap_rate > 6.0:
                result.recommendation = "Buy - Good cap rate"
                result.score = 75.0
            elif result.cap_rate > 4.0:
                result.recommendation = "Hold - Moderate cap rate"
                result.score = 60.0
            else:
                result.recommendation = "Pass - Low cap rate"
                result.score = 40.0

def main():
    print("🏠 AI-Powered Real Estate Investment System")
    print("=" * 50)
    
    groq_service = GroqAIService(API_KEY, BASE_URL)
    analysis_engine = RealEstateAnalysisEngine(groq_service)
    
    properties = [
        Property(
            id="PROP001",
            address="123 Main St, Downtown",
            purchase_price=500000,
            annual_rent=60000,
            operating_expenses=15000,
            market_cap_rate=0.06
        ),
        Property(
            id="PROP002", 
            address="456 Oak Ave, Suburbs",
            purchase_price=750000,
            annual_rent=90000,
            operating_expenses=20000,
            market_cap_rate=0.05
        ),
        Property(
            id="PROP003",
            address="789 Pine Rd, University Area",
            purchase_price=350000,
            annual_rent=48000,
            operating_expenses=12000,
            market_cap_rate=0.07
        ),
        Property(
            id="PROP004",
            address="321 Elm St, Business District",
            purchase_price=1200000,
            annual_rent=144000,
            operating_expenses=36000,
            market_cap_rate=0.045
        )
    ]
    
    print(f"📊 Analyzing {len(properties)} properties...")
    
    try:
        results = analysis_engine.analyze_properties(properties)
        
        print("\n🎯 INVESTMENT ANALYSIS RESULTS")
        print("=" * 50)
        
        for result in results:
            print(f"\n🏠 Property {result.property_id}")
            print(f"   Address: {next(p.address for p in properties if p.id == result.property_id)}")
            print(f"   NOI: ${result.noi:,.2f}")
            print(f"   Cap Rate: {result.cap_rate:.2f}%")
            print(f"   Rank: #{result.rank}")
            print(f"   Score: {result.score:.1f}/100")
            print(f"   Recommendation: {result.recommendation}")
        
        # Calculate risk distribution
        risk_distribution = {}
        for result in results:
            if result.score >= 80:
                risk = "low"
            elif result.score >= 60:
                risk = "medium"
            else:
                risk = "high"
            risk_distribution[risk] = risk_distribution.get(risk, 0) + 1
        
        output_data = {
            "timestamp": datetime.now().isoformat(),
            "total_properties": len(properties),
            "analysis_results": [
                {
                    "property_id": r.property_id,
                    "address": next(p.address for p in properties if p.id == r.property_id),
                    "noi": r.noi,
                    "cap_rate": r.cap_rate,
                    "rank": r.rank,
                    "score": r.score,
                    "recommendation": r.recommendation,
                    "risk_level": "low" if r.score >= 80 else "medium" if r.score >= 60 else "high"
                }
                for r in results
            ],
            "summary": {
                "best_cap_rate": max(r.cap_rate for r in results),
                "average_cap_rate": sum(r.cap_rate for r in results) / len(results),
                "total_noi": sum(r.noi for r in results),
                "top_recommendation": next(r.property_id for r in results if r.rank == 1),
                "risk_distribution": risk_distribution,
                "total_investment": sum(p.purchase_price for p in properties),
                "average_score": sum(r.score for r in results) / len(results)
            }
        }
        
        print(f"\n📋 JSON Output for Dashboard:")
        print(json.dumps(output_data, indent=2))
        
        with open("real_estate_analysis.json", "w") as f:
            json.dump(output_data, f, indent=2)
        print(f"\n💾 Results saved to real_estate_analysis.json")
        
    except Exception as e:
        logger.error(f"❌ Analysis failed: {e}")
        print(f"❌ Analysis failed: {e}")

if __name__ == "__main__":
    main()
