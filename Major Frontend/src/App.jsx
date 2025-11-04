import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import Header from "./components/Header";
import StatusPanel from "./components/StatusPanel";
import PatientInfo from "./components/PatientInfo";
import SetupInstructions from "./components/SetupInstructions";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [conversationData, setConversationData] = useState(null);
  const [dbStatus, setDbStatus] = useState("idle");
  const [isPolling, setIsPolling] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [patientData, setPatientData] = useState({
    name: "",
    age: "",
    gender: "",
    contact: "",
    address: "",
    reason: "",
    preferredDoctor: "",
    medicalHistory: "",
    emergencyContact: "",
    appointmentPreference: "",
  });

  // Backend API Configuration
  const API_CONFIG = {
    baseUrl: "https://major-4w34.onrender.com",
    pollingInterval: 2000, // Poll every 2 seconds
  };

  // Load ElevenLabs ConvAI widget
  useEffect(() => {
    // Check if script is already loaded
    if (!document.querySelector('script[src*="elevenlabs"]')) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
      script.async = true;
      script.type = "text/javascript";
      document.body.appendChild(script);

      script.onload = () => {
        console.log("ElevenLabs ConvAI widget loaded successfully");
      };
    }

    // Create the widget element
    if (!document.querySelector("elevenlabs-convai")) {
      const widget = document.createElement("elevenlabs-convai");
      widget.setAttribute("agent-id", "agent_7601k94ncjtge2s91yvv72k9zc27");
      document.body.appendChild(widget);
    }

    return () => {
      // Cleanup
      const widget = document.querySelector("elevenlabs-convai");
      if (widget) {
        widget.remove();
      }
    };
  }, []);

  // Handle incoming webhook data
  const handleWebhookData = useCallback((webhookPayload) => {
    console.log("Received webhook data:", webhookPayload);

    if (webhookPayload?.body?.data?.analysis?.data_collection_results) {
      const results = webhookPayload.body.data.analysis.data_collection_results;

      const extractedData = {
        name: results.Name?.value || "",
        age: results.Age?.value || "",
        gender: results.Gender?.value || "",
        contact: results.Contact?.value || "",
        address: results["Address "]?.value || "",
        reason: results.Reason?.value || "",
        preferredDoctor: results["Preferred Doctor"]?.value || "",
        medicalHistory: results["Previous Medical History"]?.value || "",
        emergencyContact: results["Emergency Contact"]?.value || "",
        appointmentPreference: results["Appointment Preference"]?.value || "",
        conversationId: webhookPayload.body.data.conversation_id,
        timestamp: new Date().toISOString(),
        transcript: webhookPayload.body.data.transcript,
        callDuration: webhookPayload.body.data.metadata?.call_duration_secs,
      };

      setPatientData(extractedData);
      setConversationData(webhookPayload.body.data);
      setIsConnected(true);

      // Backend automatically saves to MongoDB when webhook is received
      setDbStatus("success");
      setTimeout(() => setDbStatus("idle"), 3000);
    }
  }, []);

  // Real-time webhook polling
  useEffect(() => {
    let intervalId;

    const pollWebhookData = async () => {
      try {
        const response = await fetch(
          `${API_CONFIG.baseUrl}/api/get-latest-webhook`
        );
        if (response.ok) {
          const data = await response.json();
          if (data && data.timestamp !== lastUpdate) {
            handleWebhookData(data);
            setLastUpdate(data.timestamp);
          }
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    };

    if (isPolling) {
      intervalId = setInterval(pollWebhookData, API_CONFIG.pollingInterval);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPolling, lastUpdate, handleWebhookData]);

  // Toggle real-time polling
  const togglePolling = () => {
    setIsPolling(!isPolling);
  };

  // Load sample data for testing
  const loadSampleData = () => {
    const sampleWebhookData = {
      body: {
        data: {
          conversation_id: "conv_sample_" + Date.now(),
          analysis: {
            data_collection_results: {
              Name: { value: "Puneet Sankhla" },
              Age: { value: 22 },
              Gender: { value: "Male" },
              Contact: { value: "9589879629" },
              "Address ": { value: "Indore, Madhya Pradesh" },
              Reason: { value: "Fever" },
              "Preferred Doctor": { value: null },
              "Previous Medical History": { value: null },
              "Emergency Contact": { value: "पुनीत 9589879629" },
              "Appointment Preference": { value: "Tomorrow at 10 AM" },
            },
            transcript_summary:
              "Patient reports fever and seeks assistance. Registration completed with appointment scheduled for tomorrow at 10 AM.",
          },
          transcript: [
            { role: "agent", message: "Hello! How can I help you today?" },
            { role: "user", message: "I have a fever today" },
          ],
          metadata: {
            call_duration_secs: 293,
          },
        },
      },
      timestamp: Date.now(),
    };

    handleWebhookData(sampleWebhookData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Header
          isPolling={isPolling}
          togglePolling={togglePolling}
          loadSampleData={loadSampleData}
          dbStatus={dbStatus}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Panel */}
          <div className="lg:col-span-1">
            <StatusPanel
              isConnected={isConnected}
              isPolling={isPolling}
              lastUpdate={lastUpdate}
              conversationData={conversationData}
              patientInfo={patientData}
            />
          </div>

          {/* Patient Information Display */}
          <div className="lg:col-span-2">
            <PatientInfo
              patientInfo={patientData}
              conversationData={conversationData}
            />
          </div>
        </div>
        {/* Setup Instructions */}
        <div className="mt-6">
          <SetupInstructions />
        </div>
      </div>
    </div>
  );
}

export default App;
