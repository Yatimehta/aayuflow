import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Languages, ArrowRight, Check, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MOCK_LANGUAGES } from '../../data/mockData';
import { useTranslation } from '../../utils/translations';
import ayucarezLogo from '../../assets/images/logo-ayucarez.png';
import ministryOfAyushEmblem from '../../assets/images/ministry-of-ayush-emblem.jpg';

/** Shown right after Home, before Role-Select/Login or any other destination — visiting
 * anything else while unconfirmed redirects here (see App.tsx). Selecting a language
 * updates the whole app live — patientLanguage is the same context value every other
 * translated page reads, so there is no separate "confirm" step needed to see the change;
 * clicking a tile previews it immediately. */
export const LanguageGate: React.FC = () => {
  const navigate = useNavigate();
  const { patientLanguage, setPatientLanguage, setLanguageConfirmed } = useApp();
  const { t } = useTranslation();

  const handleContinue = () => {
    setLanguageConfirmed(true);
    navigate('/role-select');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-10 bg-[#F4FBF9] relative overflow-hidden">
      <div className="max-w-2xl w-full space-y-8 relative z-10">

        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <img src={ayucarezLogo} alt="Ayucarez" className="h-11 w-auto object-contain" />
            <div className="w-px h-7 bg-[#DCEAE7]" />
            <img
              src={ministryOfAyushEmblem}
              alt="Ministry of Ayush, Government of India"
              className="h-9 w-auto object-contain"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CEF3ED] text-[#146356] text-xs font-bold uppercase tracking-wider mb-1">
            <Languages className="w-3.5 h-3.5" />
            <span>{t('lang_gate_welcome')}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#0D2B3E] tracking-tight">
            {t('lang_page_title')}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            {t('lang_page_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          {MOCK_LANGUAGES.map((lang) => {
            const isSelected = patientLanguage === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setPatientLanguage(lang.code)}
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

        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 text-center">
          <Sparkles className="w-4 h-4 text-[#146356] flex-shrink-0" />
          <span>{t('lang_assistant_note')}</span>
        </div>

        <div className="pt-2 flex items-center justify-center">
          <button
            type="button"
            onClick={handleContinue}
            className="w-full sm:w-auto px-10 py-3.5 rounded-2xl bg-[#146356] hover:bg-[#0F4A40] text-white font-bold text-sm shadow-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>{t('lang_gate_continue')}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

      </div>
    </div>
  );
};
