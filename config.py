#!/usr/bin/env python3
"""
Configuration file for Real Estate AI Investment System
Supports environment variables and configuration management
"""

import os
from typing import List

class Config:
    """Configuration class for the Real Estate AI system"""
    
    # API Configuration
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    GROQ_BASE_URL = os.getenv("GROQ_BASE_URL", "https://api.groq.com/openai/v1")
    
    # Model Configuration
    PREFERRED_MODELS = [
        "compound-beta",
        "llama-3.3-70b-versatile", 
        "deepseek-r1-distill-llama-70b",
        "llama-3.1-8b-instant",
        "qwen/qwen3-32b"
    ]
    
    # Retry Configuration
    MAX_RETRIES = int(os.getenv("MAX_RETRIES", "3"))
    BASE_DELAY = int(os.getenv("BASE_DELAY", "2"))
    
    # Analysis Configuration
    DEFAULT_DOWN_PAYMENT_PERCENT = float(os.getenv("DEFAULT_DOWN_PAYMENT_PERCENT", "20.0"))
    
    # File Paths
    OUTPUT_DIR = os.getenv("OUTPUT_DIR", ".")
    ANALYSIS_FILE = os.path.join(OUTPUT_DIR, "real_estate_analysis.json")
    CSV_FILE = os.path.join(OUTPUT_DIR, "real_estate_analysis.csv")
    
    # Dashboard Configuration
    DASHBOARD_PORT = int(os.getenv("DASHBOARD_PORT", "8501"))
    DASHBOARD_HOST = os.getenv("DASHBOARD_HOST", "localhost")
    
    @classmethod
    def validate(cls) -> bool:
        """Validate configuration"""
        if not cls.GROQ_API_KEY or cls.GROQ_API_KEY == "your_api_key_here":
            print("❌ GROQ_API_KEY not configured. Please set the environment variable.")
            return False
        
        if not cls.GROQ_BASE_URL:
            print("❌ GROQ_BASE_URL not configured.")
            return False
        
        return True
    
    @classmethod
    def print_config(cls):
        """Print current configuration"""
        print("🔧 Configuration:")
        print(f"   API Key: {'*' * 10}{cls.GROQ_API_KEY[-4:] if cls.GROQ_API_KEY else 'Not set'}")
        print(f"   Base URL: {cls.GROQ_BASE_URL}")
        print(f"   Preferred Models: {len(cls.PREFERRED_MODELS)} models")
        print(f"   Max Retries: {cls.MAX_RETRIES}")
        print(f"   Base Delay: {cls.BASE_DELAY}s")
        print(f"   Output Directory: {cls.OUTPUT_DIR}")
        print(f"   Dashboard Port: {cls.DASHBOARD_PORT}")

# Global configuration instance
config = Config()
