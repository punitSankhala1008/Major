# VocaCare API - cURL Testing Commands

## Base URLs

**Local Backend:**

```
http://localhost:8000
```

**Production Backend (Render):**

```
https://major-4w34.onrender.com
```

**Frontend URLs:**

- **Local:** http://localhost:5173
- **Production (Vercel):** https://major-nine-gamma.vercel.app

---

## 1. Health Check

### Local

```bash
curl http://localhost:8000/
```

### Production

```bash
curl https://major-4w34.onrender.com/
```

**Expected Response:**

```json
{
  "status": "running",
  "service": "VocaCare Backend API",
  "timestamp": "2025-11-04T12:00:00.000000"
}
```

---

## 2. Send Webhook (POST)

### Local - Complete Patient Data

```bash
curl -X POST http://localhost:8000/webhook/elevenlabs \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "conversation_id": "test_conv_123456",
      "analysis": {
        "data_collection_results": {
          "Name": {"value": "John Doe"},
          "Age": {"value": 35},
          "Gender": {"value": "Male"},
          "Contact": {"value": "9876543210"},
          "Address ": {"value": "123 Main St, New York, NY"},
          "Reason": {"value": "Severe headache and fever"},
          "Preferred Doctor": {"value": "Dr. Sarah Johnson"},
          "Previous Medical History": {"value": "Diabetes, High blood pressure"},
          "Emergency Contact": {"value": "Jane Doe 9876543211"},
          "Appointment Preference": {"value": "Tomorrow at 9 AM"}
        },
        "transcript_summary": "Patient reports severe headache and fever with history of diabetes.",
        "call_successful": true
      },
      "transcript": [
        {"role": "agent", "message": "Hello! How can I help you today?"},
        {"role": "user", "message": "I have a severe headache and fever"}
      ],
      "metadata": {
        "call_duration_secs": 245
      }
    }
  }'
```

### Production

