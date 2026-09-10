import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Phone, 
  FileText, 
  Sparkles, 
  Activity, 
  Heart, 
  Thermometer, 
  Scale, 
  Clock, 
  CheckCircle2, 
  Mic, 
  Send, 
  Plus, 
  ChevronRight, 
  ArrowRight,
  Hospital,
  AlertCircle,
  Leaf,
  Stethoscope,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { VoiceInput } from '../../components/VoiceInput';
import { AISafetyBanner } from '../../components/AISafetyBanner';
import { PriorityFlag } from '../../components/PriorityFlag';
import { MOCK_CLINICAL_QUESTIONS } from '../../data/mockData';
import { generateAIClinicalReport } from '../../utils/aiReportGenerator';
import { CareSystem } from '../../types';

export const WorkerAssistIntake: React.FC = () => {
  const navigate = useNavigate();
  const { 
    patients, 
    activePatient, 
    setActivePatientId, 
    updatePatientClinicalSummary,
    updatePatientStatus,
    addEvidenceReport,
    showToast 
  } = useApp();

  const patient = activePatient || patients[0];
  const [workerCareSystem, setWorkerCareSystem] = useState<CareSystem>(patient.careSystem || 'AYURVEDA');

  // Assistant questionnaire state
  const [answers, setAnswers] = useState<Record<string, string>>({
    'q-1': patient.chiefComplaint || 'Joint Pain & Stiffness (Sandhivata)',
    'q-2': '6 months to 2 years',
    'q-3': 'Cold, dry winter winds (Vata aggravation)',
    'q-4': 'Sluggish / Low hunger; feel heavy even after light meals (Manda Agni)',
    'q-5': 'Hard stools, irregular or tendency towards constipation (Krura Koshtha)',
    'q-6': 'Trouble falling asleep due to active thoughts (Vata disturbance)',
    'q-7': 'Hypertension / Blood Pressure medications'
  });

  // Assistant notes state
  const [workerNotes, setWorkerNotes] = useState(
    'Patient arrived with son. Reports aggravated bilateral knee pain in morning. Cannot sit on floor. No history of fall.'
  );

  // Vitals state
  const [vitals, setVitals] = useState({
    bp: patient.vitals.bp,
    pulse: patient.vitals.pulse,
    weight: patient.vitals.weight,
    spo2: patient.vitals.spo2,
    temperature: patient.vitals.temperature
  });

  // Submit Modal
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Voice assist simulation
  const [isDictating, setIsDictating] = useState(false);
  const handleDictation = () => {
    setIsDictating(true);
    setTimeout(() => {
      setWorkerNotes(prev => prev + ' [Audio Dictated: Patient also complains of mild burning sensation after meals.]');
      setIsDictating(false);
      showToast({
        type: 'info',
        title: 'Voice Transcribed',
        message: 'Speech added to clinical intake observations.'
      });
    }, 1800);
  };

  const handleConfirmSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setIsSubmitModalOpen(false);

      // Generate AI evidence report for this intake
      const report = generateAIClinicalReport({
        patientId: patient.id,
        patientName: patient.name,
        tokenNumber: patient.tokenNumber,
        chiefComplaint: answers['q-1'] || patient.chiefComplaint,
        age: patient.age,
        gender: patient.gender,
        careSystem: workerCareSystem,
        answers
      });
      report.readByDoctor = false;
      addEvidenceReport(report);

      // Update patient clinical summary with AI recommendations & worker notes
      updatePatientClinicalSummary(patient.id, {
        prakriti: report.prakriti,
        vikriti: report.vikriti,
        agni: report.agni,
        koshtha: report.koshtha,
        aiGeneratedNotes: report.findings,
        recommendedTherapies: report.therapies,
        lifestyleAdvice: report.diet,
        doctorNotes: workerNotes ? `Worker Assisted Note: ${workerNotes}` : undefined
      });

      updatePatientStatus(patient.id, 'Processing', workerNotes);
      showToast({
        type: 'success',
        title: 'Intake Dossier Dispatched',
        message: `Token ${patient.tokenNumber} (${patient.name}) sent to doctor's active consultation queue.`
      });
      navigate('/worker/queue');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Patient Switcher */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-brand-border shadow-soft flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-blue-dark bg-brand-blue-light px-2.5 py-1 rounded-full">
              Assisted Intake Desk
            </span>
            <span className="text-xs font-mono font-bold text-brand-teal-dark bg-brand-teal-light px-2 py-0.5 rounded-md">
              {patient.tokenNumber}
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-brand-heading mt-1">
            Split-View Clinical Intake Assistant
          </h1>
        </div>

        {/* Care Stream Toggle & Dropdown */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 p-1 bg-brand-bg rounded-2xl border border-brand-border">
            <button
              type="button"
              onClick={() => setWorkerCareSystem('AYURVEDA')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                workerCareSystem === 'AYURVEDA'
                  ? 'bg-emerald-600 text-white shadow-soft'
                  : 'text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <Leaf className="w-3.5 h-3.5" />
              <span>Ayurveda</span>
            </button>
            <button
              type="button"
              onClick={() => setWorkerCareSystem('ALLOPATHY')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                workerCareSystem === 'ALLOPATHY'
                  ? 'bg-sky-600 text-white shadow-soft'
                  : 'text-sky-800 hover:bg-sky-50'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Allopathy</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-brand-muted hidden md:inline">
              Active Patient:
            </label>
            <select
              value={patient.id}
              onChange={(e) => setActivePatientId(e.target.value)}
              className="text-xs font-semibold bg-brand-bg text-brand-heading border border-brand-border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.tokenNumber} - {p.name} ({p.status})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* SPLIT VIEW CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT PANEL: Patient Demographics, Vitals & Documents (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Patient Card */}
          <div className="bg-white rounded-3xl p-5 border border-brand-border shadow-soft space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-teal-light text-brand-teal-dark font-bold text-base flex items-center justify-center">
                  {patient.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-base font-bold text-brand-heading">{patient.name}</h2>
                  <p className="text-xs text-brand-muted">
                    {patient.age} yrs • {patient.gender} • Blood: {patient.bloodGroup}
                  </p>
                </div>
              </div>
              <StatusBadge status={patient.status} size="sm" />
            </div>

            <div className="p-3.5 bg-brand-bg rounded-2xl border border-brand-border/80 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-brand-muted">Mobile:</span>
                <span className="font-medium text-brand-heading">{patient.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">ABHA ID:</span>
                <span className="font-mono text-brand-heading">{patient.abhaId || 'Linked to Mobile'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">Address:</span>
                <span className="font-medium text-brand-heading truncate max-w-[200px]">{patient.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">Language:</span>
                <span className="font-medium text-brand-teal-dark">{patient.preferredLanguage}</span>
              </div>
            </div>
          </div>

          {/* Vitals Input Card */}
          <div className="bg-white rounded-3xl p-5 border border-brand-border shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-brand-heading uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-brand-teal-dark" />
                <span>Recorded OPD Vitals</span>
              </h3>
              <span className="text-[10px] text-brand-muted">Editable</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="p-2.5 rounded-xl bg-brand-bg border border-brand-border">
                <span className="text-[10px] text-brand-muted flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-400" />
                  BP (mmHg)
                </span>
                <input
                  type="text"
                  value={vitals.bp}
                  onChange={(e) => setVitals({ ...vitals, bp: e.target.value })}
                  className="w-full text-xs font-bold text-brand-heading bg-transparent mt-0.5 focus:outline-none"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-brand-bg border border-brand-border">
                <span className="text-[10px] text-brand-muted flex items-center gap-1">
                  <Activity className="w-3 h-3 text-brand-teal-dark" />
                  Pulse (bpm)
                </span>
                <input
                  type="text"
                  value={vitals.pulse}
                  onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })}
                  className="w-full text-xs font-bold text-brand-heading bg-transparent mt-0.5 focus:outline-none"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-brand-bg border border-brand-border">
                <span className="text-[10px] text-brand-muted flex items-center gap-1">
                  <Scale className="w-3 h-3 text-brand-blue-dark" />
                  Weight
                </span>
                <input
                  type="text"
                  value={vitals.weight}
                  onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                  className="w-full text-xs font-bold text-brand-heading bg-transparent mt-0.5 focus:outline-none"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-brand-bg border border-brand-border">
                <span className="text-[10px] text-brand-muted flex items-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-500" />
                  SpO2 (%)
                </span>
                <input
                  type="text"
                  value={vitals.spo2}
                  onChange={(e) => setVitals({ ...vitals, spo2: e.target.value })}
                  className="w-full text-xs font-bold text-brand-heading bg-transparent mt-0.5 focus:outline-none"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-brand-bg border border-brand-border col-span-2 sm:col-span-1">
                <span className="text-[10px] text-brand-muted flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-amber-500" />
                  Temperature
                </span>
                <input
                  type="text"
                  value={vitals.temperature}
                  onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                  className="w-full text-xs font-bold text-brand-heading bg-transparent mt-0.5 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Attached Documents Drawer */}
          <div className="bg-white rounded-3xl p-5 border border-brand-border shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-brand-heading uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-brand-blue-dark" />
                <span>Uploaded Documents ({patient.documents.length})</span>
              </h3>
              <button
                onClick={() => navigate('/worker/documents')}
                className="text-[11px] text-brand-teal-dark font-semibold hover:underline"
              >
                + Add Scan
              </button>
            </div>

            {patient.documents.length === 0 ? (
              <p className="text-xs text-brand-muted italic">No past reports uploaded yet.</p>
            ) : (
              <div className="space-y-2">
                {patient.documents.map(doc => (
                  <div key={doc.id} className="p-2.5 rounded-xl bg-brand-bg border border-brand-border flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <FileText className="w-3.5 h-3.5 text-brand-teal-dark flex-shrink-0" />
                      <span className="truncate font-medium text-brand-heading">{doc.name}</span>
                    </div>
                    <span className="text-[10px] text-brand-muted flex-shrink-0">{doc.size}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT PANEL: Guided Conversation & Questionnaire Assist (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-soft space-y-6">
            
            <div className="border-b border-brand-border pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-brand-heading">Guided AYUSH Clinical Questions</h3>
                <p className="text-xs text-brand-muted">Assistant verbally asks patient and marks responses.</p>
              </div>
              <button
                onClick={handleDictation}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isDictating ? 'bg-red-500 text-white animate-pulse' : 'bg-brand-blue-light text-brand-blue-dark hover:bg-brand-blue/20'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{isDictating ? 'Transcribing...' : 'Dictate Notes'}</span>
              </button>
            </div>

            {/* Safety Banner */}
            <AISafetyBanner />

            {/* Severe Priority Alert */}
            {(answers['q-4']?.toLowerCase().includes('severe') || answers['q-1']?.toLowerCase().includes('severe')) && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <div>
                    <span className="font-bold block">Triage Priority Triggered</span>
                    <span className="text-[11px] text-amber-800">Severe symptom reported. Case flagged with priority status.</span>
                  </div>
                </div>
                <PriorityFlag pulse={true} size="sm" />
              </div>
            )}

            {/* Questions List */}
            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2">
              {MOCK_CLINICAL_QUESTIONS.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-2xl bg-brand-bg border border-brand-border space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-brand-heading">
                      {idx + 1}. {q.question}
                    </span>
                    <span className="text-[10px] font-semibold text-brand-teal-dark bg-white px-2 py-0.5 rounded-md border border-brand-border">
                      {q.category}
                    </span>
                  </div>

                  <p className="text-[11px] text-brand-muted">
                    Principle: {q.ayushContext}
                  </p>

                  {/* Options Chips */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt, i) => {
                      const isSelected = answers[q.id] === opt;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                          className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                            isSelected
                              ? 'border-brand-teal bg-white font-bold text-brand-teal-dark shadow-xs ring-2 ring-brand-teal/20'
                              : 'border-brand-border/80 bg-white hover:border-brand-border text-brand-body'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Worker Extra Observations with Unified VoiceInput */}
              <div className="p-4 rounded-2xl bg-brand-bg border border-brand-border">
                <VoiceInput
                  value={workerNotes}
                  onChange={(val) => setWorkerNotes(val)}
                  label="Assistant Desk Observations & Dictation"
                  language="Hindi / English"
                  placeholder="Record visible symptoms, gait difficulty, tongue coating, or patient demeanor..."
                  samplePhrases={[
                    'Patient arrived with son. Reports aggravated bilateral knee pain in morning.',
                    'Patient displays mild retrosternal burning and sour taste in mouth.',
                    'Patient reports increased frequency of urination at night with weakness.',
                    'Patient has persistent dry cough since 2 weeks, throat scratchiness.'
                  ]}
                  rows={3}
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-brand-border flex items-center justify-between">
              <span className="text-xs text-brand-muted">
                {Object.keys(answers).length} questions marked
              </span>

              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white text-xs font-bold shadow-soft-lg transition-all"
              >
                <span>Review & Submit to Doctor Queue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Confirmation & Review Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Confirm Intake Submission"
        subtitle={`Dispatch clinical dossier for ${patient.name} (${patient.tokenNumber})`}
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-brand-bg rounded-xl border border-brand-border space-y-1.5">
            <div className="flex justify-between">
              <span className="text-brand-muted">Patient:</span>
              <span className="font-bold text-brand-heading">{patient.name} ({patient.age} yrs)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Assigned Token:</span>
              <span className="font-mono font-bold text-brand-teal-dark">{patient.tokenNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Chief Complaint:</span>
              <span className="font-medium text-brand-heading">{answers['q-1'] || patient.chiefComplaint}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Vitals:</span>
              <span className="font-medium">BP {vitals.bp} • Pulse {vitals.pulse} • Wt {vitals.weight}</span>
            </div>
          </div>

          <div className="p-3 bg-brand-teal-light/40 border border-brand-teal/40 rounded-xl space-y-1">
            <p className="font-bold text-brand-teal-dark flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Automatic AI Actions upon Submission:</span>
            </p>
            <ul className="list-disc list-inside text-brand-body space-y-0.5 pl-1">
              <li>Prakriti & Dosha synthesis generated from logged answers.</li>
              <li>Patient status updated to <strong>Processing / Ready for Doctor</strong>.</li>
              <li>Visible in Doctor Kayachikitsa OPD dashboard queue immediately.</li>
            </ul>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-brand-border">
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-brand-border text-brand-heading hover:bg-brand-bg font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSubmit}
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white font-bold shadow-soft flex items-center gap-2"
            >
              {submitting ? 'Dispatching...' : 'Confirm & Dispatch'}
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
