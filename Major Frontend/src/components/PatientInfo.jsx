import React from "react";
import InfoField from "./InfoField";

const PatientInfo = ({ patientInfo, conversationData }) => {
  return (
    <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Patient Information
        </h2>
        {patientInfo.conversationId && (
          <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
            {patientInfo.conversationId}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoField label="Full Name" value={patientInfo.name} icon="👤" />
        <InfoField label="Age" value={patientInfo.age} icon="🎂" />
        <InfoField label="Gender" value={patientInfo.gender} icon="⚧" />
        <InfoField
          label="Contact Number"
          value={patientInfo.contact}
          icon="📞"
        />
        <InfoField
          label="Address"
          value={patientInfo.address}
          className="md:col-span-2"
          icon="📍"
        />
        <InfoField
          label="Reason for Visit"
          value={patientInfo.reason}
          className="md:col-span-2"
          icon="🏥"
        />
        <InfoField
          label="Preferred Doctor"
          value={patientInfo.preferredDoctor || "Not specified"}
          icon="👨‍⚕️"
        />
        <InfoField
          label="Medical History"
          value={patientInfo.medicalHistory || "None reported"}
          icon="📋"
        />
        <InfoField
          label="Emergency Contact"
          value={patientInfo.emergencyContact}
          className="md:col-span-2"
          icon="🚨"
        />
        <InfoField
          label="Appointment"
          value={patientInfo.appointmentPreference}
          className="md:col-span-2"
          icon="📅"
        />
      </div>

      {conversationData && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span>📝</span> Conversation Summary
          </h3>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 max-h-64 overflow-y-auto border border-gray-200">
            <p className="text-sm text-gray-700 leading-relaxed">
              {conversationData.analysis?.transcript_summary ||
                "No summary available"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientInfo;
