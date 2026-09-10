import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Printer, 
  Activity, 
  ShieldCheck, 
  Pill, 
  History, 
  Eye
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';

export const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    activePatient, 
    patients, 
    selectedHospital,
    evidenceReports: allEvidenceReports,
    showToast 
  } = useApp();

  const patient = activePatient || patients[0];
  const [activeTab, setActiveTab] = useState<'overview' | 'records' | 'reports'>('overview');

  // Selected Evidence Report for Preview / Print Modal
  const [evidenceReportModalOpen, setEvidenceReportModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  const handleOpenEvidenceReport = (report: any) => {
    setSelectedReport(report);
    setEvidenceReportModalOpen(true);
  };

  // Past Health Records mock data
  const healthRecords = [
    {
      id: 'rec-1',
      date: 'Today, 10:30 AM',
      hospital: selectedHospital.name,
      doctor: 'Dr. Alok Verma, MD (Ayu)',
      diagnosis: patient.chiefComplaint,
      token: patient.tokenNumber,
      status: patient.status === 'Verified' ? 'Consulted' : patient.status === 'Processing' ? 'Report Generated' : 'In Queue'
    },
    {
      id: 'rec-2',
      date: '14 May 2026',
      hospital: 'All India Institute of Ayurveda (AIIA)',
      doctor: 'Dr. Alok Verma, MD (Ayu)',
      diagnosis: 'Early Sandhivata with Vata Imbalance',
      token: 'AYU-0891',
      status: 'Consulted'
    },
    {
      id: 'rec-3',
      date: '20 Nov 2025',
      hospital: 'Government Ayurveda College & Hospital',
      doctor: 'Dr. Sunita Deshmukh',
      diagnosis: 'Agni Mandya & Chronic Constipation',
      token: 'AYU-0412',
      status: 'Consulted'
    }
  ];

  // AI Evidence Reports from shared app context
  const patientEvidenceReports = allEvidenceReports.filter(
    r => r.patientId === patient?.id || r.tokenNumber === patient?.tokenNumber
  );
  const evidenceReports = patientEvidenceReports.length > 0 ? patientEvidenceReports : allEvidenceReports.slice(0, 2);

  return (
    <div className="min-h-screen py-6 sm:py-8 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* 1. Slim Single-Line Greeting Header (Not a full-width card) */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Namaste, {patient.name}
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/90 text-emerald-800 border border-emerald-200 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                ABHA Verified
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Encounter at {selectedHospital.name} • Kayachikitsa OPD • Consulting: Dr. Alok Verma
            </p>
          </div>

          <button
            onClick={() => navigate('/patient/intake')}
            className="btn-brand-primary inline-flex items-center gap-2 px-4 py-2 text-xs font-bold self-start sm:self-auto shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start New Visit / Intake</span>
          </button>
        </div>

        {/* 2. THE DOMINANT VISUAL ELEMENT: Large Live OPD Encounter Card (Single source of truth) */}
        <div className="glass-card p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3.5 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
                Live OPD Encounter
              </span>
              <StatusBadge status={patient.status} size="sm" />
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-mono font-black text-slate-900 tracking-tight">
                {patient.tokenNumber}
              </h2>
              {/* Compact inline details subline */}
              <p className="text-xs sm:text-sm font-medium text-slate-700 mt-2 flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900 font-mono">{patient.tokenNumber}</span>
                <span className="text-slate-400">·</span>
                <span className="font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/70">
                  Slot #{patient.queueNumber}
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-700">~15 min wait</span>
                <span className="text-slate-400">·</span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/70 font-medium">
                  {patient.prescriptions.length} active formulation{patient.prescriptions.length !== 1 ? 's' : ''}
                </span>
              </p>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {selectedHospital.name} • Kayachikitsa OPD • Room 104
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              Chief complaint: <strong className="text-slate-900">{patient.chiefComplaint}</strong>. Your clinical intake and AI evidence dossier have been synthesized and dispatched to Dr. Alok Verma's active triage queue.
            </p>
          </div>

          {/* Supplementary Side Panel */}
          <div className="glass-subcard p-5 space-y-3 min-w-[230px] flex-shrink-0 self-stretch lg:self-center">
            <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200/60">
              <span className="text-slate-500">Estimated Wait:</span>
              <strong className="text-teal-700 font-bold text-sm">~15 mins</strong>
            </div>
            <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200/60">
              <span className="text-slate-500">Consulting Vaidya:</span>
              <span className="font-semibold text-slate-800">Dr. Alok Verma</span>
            </div>
            <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200/60">
              <span className="text-slate-500">Triage Desk:</span>
              <span className="font-medium text-slate-700">Room 104</span>
            </div>
            <button
              onClick={() => handleOpenEvidenceReport(evidenceReports[0])}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Case Dossier</span>
            </button>
          </div>
        </div>

        {/* 3. Tabs */}
        <div className="flex items-center gap-2 border-b border-white/40 pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white/80 border border-slate-200/70 text-slate-700 hover:bg-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('records')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'records'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white/80 border border-slate-200/70 text-slate-700 hover:bg-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>My Records & Prescriptions ({healthRecords.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'reports'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white/80 border border-slate-200/70 text-slate-700 hover:bg-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Clinical Dossiers ({evidenceReports.length})</span>
          </button>
        </div>

        {/* 4. TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            {/* Most Recent Activity Cards (2 Panels side by side, smaller, clearly secondary) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Recent Consultation */}
              <div className="glass-card p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200/70 pb-2.5">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-teal-700" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Most Recent Consultation
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('records')}
                    className="text-[11px] text-teal-700 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>View all ({healthRecords.length}) &rarr;</span>
                  </button>
                </div>

                <div className="glass-subcard p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{healthRecords[1].date}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 font-bold text-slate-800">
                      {healthRecords[1].token}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-800 text-xs">
                    {healthRecords[1].diagnosis}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Consulted with {healthRecords[1].doctor}
                  </p>
                </div>
              </div>

              {/* Recent Prescription */}
              <div className="glass-card p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200/70 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Pill className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Active Herbal Prescription
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('records')}
                    className="text-[11px] text-teal-700 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>View all ({patient.prescriptions.length}) &rarr;</span>
                  </button>
                </div>

                <div className="glass-subcard p-3.5 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{patient.prescriptions[0]?.medicineName || 'Yogaraja Guggulu'}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      {patient.prescriptions[0]?.form || 'Tablet'}
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs">
                    Dosage: <strong className="text-slate-900">{patient.prescriptions[0]?.dosage || '2 Tablets Twice Daily'}</strong>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Vehicle: {patient.prescriptions[0]?.anupana || 'Warm Water after meals'}
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: MY RECORDS & PRESCRIPTIONS */}
        {activeTab === 'records' && (
          <div className="space-y-5">
            
            {/* Past Encounters */}
            <div className="glass-card p-6 space-y-4">
              <div className="border-b border-slate-200/70 pb-3">
                <h3 className="text-base font-bold text-slate-900">OPD Consultation Encounters</h3>
                <p className="text-xs text-slate-500">Chronological clinical visits verified with National Health Authority</p>
              </div>

              <div className="divide-y divide-slate-200/70">
                {healthRecords.map((rec) => (
                  <div key={rec.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{rec.diagnosis}</span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white border border-slate-200 font-bold text-slate-800">
                          {rec.token}
                        </span>
                      </div>
                      <p className="text-slate-500">
                        {rec.date} • {rec.hospital} • {rec.doctor}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-bold self-start sm:self-auto shadow-xs">
                      {rec.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prescriptions */}
            <div className="glass-card p-6 space-y-4">
              <div className="border-b border-slate-200/70 pb-3">
                <h3 className="text-base font-bold text-slate-900">Active Herbal Prescriptions</h3>
                <p className="text-xs text-slate-500">Formulations prescribed by attending Ayurvedic physician</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {patient.prescriptions.map((rx) => (
                  <div key={rx.id} className="glass-subcard p-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-sm">{rx.medicineName}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                        {rx.form}
                      </span>
                    </div>
                    <p className="text-slate-600">
                      Dosage: <strong className="text-slate-900">{rx.dosage}</strong> • Timing: <span className="font-medium text-teal-700">{rx.timing}</span>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Anupana: {rx.anupana} • Duration: {rx.duration}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: AI CLINICAL DOSSIERS */}
        {activeTab === 'reports' && (
          <div className="space-y-5">
            <div className="glass-card p-6 space-y-4">
              <div className="border-b border-slate-200/70 pb-3">
                <h3 className="text-base font-bold text-slate-900">AI Clinical Evidence Dossiers</h3>
                <p className="text-xs text-slate-500">Synthesized pre-consultation reports generated from guided intake</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {evidenceReports.map((rep) => (
                  <div key={rep.id} className="glass-subcard p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">Ayurvedic Clinical Summary</span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white border border-slate-200 font-bold text-slate-800">
                          {rep.tokenNumber}
                        </span>
                      </div>
                      <p className="text-slate-600 font-medium">Chief Complaint: {rep.chiefComplaint}</p>
                      <p className="text-[11px] text-slate-400">Generated: {rep.date} • Reference ID: {rep.id}</p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <button
                        onClick={() => handleOpenEvidenceReport(rep)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Evidence Report Modal */}
      {selectedReport && (
        <Modal
          isOpen={evidenceReportModalOpen}
          onClose={() => setEvidenceReportModalOpen(false)}
          title={`Clinical Evidence Report • ${selectedReport.tokenNumber}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800">
              <p className="font-semibold">Pre-Consultation Summary synthesized by AyuFlow AI</p>
              <p className="text-[11px] text-teal-700 mt-0.5">Complies with ABDM AYUSH FHIR Diagnostic Specification</p>
            </div>

            <div className="glass-subcard p-4 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">Presenting Symptoms</h4>
              <p className="text-slate-700">{selectedReport.chiefComplaint}</p>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Copy</span>
              </button>
              <button
                onClick={() => setEvidenceReportModalOpen(false)}
                className="btn-brand-primary px-5 py-2 text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
