#!/usr/bin/env python3
"""
Test script for the Real Estate AI API endpoints
"""

import requests
import json
import sys

BASE_URL = "http://localhost:3002"

def test_deals_api():
    """Test the deals API endpoint"""
    print("Testing /api/deals endpoint...")
    
    try:
        # Test basic deals endpoint
        response = requests.get(f"{BASE_URL}/api/deals")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ GET /api/deals: {len(data['deals'])} deals returned")
            
            # Test first deal structure
            if data['deals']:
                deal = data['deals'][0]
                required_fields = ['id', 'title', 'price', 'capRate', 'discountPct', 'score']
                missing_fields = [field for field in required_fields if field not in deal]
                if missing_fields:
                    print(f"⚠️  Missing fields in deal: {missing_fields}")
                else:
                    print(f"✅ Deal structure valid. Score: {deal.get('score', 'N/A')}")
        else:
            print(f"❌ GET /api/deals failed with status {response.status_code}")
            return False
            
        # Test sorting
        response = requests.get(f"{BASE_URL}/api/deals?sort=price")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ GET /api/deals?sort=price: {len(data['deals'])} deals returned")
        else:
            print(f"❌ Sort test failed with status {response.status_code}")
            
        # Test filtering
        response = requests.get(f"{BASE_URL}/api/deals?maxPrice=500000&sort=score")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ GET /api/deals with price filter: {len(data['deals'])} deals returned")
        else:
            print(f"❌ Filter test failed with status {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error testing deals API: {e}")
        return False
        
    return True

def test_estimate_api():
    """Test the estimate API endpoint"""
    print("\nTesting /api/estimate endpoint...")
    
    try:
        test_property = {
            "title": "Test Property",
            "price": 300000,
            "noi": 24000,
            "city": "Mumbai",
            "country": "India",
            "category": "mispriced"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/estimate", 
            headers={'Content-Type': 'application/json'},
            data=json.dumps(test_property)
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ POST /api/estimate successful")
            print(f"   Cap Rate: {data.get('capRate', 'N/A')}%")
            print(f"   AI Estimated Value: ${data.get('aiEstimatedValue', 'N/A'):,}")
            print(f"   Discount: {data.get('discountPct', 'N/A')}%")
        else:
            print(f"❌ POST /api/estimate failed with status {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing estimate API: {e}")
        return False
        
    return True

def main():
    """Run all API tests"""
    print("🚀 Starting API tests...\n")
    
    deals_ok = test_deals_api()
    estimate_ok = test_estimate_api()
    
    print(f"\n📊 Test Results:")
    print(f"   Deals API: {'✅ PASS' if deals_ok else '❌ FAIL'}")
    print(f"   Estimate API: {'✅ PASS' if estimate_ok else '❌ FAIL'}")
    
    if deals_ok and estimate_ok:
        print(f"\n🎉 All tests passed! Backend APIs are working correctly.")
        return 0
    else:
        print(f"\n❌ Some tests failed. Please check the server logs.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
