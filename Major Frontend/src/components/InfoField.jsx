import React from "react";

const InfoField = ({ label, value, className = "", icon = "" }) => (
  <div className={`${className}`}>
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
      {icon && <span>{icon}</span>}
      {label}
    </label>
    <div className="mt-2 p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
      <p className="text-sm text-gray-800 font-medium">
        {value || (
          <span className="text-gray-400 font-normal">Not provided</span>
        )}
      </p>
    </div>
  </div>
);

export default InfoField;
