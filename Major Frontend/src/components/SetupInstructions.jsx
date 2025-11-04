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
            1. Backend Webhook Handler
          </h4>
          <div className="bg-gray-50 rounded-lg p-3 text-xs font-mono text-gray-700 overflow-x-auto">
            <pre>{`// Create endpoint: /api/get-latest-webhook
app.get('/api/get-latest-webhook', (req, res) => {
  // Return latest webhook data
  res.json(latestWebhookData);
});

// Receive from ElevenLabs
app.post('/webhook/elevenlabs', (req, res) => {
  latestWebhookData = req.body;
  res.sendStatus(200);
});`}</pre>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-700 mb-2">
            2. MongoDB Configuration
          </h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p>✓ Enable MongoDB Data API in Atlas</p>
            <p>✓ Create API key with permissions</p>
            <p>✓ Update MONGODB_CONFIG in code</p>
            <p>✓ Test connection with sample data</p>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>🎯 How it works:</strong> The ElevenLabs widget handles voice
          conversations. When a call completes, ElevenLabs sends webhook data to
          your backend. This UI polls your backend every 2 seconds to fetch the
          latest data and automatically saves it to MongoDB.
        </p>
      </div>
    </div>
  );
};

export default SetupInstructions;
