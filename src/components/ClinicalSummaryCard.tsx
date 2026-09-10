import React from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  AlertCircle, 
  Pill, 
  Activity, 
  Heart, 
  FileText, 
  Stethoscope, 
  Share2, 
  Printer, 
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { ClinicalSummary, CareSystem, Patient } from '../types';
import { AISafetyBanner } from './AISafetyBanner';
import { PriorityFlag } from './PriorityFlag';

interface ClinicalSummaryCardProps {
  patient: Patient;
  summary?: ClinicalSummary;
  onVerify?: () => void;
  onOpenAyurvedaView?: () => void;
  isDoctorView?: boolean;
}

export const ClinicalSummaryCard: React.FC<ClinicalSummaryCardProps> = ({
  patient,
  summary = patient.clinicalSummary,
  onVerify,
  onOpenAyurvedaView,
  isDoctorView = false
}) => {
  const careSystem: CareSystem = patient.careSystem || summary.patientBanner?.careSystem || 'AYURVEDA';
  const isAyurveda = careSystem === 'AYURVEDA';
  const isPriority = patient.priorityFlag || summary.priorityFlag;

  return (
    <div className="rounded-3xl border border-white/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-soft-lg overflow-hidden transition-all">
      {/* 1. Patient Banner */}
      <div className="p-5 sm:p-6 border-b border-brand-border/60 bg-gradient-to-r from-brand-teal-light/40 via-white/50 to-brand-blue-light/30 dark:from-slate-800/80 dark:to-slate-900/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-soft flex-shrink-0 ${
              isAyurveda 
                ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white' 
                : 'bg-gradient-to-br from-sky-500 to-blue-600 text-white'
            }`}>
              {patient.name.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold text-brand-heading font-serif">
                  {patient.name}
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  isAyurveda 
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30' 
                    : 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30'
                }`}>
                  {careSystem}
                </span>
                {isPriority && <PriorityFlag size="sm" />}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-brand-muted mt-1 font-mono">
                <span>Patient ID: <strong className="text-brand-heading">{patient.id}</strong></span>
                <span>•</span>
                <span>Token: <strong className="text-brand-teal-dark">{patient.tokenNumber}</strong></span>
                <span>•</span>
                <span>Age/Gender: <strong className="text-brand-heading">{patient.age}y / {patient.gender}</strong></span>
                <span>•</span>
                <span>Prakriti: <strong className="text-emerald-600 dark:text-emerald-400">{patient.doshaPrimary || summary.prakriti}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {summary.verifiedByDoctor ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Verified by Doctor
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                Awaiting Doctor Review
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Persistent AI Safety Notice */}
        <AISafetyBanner />

        {/* 2 & 3. Chief Complaints & Symptoms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-brand-bg/60 dark:bg-slate-800/50 border border-brand-border/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-teal" />
              Chief Complaints
            </h4>
            <div className="space-y-1.5">
              {summary.chiefComplaints && summary.chiefComplaints.length > 0 ? (
                summary.chiefComplaints.map((c, i) => (
                  <p key={i} className="text-xs sm:text-sm font-semibold text-brand-heading">
                    • {c}
                  </p>
                ))
              ) : (
                <p className="text-xs sm:text-sm font-semibold text-brand-heading">{patient.chiefComplaint}</p>
              )}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-brand-bg/60 dark:bg-slate-800/50 border border-brand-border/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-2 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-sky-500" />
              Duration & Severity
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-brand-muted">Duration:</span>
                <span className="font-bold text-brand-heading">{summary.duration || 'Not specified'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-muted">Severity Rating:</span>
                <span className={`px-2 py-0.5 rounded-md font-bold text-xs ${
                  isPriority || summary.severity === 'Severe'
                    ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                    : summary.severity === 'Moderate'
                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                }`}>
                  {summary.severity || (isPriority ? 'Severe' : 'Moderate')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">Digestive Agni:</span>
                <span className="font-semibold text-brand-heading">{summary.agni || 'Vishama Agni'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Current Medications & Known Allergies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-800/40 border border-brand-border/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-2 flex items-center gap-2">
              <Pill className="w-4 h-4 text-emerald-500" />
              Current Medications
            </h4>
            {summary.medications && summary.medications.length > 0 ? (
              <ul className="space-y-1 text-xs text-brand-body">
                {summary.medications.map((m, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-brand-muted italic">No ongoing prescription medications disclosed.</p>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-800/40 border border-brand-border/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              Known Allergies & Sensitivities
            </h4>
            {summary.allergies && summary.allergies.length > 0 ? (
              <ul className="space-y-1 text-xs text-brand-body">
                {summary.allergies.map((a, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 font-medium text-rose-700 dark:text-rose-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">✓ No known drug or environmental allergies.</p>
            )}
          </div>
        </div>

        {/* 5. Ayurvedic Constitution & Pathophysiology (If Ayurveda) */}
        {isAyurveda && (
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Ayurvedic Assessment: Dosha, Agni & Srotas
              </h4>
              {onOpenAyurvedaView && (
                <button
                  onClick={onOpenAyurvedaView}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-soft transition-all"
                >
                  <span>Launch Digital Twin View</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-emerald-500/20">
                <span className="text-[10px] uppercase font-bold text-brand-muted">Prakriti (Baseline)</span>
                <p className="font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">{summary.prakriti}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-emerald-500/20">
                <span className="text-[10px] uppercase font-bold text-brand-muted">Vikriti (Imbalance)</span>
                <p className="font-bold text-amber-700 dark:text-amber-300 truncate mt-0.5" title={summary.vikriti}>{summary.vikriti}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-emerald-500/20">
                <span className="text-[10px] uppercase font-bold text-brand-muted">Agni (Metabolism)</span>
                <p className="font-bold text-brand-heading mt-0.5">{summary.agni}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-emerald-500/20">
                <span className="text-[10px] uppercase font-bold text-brand-muted">Koshtha (Bowel)</span>
                <p className="font-bold text-brand-heading mt-0.5">{summary.koshtha}</p>
              </div>
            </div>
          </div>
        )}

        {/* 6. AI Preliminary Insights */}
        <div className="p-4 rounded-2xl bg-brand-bg/70 dark:bg-slate-800/60 border border-brand-border/70 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-brand-heading flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-teal" />
            AI Preliminary Clinical Synthesis
          </h4>
          <p className="text-xs text-brand-body leading-relaxed">
            {summary.aiGeneratedNotes}
          </p>

          {summary.recommendedTherapies && summary.recommendedTherapies.length > 0 && (
            <div className="pt-2">
              <span className="text-[11px] font-bold text-brand-heading uppercase tracking-wider">Suggested Therapy Protocols:</span>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {summary.recommendedTherapies.map((th, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 border border-brand-border text-xs font-medium text-brand-heading">
                    {th}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Doctor Action Bar */}
        {isDoctorView && (
          <div className="pt-4 border-t border-brand-border flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {onOpenAyurvedaView && isAyurveda && (
                <button
                  onClick={onOpenAyurvedaView}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-bold shadow-soft inline-flex items-center gap-2"
                >
                  <Layers className="w-4 h-4" />
                  <span>Expand Ayurvedic Digital Twin</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {onVerify && !summary.verifiedByDoctor && (
                <button
                  onClick={onVerify}
                  className="px-5 py-2 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white text-xs font-bold shadow-soft inline-flex items-center gap-2 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify & Sign-off Clinical Summary</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
