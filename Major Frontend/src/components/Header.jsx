import React from "react";
import {
  RefreshCw,
  Loader,
  CheckCircle,
  XCircle,
  Download,
} from "lucide-react";

const Header = ({
  isPolling,
  togglePolling,
  loadSampleData,
  downloadPatientsData,
  dbStatus,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-xl p-6 mb-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            VocaCare
          </h1>
          <p className="text-gray-600 mt-1">
            AI-Powered Patient Registration with Real-time Updates
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={togglePolling}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              isPolling
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            <RefreshCw size={18} className={isPolling ? "animate-spin" : ""} />
            {isPolling ? "Stop Polling" : "Start Real-time"}
          </button>
          <button
            onClick={loadSampleData}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            Test Sample Data
          </button>
          <button
            onClick={downloadPatientsData}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium flex items-center gap-2"
            title="Download all patient records as CSV"
          >
            <Download size={18} />
            Download Data
          </button>
          {dbStatus !== "idle" && (
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
              {dbStatus === "saving" && (
                <>
                  <Loader className="animate-spin text-blue-500" size={18} />
                  <span className="text-sm text-gray-700 font-medium">
                    Saving...
                  </span>
                </>
              )}
              {dbStatus === "loading" && (
                <>
                  <Loader className="animate-spin text-purple-500" size={18} />
                  <span className="text-sm text-gray-700 font-medium">
                    Loading...
                  </span>
                </>
              )}
              {dbStatus === "success" && (
                <>
                  <CheckCircle className="text-green-500" size={18} />
                  <span className="text-sm text-green-600 font-medium">
                    Success!
                  </span>
                </>
              )}
              {dbStatus === "error" && (
                <>
                  <XCircle className="text-red-500" size={18} />
                  <span className="text-sm text-red-600 font-medium">
                    Failed
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
