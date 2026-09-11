import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  FileLock2, 
  Mic, 
  FileText, 
  Database, 
  ArrowRight, 
  ArrowLeft, 
  Info,
  CheckCircle2,
  Volume2,
  Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AudioAloudButton } from '../../components/AudioAloudButton';

export const PatientConsent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activePatient, patients, selectedHospital, showToast } = useApp();

  const patient = activePatient || patients[0];
  const [consentChecked, setConsentChecked] = useState(false);

  const consentAudioScript = `Consent Explanation: AyuFlow collects your spoken voice symptoms, uploaded diagnostic documents, and medical history. This information is securely transmitted to ${selectedHospital.name} and linked with the Ayushman Bharat Digital Mission to prepare your OPD case file. You may withdraw this consent at any time by speaking to hospital staff.`;

  const handleContinue = () => {
    if (!consentChecked) {
      showToast({
        type: 'error',
        title: 'Consent Required',
        message: 'Please review and accept the patient data consent terms to proceed.'
      });
      return;
    }

    showToast({
      type: 'success',
      title: 'Consent Recorded',
      message: 'ABDM explicit consent token registered. Proceeding to clinical intake.'
    });

    navigate('/patient/intake');
  };

  return (
    <div className="min-h-[85vh] py-10 px-4 sm:px-6 flex items-center justify-center relative z-10">
      <div className="max-w-2xl w-full space-y-7">
        
        {/* Navigation & Header */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => navigate('/patient/registration')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Registration</span>
          </button>

          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-[11px] font-bold uppercase tracking-wider mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>PS Module D · ABDM Explicit Consent</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Patient Data Consent & Sharing Authorization
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Please review how your health data is gathered, protected, and shared before clinical intake begins.
              </p>
            </div>

            <AudioAloudButton
              text={consentAudioScript}
              label="Audio Explanation"
              alwaysShow={true}
              className="flex-shrink-0"
            />
          </div>
        </div>

        {/* Consent Card Container */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
          
          {/* Section 1: What Data We Collect */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <FileLock2 className="w-4 h-4 text-teal-600" />
              <span>1. What Data Will Be Collected</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Mic className="w-4 h-4" />
                </div>
                <p className="font-bold text-slate-900">Voice & Spoken Symptoms</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Speech dictation transcribed to describe chief complaints and pain severity in your native tongue.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <p className="font-bold text-slate-900">Medical Documents</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Uploaded lab test reports, previous prescriptions, and diagnostic scans for AI extraction.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <p className="font-bold text-slate-900">Health History & Vitals</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Age, biological sex, blood group, duration of illness, and basic vitals for OPD case routing.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Where Your Data Goes */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-teal-600" />
              <span>2. Where Your Data Goes & How It Is Used</span>
            </h2>

            <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100 space-y-2 text-xs">
              <p className="text-slate-800 leading-relaxed">
                Your medical data will be securely transmitted to <strong>{selectedHospital.name}</strong>'s EMR/HIS system. It is also linked to your <strong>Ayushman Bharat Health Account ({patient?.abhaId || 'ABHA ID'})</strong> under the National Health Authority (NHA) framework.
              </p>
              <p className="text-[11px] text-teal-900/80 leading-relaxed">
                • Strictly used by your consulting physician (Vaidya / Allopath) for diagnosis and triage.<br />
                • Encrypted in transit and at rest per Ministry of AYUSH and ABDM security guidelines.<br />
                • No medical data is sold or shared with commercial third parties.
              </p>
            </div>
          </div>

          {/* Section 3: Checkbox Consent Gate */}
          <div className="pt-2 border-t border-slate-100 space-y-4">
            <div className="p-4 rounded-2xl bg-white border-2 border-teal-200/80 hover:border-teal-400 transition-colors shadow-2xs">
              <label className="flex items-start gap-3.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded-lg border-2 border-slate-300 text-teal-600 focus:ring-teal-500/30 focus:ring-2 cursor-pointer transition-all"
                />
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-900 block leading-snug">
                    I consent to sharing this information with {selectedHospital.name} and the Ayushman Bharat Digital Mission (ABDM) for the purpose of this consultation.
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Checking this box records your explicit electronic informed consent token.
                  </p>
                </div>
              </label>
            </div>

            {/* Withdrawal Notice */}
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Withdrawal Notice:</strong> You can withdraw this consent at any time by contacting hospital staff or your consulting physician.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/patient/dashboard')}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium"
            >
              Cancel & Return
            </button>

            <button
              type="button"
              disabled={!consentChecked}
              onClick={handleContinue}
              className={`px-7 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs ${
                consentChecked
                  ? 'bg-teal-600 hover:bg-teal-700 text-white cursor-pointer hover:scale-[1.01] active:scale-98'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Continue to Intake Questionnaire</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
