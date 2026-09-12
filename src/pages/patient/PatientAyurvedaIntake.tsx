import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Leaf, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Upload, 
  FileText, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle,
  Activity,
  Flame,
  Moon,
  Zap,
  Layers,
  Pill,
  HeartPulse
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../utils/translations';
import { AudioAloudButton } from '../../components/AudioAloudButton';
import { AyurvedaIntakeData } from '../../types';

export const PatientAyurvedaIntake: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { 
    activePatient, 
    patients, 
    selectedHospital, 
    completeIntake, 
    setActivePatientId, 
    showToast 
  } = useApp();

  const patient = activePatient || patients[0];

  // ── 1. Main Concern (Chief Complaint) ──
  const mainConcernOptions = [
    'Joint / Knee Pain',
    'Digestion / Stomach',
    'Sleep',
    'Stress / Mental Wellbeing',
    'Skin / Hair',
    'Fatigue / Weakness',
    'Other'
  ];
  const [mainConcern, setMainConcern] = useState<string>('Joint / Knee Pain');
  const [customConcern, setCustomConcern] = useState<string>('');

  // ── 2. Affected Body Region ──
  const regionOptions = [
    'Head', 'Neck', 'Shoulder', 'Back', 'Abdomen', 'Hip', 'Knee', 'Leg', 'Other'
  ];
  const [affectedRegion, setAffectedRegion] = useState<string>('Knee');

  // ── 3. Body Build (Deha Prakriti) ──
  const buildOptions = [
    { label: 'Thin / Light (Alpa)', desc: 'Slender, prominent joints, quick movements, dry tendency' },
    { label: 'Medium (Madhya)', desc: 'Moderate build, good muscle tone, balanced symmetry' },
    { label: 'Broad / Sturdy (Pravara)', desc: 'Solid frame, heavy bones, stable joints, tendency to gain weight' }
  ];
  const [bodyBuild, setBodyBuild] = useState<string>('Medium (Madhya)');

  // ── 4. Digestion & Appetite (Agni & Koshta Pariksha) ──
  const agniOptions = [
    { label: 'Irregular / bloating or gas (Vishamagni)', sub: 'Variable appetite, frequent flatulence or constipation' },
    { label: 'Strong / frequent hunger or acidity (Tikshnagni)', sub: 'Intense hunger, burning sensation, acid reflux' },
    { label: 'Slow / heavy after meals (Mandagni)', sub: 'Sluggish digestion, lethargy, coated tongue' },
    { label: 'Mostly regular & balanced (Samagni)', sub: 'Comfortable digestion, timely appetite, healthy bowel' }
  ];
  const [agni, setAgni] = useState<string>('Irregular / bloating or gas (Vishamagni)');

  // ── 5. Sleep Pattern (Nidra) ──
  const sleepOptions = [
    'Light / interrupted',
    'Moderate / sometimes disturbed',
    'Deep / long',
    'Difficulty falling asleep'
  ];
  const [sleepPattern, setSleepPattern] = useState<string>('Moderate / sometimes disturbed');

  // ── 6. Physical Activity Level (Vyayama) ──
  const activityOptions = [
    { label: 'Very active', desc: 'Daily intense exercise, sports, or demanding physical labor' },
    { label: 'Moderately active', desc: 'Regular walking, light yoga, or active household routines' },
    { label: 'Mostly sedentary', desc: 'Desk job, prolonged sitting, minimal physical movement' }
  ];
  const [activityLevel, setActivityLevel] = useState<string>('Moderately active');

  // ── 7. Aggravating Factors (Hetu / Triggers) ──
  const hetuOptions = [
    'Cold weather',
    'Irregular meals',
    'Spicy food',
    'Fried / oily food',
    'Stress',
    'Lack of sleep',
    'Physical inactivity',
    'Other'
  ];
  const [selectedHetu, setSelectedHetu] = useState<string[]>(['Cold weather', 'Stress']);

  const toggleHetu = (item: string) => {
    setSelectedHetu(prev => 
      prev.includes(item) ? prev.filter(h => h !== item) : [...prev, item]
    );
  };

  // ── 8. Dosha Phenotype Baseline ──
  const vataTraits = ['Dryness', 'Gas / bloating', 'Irregular routine', 'Restlessness'];
  const pittaTraits = ['Acidity / burning', 'Feeling hot', 'Irritability', 'Strong appetite'];
  const kaphaTraits = ['Heaviness', 'Sluggishness', 'Excess sleep', 'Slow digestion'];

  const [selectedVata, setSelectedVata] = useState<string[]>(['Gas / bloating', 'Dryness']);
  const [selectedPitta, setSelectedPitta] = useState<string[]>([]);
  const [selectedKapha, setSelectedKapha] = useState<string[]>(['Heaviness']);

  const toggleTrait = (trait: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    setList(prev => prev.includes(trait) ? prev.filter(t => t !== trait) : [...prev, trait]);
  };

  // ── 9. Current Medications & Cross-System Safety ──
  const medOptions: ('None' | 'Allopathic Medicines' | 'Ayurvedic Formulations' | 'Both')[] = [
    'None', 'Allopathic Medicines', 'Ayurvedic Formulations', 'Both'
  ];
  const [medicationType, setMedicationType] = useState<'None' | 'Allopathic Medicines' | 'Ayurvedic Formulations' | 'Both'>('Allopathic Medicines');
  const [medicationDetails, setMedicationDetails] = useState<string>('Painkiller (Paracetamol 650mg SOS)');
  const [prescriptionFileName, setPrescriptionFileName] = useState<string>('');

  // ── 10. Existing Conditions & Prior Reports (Roga Itihasa) ──
  const conditionOptions = [
    'Diabetes',
    'Hypertension',
    'Thyroid',
    'Joint Condition',
    'Digestive Condition',
    'Other',
    'None'
  ];
  const [selectedConditions, setSelectedConditions] = useState<string[]>(['Joint Condition']);
  const [reportFileName, setReportFileName] = useState<string>('');

  const toggleCondition = (cond: string) => {
    if (cond === 'None') {
      setSelectedConditions(['None']);
      return;
    }
    setSelectedConditions(prev => {
      const filtered = prev.filter(c => c !== 'None');
      return filtered.includes(cond) ? filtered.filter(c => c !== cond) : [...filtered, cond];
    });
  };

  // ── Submission Handler ──
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalConcern = mainConcern === 'Other' ? (customConcern.trim() || 'Unspecified Concern') : mainConcern;

    // Calculate primary dosha tendency from baseline selections
    const vataCount = selectedVata.length;
    const pittaCount = selectedPitta.length;
    const kaphaCount = selectedKapha.length;
    let doshaPrimary = 'Vata-Kapha';
    if (vataCount >= pittaCount && vataCount >= kaphaCount) doshaPrimary = 'Vata-dominant';
    else if (pittaCount >= vataCount && pittaCount >= kaphaCount) doshaPrimary = 'Pitta-dominant';
    else doshaPrimary = 'Kapha-dominant';

    const nextQueue = patients.length + 1;
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const token = `AYU-${yy}${mm}${dd}-${String(nextQueue).padStart(3, '0')}`;
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    const structuredAyurveda: AyurvedaIntakeData = {
      mainConcern: finalConcern,
      affectedRegion,
      prakriti: bodyBuild,
      agni,
      nidra: sleepPattern,
      vyayama: activityLevel,
      hetu: selectedHetu,
      doshaBaseline: {
        vata: selectedVata,
        pitta: selectedPitta,
        kapha: selectedKapha
      },
      medications: {
        type: medicationType,
        details: medicationDetails.trim(),
        docName: prescriptionFileName || undefined
      },
      existingConditions: selectedConditions,
      priorReportName: reportFileName || undefined
    };

    const result = completeIntake(
      {
        id: patient?.id,
        name: patient?.name || 'Rameshwar Prasad Sharma',
        age: patient?.age || 58,
        gender: patient?.gender || 'Male',
        phone: patient?.phone || '+91 98112 34567',
        abhaId: patient?.abhaId || '45-9821-4321-7890',
        tokenNumber: token,
        otp,
        chiefComplaint: `${finalConcern} in ${affectedRegion}`,
        careSystem: 'AYURVEDA',
        intakeType: 'ayurveda',
        doshaPrimary,
        ayurvedaIntake: structuredAyurveda,
        vitals: {
          bp: '128/82 mmHg',
          pulse: '76 bpm',
          weight: patient?.vitals?.weight || '70 kg',
          spo2: '98%',
          temperature: '98.4 °F'
        }
      },
      {
        'q-1': finalConcern,
        'q-2': `Affected Region: ${affectedRegion}`,
        'q-3': `Body Build (Deha Prakriti): ${bodyBuild}`,
        'q-4': `Digestion & Agni: ${agni}`,
        'q-5': `Sleep Pattern (Nidra): ${sleepPattern}`,
        'q-6': `Physical Activity (Vyayama): ${activityLevel}`,
        'q-7': `Aggravating Factors (Hetu): ${selectedHetu.join(', ') || 'None reported'}`,
        'q-8': `Dosha Baseline: Vata [${selectedVata.join(', ')}], Pitta [${selectedPitta.join(', ')}], Kapha [${selectedKapha.join(', ')}]`,
        'q-9': `Current Medications: ${medicationType} — ${medicationDetails || 'None'}`,
        'q-10': `Existing Conditions: ${selectedConditions.join(', ')}`
      },
      `Ayurvedic 10-point intake completed. Chief Concern: ${finalConcern} (${affectedRegion}). Agni: ${agni}. Prakriti: ${bodyBuild}.`,
      'AYURVEDA'
    );

    setActivePatientId(result.patient.id);

    showToast({
      type: 'success',
      title: 'Ayurvedic Intake Recorded',
      message: `Token #${token} generated. Clinical dossier ready for Vaidya.`
    });

    navigate('/patient/token', {
      state: {
        token,
        otp,
        hospitalName: selectedHospital.name,
        intakeType: 'ayurveda',
        chiefComplaint: finalConcern,
        affectedRegion
      }
    });
  };

  return (
    <div className="min-h-[85vh] py-10 px-4 sm:px-6 relative z-10 font-sans selection:bg-[#CEF3ED] selection:text-[#0D2B3E]">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Top Navigation & Header */}
        <div className="space-y-3">
          <button
            type="button"
            id="back-to-stream-btn"
            onClick={() => navigate('/patient/intake-path')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#0D2B3E] font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Stream Selection</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CEF3ED] text-[#146356] text-xs font-bold uppercase tracking-wider mb-1.5 border border-[#9FDCD1]">
                <Leaf className="w-3.5 h-3.5" />
                <span>Step 4 · Comprehensive AYUSH Assessment</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0D2B3E] tracking-tight">
                Ayurvedic Clinical Intake
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                10-Point Dashavidha Baseline Assessment for {selectedHospital.name}
              </p>
            </div>

            <AudioAloudButton
              text="Please answer these ten questions regarding your chief complaints, digestion, sleep, and lifestyle habits to assist your Ayurvedic physician."
              label="Audio Guidance"
              alwaysShow={true}
              className="self-start sm:self-auto flex-shrink-0"
            />
          </div>
        </div>

        {/* Main 10-Question Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#DCEAE7] shadow-xs p-6 sm:p-9 space-y-9">

          {/* ══════════════════════════════════════════════════════════════
              ITEM 1: Main Concern (Chief Complaint)
          ══════════════════════════════════════════════════════════════ */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E4EFEC] text-[#146356] font-bold text-xs flex items-center justify-center">
                1
              </span>
              <label className="text-sm font-bold text-[#0D2B3E]">
                What is your primary health concern? (मुख्य स्वास्थ्य समस्या)
              </label>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {mainConcernOptions.map((opt) => {
                const isSelected = mainConcern === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setMainConcern(opt)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer border ${
                      isSelected
                        ? 'bg-[#E4EFEC] border-[#146356] text-[#146356] shadow-2xs ring-1 ring-[#146356]'
                        : 'bg-[#F4FBF9] border-[#DCEAE7] text-slate-700 hover:border-[#146356]/50'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {mainConcern === 'Other' && (
              <div className="pt-2 animate-in fade-in">
                <input
                  type="text"
                  required
                  value={customConcern}
                  onChange={(e) => setCustomConcern(e.target.value)}
                  placeholder="Please describe your specific health concern..."
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-[#DCEAE7] bg-[#F4FBF9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146356]/30 text-[#0D2B3E]"
                />
              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════════════════════
              ITEM 2: Affected Body Region
          ══════════════════════════════════════════════════════════════ */}
          <div className="space-y-3.5 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E4EFEC] text-[#146356] font-bold text-xs flex items-center justify-center">
                2
              </span>
              <label className="text-sm font-bold text-[#0D2B3E]">
                Affected Body Region (प्रभावित शारीरिक स्थान)
              </label>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {regionOptions.map((reg) => {
                const isSelected = affectedRegion === reg;
                return (
                  <button
                    key={reg}
                    type="button"
                    onClick={() => setAffectedRegion(reg)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer border ${
                      isSelected
                        ? 'bg-[#E4EFEC] border-[#146356] text-[#146356] shadow-2xs ring-1 ring-[#146356]'
                        : 'bg-[#F4FBF9] border-[#DCEAE7] text-slate-700 hover:border-[#146356]/50'
                    }`}
                  >
                    {reg}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              ITEM 3: Body Build (Deha Prakriti)
          ══════════════════════════════════════════════════════════════ */}
          <div className="space-y-3.5 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E4EFEC] text-[#146356] font-bold text-xs flex items-center justify-center">
                3
              </span>
              <label className="text-sm font-bold text-[#0D2B3E]">
                Body Build & Frame (देह प्रकृति)
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {buildOptions.map((opt) => {
                const isSelected = bodyBuild === opt.label;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setBodyBuild(opt.label)}
                    className={`p-3.5 rounded-2xl text-left transition-all duration-150 cursor-pointer border flex flex-col justify-between space-y-1.5 ${
                      isSelected
                        ? 'bg-[#E4EFEC] border-[#146356] shadow-2xs ring-1 ring-[#146356]'
                        : 'bg-[#F4FBF9] border-[#DCEAE7] hover:border-[#146356]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0D2B3E]">{opt.label}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#146356]" />}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{opt.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              ITEM 4: Digestion & Appetite (Agni & Koshta Pariksha)
          ══════════════════════════════════════════════════════════════ */}
          <div className="space-y-3.5 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E4EFEC] text-[#146356] font-bold text-xs flex items-center justify-center">
                4
              </span>
              <label className="text-sm font-bold text-[#0D2B3E]">
                Digestion & Appetite (अग्नि एवं कोष्ठ परीक्षा)
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {agniOptions.map((opt) => {
                const isSelected = agni === opt.label;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setAgni(opt.label)}
                    className={`p-3.5 rounded-2xl text-left transition-all duration-150 cursor-pointer border space-y-1 ${
                      isSelected
                        ? 'bg-[#E4EFEC] border-[#146356] shadow-2xs ring-1 ring-[#146356]'
                        : 'bg-[#F4FBF9] border-[#DCEAE7] hover:border-[#146356]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0D2B3E]">{opt.label}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#146356]" />}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{opt.sub}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              ITEM 5: Sleep Pattern (Nidra)
          ══════════════════════════════════════════════════════════════ */}
          <div className="space-y-3.5 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E4EFEC] text-[#146356] font-bold text-xs flex items-center justify-center">
                5
              </span>
              <label className="text-sm font-bold text-[#0D2B3E]">
                Sleep Pattern (निद्रा)
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {sleepOptions.map((opt) => {
                const isSelected = sleepPattern === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSleepPattern(opt)}
                    className={`p-3 rounded-xl text-center text-xs font-semibold transition-all duration-150 cursor-pointer border ${
                      isSelected
                        ? 'bg-[#E4EFEC] border-[#146356] text-[#146356] ring-1 ring-[#146356]'
                        : 'bg-[#F4FBF9] border-[#DCEAE7] text-slate-700 hover:border-[#146356]/40'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              ITEM 6: Physical Activity Level (Vyayama)
          ══════════════════════════════════════════════════════════════ */}
          <div className="space-y-3.5 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E4EFEC] text-[#146356] font-bold text-xs flex items-center justify-center">
                6
              </span>
              <label className="text-sm font-bold text-[#0D2B3E]">
                Physical Activity Level (व्यायाम शक्ति)
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {activityOptions.map((opt) => {
                const isSelected = activityLevel === opt.label;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setActivityLevel(opt.label)}
                    className={`p-3.5 rounded-2xl text-left transition-all duration-150 cursor-pointer border space-y-1 ${
                      isSelected
                        ? 'bg-[#E4EFEC] border-[#146356] shadow-2xs ring-1 ring-[#146356]'
                        : 'bg-[#F4FBF9] border-[#DCEAE7] hover:border-[#146356]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0D2B3E]">{opt.label}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#146356]" />}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{opt.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              ITEM 7: Aggravating Factors (Hetu / Triggers)
          ══════════════════════════════════════════════════════════════ */}
          <div className="space-y-3.5 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#E4EFEC] text-[#146356] font-bold text-xs flex items-center justify-center">
                  7
                </span>
                <label className="text-sm font-bold text-[#0D2B3E]">
                  Aggravating Factors & Triggers (हेतु / लक्षण बढ़ाने वाले कारण)
                </label>
              </div>
              <span className="text-[10px] text-slate-400">Select all that apply</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {hetuOptions.map((hetu) => {
                const isSelected = selectedHetu.includes(hetu);
                return (
                  <button
                    key={hetu}
                    type="button"
                    onClick={() => toggleHetu(hetu)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer border flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#E4EFEC] border-[#146356] text-[#146356] font-bold'
                        : 'bg-[#F4FBF9] border-[#DCEAE7] text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${isSelected ? 'bg-[#146356] border-[#146356] text-white' : 'border-slate-300 bg-white'}`}>
                      {isSelected && <CheckCircle2 className="w-3 h-3" />}
                    </div>
                    <span>{hetu}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              ITEM 8: Dosha Phenotype Baseline (Vata-Pitta-Kapha)
          ══════════════════════════════════════════════════════════════ */}
          <div className="space-y-3.5 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#E4EFEC] text-[#146356] font-bold text-xs flex items-center justify-center">
                  8
                </span>
                <label className="text-sm font-bold text-[#0D2B3E]">
                  Dosha Phenotype Baseline (दोष लक्षण)
                </label>
              </div>
              <span className="text-[10px] text-slate-400">Select attributes you frequently feel</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Group 1: Vata-dominant */}
              <div className="p-3.5 rounded-2xl bg-[#F4FBF9] border border-[#DCEAE7] space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-xs font-bold text-[#146356]">Vata Attributes</span>
                  <span className="text-[10px] text-slate-400">Movement & Dryness</span>
                </div>
                <div className="space-y-1.5">
                  {vataTraits.map((t) => {
                    const isChecked = selectedVata.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => toggleTrait(t, selectedVata, setSelectedVata)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors flex items-center justify-between cursor-pointer border ${
                          isChecked ? 'bg-[#E4EFEC] text-[#146356] border-[#146356]/40 font-bold' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span>{t}</span>
                        {isChecked && <CheckCircle2 className="w-3 h-3 text-[#146356]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Group 2: Pitta-dominant */}
              <div className="p-3.5 rounded-2xl bg-[#F4FBF9] border border-[#DCEAE7] space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-xs font-bold text-amber-800">Pitta Attributes</span>
                  <span className="text-[10px] text-slate-400">Heat & Metabolism</span>
                </div>
                <div className="space-y-1.5">
                  {pittaTraits.map((t) => {
                    const isChecked = selectedPitta.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => toggleTrait(t, selectedPitta, setSelectedPitta)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors flex items-center justify-between cursor-pointer border ${
                          isChecked ? 'bg-amber-50 text-amber-900 border-amber-300 font-bold' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span>{t}</span>
                        {isChecked && <CheckCircle2 className="w-3 h-3 text-amber-700" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Group 3: Kapha-dominant */}
              <div className="p-3.5 rounded-2xl bg-[#F4FBF9] border border-[#DCEAE7] space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-xs font-bold text-sky-800">Kapha Attributes</span>
                  <span className="text-[10px] text-slate-400">Structure & Fluids</span>
                </div>
                <div className="space-y-1.5">
                  {kaphaTraits.map((t) => {
                    const isChecked = selectedKapha.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => toggleTrait(t, selectedKapha, setSelectedKapha)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors flex items-center justify-between cursor-pointer border ${
                          isChecked ? 'bg-sky-50 text-sky-900 border-sky-300 font-bold' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span>{t}</span>
                        {isChecked && <CheckCircle2 className="w-3 h-3 text-sky-700" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              ITEM 9: Current Medications & Cross-System Safety
          ══════════════════════════════════════════════════════════════ */}
          <div className="space-y-3.5 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E4EFEC] text-[#146356] font-bold text-xs flex items-center justify-center">
                9
              </span>
              <label className="text-sm font-bold text-[#0D2B3E]">
                Current Medications (औषध इतिहास)
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {medOptions.map((opt) => {
                const isSelected = medicationType === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setMedicationType(opt)}
                    className={`p-3 rounded-xl text-center text-xs font-semibold transition-all duration-150 cursor-pointer border ${
                      isSelected
                        ? 'bg-[#E4EFEC] border-[#146356] text-[#146356] ring-1 ring-[#146356]'
                        : 'bg-[#F4FBF9] border-[#DCEAE7] text-slate-700 hover:border-[#146356]/40'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Conditional input if medicines selected */}
            {medicationType !== 'None' && (
              <div className="pt-2 space-y-2 animate-in fade-in">
                <label className="text-xs font-semibold text-slate-600">
                  Enter medicine/formulation name or upload prescription photo
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={medicationDetails}
                    onChange={(e) => setMedicationDetails(e.target.value)}
                    placeholder="e.g. Paracetamol 650mg, Amlodipine 5mg, or Yogaraja Guggulu"
                    className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-[#DCEAE7] bg-[#F4FBF9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146356]/30 text-[#0D2B3E]"
                  />
                  <label className="px-4 py-2.5 rounded-xl border border-dashed border-[#146356]/60 bg-[#E4EFEC]/60 hover:bg-[#E4EFEC] text-xs font-semibold text-[#146356] flex items-center justify-center gap-1.5 cursor-pointer flex-shrink-0 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{prescriptionFileName || 'Upload Rx Photo'}</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*,application/pdf"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setPrescriptionFileName(e.target.files[0].name);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════════════════════
              ITEM 10: Existing Conditions & Prior Reports (Roga Itihasa)
          ══════════════════════════════════════════════════════════════ */}
          <div className="space-y-3.5 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#E4EFEC] text-[#146356] font-bold text-xs flex items-center justify-center">
                  10
                </span>
                <label className="text-sm font-bold text-[#0D2B3E]">
                  Existing Conditions & Prior Reports (रोग इतिहास)
                </label>
              </div>
              <span className="text-[10px] text-slate-400">Select all that apply</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {conditionOptions.map((cond) => {
                const isSelected = selectedConditions.includes(cond);
                return (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => toggleCondition(cond)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer border flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#E4EFEC] border-[#146356] text-[#146356] font-bold'
                        : 'bg-[#F4FBF9] border-[#DCEAE7] text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${isSelected ? 'bg-[#146356] border-[#146356] text-white' : 'border-slate-300 bg-white'}`}>
                      {isSelected && <CheckCircle2 className="w-3 h-3" />}
                    </div>
                    <span>{cond}</span>
                  </button>
                );
              })}
            </div>

            {/* File upload pill */}
            <div className="pt-2">
              <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-[#DCEAE7] hover:border-[#146356] bg-[#F4FBF9] hover:bg-[#E4EFEC] text-xs font-semibold text-slate-700 transition-colors cursor-pointer">
                <FileText className="w-4 h-4 text-[#146356]" />
                <span>{reportFileName ? `Attached: ${reportFileName}` : 'Upload recent lab report / discharge paper (optional)'}</span>
                <input
                  type="file"
                  className="hidden"
                  accept="application/pdf,image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setReportFileName(e.target.files[0].name);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-6 border-t border-[#DCEAE7] flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate('/patient/intake-path')}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium"
            >
              ← Cancel & Choose Another Stream
            </button>

            <button
              id="submit-ayurveda-intake-btn"
              type="submit"
              className="w-full sm:w-auto px-9 py-3.5 rounded-2xl bg-[#146356] hover:bg-[#0F4A40] text-white font-bold text-sm shadow-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Submit Ayurvedic Intake & Generate Token</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
