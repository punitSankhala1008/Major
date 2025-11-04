# VocaCare FastAPI Backend

FastAPI backend server for VocaCare - AI-Powered Patient Registration System.

## 🚀 Features

- **Webhook Receiver**: Accepts webhooks from ElevenLabs ConvAI
- **Real-time Polling**: Frontend can poll for latest patient data
- **CORS Enabled**: Configured for local development
- **Auto-reload**: Hot reload during development
- **API Documentation**: Interactive docs at `/docs`

## 📋 Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

## 🛠️ Setup Instructions

### Step 1: Navigate to Backend Directory

```powershell
cd "e:\win 11 c folder\desktop\Major\VocaCare-Backend-FastAPI"
```

### Step 2: Create Virtual Environment (Recommended)

```powershell
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1

# If you get execution policy error, run:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Step 3: Install Dependencies

```powershell
pip install -r requirements.txt
```

### Step 4: Configure Environment (Optional)

```powershell
# Copy example env file
copy .env.example .env

# Edit .env file with your configurations
```

### Step 5: Run the Server

```powershell
# Option 1: Using Python directly
python main.py

# Option 2: Using Uvicorn command
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 📡 API Endpoints

### Health Check

- **GET** `/` - Check if server is running

### Webhook Endpoints

- **POST** `/webhook/elevenlabs` - Receives webhook from ElevenLabs
- **GET** `/api/get-latest-webhook` - Frontend polls this for latest data
- **GET** `/api/webhook-status` - Check if webhook data is available
- **DELETE** `/api/clear-webhook` - Clear stored webhook data

### API Documentation

- **GET** `/docs` - Interactive Swagger UI
- **GET** `/redoc` - ReDoc documentation

## 🔗 Integration with Frontend

Update your frontend `App.jsx` polling endpoint:

```javascript
const WEBHOOK_CONFIG = {
  pollingEndpoint: "http://localhost:8000/api/get-latest-webhook",
  pollingInterval: 2000,
};
```

## 🎯 ElevenLabs Configuration

1. Go to your ElevenLabs agent settings
2. Find the "Webhooks" section
3. Add webhook URL: `http://your-server-url:8000/webhook/elevenlabs`
4. For local testing, use ngrok or similar tunnel service

## 🧪 Testing

### Test with curl:

```powershell
# Test health check
curl http://localhost:8000/

# Test webhook endpoint (POST)
curl -X POST http://localhost:8000/webhook/elevenlabs -H "Content-Type: application/json" -d "{\"test\": \"data\"}"

# Get latest webhook
curl http://localhost:8000/api/get-latest-webhook
```

### Test with Frontend:

1. Start FastAPI backend: `python main.py`
2. Start frontend: `npm run dev` (in Major Frontend folder)
3. Click "Test Sample Data" button
4. Click "Start Real-time" to begin polling

## 🌐 Exposing Local Server (for ElevenLabs webhooks)

For ElevenLabs to send webhooks to your local server:

### Option 1: Using ngrok

```powershell
# Install ngrok: https://ngrok.com/download
ngrok http 8000
```

### Option 2: Using localtunnel

```powershell
npm install -g localtunnel
lt --port 8000
```

Use the public URL in your ElevenLabs webhook configuration.

## 📦 Project Structure

```
VocaCare-Backend-FastAPI/
├── main.py              # Main FastAPI application
├── requirements.txt     # Python dependencies
├── .env.example        # Example environment variables
├── .gitignore          # Git ignore file
└── README.md           # This file
```

## 🔧 Troubleshooting

### Port already in use

```powershell
# Change port in main.py or run with different port
uvicorn main:app --reload --port 8001
```

### CORS errors

- Check `allow_origins` in main.py matches your frontend URL
- Ensure frontend is running on allowed port (5173 or 3000)

### Virtual environment issues

```powershell
# Deactivate current environment
deactivate

# Remove and recreate
Remove-Item -Recurse -Force venv
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## 📝 Development Notes

- The server stores webhook data in memory (resets on restart)
- For production, add database integration (MongoDB recommended)
- Add authentication for production deployment
- Use environment variables for sensitive data

## 🚀 Next Steps

1. ✅ Set up FastAPI backend
2. ✅ Configure ElevenLabs webhooks
3. ✅ Test with frontend
4. 📊 Add MongoDB integration (optional)
5. 🔐 Add authentication (for production)
6. 🌐 Deploy to cloud (Render, Railway, etc.)

## 📞 Support

For issues or questions, check:

- FastAPI docs: https://fastapi.tiangolo.com/
- Uvicorn docs: https://www.uvicorn.org/
