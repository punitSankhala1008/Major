# LiveKit Voice Agent - Frontend Integration ✅

## What Was Added

The LiveKit voice agent has been fully integrated into the VocaCare frontend with a beautiful UI!

## Features

### 1. **Voice Agent Switcher** 🎙️

- **Location:** Bottom-left corner (floating widget)
- **Options:**
  - **LiveKit AI** - New cost-effective voice agent
  - **ElevenLabs** - Original premium voice agent
- **Functionality:** Click to switch between agents on the fly

### 2. **LiveKit Voice Widget** 📞

- **Location:** Bottom-right corner when LiveKit is selected
- **Features:**
  - Beautiful card UI with gradient accents
  - Connection status indicator (animated pulse)
  - Mute/Unmute microphone control
  - End call button
  - Real-time error handling
  - Auto-connects to LiveKit room

### 3. **Auto-Refresh Integration** 🔄

- When a LiveKit call ends, automatically triggers data polling
- New patient data appears in the dashboard immediately
- Seamless integration with existing polling system

## UI Components

### Voice Agent Toggle (Bottom-Left)

```
┌─────────────────────────┐
│    Voice Agent          │
│  ┌──────────┬─────────┐ │
│  │LiveKit AI│ElevenLabs│ │
│  └──────────┴─────────┘ │
└─────────────────────────┘
```

### LiveKit Widget (Bottom-Right)

```
┌──────────────────────────────┐
│ 🔵 VocaCare Voice AI         │
├──────────────────────────────┤
│ Click to start registration  │
│                              │
│  ┌──────────────────────┐   │
│  │   📞 Start Call      │   │
│  └──────────────────────┘   │
└──────────────────────────────┘

When Connected:
┌──────────────────────────────┐
│ 🔵 VocaCare Voice AI         │
├──────────────────────────────┤
│ 🟢 Connected - Listening...  │
│                              │
│  ┌─────────┬──────────────┐ │
│  │🎤 Mute  │ 📞 End Call  │ │
│  └─────────┴──────────────┘ │
└──────────────────────────────┘
```

## How It Works

### User Flow:

1. **Select Voice Agent**

   - User clicks "LiveKit AI" button in bottom-left corner
   - LiveKit widget appears in bottom-right corner
   - ElevenLabs widget (if loaded) is hidden

2. **Start Call**

   - User clicks "Start Call" button
   - Frontend requests token from backend: `POST /api/livekit-token`
   - Backend generates secure JWT token with LiveKit credentials
   - Frontend connects to LiveKit room using token
   - Connection status changes to "Connected - Listening..."

3. **During Call**

   - User speaks to AI agent
   - AI asks registration questions
   - User can mute/unmute microphone
   - Green pulse indicator shows active connection
   - Microphone is enabled by default

4. **End Call**
   - User clicks "End Call" or AI completes registration
   - Room disconnects
   - LiveKit agent processes conversation with GPT-4o-mini
   - Agent saves data to MongoDB
   - Agent sends webhook to backend: `POST /webhook/livekit`
   - Frontend polling picks up new patient data
   - Patient info appears in dashboard

### Technical Flow:

```
Frontend (React)
    ↓
    → Request Token: POST /api/livekit-token
    ← Receive: {token, url}
    ↓
    → Connect to LiveKit Room (WebSocket)
    ↓
LiveKit Cloud ← → LiveKit Agent (Python)
    ↓
    → User speaks → Deepgram STT → GPT-4o-mini → OpenAI TTS → User hears
    ↓
    → Agent extracts data → Saves to MongoDB
    ↓
    → Send webhook: POST /webhook/livekit
    ↓
Frontend polls → GET /api/patients → Display updated data
```

## Code Structure

### Files Modified:

1. **`src/App.jsx`**

   - Added `LiveKitVoiceAgent` import
   - Added `voiceAgentType` state ("livekit" or "elevenlabs")
   - Added voice agent toggle UI
   - Added conditional rendering of LiveKit widget
   - Added `onCallComplete` callback to trigger polling

