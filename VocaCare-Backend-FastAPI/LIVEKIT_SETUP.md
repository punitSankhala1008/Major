# LiveKit Voice Agent Setup - COMPLETE ✅

## What Was Fixed

The LiveKit voice agent implementation had API version mismatch issues. The following fixes were applied:

### 1. **Import Corrections**

- ❌ **Old (broken):** `from livekit.agents.pipeline import VoicePipelineAgent`
- ✅ **New (working):** `from livekit.agents import voice` and use `voice.Agent`

### 2. **Type Annotations**

- Changed `ChatMessage` → `llm.ChatMessage` in event handlers
- Changed `ChatContext` → `llm.ChatContext` in agent initialization

### 3. **Variable Refactoring**

- Removed unused `PatientData` class
- Changed from `patient_data.transcript` to `transcript` (local variable)
- Changed from `patient_data.conversation_id` to `conversation_id` (local variable)

### 4. **WorkerOptions**

- Removed deprecated `worker_type` parameter
- Now uses simplified: `WorkerOptions(entrypoint_fnc=entrypoint)`

## Installation Complete ✅

All dependencies have been installed:

- ✅ livekit
- ✅ livekit-agents
- ✅ livekit-plugins-openai (GPT-4o-mini + TTS)
- ✅ livekit-plugins-deepgram (Speech-to-Text)
- ✅ livekit-plugins-silero (Voice Activity Detection)
- ✅ motor (MongoDB async driver)

## Next Steps

### 1. Configure Environment Variables

Create/update your `.env` file with LiveKit credentials:

```env
# MongoDB (already configured)
MONGODB_URI=mongodb+srv://sankhalapunit10:Punit123@company.bnxmedc.mongodb.net/
MONGODB_DB_NAME=medical_records

# LiveKit Configuration (ADD THESE)
LIVEKIT_URL=wss://your-livekit-cloud.livekit.cloud
LIVEKIT_API_KEY=your_api_key_here
LIVEKIT_API_SECRET=your_api_secret_here

# OpenAI for LLM and TTS
OPENAI_API_KEY=your_openai_api_key

# Deepgram for Speech-to-Text
DEEPGRAM_API_KEY=your_deepgram_api_key
```

### 2. Get LiveKit Credentials

**Option A: LiveKit Cloud (Recommended for testing)**

1. Go to https://cloud.livekit.io/
2. Sign up for free account
3. Create a new project
4. Copy the WebSocket URL, API Key, and API Secret
5. Paste them in `.env`

**Option B: Self-hosted LiveKit**

1. Follow https://docs.livekit.io/home/self-hosting/
2. Configure your own LiveKit server
3. Get credentials from your server

### 3. Get API Keys

**OpenAI API Key:**

- Go to https://platform.openai.com/api-keys
- Create new secret key
- Add to `.env` as `OPENAI_API_KEY`

**Deepgram API Key:**

- Go to https://console.deepgram.com/
- Sign up for free (includes $200 credit)
- Create new API key
- Add to `.env` as `DEEPGRAM_API_KEY`

### 4. Test the Agent

#### Development Mode (Local Testing)

```powershell
# Start the agent in development mode
python livekit_agent.py dev
```

This will:

- Start a local agent process
- Connect to LiveKit
- Wait for calls
- Show real-time logs

#### Test with LiveKit Playground

1. Go to your LiveKit Cloud dashboard
2. Navigate to "Agents" or "Playground"
3. Start a test call
4. Speak to test the voice agent

### 5. Start the Backend Server

In a separate terminal:

```powershell
cd "e:\win 11 c folder\desktop\Major\VocaCare-Backend-FastAPI"
uvicorn main:app --reload
```

The backend will run on http://localhost:8000

### 6. Start the Frontend

In another terminal:

```powershell
cd "e:\win 11 c folder\desktop\Major\Major Frontend"
npm run dev
```

Frontend will run on http://localhost:5173

## Testing the Full Integration

### Frontend Flow:

1. Open http://localhost:5173
2. The frontend has two voice agent options:
   - **ElevenLabs Widget** (already working)
   - **LiveKit Widget** (new - needs integration)

### Backend Endpoints Created:

- ✅ `POST /api/livekit-token` - Generate JWT token for LiveKit connections
- ✅ `POST /webhook/livekit` - Receive completed conversation data

### What Happens During a Call:

1. Frontend requests LiveKit token from backend
2. Backend generates secure token using LiveKit API
3. Frontend connects to LiveKit room
4. User speaks to AI agent
5. Agent asks registration questions
6. Agent processes answers using GPT-4o-mini
7. Agent saves data to MongoDB
8. Agent sends webhook to backend for real-time updates
9. Frontend updates patient list automatically

## File Structure

```
VocaCare-Backend-FastAPI/
├── livekit_agent.py          # ✅ Fixed - Voice agent implementation
├── main.py                    # ✅ Backend with LiveKit endpoints
├── database.py                # MongoDB connection
├── requirements.txt           # ✅ All dependencies installed
├── .env                       # ⚠️ Add LiveKit credentials here
├── .env.example               # Template for environment variables
├── start_livekit_agent.bat    # Windows launcher script
├── LIVEKIT_SETUP.md          # This file
├── LIVEKIT_INTEGRATION.md    # Detailed integration guide
└── LIVEKIT_README.md         # LiveKit documentation

Major Frontend/src/components/
├── LiveKitVoiceAgent.jsx     # ✅ Frontend component (needs integration)
└── App.jsx                    # Main app (integrate widget here)
```

## Troubleshooting

### Agent won't start?

```powershell
# Check if all packages installed
pip list | Select-String "livekit"

# Reinstall if needed
pip install -r requirements.txt
```

### Connection errors?

- Verify `.env` has correct `LIVEKIT_URL` (must start with `wss://`)
- Check API key and secret are correct
- Ensure no firewall blocking WebSocket connections

### Import errors?

- Make sure you're in the right directory
- Activate virtual environment if using one
- Reinstall dependencies

### No audio?

- Check microphone permissions
- Verify Deepgram API key is valid
- Check browser console for errors

## Production Deployment

See `LIVEKIT_INTEGRATION.md` for production deployment instructions including:

- Deploying agent to Render/Railway
- Configuring production environment variables
- Setting up webhooks
- Monitoring and logging

## Cost Estimates

### LiveKit Cloud Free Tier:

- 10,000 participant minutes/month
- ~166 hours of calls

### OpenAI GPT-4o-mini:

- $0.15 per 1M input tokens
- $0.60 per 1M output tokens
- Estimated: ~$0.01-0.05 per conversation

### Deepgram:

- $200 free credit (enough for ~8M words)
- $0.0043 per minute after credits

**Total Cost:** Nearly FREE for testing/small scale! 🎉

## Support

- LiveKit Docs: https://docs.livekit.io/
- LiveKit Discord: https://livekit.io/discord
- OpenAI Docs: https://platform.openai.com/docs
- Deepgram Docs: https://developers.deepgram.com/

---

**Status:** ✅ All code fixed and ready to test!
**Next:** Add LiveKit credentials to `.env` and run `python livekit_agent.py dev`
