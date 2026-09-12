import React, { useState, useEffect, useRef } from 'react';
import { KeyRound, X, AlertCircle, Lock } from 'lucide-react';
import { Patient } from '../types';
import { isAyurvedicRecord } from '../utils/streamClassification';
import { useTranslation } from '../utils/translations';

interface DoctorOtpModalProps {
  isOpen: boolean;
  patient: Patient | null;
  onClose: () => void;
  onSuccess: (patient: Patient) => void;
}

export const DoctorOtpModal: React.FC<DoctorOtpModalProps> = ({
  isOpen,
  patient,
  onClose,
  onSuccess
}) => {
  const { t } = useTranslation();
  const [otpValue, setOtpValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setOtpValue('');
      setErrorMessage('');
      setIsVerifying(false);
      // Auto-focus input on open
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, patient]);

  if (!isOpen || !patient) return null;

  const expectedOtp = patient.otp || '4829';
  const isAyush = isAyurvedicRecord(patient);

  const handleVerify = (otpToVerify?: string | React.FormEvent, e?: React.FormEvent) => {
    if (typeof otpToVerify !== 'string' && otpToVerify?.preventDefault) {
      otpToVerify.preventDefault();
    }
    if (e) e.preventDefault();
    setErrorMessage('');

    const code = typeof otpToVerify === 'string' ? otpToVerify : otpValue;

    if (code.trim().length !== 4) {
      setErrorMessage('Please enter the complete 4-digit numeric access OTP.');
      inputRef.current?.focus();
      return;
    }

    if (code.trim() === expectedOtp) {
      onSuccess(patient);
    } else {
      setErrorMessage("Invalid OTP. Please verify the code displayed on the patient's token screen.");
      inputRef.current?.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setOtpValue(val);
    if (errorMessage) setErrorMessage('');
    if (val.length === 4) {
      handleVerify(val);
    }
  };

  const handleQuickFillDemo = () => {
    setOtpValue(expectedOtp);
    setErrorMessage('');
    handleVerify(expectedOtp);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl border border-[#DCEAE7] shadow-xl overflow-hidden animate-in zoom-in-95 duration-150 relative"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-[#DCEAE7] bg-[#F4FBF9]/70 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-[#E4EFEC] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#E4EFEC] text-[#146356] flex items-center justify-center shadow-2xs">
              <Lock className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0D2B3E]">
                Consultation Access Verification
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Doctor Access Token Protocol · ABDM Security
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleVerify} className="p-6 space-y-5">
          <p className="text-xs text-slate-600 leading-relaxed">
            Enter the 4-digit patient OTP displayed on their intake token screen to decrypt and review the dossier.
          </p>

          {/* Patient Context Strip */}
          <div className="p-3.5 rounded-2xl bg-[#F4FBF9] border border-[#DCEAE7] flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-[#146356] text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                {patient.name.charAt(0)}
              </div>
              <div className="truncate">
                <span className="font-bold text-[#0D2B3E] block truncate">{patient.name}</span>
                <span className="text-[11px] text-slate-500">
                  Token: <strong className="font-mono text-[#0D2B3E]">{patient.tokenNumber}</strong>
                </span>
              </div>
            </div>

            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider flex-shrink-0 ${
              isAyush
                ? 'bg-[#CEF3ED] text-[#146356] border border-[#9FDCD1]'
                : 'bg-sky-50 text-sky-800 border border-sky-200'
            }`}>
              {isAyush ? 'Ayurvedic Intake' : 'Allopathic OPD'}
            </span>
          </div>

          {/* OTP Input Field */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#0D2B3E] uppercase tracking-wider text-center">
              Enter 4-Digit Doctor Access OTP
            </label>
            <div className="relative max-w-[220px] mx-auto">
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                value={otpValue}
                onChange={handleInputChange}
                placeholder="• • • •"
                className="w-full text-center text-2xl sm:text-3xl font-mono font-bold tracking-[0.5em] px-4 py-3 rounded-2xl border-2 border-[#DCEAE7] focus:border-[#146356] focus:outline-none focus:ring-4 focus:ring-[#146356]/15 bg-white text-[#0D2B3E] transition-all placeholder:text-slate-300 shadow-2xs"
              />
            </div>
            
            {/* Quick Demo Hint */}
            <p className="text-[11px] text-center text-slate-400">
              Demo access code:{' '}
              <button
                type="button"
                onClick={handleQuickFillDemo}
                className="font-mono font-semibold text-[#146356] bg-[#E4EFEC] hover:bg-[#CEF3ED] border border-[#9FDCD1] px-2 py-0.5 rounded-lg cursor-pointer transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-1"
                title="Click to instant fill & verify"
              >
                <span>{expectedOtp}</span>
                <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-[#146356]/80">(Instant Click)</span>
              </button>
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-[#C23B22] animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-[#C23B22] flex-shrink-0 mt-0.5" />
              <p className="font-medium leading-snug">{errorMessage}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={otpValue.length !== 4}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
                otpValue.length === 4
                  ? 'bg-[#146356] hover:bg-[#0F4A40] text-white cursor-pointer hover:scale-[1.01] active:scale-98'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Unlock Dossier & Start</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
