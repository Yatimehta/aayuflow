import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  Search, 
  Sparkles, 
  Compass,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/StatCard';
import { PatientTable } from '../../components/PatientTable';
import { Patient } from '../../types';

export const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    patients, 
    selectedHospital, 
    setActivePatientId, 
    unreadReportCount, 
    showToast 
  } = useApp();

  const [tokenSearch, setTokenSearch] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'waiting' | 'completed'>('all');

  const totalPatients = patients.length;
  const waitingPatients = patients.filter(p => p.status === 'Processing' || p.status === 'Pending');
  const completedPatients = patients.filter(p => p.status === 'Verified');

  const displayedPatients = filterMode === 'waiting'
    ? waitingPatients
    : filterMode === 'completed'
    ? completedPatients
    : patients;

  const handlePatientSelect = (p: Patient) => {
    setActivePatientId(p.id);
    navigate('/doctor/patient');
  };

  const handleQuickTokenJump = (e: React.FormEvent) => {
    e.preventDefault();
    const found = patients.find(p => p.tokenNumber.toLowerCase() === tokenSearch.trim().toLowerCase());
    if (found) {
      setActivePatientId(found.id);
      navigate('/doctor/patient');
    } else {
      showToast({
        type: 'error',
        title: 'Token Not Found',
        message: `No active patient with token "${tokenSearch}" in today's OPD.`
      });
    }
  };

  return (
    <div className="space-y-5 relative z-10">
      
      {/* 1. TOP STAT STRIP + CALLOUT BADGE (Exact Reference Pattern) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Horizontal Glass Stat Strip */}
        <div className="lg:col-span-8 stat-strip px-5 py-3 flex flex-wrap items-center justify-between gap-y-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 flex-shrink-0" />
            <span className="text-slate-500">OPD Queue</span>
            <span className="font-extrabold text-slate-900 text-sm font-sans">{totalPatients}</span>
            <span className="text-slate-400 font-normal">registered</span>
          </div>

          <div className="hidden sm:block h-4 w-px bg-slate-300" />

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0" />
            <span className="text-slate-500">Waiting</span>
            <span className="font-extrabold text-slate-900 text-sm font-sans">{waitingPatients.length}</span>
            <span className="text-amber-700 font-semibold text-[11px]">in line</span>
          </div>

          <div className="hidden sm:block h-4 w-px bg-slate-300" />

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
            <span className="text-slate-500">Consulted Today</span>
            <span className="font-extrabold text-slate-900 text-sm font-sans">{completedPatients.length}</span>
            <span className="text-emerald-700 font-semibold text-[11px]">verified</span>
          </div>

          <div className="hidden md:block h-4 w-px bg-slate-300" />

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 flex-shrink-0" />
            <span className="text-slate-500">Avg Wait</span>
            <span className="font-extrabold text-slate-900 text-sm font-sans">{selectedHospital.currentWaitMinutes}</span>
            <span className="text-slate-500">min</span>
          </div>
        </div>

        {/* Callout Badge */}
        <div className="lg:col-span-4 callout-badge px-4 py-2.5 flex items-center justify-between gap-3 text-xs leading-snug">
          <p className="text-slate-700">
            <strong className="text-amber-700 font-bold">{waitingPatients.length} patients</strong> need clinical review right now.
          </p>
          <button
            onClick={() => navigate('/doctor/ayurveda-view')}
            className="text-[11px] font-bold text-teal-700 hover:underline flex-shrink-0 flex items-center gap-0.5"
          >
            <span>Digital Twin</span>
            <Compass className="w-3.5 h-3.5 text-teal-600" />
          </button>
        </div>
      </div>

      {/* 2. GREETING & CONTEXT HEADER CARD */}
      <div className="glass-card p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Good morning, Dr. Alok Verma
            </h1>
            {unreadReportCount > 0 && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
                <span>{unreadReportCount} AI Clinical Summaries Ready</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kayachikitsa OPD • {selectedHospital.name} • Room 104 • Consultations synced to ABDM Gateway.
          </p>
        </div>

        {/* Quick Search by Token Input */}
        <form onSubmit={handleQuickTokenJump} className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={tokenSearch}
              onChange={(e) => setTokenSearch(e.target.value)}
              placeholder="Jump to Token (e.g. AYU-1052)..."
              className="pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white/95 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 font-mono w-48 sm:w-56 text-slate-900 shadow-xs"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 rounded-xl btn-brand-primary text-xs font-semibold shadow-soft"
          >
            Go
          </button>
        </form>
      </div>

      {/* 3. ROW OF 4 KEY STAT CARDS MAX */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Waiting in Queue"
          value={waitingPatients.length}
          subtitle="Ready for doctor consultation"
          icon={Clock}
          variant="amber"
          trend="Action required"
        />
        <StatCard
          title="AI Summaries Ready"
          value={unreadReportCount}
          subtitle="Pre-consultation dossiers"
          icon={Sparkles}
          variant="teal"
        />
        <StatCard
          title="Completed Today"
          value={completedPatients.length}
          subtitle="Consulted & verified"
          icon={CheckCircle2}
          variant="mint"
        />
        <StatCard
          title="Average Wait Time"
          value={`${selectedHospital.currentWaitMinutes} min`}
          subtitle="Kayachikitsa throughput"
          icon={Users}
          variant="blue"
        />
      </div>

      {/* 4. PRIMARY DOMINANT FOCUS AREA: Patient Queue */}
      <div className="space-y-4">
        {/* Clean Patient Table in Frosted Glass Container */}
        <PatientTable
          patients={displayedPatients}
          onSelectPatient={handlePatientSelect}
          title="Today's Consultation Queue"
          subtitle="Select a patient to open their comprehensive clinical dossier, review Prakriti, and sign off."
        />
      </div>

    </div>
  );
};
