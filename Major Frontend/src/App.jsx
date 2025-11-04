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
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <Header
          isPolling={isPolling}
          togglePolling={togglePolling}
          loadSampleData={loadSampleData}
          downloadPatientsData={downloadPatientsData}
          dbStatus={dbStatus}
        />

        {/* Main Content - Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-180px)]">
          {/* Left Side - Voice Agent */}
          <div className="flex flex-col gap-6 h-full">
            <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100 flex-1 flex flex-col items-center justify-center">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                  Voice Registration Assistant
                </h2>
                <p className="text-gray-600 text-lg">
                  Click the microphone below to start your patient registration
                </p>
              </div>

              {/* Voice Widget Container */}
              <div className="flex flex-col items-center justify-center flex-1 w-full">
                <div className="mb-6 text-center">
                  <div className="inline-flex items-center gap-3 bg-blue-50 px-6 py-3 rounded-full border border-blue-200">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        isConnected
                          ? "bg-green-500 animate-pulse"
                          : "bg-gray-400"
                      }`}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">
                      {isConnected ? "Agent Ready" : "Initializing..."}
                    </span>
                  </div>
                </div>

                {/* ElevenLabs widget will appear here */}
                <div className="text-gray-400 text-sm mt-8">
                  The voice assistant widget will appear here
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100 w-full">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <span>💡</span> How to Use
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Click the microphone icon to start</li>
                  <li>• Speak clearly and answer the questions</li>
                  <li>• Your information will appear on the right</li>
                  <li>• Data is automatically saved to the database</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Side - Patient Details */}
          <div className="flex flex-col gap-6 h-full overflow-auto">
            {/* Status Panel */}
            <StatusPanel
              isConnected={isConnected}
              isPolling={isPolling}
              lastUpdate={lastUpdate}
              conversationData={conversationData}
              patientInfo={patientData}
            />

            {/* Patient Information Display */}
            <PatientInfo
              patientInfo={patientData}
              conversationData={conversationData}
            />
          </div>
        </div>

        {/* Setup Instructions - Full Width at Bottom */}
        <div className="mt-6">
          <SetupInstructions />
        </div>
      </div>
    </div>
  );
}

export default App;
