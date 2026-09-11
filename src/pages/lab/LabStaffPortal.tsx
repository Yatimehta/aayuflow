import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FlaskConical, 
  Search, 
  Upload, 
  ShieldAlert, 
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DocumentItem, Consultation } from '../../types';

export const LabStaffPortal: React.FC = () => {
  const navigate = useNavigate();
  const { 
    consultations, 
    attachLabReport, 
    selectedHospital, 
    showToast 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [streamFilter, setStreamFilter] = useState<'ALL' | 'AYURVEDA' | 'ALLOPATHY'>('ALL');
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  
  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [docName, setDocName] = useState('Serum_Uric_Acid_and_CRP_Report.pdf');
  const [docType, setDocType] = useState<DocumentItem['type']>('Lab Report');
  const [ocrText, setOcrText] = useState('Serum Uric Acid: 5.6 mg/dL (Normal reference 3.5 - 7.2 mg/dL). High-Sensitivity CRP: 4.2 mg/L (Borderline elevated). Joint inflammation correlation confirmed.');
  const [isUploading, setIsUploading] = useState(false);

  // Filter consultations
  const filteredConsultations = consultations.filter(c => {
    const matchesSearch = c.tokenNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStream = streamFilter === 'ALL' || c.careSystem === streamFilter;
    return matchesSearch && matchesStream;
  });

  const handleOpenUpload = (con: Consultation) => {
    setSelectedConsultation(con);
    setDocName(`${con.patientName.split(' ')[0]}_Diagnostic_Panel.pdf`);
    setIsUploadModalOpen(true);
  };

  const handleAttachReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConsultation) return;

    setIsUploading(true);
    setTimeout(() => {
      const newDoc: DocumentItem = {
        id: 'doc-lab-' + Date.now(),
        patientId: selectedConsultation.patientId,
        consultationId: selectedConsultation.id,
        name: docName,
        type: docType,
        size: '2.4 MB',
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'Verified',
        ocrExtractedSummary: ocrText
      };

      attachLabReport(selectedConsultation.id, newDoc);
      setIsUploading(false);
      setIsUploadModalOpen(false);
      showToast({
        type: 'success',
        title: 'Diagnostic Report Attached',
        message: `Successfully linked report to Token ${selectedConsultation.tokenNumber}.`
      });
    }, 800);
  };

  return (
    <div className="min-h-screen py-6 sm:py-8 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        
        {/* TOP STAT STRIP + CALLOUT BADGE (Exact Reference Pattern) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-8 stat-strip px-5 py-3 flex flex-wrap items-center justify-between gap-y-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 flex-shrink-0" />
              <span className="text-slate-500">Diagnostic Requests</span>
              <span className="font-extrabold text-slate-900 text-sm font-sans">{consultations.length}</span>
              <span className="text-slate-400">active</span>
            </div>

            <div className="hidden sm:block h-4 w-px bg-slate-300" />

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
              <span className="text-slate-500">Ayurveda Stream</span>
              <span className="font-extrabold text-slate-900 text-sm font-sans">{consultations.filter(c => c.careSystem === 'AYURVEDA').length}</span>
              <span className="text-emerald-700 font-semibold text-[11px]">tokens</span>
            </div>

            <div className="hidden sm:block h-4 w-px bg-slate-300" />

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 flex-shrink-0" />
              <span className="text-slate-500">Allopathy Stream</span>
              <span className="font-extrabold text-slate-900 text-sm font-sans">{consultations.filter(c => c.careSystem === 'ALLOPATHY').length}</span>
              <span className="text-sky-700 font-semibold text-[11px]">tokens</span>
            </div>

            <div className="hidden md:block h-4 w-px bg-slate-300" />

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0" />
              <span className="text-slate-500">ABDM Node</span>
              <span className="font-bold text-teal-700 text-sm">Online</span>
            </div>
          </div>

          <div className="lg:col-span-4 callout-badge px-4 py-2.5 flex items-center justify-between gap-3 text-xs leading-snug">
            <p className="text-slate-700">
              Attach verified biochemistry & radiology tests to <strong className="text-teal-700 font-bold">active OPD encounters</strong>.
            </p>
            <FlaskConical className="w-4 h-4 text-teal-600 flex-shrink-0" />
          </div>
        </div>

        {/* Portal Header & Compliance Card */}
        <div className="glass-card p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center shadow-xs">
                <FlaskConical className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                    AYUSH Diagnostic & Laboratory Portal
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-800">
                    Restricted Staff View
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Central Diagnostics Counter • {selectedHospital.name} • ABDM Lab Node
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-semibold shadow-xs self-start sm:self-auto">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>Restricted Clinical View</span>
            </span>
          </div>

          <div className="p-3.5 rounded-2xl glass-subcard text-xs text-slate-600 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">Security & Privacy Protocol (ABDM/NHA Guideline):</strong> Lab staff accounts are authorized only to upload and attach verified diagnostic reports against consultation tokens. Historical psychiatric and physician notes remain restricted.
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="glass-card p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Token (e.g. AYU-1042) or Patient..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 bg-white/95 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 font-medium text-slate-900 shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stream:</span>
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              {(['ALL', 'AYURVEDA', 'ALLOPATHY'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setStreamFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    streamFilter === s
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Consultations Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Active Consultations Requiring Diagnostic Input
            </h2>
            <span className="text-xs font-mono font-bold text-teal-800 bg-white/90 border border-slate-200 px-3 py-1 rounded-full shadow-xs">
              {filteredConsultations.length} Consultations
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredConsultations.map((con) => {
              const isAyu = con.careSystem === 'AYURVEDA';
              const docCount = con.documents?.length || 0;

              return (
                <div
                  key={con.id}
                  className="glass-card p-5 flex flex-col justify-between gap-4 transition-all hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-900 shadow-xs">
                        {con.tokenNumber}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isAyu 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                          : 'bg-sky-50 text-sky-800 border border-sky-200'
                      }`}>
                        {con.careSystem}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                        {con.patientName}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Dept: <strong>{con.department}</strong> • {con.hospitalName.split(' ')[0]}
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl glass-subcard text-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                        Triage Indication:
                      </span>
                      <p className="text-slate-700 line-clamp-2 font-medium">
                        {con.chiefComplaint}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 font-mono pt-1">
                      <span>ID: {con.id}</span>
                      <span>Attached Docs: <strong className="text-slate-900">{docCount}</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenUpload(con)}
                    className="w-full btn-brand-primary inline-flex items-center justify-center gap-2 py-2 px-4 text-xs font-bold"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload & Link Diagnostic Report</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* UPLOAD DIAGNOSTIC REPORT MODAL */}
      {isUploadModalOpen && selectedConsultation && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsUploadModalOpen(false)}
        >
          <div
            className="glass-card bg-white/95 max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Attach Diagnostic Report
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Token: <strong className="font-mono text-teal-700">{selectedConsultation.tokenNumber}</strong> ({selectedConsultation.patientName})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAttachReport} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">Document File Name</label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Investigation Category</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900"
                >
                  <option value="Lab Report">Pathology / Biochemistry Panel</option>
                  <option value="Scan">Radiology / X-Ray / MRI Imaging</option>
                  <option value="Prescription">External Clinical Prescription</option>
                  <option value="Other">Other Diagnostic Asset</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Diagnostic OCR Findings Summary</label>
                <textarea
                  rows={3}
                  required
                  value={ocrText}
                  onChange={(e) => setOcrText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="btn-brand-primary px-5 py-2 font-bold"
                >
                  {isUploading ? 'Attaching & Syncing...' : 'Upload & Sync to EMR'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
