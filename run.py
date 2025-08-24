#!/usr/bin/env python3
"""
Launcher script for Real Estate AI Investment System
Provides easy access to different components
"""

import sys
import subprocess
import os
from pathlib import Path

def print_banner():
    """Print system banner"""
    print("🏠" * 20)
    print("   Real Estate AI Investment System")
    print("🏠" * 20)
    print()

def print_menu():
    """Print main menu"""
    print("Available options:")
    print("1. 🚀 Run AI Analysis Engine")
    print("2. 📊 Launch Dashboard")
    print("3. ⚙️  Show Configuration")
    print("4. 📋 Install Dependencies")
    print("5. 🔧 Test API Connection")
    print("6. 📖 Show Help")
    print("0. 🚪 Exit")
    print()

def run_analysis_engine():
    """Run the AI analysis engine"""
    print("🚀 Starting AI Analysis Engine...")
    print("This will analyze properties and generate investment recommendations.")
    print()
    
    try:
        result = subprocess.run([sys.executable, "real_estate_ai_engine.py"], 
                              capture_output=False, text=True)
        if result.returncode == 0:
            print("✅ Analysis completed successfully!")
            print("📁 Results saved to real_estate_analysis.json")
        else:
            print("❌ Analysis failed. Check the error messages above.")
    except FileNotFoundError:
        print("❌ real_estate_ai_engine.py not found!")
        print("Make sure you're in the correct directory.")

def launch_dashboard():
    """Launch the Streamlit dashboard"""
    print("📊 Launching Dashboard...")
    print("The dashboard will open in your web browser.")
    print("Press Ctrl+C to stop the dashboard.")
    print()
    
    try:
        # Check if dashboard file exists
        if not Path("dashboard.py").exists():
            print("❌ dashboard.py not found!")
            print("Make sure you're in the correct directory.")
            return
        
        # Check if dependencies are installed
        try:
            import streamlit
            import plotly
            import pandas
        except ImportError:
            print("❌ Dashboard dependencies not installed!")
            print("Run option 4 to install dependencies first.")
            return
        
        # Launch dashboard
        subprocess.run([sys.executable, "-m", "streamlit", "run", "dashboard.py", 
                       "--server.port", "8501", "--server.address", "localhost"])
        
    except KeyboardInterrupt:
        print("\n🛑 Dashboard stopped by user.")
    except Exception as e:
        print(f"❌ Error launching dashboard: {e}")

def show_configuration():
    """Show current configuration"""
    print("⚙️  Current Configuration:")
    print("-" * 30)
    
    try:
        from config import config
        config.print_config()
    except ImportError:
        print("❌ config.py not found!")
        print("Make sure you're in the correct directory.")

def install_dependencies():
    """Install required dependencies"""
    print("📋 Installing Dependencies...")
    print("This may take a few minutes...")
    print()
    
    try:
        # Check if requirements.txt exists
        if not Path("requirements.txt").exists():
            print("❌ requirements.txt not found!")
            return
        
        # Install dependencies
        result = subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"],
                              capture_output=False, text=True)
        
        if result.returncode == 0:
            print("✅ Dependencies installed successfully!")
        else:
            print("❌ Failed to install dependencies.")
            print("Try running: pip install -r requirements.txt manually.")
    
    except Exception as e:
        print(f"❌ Error installing dependencies: {e}")

def test_api_connection():
    """Test Groq API connection"""
    print("🔧 Testing Groq API Connection...")
    print()
    
    try:
        from config import config
        
        if not config.validate():
            return
        
        import requests
        
        # Test API connection
        headers = {
            "Authorization": f"Bearer {config.GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(f"{config.GROQ_BASE_URL}/models", 
                              headers=headers, timeout=30)
        
        if response.status_code == 200:
            models_data = response.json()
            available_models = len(models_data.get("data", []))
            print(f"✅ API connection successful!")
            print(f"📊 Available models: {available_models}")
            
            # Check if preferred models are available
            available_model_ids = [m["id"] for m in models_data.get("data", [])]
            preferred_available = [m for m in config.PREFERRED_MODELS if m in available_model_ids]
            
            print(f"🎯 Preferred models available: {len(preferred_available)}/{len(config.PREFERRED_MODELS)}")
            for model in preferred_available:
                print(f"   ✅ {model}")
            
            for model in config.PREFERRED_MODELS:
                if model not in available_model_ids:
                    print(f"   ❌ {model}")
                    
        else:
            print(f"❌ API connection failed: {response.status_code}")
            print(f"Response: {response.text}")
    
    except ImportError:
        print("❌ Required modules not found. Install dependencies first.")
    except Exception as e:
        print(f"❌ Error testing API: {e}")

def show_help():
    """Show help information"""
    print("📖 Real Estate AI Investment System Help")
    print("=" * 40)
    print()
    print("This system provides AI-powered analysis of real estate investment opportunities.")
    print()
    print("🚀 AI Analysis Engine:")
    print("   - Analyzes property data using Groq's language models")
    print("   - Calculates NOI, Cap Rate, and other financial metrics")
    print("   - Generates investment recommendations and scores")
    print("   - Handles rate limiting with automatic model fallback")
    print()
    print("📊 Dashboard:")
    print("   - Interactive web interface for viewing results")
    print("   - Charts and visualizations of investment data")
    print("   - Property comparison and detailed analysis")
    print("   - Data export capabilities")
    print()
    print("⚙️  Configuration:")
    print("   - Set GROQ_API_KEY environment variable")
    print("   - Customize model preferences and retry settings")
    print("   - Adjust analysis parameters")
    print()
    print("📁 Files Generated:")
    print("   - real_estate_analysis.json: Main analysis results")
    print("   - real_estate_analysis.csv: Spreadsheet-friendly format")
    print()
    print("🔗 For more information, see README_REAL_ESTATE_AI.md")

def main():
    """Main launcher function"""
    print_banner()
    
    while True:
        print_menu()
        
        try:
            choice = input("Enter your choice (0-6): ").strip()
            
            if choice == "0":
                print("👋 Goodbye!")
                break
            elif choice == "1":
                run_analysis_engine()
            elif choice == "2":
                launch_dashboard()
            elif choice == "3":
                show_configuration()
            elif choice == "4":
                install_dependencies()
            elif choice == "5":
                test_api_connection()
            elif choice == "6":
                show_help()
            else:
                print("❌ Invalid choice. Please enter a number between 0-6.")
            
            print()
            input("Press Enter to continue...")
            print()
            
        except KeyboardInterrupt:
            print("\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"❌ Unexpected error: {e}")
            print()

if __name__ == "__main__":
    main()
