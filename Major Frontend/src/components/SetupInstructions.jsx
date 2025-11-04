import React from "react";

const SetupInstructions = () => {
  return (
    <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span>⚙️</span> Setup & Configuration Guide
      </h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">
            1. Backend API Setup
          </h4>
          <div className="bg-gray-50 rounded-lg p-3 text-xs font-mono text-gray-700 overflow-x-auto">
            <pre>{`// Webhook endpoint
app.post('/webhook/elevenlabs', async (req, res) => {
  // Extract patient data
  const patientData = extractData(req.body);
  
  // Auto-save to MongoDB
  await db.patients.insertOne(patientData);
  
  res.sendStatus(200);
});

// Frontend polling endpoint
app.get('/api/get-latest-webhook', (req, res) => {
  res.json(latestWebhookData);
});`}</pre>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-700 mb-2">
            2. ElevenLabs Configuration
          </h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p>✅ Agent ID: agent_7601k94...</p>
            <p>✅ Webhook URL configured</p>
            <p>✅ Data collection enabled</p>
            <p>✅ MongoDB auto-save active</p>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>🎯 How it works:</strong> The ElevenLabs widget handles voice
          conversations. When a call completes, ElevenLabs sends webhook data to
          your FastAPI backend at <code>https://major-4w34.onrender.com</code>.
          The backend automatically saves patient data to MongoDB. This UI polls
          the backend every 2 seconds to display real-time updates.
        </p>
      </div>
    </div>
  );
};

export default SetupInstructions;
