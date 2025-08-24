#!/usr/bin/env python3
"""Test script for Groq AI Service"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Try loading from .env.local first, then .env
env_path = Path(__file__).parent / '.env.local'
if not env_path.exists():
    env_path = Path(__file__).parent / '.env'

print(f"Loading environment from: {env_path}")
load_dotenv(env_path)

# Check if API key is loaded
print("\n=== Environment Variables ===")
print(f"GROQ_API_KEY: {'*' * 8 + os.getenv('GROQ_API_KEY', '')[-4:] if os.getenv('GROQ_API_KEY') else 'Not set'}")

if not os.getenv("GROQ_API_KEY"):
    print("\n❌ Error: GROQ_API_KEY not found in environment variables")
    print(f"Current working directory: {os.getcwd()}")
    print(f"Environment file exists: {env_path.exists()}")
    sys.exit(1)

from real_estate_ai_engine import GroqAIService, Property, AnalysisResult

def test_ai_service():
    # Initialize the service
    service = GroqAIService(
        api_key=os.getenv("GROQ_API_KEY"),
        base_url="https://api.groq.com/openai/v1"
    )
    
    # Test 1: Check available models
    print("\n=== Testing Available Models ===")
    models = service.get_available_models()
    print(f"Available models: {models}")
    
    if not models:
        print("❌ No models available. Please check your API key and internet connection.")
        return False
    
    # Test 2: Test model selection
    print("\n=== Testing Model Selection ===")
    selected_model = service.select_best_model()
    print(f"Selected model: {selected_model}")
    
    if not selected_model:
        print("❌ Failed to select a model")
        return False
    
    # Test 3: Test chat completion
    print("\n=== Testing Chat Completion ===")
    try:
        response = service.send_chat_completion(
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Say 'Hello, World!'"}
            ],
            model=selected_model
        )
        print("✅ Chat completion successful!")
        print("Response:", response['choices'][0]['message']['content'])
        return True
        
    except Exception as e:
        print(f"❌ Chat completion failed: {str(e)}")
        return False

if __name__ == "__main__":
    print("🚀 Starting Groq AI Service Test...")
    
    if not os.getenv("GROQ_API_KEY"):
        print("❌ Error: GROQ_API_KEY environment variable not set")
        print("Please create a .env file with your API key:")
        print("GROQ_API_KEY=your_api_key_here")
        sys.exit(1)
    
    success = test_ai_service()
    
    if success:
        print("\n🎉 All tests passed successfully!")
    else:
        print("\n❌ Some tests failed. Please check the logs above.")
        sys.exit(1)
