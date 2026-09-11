import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Languages, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MOCK_LANGUAGES } from '../../data/mockData';

export const PatientLanguageSelect: React.FC = () => {
  const navigate = useNavigate();
  const { patientLanguage, setPatientLanguage, showToast } = useApp();

  const [selectedCode, setSelectedCode] = useState<string>(patientLanguage || 'hi');

  const handleContinue = () => {
    setPatientLanguage(selectedCode);
    const langObj = MOCK_LANGUAGES.find((l) => l.code === selectedCode);
    showToast({
      type: 'info',
      title: 'Language Selected',
      message: `Intake will be conducted in ${langObj?.name || 'Hindi'}.`,
    });
    navigate('/patient/consent');
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 flex items-center justify-center relative z-10">
      <div className="max-w-2xl w-full space-y-8">

        {/* Back Link */}
        <div>
          <button
            type="button"
            onClick={() => navigate('/patient/dashboard')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#0D2B3E] font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Patient Dashboard</span>
          </button>
        </div>

        {/* Header Block */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CEF3ED] text-[#146356] text-xs font-bold uppercase tracking-wider mb-1">
            <Languages className="w-3.5 h-3.5" />
            <span>Step 1 · Language Selection</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#0D2B3E] tracking-tight">
            Select Your Preferred Language
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            अपनी पसंदीदा भाषा चुनें • Choose the language for speaking or typing your symptoms.
          </p>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          {MOCK_LANGUAGES.map((lang) => {
            const isSelected = selectedCode === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setSelectedCode(lang.code)}
                className={`group relative p-4 rounded-2xl text-left transition-all duration-150 flex flex-col justify-between cursor-pointer border ${
                  isSelected
                    ? 'bg-[#E4EFEC] border-[#146356] shadow-sm ring-1 ring-[#146356]'
                    : 'bg-white border-[#DCEAE7] hover:border-[#146356]/40 hover:bg-[#F4FBF9]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg sm:text-xl font-bold text-[#0D2B3E] tracking-tight">
                    {lang.native}
                  </span>
                  {isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-[#146356] text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-200 group-hover:border-slate-300" />
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    {lang.name}
                  </span>
                  {lang.popular && (
                    <span className="text-[10px] font-semibold text-[#146356] bg-white/80 px-1.5 py-0.5 rounded border border-[#DCEAE7]">
                      Popular
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Assistant Note */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 text-center">
          <Sparkles className="w-4 h-4 text-[#146356] flex-shrink-0" />
          <span>Ayucarez automatically transcribes speech and questions in your selected language.</span>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-center">
          <button
            type="button"
            onClick={handleContinue}
            className="w-full sm:w-auto px-10 py-3.5 rounded-2xl bg-[#146356] hover:bg-[#0F4A40] text-white font-bold text-sm shadow-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>Continue to Consent</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

      </div>
    </div>
  );
};
