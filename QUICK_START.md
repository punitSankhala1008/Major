# 🚀 VocaCare Quick Start Guide

## FastAPI Backend Setup

### Step 1: Install Python Dependencies

```powershell
# Navigate to backend folder
cd "e:\win 11 c folder\desktop\Major\VocaCare-Backend-FastAPI"

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# If execution policy error, run:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Install dependencies
pip install -r requirements.txt
```

### Step 2: Start FastAPI Server

```powershell
# Simple version (no MongoDB)
python main.py

# OR with MongoDB support
python main_with_mongodb.py
```

You should see:

```
🚀 Starting VocaCare FastAPI Backend...
📡 Webhook endpoint: http://localhost:8000/webhook/elevenlabs
🔄 Polling endpoint: http://localhost:8000/api/get-latest-webhook
📊 API Docs: http://localhost:8000/docs
```

---

## Frontend Setup

### Step 1: Install Frontend Dependencies

```powershell
# Navigate to frontend folder
cd "e:\win 11 c folder\desktop\Major\Major Frontend"

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

---

## 🧪 Testing the Complete System

### Option 1: Test with Sample Data (No ElevenLabs needed)

1. **Start Backend**: `python main.py`
2. **Start Frontend**: `npm run dev`
3. **Open Browser**: http://localhost:5173
4. **Click**: "Test Sample Data" button
5. **Click**: "Start Real-time" to begin polling
6. **See**: Patient data appears automatically!

### Option 2: Test with ElevenLabs (Real Voice Agent)

#### A. Setup ElevenLabs Webhook

1. **Expose Local Server** (choose one):

   **Using ngrok** (recommended):

   ```powershell
   # Download from: https://ngrok.com/download
   ngrok http 8000
   ```

   You'll get a URL like: `https://abcd-1234.ngrok.io`

   **Using localtunnel**:

   ```powershell
   npm install -g localtunnel
   lt --port 8000
   ```

2. **Configure ElevenLabs**:
   - Go to your ElevenLabs agent settings
   - Find "Webhooks" section
   - Add URL: `https://your-ngrok-url.ngrok.io/webhook/elevenlabs`

#### B. Test Real Voice Call

1. **Start Backend**: `python main.py`
2. **Start Frontend**: `npm run dev`
3. **Start ngrok**: `ngrok http 8000`
4. **Click "Start Real-time"** in the frontend
5. **Call your ElevenLabs agent** (or test from ElevenLabs dashboard)
6. **Watch data appear** in real-time!

---

## 📋 API Endpoints

### Backend (http://localhost:8000)

| Method | Endpoint                  | Description                                   |
| ------ | ------------------------- | --------------------------------------------- |
| GET    | `/`                       | Health check                                  |
| POST   | `/webhook/elevenlabs`     | Receives ElevenLabs webhooks                  |
| GET    | `/api/get-latest-webhook` | Get latest patient data (frontend polls this) |
| GET    | `/api/webhook-status`     | Check if data is available                    |
| DELETE | `/api/clear-webhook`      | Clear stored data                             |
| GET    | `/docs`                   | Interactive API documentation                 |

### With MongoDB Version

Additional endpoints in `main_with_mongodb.py`:

| Method | Endpoint             | Description             |
| ------ | -------------------- | ----------------------- |
| GET    | `/api/patients`      | Get all patient records |
| GET    | `/api/patients/{id}` | Get specific patient    |
| GET    | `/api/stats`         | Database statistics     |

---

## 🔧 Troubleshooting

### Backend Issues

**Port 8000 already in use:**

```powershell
# Find and kill process
netstat -ano | findstr :8000
taskkill /PID <process_id> /F

# Or use different port
uvicorn main:app --port 8001
```

**Module not found:**

```powershell
pip install -r requirements.txt
```

**Virtual environment not activating:**

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\venv\Scripts\Activate.ps1
```

### Frontend Issues

**CORS errors:**

- Make sure backend is running on port 8000
- Check `allow_origins` in `main.py`

**Polling not working:**

- Check browser console for errors
- Verify backend URL: http://localhost:8000/api/get-latest-webhook
- Click "Start Real-time" button

**No data appearing:**

- Click "Test Sample Data" first
- Check if backend is receiving requests (check terminal)

---

## 📁 Project Structure

```
Major/
├── VocaCare-Backend-FastAPI/
│   ├── main.py                    # ⭐ Simple backend (start here)
│   ├── main_with_mongodb.py       # MongoDB version
│   ├── requirements.txt           # Python dependencies
│   ├── .env.example              # Environment template
│   └── README.md                 # Detailed backend docs
│
└── Major Frontend/
    ├── src/
    │   ├── App.jsx               # Main app logic
    │   └── components/           # UI components
    ├── package.json
    └── index.html
```

---

## ✅ Checklist

- [ ] Python 3.8+ installed
- [ ] Node.js installed
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Backend running (http://localhost:8000)
- [ ] Frontend running (http://localhost:5173)
- [ ] Tested with "Test Sample Data" button
- [ ] (Optional) ngrok running for ElevenLabs
- [ ] (Optional) ElevenLabs webhook configured

---

## 🎯 Next Steps

1. ✅ **Basic Setup**: Get both frontend and backend running
2. 🧪 **Test Locally**: Use "Test Sample Data" button
3. 🔗 **ElevenLabs**: Configure webhook with ngrok
4. 💾 **Database**: Set up MongoDB for persistence
5. 🚀 **Deploy**: Deploy to production (Render, Railway, etc.)

---

## 📞 Need Help?

- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **ElevenLabs Docs**: https://elevenlabs.io/docs
- **API Testing**: http://localhost:8000/docs (Swagger UI)
