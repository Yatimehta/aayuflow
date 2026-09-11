import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Languages
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
import { AISafetyBanner } from '../../components/AISafetyBanner';
import { PriorityFlag } from '../../components/PriorityFlag';
import { DocumentLabResults } from '../../components/DocumentLabResults';
import { DocumentItem } from '../../types';

export const DoctorPatientProfile: React.FC = () => {
  const navigate = useNavigate();
  const { patients, activePatient, setActivePatientId, updatePatientClinicalSummary, showToast, currentUser } = useApp();

  const patient = activePatient || patients[0];
  const [activeTab, setActiveTab] = useState<'summary' | 'ayurveda_history' | 'allopathy_history' | 'reports' | 'prescriptions'>('summary');
  const [summaryLanguage, setSummaryLanguage] = useState<'en' | 'hi'>('en');

  // Editable summary state
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [editableNotes, setEditableNotes] = useState(patient.clinicalSummary.aiGeneratedNotes);
  const [editableNidana, setEditableNidana] = useState(patient.clinicalSummary.nidana);

  // Document preview modal
  const [selectedDocPreview, setSelectedDocPreview] = useState<DocumentItem | null>(null);

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
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/doctor')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-muted hover:text-brand-heading"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to OPD Queue</span>
          </button>

          <div className="flex items-center gap-2">
            {currentUser?.discipline === 'Ayurveda' && patient.careSystem === 'AYURVEDA' && (
              <button
                onClick={() => navigate('/doctor/ayurveda-view')}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-teal-700 hover:from-amber-700 hover:to-teal-800 text-white text-xs font-bold shadow-soft transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ayurvedic Assessment</span>
              </button>
            )}

            <button
              onClick={() => navigate('/doctor/verify')}
              className="px-3.5 py-1.5 rounded-xl border border-brand-teal text-brand-teal-dark hover:bg-brand-teal-light text-xs font-bold transition-colors"
            >
              Verify & Sign Off
            </button>
            <button
              onClick={() => navigate('/doctor/consultation')}
              className="px-4 py-1.5 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white text-xs font-bold shadow-soft transition-all flex items-center gap-1.5"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Consultation & Rx</span>
            </button>
          </div>
        </div>

        {/* Patient Key Identity Strip */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2 border-t border-brand-border/60">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl flex-shrink-0 ${
              patient.careSystem === 'AYURVEDA' 
                ? 'bg-brand-teal-light text-brand-teal-dark' 
                : 'bg-brand-blue-light text-brand-blue-dark'
            }`}>
              {patient.name.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-brand-heading">{patient.name}</h1>
                <span className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded-md border ${
                  patient.careSystem === 'AYURVEDA' 
                    ? 'text-brand-teal-dark bg-brand-teal-light border-brand-teal/30' 
                    : 'text-brand-blue-dark bg-brand-blue-light border-brand-blue/30'
                }`}>
                  {patient.tokenNumber}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  patient.careSystem === 'AYURVEDA'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-sky-50 text-sky-700 border border-sky-200'
                }`}>
                  {patient.careSystem || 'AYURVEDA'}
                </span>
                {patient.priorityFlag && <PriorityFlag size="sm" />}
                <StatusBadge status={patient.status} size="sm" />
              </div>
              <p className="text-xs text-brand-muted mt-1">
                {patient.age} yrs • {patient.gender} • Blood Group: <strong>{patient.bloodGroup}</strong> • ABHA: <span className="font-mono">{patient.abhaId || 'N/A'}</span>
              </p>
              <p className="text-xs text-brand-body font-medium mt-1">
                Chief Complaint: <span className="text-brand-heading">{patient.chiefComplaint}</span>
              </p>
            </div>
          </div>

          {/* Vitals Quick Pills */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <div className="p-2.5 rounded-xl bg-brand-bg border border-brand-border text-center min-w-[70px]">
              <span className="text-[10px] text-brand-muted block">BP</span>
              <span className="text-xs font-bold text-brand-heading">{patient.vitals.bp}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-brand-bg border border-brand-border text-center min-w-[70px]">
              <span className="text-[10px] text-brand-muted block">Pulse</span>
              <span className="text-xs font-bold text-brand-heading">{patient.vitals.pulse}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-brand-bg border border-brand-border text-center min-w-[70px]">
              <span className="text-[10px] text-brand-muted block">Weight</span>
              <span className="text-xs font-bold text-brand-heading">{patient.vitals.weight}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-brand-bg border border-brand-border text-center min-w-[70px]">
              <span className="text-[10px] text-brand-muted block">SpO2</span>
              <span className="text-xs font-bold text-brand-heading">{patient.vitals.spo2}</span>
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
                {/* Bilingual Output Toggle (PS Module C) */}
                <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setSummaryLanguage('en')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      summaryLanguage === 'en'
                        ? 'bg-white text-teal-800 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setSummaryLanguage('hi')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                      summaryLanguage === 'hi'
                        ? 'bg-white text-teal-800 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Languages className="w-3 h-3 text-teal-600" />
                    <span>हिंदी (Hindi)</span>
                  </button>
                </div>

                {currentUser?.discipline === 'Ayurveda' && patient.careSystem === 'AYURVEDA' && (
                  <button
                    onClick={() => navigate('/doctor/ayurveda-view')}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Open Ayurvedic Assessment &rarr;</span>
                  </button>
                )}
                {isEditingSummary ? (
                  <button
                    onClick={handleSaveSummary}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-soft"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Edits</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditingSummary(true)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white text-slate-700 text-xs font-semibold"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Case Notes</span>
                  </button>
                )}
              </div>
            </div>

            {/* Verification Status Banner */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {patient.clinicalSummary.verifiedByDoctor ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                )}
                <span className="font-semibold text-slate-800">
                  {patient.clinicalSummary.verifiedByDoctor
                    ? `Verified by ${currentUser?.name || 'Attending Physician'} (${patient.clinicalSummary.verifiedAt || 'Today'})`
                    : 'Pending Physician Sign-Off'}
                </span>
              </div>
              <button
                onClick={() => navigate('/doctor/verify')}
                className="text-teal-700 font-bold hover:underline"
              >
                Review & Sign &rarr;
              </button>
            </div>
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

          {/* 2. HISTORY OF PRESENTING ILLNESS (HPI) — SOCRATES Structured Analysis */}
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

          {/* 3 & 4. PAST MEDICAL/SURGICAL HISTORY & DRUG/ALLERGY HISTORY */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* 3. Past Medical & Surgical History */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">3</span>
                <span>Past Medical & Surgical History</span>
              </div>

              <div className="space-y-2.5 text-xs">
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
            </div>

            {/* 4. Drug & Allergy History */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">4</span>
                <span>Drug & Allergy History</span>
              </div>

              <div className="space-y-2.5 text-xs">
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
            </div>

          </div>

          {/* 5 & 6. FAMILY HISTORY & PERSONAL/SOCIAL HISTORY */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* 5. Family History */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">5</span>
                <span>Family History</span>
              </div>

              <div className="space-y-2 text-xs">
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
            </div>

            {/* 6. Personal & Social History */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">6</span>
                <span>Personal & Social History</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Diet & Nutrition</span>
                  <p className="font-bold text-slate-900 mt-0.5">Vegetarian, home-cooked</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Sleep Pattern</span>
                  <p className="font-bold text-slate-900 mt-0.5">6-7 hrs, intermittent waking</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Addictions / Tobacco</span>
                  <p className="font-bold text-slate-900 mt-0.5">Non-smoker, Non-alcoholic</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Bowel & Bladder</span>
                  <p className="font-bold text-slate-900 mt-0.5">Regular, no nocturnal dysuria</p>
                </div>
              </div>
            </div>

          </div>

          {/* 7 & 8. REVIEW OF SYSTEMS (ROS) & PRIOR INVESTIGATIONS SUMMARY */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* 7. Review of Systems (ROS) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">7</span>
                <span>Review of Systems (ROS)</span>
              </div>

              <div className="space-y-2 text-xs">
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
                  <span className="font-bold text-slate-900">Soft, non-tender, mild postprandial fullness</span>
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
            </div>

            {/* 8. Prior Investigations Summary */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">8</span>
                  <span>Prior Investigations Summary</span>
                </div>
                <button
                  onClick={() => setActiveTab('reports')}
                  className="text-teal-700 font-bold text-xs hover:underline"
                >
                  View All ({patient.documents.length}) &rarr;
                </button>
              </div>

              <div className="space-y-2 text-xs">
                {patient.documents.length > 0 ? (
                  patient.documents.slice(0, 3).map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDocPreview(doc)}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between hover:bg-slate-100/70 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <FileText className="w-4 h-4 text-teal-700 flex-shrink-0" />
                        <span className="font-bold text-slate-900 truncate">{doc.name}</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 flex-shrink-0">
                        {doc.type}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 text-slate-500 text-center">
                    No prior laboratory or radiology reports on file.
                  </div>
                )}

                <div className="p-3 rounded-xl bg-teal-50/50 border border-teal-200/60 text-xs text-teal-900">
                  <p className="font-bold">Recent Lab Baseline (ABDM Sync):</p>
                  <p className="text-[11px] text-teal-800 mt-1">
                    Hb: 12.8 g/dL • Fasting Blood Sugar: 108 mg/dL • Serum Creatinine: 0.9 mg/dL • ESR: 22 mm/hr
                  </p>
                </div>
              </div>
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
            <button
              onClick={() => navigate('/doctor/consultation')}
              className="px-3.5 py-1.5 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white text-xs font-bold shadow-soft"
            >
              + Write New Prescription
            </button>
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
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-soft-lg border border-brand-border space-y-4">
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

    </div>
  );
};
