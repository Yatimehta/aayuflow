import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  ArrowUpDown, 
  FileText, 
  UserPlus, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Patient, PatientStatus } from '../types';
import { StatusBadge } from './StatusBadge';

interface PatientTableProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onNewPatient?: () => void;
  title?: string;
  subtitle?: string;
}

export const PatientTable: React.FC<PatientTableProps> = ({
  patients,
  onSelectPatient,
  onNewPatient,
  title = "Today's Patient OPD Queue",
  subtitle = "Real-time AI case synthesis and triage queue"
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | PatientStatus>('All');
  const [sortBy, setSortBy] = useState<'token' | 'name' | 'queue'>('queue');

  const filtered = patients
    .filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tokenNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone.includes(searchTerm) ||
        p.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'All' || p.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'token') return a.tokenNumber.localeCompare(b.tokenNumber);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return a.queueNumber - b.queueNumber;
    });

  const statuses: Array<'All' | PatientStatus> = ['All', 'Verified', 'Pending', 'Processing', 'Rejected'];

  return (
    <div className="glass-card overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-200/70 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">{title}</h2>
            <p className="text-xs text-slate-500">{subtitle}</p>
          </div>

          {onNewPatient && (
            <button
              onClick={onNewPatient}
              className="btn-brand-primary inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Patient</span>
            </button>
          )}
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-1">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {statuses.map((status) => {
              const count =
                status === 'All'
                  ? patients.length
                  : patients.filter((p) => p.status === status).length;
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    statusFilter === status
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white/80 border border-slate-200/70 text-slate-700 hover:bg-white'
                  }`}
                >
                  <span>{status}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      statusFilter === status ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search token, name, or complaint..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white/95 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all placeholder:text-slate-400 text-slate-900 shadow-xs"
            />
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100/70 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200/70">
            <tr>
              <th className="py-3 px-4">Queue / Token</th>
              <th className="py-3 px-4">Patient Information</th>
              <th className="py-3 px-4">Presenting Complaint</th>
              <th className="py-3 px-4">Primary Dosha</th>
              <th className="py-3 px-4">AI Intake Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-brand-muted">
                  <div className="flex flex-col items-center">
                    <FileText className="w-8 h-8 text-brand-border mb-2" />
                    <p className="font-medium text-sm text-brand-heading">No matching patients found</p>
                    <p className="text-xs">Try adjusting your search terms or filter criteria.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((patient) => (
                <tr
                  key={patient.id}
                  onClick={() => onSelectPatient(patient)}
                  className="hover:bg-brand-teal-light/30 transition-colors cursor-pointer group"
                >
                  {/* Token & Queue */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-brand-bg border border-brand-border text-[11px] font-bold text-brand-heading flex items-center justify-center">
                        #{patient.queueNumber}
                      </span>
                      <div>
                        <span className="font-mono font-bold text-xs text-brand-teal-dark bg-brand-teal-light px-2 py-0.5 rounded-md border border-brand-teal/20">
                          {patient.tokenNumber}
                        </span>
                        <p className="text-[10px] text-brand-muted mt-0.5">{patient.appointmentTime}</p>
                      </div>
                    </div>
                  </td>

                  {/* Patient Info */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-brand-blue-light text-brand-blue-dark font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-brand-heading text-xs group-hover:text-brand-teal-dark transition-colors">
                          {patient.name}
                        </p>
                        <p className="text-[11px] text-brand-muted">
                          {patient.age} yrs • {patient.gender} • {patient.phone}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Chief Complaint */}
                  <td className="py-3 px-4 max-w-xs">
                    <p className="text-xs text-brand-heading font-medium truncate" title={patient.chiefComplaint}>
                      {patient.chiefComplaint}
                    </p>
                    <p className="text-[10px] text-brand-muted">
                      {patient.documents.length} records attached • {patient.preferredLanguage}
                    </p>
                  </td>

                  {/* Dosha */}
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-brand-mint text-[#2E7D32] border border-[#A7D7B5]/40">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {patient.doshaPrimary}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <StatusBadge status={patient.status} size="sm" />
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPatient(patient);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-brand-teal-dark bg-brand-teal-light hover:bg-brand-teal hover:text-white transition-all shadow-xs"
                    >
                      <span>View Dossier</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-3 bg-brand-bg border-t border-brand-border flex items-center justify-between text-[11px] text-brand-muted">
        <span>Showing {filtered.length} of {patients.length} patients</span>
        <span>AI Assisted OPD Triage System</span>
      </div>
    </div>
  );
};
