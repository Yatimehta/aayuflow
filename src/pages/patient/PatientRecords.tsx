import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  FileText, 
  Calendar, 
  Scale, 
  Droplet, 
  Download, 
  ChevronRight,
  Sparkles,
  Pill,
  History
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PatientRecords: React.FC = () => {
  const navigate = useNavigate();
  const { activePatient, patients, selectedHospital } = useApp();

  const patient = activePatient || patients[0];

  const [filter, setFilter] = useState<'all' | 'visits' | 'documents'>('all');

  // Past consultations/visits
  const pastVisits = [
    {
      id: 'vis-1',
      date: 'Today',
      token: patient?.tokenNumber || 'AYU-260911-018',
      hospital: selectedHospital.name,
      complaint: patient?.chiefComplaint || 'Clinical OPD Consultation',
      status: 'Active Queue'
    },
    {
      id: 'vis-2',
      date: '14 May 2026',
      token: 'AYU-0891',
      hospital: 'All India Institute of Ayurveda (AIIA)',
      complaint: 'Early Sandhivata & Vata Imbalance with joint crepitus',
      status: 'Consulted'
    },
    {
      id: 'vis-3',
      date: '20 Nov 2025',
      token: 'AYU-0412',
      hospital: 'Government Ayurveda College & Hospital',
      complaint: 'Agni Mandya & Chronic Constipation',
      status: 'Consulted'
    }
  ];

  const documents = patient?.documents || [];

  return (
    <div className="min-h-[85vh] py-10 px-4 sm:px-6 relative z-10">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => navigate('/patient/dashboard')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                My Records
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Your consultation history, past intake summaries, and uploaded documents.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 self-start sm:self-auto text-xs">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({pastVisits.length + documents.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('visits')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  filter === 'visits' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Visits ({pastVisits.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('documents')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  filter === 'documents' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Documents ({documents.length})
              </button>
            </div>
          </div>
        </div>

        {/* Patient Profile Cardlet */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 flex items-center justify-between text-xs">
          <div>
            <p className="font-bold text-slate-900 text-sm">{patient?.name}</p>
            <p className="text-slate-500 text-[11px] font-mono mt-0.5">
              ABHA: {patient?.abhaId} • Blood Group: {patient?.bloodGroup || 'B+'}
            </p>
          </div>
          <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
            {patient?.vitals?.weight ? `Weight: ${patient.vitals.weight}` : 'ABHA Verified'}
          </span>
        </div>

        {/* Content List */}
        <div className="space-y-4">
          
          {/* Past Visits Section */}
          {(filter === 'all' || filter === 'visits') && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                OPD Visits & Encounters
              </h2>

              <div className="bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden shadow-xs">
                {pastVisits.map((visit) => (
                  <div key={visit.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{visit.complaint}</span>
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {visit.token}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px]">
                        {visit.date} • {visit.hospital}
                      </p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold self-start sm:self-auto ${
                      visit.status === 'Active Queue' 
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-slate-50 text-slate-700 border border-slate-200'
                    }`}>
                      {visit.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Uploaded Documents Section */}
          {(filter === 'all' || filter === 'documents') && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Uploaded Reports & Documents
              </h2>

              <div className="bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden shadow-xs">
                {documents.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No documents uploaded yet.
                  </div>
                ) : (
                  documents.map((doc) => (
                    <div key={doc.id} className="p-4 sm:p-5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{doc.name}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {doc.type} • {doc.size} • {doc.uploadDate}
                          </p>
                        </div>
                      </div>

                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Verified
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
