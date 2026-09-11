import React, { useState, useRef, useEffect } from 'react';
import {
  Filter,
  FileText,
  AlertCircle,
  Leaf,
  Stethoscope,
  Lock,
  ChevronDown,
  Check,
  UserPlus
} from 'lucide-react';
import { Patient, PatientStatus } from '../types';
import { useApp } from '../context/AppContext';
import { isAyurvedicRecord, isAllopathicRecord } from '../utils/streamClassification';

interface PatientTableProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onStartConsultation?: (patient: Patient) => void;
  onNewPatient?: () => void;
  title?: string;
  subtitle?: string;
  /** Front-desk staff benefit from seeing a patient's language before they walk up to
   * assist them; a doctor reviewing the queue doesn't need it, so DoctorDashboard turns
   * this off. */
  showLanguage?: boolean;
}

export const PatientTable: React.FC<PatientTableProps> = ({
  patients,
  onSelectPatient,
  onStartConsultation,
  onNewPatient,
  title = "Consultation Queue",
  subtitle,
  showLanguage = true
}) => {
  const { globalSearchQuery, unlockedPatientIds } = useApp();

  // 1. Department / Stream Filter: 'All' | 'Allopathic' | 'Ayurvedic'
  const [streamFilter, setStreamFilter] = useState<'All' | 'Allopathic' | 'Ayurvedic'>('All');

  // 2. Single Status Dropdown Filter: 'All' | PatientStatus
  const [statusFilter, setStatusFilter] = useState<'All' | PatientStatus>('All');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close status dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const statusOptions: Array<'All' | PatientStatus> = [
    'All',
    'Verified',
    'Pending',
    'Processing',
    'Rejected'
  ];

  // Filter and sort patients
  const filtered = patients
    .filter((p) => {
      // Global Navbar Search Match
      const query = globalSearchQuery.trim().toLowerCase();
      const matchSearch = !query || (
        p.name.toLowerCase().includes(query) ||
        p.tokenNumber.toLowerCase().includes(query) ||
        p.phone.includes(query) ||
        p.chiefComplaint.toLowerCase().includes(query) ||
        (p.careSystem && p.careSystem.toLowerCase().includes(query)) ||
        (p.intakeType && p.intakeType.toLowerCase().includes(query))
      );

      // Stream / Department Selector
      const isAyush = isAyurvedicRecord(p);
      const isAllopathy = isAllopathicRecord(p);
      
      const matchStream = 
        streamFilter === 'All'
          ? true
          : streamFilter === 'Allopathic'
          ? isAllopathy
          : isAyush;

      // Status Dropdown Filter
      const matchStatus = statusFilter === 'All' || p.status === statusFilter;

      return matchSearch && matchStream && matchStatus;
    })
    .sort((a, b) => {
      // Priority triage flags jump to top of queue
      const aPriority = a.priorityFlag || a.clinicalSummary?.priorityFlag || false;
      const bPriority = b.priorityFlag || b.clinicalSummary?.priorityFlag || false;
      if (aPriority && !bPriority) return -1;
      if (!aPriority && bPriority) return 1;

      return a.queueNumber - b.queueNumber;
    });

  const handleActionClick = (patient: Patient) => {
    if (onStartConsultation) {
      onStartConsultation(patient);
    } else {
      onSelectPatient(patient);
    }
  };

  // Helper to extract safety flags for a patient
  const getSafetyFlags = (patient: Patient) => {
    const flags: { label: string; type: 'lab' | 'interaction' }[] = [];

    const hasAbnormalLab = patient.documents.some((d) =>
      d.labResults && d.labResults.some((r) => r.isAbnormal)
    );
    if (hasAbnormalLab) {
      flags.push({ label: '⚠️ Lab Out-of-Range', type: 'lab' });
    }

    const hasInteraction = patient.documents.some((d) =>
      d.drugInteractions && d.drugInteractions.length > 0
    );
    const hasCrossSystemIntake =
      patient.ayurvedaIntake?.medications?.type === 'Both' ||
      patient.ayurvedaIntake?.medications?.type === 'Allopathic Medicines';

    if (hasInteraction || hasCrossSystemIntake) {
      flags.push({ label: '⚠️ Interaction Flag', type: 'interaction' });
    }

    return flags;
  };

  const isStatusFilterActive = statusFilter !== 'All';

  return (
    <div className="bg-white rounded-3xl border border-[#DCEAE7] shadow-xs overflow-hidden space-y-0">
      
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-[#DCEAE7]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Left: Queue Title, with optional subtitle */}
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-base font-bold text-[#0D2B3E]">{title}</h2>
              {subtitle && <p className="text-xs text-[#8FA3A0] mt-0.5">{subtitle}</p>}
            </div>
          </div>

          {/* Right: Streamlined Filter Controls (Two Compact Dropdown / Pill Groups) */}
          <div className="flex items-center gap-3 flex-wrap">
            {onNewPatient && (
              <button
                type="button"
                onClick={onNewPatient}
                className="px-4 py-1.5 rounded-xl text-sm font-bold bg-[#146356] hover:bg-[#0f4d43] text-white shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>New Patient</span>
              </button>
            )}
            
            {/* Control 1: Department / Stream Selector (Pill Tabs) */}
            <div className="flex items-center p-1 bg-[#F4FBF9] border border-[#DCEAE7] rounded-2xl">
              <button
                type="button"
                onClick={() => setStreamFilter('All')}
                className={`rounded-xl font-medium px-4 py-1.5 text-sm transition-all cursor-pointer ${
                  streamFilter === 'All'
                    ? 'bg-[#146356] text-white shadow-xs'
                    : 'bg-white text-[#0D2B3E]/70 border border-[#DCEAE7] hover:bg-[#E4EFEC]'
                }`}
              >
                All Departments
              </button>
              <button
                type="button"
                onClick={() => setStreamFilter('Allopathic')}
                className={`ml-1 rounded-xl font-medium px-4 py-1.5 text-sm transition-all cursor-pointer ${
                  streamFilter === 'Allopathic'
                    ? 'bg-[#146356] text-white shadow-xs'
                    : 'bg-white text-[#0D2B3E]/70 border border-[#DCEAE7] hover:bg-[#E4EFEC]'
                }`}
              >
                Allopathic
              </button>
              <button
                type="button"
                onClick={() => setStreamFilter('Ayurvedic')}
                className={`ml-1 rounded-xl font-medium px-4 py-1.5 text-sm transition-all cursor-pointer ${
                  streamFilter === 'Ayurvedic'
                    ? 'bg-[#146356] text-white shadow-xs'
                    : 'bg-white text-[#0D2B3E]/70 border border-[#DCEAE7] hover:bg-[#E4EFEC]'
                }`}
              >
                Ayurvedic
              </button>
            </div>

            {/* Control 2: Single "Filter" Dropdown Button */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className={`px-3.5 py-1.5 rounded-xl text-sm font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
                  isStatusFilterActive
                    ? 'bg-[#146356] text-white border-[#146356] shadow-xs'
                    : 'bg-white border-[#DCEAE7] text-[#0D2B3E] hover:bg-[#E4EFEC]'
                }`}
              >
                <Filter className={`w-3.5 h-3.5 ${isStatusFilterActive ? 'text-white' : 'text-[#146356]'}`} />
                <span>{statusFilter === 'All' ? 'Filter' : statusFilter}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
                {isStatusFilterActive && (
                  <span className="w-4 h-4 rounded-full bg-white text-[#146356] text-[10px] font-bold flex items-center justify-center ml-0.5">
                    1
                  </span>
                )}
              </button>

              {showStatusDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white shadow-lg border border-[#DCEAE7] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1 text-[10px] font-bold text-[#8FA3A0] uppercase tracking-wider border-b border-[#DCEAE7] mb-1">
                    Filter by Status
                  </div>
                  {statusOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setStatusFilter(opt);
                        setShowStatusDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#E4EFEC] transition-colors cursor-pointer ${
                        statusFilter === opt ? 'font-bold text-[#146356] bg-[#F4FBF9]' : 'text-[#0D2B3E]'
                      }`}
                    >
                      <span>{opt === 'All' ? 'All Statuses' : opt}</span>
                      {statusFilter === opt && (
                        <Check className="w-3.5 h-3.5 text-[#146356]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F4FBF9] text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-[#DCEAE7]">
            <tr>
              <th className="py-3 px-4">TOKEN #</th>
              <th className="py-3 px-4">PATIENT DETAILS</th>
              <th className="py-3 px-4">STREAM</th>
              <th className="py-3 px-4">CHIEF COMPLAINT</th>
              <th className="py-3 px-4">SAFETY FLAGS</th>
              <th className="py-3 px-4 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DCEAE7]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center">
                    <FileText className="w-8 h-8 text-slate-300 mb-2" />
                    <p className="font-semibold text-sm text-[#0D2B3E]">No matching patients in queue</p>
                    <p className="text-xs text-slate-500 mt-0.5">Try resetting the stream selector or status filter.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((patient) => {
                const isPriority = patient.priorityFlag || patient.clinicalSummary?.priorityFlag || false;
                const isAyush = isAyurvedicRecord(patient);
                const safetyFlags = getSafetyFlags(patient);
                const isUnlocked = unlockedPatientIds.includes(patient.id) || patient.status === 'Verified';

                return (
                  <tr
                    key={patient.id}
                    onClick={() => handleActionClick(patient)}
                    className={`transition-colors cursor-pointer group hover:bg-[#F4FBF9] ${
                      isPriority 
                        ? 'border-l-4 border-l-[#C23B22] bg-rose-50/20' 
                        : ''
                    }`}
                  >
                    {/* 1. TOKEN # */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-7 h-7 rounded-lg border text-[11px] font-bold flex items-center justify-center ${
                          isPriority
                            ? 'bg-rose-100 border-rose-300 text-rose-800'
                            : 'bg-[#E4EFEC] border-[#DCEAE7] text-[#0D2B3E]'
                        }`}>
                          #{patient.queueNumber}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono font-bold text-xs text-[#146356] bg-[#E4EFEC] px-2 py-0.5 rounded-md border border-[#9FDCD1]">
                              {patient.tokenNumber}
                            </span>
                            {isPriority && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-rose-100 text-rose-700 border border-rose-300">
                                <AlertCircle className="w-3 h-3 text-rose-600" />
                                <span>PRIORITY</span>
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">{patient.appointmentTime}</p>
                        </div>
                      </div>
                    </td>

                    {/* 2. PATIENT DETAILS (Pre-OTP Obfuscation vs Post-OTP Full Legal Name) */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#E4EFEC] text-[#146356] font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {patient.name.charAt(0)}
                        </div>
                        <div>
                          {isUnlocked ? (
                            <>
                              <p className="font-bold text-[#0D2B3E] text-xs group-hover:text-[#146356] transition-colors">
                                {patient.name}
                              </p>
                              <p className="text-[11px] text-slate-500 flex items-center gap-1.5 flex-wrap mt-0.5">
                                <span>{patient.age} yrs</span>
                                <span>•</span>
                                <span>{patient.gender}</span>
                                {patient.vitals?.weight && (
                                  <>
                                    <span>•</span>
                                    <span className="font-semibold text-slate-700 bg-slate-100 px-1 rounded">
                                      {patient.vitals.weight}
                                    </span>
                                  </>
                                )}
                              </p>
                            </>
                          ) : (
                            <p className="font-semibold text-[#0D2B3E] text-xs">
                              {patient.age} yrs • {patient.gender}{patient.vitals?.weight ? ` • ${patient.vitals.weight}` : ''}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* 3. STREAM */}
                    <td className="py-3.5 px-4">
                      {isAyush ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#CEF3ED] text-[#146356] border border-[#9FDCD1]">
                          <Leaf className="w-3 h-3 text-[#146356]" />
                          <span>Ayurvedic Intake</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                          <Stethoscope className="w-3 h-3 text-gray-600" />
                          <span>Allopathic OPD</span>
                        </span>
                      )}
                    </td>

                    {/* 4. CHIEF COMPLAINT */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-xs text-[#0D2B3E] font-medium truncate" title={patient.chiefComplaint}>
                        {patient.chiefComplaint}
                      </p>
                      {showLanguage && (
                        <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                          <span>Language: {patient.preferredLanguage}</span>
                        </p>
                      )}
                    </td>

                    {/* 5. SAFETY FLAGS */}
                    <td className="py-3.5 px-4">
                      {safetyFlags.length > 0 ? (
                        <div className="flex flex-col gap-1 items-start">
                          {safetyFlags.map((flag, idx) => (
                            <span
                              key={idx}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                                flag.type === 'lab'
                                  ? 'bg-red-50 text-[#C23B22] border-red-200'
                                  : 'bg-amber-50 text-amber-900 border-amber-200'
                              }`}
                            >
                              {flag.label}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">—</span>
                      )}
                    </td>

                    {/* 6. ACTION */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActionClick(patient);
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#146356] hover:bg-[#0F4A40] transition-all shadow-xs cursor-pointer active:scale-98"
                      >
                        <Lock className="w-3 h-3 text-[#CEF3ED]" />
                        <span>Start Consultation</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-3.5 bg-[#F4FBF9] border-t border-[#DCEAE7] flex items-center justify-between text-[11px] text-slate-500">
        <span>Showing <strong>{filtered.length}</strong> of <strong>{patients.length}</strong> OPD patients</span>
        <span>AIIA / Ministry of Ayush Certified Electronic Queue</span>
      </div>

    </div>
  );
};
