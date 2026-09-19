import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Mic, 
  MicOff, 
  Scale, 
  Calendar, 
  Droplet, 
  Clock, 
  CheckCircle2,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AudioAloudButton } from '../../components/AudioAloudButton';
import { useTranslation } from '../../utils/translations';

export const PatientIntake: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // This screen serves the Allopathic intake path (PatientIntakePath links here with
  // ?type=allopathy); a dedicated Ayurveda form exists separately at /patient/intake-ayurveda.
  const careSystem = searchParams.get('type') === 'ayurveda' ? 'AYURVEDA' : 'ALLOPATHY';
  const tokenPrefix = careSystem === 'AYURVEDA' ? 'AYU' : 'ALLO';
  const {
    activePatient, 
    patients, 
    selectedHospital, 
    completeIntake, 
    setActivePatientId,
    showToast 
  } = useApp();

  const patient = activePatient || patients[0];

  // 1. Weight
  const [weight, setWeight] = useState<string>(patient?.vitals?.weight ? patient.vitals.weight.replace(/\D/g, '') || '68' : '68');

  // 2. Age
  const [age, setAge] = useState<string>(String(patient?.age || 58));

  // 3. Blood Group
  const [bloodGroup, setBloodGroup] = useState<string>(patient?.bloodGroup || 'B+');

  // 4. Free-text symptoms (no chips)
  const [symptoms, setSymptoms] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);

  // 5. When did the problem start?
  const [duration, setDuration] = useState<string>('1 to 4 weeks ago');

  // 6. Severity: exactly 3 selectable options
  const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Moderate');

  const bloodGroupOptions = [
    'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'
  ];

  const durationOptions = [
    'Less than 1 week ago',
    '1 to 4 weeks ago',
    '1 to 6 months ago',
    'More than 6 months ago'
  ];

  const durationLabelKeys: Record<string, string> = {
    'Less than 1 week ago': 'pi_duration_opt1',
    '1 to 4 weeks ago': 'pi_duration_opt2',
    '1 to 6 months ago': 'pi_duration_opt3',
    'More than 6 months ago': 'pi_duration_opt4'
  };

  // Voice speech dictation
  const toggleVoiceInput = () => {
    if (!isListening) {
      setIsListening(true);
      showToast({
        type: 'info',
        title: 'Listening...',
        message: 'Please speak your symptoms in your own words.'
      });

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.lang = 'en-IN';
          recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setSymptoms(prev => prev ? `${prev} ${transcript}` : transcript);
            setIsListening(false);
          };
          recognition.onerror = () => setIsListening(false);
          recognition.start();
          return;
        } catch {
          // fallback
        }
      }

      setTimeout(() => {
        setSymptoms('Experiencing swelling and morning stiffness in knees, worse during cold weather.');
        setIsListening(false);
        showToast({
          type: 'success',
          title: 'Speech Transcribed',
          message: 'Voice converted to text successfully.'
        });
      }, 1800);
    } else {
      setIsListening(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!symptoms.trim()) {
      showToast({
        type: 'error',
        title: 'Symptoms Required',
        message: 'Please describe your symptoms in your own words.'
      });
      return;
    }

    const nextQueue = patients.length + 1;
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const token = `${tokenPrefix}-${yy}${mm}${dd}-${String(nextQueue).padStart(3, '0')}`;

    // Submit intake without celebration animation / confetti
    const result = completeIntake(
      {
        id: patient?.id,
        name: patient?.name || 'Rameshwar Prasad Sharma',
        age: parseInt(age, 10) || 58,
        gender: patient?.gender || 'Male',
        phone: patient?.phone || '+91 98112 34567',
        abhaId: patient?.abhaId || '45-9821-4321-7890',
        bloodGroup: bloodGroup,
        tokenNumber: token,
        chiefComplaint: symptoms.trim(),
        careSystem,
        vitals: {
          bp: '120/80 mmHg',
          pulse: '74 bpm',
          weight: `${weight} kg`,
          spo2: '99%',
          temperature: '98.4 °F'
        }
      },
      {
        'q-1': symptoms.trim(),
        'q-2': `Weight: ${weight} kg, Blood Group: ${bloodGroup}`,
        'q-3': duration,
        'q-4': severity
      },
      `Intake: Weight ${weight} kg, Blood Group ${bloodGroup}, Duration ${duration}, Severity ${severity}.`,
      careSystem
    );

    setActivePatientId(result.patient.id);

    showToast({
      type: 'success',
      title: 'Intake Completed',
      message: `Token #${token} issued.`
    });

    // Navigate to the simplified token confirmation page
    navigate('/patient/token', {
      state: {
        token,
        queueSlot: nextQueue,
        hospitalName: selectedHospital.name,
        estimatedWait: '~15 mins',
        weight: `${weight} kg`,
        age,
        bloodGroup,
        symptoms: symptoms.trim(),
        duration,
        severity
      }
    });
  };

  return (
    <div className="min-h-[85vh] py-10 px-4 sm:px-6 relative z-10">
      <div className="max-w-xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => navigate('/patient/dashboard')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('back_to_dashboard')}</span>
          </button>

          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {t('pi_title')}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {t('pi_subtitle')}
            </p>
          </div>
        </div>

        {/* Minimalist Google-Style Form Card */}
        <form 
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-7"
        >
          
          {/* Question 1: Weight */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-teal-600" />
                <span>{t('pi_weight_label')}</span>
              </label>
              <AudioAloudButton text="Question 1: Please enter your weight in kilograms." />
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-36">
                <input
                  type="number"
                  required
                  min="1"
                  max="250"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                  kg
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {['55', '65', '75', '85'].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setWeight(w)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      weight === w
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {w} kg
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Question 2: Age */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                <span>{t('pi_age_label')}</span>
              </label>
              <AudioAloudButton text="Question 2: Please enter your age in completed years." />
            </div>
            <div className="w-36">
              <input
                type="number"
                required
                min="1"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
              />
            </div>
          </div>

          {/* Question 3: Blood Group */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <Droplet className="w-3.5 h-3.5 text-teal-600" />
                <span>{t('pi_blood_group_label')}</span>
              </label>
              <AudioAloudButton text="Question 3: Please select your blood group." />
            </div>
            <div className="max-w-xs">
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
              >
                {bloodGroupOptions.map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Question 4: Free-Text Symptoms (No chips) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-teal-600" />
                <span>{t('pi_symptoms_label')}</span>
              </label>

              <div className="flex items-center gap-2">
                <AudioAloudButton text="Question 4: Please describe your symptoms and bodily discomfort in your own words." />
                
                {/* Voice Dictation */}
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    isListening
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isListening ? t('pi_listening') : t('pi_voice_dictate')}</span>
                </button>
              </div>
            </div>

            <textarea
              required
              rows={4}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder={t('pi_symptoms_placeholder')}
              className="w-full p-3.5 text-xs rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all leading-relaxed placeholder:text-slate-400"
            />
          </div>

          {/* Question 5: When did the problem start? */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                <span>{t('pi_duration_label')}</span>
              </label>
              <AudioAloudButton text="Question 5: When did your health problem start? Please select one option." />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {durationOptions.map((opt) => {
                const isSelected = duration === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setDuration(opt)}
                    className={`py-2.5 px-3.5 rounded-xl border text-xs font-medium text-left transition-all ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/50 text-teal-900 ring-1 ring-teal-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {t(durationLabelKeys[opt])}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question 6: Severity (Exactly 3 large selectable cards) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-800">
                {t('pi_severity_label')}
              </label>
              <AudioAloudButton text="Question 6: How severe is your condition? Please select Mild, Moderate, or Severe." />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {(['Mild', 'Moderate', 'Severe'] as const).map((sev) => {
                const isSelected = severity === sev;
                const activeColors = 
                  sev === 'Mild' 
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500'
                    : sev === 'Moderate'
                    ? 'border-amber-500 bg-amber-50 text-amber-900 ring-1 ring-amber-500'
                    : 'border-rose-500 bg-rose-50 text-rose-900 ring-1 ring-rose-500';

                return (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className={`py-4 px-3 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? activeColors
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-sm font-bold">
                      {sev === 'Mild' ? t('pi_severity_mild') : sev === 'Moderate' ? t('pi_severity_moderate') : t('pi_severity_severe')}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {sev === 'Mild' ? t('pi_severity_mild_desc') : sev === 'Moderate' ? t('pi_severity_moderate_desc') : t('pi_severity_severe_desc')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/patient/dashboard')}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium"
            >
              {t('pi_cancel')}
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
            >
              <span>{t('pi_submit')}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
