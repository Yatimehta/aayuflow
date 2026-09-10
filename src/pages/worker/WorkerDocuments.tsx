import React, { useState } from 'react';
import { FileUploadZone } from '../../components/FileUploadZone';
import { useApp } from '../../context/AppContext';
import { FileText, Sparkles, CheckCircle2, User, Search } from 'lucide-react';

export const WorkerDocuments: React.FC = () => {
  const { patients, activePatient, setActivePatientId, showToast } = useApp();
  const [selectedPatId, setSelectedPatId] = useState(activePatient?.id || patients[0]?.id || '');

  const currentPatient = patients.find(p => p.id === selectedPatId) || patients[0];

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-3xl border border-brand-border shadow-soft flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-heading">
            Document Scanning & OCR Intake
          </h1>
          <p className="text-xs text-brand-muted mt-1">
            Digitize handwritten Ayurvedic prescriptions, lab test PDFs, and diagnostic scans.
          </p>
        </div>

        {/* Patient selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-brand-muted">Associate to Patient:</label>
          <select
            value={selectedPatId}
            onChange={(e) => {
              setSelectedPatId(e.target.value);
              setActivePatientId(e.target.value);
            }}
            className="text-xs font-semibold bg-brand-bg text-brand-heading border border-brand-border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.tokenNumber} - {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target Patient Banner */}
      {currentPatient && (
        <div className="p-4 rounded-2xl bg-brand-teal-light/40 border border-brand-teal/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-teal text-white font-bold flex items-center justify-center">
              {currentPatient.name.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-brand-heading">{currentPatient.name} ({currentPatient.tokenNumber})</p>
              <p className="text-brand-muted">{currentPatient.chiefComplaint}</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-brand-teal-dark">
            {currentPatient.documents.length} docs already attached
          </span>
        </div>
      )}

      {/* File Upload Zone */}
      <div className="bg-white p-6 rounded-3xl border border-brand-border shadow-soft space-y-6">
        <FileUploadZone
          title="Scan or Upload Medical Files for this Patient"
          subtitle="Supports multi-page PDF, camera phone JPG/PNG scans, and laboratory DICOM files"
          initialDocuments={currentPatient?.documents || []}
          onFilesUploaded={(docs) => {
            showToast({
              type: 'success',
              title: 'Records Processed',
              message: `${docs.length} documents indexed for ${currentPatient?.name}`
            });
          }}
        />
      </div>
    </div>
  );
};
