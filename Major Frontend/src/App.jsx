import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import Header from "./components/Header";
import StatusPanel from "./components/StatusPanel";
import PatientInfo from "./components/PatientInfo";
// import SetupInstructions from "./components/SetupInstructions"; // HIDDEN
// import LiveKitVoiceAgent from "./components/LiveKitVoiceAgent"; // HIDDEN

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
  const [voiceAgentType] = useState("elevenlabs"); // Fixed to elevenlabs only
  const [showElevenLabsWidget, setShowElevenLabsWidget] = useState(false);

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

    // Create the widget element if ElevenLabs is selected AND showElevenLabsWidget is true
    if (
      voiceAgentType === "elevenlabs" &&
      showElevenLabsWidget &&
      !document.querySelector("elevenlabs-convai")
    ) {
      // Wait a bit for the script to be fully loaded
      setTimeout(() => {
        const widget = document.createElement("elevenlabs-convai");
        widget.setAttribute("agent-id", "agent_0201k9as34shfd5807dptt2fsvbb");

        // Add attributes to auto-start the conversation
        widget.setAttribute("auto-start", "true");
        widget.setAttribute("start-on-load", "true");

        // Add inline styles to ensure the widget fills the container and stays in place
        widget.style.position = "relative";
        widget.style.width = "100%";
        widget.style.height = "100%";
        widget.style.minHeight = "450px";
        widget.style.display = "block";
        widget.style.bottom = "auto";
        widget.style.left = "auto";
        widget.style.right = "auto";
        widget.style.top = "auto";
        widget.style.transform = "none";
        widget.style.zIndex = "1";

        // Add widget to the designated container instead of body
        const container = document.getElementById(
          "elevenlabs-widget-container"
        );
        if (container) {
          // Clear loading indicator
          container.innerHTML = "";
          container.appendChild(widget);

          // Monitor and fix widget positioning if it changes
          const positionObserver = new MutationObserver(() => {
            if (
              widget.style.position === "fixed" ||
              widget.style.position === "absolute"
            ) {
              widget.style.position = "relative";
              widget.style.bottom = "auto";
              widget.style.left = "auto";
              widget.style.right = "auto";
              widget.style.top = "auto";
              widget.style.transform = "none";
            }
          });

          positionObserver.observe(widget, {
            attributes: true,
            attributeFilter: ["style"],
          });

          // Auto-click the "Start a call" button after widget loads
          const attemptAutoClick = (attempt = 1, maxAttempts = 20) => {
            console.log(`Auto-click attempt ${attempt}/${maxAttempts}...`);

            const widgetElement = document.querySelector("elevenlabs-convai");
            if (!widgetElement) {
              console.log("Widget not found");
              return;
            }

            // Method 1: Try shadow DOM
            const shadowRoot = widgetElement.shadowRoot;
            if (shadowRoot) {
              // Look for buttons with various selectors
              const allButtons = shadowRoot.querySelectorAll(
                'button, [role="button"]'
              );

              if (allButtons.length > 0) {
                console.log(
                  `✅ Found ${allButtons.length} button(s) in shadow DOM`
                );
                allButtons.forEach((button, index) => {
                  console.log(
                    `Button ${index}: "${button.textContent?.trim()}"`,
                    button
                  );
                  // Click all buttons to be sure
                  setTimeout(() => {
                    button.click();
                    console.log(`Clicked button ${index}`);
                  }, index * 100);
                });

                // Try clicking the first button multiple times
                setTimeout(() => allButtons[0]?.click(), 200);
                setTimeout(() => allButtons[0]?.click(), 400);
                setTimeout(() => allButtons[0]?.click(), 600);
                return true; // Success
              } else {
                console.log("No buttons found in shadow DOM yet");
              }
            }

            // Method 2: Try regular DOM
            const allButtons = document.querySelectorAll(
              'elevenlabs-convai button, elevenlabs-convai [role="button"]'
            );
            if (allButtons.length > 0) {
              console.log(
                `✅ Found ${allButtons.length} button(s) in widget DOM`
              );
              allButtons.forEach((btn, idx) => {
                console.log(`Button ${idx}: "${btn.textContent?.trim()}"`);
                setTimeout(() => btn.click(), idx * 100);
              });
              return true; // Success
            }

            // If we haven't succeeded and haven't reached max attempts, try again
            if (attempt < maxAttempts) {
              setTimeout(() => attemptAutoClick(attempt + 1, maxAttempts), 400);
            } else {
              console.log(
                "❌ Failed to auto-click after",
                maxAttempts,
                "attempts"
              );
              console.log("Please click 'Start a call' button manually");
            }

            return false;
          };

          // Use MutationObserver to detect when button appears
          const observer = new MutationObserver(() => {
            const widgetElement = document.querySelector("elevenlabs-convai");
            if (widgetElement?.shadowRoot) {
              const buttons =
                widgetElement.shadowRoot.querySelectorAll("button");
              if (buttons.length > 0) {
                console.log("🔍 MutationObserver detected buttons!");
                buttons.forEach((btn) => {
                  console.log("Clicking button:", btn.textContent?.trim());
                  btn.click();
                });
                observer.disconnect(); // Stop observing
              }
            }
          });

          // Observe the widget for changes
          setTimeout(() => {
            const widgetElement = document.querySelector("elevenlabs-convai");
            if (widgetElement) {
              observer.observe(widgetElement, {
                childList: true,
                subtree: true,
                attributes: true,
              });

              // Also observe shadow root if available
              if (widgetElement.shadowRoot) {
                observer.observe(widgetElement.shadowRoot, {
                  childList: true,
                  subtree: true,
                  attributes: true,
                });
              }
            }
          }, 500);

          // Start attempting after widget has had time to render
          setTimeout(() => attemptAutoClick(), 1500);
        }
      }, 100);
    }

    return () => {
      // Cleanup - remove all instances of the widget
      const widgets = document.querySelectorAll("elevenlabs-convai");
      widgets.forEach((widget) => {
        if (voiceAgentType !== "elevenlabs" || !showElevenLabsWidget) {
          widget.remove();
        }
      });
    };
  }, [voiceAgentType, showElevenLabsWidget]);

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
        throw new Error(
          `Failed to fetch patient data: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Download response:", data);

      // Backend returns { status: "success", patients: [...], count: X }
      const patients = data.patients || [];

      if (!patients || patients.length === 0) {
        alert(
          "No patient data available to download. Please ensure:\n1. Backend is running\n2. Database is connected\n3. At least one patient registration is completed"
        );
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
        "Call Duration (secs)",
        "Source",
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
          patient.callDuration || "",
          patient.source || "elevenlabs",
          patient.createdAt ? new Date(patient.createdAt).toLocaleString() : "",
          patient.status || "completed",
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

      alert(`Successfully downloaded ${patients.length} patient record(s)!`);
      setDbStatus("success");
      setTimeout(() => setDbStatus("idle"), 2000);
    } catch (error) {
      console.error("Download error:", error);
      alert(
        `Failed to download patient data.\n\nError: ${error.message}\n\nPlease check:\n1. Backend server is running\n2. Database connection is working\n3. Console for more details`
      );
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

        {/* Voice Agent Toggle - HIDDEN */}
        {/* <div className="mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-4 border-2 border-indigo-200 inline-block">
            <p className="text-xs font-semibold text-gray-600 mb-2 text-center">
              Voice Agent
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setVoiceAgentType("livekit");
                  setShowElevenLabsWidget(false);
                }}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  voiceAgentType === "livekit"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                LiveKit AI
              </button>
              <button
                onClick={() => {
                  setVoiceAgentType("elevenlabs");
                  setShowElevenLabsWidget(false);
                }}
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
        </div> */}

        {/* System Status Bar - Above All Content */}
        <div className="mb-6">
          <StatusPanel
            isConnected={isConnected}
            isPolling={isPolling}
            lastUpdate={lastUpdate}
            conversationData={conversationData}
            patientInfo={patientData}
          />
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left Side - Voice Agent Widget (ElevenLabs Only) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200 flex flex-col min-h-[700px] h-full">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 flex-shrink-0">
                <span className="text-2xl">🎤</span>
                VocaCare Voice Agent
              </h2>
              {!showElevenLabsWidget ? (
                <div className="flex flex-col items-center justify-center flex-1 space-y-6">
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-6xl">🎙️</span>
                    </div>
                    <p className="text-lg text-gray-700 font-medium mb-2">
                      Ready to start your registration?
                    </p>
                    <p className="text-sm text-gray-500">
                      Click below to connect with our ElevenLabs AI voice
                      assistant
                    </p>
                  </div>
                  <button
                    onClick={() => setShowElevenLabsWidget(true)}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all font-semibold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <span className="text-2xl">🎤</span>
                    Start Conversation
                  </button>
                </div>
              ) : (
                <div className="relative flex flex-col h-full min-h-[550px]">
                  <div className="mb-3 p-3 bg-purple-50 border-2 border-purple-200 rounded-lg flex-shrink-0">
                    <p className="text-sm text-purple-700 font-medium text-center">
                      🎙️ Attempting to start automatically... If "Start a call"
                      button appears, please click it
                    </p>
                  </div>
                  <div
                    id="elevenlabs-widget-container"
                    className="w-full flex-1 flex items-stretch justify-stretch min-h-[450px] bg-gray-50 rounded-lg overflow-hidden"
                  >
                    {/* ElevenLabs widget will be inserted here */}
                    <div className="text-center text-gray-400 m-auto">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-2"></div>
                      <p className="text-sm">Loading ElevenLabs widget...</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowElevenLabsWidget(false);
                      const widget =
                        document.querySelector("elevenlabs-convai");
                      if (widget) {
                        widget.remove();
                      }
                    }}
                    className="mt-3 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all font-semibold flex items-center justify-center gap-2 w-full shadow-lg flex-shrink-0"
                  >
                    <span className="text-xl">📞</span>
                    End Conversation
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Patient Form */}
          <div className="lg:col-span-1">
            {/* Patient Information Display */}
            <PatientInfo
              patientInfo={patientData}
              conversationData={conversationData}
            />
          </div>
        </div>

        {/* Setup Instructions - HIDDEN */}
        {/* <div className="mt-6">
          <SetupInstructions />
        </div> */}
      </div>
    </div>
  );
}

export default App;
