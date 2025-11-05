# 🎤 LiveKit AI Agent Integration - Complete Guide

## Overview

LiveKit is a powerful open-source platform for building real-time voice and video applications. This integration adds LiveKit AI voice agent capabilities to VocaCare for patient registration.

---

## 🚀 Features

✅ **Real-time Voice Conversation** - Natural conversation with AI agent  
✅ **Speech-to-Text** - Deepgram integration for accurate transcription  
✅ **Text-to-Speech** - OpenAI TTS for natural voice responses  
✅ **LLM Processing** - GPT-4 for intelligent conversation management  
✅ **Auto Data Extraction** - Structured patient data extraction  
✅ **MongoDB Integration** - Automatic database saving  
✅ **Frontend Widget** - Beautiful React component for voice calls

---

## 📦 Installation

### 1. Install Backend Dependencies

```bash
cd "e:\win 11 c folder\desktop\Major\VocaCare-Backend-FastAPI"
pip install -r requirements.txt
```

New packages installed:

- `livekit` - LiveKit server SDK
- `livekit-agents` - AI agent framework
- `livekit-plugins-openai` - OpenAI integration (TTS & LLM)
- `livekit-plugins-deepgram` - Speech-to-Text
- `livekit-plugins-silero` - Voice Activity Detection

---

## 🔑 Configuration

### 1. Get LiveKit Credentials

**Option A: Use LiveKit Cloud (Recommended for testing)**

1. Go to https://cloud.livekit.io
2. Sign up for free account
3. Create a new project
4. Copy API Key, API Secret, and WebSocket URL

**Option B: Self-host LiveKit Server**

```bash
docker run --rm -p 7880:7880 \
  -e LIVEKIT_KEYS="your_api_key: your_api_secret" \
  livekit/livekit-server
```

### 2. Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy the key (starts with `sk-`)

### 3. Get Deepgram API Key

1. Go to https://console.deepgram.com
2. Sign up for free account
3. Create a new API key
4. Copy the key

### 4. Update `.env` File

```env
# LiveKit Configuration
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=APIxxxxxxxxxx
LIVEKIT_API_SECRET=secretxxxxxxxxxx

# OpenAI Configuration
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxx

# Deepgram Configuration
DEEPGRAM_API_KEY=xxxxxxxxxxxxxxxxxx

# MongoDB (already configured)
MONGODB_URI=mongodb+srv://sankhalapunit10:Punit123@company.bnxmedc.mongodb.net/
```

---

## 🏃 Running the System

### 1. Start FastAPI Backend

```bash
cd "e:\win 11 c folder\desktop\Major\VocaCare-Backend-FastAPI"
python main.py
```

You should see:

```
🚀 Starting VocaCare FastAPI Backend...
📡 Webhook endpoint: http://localhost:8000/webhook/elevenlabs
📡 LiveKit webhook: http://localhost:8000/webhook/livekit
🔄 Polling endpoint: http://localhost:8000/api/get-latest-webhook
🎤 LiveKit token: http://localhost:8000/api/livekit-token
```

### 2. Start LiveKit AI Agent

Open a new terminal:

```bash
cd "e:\win 11 c folder\desktop\Major\VocaCare-Backend-FastAPI"
python livekit_agent.py dev
```

You should see:

```
INFO - Starting LiveKit agent worker...
INFO - Connected to LiveKit server
INFO - Waiting for room assignments...
```

### 3. Start Frontend

Open another terminal:

```bash
cd "e:\win 11 c folder\desktop\Major\Major Frontend"
npm run dev
```

---

## 🎨 Frontend Integration

### Option 1: Use LiveKit Widget Component

Add to your `App.jsx`:

```javascript
import LiveKitVoiceAgent from "./components/LiveKitVoiceAgent";

function App() {
  const handleCallComplete = () => {
    console.log("Call completed, refresh patient data");
    // Trigger data refresh
  };

  return (
    <div>
      {/* Your existing components */}

      {/* Add LiveKit widget */}
      <LiveKitVoiceAgent onCallComplete={handleCallComplete} />
    </div>
  );
}
```

### Option 2: Use Both ElevenLabs and LiveKit

Users can choose which voice agent to use:

```javascript
const [voiceAgent, setVoiceAgent] = useState("elevenlabs"); // or 'livekit'

{
  voiceAgent === "livekit" && <LiveKitVoiceAgent />;
}
{
  voiceAgent === "elevenlabs" && <ElevenLabsWidget />;
}
```

---

## 📊 How It Works

### Conversation Flow:

```
1. Patient clicks "Start Call" button
   ↓
2. Frontend requests access token from backend
   ↓
3. Backend generates LiveKit JWT token
   ↓
4. Frontend connects to LiveKit room
   ↓
5. LiveKit AI Agent joins the room
   ↓
6. Voice conversation begins:
   - Patient speaks → Deepgram STT → Text
   - Text → GPT-4 → AI Response
   - Response → OpenAI TTS → Voice
   - Agent speaks back to patient
   ↓
7. AI collects all registration info
   ↓
8. Patient ends call
   ↓
9. Agent extracts structured data
   ↓
10. Data saved to MongoDB
    ↓
11. Webhook sent to FastAPI
    ↓
12. Frontend polls and displays data
```

