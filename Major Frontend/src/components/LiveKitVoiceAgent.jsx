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
    <div className="w-full h-full">
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Phone size={24} className="text-blue-600" />
            LiveKit Voice AI
          </h3>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {!isConnected ? (
          <div className="space-y-4 flex flex-col items-center justify-center flex-1">
            <div className="text-center mb-6">
              <div className="w-24 h-24 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <Phone size={48} className="text-blue-600" />
              </div>
              <p className="text-lg text-gray-700 font-medium mb-2">
                Ready to start your registration?
              </p>
              <p className="text-sm text-gray-500">
                Click below to connect with our AI voice assistant
              </p>
            </div>
            <button
              onClick={connectToLiveKit}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all font-semibold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Phone size={24} />
              Start Call
            </button>
          </div>
        ) : (
          <div className="space-y-6 flex flex-col flex-1">
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border-2 border-green-200">
              <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-base font-semibold text-green-700">
                Connected - Listening...
              </span>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                  <Mic
                    size={64}
                    className={isMuted ? "text-gray-400" : "text-green-600"}
                  />
                </div>
                <p className="text-gray-600 text-sm">
                  {isMuted
                    ? "Microphone is muted"
                    : "Speak clearly and naturally"}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={toggleMute}
                className={`flex-1 px-6 py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all ${
                  isMuted
                    ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-2 border-yellow-300"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200 border-2 border-blue-300"
                }`}
              >
                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                {isMuted ? "Unmute" : "Mute"}
              </button>

              <button
                onClick={disconnect}
                className="flex-1 px-6 py-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all font-semibold text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <PhoneOff size={24} />
                End Call
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center bg-gray-50 p-3 rounded-lg">
              💡 The AI will guide you through the registration process
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveKitVoiceAgent;
