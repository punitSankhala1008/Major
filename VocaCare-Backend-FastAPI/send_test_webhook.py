"""
Simple webhook testing script - sends a test webhook to your FastAPI backend
This simulates what ElevenLabs would send when a call completes
"""

import requests
import json
from datetime import datetime

# Backend URL
WEBHOOK_URL = "http://localhost:8000/webhook/elevenlabs"

# Sample webhook payload (mimics ElevenLabs format)
sample_webhook = {
    "data": {
        "conversation_id": f"test_conv_{int(datetime.now().timestamp())}",
        "analysis": {
            "data_collection_results": {
                "Name": {"value": "John Doe"},
                "Age": {"value": 35},
                "Gender": {"value": "Male"},
                "Contact": {"value": "9876543210"},
                "Address ": {"value": "123 Main St, New York, NY"},
                "Reason": {"value": "Severe headache and fever"},
                "Preferred Doctor": {"value": "Dr. Sarah Johnson"},
                "Previous Medical History": {"value": "Diabetes, High blood pressure"},
                "Emergency Contact": {"value": "Jane Doe 9876543211"},
                "Appointment Preference": {"value": "Tomorrow morning at 9 AM"}
            },
            "transcript_summary": "Patient John Doe called with complaints of severe headache and fever. Has history of diabetes and hypertension. Prefers appointment with Dr. Sarah Johnson tomorrow morning at 9 AM.",
            "call_successful": True
        },
        "transcript": [
            {"role": "agent", "message": "Hello! Welcome to VocaCare. How can I help you today?"},
            {"role": "user", "message": "Hi, I need to schedule an appointment. I have a severe headache and fever."},
            {"role": "agent", "message": "I understand. Let me help you with that. Can you please tell me your name?"},
            {"role": "user", "message": "My name is John Doe"},
            {"role": "agent", "message": "Thank you, John. How old are you?"},
            {"role": "user", "message": "I'm 35 years old"},
            {"role": "agent", "message": "And your gender?"},
            {"role": "user", "message": "Male"},
            {"role": "agent", "message": "Great. Can you provide your contact number?"},
            {"role": "user", "message": "Yes, it's 9876543210"},
            {"role": "agent", "message": "Thank you. What's your address?"},
            {"role": "user", "message": "123 Main Street, New York, NY"},
            {"role": "agent", "message": "Do you have any previous medical history I should know about?"},
            {"role": "user", "message": "Yes, I have diabetes and high blood pressure"},
            {"role": "agent", "message": "I see. Do you have a preferred doctor?"},
            {"role": "user", "message": "Yes, Dr. Sarah Johnson if she's available"},
            {"role": "agent", "message": "Perfect. When would you like to schedule your appointment?"},
            {"role": "user", "message": "Tomorrow morning at 9 AM would be great"},
            {"role": "agent", "message": "Excellent. Can you provide an emergency contact?"},
            {"role": "user", "message": "Yes, my wife Jane Doe, her number is 9876543211"},
            {"role": "agent", "message": "Thank you, John. I've registered all your information. Your appointment with Dr. Sarah Johnson is scheduled for tomorrow at 9 AM. Take care!"},
            {"role": "user", "message": "Thank you so much!"}
        ],
        "metadata": {
            "call_duration_secs": 245,
            "call_started_at": datetime.now().isoformat(),
            "call_ended_at": datetime.now().isoformat()
        }
    }
}

def send_webhook():
    """Send webhook to backend"""
    print("=" * 70)
    print("📡 Testing Webhook - Sending Sample Patient Data")
    print("=" * 70)
    
    print(f"\n🎯 Target URL: {WEBHOOK_URL}")
    print(f"📦 Patient: {sample_webhook['data']['analysis']['data_collection_results']['Name']['value']}")
    print(f"📞 Conversation ID: {sample_webhook['data']['conversation_id']}")
    
    try:
        print("\n⏳ Sending webhook...")
        response = requests.post(
            WEBHOOK_URL,
            json=sample_webhook,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            print("✅ Webhook sent successfully!")
            print(f"\n📥 Server Response:")
            print(json.dumps(response.json(), indent=2))
            
            print("\n" + "=" * 70)
            print("✨ Next Steps:")
            print("=" * 70)
            print("1. Check your FastAPI terminal - you should see the webhook received")
            print("2. Open frontend: http://localhost:5173")
            print("3. Click 'Start Real-time' button")
            print("4. Watch the patient data appear in real-time!")
            print("\nOr test the polling endpoint directly:")
            print("   curl http://localhost:8000/api/get-latest-webhook")
            print("=" * 70)
            
        else:
            print(f"❌ Failed! Status code: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend!")
        print("\n💡 Make sure your FastAPI server is running:")
        print("   cd VocaCare-Backend-FastAPI")
        print("   python main.py")
        print("\n   Then run this script again.")
        
    except Exception as e:
        print(f"❌ Error: {e}")


def verify_webhook_received():
    """Check if webhook was stored"""
    print("\n\n🔍 Verifying webhook was stored...")
    
    try:
        response = requests.get("http://localhost:8000/api/get-latest-webhook")
        if response.status_code == 200:
            data = response.json()
            if "body" in data:
                patient_name = data['body']['data']['analysis']['data_collection_results']['Name']['value']
                print(f"✅ Webhook stored successfully!")
                print(f"   Patient: {patient_name}")
                print(f"   Timestamp: {data.get('timestamp')}")
            else:
                print("⚠️ No webhook data in storage yet")
        else:
            print(f"❌ Could not verify: {response.status_code}")
    except Exception as e:
        print(f"❌ Verification failed: {e}")


if __name__ == "__main__":
    send_webhook()
    verify_webhook_received()
