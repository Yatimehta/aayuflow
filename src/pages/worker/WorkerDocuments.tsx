import React, { useState } from 'react';
import { FileUploadZone } from '../../components/FileUploadZone';
import { useApp } from '../../context/AppContext';
import { FileText, Camera, CheckCircle2, User, Search } from 'lucide-react';

export const WorkerDocuments: React.FC = () => {
  const { patients, activePatient, setActivePatientId, showToast } = useApp();
  const [selectedPatId, setSelectedPatId] = useState(activePatient?.id || patients[0]?.id || '');

  const currentPatient = patients.find(p => p.id === selectedPatId) || patients[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#DCEAE7] shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0D2B3E]">
            Scan & Attach Patient Papers
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Attach clear photos of doctor slips, previous prescriptions, and lab test papers.
          </p>
        </div>

        {/* Patient selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500">Patient:</label>
          <select
            value={selectedPatId}
            onChange={(e) => {
              setSelectedPatId(e.target.value);
              setActivePatientId(e.target.value);
            }}
            className="text-xs font-semibold bg-[#F4FBF9] text-[#0D2B3E] border border-[#DCEAE7] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#146356]"
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                Token #{p.tokenNumber} — {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target Patient Banner */}
      {currentPatient && (
        <div className="p-4 rounded-2xl bg-[#E4EFEC] border border-[#146356]/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#146356] text-white font-bold flex items-center justify-center">
              {currentPatient.name.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-[#0D2B3E]">{currentPatient.name} (Token #{currentPatient.tokenNumber})</p>
              <p className="text-slate-600">{currentPatient.chiefComplaint}</p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#146356] bg-white px-2.5 py-1 rounded-lg border border-[#146356]/20">
            {currentPatient.documents.length} paper(s) attached
          </span>
        </div>
      )}

      {/* File Upload Zone */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#DCEAE7] shadow-sm space-y-6">
        <FileUploadZone
          title="Scan or Take Photos of Patient Papers"
          subtitle="Supports photos (JPG, PNG) and PDF documents brought by the patient"
          initialDocuments={currentPatient?.documents || []}
          onFilesUploaded={(docs) => {
            showToast({
              type: 'success',
              title: 'Papers Attached',
              message: `${docs.length} paper(s) attached for ${currentPatient?.name}`
            });
          }}
        />
      </div>
    </div>
  );
};
