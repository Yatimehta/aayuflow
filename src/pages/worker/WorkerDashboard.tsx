import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  UserPlus, 
  ArrowRight,
  Sparkles,
  Phone,
  FileText,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/StatCard';
import { StatusBadge } from '../../components/StatusBadge';
import { PriorityFlag } from '../../components/PriorityFlag';

export const WorkerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { patients, selectedHospital, setActivePatientId } = useApp();

  const totalPatients = patients.length;
  const pendingIntake = patients.filter(p => p.status === 'Pending' || p.status === 'Processing');
  const completedIntake = patients.filter(p => p.status === 'Verified').length;

  // Identify next patient awaiting assistance
  const nextPatient = pendingIntake[0] || patients[0];

  const handleBeginAssistedIntake = () => {
    if (nextPatient) {
      setActivePatientId(nextPatient.id);
      navigate('/worker/assist');
    }
  };

  return (
    <div className="space-y-5 relative z-10">
      
      {/* 1. TOP STAT STRIP + CALLOUT BADGE (Exact Reference Pattern) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        <div className="lg:col-span-8 stat-strip px-5 py-3 flex flex-wrap items-center justify-between gap-y-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 flex-shrink-0" />
            <span className="text-slate-500">Registered Today</span>
            <span className="font-extrabold text-slate-900 text-sm font-sans">{totalPatients}</span>
            <span className="text-slate-400">arrivals</span>
          </div>

          <div className="hidden sm:block h-4 w-px bg-slate-300" />

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0" />
            <span className="text-slate-500">Pending Assistance</span>
            <span className="font-extrabold text-slate-900 text-sm font-sans">{pendingIntake.length}</span>
            <span className="text-amber-700 font-semibold text-[11px]">waiting</span>
          </div>

          <div className="hidden sm:block h-4 w-px bg-slate-300" />

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
            <span className="text-slate-500">Forwarded to Doctor</span>
            <span className="font-extrabold text-slate-900 text-sm font-sans">{completedIntake}</span>
            <span className="text-emerald-700 font-semibold text-[11px]">dispatched</span>
          </div>
        </div>

        <div className="lg:col-span-4 callout-badge px-4 py-2.5 flex items-center justify-between gap-3 text-xs leading-snug">
          <p className="text-slate-700">
            Next patient <strong className="text-teal-700 font-bold">{nextPatient?.tokenNumber}</strong> is ready for case-taking.
          </p>
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
        </div>
      </div>

      {/* 2. GREETING & COUNTER HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 glass-card p-5 sm:p-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Good morning, Priya Narayanan
            </h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
              Counter A-2
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Assisting OPD arrivals with case-taking, language translation, and electronic queue dispatch at <strong>{selectedHospital.name}</strong>.
          </p>
        </div>

        <button
          onClick={() => navigate('/worker/patients')}
          className="btn-brand-primary inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register Walk-in Patient</span>
        </button>
      </div>

      {/* 3. ROW OF 3 KEY STAT CARDS MAX */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Registered Today"
          value={totalPatients}
          subtitle="Total OPD arrivals"
          icon={Users}
          variant="blue"
          trend="+18% vs yesterday"
        />
        <StatCard
          title="Pending Assistance"
          value={pendingIntake.length}
          subtitle="Waiting at counter desk"
          icon={Clock}
          variant="amber"
          trend="Immediate attention"
        />
        <StatCard
          title="Completed & Dispatched"
          value={completedIntake}
          subtitle="Forwarded to doctor queue"
          icon={CheckCircle2}
          variant="mint"
        />
      </div>

      {/* 4. PRIMARY ACTION AREA: Current Patient to Assist */}
      {nextPatient ? (
        <div className="glass-card p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/70 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-500 text-white flex items-center justify-center shadow-md font-bold text-lg">
                {nextPatient.name.charAt(0)}
              </div>
              <div>
                <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
                  Next Patient to Assist
                </span>
                <h2 className="text-xl font-bold text-slate-900">{nextPatient.name}</h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-2xl font-black font-mono text-teal-700 bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-xs">
                {nextPatient.tokenNumber}
              </span>
              <StatusBadge status={nextPatient.status} size="sm" />
              {nextPatient.priorityFlag && <PriorityFlag size="sm" pulse={true} />}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="glass-subcard p-4 space-y-1">
              <span className="text-slate-400 text-[11px] uppercase font-bold">Demographics & Language</span>
              <p className="font-semibold text-slate-900">
                {nextPatient.age} yrs • {nextPatient.gender}
              </p>
              <p className="text-teal-700 font-medium">
                Preferred: {nextPatient.preferredLanguage || 'Hindi'}
              </p>
            </div>

            <div className="glass-subcard p-4 space-y-1 md:col-span-2">
              <span className="text-slate-400 text-[11px] uppercase font-bold">Reported Chief Complaint</span>
              <p className="font-semibold text-slate-900 text-sm">
                {nextPatient.chiefComplaint}
              </p>
              <p className="text-[11px] text-slate-500">
                Phone: {nextPatient.phone} • ABHA: {nextPatient.abhaId || 'Not linked'}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-400" />
                {nextPatient.documents.length} diagnostic records
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-slate-400" />
                SMS Token Sent
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => navigate('/worker/queue')}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all"
              >
                View Full Queue
              </button>
              <button
                onClick={handleBeginAssistedIntake}
                className="flex-1 sm:flex-none btn-brand-primary inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold"
              >
                <Sparkles className="w-4 h-4" />
                <span>Begin Guided Clinical Intake</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card p-12 text-center text-slate-500">
          <p className="font-medium text-sm text-slate-800">No patients currently waiting at Counter A-2</p>
        </div>
      )}

    </div>
  );
};