```bash
curl -X POST https://major-4w34.onrender.com/webhook/elevenlabs \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "conversation_id": "test_conv_789",
      "analysis": {
        "data_collection_results": {
          "Name": {"value": "Alice Smith"},
          "Age": {"value": 28},
          "Gender": {"value": "Female"},
          "Contact": {"value": "5551234567"},
          "Address ": {"value": "456 Oak Ave, Boston, MA"},
          "Reason": {"value": "Annual checkup"},
          "Preferred Doctor": {"value": "Dr. Brown"},
          "Previous Medical History": {"value": "None"},
          "Emergency Contact": {"value": "Bob Smith 5559876543"},
          "Appointment Preference": {"value": "Next week Monday"}
        },
        "transcript_summary": "Patient wants annual checkup next week",
        "call_successful": true
      },
      "transcript": [
        {"role": "agent", "message": "Welcome to VocaCare!"},
        {"role": "user", "message": "I need a checkup"}
      ],
      "metadata": {
        "call_duration_secs": 180
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

---

## 3. Get Latest Webhook (GET)

### Local

```bash
curl http://localhost:8000/api/get-latest-webhook
```

### Production

```bash
curl https://major-4w34.onrender.com/api/get-latest-webhook
```

**Expected Response:**

```json
{
  "body": {
    "data": {
      "conversation_id": "test_conv_123456",
      "analysis": {
        "data_collection_results": {
          "Name": {"value": "John Doe"},
          "Age": {"value": 35},
          ...
        }
      }
    }
  },
  "timestamp": 1762238858817
}
```

---

## 4. Check Webhook Status (GET)

### Local

```bash
curl http://localhost:8000/api/webhook-status
```

### Production

```bash
curl https://major-4w34.onrender.com/api/webhook-status
```

**Expected Response:**

```json
{
  "has_data": true,
  "last_update": 1762238858817
}
```

---

## 5. Clear Webhook Data (DELETE)

### Local

```bash
curl -X DELETE http://localhost:8000/api/clear-webhook
```

### Production

```bash
curl -X DELETE https://major-4w34.onrender.com/api/clear-webhook
```

**Expected Response:**

```json
{
  "status": "success",
  "message": "Webhook data cleared"
}
```

---

## 6. API Documentation (GET)

### Local

```bash
curl http://localhost:8000/docs
```

### Production

```bash
curl https://major-4w34.onrender.com/docs
```

Or open in browser:

- **Local:** http://localhost:8000/docs
- **Production:** https://major-4w34.onrender.com/docs

---

## PowerShell Versions (Windows)

### 1. Health Check

```powershell
Invoke-RestMethod -Uri "http://localhost:8000/" -Method Get
```

### 2. Send Webhook

```powershell
$body = @{
    data = @{
        conversation_id = "test_conv_ps_001"
        analysis = @{
            data_collection_results = @{
                Name = @{ value = "Test Patient" }
                Age = @{ value = 30 }
                Gender = @{ value = "Male" }
                Contact = @{ value = "1234567890" }
                "Address " = @{ value = "Test City, Test State" }
                Reason = @{ value = "Checkup" }
                "Preferred Doctor" = @{ value = "Dr. Smith" }
                "Previous Medical History" = @{ value = "None" }
                "Emergency Contact" = @{ value = "Emergency Contact 9876543210" }
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
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "http://localhost:8000/webhook/elevenlabs" -Method Post -Body $body -ContentType "application/json"
```

### 3. Get Latest Webhook

```powershell
Invoke-RestMethod -Uri "http://localhost:8000/api/get-latest-webhook" -Method Get
```

### 4. Clear Webhook

```powershell
Invoke-RestMethod -Uri "http://localhost:8000/api/clear-webhook" -Method Delete
```

---

## MongoDB Version Endpoints (main_with_mongodb.py)

### Get All Patients

```bash
# Local
curl http://localhost:8000/api/patients

# Production
curl https://major-4w34.onrender.com/api/patients
```

### Get Specific Patient by Conversation ID

```bash
# Local
curl http://localhost:8000/api/patients/test_conv_123456

# Production
curl https://major-4w34.onrender.com/api/patients/test_conv_123456
```

### Get Database Stats

```bash
# Local
curl http://localhost:8000/api/stats

# Production
curl https://major-4w34.onrender.com/api/stats
```

---

## Testing Workflow

### Complete Test Sequence:

```bash
# 1. Check server is running
curl http://localhost:8000/

# 2. Send a test webhook
curl -X POST http://localhost:8000/webhook/elevenlabs \
  -H "Content-Type: application/json" \
  -d '{"data":{"conversation_id":"test_123","analysis":{"data_collection_results":{"Name":{"value":"Test User"}}}}}'

# 3. Verify webhook was stored
curl http://localhost:8000/api/get-latest-webhook

# 4. Check webhook status
curl http://localhost:8000/api/webhook-status

# 5. Clear the data
curl -X DELETE http://localhost:8000/api/clear-webhook

# 6. Verify data cleared
curl http://localhost:8000/api/get-latest-webhook
```

---

## Quick Test (One-liner)

### Simple Test Webhook

```bash
curl -X POST http://localhost:8000/webhook/elevenlabs -H "Content-Type: application/json" -d '{"data":{"conversation_id":"quick_test","analysis":{"data_collection_results":{"Name":{"value":"Quick Test"}}}}}'
```

### Production Quick Test

```bash
curl -X POST https://major-4w34.onrender.com/webhook/elevenlabs -H "Content-Type: application/json" -d '{"data":{"conversation_id":"prod_test","analysis":{"data_collection_results":{"Name":{"value":"Production Test"}}}}}'
```

---

## Tips

1. **Pretty Print JSON Response:**

   ```bash
   curl http://localhost:8000/ | python -m json.tool
   ```

2. **Save Response to File:**

   ```bash
   curl http://localhost:8000/api/get-latest-webhook > response.json
   ```

3. **Verbose Output (See Headers):**

   ```bash
   curl -v http://localhost:8000/
   ```

4. **Include Response Headers:**
   ```bash
   curl -i http://localhost:8000/
   ```

---

## Troubleshooting

**Connection Refused:**

```bash
# Make sure server is running
python main.py
```

**CORS Error:**

- Check `allow_origins` in `main.py`
- Use browser or Postman instead of curl

**Empty Response:**

```bash
# Send a webhook first
curl -X POST http://localhost:8000/webhook/elevenlabs -H "Content-Type: application/json" -d '{"data":{"conversation_id":"test"}}'

# Then get latest
curl http://localhost:8000/api/get-latest-webhook
```
