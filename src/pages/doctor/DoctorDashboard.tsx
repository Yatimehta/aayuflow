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
  UserCheck, 
  UserPlus, 
  Upload, 
  FileText, 
  Printer, 
  Copy, 
  Scale, 
  Calendar, 
  AlertCircle, 
  Mic, 
  MicOff, 
  Stethoscope, 
  X,
  FileCheck,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/StatCard';
import { PatientTable } from '../../components/PatientTable';
import { Patient, DocumentItem } from '../../types';
import confetti from 'canvas-confetti';

export const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    patients, 
    selectedHospital, 
    setActivePatientId, 
    completeIntake,
    unreadReportCount, 
    showToast,
    currentUser
  } = useApp();

  // Active Flow: null (default dashboard) | 'existing' | 'new'
  const [activeFlow, setActiveFlow] = useState<'existing' | 'new' | null>(null);

  // Existing Patient States
  const [existingSearchQuery, setExistingSearchQuery] = useState('');
  const [selectedExistingPatient, setSelectedExistingPatient] = useState<Patient | null>(null);
  const [existingAction, setExistingAction] = useState<'intake' | 'upload' | null>(null);

  // New Patient Form States
  const [newPatientData, setNewPatientData] = useState({
    name: '',
    abhaId: '',
    phone: '+91 98',
    gender: 'Male' as 'Male' | 'Female' | 'Other'
  });
  const [newPatientStep, setNewPatientStep] = useState<'create' | 'intake'>('create');

  // Shared Clinical Intake Questionnaire States (Same as Patient flow)
  const [intakeWeight, setIntakeWeight] = useState('68');
  const [intakeAge, setIntakeAge] = useState('45');
  const [intakeProblem, setIntakeProblem] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Upload Document States
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docType, setDocType] = useState<DocumentItem['type']>('Lab Report');
  const [docNotes, setDocNotes] = useState<string>('');

  // Generated Token Result View (Step 5)
  const [generatedTokenData, setGeneratedTokenData] = useState<{
    token: string;
    queueSlot: number;
    patientName: string;
    age: number;
    weight: string;
    problem: string;
    docAttached?: string;
  } | null>(null);

  // Quick Problem Chips
  const quickProblems = [
    'Bilateral Knee Joint Pain & Stiffness',
    'Chronic Acidity, Indigestion & Bloating',
    'Severe Lower Back Pain & Sciatica',
    'Persistent Cough & Breathing Discomfort',
    'Skin Allergy, Itching & Rashes'
  ];

  const totalPatients = patients.length;
  const waitingPatients = patients.filter(p => p.status === 'Processing' || p.status === 'Pending');
  const completedPatients = patients.filter(p => p.status === 'Verified');

  // Voice speech simulation/recognition
  const toggleVoiceInput = () => {
    if (!isListening) {
      setIsListening(true);
      showToast({
        type: 'info',
        title: 'Listening...',
        message: 'Please speak the primary clinical complaint.'
      });

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.lang = 'en-IN';
          recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setIntakeProblem(prev => prev ? `${prev} ${transcript}` : transcript);
            setIsListening(false);
          };
          recognition.onerror = () => {
            setIsListening(false);
          };
          recognition.start();
          return;
        } catch {
          // fallback
        }
      }

      setTimeout(() => {
        setIntakeProblem('Bilateral Knee Joint Pain & Stiffness with morning crepitus');
        setIsListening(false);
        showToast({
          type: 'success',
          title: 'Voice Transcribed',
          message: 'Speech converted to text successfully.'
        });
      }, 1600);
    } else {
      setIsListening(false);
    }
  };

  const handlePatientSelect = (p: Patient) => {
    setActivePatientId(p.id);
    navigate('/doctor/patient');
  };

  const resetFlow = () => {
    setActiveFlow(null);
    setSelectedExistingPatient(null);
    setExistingAction(null);
    setExistingSearchQuery('');
    setNewPatientData({ name: '', abhaId: '', phone: '+91 98', gender: 'Male' });
    setNewPatientStep('create');
    setIntakeWeight('68');
    setIntakeAge('45');
    setIntakeProblem('');
    setDocFile(null);
    setDocNotes('');
    setGeneratedTokenData(null);
  };

  // Submit Intake for either Existing or New Patient
  const handleIntakeSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!intakeProblem.trim()) {
      showToast({
        type: 'error',
        title: 'Primary Problem Required',
        message: 'Please enter or select a primary clinical problem.'
      });
      return;
    }

    const nextQueue = patients.length + 1;
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const token = `AYU-${yy}${mm}${dd}-${String(nextQueue).padStart(3, '0')}`;

    const targetName = selectedExistingPatient 
      ? selectedExistingPatient.name 
      : (newPatientData.name || 'Walk-in Patient');

    const targetAbha = selectedExistingPatient
      ? selectedExistingPatient.abhaId
      : (newPatientData.abhaId || `${Math.floor(10 + Math.random() * 89)}-${Math.floor(1000 + Math.random() * 8999)}-${Math.floor(1000 + Math.random() * 8999)}-${Math.floor(1000 + Math.random() * 8999)}`);

    const result = completeIntake(
      {
        id: selectedExistingPatient?.id,
        name: targetName,
        age: parseInt(intakeAge, 10) || 45,
        gender: selectedExistingPatient?.gender || newPatientData.gender || 'Male',
        phone: selectedExistingPatient?.phone || newPatientData.phone,
        abhaId: targetAbha,
        tokenNumber: token,
        chiefComplaint: intakeProblem.trim(),
        careSystem: 'AYURVEDA',
        vitals: {
          bp: '120/80 mmHg',
          pulse: '74 bpm',
          weight: `${intakeWeight} kg`,
          spo2: '99%',
          temperature: '98.4 °F'
        }
      },
      {
        'q-1': intakeProblem.trim(),
        'q-2': `Clinical intake recorded by ${currentUser?.name || 'Attending Physician'}: Weight ${intakeWeight} kg, Age ${intakeAge}y.`,
        'q-3': 'OPD Encounter'
      },
      `Intake performed by Doctor/Worker desk. Patient: ${targetName}, Problem: ${intakeProblem.trim()}`,
      'AYURVEDA'
    );

    setGeneratedTokenData({
      token,
      queueSlot: nextQueue,
      patientName: targetName,
      age: parseInt(intakeAge, 10) || 45,
      weight: `${intakeWeight} kg`,
      problem: intakeProblem.trim()
    });

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {
      // safe fallback
    }

    showToast({
      type: 'success',
      title: 'OPD Token Generated',
      message: `Token #${token} issued for ${targetName} and added to Doctor Queue.`
    });
  };

  // Submit Document Upload for Existing Patient
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedExistingPatient) return;

    const fileName = docFile ? docFile.name : `Clinical_${docType.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
    const newDoc: DocumentItem = {
      id: 'doc-' + Date.now(),
      patientId: selectedExistingPatient.id,
      name: fileName,
      type: docType,
      uploadDate: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      size: docFile ? `${(docFile.size / (1024 * 1024)).toFixed(1)} MB` : '1.4 MB',
      status: 'Verified'
    };

    // Attach to patient records
    selectedExistingPatient.documents = [newDoc, ...selectedExistingPatient.documents];

    const token = selectedExistingPatient.tokenNumber;
    const queueSlot = selectedExistingPatient.queueNumber;

    setGeneratedTokenData({
      token,
      queueSlot,
      patientName: selectedExistingPatient.name,
      age: selectedExistingPatient.age,
      weight: selectedExistingPatient.vitals?.weight || '68 kg',
      problem: selectedExistingPatient.chiefComplaint,
      docAttached: `${docType}: ${fileName}`
    });

    try {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    } catch {
      // safe fallback
    }

    showToast({
      type: 'success',
      title: 'Document Attached & Token Updated',
      message: `${fileName} linked to ${selectedExistingPatient.name} (Token #${token}).`
    });
  };

  // Matched existing patients filter
  const matchedExistingPatients = existingSearchQuery.trim()
    ? patients.filter(p => 
        p.name.toLowerCase().includes(existingSearchQuery.toLowerCase()) ||
        (p.abhaId && p.abhaId.includes(existingSearchQuery.trim())) ||
        p.phone.includes(existingSearchQuery.trim()) ||
        p.tokenNumber.toLowerCase().includes(existingSearchQuery.toLowerCase())
      )
    : patients.slice(0, 4);

  return (
    <div className="space-y-5 relative z-10">
      
      {/* 1. DISCIPLINE-NEUTRAL MINIMAL HEADER */}
      <div className="glass-card p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {currentUser?.name || 'Dr. Alok Verma'}
            </h1>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
              (currentUser?.discipline || 'Ayurveda') === 'Ayurveda'
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-blue-50 text-blue-900 border-blue-300'
            }`}>
              {currentUser?.name || 'Dr. Alok Verma'} · {currentUser?.discipline || 'Ayurveda'}
            </span>
            {unreadReportCount > 0 && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
                <span>{unreadReportCount} AI Summaries Ready</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
            <span className="font-medium text-slate-700">{selectedHospital.name}</span>
            <span>•</span>
            <span>{currentUser?.department || (currentUser?.discipline === 'Allopathy' ? 'General Medicine OPD Room 102' : 'Kayachikitsa OPD Room 104')}</span>
            <span>•</span>
            <span className="font-semibold text-slate-600">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </p>
        </div>

        {activeFlow && (
          <button
            onClick={resetFlow}
            className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-xs self-start md:self-auto"
          >
            <X className="w-3.5 h-3.5" />
            <span>Close Flow / Back to Queue</span>
          </button>
        )}
      </div>

      {/* 2. 3-4 KEY STAT NUMBERS MAX (Discipline-Neutral) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Waiting in Queue"
          value={waitingPatients.length}
          subtitle="Awaiting physician consult"
          icon={Clock}
          variant="amber"
          trend="Action required"
        />
        <StatCard
          title="Completed Today"
          value={completedPatients.length}
          subtitle="Signed off & verified"
          icon={CheckCircle2}
          variant="mint"
        />
        <StatCard
          title="AI Summaries Ready"
          value={unreadReportCount}
          subtitle="Pre-consultation dossiers"
          icon={Sparkles}
          variant="teal"
        />
        <StatCard
          title="Average Wait Time"
          value={`${selectedHospital.currentWaitMinutes} min`}
          subtitle="Current OPD throughput"
          icon={Users}
          variant="blue"
        />
      </div>


      {/* 3. STEP 1: ENTRY POINT — TWO CLEAR ACTION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* ACTION CARD 1: Existing Patient */}
        <div
          onClick={() => {
            if (activeFlow === 'existing') {
              resetFlow();
            } else {
              resetFlow();
              setActiveFlow('existing');
            }
          }}
          className={`glass-card p-6 cursor-pointer transition-all border-2 relative group flex flex-col justify-between ${
            activeFlow === 'existing'
              ? 'border-teal-500 bg-teal-50/40 shadow-md ring-2 ring-teal-500/20'
              : 'border-slate-200/80 hover:border-teal-400 hover:shadow-md'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shadow-xs">
                <UserCheck className="w-6 h-6" />
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${
                activeFlow === 'existing'
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 text-slate-700 group-hover:bg-teal-100 group-hover:text-teal-800'
              }`}>
                {activeFlow === 'existing' ? 'Active Option' : 'Select Option'}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">Existing Patient</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Lookup by <strong>ABHA ID, Mobile Number, or Name</strong> to review records, start a new clinical intake, or upload latest laboratory/prescription reports.
              </p>
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-200/70 flex items-center justify-between text-xs font-semibold text-teal-700">
            <span>Lookup Patient & Upload Reports &rarr;</span>
          </div>
        </div>

        {/* ACTION CARD 2: New Patient */}
        <div
          onClick={() => {
            if (activeFlow === 'new') {
              resetFlow();
            } else {
              resetFlow();
              setActiveFlow('new');
            }
          }}
          className={`glass-card p-6 cursor-pointer transition-all border-2 relative group flex flex-col justify-between ${
            activeFlow === 'new'
              ? 'border-teal-500 bg-teal-50/40 shadow-md ring-2 ring-teal-500/20'
              : 'border-slate-200/80 hover:border-teal-400 hover:shadow-md'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                <UserPlus className="w-6 h-6" />
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${
                activeFlow === 'new'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-700 group-hover:bg-emerald-100 group-hover:text-emerald-800'
              }`}>
                {activeFlow === 'new' ? 'Active Option' : 'Select Option'}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">New Patient</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Quickly register a new walk-in patient with <strong>Full Name & ABHA ID</strong>, proceed directly to the Clinical Intake Questionnaire, and issue an OPD Token.
              </p>
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-200/70 flex items-center justify-between text-xs font-semibold text-emerald-700">
            <span>Create New & Start Intake &rarr;</span>
          </div>
        </div>

      </div>

      {/* 4. RESULT TOKEN CARD (STEP 5 FORMAT) */}
      {generatedTokenData && (
        <div className="glass-card p-6 sm:p-8 space-y-6 border-2 border-teal-500/50 shadow-xl animate-in fade-in zoom-in-95 duration-300 bg-gradient-to-b from-white via-teal-50/20 to-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                Live OPD Encounter
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Waiting in Doctor's Queue</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedTokenData.token);
                  showToast({ type: 'info', title: 'Copied', message: `Token ${generatedTokenData.token} copied.` });
                }}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Token</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Slip</span>
              </button>
              <button
                onClick={resetFlow}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold shadow-xs hover:bg-slate-800"
              >
                Done / Back to Queue
              </button>
            </div>
          </div>

          <div className="text-center py-2 space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              OPD Consultation Token
            </p>
            <h2 className="text-4xl sm:text-5xl font-mono font-black text-slate-900 tracking-tight text-teal-700">
              {generatedTokenData.token}
            </h2>
            <div className="flex items-center justify-center gap-2 text-xs text-slate-600 pt-1">
              <span className="font-semibold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                Queue Position: Slot #{generatedTokenData.queueSlot}
              </span>
              <span>•</span>
              <span className="text-teal-700 font-bold">Estimated wait: ~10-15 mins</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">
                  {currentUser?.name || 'Dr. Alok Verma'}{currentUser?.qualification ? `, ${currentUser.qualification.split(',')[0]}` : ''}
                </p>
                <p className="text-slate-600 text-xs mt-0.5">
                  Attending Physician • {currentUser?.discipline || 'Ayurveda'} • {currentUser?.department || 'OPD Room 104'}
                </p>

              </div>
            </div>

            <span className="self-start sm:self-auto text-[11px] font-bold px-2.5 py-1 rounded-full bg-white text-teal-800 border border-teal-200 shadow-xs">
              Live Queue Verified
            </span>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Patient & Case Summary
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/90 border border-slate-200/80">
                <span className="text-slate-500 font-medium">Patient:</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{generatedTokenData.patientName}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/90 border border-slate-200/80">
                <span className="text-slate-500 font-medium">Age & Weight:</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{generatedTokenData.age}y • {generatedTokenData.weight}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/90 border border-slate-200/80">
                <span className="text-slate-500 font-medium">Complaint:</span>
                <p className="font-bold text-slate-900 text-xs mt-0.5 truncate">{generatedTokenData.problem}</p>
              </div>

              {generatedTokenData.docAttached && (
                <div className="sm:col-span-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="font-semibold text-xs">Attached Document: {generatedTokenData.docAttached}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. FLOW 1: EXISTING PATIENT SCREEN */}
      {activeFlow === 'existing' && !generatedTokenData && (
        <div className="glass-card p-6 sm:p-8 space-y-6 border border-teal-300 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-teal-600" />
                <span>Existing Patient Lookup & Records</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Search ABDM database by ABHA ID, mobile number, or name
              </p>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={existingSearchQuery}
              onChange={(e) => {
                setExistingSearchQuery(e.target.value);
                setSelectedExistingPatient(null);
                setExistingAction(null);
              }}
              placeholder="Search by ABHA ID (e.g. 45-9821-4321-7890), phone (+91 98...), or patient name..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-white font-medium text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/40 shadow-xs"
            />
          </div>

          {/* Matched Patient Selection Cards */}
          {!selectedExistingPatient && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500">
                {existingSearchQuery.trim() ? `Search results (${matchedExistingPatients.length})` : 'Recent OPD Patients:'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchedExistingPatients.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedExistingPatient(p);
                      setIntakeAge(String(p.age));
                      setIntakeProblem(p.chiefComplaint || '');
                    }}
                    className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-teal-500 hover:bg-teal-50/20 cursor-pointer transition-all shadow-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-xs">{p.name}</h4>
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {p.tokenNumber}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono">
                      ABHA: {p.abhaId || 'N/A'} • {p.age}y • {p.gender}
                    </p>
                    <p className="text-xs text-slate-700 font-medium truncate">
                      {p.chiefComplaint}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Patient Profile & Dual Action Buttons */}
          {selectedExistingPatient && (
            <div className="space-y-6 pt-2 animate-in fade-in duration-200">
              
              {/* Profile Card */}
              <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{selectedExistingPatient.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      ABHA Verified
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs mt-0.5">
                    ABHA ID: <strong className="font-mono text-slate-800">{selectedExistingPatient.abhaId}</strong> • Mobile: {selectedExistingPatient.phone}
                  </p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Age: {selectedExistingPatient.age} yrs • Gender: {selectedExistingPatient.gender} • Token: {selectedExistingPatient.tokenNumber}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedExistingPatient(null);
                    setExistingAction(null);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 underline self-start sm:self-auto"
                >
                  Change Patient
                </button>
              </div>

              {/* Two Actions on Selected Patient Profile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Action 1: Start New Intake */}
                <button
                  type="button"
                  onClick={() => setExistingAction('intake')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3.5 ${
                    existingAction === 'intake'
                      ? 'border-teal-600 bg-teal-50 shadow-md ring-2 ring-teal-500/20'
                      : 'border-slate-200 bg-white hover:border-teal-400'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Start New Intake</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Complete Clinical Intake Questionnaire (Weight, Age, Primary Problem) and generate updated token.
                    </p>
                  </div>
                </button>

                {/* Action 2: Upload Latest Document/Report */}
                <button
                  type="button"
                  onClick={() => setExistingAction('upload')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3.5 ${
                    existingAction === 'upload'
                      ? 'border-teal-600 bg-teal-50 shadow-md ring-2 ring-teal-500/20'
                      : 'border-slate-200 bg-white hover:border-teal-400'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center flex-shrink-0">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Upload Latest Document/Report</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Attach recent diagnostic PDF/scans (Lab Report, Prescription, X-Ray) with timestamp and doc type.
                    </p>
                  </div>
                </button>

              </div>

              {/* ACTION 1 VIEW: Clinical Intake Questionnaire */}
              {existingAction === 'intake' && (
                <form onSubmit={handleIntakeSubmit} className="p-5 rounded-2xl bg-white border border-teal-200 space-y-5 shadow-xs">
                  <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-teal-600" />
                      <span>Clinical Intake Questionnaire for {selectedExistingPatient.name}</span>
                    </h3>
                  </div>

                  {/* Weight */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-teal-600" />
                      <span>1. Patient Weight (kg) *</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="relative w-36">
                        <input
                          type="number"
                          required
                          min="1"
                          max="250"
                          value={intakeWeight}
                          onChange={(e) => setIntakeWeight(e.target.value)}
                          className="w-full pl-3 pr-10 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 text-xs"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">kg</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {['55', '65', '75', '85'].map(w => (
                          <button
                            key={w}
                            type="button"
                            onClick={() => setIntakeWeight(w)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                              intakeWeight === w ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {w} kg
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Age */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-teal-600" />
                      <span>2. Patient Age (years) *</span>
                    </label>
                    <div className="w-36">
                      <input
                        type="number"
                        required
                        min="1"
                        max="120"
                        value={intakeAge}
                        onChange={(e) => setIntakeAge(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 text-xs"
                      />
                    </div>
                  </div>

                  {/* Primary Problem */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-teal-600" />
                        <span>3. Primary Clinical Complaint *</span>
                      </label>
                      <button
                        type="button"
                        onClick={toggleVoiceInput}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                          isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-teal-50 text-teal-700 border border-teal-200'
                        }`}
                      >
                        {isListening ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                        <span>{isListening ? 'Listening...' : 'Voice Dictate'}</span>
                      </button>
                    </div>
                    <textarea
                      required
                      rows={3}
                      value={intakeProblem}
                      onChange={(e) => setIntakeProblem(e.target.value)}
                      placeholder="Enter primary clinical problem or symptoms..."
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 text-slate-900"
                    />
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {quickProblems.map((prob, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setIntakeProblem(prob)}
                          className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-teal-50 border border-slate-200 text-slate-700"
                        >
                          + {prob}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl btn-brand-primary text-xs font-bold shadow-sm"
                    >
                      Submit Intake & Generate OPD Token
                    </button>
                  </div>
                </form>
              )}

              {/* ACTION 2 VIEW: Upload Latest Document/Report */}
              {existingAction === 'upload' && (
                <form onSubmit={handleUploadSubmit} className="p-5 rounded-2xl bg-white border border-sky-200 space-y-4 shadow-xs">
                  <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <Upload className="w-4 h-4 text-sky-600" />
                      <span>Upload & Link Clinical Document to {selectedExistingPatient.name}</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Document Type *</label>
                      <select
                        value={docType}
                        onChange={(e) => setDocType(e.target.value as DocumentItem['type'])}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 text-xs"
                      >
                        <option value="Lab Report">Lab Diagnostic Report (Blood, Urine, Biochemistry)</option>
                        <option value="Prescription">Prescription / Medication Slip</option>
                        <option value="Diagnostic Scan">Radiology / X-Ray / USG / MRI Scan</option>
                        <option value="Discharge Summary">Discharge Summary / Referral Note</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Timestamp</label>
                      <input
                        type="text"
                        disabled
                        value={`Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-mono text-xs"
                      />
                    </div>
                  </div>

                  {/* File Selector */}
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-sky-400 bg-slate-50/50 transition-colors">
                    <input
                      type="file"
                      id="report-file-input"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setDocFile(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />
                    <label htmlFor="report-file-input" className="cursor-pointer block space-y-2">
                      <Upload className="w-8 h-8 text-sky-600 mx-auto" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          {docFile ? docFile.name : 'Choose PDF, PNG, or JPG Document to Upload'}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {docFile ? `${(docFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to attach` : 'ABDM FHIR Diagnostic Compliant Upload'}
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Upload & Update Patient OPD Token</span>
                    </button>
                  </div>
                </form>
              )}

            </div>
          )}

        </div>
      )}

      {/* 6. FLOW 2: NEW PATIENT SCREEN */}
      {activeFlow === 'new' && !generatedTokenData && (
        <div className="glass-card p-6 sm:p-8 space-y-6 border border-emerald-300 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                <span>New Patient Registration & Clinical Intake</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Register new OPD patient and proceed directly into Clinical Intake Questionnaire
              </p>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              {newPatientStep === 'create' ? 'Step 1 of 2: Demographics' : 'Step 2 of 2: Intake'}
            </span>
          </div>

          {/* Step 1: Create Patient Form */}
          {newPatientStep === 'create' && (
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (!newPatientData.name.trim()) {
                  showToast({ type: 'error', title: 'Name Required', message: 'Please enter patient full name.' });
                  return;
                }
                setNewPatientStep('intake');
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sunil Joshi"
                    value={newPatientData.name}
                    onChange={(e) => setNewPatientData({ ...newPatientData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">ABHA ID (Ayushman Card) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 14-8890-4321-7711"
                    value={newPatientData.abhaId}
                    onChange={(e) => setNewPatientData({ ...newPatientData, abhaId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98XXX XXXXX"
                    value={newPatientData.phone}
                    onChange={(e) => setNewPatientData({ ...newPatientData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Gender</label>
                  <select
                    value={newPatientData.gender}
                    onChange={(e) => setNewPatientData({ ...newPatientData, gender: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/30 shadow-xs"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end">
                <button
                  type="submit"
                  className="px-7 py-3 rounded-xl btn-brand-primary text-xs font-bold shadow-sm flex items-center gap-2"
                >
                  <span>Proceed to Clinical Intake Questionnaire</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Clinical Intake Questionnaire */}
          {newPatientStep === 'intake' && (
            <form onSubmit={handleIntakeSubmit} className="space-y-5 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-emerald-900">
                <span>Patient: <strong>{newPatientData.name}</strong> • ABHA: <span className="font-mono">{newPatientData.abhaId}</span></span>
                <button
                  type="button"
                  onClick={() => setNewPatientStep('create')}
                  className="text-xs font-bold text-emerald-800 underline"
                >
                  Edit Demographics
                </button>
              </div>

              {/* Weight */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-emerald-600" />
                  <span>1. Patient Weight (kg) *</span>
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative w-36">
                    <input
                      type="number"
                      required
                      min="1"
                      max="250"
                      value={intakeWeight}
                      onChange={(e) => setIntakeWeight(e.target.value)}
                      className="w-full pl-3 pr-10 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 text-xs"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">kg</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {['55', '65', '75', '85'].map(w => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setIntakeWeight(w)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          intakeWeight === w ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {w} kg
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Age */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>2. Patient Age (years) *</span>
                </label>
                <div className="w-36">
                  <input
                    type="number"
                    required
                    min="1"
                    max="120"
                    value={intakeAge}
                    onChange={(e) => setIntakeAge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 text-xs"
                  />
                </div>
              </div>

              {/* Primary Problem */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-emerald-600" />
                    <span>3. Primary Clinical Complaint *</span>
                  </label>
                  <button
                    type="button"
                    onClick={toggleVoiceInput}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                      isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {isListening ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                    <span>{isListening ? 'Listening...' : 'Voice Dictate'}</span>
                  </button>
                </div>
                <textarea
                  required
                  rows={3}
                  value={intakeProblem}
                  onChange={(e) => setIntakeProblem(e.target.value)}
                  placeholder="Enter primary clinical problem or symptoms..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 text-slate-900"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {quickProblems.map((prob, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setIntakeProblem(prob)}
                      className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-emerald-50 border border-slate-200 text-slate-700"
                    >
                      + {prob}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end">
                <button
                  type="submit"
                  className="px-7 py-3 rounded-xl btn-brand-primary text-xs font-bold shadow-sm"
                >
                  Submit Intake & Generate OPD Token
                </button>
              </div>
            </form>
          )}

        </div>
      )}

      {/* PRIMARY DOMINANT FOCUS AREA: Patient Queue */}
      <div className="space-y-4">
        <PatientTable
          patients={patients}
          onSelectPatient={handlePatientSelect}
          title="Today's Consultation Queue"
          subtitle="Select a patient to open their standard clinical dossier and sign off."
        />
      </div>

    </div>
  );
};