---

## 🛠️ API Endpoints

### POST `/api/livekit-token`

Generate access token for LiveKit connection.

**Request:**

```json
{
  "room_name": "patient_registration_123",
  "participant_name": "Patient"
}
```

**Response:**

```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "url": "wss://your-project.livekit.cloud",
  "room_name": "patient_registration_123"
}
```

### POST `/webhook/livekit`

Receives patient data from LiveKit agent after call completion.

**Payload:**

```json
{
  "data": {
    "conversation_id": "livekit_room123_1699200000",
    "analysis": {
      "data_collection_results": {
        "Name": {"value": "John Doe"},
        "Age": {"value": 35},
        ...
      }
    },
    "transcript": [...],
    "metadata": {...}
  }
}
```

---

## 🎯 Agent Behavior

The LiveKit agent is configured to:

1. **Greet warmly**: "Hello! Welcome to VocaCare..."
2. **Collect information sequentially**:

   - Name
   - Age
   - Gender
   - Contact number
   - Address
   - Reason for visit
   - Preferred doctor
   - Medical history
   - Emergency contact
   - Appointment preference

3. **Adapt to patient needs**:

   - If patient is in pain, prioritize comfort
   - Be empathetic and reassuring
   - Allow interruptions
   - Confirm information before ending

4. **End gracefully**: Summarize collected data and thank patient

---

## 🧪 Testing

### Test 1: Token Generation

```bash
curl -X POST http://localhost:8000/api/livekit-token \
  -H "Content-Type: application/json" \
  -d '{"room_name":"test_room","participant_name":"Test"}'
```

Expected: Token and URL returned

### Test 2: Voice Call

1. Open frontend
2. Click "Start Call" button
3. Allow microphone access
4. Speak to the agent
5. Complete registration
6. End call
7. Check MongoDB for saved data

### Test 3: Webhook Reception

After call ends, check backend logs:

```
✅ Received LiveKit webhook data
💾 Saved to MongoDB with ID: ...
```

---

## 🔍 Troubleshooting

### Issue: "LiveKit credentials not configured"

**Solution**: Check `.env` file has all required variables:

```env
LIVEKIT_URL=wss://...
LIVEKIT_API_KEY=...
LIVEKIT_API_SECRET=...
OPENAI_API_KEY=...
DEEPGRAM_API_KEY=...
```

### Issue: Agent not joining room

**Solution**:

1. Ensure `livekit_agent.py` is running
2. Check agent logs for connection errors
3. Verify LiveKit URL is correct

### Issue: No audio/microphone access

**Solution**:

1. Allow microphone permission in browser
2. Use HTTPS (required for microphone access)
3. Check browser console for errors

### Issue: Data not saving to MongoDB

**Solution**:

1. Check MongoDB connection in `database.py`
2. Verify `MONGODB_URI` in `.env`
3. Check backend logs for save errors

---

## 💰 Cost Estimate

### LiveKit Cloud (Free Tier):

- 50 GB bandwidth/month free
- ~500 voice calls/month free
- After: $0.08/GB

### OpenAI (GPT-4o-mini + TTS):

- GPT-4o-mini: $0.15/1M input tokens
- TTS: $15/1M characters
- ~100 calls = $1-2

### Deepgram:

- $0.0043/minute for Nova-2 model
- 100 calls (5 min each) = ~$2

**Total: ~$3-5 for 100 calls**

---

## 🆚 LiveKit vs ElevenLabs

| Feature              | LiveKit        | ElevenLabs        |
| -------------------- | -------------- | ----------------- |
| **Open Source**      | ✅ Yes         | ❌ No             |
| **Self-hostable**    | ✅ Yes         | ❌ No             |
| **Customization**    | ✅ Full        | ⚠️ Limited        |
| **Cost**             | 💰 Pay per use | 💰💰 Subscription |
| **Voice Quality**    | ⭐⭐⭐⭐       | ⭐⭐⭐⭐⭐        |
| **Setup Complexity** | ⚠️ Medium      | ✅ Easy           |
| **Data Privacy**     | ✅ Self-hosted | ⚠️ Cloud only     |

---

## 📚 Resources

- **LiveKit Docs**: https://docs.livekit.io
- **LiveKit Agents**: https://docs.livekit.io/agents/
- **OpenAI TTS**: https://platform.openai.com/docs/guides/text-to-speech
- **Deepgram**: https://developers.deepgram.com

---

## 🎉 Summary

✅ **LiveKit AI agent fully integrated**  
✅ **FastAPI backend endpoints ready**  
✅ **Frontend widget component created**  
✅ **MongoDB auto-save configured**  
✅ **Documentation complete**

**Next Steps:**

1. Install dependencies: `pip install -r requirements.txt`
2. Configure `.env` with API keys
3. Run backend: `python main.py`
4. Run agent: `python livekit_agent.py dev`
5. Run frontend: `npm run dev`
6. Test voice registration!

**Your VocaCare system now has TWO voice AI options! 🎤🚀**
