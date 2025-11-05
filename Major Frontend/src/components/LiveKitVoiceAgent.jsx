import React, { useEffect, useState } from "react";
import { Phone, PhoneOff, Mic, MicOff } from "lucide-react";
import * as LivekitClient from "livekit-client";

const LiveKitVoiceAgent = ({ onCallComplete }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [room, setRoom] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, [room]);

  const connectToLiveKit = async () => {
    try {
      setError(null);

      const baseUrl =
        import.meta.env.VITE_API_BASE_URL || "https://major-4w34.onrender.com";

      // Request access token from backend
      const response = await fetch(`${baseUrl}/api/livekit-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_name: `patient_registration_${Date.now()}`,
          participant_name: "Patient",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to get LiveKit token");
      }

      const data = await response.json();

      // Check if backend returned an error status
      if (data.status === "error") {
        throw new Error(data.message || "LiveKit token generation failed");
      }

      const { token, url } = data;

      // Connect to LiveKit room using imported LivekitClient
      const newRoom = new LivekitClient.Room({
        adaptiveStream: true,
        dynacast: true,
      });

      // Set up event listeners
      newRoom.on("connected", () => {
        console.log("Connected to LiveKit room");
        setIsConnected(true);
      });

      newRoom.on("disconnected", () => {
        console.log("Disconnected from LiveKit room");
        setIsConnected(false);
        if (onCallComplete) {
          onCallComplete();
        }
      });

      newRoom.on("participantConnected", (participant) => {
        console.log("Participant connected:", participant.identity);
      });

      // Connect to the room
      await newRoom.connect(url, token);

      // Enable microphone
      await newRoom.localParticipant.setMicrophoneEnabled(true);

      setRoom(newRoom);
    } catch (err) {
      console.error("LiveKit connection error:", err);
      setError(err.message);
      setIsConnected(false);
    }
  };

  const disconnect = () => {
    if (room) {
      room.disconnect();
      setRoom(null);
      setIsConnected(false);
    }
  };

  const toggleMute = () => {
    if (room) {
      const newMutedState = !isMuted;
      room.localParticipant.setMicrophoneEnabled(!newMutedState);
      setIsMuted(newMutedState);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-blue-200 max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Phone size={20} className="text-blue-600" />
            VocaCare Voice AI
          </h3>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {!isConnected ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Click to start your patient registration with our AI assistant
            </p>
            <button
              onClick={connectToLiveKit}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all font-medium flex items-center justify-center gap-2"
            >
              <Phone size={20} />
              Start Call
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-600">
                Connected - Listening...
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={toggleMute}
                className={`flex-1 px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                  isMuted
                    ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
              >
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                {isMuted ? "Unmute" : "Mute"}
              </button>

              <button
                onClick={disconnect}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-medium flex items-center justify-center gap-2"
              >
                <PhoneOff size={20} />
                End Call
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Speak clearly. The AI will guide you through registration.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveKitVoiceAgent;
