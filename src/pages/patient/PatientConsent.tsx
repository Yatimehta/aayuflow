import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  FileLock2, 
  Mic, 
  FileText, 
  Database, 
  ArrowRight, 
  ArrowLeft, 
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AudioAloudButton } from '../../components/AudioAloudButton';

export const PatientConsent: React.FC = () => {
  const navigate = useNavigate();
  const { activePatient, patients, selectedHospital, showToast } = useApp();

  const patient = activePatient || patients[0];
  const [consentChecked, setConsentChecked] = useState(false);
  const [readMoreOpen, setReadMoreOpen] = useState(false);

  const consentAudioScript = `Consent Explanation: Ayucarez collects your spoken voice symptoms, uploaded diagnostic documents, and medical history. This information is securely transmitted to ${selectedHospital.name} and linked with the Ayushman Bharat Digital Mission to prepare your OPD case file.`;

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

    navigate('/patient/intake-path');
  };

  return (
    <div className="min-h-[85vh] py-10 px-4 sm:px-6 flex items-center justify-center relative z-10">
      <div className="max-w-2xl w-full space-y-7">
        
        {/* Navigation & Header */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => navigate('/patient/language')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#0D2B3E] font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Language Selection</span>
          </button>

          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#CEF3ED] text-[#146356] border border-[#9FDCD1] text-[11px] font-bold uppercase tracking-wider mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#146356]" />
                <span>PS Module D · ABDM Explicit Consent</span>
              </div>
              <h1 className="text-2xl font-bold text-[#0D2B3E] tracking-tight">
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
        <div className="bg-white rounded-3xl border border-[#DCEAE7] shadow-xs p-6 sm:p-8 space-y-7">
          
          {/* Section 1: What Data Will Be Collected — Plain instructional list items / info cards (no button affordance) */}
          <div className="space-y-3.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <FileLock2 className="w-4 h-4 text-[#146356]" />
              <span>What Data Will Be Collected</span>
            </h2>

            {/* Plain instructional cards — purely informational, no hover/press button affordance */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-[#F4FBF9] border border-[#DCEAE7] space-y-2 select-text">
                <div className="w-8 h-8 rounded-xl bg-[#E4EFEC] text-[#146356] flex items-center justify-center">
                  <Mic className="w-4 h-4" />
                </div>
                <p className="font-bold text-[#0D2B3E]">Voice & Spoken Symptoms</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Speech dictation transcribed to describe chief complaints and pain severity in your native tongue.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F4FBF9] border border-[#DCEAE7] space-y-2 select-text">
                <div className="w-8 h-8 rounded-xl bg-[#E4EFEC] text-[#146356] flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <p className="font-bold text-[#0D2B3E]">Medical Documents</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Uploaded lab test reports, previous prescriptions, and diagnostic scans for AI extraction.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F4FBF9] border border-[#DCEAE7] space-y-2 select-text">
                <div className="w-8 h-8 rounded-xl bg-[#E4EFEC] text-[#146356] flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <p className="font-bold text-[#0D2B3E]">Health History & Vitals</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Age, biological sex, blood group, duration of illness, and basic vitals for OPD case routing.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Checkbox Consent Gate with collapsed "Read More" Accordion */}
          <div className="pt-4 border-t border-[#DCEAE7] space-y-4">
            <div className="p-4 rounded-2xl bg-white border-2 border-[#DCEAE7] hover:border-[#146356]/60 transition-colors shadow-2xs">
              <label className="flex items-start gap-3.5 cursor-pointer select-none">
                <input
                  id="consent-checkbox"
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded-lg border-2 border-slate-300 text-[#146356] focus:ring-[#146356]/30 focus:ring-2 cursor-pointer transition-all"
                />
                <div className="space-y-1 flex-1">
                  <span className="text-xs font-bold text-[#0D2B3E] block leading-snug">
                    I consent to sharing this information with {selectedHospital.name} and the Ayushman Bharat Digital Mission (ABDM) for the purpose of this consultation.
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Checking this box records your explicit electronic informed consent token.
                  </p>
                </div>
              </label>

              {/* Collapsible "Read more" accordion under consent checkbox */}
              <div className="mt-3 pt-3 border-t border-slate-100 pl-8">
                <button
                  type="button"
                  id="consent-read-more-btn"
                  onClick={() => setReadMoreOpen(!readMoreOpen)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#146356] hover:text-[#0F4A40] transition-colors cursor-pointer"
                >
                  <span>{readMoreOpen ? 'Hide data usage details' : 'Read more about data usage & protection'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${readMoreOpen ? 'rotate-180' : ''}`} />
                </button>

                {readMoreOpen && (
                  <div className="mt-3 p-3.5 rounded-xl bg-[#F4FBF9] border border-[#DCEAE7] text-xs text-slate-700 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
                    <p className="text-[11px] font-bold text-[#0D2B3E] uppercase tracking-wider">
                      Data Usage & Protection Guidelines:
                    </p>
                    <ul className="space-y-1.5 pl-4 list-disc text-slate-600 text-xs">
                      <li>Data is typically used by the consulting physician.</li>
                      <li>Data is encrypted in transit and at rest.</li>
                      <li>No medical data is shared without consent.</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-[#DCEAE7] flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/patient/dashboard')}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium"
            >
              Cancel & Return
            </button>

            <button
              id="consent-continue-btn"
              type="button"
              disabled={!consentChecked}
              onClick={handleContinue}
              className={`px-7 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs ${
                consentChecked
                  ? 'bg-[#146356] hover:bg-[#0F4A40] text-white cursor-pointer hover:scale-[1.01] active:scale-98'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Continue to Stream Selection</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
