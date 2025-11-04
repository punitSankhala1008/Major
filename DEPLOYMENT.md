# 🚀 VocaCare Deployment Information

## 📦 Deployed URLs

### Frontend (Vercel)

**Production URL:** https://major-nine-gamma.vercel.app

**Features:**

- ✅ AI-Powered Patient Registration Interface
- ✅ Real-time webhook polling
- ✅ Voice agent integration
- ✅ Beautiful UI with Tailwind CSS

### Backend (Render)

**Production URL:** https://major-4w34.onrender.com

**Features:**

- ✅ FastAPI REST API
- ✅ Webhook receiver for ElevenLabs
- ✅ Real-time data polling
- ✅ CORS enabled for frontend
- ✅ Interactive API docs at `/docs`

### API Documentation

**Swagger UI:** https://major-4w34.onrender.com/docs
**ReDoc:** https://major-4w34.onrender.com/redoc

---

## 🔗 Integration Points

### ElevenLabs Webhook Configuration

Configure your ElevenLabs agent to send webhooks to:

```
https://major-4w34.onrender.com/webhook/elevenlabs
```

### Frontend API Configuration

The frontend is configured to poll:

```
https://major-4w34.onrender.com/api/get-latest-webhook
```

---

## 🧪 Testing Production

### 1. Health Check

```bash
curl https://major-4w34.onrender.com/
```

Expected Response:

```json
{
  "status": "running",
  "service": "VocaCare Backend API",
  "timestamp": "2025-11-04T..."
}
```

### 2. Send Test Webhook

```bash
curl -X POST https://major-4w34.onrender.com/webhook/elevenlabs \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "conversation_id": "prod_test_123",
      "analysis": {
        "data_collection_results": {
          "Name": {"value": "Test Patient"},
          "Age": {"value": 30}
        }
      }
    }
  }'
```

### 3. Check Latest Webhook

```bash
curl https://major-4w34.onrender.com/api/get-latest-webhook
```

### 4. Test Frontend

1. Open: https://major-nine-gamma.vercel.app
2. Click "Start Real-time" button
3. Click "Test Sample Data" to populate with demo data
4. Watch data appear in real-time!

---

## 🔐 CORS Configuration

The backend allows requests from:

- ✅ `http://localhost:5173` (Local development)
- ✅ `http://localhost:3000` (Alternative local port)
- ✅ `http://localhost:8000` (Backend local)
- ✅ `https://major-4w34.onrender.com` (Production backend)
- ✅ `https://major-nine-gamma.vercel.app` (Production frontend)

---

## 📊 API Endpoints

### Public Endpoints

| Method | Endpoint                  | Description                 |
| ------ | ------------------------- | --------------------------- |
| GET    | `/`                       | Health check                |
| POST   | `/webhook/elevenlabs`     | Receive ElevenLabs webhooks |
| GET    | `/api/get-latest-webhook` | Get latest patient data     |
| GET    | `/api/webhook-status`     | Check webhook availability  |
| DELETE | `/api/clear-webhook`      | Clear stored data           |
| GET    | `/docs`                   | Swagger API documentation   |
| GET    | `/redoc`                  | ReDoc API documentation     |

---

## 🛠️ Environment Variables

### Backend (.env)

```bash
# Server Configuration
HOST=0.0.0.0
PORT=8000

# CORS Origins
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,https://major-nine-gamma.vercel.app

# MongoDB (Optional)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DATABASE=medical_records
MONGODB_COLLECTION=patient_registrations
```

### Frontend (.env)

```bash
# API Configuration
VITE_API_URL=https://major-4w34.onrender.com/api/get-latest-webhook
```

---

## 🔄 Complete Workflow

```mermaid
graph LR
    A[Patient Calls] --> B[ElevenLabs Agent]
    B --> C[Collects Information]
    C --> D[Sends Webhook to Backend]
    D --> E[Backend Stores Data]
    E --> F[Frontend Polls Backend]
    F --> G[Displays Patient Info]
    G --> H[Saves to MongoDB]
```

### Detailed Flow:

1. **Patient calls** → ElevenLabs voice agent
2. **Agent collects** → Name, age, reason, etc.
3. **Webhook sent** → `POST https://major-4w34.onrender.com/webhook/elevenlabs`
4. **Backend stores** → In-memory storage
5. **Frontend polls** → Every 2 seconds: `GET /api/get-latest-webhook`
6. **Data displays** → Real-time update in UI
7. **(Optional)** → Auto-save to MongoDB

---

## 📱 Access Points

### For Users

**Main Application:** https://major-nine-gamma.vercel.app

### For Developers

**API Documentation:** https://major-4w34.onrender.com/docs
**Health Check:** https://major-4w34.onrender.com/

### For ElevenLabs

**Webhook URL:** https://major-4w34.onrender.com/webhook/elevenlabs

---

## 🐛 Troubleshooting

### Frontend not receiving data?

1. Check backend is running: `curl https://major-4w34.onrender.com/`
2. Click "Start Real-time" button on frontend
3. Check browser console (F12) for errors
4. Verify CORS settings in backend

### Webhook not working?

1. Verify ElevenLabs webhook URL is correct
2. Check backend logs for incoming requests
3. Test manually: `curl -X POST https://major-4w34.onrender.com/webhook/elevenlabs ...`

### CORS errors?

1. Check `main.py` CORS settings
2. Verify frontend URL is in `allow_origins` list
3. Clear browser cache and try again

---

## 🚀 Deployment Commands

### Deploy Backend to Render

```bash
# Push to GitHub
git add .
git commit -m "Update backend"
git push origin main

# Render auto-deploys from GitHub
```

### Deploy Frontend to Vercel

```bash
# From frontend directory
cd "Major Frontend"

# Deploy
vercel --prod

# Or through Vercel dashboard (GitHub integration)
```

---

## 📈 Monitoring

### Backend Status

- **Render Dashboard:** https://dashboard.render.com/
- **Health Check:** https://major-4w34.onrender.com/
- **API Docs:** https://major-4w34.onrender.com/docs

### Frontend Status

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Live Site:** https://major-nine-gamma.vercel.app

---

## 🔧 Local Development

### Run Backend Locally

```powershell
cd "VocaCare-Backend-FastAPI"
python main.py
# Server runs at: http://localhost:8000
```

### Run Frontend Locally

```powershell
cd "Major Frontend"
npm run dev
# App runs at: http://localhost:5173
```

### Switch to Local Backend

In `App.jsx`, change:

```javascript
pollingEndpoint: "http://localhost:8000/api/get-latest-webhook";
```

---

## ✅ Production Checklist

- [x] Backend deployed to Render
- [x] Frontend deployed to Vercel
- [x] CORS configured for production URLs
- [x] ElevenLabs webhook URL updated
- [x] API documentation accessible
- [x] Health checks passing
- [x] Real-time polling working
- [ ] MongoDB configured (optional)
- [ ] Analytics setup (optional)
- [ ] Custom domain configured (optional)

---

## 📞 Support

**Repository:** https://github.com/punitSankhala1008/Major

**Issues:** Create an issue on GitHub

**Documentation:**

- Backend: `VocaCare-Backend-FastAPI/README.md`
- Testing: `CURL_COMMANDS.md`, `WEBHOOK_TESTING.md`
- Quick Start: `QUICK_START.md`
