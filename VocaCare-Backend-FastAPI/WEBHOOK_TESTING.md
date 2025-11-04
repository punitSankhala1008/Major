# 🧪 Webhook Testing Guide

## Method 1: Python Script (Easiest) ⭐

**Step 1:** Make sure your FastAPI backend is running
```powershell
cd "e:\win 11 c folder\desktop\Major\VocaCare-Backend-FastAPI"
python main.py
```

**Step 2:** In a new terminal, send test webhook
```powershell
cd "e:\win 11 c folder\desktop\Major\VocaCare-Backend-FastAPI"
python send_test_webhook.py
```

You should see:
```
✅ Webhook sent successfully!
📥 Server Response: {"status": "success", "message": "Webhook received"}
```

---

## Method 2: Using PowerShell (curl)

```powershell
$webhook = @{
    data = @{
        conversation_id = "test_conv_123"
        analysis = @{
            data_collection_results = @{
                Name = @{ value = "Test Patient" }
                Age = @{ value = 30 }
                Gender = @{ value = "Male" }
                Contact = @{ value = "1234567890" }
                "Address " = @{ value = "Test City" }
                Reason = @{ value = "Checkup" }
                "Preferred Doctor" = @{ value = "Dr. Smith" }
                "Previous Medical History" = @{ value = "None" }
                "Emergency Contact" = @{ value = "Emergency 9876543210" }
                "Appointment Preference" = @{ value = "Tomorrow 10 AM" }
            }
            transcript_summary = "Patient wants a checkup"
            call_successful = $true
        }
        transcript = @(
            @{ role = "agent"; message = "Hello!" }
            @{ role = "user"; message = "I need help" }
        )
        metadata = @{
            call_duration_secs = 120
        }
    }
}

$json = $webhook | ConvertTo-Json -Depth 10
Invoke-RestMethod -Uri "http://localhost:8000/webhook/elevenlabs" -Method Post -Body $json -ContentType "application/json"
```

---

## Method 3: Using Postman

1. **Download Postman**: https://www.postman.com/downloads/
2. **Create New Request**:
   - Method: `POST`
   - URL: `http://localhost:8000/webhook/elevenlabs`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):

```json
{
  "data": {
    "conversation_id": "test_conv_123",
    "analysis": {
      "data_collection_results": {
        "Name": { "value": "Alice Smith" },
        "Age": { "value": 28 },
        "Gender": { "value": "Female" },
        "Contact": { "value": "5551234567" },
        "Address ": { "value": "456 Oak Ave, Boston, MA" },
        "Reason": { "value": "Annual checkup" },
        "Preferred Doctor": { "value": "Dr. Brown" },
        "Previous Medical History": { "value": "None" },
        "Emergency Contact": { "value": "Bob Smith 5559876543" },
        "Appointment Preference": { "value": "Next week Monday" }
      },
      "transcript_summary": "Patient wants annual checkup next week",
      "call_successful": true
    },
    "transcript": [
      { "role": "agent", "message": "Hello! How can I help you?" },
      { "role": "user", "message": "I need a checkup" }
    ],
    "metadata": {
      "call_duration_secs": 150
    }
  }
}
```

3. **Click Send**

---

## Method 4: Using Frontend Test Button

**This is the simplest way!**

1. Start backend: `python main.py`
2. Start frontend: `npm run dev`
3. Open browser: http://localhost:5173
4. Click **"Test Sample Data"** button
5. Data appears instantly!

---

## Method 5: Check Stored Webhook

After sending a webhook, verify it was stored:

```powershell
# Check if webhook is stored
curl http://localhost:8000/api/get-latest-webhook

# Or using Invoke-RestMethod
Invoke-RestMethod -Uri "http://localhost:8000/api/get-latest-webhook"
```

---

## Method 6: Interactive API Docs (Swagger)

1. Start backend: `python main.py`
2. Open browser: http://localhost:8000/docs
3. Find `POST /webhook/elevenlabs` endpoint
4. Click **"Try it out"**
5. Paste JSON payload
6. Click **"Execute"**

---

## 🧪 Complete Testing Workflow

### Terminal 1 - Backend
```powershell
cd "e:\win 11 c folder\desktop\Major\VocaCare-Backend-FastAPI"
python main.py
```

### Terminal 2 - Send Webhook
```powershell
cd "e:\win 11 c folder\desktop\Major\VocaCare-Backend-FastAPI"
python send_test_webhook.py
```

### Terminal 3 - Frontend
```powershell
cd "e:\win 11 c folder\desktop\Major\Major Frontend"
npm run dev
```

### Browser
1. Open: http://localhost:5173
2. Click: **"Start Real-time"**
3. See: Patient data appears! ✨

---

## 🔍 Troubleshooting

### Webhook not received?

**Check backend is running:**
```powershell
curl http://localhost:8000/
```
Should return: `{"status": "running", ...}`

**Check backend terminal:** You should see:
```
✅ Received webhook data at 2025-11-04 ...
Conversation ID: test_conv_123
```

### Frontend not showing data?

1. **Click "Start Real-time"** button (top right)
2. **Check browser console** (F12) for errors
3. **Verify polling URL** in `App.jsx`:
   ```javascript
   pollingEndpoint: "http://localhost:8000/api/get-latest-webhook"
   ```

### CORS errors?

Make sure backend `main.py` has:
```python
allow_origins=["http://localhost:5173", "http://localhost:3000"]
```

---

## 📊 Expected Flow

```
1. Send Webhook → Backend receives
2. Backend stores data in memory
3. Frontend polls every 2 seconds
4. Frontend gets latest data
5. UI updates with patient info
6. (Optional) Saves to MongoDB
```

---

## 🎯 Quick Commands Cheat Sheet

```powershell
# Start backend
python main.py

# Test webhook
python send_test_webhook.py

# Test all endpoints
python test_backend.py

# Check latest webhook
curl http://localhost:8000/api/get-latest-webhook

# View API docs
start http://localhost:8000/docs

# Clear webhook data
curl -X DELETE http://localhost:8000/api/clear-webhook
```

---

## ✅ Success Indicators

You know it's working when:
- ✅ Backend shows: `✅ Received webhook data`
- ✅ Terminal shows conversation ID
- ✅ Frontend displays patient info
- ✅ "Saved to DB" appears (if MongoDB configured)
- ✅ Conversation summary shows at bottom

---

## 🚀 Next: Testing with Real ElevenLabs

Once local testing works, set up real webhooks:

1. **Install ngrok**: https://ngrok.com/download
2. **Run**: `ngrok http 8000`
3. **Copy URL**: `https://xxxx.ngrok.io`
4. **Configure ElevenLabs**: Add `https://xxxx.ngrok.io/webhook/elevenlabs`
5. **Make test call** to your ElevenLabs agent
6. **Watch data** appear in your app!
