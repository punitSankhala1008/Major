from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import uvicorn
from typing import Optional
from dotenv import load_dotenv

load_dotenv()
app = FastAPI(title="VocaCare Backend API", version="1.0.0")

# CORS Configuration - Allow frontend to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8000", "https://major-4w34.onrender.com/" ,"https://major-nine-gamma.vercel.app/"],  # Vite default ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store the latest webhook data in memory
latest_webhook_data = None


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "running",
        "service": "VocaCare Backend API",
        "timestamp": datetime.now().isoformat()
    }


@app.post("/webhook/elevenlabs")
async def receive_webhook(request: Request):
    """
    Receives webhook data from ElevenLabs
    Configure this URL in your ElevenLabs agent settings
    """
    global latest_webhook_data
    
    try:
        # Get the webhook payload
        payload = await request.json()
        
        # Add timestamp to the data
        latest_webhook_data = {
            "body": payload,
            "timestamp": int(datetime.now().timestamp() * 1000)  # milliseconds
        }
        
        print(f"✅ Received webhook data at {datetime.now()}")
        print(f"Conversation ID: {payload.get('data', {}).get('conversation_id', 'N/A')}")
        
        return {"status": "success", "message": "Webhook received"}
    
    except Exception as e:
        print(f"❌ Error processing webhook: {str(e)}")
        return {"status": "error", "message": str(e)}


@app.get("/api/get-latest-webhook")
async def get_latest_webhook():
    """
    Endpoint that frontend polls to get the latest webhook data
    """
    if latest_webhook_data is None:
        return {
            "status": "no_data",
            "message": "No webhook data received yet"
        }
    
    return latest_webhook_data


@app.delete("/api/clear-webhook")
async def clear_webhook():
    """Clear the stored webhook data"""
    global latest_webhook_data
    latest_webhook_data = None
    return {"status": "success", "message": "Webhook data cleared"}


@app.get("/api/webhook-status")
async def webhook_status():
    """Check if webhook data is available"""
    return {
        "has_data": latest_webhook_data is not None,
        "last_update": latest_webhook_data.get("timestamp") if latest_webhook_data else None
    }


if __name__ == "__main__":
    print("🚀 Starting VocaCare FastAPI Backend...")
    print("📡 Webhook endpoint: http://localhost:8000/webhook/elevenlabs")
    print("🔄 Polling endpoint: http://localhost:8000/api/get-latest-webhook")
    print("📊 API Docs: http://localhost:8000/docs")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True  # Auto-reload on code changes
    )
