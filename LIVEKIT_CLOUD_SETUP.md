# 🚀 LiveKit Cloud Setup Guide

## Current Issue

❌ **Your LiveKit URL `wss://vocacare-35hdm07h.livekit.cloud` is invalid/deleted**

This is why:

- Agent registers successfully ✅
- Frontend connects ✅
- Token is generated ✅
- BUT no voice interaction happens ❌

## Why This Happens

The LiveKit project at that URL doesn't exist anymore. You need to create a NEW project.

## Step-by-Step Setup

### 1. Create LiveKit Account

1. Go to: **https://cloud.livekit.io/**
2. Click **"Sign Up"** or **"Sign In"**
3. Use Google/GitHub for quick signup

### 2. Create New Project

1. After login, click **"Create Project"**
2. Enter project name: `VocaCare` (or any name you like)
3. Select region: **Asia Pacific** (closest to India)
4. Click **"Create"**

### 3. Get Your Credentials

After creating the project, you'll see:

```
LiveKit URL: wss://vocacare-xxxxxx.livekit.cloud
API Key: APIxxxxxxxxxxxxxxx
API Secret: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**⚠️ IMPORTANT:** Copy these NOW! The secret is only shown once.

### 4. Update Your .env Files

#### Backend (.env)

Open: `VocaCare-Backend-FastAPI/.env`

Replace these lines:

```bash
LIVEKIT_URL=wss://vocacare-35hdm07h.livekit.cloud
LIVEKIT_API_KEY=APItNcTReJH7o4t
LIVEKIT_API_SECRET=tdfQmootfGoQstl0vrxs9NFZw53oLM0UdnqJqL1VndQ
```

With your NEW credentials:

```bash
LIVEKIT_URL=wss://your-new-project.livekit.cloud
LIVEKIT_API_KEY=your-new-api-key
LIVEKIT_API_SECRET=your-new-api-secret
```

### 5. Restart Everything

**Terminal 1 - Backend:**

```powershell
cd "E:\win 11 c folder\desktop\Major\VocaCare-Backend-FastAPI"
python main.py
```

**Terminal 2 - LiveKit Agent:**

```powershell
cd "E:\win 11 c folder\desktop\Major\VocaCare-Backend-FastAPI"
python livekit_agent.py dev
```

**Terminal 3 - Frontend:**

```powershell
cd "E:\win 11 c folder\desktop\Major\Major Frontend"
npm run dev
```

### 6. Test Your Voice Agent

1. Open: **http://localhost:5174**
2. Click **LiveKit** in the bottom-left voice agent switcher
3. Click **"Start Call"** in the widget
4. **Speak:** "Hello"
5. The AI should respond: "Hello! Welcome to VocaCare..."

## What You Should See

### In Terminal 2 (Agent):

```
INFO:livekit.agents:registered worker
INFO:livekit.agents:received job request
INFO:__mp_main__:🎤 Starting patient registration session
INFO:__mp_main__:👤 Participant connected: Patient
```

### In Frontend:

```
Connected - Listening...
[Green pulsing dot]
```

### In Browser Console:

```
Connected to LiveKit room
Participant connected: agent
```

## Troubleshooting

### "Still not connecting"

1. Clear browser cache (Ctrl+Shift+Delete)
2. Restart all 3 terminals
3. Make sure .env has NO extra spaces around the `=` sign
4. Check LiveKit Cloud dashboard shows "Active" project

### "Agent not receiving jobs"

1. Make sure agent terminal shows: `registered worker`
2. Check the URL matches exactly (including `wss://`)
3. Verify API Key/Secret have no typos

### "Token generation failed"

1. Double-check API credentials in .env
2. Make sure no quotes around values in .env
3. Restart backend after changing .env

## LiveKit Free Tier Limits

✅ **50 GB/month** - bandwidth  
✅ **Unlimited rooms** - concurrent sessions  
✅ **Unlimited participants**  
✅ **No credit card required** for free tier

Perfect for development and testing!

## Next Steps After Setup

Once you have valid credentials:

1. ✅ Voice agent will work with Gemini 2.0 Flash
2. ✅ Patient data will be saved to MongoDB
3. ✅ Real-time updates on frontend
4. ✅ Full transcript recording

## Security Notes

⚠️ **NEVER commit .env to GitHub!**  
Already in .gitignore, but double-check:

```bash
git status
# Should NOT show .env file
```

## Cost Estimates

### Development (Free Tier):

- $0/month (within free limits)

### Production (if you exceed free tier):

- ~$0.005 per participant per minute
- For 100 calls/day × 5 min avg = ~$75/month
- Much cheaper than Twilio/other voice APIs

---

**Get your credentials and update .env - that's all you need!** 🎉
