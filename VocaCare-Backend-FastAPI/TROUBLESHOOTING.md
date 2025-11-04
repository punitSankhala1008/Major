# 🔧 Troubleshooting Guide - Backend API Issues

## Issue: Postman/Vercel requests not working but localhost works

### Problem

- ✅ Local server (`http://localhost:8000`) works fine
- ❌ Production server (`https://major-4w34.onrender.com`) doesn't respond to Postman
- ❌ Vercel frontend can't connect to backend

---

## Common Causes & Solutions

### 1. CORS (Cross-Origin Resource Sharing) Issues

#### Symptoms:

- Request fails in browser with CORS error
- Postman works but browser doesn't
- Frontend shows network errors

#### Solution:

The backend is now configured with `allow_origins=["*"]` which allows all origins.

**After deploying, test with:**

```bash
# Test from Postman - should work now
curl -X POST https://major-4w34.onrender.com/webhook/elevenlabs \
  -H "Content-Type: application/json" \
  -d '{"data":{"conversation_id":"test"}}'
```

---

### 2. Render.com Cold Start

#### Symptoms:

- First request takes 30-60 seconds
- Subsequent requests work fine
- Timeout errors on first request

#### Solution:

Render free tier puts services to sleep after inactivity.

**Workaround:**

1. **Ping the server regularly:**

   ```bash
   # Wake up the server
   curl https://major-4w34.onrender.com/
   ```

2. **Wait for wake-up:**

   - First request may take 30-60 seconds
   - Be patient, try again after 1 minute

3. **Use a keep-alive service:**
   - Use cron-job.org to ping your server every 14 minutes
   - URL to ping: `https://major-4w34.onrender.com/`

---

### 3. Request Timeout Issues

#### Symptoms:

- Request times out
- No response received
- Gateway timeout errors

#### Solution:

**Check if server is running:**

```bash
curl https://major-4w34.onrender.com/
```

**If timeout persists:**

1. Check Render dashboard for errors
2. Check deployment logs
3. Verify service is running

---

### 4. SSL/HTTPS Issues

#### Symptoms:

- Mixed content errors
- Certificate errors
- HTTPS required errors

#### Solution:

**Always use HTTPS for production:**

```javascript
// ✅ Correct
pollingEndpoint: "https://major-4w34.onrender.com/api/get-latest-webhook";

// ❌ Wrong
pollingEndpoint: "http://major-4w34.onrender.com/api/get-latest-webhook";
```

---

### 5. Environment Variables Not Set

#### Symptoms:

- Server runs locally but fails on Render
- Missing configuration errors
- Database connection errors

#### Solution:

**On Render Dashboard:**

1. Go to your service
2. Click "Environment" tab
3. Add environment variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   MONGODB_DATABASE=medical_records
   ALLOWED_ORIGINS=*
   ```

---

## Testing Checklist

### ✅ Step-by-Step Testing

#### 1. Test Health Check

```bash
curl https://major-4w34.onrender.com/
```

**Expected Response:**

```json
{
  "status": "running",
  "service": "VocaCare Backend API",
  "timestamp": "2025-11-05T..."
}
```

#### 2. Test Webhook POST

```bash
curl -X POST https://major-4w34.onrender.com/webhook/elevenlabs \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "conversation_id": "test_123",
      "analysis": {
        "data_collection_results": {
          "Name": {"value": "Test User"}
        }
      }
    }
  }'
```

**Expected Response:**

```json
{
  "status": "success",
  "message": "Webhook received and processed"
}
```

#### 3. Test Get Latest

```bash
curl https://major-4w34.onrender.com/api/get-latest-webhook
```

**Expected Response:**

```json
{
  "body": {
    "data": {
      "conversation_id": "test_123",
      ...
    }
  },
  "timestamp": 1234567890
}
```

#### 4. Test from Postman

**Request Settings:**

- **Method:** POST
- **URL:** `https://major-4w34.onrender.com/webhook/elevenlabs`
- **Headers:**
  - `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "data": {
      "conversation_id": "postman_test",
      "analysis": {
        "data_collection_results": {
          "Name": { "value": "Postman Test" }
        }
      }
    }
  }
  ```

#### 5. Test from Frontend

**Open browser console and check:**

```javascript
// Check network requests
fetch("https://major-4w34.onrender.com/")
  .then((r) => r.json())
  .then(console.log)
  .catch(console.error);
```

