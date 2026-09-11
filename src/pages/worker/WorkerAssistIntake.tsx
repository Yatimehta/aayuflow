import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Phone, 
  Camera, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  AlertTriangle, 
  Printer, 
  MessageSquare, 
  Sparkles, 
  X, 
  Plus, 
  Volume2, 
  ShieldAlert, 
  RotateCcw,
  Check,
  Building,
  HeartPulse,
  Heart,
  Moon,
  Activity,
  Pill,
  Utensils,
  Eye,
  Search,
  UserCheck,
  UserPlus,
  Users,
  Copy,
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CareSystem, DocumentItem, Patient } from '../../types';

export const WorkerAssistIntake: React.FC = () => {
  const navigate = useNavigate();
  const { 
    patients, 
    activePatient, 
    setActivePatientId, 
    completeIntake, 
    selectedHospital, 
    showToast 
  } = useApp();

  // ── Step Navigation (1 to 10) ──
  // 1: Existing or New Patient (Entry Decision)
  // 2: Basic Details (Skipped for existing patients with pre-filled data)
  // 3: Scan Papers
  // 4: OPD Stream
  // 5: Problem & Area
  // 6: Body & Digestion
  // 7: Sleep & Triggers
  // 8: Current Medicines
  // 9: Review Summary
  // 10: Token & OTP Slip
  const [currentStep, setCurrentStep] = useState<number>(1);
  const TOTAL_INTAKE_STEPS = 9;

  // Track if patient is existing or new
  const [isExistingPatient, setIsExistingPatient] = useState<boolean>(false);
  const [patientSearchQuery, setPatientSearchQuery] = useState<string>('');
  const [showSearchBox, setShowSearchBox] = useState<boolean>(false);

  // 2. Patient Details
  const [fullName, setFullName] = useState(activePatient?.name || '');
  const [age, setAge] = useState(activePatient?.age ? String(activePatient.age) : '');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(
    activePatient?.gender || 'Male'
  );
  const [phone, setPhone] = useState(activePatient?.phone || '');
  const [language, setLanguage] = useState(
    activePatient?.preferredLanguage || 'Hindi (हिंदी)'
  );

  // 3. Document Scanning
  const [attachedPapers, setAttachedPapers] = useState<DocumentItem[]>(
    activePatient?.documents || []
  );
  const [isCameraActive, setIsCameraActive] = useState(false);

  // 4. Care Stream
  const [careStream, setCareStream] = useState<CareSystem>('AYURVEDA');

  // 5. Problem & Area
  const [mainProblem, setMainProblem] = useState(
    activePatient?.chiefComplaint || 'Joint pain & stiffness'
  );
  const [customProblem, setCustomProblem] = useState('');
  const [affectedRegion, setAffectedRegion] = useState('Knees');
  const [customRegion, setCustomRegion] = useState('');

  // 6. Body Frame & Digestion
  const [bodyFrame, setBodyFrame] = useState('Medium / Athletic frame');
  const [digestionAppetite, setDigestionAppetite] = useState(
    'Irregular with gas or bloating'
  );

  // 7. Sleep & Triggers
  const [sleepQuality, setSleepQuality] = useState('Light and easily broken');
  const [aggravatingTriggers, setAggravatingTriggers] = useState<string[]>([
    'Cold weather or morning chill'
  ]);

  // 8. Medicines
  const [takingMedicines, setTakingMedicines] = useState<'Yes' | 'No'>('Yes');
  const [medicineDetails, setMedicineDetails] = useState('Daily blood pressure tablet');

  // Red Flag Alert State (Physical Action Only)
  const [emergencyAlertDismissed, setEmergencyAlertDismissed] = useState(false);

  // Screen 10 Token Results
  const [generatedToken, setGeneratedToken] = useState<string>('AYU-14');
  const [generatedOtp, setGeneratedOtp] = useState<string>('4829');
  const [assignedRoom, setAssignedRoom] = useState<string>('Room 104, AYUSH OPD Wing');
  const [submittedPatientName, setSubmittedPatientName] = useState<string>('');

  // Prefill if activePatient exists
  useEffect(() => {
    if (activePatient) {
      setFullName(activePatient.name);
      setAge(String(activePatient.age));
      setGender(activePatient.gender);
      setPhone(activePatient.phone);
      if (activePatient.preferredLanguage) setLanguage(activePatient.preferredLanguage);
      if (activePatient.chiefComplaint) setMainProblem(activePatient.chiefComplaint);
      if (activePatient.documents && activePatient.documents.length > 0) {
        setAttachedPapers(activePatient.documents);
      }
    }
  }, [activePatient]);

  // Filter patients by name or phone for existing patient search
  const searchResults = patientSearchQuery.trim()
    ? patients.filter(p => {
        const query = patientSearchQuery.toLowerCase().trim();
        const cleanQueryPhone = query.replace(/\D/g, '');
        const patientDigits = p.phone.replace(/\D/g, '');
        const nameMatch = p.name.toLowerCase().includes(query);
        const phoneMatch = cleanQueryPhone.length > 0 && patientDigits.includes(cleanQueryPhone);
        return nameMatch || phoneMatch;
      })
    : patients.slice(0, 4);

  // Select an existing patient and advance directly to Step 3 (Scan Papers)
  const handleSelectExistingPatient = (selected: Patient) => {
    setActivePatientId(selected.id);
    setIsExistingPatient(true);
    setFullName(selected.name);
    setAge(String(selected.age));
    setGender(selected.gender);
    setPhone(selected.phone);
    if (selected.preferredLanguage) setLanguage(selected.preferredLanguage);
    if (selected.documents && selected.documents.length > 0) {
      setAttachedPapers(selected.documents);
    }
    showToast({
      type: 'success',
      title: 'Patient Profile Loaded',
      message: `Loaded details for ${selected.name}. Proceeding to scan papers.`
    });
    setCurrentStep(3); // Skip Step 2 (Basic Details)
  };

  const handleStartNewPatient = () => {
    setActivePatientId(null);
    setIsExistingPatient(false);
    setFullName('');
    setAge('');
    setGender('Male');
    setPhone('');
    setLanguage('Hindi (हिंदी)');
    setAttachedPapers([]);
    setCurrentStep(2); // Proceed to Step 2 (Basic Details)
  };

  // Check for critical emergency symptoms
  const isEmergencyComplaint = () => {
    const combinedText = `${mainProblem} ${customProblem} ${affectedRegion} ${customRegion}`.toLowerCase();
    return (
      combinedText.includes('chest pain') ||
      combinedText.includes('breathless') ||
      combinedText.includes('shortness of breath') ||
      combinedText.includes('fainted') ||
      combinedText.includes('unconscious') ||
      combinedText.includes('severe bleeding') ||
      combinedText.includes('paralysis') ||
      combinedText.includes('stroke')
    );
  };

  const showEmergencyBanner = isEmergencyComplaint() && !emergencyAlertDismissed;

  const toggleTrigger = (factor: string) => {
    setAggravatingTriggers(prev =>
      prev.includes(factor) ? prev.filter(f => f !== factor) : [...prev, factor]
    );
  };

  // Simulate Photo
  const handleSimulatePhoto = (paperTitle: string) => {
    const newDoc: DocumentItem = {
      id: 'doc-' + Date.now(),
      patientId: activePatient?.id || 'pat-temp',
      name: paperTitle,
      type: 'Prescription',
      uploadDate: 'Today',
      url: '#',
      size: '1.4 MB',
      status: 'Verified'
    };
    setAttachedPapers(prev => [...prev, newDoc]);
    setIsCameraActive(false);
    showToast({
      type: 'success',
      title: 'Photo Captured',
      message: `${paperTitle} attached.`
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const newDoc: DocumentItem = {
        id: 'doc-' + Date.now(),
        patientId: activePatient?.id || 'pat-temp',
        name: file.name,
        type: 'Prescription',
        uploadDate: 'Today',
        url: '#',
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        status: 'Verified'
      };
      setAttachedPapers(prev => [...prev, newDoc]);
      showToast({
        type: 'success',
        title: 'File Attached',
        message: `${file.name} uploaded.`
      });
    }
  };

  const handleRemoveDoc = (id: string) => {
    setAttachedPapers(prev => prev.filter(d => d.id !== id));
  };

  // Submission handler
  const handleSubmitToIntake = () => {
    const finalProblem = mainProblem === 'Other' ? customProblem || 'General checkup' : mainProblem;
    const finalRegion = affectedRegion === 'Other' ? customRegion || 'General body' : affectedRegion;
    const resolvedName = fullName.trim() || 'Walk-in Patient';
    const resolvedAge = parseInt(age, 10) || 45;
    const resolvedPhone = phone.trim() || '+91 98112 00000';

    const cleanTokenNumber = `AYU-${Math.floor(10 + Math.random() * 89)}`;
    const randomOtp = `${Math.floor(1000 + Math.random() * 9000)}`;

    const plainAnswers: Record<string, string> = {
      'q-1': `${finalProblem} in ${finalRegion}`,
      'q-2': `Body Frame: ${bodyFrame}`,
      'q-3': `Digestion/Appetite: ${digestionAppetite}`,
      'q-4': `Sleep: ${sleepQuality}`,
      'q-5': `Aggravating Factors: ${aggravatingTriggers.join(', ') || 'None reported'}`,
      'q-6': takingMedicines === 'Yes' ? `Current Medicines: ${medicineDetails}` : 'No current medicines',
      'q-7': `Papers Attached: ${attachedPapers.length} document(s)`
    };

    const workerNote = `Patient assisted at kiosk. Main concern: ${finalProblem} in ${finalRegion}. Digestion: ${digestionAppetite}. Sleep: ${sleepQuality}. Medicines: ${takingMedicines === 'Yes' ? medicineDetails : 'None'}.`;

    const result = completeIntake(
      {
        id: activePatient?.id,
        name: resolvedName,
        age: resolvedAge,
        gender,
        phone: resolvedPhone,
        chiefComplaint: `${finalProblem} in ${finalRegion}`,
        careSystem: careStream,
        preferredLanguage: language,
        documents: attachedPapers,
        otp: randomOtp
      },
      plainAnswers,
      workerNote,
      careStream
    );

    setSubmittedPatientName(resolvedName);
    setGeneratedToken(result?.patient?.tokenNumber || cleanTokenNumber);
    setGeneratedOtp(result?.patient?.otp || randomOtp);
    setAssignedRoom(careStream === 'AYURVEDA' ? 'Room 104, AYUSH OPD Wing' : 'Room 102, General OPD Wing');
    setCurrentStep(10); // Handoff screen
  };

  const handleResetForNextPatient = () => {
    setActivePatientId(null);
    setIsExistingPatient(false);
    setShowSearchBox(false);
    setPatientSearchQuery('');
    setFullName('');
    setAge('');
    setGender('Male');
    setPhone('');
    setLanguage('Hindi (हिंदी)');
    setAttachedPapers([]);
    setMainProblem('Joint pain & stiffness');
    setCustomProblem('');
    setAffectedRegion('Knees');
    setCustomRegion('');
    setBodyFrame('Medium / Athletic frame');
    setDigestionAppetite('Irregular with gas or bloating');
    setSleepQuality('Light and easily broken');
    setAggravatingTriggers(['Cold weather or morning chill']);
    setTakingMedicines('Yes');
    setMedicineDetails('Daily blood pressure tablet');
    setEmergencyAlertDismissed(false);
    setCurrentStep(1);
    navigate('/worker');
  };

  const stepTitles = [
    'Existing or New Patient',
    'Basic Details',
    'Scan Papers',
    'OPD Stream',
    'Problem & Area',
    'Body & Digestion',
    'Sleep & Triggers',
    'Current Medicines',
    'Review Summary'
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      
      {/* ── TOP CLEAN PROGRESS TRACKER (Step 2 to 9 only) ── */}
      {currentStep > 1 && currentStep <= TOTAL_INTAKE_STEPS && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#DCEAE7] shadow-sm space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#146356] uppercase tracking-wider">
              Step {currentStep} of {TOTAL_INTAKE_STEPS} • {stepTitles[currentStep - 1]}
            </span>
            <span className="font-bold text-[#0D2B3E]">
              {Math.round((currentStep / TOTAL_INTAKE_STEPS) * 100)}% Completed
            </span>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full h-2.5 bg-[#E4EFEC] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#146356] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${(currentStep / TOTAL_INTAKE_STEPS) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* ── RED-FLAG EMERGENCY GUARDRAIL (Physical Action Only) ── */}
      {showEmergencyBanner && (
        <div className="bg-[#C23B22] text-white p-5 sm:p-6 rounded-3xl shadow-lg border-2 border-red-300 space-y-4 animate-bounce-subtle">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-extrabold tracking-tight">
                ⚠️ Please escort this patient to the Emergency / Triage Nurse immediately.
              </h3>
              <p className="text-xs sm:text-sm text-red-100 font-medium leading-relaxed">
                Do not complete routine OPD intake. Notify the front-desk nurse right away.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => {
                showToast({
                  type: 'error',
                  title: 'Emergency Nurse Notified',
                  message: 'Desk Nurse at Counter 1 alerted. Escort patient directly.'
                });
              }}
              className="bg-white text-[#C23B22] hover:bg-red-50 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-sm transition-colors flex items-center gap-2"
            >
              <HeartPulse className="w-4 h-4" />
              <span>Call Front-Desk Nurse (Counter 1)</span>
            </button>
            <button
              onClick={() => setEmergencyAlertDismissed(true)}
              className="bg-black/25 hover:bg-black/35 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-colors"
            >
              Patient is stable (Continue routine intake)
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SCREEN 1: EXISTING PATIENT OR NEW PATIENT (ENTRY DECISION)
      ────────────────────────────────────────────────────────────── */}
      {currentStep === 1 && (
        <div className="min-h-[75vh] flex items-center justify-center py-8 px-2 animate-fadeIn">
          {!showSearchBox ? (
            <div className="max-w-xl w-full space-y-6 text-center">
              
              {/* Top Icon & Calm Header */}
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#E4EFEC] text-[#146356] flex items-center justify-center mx-auto border border-[#9FDCD1]">
                  <Users className="w-7 h-7 stroke-[2]" />
                </div>
                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#0D2B3E] tracking-tight">
                    Who are you assisting today?
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Select whether this is a returning patient or a first-time walk-in visitor.
                  </p>
                </div>
              </div>

              {/* Centered Action Card Container */}
              <div className="bg-white rounded-3xl border border-[#DCEAE7] shadow-xs p-6 sm:p-8 space-y-6 text-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Option A: Existing Patient */}
                  <button
                    type="button"
                    onClick={() => setShowSearchBox(true)}
                    className="p-6 rounded-2xl bg-[#F4FBF9] border-2 border-[#DCEAE7] hover:border-[#146356] hover:bg-[#E4EFEC]/40 transition-all text-center space-y-3.5 group cursor-pointer flex flex-col items-center justify-between min-h-[190px]"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#E4EFEC] text-[#146356] flex items-center justify-center border border-[#9FDCD1] group-hover:scale-110 transition-transform">
                      <UserCheck className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-[#0D2B3E]">Existing Patient</h2>
                      <p className="text-xs text-slate-500 mt-0.5">Has visited the OPD before</p>
                    </div>
                    <span className="text-[11px] font-bold text-[#146356] bg-white px-3.5 py-1 rounded-full border border-[#DCEAE7] group-hover:border-[#146356]/40 transition-colors">
                      Search Records →
                    </span>
                  </button>

                  {/* Option B: New Patient */}
                  <button
                    type="button"
                    onClick={handleStartNewPatient}
                    className="p-6 rounded-2xl bg-[#146356] hover:bg-[#0f4d43] border-2 border-[#146356] text-white transition-all text-center space-y-3.5 group cursor-pointer flex flex-col items-center justify-between min-h-[190px] shadow-xs"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                      <UserPlus className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">New Patient</h2>
                      <p className="text-xs text-teal-100 mt-0.5">First-time OPD visitor</p>
                    </div>
                    <span className="text-[11px] font-bold text-white bg-white/20 px-3.5 py-1 rounded-full group-hover:bg-white/30 transition-colors">
                      Start Registration →
                    </span>
                  </button>

                </div>

                {/* Helper Note */}
                <div className="p-3 rounded-2xl bg-[#F4FBF9] border border-[#DCEAE7] text-xs text-slate-500 text-center">
                  <span>Assisting OPD arrivals at {selectedHospital.name}</span>
                </div>
              </div>

            </div>
          ) : (
            /* Centered Search View for Existing Patient */
            <div className="max-w-xl w-full bg-white rounded-3xl border border-[#DCEAE7] shadow-xs p-6 sm:p-8 space-y-5 text-center animate-fadeIn">
              
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2.5 text-left">
                  <div className="w-9 h-9 rounded-full bg-[#E4EFEC] text-[#146356] flex items-center justify-center border border-[#9FDCD1]">
                    <Search className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#0D2B3E]">Find Returning Patient</h2>
                    <p className="text-[11px] text-slate-500">Search by mobile number or name</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSearchBox(false)}
                  className="text-xs font-bold text-[#146356] hover:bg-[#E4EFEC] px-3 py-1.5 rounded-xl transition-colors"
                >
                  ← Back
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  autoFocus
                  value={patientSearchQuery}
                  onChange={(e) => setPatientSearchQuery(e.target.value)}
                  placeholder="Enter phone number or patient name..."
                  className="w-full pl-10 pr-4 py-3 bg-[#F4FBF9] border border-[#DCEAE7] rounded-2xl text-sm text-[#0D2B3E] font-medium focus:outline-none focus:ring-2 focus:ring-[#146356] focus:bg-white"
                />
              </div>

              {/* Matched Search Results */}
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1 text-left">
                {searchResults.length > 0 ? (
                  searchResults.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleSelectExistingPatient(p)}
                      className="p-3.5 rounded-2xl border border-[#DCEAE7] bg-[#F4FBF9] hover:bg-[#E4EFEC] hover:border-[#146356] transition-all cursor-pointer flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-[#E4EFEC] text-[#146356] font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {p.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#0D2B3E] truncate">{p.name}</p>
                          <p className="text-[11px] text-slate-500 truncate">
                            {p.age}y • {p.gender} • Phone: {p.phone}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-[#146356] text-white text-xs font-bold rounded-xl flex items-center gap-1 flex-shrink-0 shadow-xs"
                      >
                        <span>Select</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  /* No match found fallback */
                  <div className="p-5 rounded-2xl bg-[#F4FBF9] border border-[#DCEAE7] text-center space-y-3">
                    <p className="text-xs text-slate-600 font-medium">
                      No patient record found matching <strong>"{patientSearchQuery}"</strong>.
                    </p>
                    <button
                      type="button"
                      onClick={handleStartNewPatient}
                      className="bg-[#146356] hover:bg-[#0f4d43] text-white text-xs font-bold py-2.5 px-5 rounded-xl inline-flex items-center gap-2 shadow-xs transition-colors"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Proceed as New Patient</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SCREEN 2: PATIENT BASIC DETAILS (FOR NEW PATIENTS)
      ────────────────────────────────────────────────────────────── */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCEAE7] shadow-sm space-y-6 animate-fadeIn">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#146356] uppercase tracking-wider">
              2. Basic Details • बुनियादी जानकारी
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0D2B3E]">
              Ask the patient for their contact details
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Enter their name, age, and mobile number so they can receive their token number and doctor room SMS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            
            {/* Full Name */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-[#0D2B3E]">
                Patient's Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rameshwar Sharma"
                  className="w-full pl-10 pr-4 py-3.5 bg-[#F4FBF9] border border-[#DCEAE7] rounded-2xl text-sm text-[#0D2B3E] font-medium focus:outline-none focus:ring-2 focus:ring-[#146356] focus:bg-white"
                />
              </div>
            </div>

            {/* Age */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0D2B3E]">
                Age (Years) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 58"
                min="1"
                max="120"
                className="w-full px-4 py-3.5 bg-[#F4FBF9] border border-[#DCEAE7] rounded-2xl text-sm text-[#0D2B3E] font-medium focus:outline-none focus:ring-2 focus:ring-[#146356] focus:bg-white"
              />
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0D2B3E]">
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Male', 'Female', 'Other'] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`py-3.5 px-3 rounded-2xl text-xs font-bold border transition-all ${
                      gender === g
                        ? 'bg-[#146356] text-white border-[#146356] shadow-xs'
                        : 'bg-[#F4FBF9] text-[#0D2B3E] border-[#DCEAE7] hover:bg-slate-100'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0D2B3E]">
                Mobile Number (for SMS token delivery) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 98112 34567"
                  className="w-full pl-10 pr-4 py-3.5 bg-[#F4FBF9] border border-[#DCEAE7] rounded-2xl text-sm text-[#0D2B3E] font-medium focus:outline-none focus:ring-2 focus:ring-[#146356] focus:bg-white"
                />
              </div>
            </div>

            {/* Preferred Spoken Language */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0D2B3E]">
                Preferred Spoken Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3.5 bg-[#F4FBF9] border border-[#DCEAE7] rounded-2xl text-sm text-[#0D2B3E] font-semibold focus:outline-none focus:ring-2 focus:ring-[#146356] focus:bg-white"
              >
                <option value="Hindi (हिंदी)">Hindi (हिंदी)</option>
                <option value="English">English</option>
                <option value="Gujarati (ગુજરાતી)">Gujarati (ગુજરાતી)</option>
                <option value="Marathi (मराठी)">Marathi (मराठी)</option>
                <option value="Bengali (বাংলা)">Bengali (বাংলা)</option>
                <option value="Tamil (தமிழ்)">Tamil (தமிழ்)</option>
                <option value="Telugu (తెలుగు)">Telugu (తెలుగు)</option>
                <option value="Punjabi (ਪੰਜਾਬੀ)">Punjabi (ਪੰਜਾਬੀ)</option>
                <option value="Kannada (ಕನ್ನಡ)">Kannada (ಕನ್ನಡ)</option>
              </select>
            </div>

          </div>

          <div className="pt-4 flex items-center justify-between border-t border-[#DCEAE7]">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Option</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (!fullName.trim() || !phone.trim()) {
                  showToast({
                    type: 'error',
                    title: 'Missing Required Fields',
                    message: 'Please enter patient name and mobile number.'
                  });
                  return;
                }
                setCurrentStep(3);
              }}
              className="bg-[#146356] hover:bg-[#0f4d43] text-white font-bold py-3.5 px-7 rounded-2xl flex items-center gap-2 text-sm shadow-sm transition-colors"
            >
              <span>Next: Scan Papers</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SCREEN 3: DOCUMENT SCANNING ("Do they have old papers?")
      ────────────────────────────────────────────────────────────── */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCEAE7] shadow-sm space-y-6 animate-fadeIn">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#146356] uppercase tracking-wider">
              3. Scan Papers • पुरानी पर्चियां / रिपोर्ट्स
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0D2B3E]">
              Scan any prescriptions, doctor slips, or test reports
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Take a clear photo of any previous hospital papers the patient brought today.
            </p>
          </div>

          {/* Big Camera / Upload Area */}
          <div className="bg-[#F4FBF9] border-2 border-dashed border-[#DCEAE7] rounded-3xl p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#E4EFEC] text-[#146356] mx-auto flex items-center justify-center">
              <Camera className="w-8 h-8" />
            </div>

            <div className="space-y-1 max-w-md mx-auto">
              <p className="text-sm font-bold text-[#0D2B3E]">
                Use Kiosk Camera or Select Photo
              </p>
              <p className="text-xs text-slate-500">
                Hold the prescription flat under bright light and capture a clear, readable photo.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCameraActive(true)}
                className="bg-[#146356] hover:bg-[#0f4d43] text-white font-bold px-5 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-colors"
              >
                <Camera className="w-4 h-4" />
                <span>Take Photo with Camera</span>
              </button>

              <label className="bg-white hover:bg-slate-50 text-[#0D2B3E] font-bold px-5 py-3 rounded-xl text-xs sm:text-sm border border-[#DCEAE7] cursor-pointer flex items-center gap-2 shadow-xs transition-colors">
                <Upload className="w-4 h-4 text-slate-500" />
                <span>Choose Image File</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Quick Sample Selector */}
            <div className="pt-3 flex items-center justify-center gap-2 flex-wrap text-xs text-slate-500">
              <span className="font-semibold text-slate-400">Or attach sample slip:</span>
              <button
                type="button"
                onClick={() => handleSimulatePhoto('Previous OPD Prescription Slip.jpg')}
                className="px-2.5 py-1 bg-white border border-[#DCEAE7] hover:bg-[#E4EFEC] rounded-lg text-[#146356] font-medium"
              >
                + OPD Slip
              </button>
              <button
                type="button"
                onClick={() => handleSimulatePhoto('Bilateral Knee X-Ray Report.jpg')}
                className="px-2.5 py-1 bg-white border border-[#DCEAE7] hover:bg-[#E4EFEC] rounded-lg text-[#146356] font-medium"
              >
                + X-Ray Photo
              </button>
            </div>
          </div>

          {/* Camera Simulation Modal */}
          {isCameraActive && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 border border-[#DCEAE7] shadow-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-[#0D2B3E]">Desk Camera Viewfinder</h3>
                  <button
                    onClick={() => setIsCameraActive(false)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="h-56 bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-white relative overflow-hidden border border-slate-700">
                  <div className="absolute inset-4 border-2 border-dashed border-teal-400/70 rounded-xl pointer-events-none" />
                  <Camera className="w-12 h-12 text-teal-400 animate-pulse mb-2" />
                  <p className="text-xs font-semibold text-teal-200">Align paper within the green border</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleSimulatePhoto('Captured Prescription Slip.jpg')}
                    className="flex-1 bg-[#146356] text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Snap Photo</span>
                  </button>
                  <button
                    onClick={() => setIsCameraActive(false)}
                    className="px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Attached Document Previews */}
          {attachedPapers.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-[#0D2B3E] uppercase tracking-wider">
                Attached Papers ({attachedPapers.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {attachedPapers.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 bg-[#F4FBF9] rounded-2xl border border-[#DCEAE7] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[#E4EFEC] text-[#146356] flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#0D2B3E] truncate">{doc.name}</p>
                        <p className="text-[11px] text-slate-500">{doc.size || '1.2 MB'}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDoc(doc.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-white transition-colors"
                      title="Remove paper"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Navigation */}
          <div className="pt-4 flex items-center justify-between border-t border-[#DCEAE7]">
            <button
              type="button"
              onClick={() => setCurrentStep(isExistingPatient ? 1 : 2)}
              className="px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isExistingPatient ? 'Back to Patient Selection' : 'Back to Basic Details'}</span>
            </button>

            <div className="flex items-center gap-3">
              {attachedPapers.length === 0 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-4 py-3 text-xs font-bold text-slate-500 hover:text-[#0D2B3E] hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Skip — Patient brought no papers
                </button>
              )}
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="bg-[#146356] hover:bg-[#0f4d43] text-white font-bold py-3.5 px-7 rounded-2xl flex items-center gap-2 text-sm shadow-sm transition-colors"
              >
                <span>Next: OPD Stream</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SCREEN 4: SELECT OPD CARE STREAM
      ────────────────────────────────────────────────────────────── */}
      {currentStep === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCEAE7] shadow-sm space-y-6 animate-fadeIn">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#146356] uppercase tracking-wider">
              4. OPD Stream • विभाग चयन
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0D2B3E]">
              Which OPD stream is the patient visiting today?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Select the appropriate department desk to route their intake questions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            
            {/* Option 1: Ayurveda OPD */}
            <button
              type="button"
              onClick={() => setCareStream('AYURVEDA')}
              className={`p-6 rounded-3xl border-2 text-left space-y-3 transition-all ${
                careStream === 'AYURVEDA'
                  ? 'border-[#146356] bg-[#E4EFEC]/70 shadow-sm'
                  : 'border-[#DCEAE7] bg-[#F4FBF9] hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">🌿</span>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    careStream === 'AYURVEDA' ? 'border-[#146356] bg-[#146356] text-white' : 'border-slate-300'
                  }`}
                >
                  {careStream === 'AYURVEDA' && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0D2B3E]">Ayurveda OPD (आयुर्वेद)</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Kayachikitsa, Panchakarma, joint & chronic issues, herbal consultation, and holistic dietary guidance.
                </p>
              </div>
            </button>

            {/* Option 2: General OPD */}
            <button
              type="button"
              onClick={() => setCareStream('ALLOPATHY')}
              className={`p-6 rounded-3xl border-2 text-left space-y-3 transition-all ${
                careStream === 'ALLOPATHY'
                  ? 'border-[#146356] bg-[#E4EFEC]/70 shadow-sm'
                  : 'border-[#DCEAE7] bg-[#F4FBF9] hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">🩺</span>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    careStream === 'ALLOPATHY' ? 'border-[#146356] bg-[#146356] text-white' : 'border-slate-300'
                  }`}
                >
                  {careStream === 'ALLOPATHY' && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0D2B3E]">General Medicine OPD (एलोपैथी)</h3>
                <p className="text-xs text-slate-600 mt-1">
                  General physical checkups, fever, diabetes monitoring, routine BP checks, and standard medicine.
                </p>
              </div>
            </button>

          </div>

          <div className="pt-4 flex items-center justify-between border-t border-[#DCEAE7]">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(5)}
              className="bg-[#146356] hover:bg-[#0f4d43] text-white font-bold py-3.5 px-7 rounded-2xl flex items-center gap-2 text-sm shadow-sm transition-colors"
            >
              <span>Next: Problem & Area</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SCREEN 5: MAIN PROBLEM & AFFECTED REGION
      ────────────────────────────────────────────────────────────── */}
      {currentStep === 5 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCEAE7] shadow-sm space-y-6 animate-fadeIn">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#146356] uppercase tracking-wider">
              5. Problem & Area • मुख्य समस्या और स्थान
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0D2B3E]">
              What is troubling the patient today?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Ask the patient in their preferred language and select their main issue and location.
            </p>
          </div>

          {/* Part A: What is the main problem? */}
          <div className="space-y-2.5 pt-2">
            <label className="text-xs font-bold text-[#0D2B3E] block">
              Ask: "What is troubling you the most today?"
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                'Joint pain & stiffness',
                'Stomach or digestion issue',
                'Sleep & restlessness',
                'Fatigue & weakness',
                'Skin allergy or rash',
                'Cough, cold or breathing',
                'Headache / Dizziness',
                'Other'
              ].map((prob) => (
                <button
                  key={prob}
                  type="button"
                  onClick={() => setMainProblem(prob)}
                  className={`p-3.5 rounded-2xl text-xs font-bold border text-left transition-all ${
                    mainProblem === prob
                      ? 'bg-[#146356] text-white border-[#146356] shadow-xs'
                      : 'bg-[#F4FBF9] text-[#0D2B3E] border-[#DCEAE7] hover:bg-slate-100'
                  }`}
                >
                  {prob}
                </button>
              ))}
            </div>
            {mainProblem === 'Other' && (
              <input
                type="text"
                value={customProblem}
                onChange={(e) => setCustomProblem(e.target.value)}
                placeholder="Note exact problem in patient's words..."
                className="w-full mt-2 px-4 py-3 bg-[#F4FBF9] border border-[#DCEAE7] rounded-xl text-xs text-[#0D2B3E] focus:outline-none focus:ring-2 focus:ring-[#146356] focus:bg-white"
              />
            )}
          </div>

          {/* Part B: Where does it hurt? */}
          <div className="space-y-2.5 pt-2">
            <label className="text-xs font-bold text-[#0D2B3E] block">
              Ask: "Where does it hurt or feel uncomfortable?"
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                'Knees',
                'Lower back',
                'Stomach',
                'Neck & shoulders',
                'Head',
                'Chest (non-acute)',
                'All over body',
                'Other'
              ].map((reg) => (
                <button
                  key={reg}
                  type="button"
                  onClick={() => setAffectedRegion(reg)}
                  className={`p-3.5 rounded-2xl text-xs font-bold border text-left transition-all ${
                    affectedRegion === reg
                      ? 'bg-[#146356] text-white border-[#146356] shadow-xs'
                      : 'bg-[#F4FBF9] text-[#0D2B3E] border-[#DCEAE7] hover:bg-slate-100'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>
            {affectedRegion === 'Other' && (
              <input
                type="text"
                value={customRegion}
                onChange={(e) => setCustomRegion(e.target.value)}
                placeholder="Note exact area (e.g. Right ankle, eyes)..."
                className="w-full mt-2 px-4 py-3 bg-[#F4FBF9] border border-[#DCEAE7] rounded-xl text-xs text-[#0D2B3E] focus:outline-none focus:ring-2 focus:ring-[#146356] focus:bg-white"
              />
            )}
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-[#DCEAE7]">
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(6)}
              className="bg-[#146356] hover:bg-[#0f4d43] text-white font-bold py-3.5 px-7 rounded-2xl flex items-center gap-2 text-sm shadow-sm transition-colors"
            >
              <span>Next: Body & Digestion</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SCREEN 6: BODY FRAME & DIGESTION
      ────────────────────────────────────────────────────────────── */}
      {currentStep === 6 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCEAE7] shadow-sm space-y-6 animate-fadeIn">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#146356] uppercase tracking-wider">
              6. Body & Digestion • शरीर का प्रकार और पाचन
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0D2B3E]">
              Observe body frame and ask about digestion
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              These simple questions help the doctor understand the patient's natural constitution.
            </p>
          </div>

          {/* Body Frame */}
          <div className="space-y-2.5 pt-2">
            <label className="text-xs font-bold text-[#0D2B3E] block">
              Observe or ask: "How would you describe their body frame?"
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { title: 'Thin / Light frame', desc: 'Prominent bones, lean build, quick movement' },
                { title: 'Medium / Athletic frame', desc: 'Moderate weight, well-proportioned muscles' },
                { title: 'Heavy / Sturdy frame', desc: 'Broad build, solid joints, easy weight gain' }
              ].map((item) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setBodyFrame(item.title)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    bodyFrame === item.title
                      ? 'bg-[#146356] text-white border-[#146356] shadow-xs'
                      : 'bg-[#F4FBF9] text-[#0D2B3E] border-[#DCEAE7] hover:bg-slate-100'
                  }`}
                >
                  <p className="text-xs font-bold">{item.title}</p>
                  <p className={`text-[11px] mt-1 ${bodyFrame === item.title ? 'text-teal-100' : 'text-slate-500'}`}>
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Appetite & Digestion */}
          <div className="space-y-2.5 pt-2">
            <label className="text-xs font-bold text-[#0D2B3E] block">
              Ask: "How is their appetite and digestion generally?"
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: 'Irregular with gas or bloating', desc: 'Hunger varies day-to-day, bloating after food' },
                { title: 'Fast hunger with frequent acidity', desc: 'Feels burning/acidity if meals are delayed' },
                { title: 'Slow appetite and heavy feeling', desc: 'Takes long time to feel hungry, heavy after food' },
                { title: 'Mostly regular and comfortable', desc: 'Timely hunger, smooth digestion with no issues' }
              ].map((item) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setDigestionAppetite(item.title)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    digestionAppetite === item.title
                      ? 'bg-[#146356] text-white border-[#146356] shadow-xs'
                      : 'bg-[#F4FBF9] text-[#0D2B3E] border-[#DCEAE7] hover:bg-slate-100'
                  }`}
                >
                  <p className="text-xs font-bold">{item.title}</p>
                  <p className={`text-[11px] mt-0.5 ${digestionAppetite === item.title ? 'text-teal-100' : 'text-slate-500'}`}>
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-[#DCEAE7]">
            <button
              type="button"
              onClick={() => setCurrentStep(5)}
              className="px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(7)}
              className="bg-[#146356] hover:bg-[#0f4d43] text-white font-bold py-3.5 px-7 rounded-2xl flex items-center gap-2 text-sm shadow-sm transition-colors"
            >
              <span>Next: Sleep & Triggers</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SCREEN 7: SLEEP & WHAT MAKES IT WORSE
      ────────────────────────────────────────────────────────────── */}
      {currentStep === 7 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCEAE7] shadow-sm space-y-6 animate-fadeIn">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#146356] uppercase tracking-wider">
              7. Sleep & Triggers • नींद और बढ़ाने वाले कारण
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0D2B3E]">
              Ask about sleep and aggravating triggers
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Find out how they sleep and what factors make their discomfort worse.
            </p>
          </div>

          {/* Sleep Quality */}
          <div className="space-y-2.5 pt-2">
            <label className="text-xs font-bold text-[#0D2B3E] block">
              Ask: "How is your sleep?"
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                'Light and easily broken',
                'Hard to fall asleep',
                'Deep and heavy',
                'Normal and restful'
              ].map((slp) => (
                <button
                  key={slp}
                  type="button"
                  onClick={() => setSleepQuality(slp)}
                  className={`p-3.5 rounded-2xl text-xs font-bold border text-left transition-all ${
                    sleepQuality === slp
                      ? 'bg-[#146356] text-white border-[#146356] shadow-xs'
                      : 'bg-[#F4FBF9] text-[#0D2B3E] border-[#DCEAE7] hover:bg-slate-100'
                  }`}
                >
                  {slp}
                </button>
              ))}
            </div>
          </div>

          {/* Aggravating Triggers */}
          <div className="space-y-2.5 pt-2">
            <label className="text-xs font-bold text-[#0D2B3E] block">
              Ask: "Does cold weather, oily food, or exertion make it worse?" (Select all that apply)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                'Cold weather or morning chill',
                'Oily, fried or spicy food',
                'Physical exertion or walking',
                'Mental stress or worry',
                'Rainy or humid weather',
                'Skipping or delaying meals'
              ].map((factor) => {
                const isChecked = aggravatingTriggers.includes(factor);
                return (
                  <button
                    key={factor}
                    type="button"
                    onClick={() => toggleTrigger(factor)}
                    className={`p-3.5 rounded-2xl text-xs font-semibold border text-left flex items-center gap-3 transition-all ${
                      isChecked
                        ? 'bg-[#E4EFEC] text-[#146356] border-[#146356] font-bold'
                        : 'bg-[#F4FBF9] text-slate-700 border-[#DCEAE7] hover:bg-slate-100'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center border ${
                        isChecked ? 'bg-[#146356] border-[#146356] text-white' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span>{factor}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-[#DCEAE7]">
            <button
              type="button"
              onClick={() => setCurrentStep(6)}
              className="px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(8)}
              className="bg-[#146356] hover:bg-[#0f4d43] text-white font-bold py-3.5 px-7 rounded-2xl flex items-center gap-2 text-sm shadow-sm transition-colors"
            >
              <span>Next: Current Medicines</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SCREEN 8: CURRENT MEDICINES & REMEDIES
      ────────────────────────────────────────────────────────────── */}
      {currentStep === 8 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCEAE7] shadow-sm space-y-6 animate-fadeIn">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#146356] uppercase tracking-wider">
              8. Current Medicines • वर्तमान दवाइयां
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0D2B3E]">
              Are they currently taking any medicines or home remedies?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Note down any regular allopathic pills, Ayurvedic syrups, or home herbal remedies.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3">
              {(['Yes', 'No'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setTakingMedicines(opt)}
                  className={`py-3 px-8 rounded-2xl text-xs font-bold border transition-all ${
                    takingMedicines === opt
                      ? 'bg-[#146356] text-white border-[#146356] shadow-xs'
                      : 'bg-[#F4FBF9] text-[#0D2B3E] border-[#DCEAE7] hover:bg-slate-100'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {takingMedicines === 'Yes' && (
              <div className="space-y-2 pt-2 animate-fadeIn">
                <label className="text-xs font-bold text-[#0D2B3E] block">
                  Note medicine names or remedies:
                </label>
                <textarea
                  rows={3}
                  value={medicineDetails}
                  onChange={(e) => setMedicineDetails(e.target.value)}
                  placeholder="e.g. Daily BP tablet (Amlodipine), morning ginger tea, joint oil..."
                  className="w-full p-4 bg-[#F4FBF9] border border-[#DCEAE7] rounded-2xl text-xs sm:text-sm text-[#0D2B3E] focus:outline-none focus:ring-2 focus:ring-[#146356] focus:bg-white"
                />
              </div>
            )}
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-[#DCEAE7]">
            <button
              type="button"
              onClick={() => setCurrentStep(7)}
              className="px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(9)}
              className="bg-[#146356] hover:bg-[#0f4d43] text-white font-bold py-3.5 px-7 rounded-2xl flex items-center gap-2 text-sm shadow-sm transition-colors"
            >
              <span>Next: Review Summary</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SCREEN 9: PLAIN-LANGUAGE SUMMARY (PRE-SUBMIT)
      ────────────────────────────────────────────────────────────── */}
      {currentStep === 9 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCEAE7] shadow-sm space-y-6 animate-fadeIn">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#146356] uppercase tracking-wider">
              9. Review Summary • विवरण की पुष्टि
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0D2B3E]">
              Confirm recorded details with the patient
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Read these everyday points back to the patient before submitting them to the doctor's queue.
            </p>
          </div>

          {/* Everyday Review Cards */}
          <div className="space-y-4">
            
            {/* Patient Header Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#E4EFEC] border border-[#146356]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-base font-extrabold text-[#0D2B3E]">
                  {fullName || 'Walk-in Patient'} ({age || '58'}y, {gender})
                </p>
                <p className="text-xs text-[#146356] font-bold mt-0.5">
                  Phone: {phone || '+91 98112 34567'} • Language: {language} • Stream: {careStream === 'AYURVEDA' ? 'Ayurveda OPD' : 'General OPD'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCurrentStep(isExistingPatient ? 1 : 2)}
                className="px-3 py-1.5 bg-white border border-[#DCEAE7] text-[#146356] font-bold text-xs rounded-xl hover:bg-[#E4EFEC]"
              >
                Edit Info
              </button>
            </div>

            {/* Plain-Language Recorded Points */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#F4FBF9] border border-[#DCEAE7] space-y-3.5 text-xs sm:text-sm text-[#0D2B3E]">
              
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#146356] mt-2 flex-shrink-0" />
                <div>
                  <strong className="font-bold">Main Problem: </strong>
                  <span>{mainProblem === 'Other' ? customProblem : mainProblem} located in {affectedRegion === 'Other' ? customRegion : affectedRegion}.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#146356] mt-2 flex-shrink-0" />
                <div>
                  <strong className="font-bold">Body Type: </strong>
                  <span>{bodyFrame}.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#146356] mt-2 flex-shrink-0" />
                <div>
                  <strong className="font-bold">Digestion & Appetite: </strong>
                  <span>{digestionAppetite}.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#146356] mt-2 flex-shrink-0" />
                <div>
                  <strong className="font-bold">Sleep Quality: </strong>
                  <span>{sleepQuality}.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#146356] mt-2 flex-shrink-0" />
                <div>
                  <strong className="font-bold">Makes it Worse: </strong>
                  <span>{aggravatingTriggers.join(', ') || 'None reported'}.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#146356] mt-2 flex-shrink-0" />
                <div>
                  <strong className="font-bold">Current Medicines: </strong>
                  <span>{takingMedicines === 'Yes' ? medicineDetails : 'No current medicines'}.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#146356] mt-2 flex-shrink-0" />
                <div>
                  <strong className="font-bold">Old Hospital Papers: </strong>
                  <span>
                    {attachedPapers.length > 0
                      ? `${attachedPapers.length} document photo(s) attached (${attachedPapers.map(d => d.name).join(', ')})`
                      : 'No previous papers brought today'}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Big Primary Submission Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#DCEAE7]">
            <button
              type="button"
              onClick={() => setCurrentStep(8)}
              className="w-full sm:w-auto px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Make Changes</span>
            </button>

            <button
              type="button"
              onClick={handleSubmitToIntake}
              className="w-full sm:w-auto bg-[#146356] hover:bg-[#0f4d43] text-white font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-2 text-sm sm:text-base shadow-md transition-all"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Submit to Doctor's Queue</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SCREEN 10: QUEUE TOKEN HANDOFF (EXACT PATIENT TOKEN SCREEN DESIGN)
      ────────────────────────────────────────────────────────────── */}
      {currentStep === 10 && (
        <div className="min-h-[80vh] py-12 px-4 sm:px-6 flex items-center justify-center relative z-10 animate-fadeIn">
          <div className="max-w-lg w-full space-y-8 text-center">
            
            {/* Simple, Calm Checkmark Icon & Confirmation Text */}
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#E4EFEC] text-[#146356] flex items-center justify-center mx-auto border border-[#9FDCD1]">
                <CheckCircle2 className="w-8 h-8 stroke-[2]" />
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-[#0D2B3E] tracking-tight">
                  Intake Submitted Successfully
                </h1>
                <p className="text-xs text-slate-500">
                  Consultation credentials generated for {submittedPatientName || fullName || 'Patient'}.
                </p>
              </div>
            </div>

            {/* Token & OTP Prominent Card */}
            <div className="bg-white rounded-3xl border border-[#DCEAE7] shadow-xs p-7 sm:p-8 space-y-6 text-center">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 pb-2">
                
                {/* Token Block */}
                <div className="space-y-1 sm:pr-4">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                    OPD Token ID
                  </span>
                  <div className="text-3xl sm:text-4xl font-mono font-black text-[#146356] tracking-tight py-1">
                    #{generatedToken}
                  </div>
                  <p className="text-[11px] font-bold text-[#146356]">{assignedRoom}</p>
                </div>

                {/* OTP Block */}
                <div className="space-y-1 pt-3 sm:pt-0 sm:pl-4">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-[#146356]" />
                    <span>Doctor Access OTP</span>
                  </span>
                  <div className="text-3xl sm:text-4xl font-mono font-black text-[#0D2B3E] tracking-widest py-1">
                    {generatedOtp}
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">Expires after consultation</p>
                </div>

              </div>

              {/* Worker Facilitator Action Box */}
              <div className="p-3.5 rounded-2xl bg-[#F4FBF9] border border-[#DCEAE7] text-xs text-slate-600 text-left space-y-1">
                <p className="font-bold text-[#0D2B3E] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#146356]" />
                  <span>Worker Facilitator Action</span>
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Please write this token number and OTP on the patient's paper slip or hand them their printed token slip before they proceed to {assignedRoom}.
                </p>
              </div>

              {/* OPD Center Information */}
              <div className="border-t border-b border-slate-100 py-3.5 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400">Patient:</span>
                  <span className="font-semibold text-[#0D2B3E] truncate">{submittedPatientName || fullName || 'Rameshwar Sharma'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400">Hospital / Facility:</span>
                  <span className="font-semibold text-[#0D2B3E] truncate max-w-[240px]">{selectedHospital.name}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400">Consultation Wing:</span>
                  <span className="font-semibold text-[#146356] truncate">{assignedRoom}</span>
                </div>
              </div>

              {/* Action Buttons: Copy, Print, SMS */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`Token: #${generatedToken} | Access OTP: ${generatedOtp}`);
                    showToast({
                      type: 'info',
                      title: 'Credentials Copied',
                      message: `Token #${generatedToken} and OTP ${generatedOtp} copied to clipboard.`
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Token & OTP</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showToast({
                      type: 'success',
                      title: 'SMS Sent',
                      message: `Token #${generatedToken} & OTP ${generatedOtp} sent to ${phone || 'patient mobile'}.`
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-[#146356]" />
                  <span>Send SMS</span>
                </button>
              </div>

            </div>

            {/* Big Action Button: Assist Next Patient */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleResetForNextPatient}
                className="w-full py-4 px-6 rounded-2xl bg-[#146356] hover:bg-[#0f4d43] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Assist Next Patient</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
