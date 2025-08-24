#!/usr/bin/env python3
"""
Test script for the AI Assistant functionality
"""

import requests
import json
import sys

BASE_URL = "http://localhost:3002"

def test_chat_api_status():
    """Test the chat API status endpoint"""
    print("Testing /api/chat status endpoint...")
    
    try:
        response = requests.get(f"{BASE_URL}/api/chat")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ GET /api/chat: Status = {data['status']}")
            print(f"   Enabled: {data['enabled']}")
            print(f"   Provider: {data['provider']}")
            return data['enabled']
        else:
            print(f"❌ GET /api/chat failed with status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing chat API status: {e}")
        return False

def test_chat_api_message():
    """Test the chat API with a sample message"""
    print("\nTesting /api/chat message endpoint...")
    
    try:
        test_message = {
            "message": "What are the top 3 deals by cap rate?"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/chat", 
            headers={'Content-Type': 'application/json'},
            data=json.dumps(test_message)
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ POST /api/chat successful")
            print(f"   Response: {data.get('response', 'N/A')[:100]}...")
            print(f"   Deals analyzed: {data.get('dealsCount', 'N/A')}")
            print(f"   Timestamp: {data.get('timestamp', 'N/A')}")
            return True
        elif response.status_code == 503:
            data = response.json()
            print(f"⚠️  POST /api/chat: AI is disabled")
            print(f"   Reason: {data.get('error', 'N/A')}")
            return "disabled"
        else:
            print(f"❌ POST /api/chat failed with status {response.status_code}")
            try:
                data = response.json()
                print(f"   Error: {data.get('error', 'N/A')}")
            except:
                print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing chat API message: {e}")
        return False

def test_deals_integration():
    """Test that deals API is working for chat context"""
    print("\nTesting deals API integration...")
    
    try:
        response = requests.get(f"{BASE_URL}/api/deals?sort=score")
        if response.status_code == 200:
            data = response.json()
            deal_count = len(data.get('deals', []))
            print(f"✅ Deals API integration: {deal_count} deals available for AI context")
            
            if deal_count > 0:
                sample_deal = data['deals'][0]
                required_fields = ['title', 'capRate', 'discountPct', 'score']
                has_fields = all(field in sample_deal for field in required_fields)
                print(f"   Sample deal has required fields: {'✅' if has_fields else '❌'}")
            
            return deal_count > 0
        else:
            print(f"❌ Deals API failed with status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing deals integration: {e}")
        return False

def main():
    """Run all AI assistant tests"""
    print("🤖 Starting AI Assistant tests...\n")
    
    # Test API status
    is_enabled = test_chat_api_status()
    
    # Test deals integration
    deals_ok = test_deals_integration()
    
    # Test message handling
    message_result = test_chat_api_message()
    
    print(f"\n📊 Test Results:")
    print(f"   Chat API Status: {'✅ ENABLED' if is_enabled else '⚠️  DISABLED'}")
    print(f"   Deals Integration: {'✅ WORKING' if deals_ok else '❌ FAILED'}")
    
    if message_result == True:
        print(f"   Message Handling: ✅ WORKING")
    elif message_result == "disabled":
        print(f"   Message Handling: ⚠️  DISABLED (No API Key)")
    else:
        print(f"   Message Handling: ❌ FAILED")
    
    if is_enabled and deals_ok and message_result == True:
        print(f"\n🎉 AI Assistant is fully functional!")
        print(f"   ✅ Chat API is enabled and responding")
        print(f"   ✅ Deal data is available for context")
        print(f"   ✅ Message processing is working")
        return 0
    elif deals_ok and message_result == "disabled":
        print(f"\n⚠️  AI Assistant is properly disabled")
        print(f"   ✅ Graceful handling of missing API key")
        print(f"   ✅ Deal data is ready for when AI is enabled")
        print(f"   💡 To enable: Set OPENAI_API_KEY in environment")
        return 0
    else:
        print(f"\n❌ Some components need attention")
        return 1

if __name__ == "__main__":
    sys.exit(main())
