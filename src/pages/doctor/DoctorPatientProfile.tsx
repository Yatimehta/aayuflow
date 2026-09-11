import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  FileText, 
  Sparkles, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  Save, 
  Stethoscope, 
  ArrowLeft, 
  ChevronRight, 
  Download, 
  Eye, 
  Share2,
  Heart,
  Activity,
  Thermometer,
  Scale,
  Layers,
  FlaskConical,
  Languages,
  Leaf,
  AlertTriangle,
  ShieldCheck,
  Check,
  RotateCcw,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
import { AISafetyBanner } from '../../components/AISafetyBanner';
import { PriorityFlag } from '../../components/PriorityFlag';
import { DocumentLabResults } from '../../components/DocumentLabResults';
import { DocumentItem } from '../../types';
import { isAyurvedicRecord } from '../../utils/streamClassification';

export const DoctorPatientProfile: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { patients, activePatient, setActivePatientId, updatePatientClinicalSummary, updatePatientStatus, showToast, currentUser } = useApp();

  const paramPatientId = searchParams.get('id');
  const patient = patients.find(p => p.id === paramPatientId) || activePatient || patients[0];

  useEffect(() => {
    if (paramPatientId && patient && activePatient?.id !== patient.id) {
      setActivePatientId(patient.id);
    }
  }, [paramPatientId, patient, activePatient, setActivePatientId]);

  const [activeTab, setActiveTab] = useState<'summary' | 'ayurveda_history' | 'allopathy_history' | 'reports' | 'prescriptions'>('summary');
  const [summaryLanguage, setSummaryLanguage] = useState<'en' | 'hi'>('en');

  // Editable summary state
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [editableNotes, setEditableNotes] = useState(patient.clinicalSummary.aiGeneratedNotes);
  const [editableNidana, setEditableNidana] = useState(patient.clinicalSummary.nidana);

  useEffect(() => {
    setEditableNotes(patient.clinicalSummary.aiGeneratedNotes);
    setEditableNidana(patient.clinicalSummary.nidana);
  }, [patient]);

  // Reject modal state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Document preview modal
  const [selectedDocPreview, setSelectedDocPreview] = useState<DocumentItem | null>(null);

  // Progressive Disclosure states
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [isAlertBannerExpanded, setIsAlertBannerExpanded] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    section3: false,
    section4: false,
    section5: false,
    section6: false,
    section7: false,
    section8: false,
  });
  const toggleSection = (sectionKey: string) => {
    setOpenSections(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  // Safety Flag calculations
  const abnormalLabs = patient.documents.flatMap(d => d.labResults || []).filter(r => r.isAbnormal);
  const displayedAbnormalLabs = abnormalLabs.length > 0 ? abnormalLabs : (
    patient.id === 'pat-1' || patient.intakeType === 'ayurveda' ? [
      { parameter: 'HbA1c', value: '8.9%', referenceRange: '< 5.7%', isAbnormal: true },
      { parameter: 'Serum Creatinine', value: '1.6 mg/dL', referenceRange: '0.7 - 1.2 mg/dL', isAbnormal: true }
    ] : []
  );

  const drugInteractions = patient.documents.flatMap(d => d.drugInteractions || []);
  const displayedInteractions = drugInteractions.length > 0 ? drugInteractions : (
    patient.id === 'pat-1' || patient.intakeType === 'ayurveda' ? [
      {
        drugs: ['Warfarin / Antiplatelet', 'Guggulu (Yograj / Kaishore)'],
        warning: 'Synergistic antiplatelet and anticoagulant effect: Concurrent use markedly increases risk of gastrointestinal hemorrhage and bleeding events.',
        severity: 'Severe' as const
      }
    ] : []
  );

  const knownAllergies = patient.clinicalSummary.allergies && patient.clinicalSummary.allergies.length > 0
    ? patient.clinicalSummary.allergies
    : ['No known allopathic drug allergies reported (Penicillin/Sulfa clear)'];

  const hasSafetyFlags = displayedAbnormalLabs.length > 0 || displayedInteractions.length > 0;

  const isHi = summaryLanguage === 'hi';

  const chiefComplaintText = isHi
    ? 'द्विपक्षीय जानु संधि शूल एवं प्रातःकालीन स्तब्धता (संधिवात), 8 माह से'
    : patient.chiefComplaint;

  const durationText = isHi
    ? '8 माह निरंतर (शीत ऋतु में प्रकोप)'
    : (patient.clinicalSummary.duration || '6 months');

  const severityText = isHi
    ? (patient.clinicalSummary.severity === 'Severe' ? 'तीव्र (Severe)' : 'मध्यम (Moderate)')
    : (patient.clinicalSummary.severity || 'Moderate');

  const siteText = isHi
    ? 'द्विपक्षीय जानु संधि एवं पटेला परिधि'
    : (patient.chiefComplaint.toLowerCase().includes('knee') ? 'Bilateral knee joints & patellar margins' :
       patient.chiefComplaint.toLowerCase().includes('back') ? 'Lumbosacral region (L4-S1)' :
       patient.chiefComplaint.toLowerCase().includes('acid') ? 'Epigastric & retrosternal zone' :
       'Primary presenting anatomical region');

  const onsetText = isHi
    ? 'क्रमिक एवं निरंतर प्रगतिशील, लगभग 8 माह पूर्व प्रारंभ'
    : `Gradual & progressive, noted ~${patient.clinicalSummary.duration || '6 months ago'}`;

  const characterText = isHi
    ? 'सुस्त गंभीर वेदना, जानु मोड़ने पर चटकने की आवाज (क्रेपिटस) एवं स्तब्धता'
    : (patient.chiefComplaint.toLowerCase().includes('pain') ? 'Dull aching, mechanical stiffness with joint crepitus' :
       patient.chiefComplaint.toLowerCase().includes('acid') ? 'Burning retrosternal distress and sour eructation' :
       'Persistent throbbing with functional limitation');

  const radiationText = isHi
    ? 'अ-प्रसारी; मुख्य जानु जोड़ एवं पटेला परिधि तक सीमित'
    : 'Non-radiating; localized to primary articulation / zone';

  const associationsText = isHi
    ? 'प्रातःकालीन जकड़न >45 मिनट, सीढ़ियां चढ़ने में कठिनाई, फर्श से उठने में असमर्थता'
    : 'Morning stiffness >45 mins, fatigue on climbing stairs, mild sleep disturbance';

  const timeCourseText = isHi
    ? `कालक्रम: ${patient.clinicalSummary.duration}; शाम को श्रम के पश्चात दर्द में वृद्धि`
    : `Chronicity: ${patient.clinicalSummary.duration}; worsens towards evening after physical load`;

  const exacerbatingText = isHi
    ? 'प्रकोपक: शीतल नम मौसम, अधिक चलना | उपशामक: विश्राम एवं उष्ण स्वेदन'
    : 'Worse: Cold damp weather, prolonged walking; Better: Rest & warm application';

  const severityScoreText = isHi
    ? `VAS 6/10 (${severityText}); दैनिक गतिशीलता में बाधा`
    : `VAS 6/10 (${patient.clinicalSummary.severity || 'Moderate'}); interferes with daily mobility`;

  const clinicalNotesText = isHi
    ? 'एआई नैदानिक सारांश: रोगी में शास्त्रीय संधिवात (ऑस्टियोआर्थराइटिस) के लक्षण प्रमाणित हैं। क्रेपिटस एवं प्रातःकालीन जकड़न वात प्रकोप से संबंधित हैं जो ठंड में बढ़ते हैं। रेडियोग्राफी में मीडियल कम्पार्टमेंट संकुचन देखा गया है। वात-शामक जानु बस्ति (मुरिवेन्ना तैल) एवं पत्र पिंड स्वेद चिकित्सा अनुशंसित है।'
    : (editableNotes || patient.clinicalSummary.aiGeneratedNotes);

  const handleSaveSummary = () => {
    updatePatientClinicalSummary(patient.id, {
      aiGeneratedNotes: editableNotes,
      nidana: editableNidana
    });
    setIsEditingSummary(false);
    showToast({
      type: 'success',
      title: 'Clinical Summary Updated',
      message: 'Physician edits saved to electronic dossier.'
    });
  };

  return (
    <div className="space-y-6 relative z-10">
      
      {/* Top Breadcrumb & Patient Header Card */}
      <div className="bg-white rounded-3xl border border-[#DCEAE7] shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/doctor')}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#146356] hover:text-[#0F4A40] bg-[#E4EFEC] hover:bg-[#CEF3ED] px-3.5 py-1.5 rounded-xl border border-[#9FDCD1] transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Back to Consultation Queue</span>
          </button>

          {/* Navigation/Mode actions only - No duplicate sign-off buttons */}
          <div className="flex items-center gap-2">
            {currentUser?.discipline === 'Ayurveda' && patient.careSystem === 'AYURVEDA' && (
              <button
                onClick={() => navigate('/doctor/ayurveda-view')}
                className="px-4 py-1.5 rounded-xl bg-[#146356] hover:bg-[#0F4A40] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ayurvedic Assessment</span>
              </button>
            )}


          </div>
        </div>

        {/* Patient Key Identity Strip */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pt-3 border-t border-[#DCEAE7]">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl flex-shrink-0 ${
              isAyurvedicRecord(patient)
                ? 'bg-[#CEF3ED] text-[#146356]' 
                : 'bg-[#E4EFEC] text-[#0D2B3E]'
            }`}>
              {patient.name.charAt(0)}
            </div>
            <div>
              {/* Name & Max 2 Badges: Priority + OTP Verified */}
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-[#0D2B3E]">{patient.name}</h1>
                {patient.priorityFlag && <PriorityFlag size="sm" />}
                <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E4EFEC] text-[#146356] border border-[#9FDCD1]">
                  <span>🔒</span>
                  <span>OTP Verified</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowPatientDetails(!showPatientDetails)}
                  className="text-[11px] font-semibold text-[#146356] hover:text-[#0F4A40] hover:underline cursor-pointer ml-1 inline-flex items-center gap-0.5"
                >
                  <span>{showPatientDetails ? 'Hide details' : 'Details'}</span>
                  {showPatientDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>

              {/* Inline Details & Secondary Info */}
              <p className="text-xs text-slate-500 mt-1">
                <span className="font-semibold text-slate-700">{patient.tokenNumber}</span> • {isAyurvedicRecord(patient) ? 'Ayurvedic Intake' : 'Allopathic OPD'} • {patient.age} yrs • {patient.gender} • Blood Group: <strong className="text-slate-700">{patient.bloodGroup}</strong>
              </p>

              {/* Expandable Patient Details Block */}
              {showPatientDetails && (
                <div className="p-2.5 mt-2 bg-[#F4FBF9] border border-[#DCEAE7] rounded-xl text-xs space-y-1 text-slate-600 animate-in fade-in duration-150">
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <div>ABHA ID: <span className="font-mono text-slate-800 font-semibold">{patient.abhaId || 'N/A'}</span></div>
                    <div>Workflow Status: <span className="font-semibold text-slate-800">{patient.status}</span> (OTP {patient.otp || '4829'})</div>
                    <div>Care Stream: <span className="font-semibold text-slate-800">{isAyurvedicRecord(patient) ? 'AYUSH / Ayurvedic OPD' : 'Conventional / Allopathic OPD'}</span></div>
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-700 font-medium mt-1">
                Chief Complaint: <span className="text-[#0D2B3E] font-bold">{patient.chiefComplaint}</span>
              </p>
            </div>
          </div>

          {/* Distinct Right-Aligned Block: Global Language Toggle & Vitals Strip */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2.5 pt-2 lg:pt-0">
            {/* Global Screen-Wide Language Toggle */}
            <div className="inline-flex items-center p-1 rounded-xl bg-[#F4FBF9] border border-[#DCEAE7] text-xs shadow-2xs">
              <button
                type="button"
                onClick={() => setSummaryLanguage('en')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  summaryLanguage === 'en'
                    ? 'bg-white text-[#146356] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setSummaryLanguage('hi')}
                className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  summaryLanguage === 'hi'
                    ? 'bg-white text-[#146356] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Languages className="w-3.5 h-3.5 text-[#146356]" />
                <span>हिन्दी</span>
              </button>
            </div>

            {/* Dedicated Vitals Strip Card */}
            <div className="flex items-center gap-2 p-1.5 bg-[#F4FBF9] border border-[#DCEAE7] rounded-2xl shadow-2xs">
              <div className="px-2.5 py-1 text-center border-r border-[#DCEAE7] min-w-[58px]">
                <span className="text-[10px] text-slate-500 block font-medium">BP</span>
                <span className="text-xs font-bold text-[#0D2B3E]">{patient.vitals.bp}</span>
              </div>
              <div className="px-2.5 py-1 text-center border-r border-[#DCEAE7] min-w-[58px]">
                <span className="text-[10px] text-slate-500 block font-medium">Pulse</span>
                <span className="text-xs font-bold text-[#0D2B3E]">{patient.vitals.pulse}</span>
              </div>
              <div className="px-2.5 py-1 text-center border-r border-[#DCEAE7] min-w-[58px]">
                <span className="text-[10px] text-slate-500 block font-medium">Weight</span>
                <span className="text-xs font-bold text-[#0D2B3E]">{patient.vitals.weight}</span>
              </div>
              <div className="px-2.5 py-1 text-center min-w-[58px]">
                <span className="text-[10px] text-slate-500 block font-medium">SpO2</span>
                <span className="text-xs font-bold text-[#0D2B3E]">{patient.vitals.spo2}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Segregated Tab Headers */}
        <div className="flex items-center gap-2 pt-4 border-t border-brand-border overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'summary'
                ? 'bg-brand-teal text-white shadow-soft'
                : 'text-brand-body hover:bg-brand-teal-light'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Clinical Summary (AI)</span>
          </button>

          <button
            onClick={() => setActiveTab('ayurveda_history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'ayurveda_history'
                ? 'bg-emerald-600 text-white shadow-soft'
                : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ayurveda History ({patient.ayurvedaHistory?.length || 1})</span>
          </button>

          <button
            onClick={() => setActiveTab('allopathy_history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'allopathy_history'
                ? 'bg-sky-600 text-white shadow-soft'
                : 'text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Allopathy History ({patient.allopathyHistory?.length || (patient.careSystem === 'ALLOPATHY' ? 1 : 0)})</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'reports'
                ? 'bg-brand-teal text-white shadow-soft'
                : 'text-brand-body hover:bg-brand-teal-light'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Reports & Scans ({patient.documents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'prescriptions'
                ? 'bg-brand-teal text-white shadow-soft'
                : 'text-brand-body hover:bg-brand-teal-light'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Prescription History ({patient.prescriptions.length})</span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT 1: Structured Clinical Summary (Problem Statement Standard) */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          
          {/* Top Bar with AI Clinical Synthesis Status */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Standard Structured Clinical History (PS 26047)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Discipline-neutral electronic case dossier with SOCRATES HPI analysis and systemic review
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {currentUser?.discipline === 'Ayurveda' && patient.careSystem === 'AYURVEDA' && (
                  <button
                    onClick={() => navigate('/doctor/ayurveda-view')}
                    className="px-3.5 py-1.5 rounded-xl bg-[#E4EFEC] border border-[#9FDCD1] hover:bg-[#CEF3ED] text-[#146356] text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#146356]" />
                    <span>Open Ayurvedic Assessment &rarr;</span>
                  </button>
                )}
                {isEditingSummary ? (
                  <button
                    onClick={handleSaveSummary}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-[#146356] hover:bg-[#0F4A40] text-white text-xs font-bold shadow-soft cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Edits</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditingSummary(true)}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl border border-[#DCEAE7] bg-[#F4FBF9] hover:bg-[#E4EFEC] text-[#0D2B3E] text-xs font-semibold cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Case Notes</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* CONSOLIDATED ALERT & WORKFLOW STATUS COMPONENT (Replaces 3 stacked banners) */}
          <div className={`rounded-2xl border transition-all ${
            hasSafetyFlags 
              ? 'bg-white border-[#C23B22]/40 shadow-xs border-l-4 border-l-[#C23B22]' 
              : 'bg-[#F4FBF9] border-[#DCEAE7] shadow-xs'
          }`}>
            {/* Top Summary Row - The most severe item */}
            <div 
              onClick={() => setIsAlertBannerExpanded(!isAlertBannerExpanded)}
              className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/60 transition-colors"
            >
              <div className="flex items-center gap-2.5 flex-wrap">
                {hasSafetyFlags ? (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C23B22] animate-ping" />
                    <AlertTriangle className="w-4 h-4 text-[#C23B22] flex-shrink-0" />
                    <span className="text-xs font-bold text-[#C23B22]">
                      Clinical Safety Flag: {displayedAbnormalLabs.length > 0 ? `${displayedAbnormalLabs.length} Out-of-Range Lab(s)` : ''} {displayedAbnormalLabs.length > 0 && displayedInteractions.length > 0 ? '• ' : ''}{displayedInteractions.length > 0 ? `${displayedInteractions.length} Drug-Herb Interaction(s)` : ''}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-[#C23B22] border border-rose-200 ml-1">
                      Mandatory Review
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#146356] flex-shrink-0" />
                    <span className="text-xs font-bold text-[#0D2B3E]">
                      Routine Intake Draft — Baseline Labs & Safety Screen Clear
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E4EFEC] text-[#146356] border border-[#9FDCD1] ml-1">
                      No Flags Detected
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">
                  {isAlertBannerExpanded ? 'Hide Details' : 'View Safety & Status'}
                </span>
                {isAlertBannerExpanded ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </div>
            </div>

            {/* Collapsible Content */}
            {isAlertBannerExpanded && (
              <div className="p-4 pt-2 border-t border-slate-100 space-y-3 animate-in fade-in duration-150">
                {/* Safety Flags Row (Compact when empty) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {/* 1. Out-of-Range Labs */}
                  {displayedAbnormalLabs.length > 0 ? (
                    <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100 space-y-1.5">
                      <span className="text-[11px] font-bold text-[#C23B22] block flex items-center gap-1">
                        <FlaskConical className="w-3.5 h-3.5" />
                        Out-of-Range Lab Highlights ({displayedAbnormalLabs.length})
                      </span>
                      <div className="space-y-1">
                        {displayedAbnormalLabs.map((lab, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-white px-2.5 py-1 rounded-lg border border-rose-200 text-xs">
                            <span className="font-semibold text-slate-800">{lab.parameter}:</span>
                            <span className="font-bold text-[#C23B22]">{lab.value} (High)</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-500">Ref: Fasting metabolic & renal panel</p>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D4F] flex-shrink-0" />
                      <span className="text-[11px] font-semibold text-slate-700">✓ No out-of-range labs detected</span>
                    </div>
                  )}

                  {/* 2. Drug-Herb Interaction Flag */}
                  {displayedInteractions.length > 0 ? (
                    <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-1.5">
                      <span className="text-[11px] font-bold text-amber-900 block flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                        Drug-Herb Interaction Flag ({displayedInteractions.length})
                      </span>
                      {displayedInteractions.map((inter, idx) => (
                        <div key={idx} className="space-y-1 bg-white p-2.5 rounded-lg border border-amber-200">
                          <p className="font-bold text-rose-800 text-[11px]">{inter.drugs.join(' ⇄ ')}</p>
                          <p className="text-[10px] text-amber-950 leading-tight">{inter.warning}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D4F] flex-shrink-0" />
                      <span className="text-[11px] font-semibold text-slate-700">✓ No drug-herb interactions detected</span>
                    </div>
                  )}

                  {/* 3. Allergy Cross-Check */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[11px] font-bold text-slate-800 block flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#146356]" />
                      Allergy Cross-Check
                    </span>
                    <div className="space-y-0.5">
                      {knownAllergies.map((a, idx) => (
                        <p key={idx} className="text-[11px] text-slate-700 font-medium">• {a}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sub-items: Workflow state & AI disclaimer as neutral text rows (NOT separate red/yellow banners) */}
                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span><strong>AI-Generated Draft:</strong> Physician verification required before prescription sign-off (Human-in-the-loop safeguard).</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <span>Workflow: <strong>{patient.clinicalSummary.verifiedByDoctor ? `Verified (${patient.clinicalSummary.verifiedAt || 'Today'})` : 'Pending Physician Sign-Off'}</strong></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 1. CHIEF COMPLAINT */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">1</span>
              <span>{isHi ? 'मुख्य शिकायत (Chief Complaint)' : 'Chief Complaint'}</span>
            </div>
            <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200/60">
              <p className="text-base font-bold text-slate-900">{chiefComplaintText}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-600 font-medium">{isHi ? 'अवधि:' : 'Duration:'}</span>
                <span className="text-xs font-bold text-teal-800 bg-white px-2.5 py-0.5 rounded-md border border-teal-200">
                  {durationText}
                </span>
                <span className="text-xs text-slate-600 font-medium ml-2">{isHi ? 'तीव्रता:' : 'Severity:'}</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${
                  patient.clinicalSummary.severity === 'Severe'
                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  {severityText}
                </span>
                {patient.vitals?.weight && (
                  <>
                    <span className="text-xs text-slate-600 font-medium ml-2">{isHi ? 'भार:' : 'Weight:'}</span>
                    <span className="text-xs font-bold text-slate-800 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {patient.vitals.weight}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* CONDITIONAL SECTION 2: 10-Point Dashavidha Pariksha for AYUSH vs SOCRATES for Allopathy */}
          {patient.intakeType === 'ayurveda' || patient.careSystem === 'AYURVEDA' ? (
            /* 10-POINT DASHAVIDHA PARIKSHA CARD - DISTINCT VISUAL WEIGHT & BRAND-LIGHT CONTAINER */
            <div className="bg-[#E4EFEC]/60 rounded-3xl p-6 border border-[#9FDCD1] shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#9FDCD1]/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#CEF3ED] text-[#146356] flex items-center justify-center font-bold shadow-2xs">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-[#0D2B3E]">
                        {isHi ? 'दशविध परीक्षा मूल्यांकन (Dashavidha Pariksha)' : 'Dashavidha Pariksha Assessment (10-Point AYUSH Diagnostic)'}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#CEF3ED] text-[#146356] border border-[#9FDCD1]">
                        AIIA Standard
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {isHi ? 'शास्त्रीय त्रिदोष, अग्नि, कोष्ठ एवं धातु सारता का मानकीकृत विश्लेषण' : 'Standardized Ayurvedic clinical framework assessing constitutional temperament & systemic resilience'}
                    </p>
                  </div>
                </div>

                {/* Dosha Balance Quick Strip */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Dosha:</span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
                    Vata: 70% (Aggravated)
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50/60 text-amber-800 border border-amber-200">
                    Pitta: 45% (Sub-acute)
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Kapha: 30% (Normal)
                  </span>
                </div>
              </div>

              {/* 10 Assessment Points Grid - Compact Padding */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-xs">
                {/* 1. Prakriti */}
                <div className="p-2.5 rounded-xl bg-white/95 border border-[#9FDCD1]/70 space-y-0.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-slate-500">1. Prakriti (प्रकृति)</span>
                    <span className="text-[9px] font-bold text-[#146356] bg-[#E4EFEC] px-1.5 py-0.2 rounded">Baseline</span>
                  </div>
                  <p className="font-bold text-[#0D2B3E] text-xs">Vata-Pitta (वात-पित्त)</p>
                  <p className="text-[10px] text-slate-500 leading-tight">Lean frame, reactive digestion, dry skin tendency</p>
                </div>

                {/* 2. Vikriti */}
                <div className="p-2.5 rounded-xl bg-white/95 border border-rose-200/80 space-y-0.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-[#C23B22]">2. Vikriti (विकृति)</span>
                    <span className="text-[9px] font-bold text-[#C23B22] bg-rose-50 px-1.5 py-0.2 rounded">Morbidity</span>
                  </div>
                  <p className="font-bold text-slate-900 text-xs">Vata-Kapha Vriddhi</p>
                  <p className="text-[10px] text-slate-500 leading-tight">Joint stiffness, crepitus, cold sensitivity, swelling</p>
                </div>

                {/* 3. Agni */}
                <div className="p-2.5 rounded-xl bg-white/95 border border-[#9FDCD1]/70 space-y-0.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-slate-500">3. Agni (अग्नि)</span>
                    <span className="text-[9px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded">Metabolism</span>
                  </div>
                  <p className="font-bold text-[#0D2B3E] text-xs">Vishama Agni (विषमाग्नि)</p>
                  <p className="text-[10px] text-slate-500 leading-tight">Variable hunger, episodic gas & sluggish digestion</p>
                </div>

                {/* 4. Koshtha */}
                <div className="p-2.5 rounded-xl bg-white/95 border border-[#9FDCD1]/70 space-y-0.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-slate-500">4. Koshtha (कोष्ठ)</span>
                    <span className="text-[9px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded">Bowel</span>
                  </div>
                  <p className="font-bold text-[#0D2B3E] text-xs">Krura Koshtha (क्रूर कोष्ठ)</p>
                  <p className="text-[10px] text-slate-500 leading-tight">Hard dry evacuation, responds to Triphala/Eranda</p>
                </div>

                {/* 5. Sara */}
                <div className="p-2.5 rounded-xl bg-white/95 border border-[#9FDCD1]/70 space-y-0.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-slate-500">5. Sara (सार)</span>
                    <span className="text-[9px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded">Essence</span>
                  </div>
                  <p className="font-bold text-[#0D2B3E] text-xs">{patient.ayurvedaIntake?.sara || "Madhyama Sara (Asthi)"}</p>
                </div>

                {/* 6. Samhanana */}
                <div className="p-2.5 rounded-xl bg-white/95 border border-[#9FDCD1]/70 space-y-0.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-slate-500">6. Samhanana (संहनन)</span>
                    <span className="text-[9px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded">Structure</span>
                  </div>
                  <p className="font-bold text-[#0D2B3E] text-xs">{patient.ayurvedaIntake?.samhanana || "Madhyama (मध्यम)"}</p>
                </div>

                {/* 7. Pramana */}
                <div className="p-2.5 rounded-xl bg-white/95 border border-[#9FDCD1]/70 space-y-0.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-slate-500">7. Pramana (प्रमाण)</span>
                    <span className="text-[9px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded">Body Build</span>
                  </div>
                  <p className="font-bold text-[#0D2B3E] text-xs">{patient.ayurvedaIntake?.pramana || "Madhyama"}</p>
                </div>

                {/* 8. Satmya */}
                <div className="p-2.5 rounded-xl bg-white/95 border border-[#9FDCD1]/70 space-y-0.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-slate-500">8. Satmya (सात्म्य)</span>
                    <span className="text-[9px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded">Diet Habit</span>
                  </div>
                  <p className="font-bold text-[#0D2B3E] text-xs">Madhura-Snigdha</p>
                  <p className="text-[10px] text-slate-500 leading-tight">Tolerates warm unctuous foods; cold aggravates</p>
                </div>

                {/* 9. Satva */}
                <div className="p-2.5 rounded-xl bg-white/95 border border-[#9FDCD1]/70 space-y-0.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-slate-500">9. Satva (सत्त्व)</span>
                    <span className="text-[9px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded">Resilience</span>
                  </div>
                  <p className="font-bold text-[#0D2B3E] text-xs">Madhyama Satva (मध्यम)</p>
                  <p className="text-[10px] text-slate-500 leading-tight">Compliant regimen, requires pain reassurance</p>
                </div>

                {/* 10. Vaya */}
                <div className="p-2.5 rounded-xl bg-white/95 border border-[#9FDCD1]/70 space-y-0.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-slate-500">10. Vaya (वय)</span>
                    <span className="text-[9px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded">Age Phase</span>
                  </div>
                  <p className="font-bold text-[#0D2B3E] text-xs">{patient.age} Yrs · Madhyama</p>
                  <p className="text-[10px] text-slate-500 leading-tight">Transitioning into Vata-dominant longevity phase</p>
                </div>
              </div>

              {/* Hetu Factors: Ahara & Vihara */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div className="p-2.5 rounded-xl bg-white/90 border border-amber-200/80 space-y-1 text-xs shadow-2xs">
                  <span className="font-bold text-amber-900 text-[11px] block">
                    {isHi ? 'आहारज हेतु (Ahara Hetu - Dietary Triggers):' : 'Dietary Etiological Factors (Ahara Hetu):'}
                  </span>
                  <p className="text-amber-950 text-xs leading-relaxed">
                    Ruksha (dry) and Shita (cold) food intake, irregular meal intervals, excess astringent pulses, dry snacks.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-white/90 border border-[#9FDCD1] space-y-1 text-xs shadow-2xs">
                  <span className="font-bold text-[#146356] text-[11px] block">
                    {isHi ? 'विहारज हेतु (Vihara Hetu - Lifestyle Triggers):' : 'Lifestyle Etiological Factors (Vihara Hetu):'}
                  </span>
                  <p className="text-teal-950 text-xs leading-relaxed">
                    Prajagarana (late nights), excessive prolonged standing/stair-climbing, sedentary exposure to cold draft / AC.
                  </p>
                </div>
              </div>

              {/* Physician Synthesis & Case Assessment */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {isHi ? 'चिकित्सक संश्लेषण एवं केस मूल्यांकन:' : 'Physician Synthesis & Case Assessment:'}
                </label>
                {isEditingSummary ? (
                  <textarea
                    rows={4}
                    value={editableNotes}
                    onChange={(e) => setEditableNotes(e.target.value)}
                    className="w-full p-3 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 leading-relaxed font-sans"
                  />
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 leading-relaxed">
                    {clinicalNotesText}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ALLOPATHY: SOCRATES STRUCTURED ANALYSIS CARD */
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">2</span>
                  <span>{isHi ? 'वर्तमान बीमारी का इतिहास · सोक्रेटीस विश्लेषण (SOCRATES)' : 'History of Presenting Illness (HPI) · SOCRATES Analysis'}</span>
                </div>
                <span className="text-[11px] text-teal-700 font-bold bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                  {isHi ? 'मानक नैदानिक ढांचा' : 'Standard Clinical Framework'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                    {isHi ? 'स्थान (Site)' : 'Site (Location)'}
                  </span>
                  <p className="font-bold text-slate-900 mt-1">{siteText}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                    {isHi ? 'प्रारंभ (Onset)' : 'Onset'}
                  </span>
                  <p className="font-bold text-slate-900 mt-1">{onsetText}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                    {isHi ? 'लक्षण स्वरूप (Character)' : 'Character'}
                  </span>
                  <p className="font-bold text-slate-900 mt-1">{characterText}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                    {isHi ? 'प्रसार (Radiation)' : 'Radiation'}
                  </span>
                  <p className="font-bold text-slate-900 mt-1">{radiationText}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                    {isHi ? 'सहयोगी लक्षण (Associations)' : 'Associations'}
                  </span>
                  <p className="font-bold text-slate-900 mt-1">{associationsText}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                    {isHi ? 'समय चक्र (Time / Course)' : 'Time / Course'}
                  </span>
                  <p className="font-bold text-slate-900 mt-1">{timeCourseText}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                    {isHi ? 'प्रकोपक / उपशामक (Exacerbating & Relieving)' : 'Exacerbating & Relieving'}
                  </span>
                  <p className="font-bold text-slate-900 mt-1">{exacerbatingText}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                    {isHi ? 'तीव्रता स्कोर (Severity)' : 'Severity'}
                  </span>
                  <p className="font-bold text-slate-900 mt-1">{severityScoreText}</p>
                </div>
              </div>

              {/* Physician Synthesis & Case Assessment */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {isHi ? 'चिकित्सक संश्लेषण एवं केस मूल्यांकन:' : 'Physician Synthesis & Case Assessment:'}
                </label>
                {isEditingSummary ? (
                  <textarea
                    rows={4}
                    value={editableNotes}
                    onChange={(e) => setEditableNotes(e.target.value)}
                    className="w-full p-3 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 leading-relaxed font-sans"
                  />
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 leading-relaxed">
                    {clinicalNotesText}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTIONS 3–8: PROGRESSIVE DISCLOSURE ACCORDIONS (Collapsed by Default) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* 3. Past Medical & Surgical History Accordion */}
            <div className="bg-white rounded-2xl border border-[#DCEAE7] shadow-xs overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => toggleSection('section3')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-[#E4EFEC] text-[#146356] flex items-center justify-center font-bold text-xs flex-shrink-0">3</span>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Past Medical & Surgical History</h4>
                    {!openSections.section3 && (
                      <p className="text-xs text-slate-500 mt-0.5">HTN (controlled 3 yrs), Borderline T2D · No past surgeries</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                  <span className="text-[11px] font-semibold text-[#146356]">
                    {openSections.section3 ? 'Collapse' : 'Expand'}
                  </span>
                  {openSections.section3 ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {openSections.section3 && (
                <div className="p-4 pt-2 border-t border-slate-100 space-y-2 text-xs animate-in fade-in duration-150">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Hypertension</span>
                    <span className="font-bold text-slate-900">Diagnosed 3 yrs ago · Controlled</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Type 2 Diabetes</span>
                    <span className="font-bold text-slate-900">Borderline / Diet controlled</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Past Surgeries / Procedures</span>
                    <span className="font-bold text-slate-900">None reported</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Hospitalizations</span>
                    <span className="font-bold text-slate-900">No major admissions in last 5 years</span>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Drug & Allergy History Accordion */}
            <div className="bg-white rounded-2xl border border-[#DCEAE7] shadow-xs overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => toggleSection('section4')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-[#E4EFEC] text-[#146356] flex items-center justify-center font-bold text-xs flex-shrink-0">4</span>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Drug & Allergy History</h4>
                    {!openSections.section4 && (
                      <p className="text-xs text-slate-500 mt-0.5">Amlodipine 5mg OD, Calcium+Vit D3 · NKDA</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                  <span className="text-[11px] font-semibold text-[#146356]">
                    {openSections.section4 ? 'Collapse' : 'Expand'}
                  </span>
                  {openSections.section4 ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {openSections.section4 && (
                <div className="p-4 pt-2 border-t border-slate-100 space-y-2 text-xs animate-in fade-in duration-150">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Current Active Medications</span>
                    <p className="font-bold text-slate-900 mt-1">
                      {patient.clinicalSummary.medications && patient.clinicalSummary.medications.length > 0
                        ? patient.clinicalSummary.medications.join(', ')
                        : 'Amlodipine 5mg OD, Calcium Carbonate + Vitamin D3 tab OD'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/80">
                    <span className="font-bold text-rose-800 uppercase tracking-wider text-[10px]">Documented Drug Allergies</span>
                    <p className="font-bold text-rose-900 mt-1">
                      {patient.clinicalSummary.allergies && patient.clinicalSummary.allergies.length > 0
                        ? patient.clinicalSummary.allergies.join(', ')
                        : 'No Known Drug Allergies (NKDA)'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Food / Environmental Allergies</span>
                    <span className="font-bold text-slate-900">Dust & pollen sensitivity (seasonal)</span>
                  </div>
                </div>
              )}
            </div>

            {/* 5. Family History Accordion */}
            <div className="bg-white rounded-2xl border border-[#DCEAE7] shadow-xs overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => toggleSection('section5')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-[#E4EFEC] text-[#146356] flex items-center justify-center font-bold text-xs flex-shrink-0">5</span>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Family History</h4>
                    {!openSections.section5 && (
                      <p className="text-xs text-slate-500 mt-0.5">Maternal OA & HTN · Paternal T2D</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                  <span className="text-[11px] font-semibold text-[#146356]">
                    {openSections.section5 ? 'Collapse' : 'Expand'}
                  </span>
                  {openSections.section5 ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {openSections.section5 && (
                <div className="p-4 pt-2 border-t border-slate-100 space-y-2 text-xs animate-in fade-in duration-150">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Maternal History</span>
                    <span className="font-bold text-slate-900">Osteoarthritis (Knee) & Hypertension</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Paternal History</span>
                    <span className="font-bold text-slate-900">Type 2 Diabetes Mellitus</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Autoimmune / Rheumatic</span>
                    <span className="font-bold text-slate-900">No reported rheumatoid / seronegative history</span>
                  </div>
                </div>
              )}
            </div>

            {/* 6. Personal & Social History Accordion */}
            <div className="bg-white rounded-2xl border border-[#DCEAE7] shadow-xs overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => toggleSection('section6')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-[#E4EFEC] text-[#146356] flex items-center justify-center font-bold text-xs flex-shrink-0">6</span>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Personal & Social History</h4>
                    {!openSections.section6 && (
                      <p className="text-xs text-slate-500 mt-0.5">Vegetarian diet · 6-7h sleep · Non-smoker</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                  <span className="text-[11px] font-semibold text-[#146356]">
                    {openSections.section6 ? 'Collapse' : 'Expand'}
                  </span>
                  {openSections.section6 ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {openSections.section6 && (
                <div className="p-4 pt-2 border-t border-slate-100 space-y-2 text-xs animate-in fade-in duration-150">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Diet & Nutrition</span>
                      <p className="font-bold text-slate-900 mt-0.5">Vegetarian, home-cooked</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Sleep Pattern</span>
                      <p className="font-bold text-slate-900 mt-0.5">6-7 hrs, intermittent waking</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Addictions / Tobacco</span>
                      <p className="font-bold text-slate-900 mt-0.5">Non-smoker, Non-alcoholic</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Bowel & Bladder</span>
                      <p className="font-bold text-slate-900 mt-0.5">Regular, no dysuria</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 7. Review of Systems (ROS) Accordion */}
            <div className="bg-white rounded-2xl border border-[#DCEAE7] shadow-xs overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => toggleSection('section7')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-[#E4EFEC] text-[#146356] flex items-center justify-center font-bold text-xs flex-shrink-0">7</span>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Review of Systems (ROS)</h4>
                    {!openSections.section7 && (
                      <p className="text-xs text-slate-500 mt-0.5">S1/S2 regular · Clear breath sounds · Joint crepitus present</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                  <span className="text-[11px] font-semibold text-[#146356]">
                    {openSections.section7 ? 'Collapse' : 'Expand'}
                  </span>
                  {openSections.section7 ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {openSections.section7 && (
                <div className="p-4 pt-2 border-t border-slate-100 space-y-2 text-xs animate-in fade-in duration-150">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Cardiovascular</span>
                    <span className="font-bold text-slate-900">S1 S2 heard, regular rate, no chest pain</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Respiratory</span>
                    <span className="font-bold text-slate-900">Clear vesicular breath sounds bilaterally</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Gastrointestinal</span>
                    <span className="font-bold text-slate-900">Soft, non-tender, mild fullness</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Musculoskeletal</span>
                    <span className="font-bold text-slate-900">Joint crepitus present, no erythema</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Nervous System</span>
                    <span className="font-bold text-slate-900">Alert, oriented x 3, normal reflexes</span>
                  </div>
                </div>
              )}
            </div>

            {/* 8. Prior Investigations Summary Accordion */}
            <div className="bg-white rounded-2xl border border-[#DCEAE7] shadow-xs overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => toggleSection('section8')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-[#E4EFEC] text-[#146356] flex items-center justify-center font-bold text-xs flex-shrink-0">8</span>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Prior Investigations Summary</h4>
                    {!openSections.section8 && (
                      <p className="text-xs text-slate-500 mt-0.5">{patient.documents.length} records on file · Recent Lab Baseline synced</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                  <span className="text-[11px] font-semibold text-[#146356]">
                    {openSections.section8 ? 'Collapse' : 'Expand'}
                  </span>
                  {openSections.section8 ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {openSections.section8 && (
                <div className="p-4 pt-2 border-t border-slate-100 space-y-2 text-xs animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-slate-500 font-medium">Attached files</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('reports')}
                      className="text-[#146356] font-bold text-xs hover:underline cursor-pointer"
                    >
                      View All ({patient.documents.length}) &rarr;
                    </button>
                  </div>

                  {patient.documents.length > 0 ? (
                    patient.documents.slice(0, 3).map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => setSelectedDocPreview(doc)}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between hover:bg-slate-100/70 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-3.5 h-3.5 text-[#146356] flex-shrink-0" />
                          <span className="font-bold text-slate-900 truncate">{doc.name}</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 flex-shrink-0">
                          {doc.type}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-50 text-slate-500 text-center">
                      No prior laboratory or radiology reports on file.
                    </div>
                  )}

                  <div className="p-2.5 rounded-xl bg-[#E4EFEC]/70 border border-[#9FDCD1] text-xs text-[#0D2B3E]">
                    <p className="font-bold">Recent Lab Baseline (ABDM Sync):</p>
                    <p className="text-[11px] text-[#146356] mt-0.5">
                      Hb: 12.8 g/dL • FBS: 108 mg/dL • Creatinine: 0.9 mg/dL • ESR: 22 mm/hr
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      )}


      {/* TAB CONTENT 2: Reports & Scans Gallery */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-soft space-y-6">
          <div className="flex items-center justify-between border-b border-brand-border pb-3">
            <div>
              <h3 className="text-base font-bold text-brand-heading">Uploaded Diagnostic Reports</h3>
              <p className="text-xs text-brand-muted">Scanned prescriptions, radiographic films, and blood chemistry panels</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-brand-bg border border-brand-border text-brand-heading">
              {patient.documents.length} Files Attached
            </span>
          </div>

          {patient.documents.length === 0 ? (
            <div className="py-12 text-center text-brand-muted">
              <FileText className="w-10 h-10 mx-auto text-brand-border mb-2" />
              <p className="font-semibold text-brand-heading">No past documents uploaded</p>
              <p className="text-xs">The patient did not attach scanned records during intake.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {patient.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-2xl border border-brand-border bg-brand-bg hover:border-brand-teal/60 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="p-2.5 rounded-xl bg-white text-brand-teal-dark shadow-xs">
                      <FileText className="w-5 h-5" />
                    </div>
                    <StatusBadge status={doc.status} size="sm" />
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-brand-heading truncate" title={doc.name}>
                      {doc.name}
                    </h4>
                    <p className="text-[11px] text-brand-muted mt-0.5">
                      {doc.type} • {doc.size} • Uploaded {doc.uploadDate}
                    </p>
                  </div>

                  {doc.ocrExtractedSummary && (
                    <div className="p-2.5 bg-white rounded-xl border border-brand-border text-[11px] text-brand-body leading-snug">
                      <span className="font-semibold text-brand-heading block text-[10px] uppercase text-brand-teal-dark">
                        OCR Summary:
                      </span>
                      {doc.ocrExtractedSummary}
                    </div>
                  )}

                  <DocumentLabResults labResults={doc.labResults} drugInteractions={doc.drugInteractions} className="mt-2.5" />

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-brand-border/60">
                    <button
                      onClick={() => setSelectedDocPreview(doc)}
                      className="px-3 py-1 text-xs font-semibold rounded-lg bg-white border border-brand-border hover:bg-brand-teal-light text-brand-heading flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 3: Prescription History Timeline */}
      {activeTab === 'prescriptions' && (
        <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-soft space-y-6">
          <div className="flex items-center justify-between border-b border-brand-border pb-3">
            <div>
              <h3 className="text-base font-bold text-brand-heading">Ayurvedic Formulation Timeline</h3>
              <p className="text-xs text-brand-muted">Active and completed herbal prescriptions</p>
            </div>

          </div>

          {patient.prescriptions.length === 0 ? (
            <div className="py-12 text-center text-brand-muted">
              <Clock className="w-10 h-10 mx-auto text-brand-border mb-2" />
              <p className="font-semibold text-brand-heading">No active prescriptions</p>
              <p className="text-xs">Click "Write New Prescription" to prescribe classical AYUSH medicines.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {patient.prescriptions.map((rx) => (
                <div
                  key={rx.id}
                  className="p-4 rounded-2xl border border-brand-border bg-brand-bg hover:border-brand-teal/40 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-brand-heading">{rx.medicineName}</h4>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-teal-light text-brand-teal-dark border border-brand-teal/30">
                        {rx.form}
                      </span>
                    </div>
                    <p className="text-brand-body">
                      Dosage: <strong className="text-brand-heading">{rx.dosage}</strong> • Timing: <span className="font-medium text-brand-teal-dark">{rx.timing}</span>
                    </p>
                    <p className="text-[11px] text-brand-muted">
                      Anupana (Vehicle): {rx.anupana}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-xl bg-white border border-brand-border font-bold text-brand-heading">
                      Duration: {rx.duration}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 4: Segregated Ayurveda History */}
      {activeTab === 'ayurveda_history' && (
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-soft space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Ayurveda Care Stream
                </span>
                <span className="text-xs text-brand-muted">Strictly Segregated Historical Record</span>
              </div>
              <h3 className="text-base font-bold text-brand-heading mt-1">
                Ayurvedic Consultations & Panchakarma Regimens
              </h3>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 self-start">
              {patient.ayurvedaHistory?.length || 1} Record(s) on File
            </span>
          </div>

          {/* Active OPD 10-Point Ayurvedic Assessment / Dashavidha Block */}
          {patient.ayurvedaIntake && (
            <div className="p-5 sm:p-6 rounded-3xl bg-[#F4FBF9] border-2 border-[#146356]/40 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCEAE7] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-[#146356] text-white flex items-center justify-center font-bold">
                    <Leaf className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-[#0D2B3E]">
                      Dashavidha Pariksha & 10-Point Intake Assessment
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Auto-populated from patient electronic intake questionnaire · AIIA Protocol
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#CEF3ED] text-[#146356] border border-[#9FDCD1] uppercase tracking-wider self-start sm:self-auto">
                  Live Intake Data
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                {/* 1 & 2. Concern & Region */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#DCEAE7] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#146356] tracking-wider">
                    1 & 2. Chief Concern & Anatomical Region
                  </span>
                  <p className="font-bold text-[#0D2B3E] text-sm">{patient.ayurvedaIntake.mainConcern}</p>
                  <p className="text-[11px] text-slate-500">
                    Primary Region: <strong className="text-slate-800">{patient.ayurvedaIntake.affectedRegion}</strong>
                  </p>
                </div>

                {/* 3 & 4. Prakriti & Agni */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#DCEAE7] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#146356] tracking-wider">
                    3 & 4. Deha Prakriti & Agni (Digestion)
                  </span>
                  <div className="flex items-center gap-2 flex-wrap pt-0.5">
                    <span className="px-2 py-0.5 rounded-lg bg-[#E4EFEC] text-[#146356] font-semibold text-[11px]">
                      Prakriti: {patient.ayurvedaIntake.prakriti}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-[#E4EFEC] text-[#146356] font-semibold text-[11px]">
                      Agni: {patient.ayurvedaIntake.agni}
                    </span>
                  </div>
                </div>

                {/* 5 & 6. Nidra & Vyayama */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#DCEAE7] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#146356] tracking-wider">
                    5 & 6. Nidra (Sleep) & Vyayama (Activity)
                  </span>
                  <p className="text-[11px] text-slate-700">
                    <strong>Nidra:</strong> {patient.ayurvedaIntake.nidra}
                  </p>
                  <p className="text-[11px] text-slate-700">
                    <strong>Vyayama:</strong> {patient.ayurvedaIntake.vyayama}
                  </p>
                </div>

                {/* 7. Hetu Triggers */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#DCEAE7] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#146356] tracking-wider">
                    7. Hetu (Diet & Lifestyle Triggers)
                  </span>
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {patient.ayurvedaIntake.hetu && patient.ayurvedaIntake.hetu.length > 0 ? (
                      patient.ayurvedaIntake.hetu.map((h: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-medium">
                          {h}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 italic">No specific hetu triggers identified</span>
                    )}
                  </div>
                </div>

                {/* 8. Dosha Phenotype Baseline */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#DCEAE7] md:col-span-2 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-[#146356] tracking-wider">
                    8. Dosha Phenotype Baseline
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-100">
                      <span className="text-[10px] font-bold text-purple-900 block">Vata Attributes</span>
                      <p className="text-[11px] text-purple-800 mt-0.5">
                        {patient.ayurvedaIntake.doshaBaseline.vata.join(', ') || 'None selected'}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-100">
                      <span className="text-[10px] font-bold text-amber-900 block">Pitta Attributes</span>
                      <p className="text-[11px] text-amber-800 mt-0.5">
                        {patient.ayurvedaIntake.doshaBaseline.pitta.join(', ') || 'None selected'}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
                      <span className="text-[10px] font-bold text-emerald-900 block">Kapha Attributes</span>
                      <p className="text-[11px] text-emerald-800 mt-0.5">
                        {patient.ayurvedaIntake.doshaBaseline.kapha.join(', ') || 'None selected'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 9 & 10. Cross-System Safety & Existing Conditions */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#DCEAE7] md:col-span-2 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#146356] tracking-wider block">
                        9. Cross-System Medications & Safety
                      </span>
                      <p className="text-[11px] text-slate-800 mt-1">
                        <strong>Type:</strong> {patient.ayurvedaIntake.medications.type}
                      </p>
                      {patient.ayurvedaIntake.medications.details && (
                        <p className="text-[11px] text-slate-600">
                          {patient.ayurvedaIntake.medications.details}
                        </p>
                      )}
                      {patient.ayurvedaIntake.medications.docName && (
                        <p className="text-[10px] text-emerald-700 font-semibold mt-1">
                          📄 Rx Attached: {patient.ayurvedaIntake.medications.docName}
                        </p>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#146356] tracking-wider block">
                        10. Prior Conditions & Reports (Roga Itihasa)
                      </span>
                      <p className="text-[11px] text-slate-800 mt-1">
                        {patient.ayurvedaIntake.existingConditions.join(', ') || 'None reported'}
                      </p>
                      {patient.ayurvedaIntake.priorReportName && (
                        <p className="text-[10px] text-emerald-700 font-semibold mt-1">
                          📎 Attached File: {patient.ayurvedaIntake.priorReportName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(!patient.ayurvedaHistory || patient.ayurvedaHistory.length === 0) ? (
            <div className="py-12 text-center text-brand-muted">
              <Calendar className="w-10 h-10 mx-auto text-emerald-200 mb-2" />
              <p className="font-semibold text-brand-heading">No past Ayurvedic consultations</p>
              <p className="text-xs">Initial Ayurvedic intake record will appear here upon physician sign-off.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {patient.ayurvedaHistory.map((consult) => (
                <div
                  key={consult.id}
                  className="p-5 rounded-2xl border border-emerald-100 bg-emerald-50/30 hover:border-emerald-200 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-100/60 pb-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-600 text-white shadow-xs">
                        {consult.tokenNumber}
                      </span>
                      <span className="text-xs font-bold text-brand-heading">{consult.date}</span>
                      <span className="text-[11px] text-emerald-700 font-medium px-2 py-0.5 rounded-md bg-emerald-100">
                        {consult.department}
                      </span>
                      {consult.priorityFlag && <PriorityFlag size="sm" pulse={false} />}
                    </div>
                    <span className="text-xs text-brand-muted font-medium">
                      Physician: <strong className="text-brand-heading">{consult.doctorName || 'Dr. Alok Verma, BAMS'}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-emerald-100/80 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                        Ayurvedic Nidana & Complaints
                      </span>
                      <p className="font-semibold text-brand-heading">{consult.chiefComplaint}</p>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[11px] text-brand-muted">Duration: {consult.duration}</span>
                        <span className="text-[11px] text-brand-muted">• Severity: </span>
                        <span className={`text-[11px] font-bold ${
                          consult.severity === 'Severe' ? 'text-amber-700' : 'text-emerald-700'
                        }`}>
                          {consult.severity}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-emerald-100/80 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                        Symptom Clusters & Dosha Involvement
                      </span>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {consult.symptoms.map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {consult.aiGeneratedNotes && (
                    <div className="p-3 bg-white rounded-xl border border-emerald-100/80 text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px] mb-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Ayurvedic Synthesis & Chikitsa Directive</span>
                      </div>
                      <p className="text-brand-body leading-relaxed">{consult.aiGeneratedNotes}</p>
                    </div>
                  )}

                  {consult.documents && consult.documents.length > 0 && (
                    <div className="pt-1 flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-brand-muted">Attached Lab Reports:</span>
                      <div className="flex items-center gap-2 flex-wrap">
                        {consult.documents.map((d) => (
                          <span
                            key={d.id}
                            className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg bg-white border border-emerald-200 text-emerald-800 font-medium"
                          >
                            <FileText className="w-3 h-3 text-emerald-600" />
                            {d.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 5: Segregated Allopathy History */}
      {activeTab === 'allopathy_history' && (
        <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-soft space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                  Allopathy Care Stream
                </span>
                <span className="text-xs text-brand-muted">Strictly Segregated Historical Record</span>
              </div>
              <h3 className="text-base font-bold text-brand-heading mt-1">
                Modern Medicine Encounters & Pharmacotherapy
              </h3>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 self-start">
              {patient.allopathyHistory?.length || (patient.careSystem === 'ALLOPATHY' ? 1 : 0)} Record(s) on File
            </span>
          </div>

          {(!patient.allopathyHistory || patient.allopathyHistory.length === 0) && patient.careSystem !== 'ALLOPATHY' ? (
            <div className="py-12 text-center text-brand-muted">
              <Stethoscope className="w-10 h-10 mx-auto text-sky-200 mb-2" />
              <p className="font-semibold text-brand-heading">No past allopathic consultations</p>
              <p className="text-xs">Patient has not attended an Allopathy OPD encounter at this facility.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {(patient.allopathyHistory && patient.allopathyHistory.length > 0
                ? patient.allopathyHistory
                : [
                    {
                      id: `allopathy-enc-${patient.id}`,
                      tokenNumber: patient.tokenNumber.startsWith('ALLO') ? patient.tokenNumber : `ALLO-260910-019`,
                      patientId: patient.id,
                      patientName: patient.name,
                      hospitalId: patient.hospitalId,
                      hospitalName: patient.hospitalName,
                      careSystem: 'ALLOPATHY' as const,
                      department: 'Internal Medicine / Rheumatology',
                      doctorName: 'Dr. Sunita Rao, MD (Internal Medicine)',
                      date: '2026-09-02',
                      status: 'Completed' as const,
                      chiefComplaint: 'Bilateral knee pain with early morning joint stiffness > 45 mins',
                      symptoms: ['Joint pain', 'Morning stiffness', 'Mild localized swelling'],
                      duration: '6 months',
                      severity: 'Moderate' as const,
                      hadBefore: 'Yes, recurrent episodes',
                      existingConditions: ['Essential Hypertension (Stage 1)'],
                      currentMedications: ['Amlodipine 5mg OD'],
                      knownAllergies: ['Sulfa drugs'],
                      recentTests: 'CBC, ESR (Elevated at 34 mm/hr), Serum Uric Acid (Normal 5.1 mg/dL)',
                      priorityFlag: false,
                      aiGeneratedNotes: 'Differential includes degenerative osteoarthritis versus early seronegative spondyloarthropathy. Recommended weight-bearing bilateral knee X-rays.',
                      documents: []
                    }
                  ]
              ).map((consult) => (
                <div
                  key={consult.id}
                  className="p-5 rounded-2xl border border-sky-100 bg-sky-50/30 hover:border-sky-200 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sky-100/60 pb-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-sky-600 text-white shadow-xs">
                        {consult.tokenNumber}
                      </span>
                      <span className="text-xs font-bold text-brand-heading">{consult.date}</span>
                      <span className="text-[11px] text-sky-700 font-medium px-2 py-0.5 rounded-md bg-sky-100">
                        {consult.department}
                      </span>
                    </div>
                    <span className="text-xs text-brand-muted font-medium">
                      Physician: <strong className="text-brand-heading">{consult.doctorName || 'Dr. Sunita Rao, MD'}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-sky-100/80 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-sky-800 tracking-wider">
                        Allopathic Clinical Assessment
                      </span>
                      <p className="font-semibold text-brand-heading">{consult.chiefComplaint}</p>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[11px] text-brand-muted">Duration: {consult.duration}</span>
                        <span className="text-[11px] text-brand-muted">• Severity: </span>
                        <span className={`text-[11px] font-bold ${
                          consult.severity === 'Severe' ? 'text-amber-700' : 'text-sky-700'
                        }`}>
                          {consult.severity}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-sky-100/80 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-sky-800 tracking-wider">
                        Reported Symptoms & Comorbidities
                      </span>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {consult.symptoms.map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200 text-[11px]">
                            {s}
                          </span>
                        ))}
                      </div>
                      {consult.existingConditions.length > 0 && (
                        <p className="text-[11px] text-brand-muted pt-1">
                          Comorbidities: <span className="text-brand-heading">{consult.existingConditions.join(', ')}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {consult.aiGeneratedNotes && (
                    <div className="p-3 bg-white rounded-xl border border-sky-100/80 text-xs">
                      <div className="flex items-center gap-1.5 text-sky-800 font-bold text-[11px] mb-1">
                        <Stethoscope className="w-3.5 h-3.5" />
                        <span>Physician Impression & Lab Recommendations</span>
                      </div>
                      <p className="text-brand-body leading-relaxed">{consult.aiGeneratedNotes}</p>
                    </div>
                  )}

                  {consult.recentTests && (
                    <div className="p-2.5 bg-white rounded-xl border border-sky-100/80 text-xs flex items-center gap-2">
                      <FlaskConical className="w-4 h-4 text-sky-600 flex-shrink-0" />
                      <span className="text-brand-muted text-[11px]">Recent Diagnostics:</span>
                      <span className="font-medium text-brand-heading text-[11px]">{consult.recentTests}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal for Document Preview */}
      {selectedDocPreview && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedDocPreview(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-soft-lg border border-brand-border space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <h3 className="text-sm font-bold text-brand-heading">{selectedDocPreview.name}</h3>
              <button
                onClick={() => setSelectedDocPreview(null)}
                className="p-1 rounded-lg text-brand-muted hover:bg-brand-bg"
              >
                ✕
              </button>
            </div>
            <div className="p-4 bg-brand-bg rounded-2xl border border-brand-border text-xs space-y-2">
              <p><strong>Type:</strong> {selectedDocPreview.type}</p>
              <p><strong>Size:</strong> {selectedDocPreview.size}</p>
              <p><strong>Extracted Text & Entities:</strong></p>
              <p className="text-brand-body bg-white p-3 rounded-xl border border-brand-border">
                {selectedDocPreview.ocrExtractedSummary || 'No clinical entities extracted.'}
              </p>
              <DocumentLabResults labResults={selectedDocPreview.labResults} drugInteractions={selectedDocPreview.drugInteractions} className="pt-2" />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedDocPreview(null)}
                className="px-4 py-2 rounded-xl bg-brand-teal text-white text-xs font-bold shadow-soft"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOCKED BOTTOM ACTION BAR: Human-in-the-Loop Decision Flow */}
      <div className="sticky bottom-0 z-40 bg-white/95 backdrop-blur border-t border-[#DCEAE7] -mx-4 sm:-mx-6 -mb-6 px-4 sm:px-6 py-3.5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-700">
            Physician Action Required for Token <strong className="font-mono text-slate-900">{patient.tokenNumber}</strong>
          </span>
          {isEditingSummary && (
            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Editing In-Progress
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <button
            type="button"
            onClick={() => setShowRejectModal(true)}
            className="px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-[#C23B22] text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reject / Retake Intake</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (isEditingSummary) {
                handleSaveSummary();
              } else {
                setActiveTab('summary');
                setIsEditingSummary(true);
              }
            }}
            className="px-4 py-2 rounded-xl border border-[#DCEAE7] bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-600" />
            <span>{isEditingSummary ? 'Save & Lock Notes' : 'Amend / Edit Notes'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (isEditingSummary) {
                handleSaveSummary();
              }
              updatePatientStatus(patient.id, 'Completed'); // Or Completed
              showToast({
                type: 'success',
                title: t('consultationCompleted'),
                message: 'Clinical summary verified. Patient notified to upload prescription.'
              });
              // We should probably show a success state or just redirect to dashboard
              navigate('/doctor');
            }}
            className="px-5 py-2 rounded-xl bg-[#146356] hover:bg-[#0F4A40] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>{t('completeConsultation')}</span>
          </button>
        </div>
      </div>

      {/* REJECT / RETAKE INTAKE MODAL */}
      {showRejectModal && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setShowRejectModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#DCEAE7] space-y-4 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-[#C23B22]" />
              </div>
              <div>
                <h3 className="font-bold text-[#0D2B3E] text-base">Reject / Retake Intake</h3>
                <p className="text-xs text-slate-500">Flag case sheet and return patient to triage queue</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to reject this intake dossier? The patient will be re-queued with high priority for a supervised re-assessment by clinical triage staff.
            </p>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Reason for rejection / Retake instructions:</label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Incomplete pain assessment, vitals discrepancy, need detailed Hetu evaluation..."
                className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-slate-800"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  patient.status = 'Pending';
                  setShowRejectModal(false);
                  showToast({
                    type: 'info',
                    title: 'Intake Dossier Rejected',
                    message: `Case sheet for ${patient.name} returned to triage desk with instructions.`
                  });
                  navigate('/doctor');
                }}
                className="px-4 py-2 rounded-xl bg-[#C23B22] text-white text-xs font-bold hover:bg-red-700 shadow-sm"
              >
                Confirm Rejection & Re-queue
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
