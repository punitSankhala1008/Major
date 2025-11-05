import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import Header from "./components/Header";
import StatusPanel from "./components/StatusPanel";
import PatientInfo from "./components/PatientInfo";
import SetupInstructions from "./components/SetupInstructions";
import LiveKitVoiceAgent from "./components/LiveKitVoiceAgent";

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
  const [voiceAgentType, setVoiceAgentType] = useState("livekit"); // "elevenlabs" or "livekit"

  // Backend API Configuration
  const API_CONFIG = {
    baseUrl:
      import.meta.env.VITE_API_BASE_URL || "https://major-4w34.onrender.com",
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
      widget.setAttribute("agent-id", "agent_0201k9as34shfd5807dptt2fsvbb");
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

  // Download all patients data from database
  const downloadPatientsData = async () => {
    try {
      setDbStatus("loading");
      const response = await fetch(
        `${API_CONFIG.baseUrl}/api/patients?limit=1000`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch patient data");
      }

      const data = await response.json();

      // Backend returns { patients: [...] }, extract the array
      const patients = data.patients || [];

      if (!patients || patients.length === 0) {
        alert("No patient data available to download");
        setDbStatus("idle");
        return;
      }

      // Convert to CSV format
      const headers = [
        "Name",
        "Age",
        "Gender",
        "Contact",
        "Address",
        "Reason for Visit",
        "Preferred Doctor",
        "Medical History",
        "Emergency Contact",
        "Appointment Preference",
        "Conversation ID",
        "Created At",
        "Status",
      ];

      const csvRows = [];
      csvRows.push(headers.join(","));

      patients.forEach((patient) => {
        const row = [
          patient.name || "",
          patient.age || "",
          patient.gender || "",
          patient.contact || "",
          patient.address || "",
          patient.reason || "",
          patient.preferredDoctor || "",
          patient.medicalHistory || "",
          patient.emergencyContact || "",
          patient.appointmentPreference || "",
          patient.conversationId || "",
          patient.createdAt ? new Date(patient.createdAt).toLocaleString() : "",
          patient.status || "",
        ].map((field) => `"${String(field).replace(/"/g, '""')}"`); // Escape quotes

        csvRows.push(row.join(","));
      });

      const csvContent = csvRows.join("\n");

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `VocaCare_Patients_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDbStatus("success");
      setTimeout(() => setDbStatus("idle"), 2000);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download patient data. Please try again.");
      setDbStatus("error");
      setTimeout(() => setDbStatus("idle"), 2000);
    }
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
          downloadPatientsData={downloadPatientsData}
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

      {/* Voice Agent Toggle - Floating Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-4 border-2 border-indigo-200">
          <p className="text-xs font-semibold text-gray-600 mb-2 text-center">
            Voice Agent
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setVoiceAgentType("livekit")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                voiceAgentType === "livekit"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              LiveKit AI
            </button>
            <button
              onClick={() => setVoiceAgentType("elevenlabs")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                voiceAgentType === "elevenlabs"
                  ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              ElevenLabs
            </button>
          </div>
        </div>
      </div>

      {/* LiveKit Voice Agent */}
      {voiceAgentType === "livekit" && (
        <LiveKitVoiceAgent
          onCallComplete={() => {
            console.log("LiveKit call completed");
            // Trigger polling to get new data
            if (!isPolling) {
              togglePolling();
            }
          }}
        />
      )}
    </div>
  );
}

export default App;
