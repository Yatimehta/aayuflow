import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  Printer, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Wind,
  Droplets,
  Calendar,
  Activity,
  Heart,
  Brain,
  Pill,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
import { Patient } from '../../types';

export const AyurvedicDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { patients, activePatient, updatePatientStatus, showToast } = useApp();

  const selectedPatient: Patient = activePatient || patients[0];
  const summary = selectedPatient.clinicalSummary;

  const [activeAnatomicalZone, setActiveAnatomicalZone] = useState<string>('knees');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isVerified, setIsVerified] = useState<boolean>(summary.verifiedByDoctor);

  const handleVerify = () => {
    setIsVerified(true);
    updatePatientStatus(selectedPatient.id, 'Verified', 'Ayurvedic Digital Twin & Prakriti synthesis verified by consulting Vaidya.');
    showToast({
      type: 'success',
      title: 'Digital Twin Assessment Verified',
      message: `Signed off for Token ${selectedPatient.tokenNumber}. Ready for pharmacy & panchakarma dispensary.`
    });
  };

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl mx-auto space-y-5">
      
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
          <button 
            onClick={() => navigate('/doctor')}
            className="hover:underline flex items-center gap-1 text-white hover:text-white/80 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Doctor Workstation</span>
          </button>
          <span className="opacity-60">/</span>
          <span className="text-white/70">Clinical Dossier</span>
          <span className="opacity-60">/</span>
          <span className="text-white font-bold">Ayurvedic Digital Twin & Risk Score</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur-md border border-white/30 transition-all flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          {isVerified ? (
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/90 text-white text-xs font-bold shadow-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Vaidya Verified</span>
            </span>
          ) : (
            <button
              onClick={handleVerify}
              className="btn-brand-primary px-4 py-1.5 text-xs font-bold flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verify & Sign Off</span>
            </button>
          )}
        </div>
      </div>

      {/* TOP STAT STRIP + CALLOUT BADGE (Exact Reference Pattern) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Horizontal Glass Stat Strip (9 cols on lg) */}
        <div className="lg:col-span-8 stat-strip px-5 py-3 flex flex-wrap items-center justify-between gap-y-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 flex-shrink-0" />
            <span className="text-slate-500">Prakriti Baseline</span>
            <span className="font-bold text-slate-900 text-sm">{summary.prakriti}</span>
          </div>

          <div className="hidden sm:block h-4 w-px bg-slate-300" />

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 flex-shrink-0" />
            <span className="text-slate-500">Patient</span>
            <span className="font-bold text-slate-900 text-sm">{selectedPatient.name}</span>
            <span className="text-[11px] text-slate-400 font-mono">({selectedPatient.age}y • {selectedPatient.gender})</span>
          </div>

          <div className="hidden sm:block h-4 w-px bg-slate-300" />

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0" />
            <span className="text-slate-500">Active Token</span>
            <span className="font-bold text-slate-900 text-sm font-mono">{selectedPatient.tokenNumber}</span>
          </div>

          <div className="hidden md:block h-4 w-px bg-slate-300" />

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
            <span className="text-slate-500">Pulse (Nadi)</span>
            <span className="font-bold text-slate-900 text-sm">74 <small className="text-slate-500 font-normal">bpm</small></span>
            <span className="text-emerald-600 font-semibold text-[11px] flex items-center">▲ Normal</span>
          </div>
        </div>

        {/* Callout Badge (4 cols on lg) */}
        <div className="lg:col-span-4 callout-badge px-4 py-2.5 flex items-center justify-between gap-3 text-xs leading-snug">
          <p className="text-slate-700">
            Systemic Vata is elevating <strong className="text-rose-600 font-bold">23% above baseline</strong>, driving joint crepitus.
          </p>
          <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 font-bold text-xs">
            !
          </div>
        </div>
      </div>

      {/* 3-COLUMN CLINICAL DASHBOARD (Matches Reference Layout Exactly) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* COLUMN 1: Dosha Imbalance Risk Score (4 cols) */}
        <div className="lg:col-span-4 glass-card p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900">Dosha Imbalance Risk Score</h3>
            </div>

            {/* Big Score + Chip */}
            <div className="flex items-baseline justify-between mb-3">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">0.76%</span>
                <span className="text-slate-400 font-medium text-xs">/ 45 Expected age</span>
              </div>
              <span className="inline-flex items-center rounded-full bg-white/90 border border-slate-200/80 px-2.5 py-1 text-xs font-semibold text-slate-800 gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Moderate Risk</span>
              </span>
            </div>

            {/* Gradient Risk Bar with Marker Pin */}
            <div className="space-y-1.5 pt-1">
              <div className="relative pt-2 pb-1">
                {/* Horizontal Gradient Bar */}
                <div className="h-3 w-full rounded-full risk-gradient-bar shadow-inner relative" />
                
                {/* Vertical Marker Pointer */}
                <div 
                  className="absolute top-0 flex flex-col items-center pointer-events-none transition-all duration-300"
                  style={{ left: '68%' }}
                >
                  <div className="w-3.5 h-3.5 bg-slate-900 border-2 border-white rounded-full shadow-md -mt-0.5" />
                  <div className="w-0.5 h-4 bg-slate-900 -mt-1" />
                </div>
              </div>

              <div className="flex justify-between text-[11px] text-slate-400 font-mono px-0.5">
                <span>0 Min</span>
                <span className="font-semibold text-slate-600">Position: 0.76%</span>
                <span>30 Max</span>
              </div>
            </div>

            {/* Risk Score Interpretation Sub-card */}
            <div className="glass-subcard p-3.5 mt-4 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                <Activity className="w-3.5 h-3.5 text-teal-600" />
                <span>Vata-Prakopa Assessment</span>
              </div>
              <p className="text-slate-600 text-[12px] leading-relaxed">
                You have an <strong className="text-slate-800 font-semibold">18.4% clinical risk</strong> of progressive joint space narrowing in Asthi Dhatu over 24 months if uncorrected by Snehana.
              </p>
            </div>
          </div>

          {/* Areas of Concern Chips */}
          <div className="pt-2 border-t border-slate-200/70">
            <div className="flex items-center justify-between text-[11px] mb-2">
              <span className="font-bold uppercase tracking-wider text-slate-500">Areas of Concern</span>
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Low</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Med</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> High</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setActiveAnatomicalZone('knees')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                  activeAnatomicalZone === 'knees' 
                    ? 'bg-rose-100 border border-rose-300 text-rose-900 shadow-xs' 
                    : 'bg-white/90 border border-slate-200/80 text-slate-700 hover:bg-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Janu Sandhi (Knees)</span>
              </button>

              <button
                onClick={() => setActiveAnatomicalZone('stomach')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                  activeAnatomicalZone === 'stomach' 
                    ? 'bg-amber-100 border border-amber-300 text-amber-900 shadow-xs' 
                    : 'bg-white/90 border border-slate-200/80 text-slate-700 hover:bg-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Vishama Agni</span>
              </button>

              <button
                onClick={() => setActiveAnatomicalZone('lumbar')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                  activeAnatomicalZone === 'lumbar' 
                    ? 'bg-emerald-100 border border-emerald-300 text-emerald-900 shadow-xs' 
                    : 'bg-white/90 border border-slate-200/80 text-slate-700 hover:bg-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Kati Prishta</span>
              </button>
            </div>
          </div>
        </div>

        {/* COLUMN 2: "Why The Risk?" / "Why The Imbalance?" (4 cols) */}
        <div className="lg:col-span-4 glass-card p-5 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-900">Why The Imbalance?</h3>
              <button 
                onClick={() => setActiveAnatomicalZone('knees')}
                className="text-xs text-teal-700 font-bold hover:underline inline-flex items-center gap-0.5"
              >
                <span>View all data</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              The score is primarily influenced by:
            </p>

            {/* Nested Sub-Card 1 */}
            <div className="glass-subcard p-3.5 space-y-1 mb-2.5">
              <p className="text-xs font-semibold text-slate-700">Elevated Joint Vata Stress</p>
              <div className="flex items-baseline gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0" />
                <span className="text-2xl font-extrabold text-slate-900 font-sans">84%</span>
                <span className="text-xs text-slate-400 font-mono">Doshic load</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-0.5">
                Increases depletion of Shleshaka Kapha & synovial dryness.
              </p>
            </div>

            {/* Nested Sub-Card 2 */}
            <div className="glass-subcard p-3.5 space-y-1 mb-2.5">
              <p className="text-xs font-semibold text-slate-700">Metabolic & Digestive Status</p>
              <div className="flex items-baseline gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 flex-shrink-0" />
                <span className="text-xl font-extrabold text-slate-900 font-sans">Vishama / Manda</span>
                <span className="text-xs text-slate-400 font-mono">Agni</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-0.5">
                Puts metabolic strain on nutrient assimilation into bone tissue.
              </p>
            </div>

            {/* Nested Sub-Cards Side by Side */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="glass-subcard p-2.5 space-y-0.5">
                <p className="font-bold text-slate-800 text-[11px]">Sedentary & Cold</p>
                <p className="text-[10px] text-slate-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Increases Vata
                </p>
              </div>

              <div className="glass-subcard p-2.5 space-y-0.5">
                <p className="font-bold text-slate-800 text-[11px]">Dietary Triggers</p>
                <p className="text-[10px] text-slate-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Irregular timings
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/70 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Questionnaire validation: <strong>SIH Verified</strong></span>
            <span className="text-emerald-700 font-semibold">100% Data Concordance</span>
          </div>
        </div>

        {/* COLUMN 3: Your Digital Twin Overview (4 cols - Matches Reference Graphic) */}
        <div className="lg:col-span-4 glass-card p-5 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-slate-900">Your Digital Twin Overview</h3>
              <button 
                onClick={() => setZoomLevel(1)}
                className="text-xs text-teal-700 font-bold hover:underline inline-flex items-center gap-0.5"
              >
                <span>View all data</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight mb-2">
              A personalized model uses clinical history & pulse data to simulate organ stress.
            </p>
          </div>

          {/* Central Body Graphic with Glowing Anatomical Overlay */}
          <div className="relative my-2 flex items-center justify-center min-h-[290px]">
            {/* SVG Silhouette in translucent grayscale styling with glowing internal anatomy */}
            <div 
              className="relative w-56 h-72 flex items-center justify-center transition-transform duration-300"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {/* Warm Amber Glowing Radial Core behind chest/heart like the reference image */}
              <div 
                className="absolute top-16 left-28 w-20 h-20 rounded-full bg-amber-500/50 blur-xl pointer-events-none animate-pulse"
              />
              <div 
                className="absolute top-18 left-30 w-12 h-12 rounded-full bg-orange-600/60 blur-md pointer-events-none"
              />

              {/* Anatomical Body Silhouette Vector */}
              <svg
                viewBox="0 0 200 360"
                className="w-full h-full drop-shadow-md"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Translucent Grayscale Silhouette Form */}
                <path
                  d="M100 22 C107 22, 113 28, 113 36 C113 44, 107 50, 100 50 C93 50, 87 44, 87 36 C87 28, 93 22, 100 22 Z 
                     M95 52 L105 52 L118 66 L136 94 L142 136 L134 138 L128 104 L116 88 L116 142 L120 198 L117 265 L119 335 L109 335 L105 265 L103 198 L97 198 L95 265 L91 335 L81 335 L83 265 L79 198 L83 142 L83 88 L71 104 L65 138 L57 136 L63 94 L81 66 Z"
                  fill="rgba(148, 163, 184, 0.45)"
                  stroke="rgba(100, 116, 139, 0.6)"
                  strokeWidth="2"
                />

                {/* Internal Anatomical rib/vessel lines */}
                <path d="M94 75 Q100 78 106 75" stroke="#94a3b8" strokeWidth="1" />
                <path d="M90 85 Q100 90 110 85" stroke="#94a3b8" strokeWidth="1" />
                <path d="M88 95 Q100 100 112 95" stroke="#94a3b8" strokeWidth="1" />
                <path d="M88 105 Q100 110 112 105" stroke="#94a3b8" strokeWidth="1" />
                <path d="M90 115 Q100 120 110 115" stroke="#94a3b8" strokeWidth="1" />

                {/* Glowing Heart/Chest Organ (Warm Amber/Orange Glow like reference) */}
                <g 
                  className="cursor-pointer"
                  onClick={() => setActiveAnatomicalZone('chest')}
                >
                  <circle cx="106" cy="92" r="13" fill="rgba(249, 115, 22, 0.7)" />
                  <circle cx="106" cy="92" r="18" fill="none" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="3 2" className="animate-spin" />
                </g>

                {/* Stomach / Agni Hotspot */}
                <g 
                  className="cursor-pointer"
                  onClick={() => setActiveAnatomicalZone('stomach')}
                >
                  <circle cx="98" cy="126" r="11" fill="rgba(245, 158, 11, 0.55)" />
                </g>

                {/* Bilateral Knee Hotspots */}
                <g 
                  className="cursor-pointer"
                  onClick={() => setActiveAnatomicalZone('knees')}
                >
                  <circle cx="89" cy="245" r="11" fill="rgba(239, 68, 68, 0.65)" stroke="#dc2626" strokeWidth="1.5" />
                  <circle cx="111" cy="245" r="11" fill="rgba(239, 68, 68, 0.65)" stroke="#dc2626" strokeWidth="1.5" />
                </g>
              </svg>

              {/* Floating Dark Percentage Badges (Exactly like reference '72%', '15%') */}
              {/* Chest Badge */}
              <div className="absolute top-16 right-4 bg-slate-900/90 text-white border border-slate-700/60 rounded-full px-2.5 py-0.5 text-[11px] font-bold shadow-md flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>72%</span>
              </div>

              {/* Liver/Stomach Badge */}
              <div className="absolute top-28 left-4 bg-slate-900/90 text-white border border-slate-700/60 rounded-full px-2.5 py-0.5 text-[11px] font-bold shadow-md flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>15%</span>
              </div>

              {/* Knees Badge */}
              <div className="absolute bottom-12 right-6 bg-slate-900/90 text-white border border-slate-700/60 rounded-full px-2.5 py-0.5 text-[11px] font-bold shadow-md flex items-center gap-1 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>84%</span>
              </div>
            </div>

            {/* Bottom-Right White Circular Control Buttons (Matches reference +, -, expand) */}
            <div className="absolute bottom-1 right-1 flex flex-col gap-1.5 z-20">
              <button 
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.35))}
                className="w-7 h-7 rounded-full bg-white text-slate-700 hover:text-slate-950 shadow-sm border border-slate-200 flex items-center justify-center transition-all text-sm font-bold"
                title="Zoom In"
              >
                +
              </button>
              <button 
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.85))}
                className="w-7 h-7 rounded-full bg-white text-slate-700 hover:text-slate-950 shadow-sm border border-slate-200 flex items-center justify-center transition-all text-sm font-bold"
                title="Zoom Out"
              >
                -
              </button>
              <button 
                onClick={() => setZoomLevel(1)}
                className="w-7 h-7 rounded-full bg-white text-slate-700 hover:text-slate-950 shadow-sm border border-slate-200 flex items-center justify-center transition-all text-xs font-bold"
                title="Reset View"
              >
                <Maximize2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Active Hotspot Bottom Action */}
          <div className="glass-subcard p-2.5 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="font-bold text-slate-800 text-[11px]">
                {activeAnatomicalZone === 'knees' ? 'Janu Sandhi Selected' : activeAnatomicalZone === 'stomach' ? 'Amashaya Selected' : 'Hridaya Zone'}
              </span>
            </div>
            <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              Panchakarma Ready
            </span>
          </div>
        </div>

      </div>

      {/* BOTTOM PANEL: EPIGENETIC / DOSHIC DISEASE RISK PROFILE (Matches Reference Bottom Card) */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
          <h3 className="text-base font-bold text-slate-900">Epigenetic & Ayurvedic Disease Risk Profile</h3>
          <span className="text-xs text-slate-400 font-mono">Synthesized via ABDM AYUSH FHIR Standards</span>
        </div>

        {/* 3 Columns (T2 Diabetes / Alzheimer's / Cardiovascular & Joint) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Column 1: Metabolic & Agni */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
                <div className="w-6 h-6 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
                  <Droplets className="w-3.5 h-3.5" />
                </div>
                <span>T2 Diabetes / Prameha</span>
              </div>
              <span className="inline-flex items-center rounded-full bg-white border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-700 gap-1 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>Suboptimal</span>
              </span>
            </div>

            {/* Sub-card: Risk score */}
            <div className="glass-subcard p-3 text-xs space-y-0.5">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Polygenic & Dosha Score</span>
              <p className="font-bold text-slate-900 text-sm">44<span className="text-xs font-normal text-slate-500">th percentile</span></p>
            </div>

            {/* Sub-card: Markers */}
            <div className="glass-subcard p-3 text-xs space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Clinical Markers</span>
              <div className="flex items-center gap-3 text-[11px] text-slate-700 font-medium">
                <span className="flex items-center gap-1"><span className="w-1 h-3 bg-amber-500 rounded-full" /> TCF7L2</span>
                <span className="flex items-center gap-1"><span className="w-1 h-3 bg-amber-500 rounded-full" /> PPARG</span>
              </div>
            </div>

            {/* Sub-card: Action */}
            <div className="glass-subcard p-3 text-xs flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-xs">Deepana & Vyayama</p>
                <p className="text-[11px] text-slate-500 leading-tight">Do 150 min moderate brisk walking weekly to balance Meda Dhatu.</p>
              </div>
            </div>
          </div>

          {/* Column 2: Cognitive & Manovaha */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
                <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Brain className="w-3.5 h-3.5" />
                </div>
                <span>Alzheimer's / Smriti</span>
              </div>
              <span className="inline-flex items-center rounded-full bg-white border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-700 gap-1 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Optimal</span>
              </span>
            </div>

            {/* Sub-card: Risk score */}
            <div className="glass-subcard p-3 text-xs space-y-0.5">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Polygenic & Dosha Score</span>
              <p className="font-bold text-slate-900 text-sm">12<span className="text-xs font-normal text-slate-500">th percentile</span></p>
            </div>

            {/* Sub-card: Markers */}
            <div className="glass-subcard p-3 text-xs space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Clinical Markers</span>
              <div className="flex items-center gap-3 text-[11px] text-slate-700 font-medium">
                <span className="flex items-center gap-1"><span className="w-1 h-3 bg-emerald-500 rounded-full" /> APOE</span>
                <span className="flex items-center gap-1"><span className="w-1 h-3 bg-emerald-500 rounded-full" /> PSEN1</span>
              </div>
            </div>

            {/* Sub-card: Action */}
            <div className="glass-subcard p-3 text-xs flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Pill className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-xs">Medhya Rasayanas</p>
                <p className="text-[11px] text-slate-500 leading-tight">Focus on Brahmi & Shankhpushpi with cow ghee to preserve cognitive health.</p>
              </div>
            </div>
          </div>

          {/* Column 3: Sandhi Vata / Osteo-Articular & Cardiovascular */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
                <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Heart className="w-3.5 h-3.5" />
                </div>
                <span>Sandhi-Vata (Joints)</span>
              </div>
              <span className="inline-flex items-center rounded-full bg-white border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-700 gap-1 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>Critical</span>
              </span>
            </div>

            {/* Sub-card: Risk score */}
            <div className="glass-subcard p-3 text-xs space-y-0.5">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Polygenic & Dosha Score</span>
              <p className="font-bold text-rose-600 text-sm">91<span className="text-xs font-normal text-slate-500">st percentile</span></p>
            </div>

            {/* Sub-card: Markers */}
            <div className="glass-subcard p-3 text-xs space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Clinical Markers</span>
              <div className="flex items-center gap-3 text-[11px] text-slate-700 font-medium">
                <span className="flex items-center gap-1"><span className="w-1 h-3 bg-rose-500 rounded-full" /> TCF7L2</span>
                <span className="flex items-center gap-1"><span className="w-1 h-3 bg-rose-500 rounded-full" /> cg18064256</span>
              </div>
            </div>

            {/* Sub-card: Action */}
            <div className="glass-subcard p-3 text-xs flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-xs">Janu Basti Therapy</p>
                <p className="text-[11px] text-slate-500 leading-tight">Administer warm Murivenna oil pooling for 7 days followed by Patra Sweda.</p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
