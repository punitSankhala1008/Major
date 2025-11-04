# 🚀 VocaCare Deployment Checklist

## Current Status

✅ Frontend MongoDB security issue **FIXED**  
✅ Backend MongoDB integration **COMPLETE**  
✅ Build successful  
⏳ Ready to deploy

---

## 1️⃣ Deploy Frontend (Vercel)

### Commands

```bash
cd "e:\win 11 c folder\desktop\Major\Major Frontend"
git add .
git commit -m "Security fix: Remove client-side MongoDB connection"
git push origin main
```

### Vercel will auto-deploy

- URL: https://major-nine-gamma.vercel.app
- Build time: ~1-2 minutes

### Verify

- ✅ No MongoDB errors in browser console
- ✅ Status panel shows "Backend Database - Auto-save enabled"
- ✅ Polling works correctly

---

## 2️⃣ Deploy Backend (Render)

### Add Environment Variable First!

**Go to Render Dashboard → VocaCare Backend → Environment**

Add this variable:

```
MONGO_DB_URI=mongodb+srv://sankhalapunit10:Punit123@company.bnxmedc.mongodb.net/
```

### Deploy Commands

```bash
cd "e:\win 11 c folder\desktop\Major\VocaCare-Backend-FastAPI"
git add .
git commit -m "Add MongoDB database integration with auto-save"
git push origin main
```

### Wait for Render

- Cold start: 30-60 seconds
- Active deployment: 2-3 minutes

### Verify Deployment

```bash
# Health check
curl https://major-4w34.onrender.com/

# Database stats
curl https://major-4w34.onrender.com/api/stats

# Should return: {"total_patients": 0}
```

---

## 3️⃣ Test Complete Flow

### A. Send Test Webhook

```bash
cd "e:\win 11 c folder\desktop\Major\VocaCare-Backend-FastAPI"

# Send test data
python send_test_webhook.py
```

### B. Verify Database Save

```bash
# Check if patient was saved
curl https://major-4w34.onrender.com/api/patients

# Check stats
curl https://major-4w34.onrender.com/api/stats
# Should show: {"total_patients": 1}
```

### C. Test Frontend Polling

1. Open https://major-nine-gamma.vercel.app
2. Toggle "Enable Polling" ON
3. Click "Load Sample Data"
4. Verify data appears in Patient Info section

---

## 4️⃣ Configure ElevenLabs Webhook

### Settings

```
Agent ID: agent_7601k94ncjtge2s91yvv72k9zc27
Webhook URL: https://major-4w34.onrender.com/webhook/elevenlabs
```

### Test Real Voice Call

1. Open https://major-nine-gamma.vercel.app
2. Click the microphone widget
3. Have a conversation with the AI agent
4. Complete the call
5. Wait 2-5 seconds for webhook
6. Verify data appears on frontend

---

## 5️⃣ Production Verification Checklist

### Backend Health

- [ ] `/` returns welcome message
- [ ] `/api/stats` returns patient count
- [ ] `/api/patients` returns patient list
- [ ] `/webhook/elevenlabs` accepts POST requests

### Frontend Display

- [ ] No console errors
- [ ] Polling toggle works
- [ ] Sample data loads correctly
- [ ] Real webhook data displays
- [ ] Database status shows "Auto-save enabled"

### Database Operations

- [ ] Webhooks auto-save to MongoDB
- [ ] Patient records persist
- [ ] Stats endpoint accurate
- [ ] Query by conversation ID works

---

## 🎯 Success Criteria

✅ Frontend deployed without MongoDB errors  
✅ Backend connected to MongoDB Atlas  
✅ Webhooks auto-save patient data  
✅ Frontend polls and displays real-time data  
✅ ElevenLabs widget sends webhooks successfully  
✅ No security issues (credentials not exposed)

---

## 🔧 Troubleshooting

### Frontend not updating

- Check polling is enabled
- Verify backend URL in API_CONFIG
- Check browser console for errors

### Backend not saving to database

- Verify MONGO_DB_URI environment variable set in Render
- Check Render logs: `View Logs` in dashboard
- Test with: `python test_database.py` locally

### ElevenLabs webhook not received

- Verify webhook URL configured correctly
- Check for cold start delays (first request takes longer)
- View Render logs to see incoming requests

---

## 📝 Notes

- **Cold Starts**: Render free tier sleeps after 15 min inactivity
- **First Request**: May take 30-60 seconds after sleep
- **Polling Interval**: Frontend polls every 2 seconds
- **Database**: MongoDB Atlas free tier (512MB)

---

## 🆘 Quick Commands Reference

```bash
# Test backend locally
cd "e:\win 11 c folder\desktop\Major\VocaCare-Backend-FastAPI"
python main.py

# Test database connection
python test_database.py

# Send test webhook
python send_test_webhook.py

# Test all endpoints
python test_backend.py

# Build frontend
cd "e:\win 11 c folder\desktop\Major\Major Frontend"
npm run build

# Run frontend locally
npm run dev
```

---

**Ready to deploy? Start with Step 1! 🚀**
