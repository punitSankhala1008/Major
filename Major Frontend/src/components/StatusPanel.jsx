import React from "react";
import { Phone, Database, RefreshCw } from "lucide-react";

const StatusPanel = ({
  isConnected,
  isPolling,
  lastUpdate,
  conversationData,
  patientInfo,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-xl p-5 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Phone size={20} className="text-blue-600" />
          System Status
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Voice Agent Status */}
        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">
              Voice Agent
            </span>
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected ? "bg-green-500 animate-pulse" : "bg-gray-400"
              }`}
            ></div>
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <p>
              Status:{" "}
              <span className="font-medium">
                {isConnected ? "Connected" : "Waiting"}
              </span>
            </p>
          </div>
        </div>

        {/* Real-time Updates Status */}
        <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">
              Real-time Updates
            </span>
            {isPolling && (
              <RefreshCw size={14} className="text-purple-600 animate-spin" />
            )}
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <p>
              Polling:{" "}
              <span className="font-medium">
                {isPolling ? "Active" : "Inactive"}
              </span>
            </p>
            {lastUpdate && (
              <p className="text-green-600 text-xs">
                {new Date(lastUpdate).toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>

        {/* Database Status */}
        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
          <div className="flex items-center gap-2 mb-2">
            <Database size={16} className="text-green-600" />
            <span className="text-sm font-semibold text-gray-700">
              Database
            </span>
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <p>medical_records</p>
            <p className="text-xs text-green-600 flex items-center gap-1">
              ✅ Auto-save enabled
            </p>
          </div>
        </div>

        {/* Conversation Stats */}
        <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-100">
          <div className="text-sm font-semibold text-gray-700 mb-2">
            Call Statistics
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            {conversationData ? (
              <>
                <p>Duration: {patientInfo.callDuration || 0}s</p>
                <p>Turns: {conversationData.transcript?.length || 0}</p>
              </>
            ) : (
              <p className="text-gray-400">No active call</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusPanel;
