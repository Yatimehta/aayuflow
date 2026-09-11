import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  CheckCircle2, 
  Copy, 
  Printer, 
  ArrowLeft, 
  ChevronRight,
  KeyRound,
  ShieldCheck
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
  const otp = stateData?.otp || patient?.otp || '4829';
  const hospitalName = stateData?.hospitalName || selectedHospital?.name || 'All India Institute of Ayurveda (AIIA)';

  const handleCopyTokenAndOtp = () => {
    navigator.clipboard.writeText(`Token: ${tokenNumber} | Access OTP: ${otp}`);
    showToast({
      type: 'info',
      title: 'Credentials Copied',
      message: `Token ${tokenNumber} and OTP ${otp} copied to clipboard.`
    });
  };

  return (
    <div className="min-h-[85vh] py-16 px-4 sm:px-6 flex items-center justify-center relative z-10">
      <div className="max-w-lg w-full space-y-8 text-center">
        
        {/* Simple, Calm Checkmark Icon & Confirmation Text */}
        <div className="space-y-3">
          <div className="w-14 h-14 rounded-full bg-[#E4EFEC] text-[#146356] flex items-center justify-center mx-auto border border-[#9FDCD1]">
            <CheckCircle2 className="w-8 h-8 stroke-[2]" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl font-bold text-[#0D2B3E] tracking-tight">
                Intake Submitted Successfully
              </h1>
              <AudioAloudButton text={`Intake submitted successfully. Your consultation token is ${tokenNumber} and access OTP is ${otp}.`} />
            </div>
            <p className="text-xs text-slate-500">
              Your consultation credentials have been generated for {hospitalName}.
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
                {tokenNumber}
              </div>
            </div>

            {/* OTP Block */}
            <div className="space-y-1 pt-3 sm:pt-0 sm:pl-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-[#146356]" />
                <span>Doctor Access OTP</span>
              </span>
              <div className="text-3xl sm:text-4xl font-mono font-black text-[#0D2B3E] tracking-widest py-1">
                {otp}
              </div>
            </div>

          </div>

          {/* OTP Purpose Note */}
          <div className="p-3.5 rounded-2xl bg-[#F4FBF9] border border-[#DCEAE7] text-xs text-slate-600 text-left space-y-1">
            <p className="font-bold text-[#0D2B3E] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#146356]" />
              <span>Share this OTP with your doctor</span>
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              When you enter the consultation room, the doctor will ask for this OTP to securely decrypt and open your clinical dossier on their dashboard.
            </p>
          </div>

          {/* OPD Center Information (Queue slot and wait time removed) */}
          <div className="border-t border-b border-slate-100 py-3.5 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-slate-400">Hospital / Facility:</span>
              <span className="font-semibold text-[#0D2B3E] truncate max-w-[240px]">{hospitalName}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleCopyTokenAndOtp}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Token & OTP</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
          </div>

        </div>

        {/* Back to Dashboard / View Records Secondary Links */}
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
            className="text-[#146356] hover:underline font-semibold inline-flex items-center gap-1"
          >
            <span>View My Records</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
