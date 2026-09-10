import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Hospital as HospitalIcon,
  User,
  UserPlus,
  Search,
  CheckCircle2,
  Mic,
  MicOff,
  Send,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  FileText,
  Languages,
  Check,
  Printer,
  Copy,
  Clock,
  ChevronRight,
  Stethoscope,
  Volume2,
  Leaf,
  ShieldAlert,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { Stepper } from '../../components/Stepper';
import { FileUploadZone } from '../../components/FileUploadZone';
import { ChatBubble } from '../../components/ChatBubble';
import { StatusBadge } from '../../components/StatusBadge';
import { VoiceInput } from '../../components/VoiceInput';
import { AISafetyBanner } from '../../components/AISafetyBanner';
import { PriorityFlag } from '../../components/PriorityFlag';
import { 
  MOCK_LANGUAGES, 
  MOCK_CLINICAL_QUESTIONS, 
  INITIAL_CHAT_MESSAGES 
} from '../../data/mockData';
import { DocumentItem, IntakeChatMessage, Patient, CareSystem } from '../../types';
import { getTranslation } from '../../utils/translations';

export const PatientPortal: React.FC = () => {
  const navigate = useNavigate();
  const { 
    hospitals, 
    selectedHospital, 
    setSelectedHospital, 
    patients, 
    addPatient, 
    completeIntake,
    setActivePatientId,
    showToast 
  } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Hospital state
  const [hospitalSearch, setHospitalSearch] = useState('');

  // Step 2: Patient type & details
  const [patientMode, setPatientMode] = useState<'new' | 'existing'>('new');
  const [existingSearchPhone, setExistingSearchPhone] = useState('');
  const [foundPatient, setFoundPatient] = useState<Patient | null>(null);

  // Form fields for new patient
  const [formData, setFormData] = useState({
    name: 'Yashwardhan Mehta',
    age: '46',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    phone: '+91 98201 54321',
    abhaId: '14-8890-4321-7711',
    address: 'Near Shanti Kunj, New Delhi',
    bloodGroup: 'B+',
    chiefComplaint: 'Bilateral Joint Stiffness & Morning Knee Discomfort'
  });

  // Step 3: Generated Token
  const [currentToken, setCurrentToken] = useState<string>('AYU-260910-018');
  const [currentQueueNo, setCurrentQueueNo] = useState<number>(12);

  // Step 4: Care Stream Selection
  const [selectedCareSystem, setSelectedCareSystem] = useState<CareSystem>('AYURVEDA');

  const handleSelectCareSystem = (system: CareSystem) => {
    setSelectedCareSystem(system);
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const dateStr = `${yy}${mm}${dd}`;
    const prefix = system === 'AYURVEDA' ? 'AYU' : 'ALLO';
    setCurrentToken(`${prefix}-${dateStr}-0${currentQueueNo}`);
  };

  // Step 5: Language selection
  const [selectedLang, setSelectedLang] = useState('hi');

  // Step 6: Documents
  const [uploadedDocs, setUploadedDocs] = useState<DocumentItem[]>([]);

  // Step 7: Conversational Intake
  const [chatMessages, setChatMessages] = useState<IntakeChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [chatInput, setChatInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceSpeechFeedback, setVoiceSpeechFeedback] = useState('');

  // Step 8: Deterministic Clinical Questionnaire
  const [questionnaireIndex, setQuestionnaireIndex] = useState(0);
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({
    'q-1': 'Joint Pain & Stiffness (Sandhivata)',
    'q-2': 'Swelling, tenderness & joint crepitus',
    'q-3': '6 months to 2 years ago',
    'q-4': 'Moderate (Interferes with work, sleep, or walking)',
    'q-5': 'Yes, occurs seasonally (e.g. in winter or rainy season)',
    'q-6': 'Hypertension (High Blood Pressure)',
    'q-7': 'Daily allopathic prescription medications',
    'q-8': 'No known drug or food allergies',
    'q-9': 'Radiography / X-Ray / MRI scan in last 6 months',
    'q-10': 'Experiencing high morning stiffness; requires warm mustard oil massage before mobility.'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isHindi = selectedLang === 'hi';
  const stepsList = [
    { id: 1, title: getTranslation('step1_title', selectedLang), shortTitle: isHindi ? 'अस्पताल' : 'Hospital' },
    { id: 2, title: getTranslation('step2_title', selectedLang), shortTitle: isHindi ? 'रजिस्ट्रेशन' : 'Details' },
    { id: 3, title: getTranslation('step3_title', selectedLang), shortTitle: isHindi ? 'टोकन' : 'Token' },
    { id: 4, title: 'Care Stream', shortTitle: isHindi ? 'चिकित्सा' : 'Stream' },
    { id: 5, title: getTranslation('step5_title', selectedLang), shortTitle: isHindi ? 'भाषा' : 'Language' },
    { id: 6, title: getTranslation('step4_title', selectedLang), shortTitle: isHindi ? 'दस्तावेज़' : 'Docs' },
    { id: 7, title: getTranslation('step6_title', selectedLang), shortTitle: isHindi ? 'शिकायत' : 'Voice' },
    { id: 8, title: getTranslation('step7_title', selectedLang), shortTitle: isHindi ? 'प्रश्नावली' : 'Form' },
    { id: 9, title: getTranslation('step8_title', selectedLang), shortTitle: isHindi ? 'समीक्षा' : 'Review' },
    { id: 10, title: getTranslation('step9_title', selectedLang), shortTitle: isHindi ? 'जारी' : 'Ready' }
  ];

  // Voice simulation logic
  const toggleListening = () => {
    if (!isListening) {
      setIsListening(true);
      setVoiceSpeechFeedback('Listening... Please speak in Hindi, English, or your chosen language');

      const phrases = [
        "Mujhe dono ghutno mein subah uthte hi bahut dard aur akdan rehti hai.",
        "I have persistent knee joint stiffness especially during cold mornings.",
        "Khaane ke baad pet bhari rehta hai aur gas banti hai."
      ];
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

      setTimeout(() => {
        setChatInput(randomPhrase);
        setIsListening(false);
        setVoiceSpeechFeedback('Voice converted to text via AYUSH Multilingual ASR');
      }, 2500);
    } else {
      setIsListening(false);
      setVoiceSpeechFeedback('');
    }
  };

  const handleSendChat = (textToSend?: string) => {
    const text = textToSend || chatInput;
    if (!text.trim()) return;

    const userMsg: IntakeChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: text.trim(),
      timestamp: 'Just now'
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setVoiceSpeechFeedback('');

    // AI reply simulation
    setTimeout(() => {
      const aiReplies: IntakeChatMessage[] = [
        {
          id: 'msg-ai-' + Date.now(),
          sender: 'ai',
          text: `Thank you. I have logged that you experience "${text.trim()}". Does the pain increase during colder weather or prolonged sitting?`,
          timestamp: 'Just now',
          options: ['Yes, severe in cold & rainy season', 'No, remains constant', 'Worse during stair climbing']
        }
      ];
      setChatMessages(prev => [...prev, ...aiReplies]);
    }, 900);
  };

  const handleExistingSearch = () => {
    const found = patients.find(p => p.phone.includes(existingSearchPhone) || p.tokenNumber.toLowerCase() === existingSearchPhone.toLowerCase());
    if (found) {
      setFoundPatient(found);
      setCurrentToken(found.tokenNumber);
      setCurrentQueueNo(found.queueNumber);
      if (found.careSystem) setSelectedCareSystem(found.careSystem);
      setFormData({
        name: found.name,
        age: String(found.age),
        gender: found.gender,
        phone: found.phone,
        abhaId: found.abhaId || '',
        address: found.address,
        bloodGroup: found.bloodGroup,
        chiefComplaint: found.chiefComplaint
      });
      showToast({
        type: 'success',
        title: 'Patient Record Found',
        message: `Loaded record for ${found.name} (${found.tokenNumber})`
      });
    } else {
      showToast({
        type: 'error',
        title: 'Not Found',
        message: 'No patient matches this phone number or token. You can register as New Patient.'
      });
    }
  };

  const handleFinalSubmit = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const { patient: newPat } = completeIntake(
        {
          name: formData.name,
          age: parseInt(formData.age, 10) || 45,
          gender: formData.gender,
          phone: formData.phone,
          abhaId: formData.abhaId,
          address: formData.address,
          bloodGroup: formData.bloodGroup,
          chiefComplaint: questionAnswers['q-1'] || formData.chiefComplaint,
          preferredLanguage: MOCK_LANGUAGES.find(l => l.code === selectedLang)?.name || 'Hindi',
          careSystem: selectedCareSystem,
          documents: uploadedDocs
        },
        questionAnswers,
        undefined,
        selectedCareSystem
      );

      setCurrentToken(newPat.tokenNumber);
      setCurrentQueueNo(newPat.queueNumber);
      setActivePatientId(newPat.id);
      setCurrentStep(10);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // safe fallback
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-6 sm:py-10 relative z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Step Indicator Header */}
        <div className="mb-6">
          <Stepper
            steps={stepsList}
            currentStep={currentStep}
            onStepClick={(s) => {
              if (s < currentStep) setCurrentStep(s);
            }}
          />
        </div>

        {/* Wizard Container Card */}
        <div className="glass-card bg-white/85 p-6 sm:p-8 relative shadow-xl">
          
          {/* STEP 1: Select Hospital */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="border-b border-brand-border pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-dark bg-brand-teal-light px-2.5 py-1 rounded-full">
                  Step 1 of 8
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-heading mt-2">
                  Select AYUSH Hospital or OPD Center
                </h2>
                <p className="text-xs sm:text-sm text-brand-body mt-1">
                  Choose your preferred Ayurveda or Homoeopathy hospital to begin check-in and queue token generation.
                </p>
              </div>

              {/* Search Hospital */}
              <div className="relative">
                <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={hospitalSearch}
                  onChange={(e) => setHospitalSearch(e.target.value)}
                  placeholder="Search hospital name, city, or institute..."
                  className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
                />
              </div>

              {/* Hospital Card Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hospitals
                  .filter(h => h.name.toLowerCase().includes(hospitalSearch.toLowerCase()) || h.city.toLowerCase().includes(hospitalSearch.toLowerCase()))
                  .map((hosp) => {
                    const isSelected = selectedHospital.id === hosp.id;
                    return (
                      <div
                        key={hosp.id}
                        onClick={() => setSelectedHospital(hosp)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-brand-teal bg-brand-teal-light/30 shadow-soft'
                            : 'border-brand-border hover:border-brand-teal/40 bg-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <span className="p-2 rounded-xl bg-brand-teal-light text-brand-teal-dark">
                                <HospitalIcon className="w-4 h-4" />
                              </span>
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-bg text-brand-body border border-brand-border">
                                {hosp.category}
                              </span>
                            </div>
                            {isSelected && (
                              <div className="w-6 h-6 rounded-full bg-brand-teal text-white flex items-center justify-center">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                            )}
                          </div>

                          <h3 className="text-sm font-bold text-brand-heading mt-3 leading-snug">
                            {hosp.name}
                          </h3>
                          <p className="text-xs text-brand-muted mt-0.5">
                            {hosp.location}, {hosp.city}, {hosp.state}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-brand-border/60 flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1 text-brand-teal-dark font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            {hosp.currentWaitMinutes} min est. wait
                          </span>
                          <span className="text-brand-muted">
                            {hosp.activeDoctors} Doctors Active
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Next Step CTA */}
              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white text-xs font-bold shadow-soft transition-all"
                >
                  <span>Continue with {selectedHospital.city} OPD</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Create / Existing Patient Toggle */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="border-b border-brand-border pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-dark bg-brand-teal-light px-2.5 py-1 rounded-full">
                  Step 2 of 8
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-heading mt-2">
                  Patient Identification & Registration
                </h2>
                <p className="text-xs sm:text-sm text-brand-body mt-1">
                  Check in as an existing OPD patient with your mobile number or register as a new patient.
                </p>
              </div>

              {/* Mode Toggle Tabs */}
              <div className="flex rounded-2xl bg-brand-bg p-1 border border-brand-border max-w-sm">
                <button
                  onClick={() => setPatientMode('new')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    patientMode === 'new'
                      ? 'bg-white text-brand-heading shadow-soft'
                      : 'text-brand-muted hover:text-brand-heading'
                  }`}
                >
                  New Patient
                </button>
                <button
                  onClick={() => setPatientMode('existing')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    patientMode === 'existing'
                      ? 'bg-white text-brand-heading shadow-soft'
                      : 'text-brand-muted hover:text-brand-heading'
                  }`}
                >
                  Search Existing Patient
                </button>
              </div>

              {/* Existing Patient Search Form */}
              {patientMode === 'existing' ? (
                <div className="p-5 rounded-2xl bg-brand-bg border border-brand-border space-y-4">
                  <p className="text-xs font-semibold text-brand-heading">
                    Enter Mobile Number or Token ID (e.g. +91 98112 34567 or AYU-1042):
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={existingSearchPhone}
                      onChange={(e) => setExistingSearchPhone(e.target.value)}
                      placeholder="Enter mobile number or token..."
                      className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-brand-border bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
                    />
                    <button
                      onClick={handleExistingSearch}
                      className="px-4 py-2.5 rounded-xl bg-brand-heading text-white text-xs font-bold hover:bg-slate-700"
                    >
                      Lookup
                    </button>
                  </div>

                  {foundPatient && (
                    <div className="p-4 rounded-xl bg-brand-teal-light/40 border border-brand-teal/40 mt-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-brand-heading">{foundPatient.name}</span>
                        <StatusBadge status={foundPatient.status} size="sm" />
                      </div>
                      <p className="text-xs text-brand-muted">
                        Token: {foundPatient.tokenNumber} • Phone: {foundPatient.phone} • Age: {foundPatient.age}
                      </p>
                      <p className="text-xs text-brand-body font-medium">
                        Complaint: {foundPatient.chiefComplaint}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* New Patient Form */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-heading mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-heading mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-heading mb-1">
                      Age & Gender *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="w-24 px-3 py-2 text-xs rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
                        placeholder="Age"
                      />
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
                      >
                        <option value="Male">Male (पुरुष)</option>
                        <option value="Female">Female (स्त्री)</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-heading mb-1">
                      ABHA ID / Ayushman Card (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.abhaId}
                      onChange={(e) => setFormData({ ...formData, abhaId: e.target.value })}
                      placeholder="e.g. 14-8890-4321-7711"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-brand-heading mb-1">
                      Primary Health Complaint (Brief)
                    </label>
                    <input
                      type="text"
                      value={formData.chiefComplaint}
                      onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                      placeholder="e.g. Joint pain, chronic acidity, respiratory allergy..."
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
                    />
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="pt-4 border-t border-brand-border flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-brand-muted hover:text-brand-heading hover:bg-brand-bg"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white text-xs font-bold shadow-soft transition-all"
                >
                  <span>Generate OPD Token</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Patient Identification & Token Card */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="border-b border-brand-border pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-dark bg-brand-teal-light px-2.5 py-1 rounded-full">
                  Step 3 of 8
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-heading mt-2">
                  OPD Token & Queue Slip
                </h2>
                <p className="text-xs sm:text-sm text-brand-body mt-1">
                  Your token has been generated. Show this digital token at the AYUSH OPD intake counter or continue self-intake.
                </p>
              </div>

              {/* Prominent Token Card */}
              <div className="max-w-md mx-auto rounded-3xl border-2 border-brand-teal bg-gradient-to-b from-brand-teal-light/50 via-white to-brand-blue-light/30 p-6 sm:p-8 shadow-soft-lg text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal text-white text-xs font-bold shadow-soft">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Verified OPD Slot</span>
                </div>

                <div>
                  <p className="text-xs text-brand-muted uppercase tracking-wider font-semibold">Your Token Number</p>
                  <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-heading tracking-tight font-mono text-brand-teal-dark mt-1">
                    {currentToken}
                  </h1>
                </div>

                <div className="p-3 bg-white rounded-2xl border border-brand-border/80 shadow-xs space-y-1.5 text-xs text-left">
                  <div className="flex justify-between">
                    <span className="text-brand-muted">Patient:</span>
                    <span className="font-bold text-brand-heading">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-muted">OPD Queue Position:</span>
                    <span className="font-bold text-brand-teal-dark">#{currentQueueNo} (Approx 15 mins)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-muted">Hospital:</span>
                    <span className="font-medium text-brand-heading truncate max-w-[200px]">{selectedHospital.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-muted">ABHA ID:</span>
                    <span className="font-mono text-brand-body">{formData.abhaId || 'Linked to Mobile'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(currentToken);
                      showToast({ type: 'info', title: 'Token Copied', message: `Token ${currentToken} copied to clipboard.` });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-brand-border bg-white hover:bg-brand-bg text-xs font-medium text-brand-heading shadow-xs"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Token</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-brand-border bg-white hover:bg-brand-bg text-xs font-medium text-brand-heading shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Slip</span>
                  </button>
                </div>
              </div>

              {/* Next Step CTA */}
              <div className="pt-4 border-t border-brand-border flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-brand-muted hover:text-brand-heading hover:bg-brand-bg"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white text-xs font-bold shadow-soft transition-all"
                >
                  <span>Proceed to Select Care Stream</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Care Stream Selection (Ayurveda vs Allopathy) */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="border-b border-brand-border pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-dark bg-brand-teal-light px-2.5 py-1 rounded-full">
                  Step 4 of 9
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-heading mt-2">
                  Select Your Care Stream (चिकित्सा पद्धति)
                </h2>
                <p className="text-xs sm:text-sm text-brand-body mt-1">
                  Choose between classical Ayurvedic holistic treatment or modern Allopathic clinical care. Your records and consultation history will remain strictly segregated.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Ayurveda Card */}
                <div
                  onClick={() => handleSelectCareSystem('AYURVEDA')}
                  className={`relative p-6 rounded-3xl border-2 cursor-pointer transition-all ${
                    selectedCareSystem === 'AYURVEDA'
                      ? 'border-emerald-600 bg-emerald-50/40 shadow-soft-lg ring-2 ring-emerald-500/20'
                      : 'border-brand-border bg-white hover:border-emerald-300 hover:bg-emerald-50/10'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                      <Leaf className="w-6 h-6" />
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      selectedCareSystem === 'AYURVEDA'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {selectedCareSystem === 'AYURVEDA' ? 'Selected Stream' : 'Select Ayurveda'}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-brand-heading">Ayurveda Care Stream</h3>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-200/60 text-emerald-900">
                        AYU-PREFIX
                      </span>
                    </div>
                    <p className="text-xs italic text-emerald-800 font-serif">
                      "सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः"
                    </p>
                    <p className="text-xs text-brand-body leading-relaxed">
                      Holistic healing addressing root cause imbalances through Tridosha diagnosis (Vata, Pitta, Kapha), Agni assessment, classical Panchakarma therapies, and herbal formulations.
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-emerald-200/50 space-y-2">
                    <p className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider">Features & Protocols:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {['Prakriti Assessment', 'Nadi Pariksha', 'Panchakarma', 'Herbo-Mineral Formulations', 'Digital Twin Silhouette'].map((tag, i) => (
                        <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white border border-emerald-200 text-emerald-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Allopathy Card */}
                <div
                  onClick={() => handleSelectCareSystem('ALLOPATHY')}
                  className={`relative p-6 rounded-3xl border-2 cursor-pointer transition-all ${
                    selectedCareSystem === 'ALLOPATHY'
                      ? 'border-sky-600 bg-sky-50/40 shadow-soft-lg ring-2 ring-sky-500/20'
                      : 'border-brand-border bg-white hover:border-sky-300 hover:bg-sky-50/10'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shadow-xs">
                      <Stethoscope className="w-6 h-6" />
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      selectedCareSystem === 'ALLOPATHY'
                        ? 'bg-sky-600 text-white'
                        : 'bg-sky-100 text-sky-800'
                    }`}>
                      {selectedCareSystem === 'ALLOPATHY' ? 'Selected Stream' : 'Select Allopathy'}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-brand-heading">Allopathy Care Stream</h3>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-200/60 text-sky-900">
                        ALLO-PREFIX
                      </span>
                    </div>
                    <p className="text-xs italic text-sky-800 font-serif">
                      "Evidence-Based Modern Clinical Medicine"
                    </p>
                    <p className="text-xs text-brand-body leading-relaxed">
                      Conventional medical management, symptom control, laboratory diagnostics, diagnostic imaging, and evidence-guided pharmaceuticals administered by specialist physicians.
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-sky-200/50 space-y-2">
                    <p className="text-[11px] font-bold text-sky-900 uppercase tracking-wider">Features & Protocols:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {['Specialist OPD', 'Pathology & Lab Tests', 'Radiology Scans', 'Evidence Pharmacotherapy', 'Acute Care Triage'].map((tag, i) => (
                        <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white border border-sky-200 text-sky-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Token Notice */}
              <div className="p-4 rounded-2xl bg-brand-bg border border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-brand-muted">Assigned Visit Token:</span>
                  <span className="font-mono text-sm font-extrabold text-brand-teal-dark bg-white px-3 py-1 rounded-xl border border-brand-border shadow-xs">
                    {currentToken}
                  </span>
                </div>
                <span className="text-xs font-semibold text-brand-body">
                  Active Care Stream: <strong className={selectedCareSystem === 'AYURVEDA' ? 'text-emerald-700' : 'text-sky-700'}>{selectedCareSystem}</strong>
                </span>
              </div>

              {/* Navigation buttons */}
              <div className="pt-4 border-t border-brand-border flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-brand-muted hover:text-brand-heading hover:bg-brand-bg"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setCurrentStep(5)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white text-xs font-bold shadow-soft transition-all"
                >
                  <span>Continue to Language Selection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Select Language */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="border-b border-brand-border pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-dark bg-brand-teal-light px-2.5 py-1 rounded-full">
                  Step 5 of 9
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-heading mt-2">
                  Select Preferred Language for AI Intake
                </h2>
                <p className="text-xs sm:text-sm text-brand-body mt-1">
                  AyuFlow speaks and understands 10+ Indian regional languages and classical Ayurvedic terminology.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {MOCK_LANGUAGES.map((lang) => {
                  const isSelected = selectedLang === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => setSelectedLang(lang.code)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${
                        isSelected
                          ? 'border-brand-teal bg-brand-teal-light shadow-soft scale-[1.02]'
                          : 'border-brand-border hover:border-brand-teal/40 bg-white hover:bg-brand-bg'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-brand-heading">{lang.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-brand-teal-dark" />}
                      </div>
                      <p className="text-sm font-semibold text-brand-teal-dark">{lang.native}</p>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-brand-border flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep(4)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-brand-muted hover:text-brand-heading hover:bg-brand-bg"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Care Stream</span>
                </button>
                <button
                  onClick={() => setCurrentStep(6)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white text-xs font-bold shadow-soft transition-all"
                >
                  <span>Proceed to Upload Documents</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: Scan / Upload Documents */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="border-b border-brand-border pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-dark bg-brand-teal-light px-2.5 py-1 rounded-full">
                  Step 6 of 9
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-heading mt-2">
                  Scan & Upload Medical Records
                </h2>
                <p className="text-xs sm:text-sm text-brand-body mt-1">
                  Upload previous doctor prescriptions, blood tests, or Ayurvedic case sheets for AI entity extraction.
                </p>
              </div>

              <FileUploadZone
                onFilesUploaded={(files) => setUploadedDocs(files)}
                initialDocuments={uploadedDocs}
              />

              <div className="p-4 rounded-2xl bg-brand-blue-light/50 border border-brand-blue/40 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-brand-blue-dark flex-shrink-0 mt-0.5" />
                <p className="text-xs text-brand-heading leading-relaxed">
                  <span className="font-bold">Ayurvedic OCR Note:</span> Even handwritten prescriptions with Sanskrit names (like <em>Guggulu</em>, <em>Kashayam</em>, <em>Bhasma</em>) are automatically transcribed and provided to the consulting physician.
                </p>
              </div>

              <div className="pt-4 border-t border-brand-border flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep(5)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-brand-muted hover:text-brand-heading hover:bg-brand-bg"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setCurrentStep(7)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white text-xs font-bold shadow-soft transition-all"
                >
                  <span>Start Conversational Intake</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 7: Conversational Intake (Voice & Chat UI) */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div className="border-b border-brand-border pb-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-dark bg-brand-teal-light px-2.5 py-1 rounded-full">
                    Step 7 of 9
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-brand-heading mt-2">
                    AI Conversational Case-Taking
                  </h2>
                  <p className="text-xs sm:text-sm text-brand-body mt-1">
                    Describe your symptoms freely. Speak using the microphone or select suggested symptoms.
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal-light text-brand-teal-dark text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Speech-to-Text Active</span>
                </div>
              </div>

              {/* Chat Container */}
              <div className="bg-brand-bg rounded-2xl border border-brand-border p-4 sm:p-6 min-h-[340px] max-h-[420px] overflow-y-auto">
                {chatMessages.map((msg) => (
                  <ChatBubble
                    key={msg.id}
                    message={msg}
                    onOptionClick={(opt) => handleSendChat(opt)}
                    onSpeak={(txt) => {
                      showToast({ type: 'info', title: 'Audio Output', message: `Speaking text in ${selectedLang.toUpperCase()}` });
                    }}
                  />
                ))}

                {isListening && (
                  <div className="flex items-center gap-3 p-3 bg-brand-teal-light rounded-xl border border-brand-teal/40 animate-pulse text-xs text-brand-teal-dark font-medium">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-teal opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-teal-dark"></span>
                    </span>
                    <span>{voiceSpeechFeedback}</span>
                  </div>
                )}
              </div>

              {/* Unified VoiceInput Bar with Progressive Streaming & Mode Toggle */}
              <div className="space-y-3">
                <VoiceInput
                  value={chatInput}
                  onChange={(val) => setChatInput(val)}
                  placeholder="Speak or type your symptoms (e.g., घुटने में दर्द, पेट में जलन, chronic acidity)..."
                  label="Chief Complaint Voice Intake"
                  language={MOCK_LANGUAGES.find(l => l.code === selectedLang)?.name || 'Hindi (हिंदी)'}
                  samplePhrases={[
                    'घुटनों में सुबह उठने पर बहुत तेज़ दर्द और अकड़न रहती है',
                    'Severe acidity and retrosternal burning after meals',
                    'लगातार सूखी खांसी और छाती में भारीपन महसूस होता है',
                    'Frequent urination at night with weakness and fatigue'
                  ]}
                />

                <div className="flex justify-end">
                  <button
                    disabled={!chatInput.trim()}
                    onClick={() => handleSendChat()}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-soft transition-all ${
                      chatInput.trim()
                        ? 'bg-brand-heading text-white hover:bg-slate-700'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <span>Send into Consultation Chat</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-brand-border flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep(6)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-brand-muted hover:text-brand-heading hover:bg-brand-bg"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setCurrentStep(8)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white text-xs font-bold shadow-soft transition-all"
                >
                  <span>Next: Clinical Questionnaire</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 8: Deterministic Clinical Questionnaire (10 SIH Questions) */}
          {currentStep === 8 && (
            <div className="space-y-6">
              <div className="border-b border-brand-border pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-dark bg-brand-teal-light px-2.5 py-1 rounded-full">
                  Step 8 of 9
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-heading mt-2">
                  Deterministic Clinical Questionnaire
                </h2>
                <p className="text-xs sm:text-sm text-brand-body mt-1">
                  10 standardized SIH clinical checkpoints assessing chronicity, severity, prior episodes, comorbidities, medications, and allergies.
                </p>
              </div>

              {/* Progress Bar for Questions */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-brand-heading mb-2">
                  <span>
                    Question {questionnaireIndex + 1} of {MOCK_CLINICAL_QUESTIONS.length}
                  </span>
                  <span className="text-brand-teal-dark">
                    Category: {MOCK_CLINICAL_QUESTIONS[questionnaireIndex].category}
                  </span>
                </div>
                <div className="w-full h-2 bg-brand-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-teal transition-all duration-300"
                    style={{
                      width: `${((questionnaireIndex + 1) / MOCK_CLINICAL_QUESTIONS.length) * 100}%`
                    }}
                  />
                </div>
              </div>

              {/* Current Question Card */}
              {(() => {
                const q = MOCK_CLINICAL_QUESTIONS[questionnaireIndex];
                const selectedAnswer = questionAnswers[q.id];

                return (
                  <div className="p-6 rounded-3xl bg-brand-bg border border-brand-border space-y-4">
                    <h3 className="text-base sm:text-lg font-bold text-brand-heading leading-snug">
                      {q.question}
                    </h3>

                    <div className="p-3 rounded-xl bg-white border border-brand-border/60 text-xs text-brand-body flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-brand-teal-dark flex-shrink-0 mt-0.5" />
                      <span><strong>Clinical Rationale:</strong> {q.ayushContext}</span>
                    </div>

                    <div className="space-y-2 pt-2">
                      {q.options.map((opt, i) => {
                        const isChosen = selectedAnswer === opt;
                        return (
                          <div
                            key={i}
                            onClick={() => {
                              setQuestionAnswers(prev => ({ ...prev, [q.id]: opt }));
                            }}
                            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between text-xs sm:text-sm ${
                              isChosen
                                ? 'border-brand-teal bg-brand-teal-light/40 font-semibold text-brand-heading shadow-xs'
                                : 'border-brand-border bg-white hover:border-brand-teal/40 text-brand-body'
                            }`}
                          >
                            <span>{opt}</span>
                            <div
                              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                isChosen ? 'border-brand-teal bg-brand-teal text-white' : 'border-brand-border'
                              }`}
                            >
                              {isChosen && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Question Sub-navigation */}
                    <div className="flex items-center justify-between pt-4 border-t border-brand-border/60">
                      <button
                        disabled={questionnaireIndex === 0}
                        onClick={() => setQuestionnaireIndex(prev => prev - 1)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold ${
                          questionnaireIndex === 0
                            ? 'text-brand-border cursor-not-allowed'
                            : 'text-brand-muted hover:text-brand-heading bg-white border border-brand-border'
                        }`}
                      >
                        Previous Question
                      </button>

                      {questionnaireIndex < MOCK_CLINICAL_QUESTIONS.length - 1 ? (
                        <button
                          onClick={() => setQuestionnaireIndex(prev => prev + 1)}
                          className="px-5 py-2 rounded-xl bg-brand-heading text-white text-xs font-bold hover:bg-slate-700 shadow-soft"
                        >
                          Next Question
                        </button>
                      ) : (
                        <button
                          onClick={() => setCurrentStep(9)}
                          className="px-6 py-2 rounded-xl bg-brand-teal text-white text-xs font-bold hover:bg-brand-teal-dark shadow-soft"
                        >
                          Review All Responses
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}

              <div className="pt-4 border-t border-brand-border flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep(7)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-brand-muted hover:text-brand-heading hover:bg-brand-bg"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Chat</span>
                </button>
                <button
                  onClick={() => setCurrentStep(9)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white text-xs font-bold shadow-soft transition-all"
                >
                  <span>Skip to Review</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 9: Provide / Review Answers */}
          {currentStep === 9 && (
            <div className="space-y-6">
              <div className="border-b border-brand-border pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-dark bg-brand-teal-light px-2.5 py-1 rounded-full">
                  Step 9 of 9
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-heading mt-2">
                  Review & Confirm Clinical Dossier
                </h2>
                <p className="text-xs sm:text-sm text-brand-body mt-1">
                  Please verify your responses before dispatching the pre-consultation summary to the doctor's queue.
                </p>
              </div>

              {/* Mandatory AI Safety Notice */}
              <AISafetyBanner />

              {/* Priority Flag Alert if Severe */}
              {(questionAnswers['q-4']?.toLowerCase().includes('severe') || questionAnswers['q-1']?.toLowerCase().includes('severe')) && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <div>
                      <span className="text-xs font-bold block">Priority Clinical Review Triggered</span>
                      <span className="text-[11px] text-amber-800">Severe pain or mobility restriction flagged. Patient routed to urgent queue.</span>
                    </div>
                  </div>
                  <PriorityFlag pulse={true} size="md" />
                </div>
              )}

              {/* Patient Summary Header Box */}
              <div className="p-4 rounded-2xl bg-brand-bg border border-brand-border grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-brand-muted">Patient Name:</span>
                  <p className="font-bold text-brand-heading">{formData.name}</p>
                </div>
                <div>
                  <span className="text-brand-muted">Assigned Token:</span>
                  <p className="font-mono font-bold text-brand-teal-dark">{currentToken}</p>
                </div>
                <div>
                  <span className="text-brand-muted">Care Stream:</span>
                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                    selectedCareSystem === 'AYURVEDA' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                  }`}>
                    {selectedCareSystem}
                  </span>
                </div>
                <div>
                  <span className="text-brand-muted">Attached Records:</span>
                  <p className="font-medium text-brand-heading">{uploadedDocs.length} files</p>
                </div>
              </div>

              {/* Questionnaire Answer Cards */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-brand-heading uppercase tracking-wider">
                  Logged SIH Assessment Answers (10 Checkpoints)
                </h4>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {MOCK_CLINICAL_QUESTIONS.map((q) => (
                    <div
                      key={q.id}
                      className="p-3.5 rounded-2xl border border-brand-border bg-white shadow-xs space-y-1 text-xs"
                    >
                      <p className="font-semibold text-brand-heading">{q.question}</p>
                      <p className="text-brand-teal-dark font-medium bg-brand-teal-light/40 px-2.5 py-1 rounded-lg border border-brand-teal/20">
                        {questionAnswers[q.id] || 'Not answered'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-brand-border flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep(8)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-brand-muted hover:text-brand-heading hover:bg-brand-bg"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Edit Answers</span>
                </button>
                <button
                  disabled={isSubmitting}
                  onClick={handleFinalSubmit}
                  className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl text-white text-xs font-bold shadow-soft-lg transition-all ${
                    isSubmitting
                      ? 'bg-slate-400 cursor-wait'
                      : 'bg-brand-teal hover:bg-brand-teal-dark hover:scale-[1.02]'
                  }`}
                >
                  <span>{isSubmitting ? 'Synthesizing AI Clinical Dossier...' : 'Submit Intake to Doctor\'s Queue'}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 10: Intake Completed & Sent to Doctor */}
          {currentStep === 10 && (
            <div className="text-center py-6 sm:py-10 space-y-6 animate-in zoom-in-95 duration-200">
              
              {/* Checkmark Icon with soft green halo */}
              <div className="w-20 h-20 rounded-3xl bg-[#EAF7ED] text-[#2E7D32] border-2 border-[#A7D7B5] flex items-center justify-center mx-auto shadow-soft animate-bounce">
                <Check className="w-10 h-10 stroke-[3]" />
              </div>

              <div className="max-w-lg mx-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D32] bg-[#EAF7ED] px-3 py-1 rounded-full border border-[#A7D7B5]">
                  Case Intake Completed
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-heading mt-3">
                  Data Successfully Sent to Doctor's Queue
                </h2>
                <p className="text-xs sm:text-sm text-brand-body mt-2 leading-relaxed">
                  Your clinical case profile and AI-synthesized record have been dispatched to the consulting physician at <strong>{selectedHospital.name}</strong>.
                </p>
              </div>

              {/* Token Reminder Box */}
              <div className="max-w-sm mx-auto p-5 rounded-2xl bg-brand-bg border border-brand-border shadow-soft space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs text-brand-muted uppercase tracking-wider font-semibold">Live OPD Token</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedCareSystem === 'AYURVEDA' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                  }`}>
                    {selectedCareSystem}
                  </span>
                </div>
                <p className="text-3xl font-extrabold font-mono text-brand-teal-dark">{currentToken}</p>
                <p className="text-xs font-semibold text-brand-heading">Queue Position: #{currentQueueNo}</p>
                <p className="text-[11px] text-brand-muted">Please proceed to OPD Waiting Room 3 when called.</p>
              </div>

              {/* Action Jump Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => navigate('/patient/dashboard')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-brand-heading hover:bg-slate-700 text-white text-xs font-bold shadow-soft transition-all"
                >
                  <FileText className="w-4 h-4" />
                  <span>View My Patient Dashboard & Token</span>
                </button>
                <button
                  onClick={() => navigate('/doctor')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white text-xs font-bold shadow-soft transition-all"
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>Jump to Doctor View</span>
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-brand-border bg-white hover:bg-brand-bg text-xs font-semibold text-brand-heading transition-all"
                >
                  <span>Return to Home</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