---

## Debugging Tools

### 1. Check Server Logs (Render)

1. Go to Render dashboard
2. Select your service
3. Click "Logs" tab
4. Look for errors or incoming requests

### 2. Test with Verbose Curl

```bash
curl -v https://major-4w34.onrender.com/
```

### 3. Check Response Headers

```bash
curl -I https://major-4w34.onrender.com/
```

### 4. Browser DevTools

1. Open frontend in browser
2. Press F12
3. Go to "Network" tab
4. Click "Start Real-time" button
5. Check for failed requests

---

## Common Error Messages & Fixes

### "Failed to fetch"

**Cause:** CORS issue or server not responding
**Fix:**

- Check CORS settings are `allow_origins=["*"]`
- Verify server is running: `curl https://major-4w34.onrender.com/`

### "ERR_CONNECTION_REFUSED"

**Cause:** Server is down or URL is wrong
**Fix:**

- Check Render dashboard - is service running?
- Verify URL is correct (no typos)
- Wait for cold start (30-60 seconds)

### "502 Bad Gateway"

**Cause:** Server crashed or restarting
**Fix:**

- Check Render logs for errors
- Redeploy the service
- Check code for runtime errors

### "504 Gateway Timeout"

**Cause:** Request took too long, cold start
**Fix:**

- Wait for server to wake up
- Try request again after 1 minute
- Set up keep-alive ping

### "CORS policy blocked"

**Cause:** CORS not configured properly
**Fix:**

- Already fixed with `allow_origins=["*"]`
- Redeploy to Render
- Clear browser cache

---

## Quick Fixes

### Fix 1: Redeploy Backend

```bash
git add .
git commit -m "Fix CORS configuration"
git push origin main
```

Render will auto-deploy.

### Fix 2: Wake Up Server

```bash
# Wake up sleeping Render service
curl https://major-4w34.onrender.com/
# Wait 30 seconds
curl https://major-4w34.onrender.com/
```

### Fix 3: Clear Frontend Cache

In browser:

1. Press Ctrl+Shift+Delete
2. Clear "Cached images and files"
3. Refresh page (Ctrl+F5)

### Fix 4: Test with Different Tool

If Postman fails, try:

```bash
# Using curl
curl -X POST https://major-4w34.onrender.com/webhook/elevenlabs \
  -H "Content-Type: application/json" \
  -d '{"test":"data"}'

# Using PowerShell
Invoke-RestMethod -Uri "https://major-4w34.onrender.com/" -Method Get
```

---

## Verification Commands

### Check if CORS is working

```bash
curl -H "Origin: https://major-nine-gamma.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://major-4w34.onrender.com/webhook/elevenlabs
```

Should return CORS headers in response.

### Check if server accepts POST

```bash
curl -X POST https://major-4w34.onrender.com/webhook/elevenlabs \
     -H "Content-Type: application/json" \
     -d '{"test":"minimal"}' \
     -v
```

Should return 200 OK with success message.

---

## Still Not Working?

### 1. Check Render Service Status

- Dashboard: https://dashboard.render.com/
- Verify service is "Live" not "Suspended"
- Check "Events" tab for deployment errors

### 2. Check Deployment Logs

Look for:

- `✅ Server is running` message
- Port binding confirmation
- No Python errors
- CORS middleware loaded

### 3. Test Basic Connectivity

```bash
# Can you reach the server at all?
ping major-4w34.onrender.com

# DNS resolving correctly?
nslookup major-4w34.onrender.com
```

### 4. Verify Python Dependencies

On Render, check that `requirements.txt` is correct:

```
fastapi==0.109.0
uvicorn[standard]==0.27.0
python-dotenv==1.0.0
requests==2.31.0
```

---

## Contact & Support

**If all else fails:**

1. Check Render status page: https://status.render.com/
2. Review Render docs: https://render.com/docs
3. Check FastAPI docs: https://fastapi.tiangolo.com/
4. Create GitHub issue with:
   - Error message
   - What you tried
   - Server logs
   - Network request details

---

## After Fixing

### Redeploy to Render:

```bash
git add .
git commit -m "Fix CORS and improve error handling"
git push origin main
```

### Test Again:

```bash
# Wait 2-3 minutes for deployment
# Then test
curl https://major-4w34.onrender.com/
```

### Update Documentation:

Document what fixed it for future reference!
