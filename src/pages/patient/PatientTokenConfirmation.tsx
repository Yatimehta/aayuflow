import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  CheckCircle2, 
  Copy, 
  Printer, 
  ArrowLeft, 
  Clock, 
  Hospital as HospitalIcon, 
  ChevronRight,
  FileText,
  Volume2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AudioAloudButton } from '../../components/AudioAloudButton';

export const PatientTokenConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activePatient, patients, selectedHospital, showToast } = useApp();

  const patient = activePatient || patients[0];
  const stateData = location.state as any;

  const tokenNumber = stateData?.token || patient?.tokenNumber || 'AYU-260911-018';
  const queueSlot = stateData?.queueSlot || patient?.queueNumber || 1;
  const hospitalName = stateData?.hospitalName || selectedHospital?.name || 'All India Institute of Ayurveda (AIIA)';
  const estimatedWait = stateData?.estimatedWait || '~15 mins';

  const handleCopyToken = () => {
    navigator.clipboard.writeText(tokenNumber);
    showToast({
      type: 'info',
      title: 'Token Copied',
      message: `Token ${tokenNumber} copied to clipboard.`
    });
  };

  return (
    <div className="min-h-[85vh] py-16 px-4 sm:px-6 flex items-center justify-center relative z-10">
      <div className="max-w-md w-full space-y-8 text-center">
        
        {/* Simple, Calm Checkmark Icon & Confirmation Text */}
        <div className="space-y-3">
          <div className="w-14 h-14 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto border border-teal-100">
            <CheckCircle2 className="w-8 h-8 stroke-[2]" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Intake Submitted Successfully
              </h1>
              <AudioAloudButton text={`Intake submitted successfully. Your consultation token is ${tokenNumber}.`} />
            </div>
            <p className="text-xs text-slate-500">
              Your consultation token has been generated.
            </p>
          </div>
        </div>

        {/* Single, Clean, Prominent Token Card (NO DOCTOR NAME) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-8 space-y-6 text-center">
          
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
              OPD Token ID
            </span>
            <div className="text-4xl sm:text-5xl font-mono font-black text-teal-700 tracking-tight py-1">
              {tokenNumber}
            </div>
          </div>

          <div className="border-t border-b border-slate-100 py-4 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-slate-400">OPD Center:</span>
              <span className="font-medium text-slate-900 truncate max-w-[220px]">{hospitalName}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-slate-400">Queue Position:</span>
              <span className="font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                Slot #{queueSlot}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-slate-400">Estimated Wait:</span>
              <span className="font-semibold text-slate-900">{estimatedWait}</span>
            </div>
          </div>

          {/* Clean Action Buttons */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleCopyToken}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Token</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
          </div>

        </div>

        {/* Bilingual Spoken Audio Confirmation Card (PS Module C requirement) */}
        <div className="bg-gradient-to-r from-emerald-50/90 to-teal-50/80 border border-teal-200/80 rounded-2xl p-4 sm:p-5 text-left space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-teal-700" />
              <span className="text-xs font-bold text-teal-950 uppercase tracking-wider">
                Bilingual Spoken Confirmation (द्विभाषी पुष्टि)
              </span>
            </div>
            <AudioAloudButton 
              text={`आपकी जानकारी सफलतापूर्वक जमा हो गई है। आपका ओपीडी टोकन नंबर ${tokenNumber} है।`}
              label="Listen in Hindi"
              alwaysShow={true}
            />
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-white/80 border border-teal-100">
              <p className="text-slate-800 leading-relaxed font-medium">
                <span className="font-bold text-teal-800">🔊 Confirmation (Hindi):</span> "आपकी जानकारी सफलतापूर्वक जमा हो गई है। आपका ओपीडी टोकन नंबर <strong className="font-mono font-bold text-teal-900">{tokenNumber}</strong> है। कृपया परामर्श के लिए प्रतीक्षा क्षेत्र में बैठें।"
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/50 border border-teal-100/60">
              <p className="text-slate-600 leading-relaxed">
                <span className="font-bold text-slate-700">Confirmation (English):</span> "Your intake information has been recorded successfully. Your OPD consultation token is <strong className="font-mono font-bold text-slate-800">{tokenNumber}</strong>. Please proceed to the waiting area."
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home / View Records Secondary Links */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs">
          <button
            type="button"
            onClick={() => navigate('/patient/dashboard')}
            className="text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Patient Home</span>
          </button>

          <span className="hidden sm:inline text-slate-300">•</span>

          <button
            type="button"
            onClick={() => navigate('/patient/records')}
            className="text-teal-700 hover:underline font-semibold inline-flex items-center gap-1"
          >
            <span>View My Records</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
