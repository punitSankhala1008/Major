"""
Test script to verify FastAPI backend is working correctly
Run this after starting the server to test all endpoints
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

def test_health_check():
    """Test if server is running"""
    print("\n1️⃣ Testing Health Check...")
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            print("✅ Server is running!")
            print(f"   Response: {response.json()}")
            return True
        else:
            print(f"❌ Server returned status code: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to server: {e}")
        print("   Make sure server is running: python main.py")
        return False


def test_webhook():
    """Test webhook endpoint with sample data"""
    print("\n2️⃣ Testing Webhook Endpoint...")
    
    sample_webhook = {
        "data": {
            "conversation_id": f"test_conv_{datetime.now().timestamp()}",
            "analysis": {
                "data_collection_results": {
                    "Name": {"value": "Test Patient"},
                    "Age": {"value": 25},
                    "Gender": {"value": "Female"},
                    "Contact": {"value": "1234567890"},
                    "Address ": {"value": "Test City, Test State"},
                    "Reason": {"value": "Test checkup"},
                    "Preferred Doctor": {"value": "Dr. Smith"},
                    "Previous Medical History": {"value": "None"},
                    "Emergency Contact": {"value": "Test Emergency 9876543210"},
                    "Appointment Preference": {"value": "Tomorrow 10 AM"}
                },
                "transcript_summary": "Test patient wants a checkup appointment.",
                "call_successful": True
            },
            "transcript": [
                {"role": "agent", "message": "Hello! How can I help you?"},
                {"role": "user", "message": "I need a checkup"}
            ],
            "metadata": {
                "call_duration_secs": 120
            }
        }
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/webhook/elevenlabs",
            json=sample_webhook
        )
        if response.status_code == 200:
            print("✅ Webhook endpoint working!")
            print(f"   Response: {response.json()}")
            return True
        else:
            print(f"❌ Webhook failed with status: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Webhook test failed: {e}")
        return False


def test_get_latest():
    """Test getting latest webhook data"""
    print("\n3️⃣ Testing Get Latest Webhook...")
    
    try:
        response = requests.get(f"{BASE_URL}/api/get-latest-webhook")
        if response.status_code == 200:
            data = response.json()
            if "body" in data:
                print("✅ Latest webhook data retrieved!")
                print(f"   Conversation ID: {data['body']['data']['conversation_id']}")
                print(f"   Patient Name: {data['body']['data']['analysis']['data_collection_results']['Name']['value']}")
                return True
            else:
                print("⚠️ No webhook data available yet")
                print("   Send a webhook first (test_webhook)")
                return False
        else:
            print(f"❌ Failed with status: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Get latest failed: {e}")
        return False


def test_webhook_status():
    """Test webhook status endpoint"""
    print("\n4️⃣ Testing Webhook Status...")
    
    try:
        response = requests.get(f"{BASE_URL}/api/webhook-status")
        if response.status_code == 200:
            print("✅ Webhook status retrieved!")
            print(f"   Status: {response.json()}")
            return True
        else:
            print(f"❌ Failed with status: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Status check failed: {e}")
        return False


def test_clear_webhook():
    """Test clearing webhook data"""
    print("\n5️⃣ Testing Clear Webhook...")
    
    try:
        response = requests.delete(f"{BASE_URL}/api/clear-webhook")
        if response.status_code == 200:
            print("✅ Webhook data cleared!")
            print(f"   Response: {response.json()}")
            return True
        else:
            print(f"❌ Failed with status: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Clear failed: {e}")
        return False


def run_all_tests():
    """Run all tests"""
    print("=" * 60)
    print("🧪 VocaCare Backend Test Suite")
    print("=" * 60)
    
    results = []
    
    # Test 1: Health check
    results.append(("Health Check", test_health_check()))
    
    if results[0][1]:  # Only continue if server is running
        # Test 2: Webhook
        results.append(("Webhook", test_webhook()))
        
        # Test 3: Get latest
        results.append(("Get Latest", test_get_latest()))
        
        # Test 4: Status
        results.append(("Status Check", test_webhook_status()))
        
        # Test 5: Clear
        results.append(("Clear Data", test_clear_webhook()))
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 Test Summary")
    print("=" * 60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Backend is working correctly!")
        print("\n Next steps:")
        print("   1. Start frontend: cd '../Major Frontend' && npm run dev")
        print("   2. Open browser: http://localhost:5173")
        print("   3. Click 'Test Sample Data' button")
        print("   4. Click 'Start Real-time' to begin polling")
    else:
        print("\n⚠️ Some tests failed. Check the errors above.")
    
    print("=" * 60)


if __name__ == "__main__":
    run_all_tests()