2. **`src/components/LiveKitVoiceAgent.jsx`** (Already exists)
   - Beautiful card-based UI
   - LiveKit client integration
   - Token fetching from backend
   - Room connection management
   - Microphone controls
   - Error handling

## Environment Setup

Make sure your `.env` file has:

```env
VITE_API_BASE_URL=https://major-4w34.onrender.com
```

Or for local development:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Testing the Integration

### 1. Start Backend

```powershell
cd "e:\win 11 c folder\desktop\Major\VocaCare-Backend-FastAPI"
python main.py
# Backend runs on http://localhost:8000
```

### 2. Start LiveKit Agent

```powershell
cd "e:\win 11 c folder\desktop\Major\VocaCare-Backend-FastAPI"
python livekit_agent.py dev
# Agent connects to LiveKit Cloud
```

### 3. Start Frontend

```powershell
cd "e:\win 11 c folder\desktop\Major\Major Frontend"
npm run dev
# Frontend runs on http://localhost:5173
```

### 4. Test the Flow

1. Open http://localhost:5173
2. Click "LiveKit AI" button (bottom-left)
3. Click "Start Call" button (bottom-right)
4. Speak: "My name is John Doe"
5. AI will respond and ask for age
6. Continue answering questions
7. Click "End Call" when done
8. Watch patient data appear in dashboard

## Switching Between Voice Agents

### LiveKit AI

- **Pros:** Cost-effective, customizable, open-source
- **Use Case:** Production deployment, high volume
- **Cost:** ~$0.01-0.05 per conversation

### ElevenLabs

- **Pros:** Premium voice quality, zero setup
- **Use Case:** Demos, small scale testing
- **Cost:** Based on characters generated

**To Switch:**
Just click the button in the bottom-left toggle!

## Troubleshooting

### Widget Doesn't Appear

- Check browser console for errors
- Verify LiveKit script loaded: `window.LivekitClient`
- Check network tab for token request

### Can't Connect to Room

- Verify backend is running
- Check `.env` has correct `VITE_API_BASE_URL`
- Verify LiveKit credentials in backend `.env`
- Check browser console for specific error

### No Audio

- Grant microphone permissions in browser
- Check microphone is not muted in system
- Verify Deepgram API key in backend
- Check LiveKit agent is running (`python livekit_agent.py dev`)

### Data Not Appearing

- Verify MongoDB connection in backend
- Check webhook endpoint is accessible
- Enable polling in frontend (toggle switch)
- Check backend logs for errors

## Browser Compatibility

✅ **Supported:**

- Chrome/Edge (Recommended)
- Firefox
- Safari (macOS/iOS)
- Opera

⚠️ **Requirements:**

- WebRTC support
- Microphone access
- WebSocket support

## Production Deployment

### Frontend (.env.production):

```env
VITE_API_BASE_URL=https://major-4w34.onrender.com
```

### Build:

```powershell
npm run build
```

### Deploy to Vercel:

```powershell
vercel --prod
```

The LiveKit widget will work on production automatically!

## Styling Customization

The widget uses Tailwind CSS. To customize colors:

**In `LiveKitVoiceAgent.jsx`:**

- Primary color: `blue-500` → Change to your brand color
- Accent color: `indigo-600` → Change to your accent
- Success: `green-500` → Connection status
- Danger: `red-500` → End call button

## Future Enhancements

Possible improvements:

- [ ] Add call duration timer
- [ ] Show real-time transcription
- [ ] Add volume indicator/waveform
- [ ] Save call recordings
- [ ] Multi-language support
- [ ] Custom voice selection
- [ ] Call analytics dashboard

---

**Status:** ✅ Frontend fully integrated and ready to use!
**Next Step:** Set up LiveKit credentials in backend `.env` and test the complete flow!
