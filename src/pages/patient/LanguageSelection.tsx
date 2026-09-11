import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Globe, Check, Mic, Volume2, Type } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  text: boolean;
  asr: boolean;
  tts: boolean;
}

const FALLBACK_LANGUAGES: LanguageOption[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', text: true, asr: true, tts: true },
  { code: 'en', name: 'English', nativeName: 'English', text: true, asr: true, tts: true },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', text: true, asr: true, tts: true },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', text: true, asr: true, tts: true },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', text: true, asr: true, tts: true },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', text: true, asr: true, tts: true },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', text: true, asr: true, tts: true },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', text: true, asr: true, tts: true },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', text: true, asr: true, tts: true },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', text: true, asr: true, tts: true },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', text: true, asr: true, tts: true },
];

export const LanguageSelection: React.FC = () => {
  const navigate = useNavigate();
  const [languages, setLanguages] = useState<LanguageOption[]>(FALLBACK_LANGUAGES);
  const [selected, setSelected] = useState<string>('hi');

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        const res = await fetch(`${baseUrl}/api/v1/languages/`);
        if (res.ok) {
          const data = await res.json();
          if (data.languages && data.languages.length > 0) {
            setLanguages(data.languages);
          }
        }
      } catch (e) {
        console.error('Failed to fetch languages from backend, using fallback', e);
      }
    };
    fetchLanguages();
  }, []);

  const { showToast, setPreferredLanguage } = useApp();
  
  const handleContinue = () => {
    // Save centrally
    setPreferredLanguage(selected);
    const lang = languages.find(l => l.code === selected);
    showToast({
      type: 'success',
      title: 'Language Set',
      message: `Intake will proceed in ${lang?.nativeName || lang?.name || selected}.`
    });
    navigate('/patient/intake');
  };

  return (
    <div className="min-h-[85vh] py-10 px-4 sm:px-6 flex items-center justify-center relative z-10">
      <div className="max-w-2xl w-full space-y-7">

        {/* Navigation */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => navigate('/patient/consent')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Consent</span>
          </button>

          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
              <Globe className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Choose Your Language
            </h1>
            <p className="text-sm text-slate-500">
              Select the language you want to use during your intake.
              <br />
              <span className="text-xs">अपनी भाषा चुनें · ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ · உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்</span>
            </p>
          </div>
        </div>

        {/* Language Grid */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {languages.map((lang) => {
              const isSelected = selected === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => setSelected(lang.code)}
                  className={`relative p-4 rounded-2xl border-2 text-left transition-all ${
                    isSelected
                      ? 'border-teal-500 bg-teal-50/60 shadow-sm ring-2 ring-teal-200'
                      : 'border-slate-200 bg-white hover:border-teal-300 hover:bg-teal-50/20'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-teal-600 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <p className="text-lg font-bold text-slate-900">{lang.nativeName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{lang.name}</p>
                  {/* Capability indicators */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <Type className={`w-3 h-3 ${lang.text ? 'text-teal-600' : 'text-slate-300'}`} />
                    <Mic className={`w-3 h-3 ${lang.asr ? 'text-teal-600' : 'text-slate-300'}`} />
                    <Volume2 className={`w-3 h-3 ${lang.tts ? 'text-teal-600' : 'text-slate-300'}`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-[10px] text-slate-400 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1"><Type className="w-3 h-3" /> Text</span>
            <span className="flex items-center gap-1"><Mic className="w-3 h-3" /> Voice Input</span>
            <span className="flex items-center gap-1"><Volume2 className="w-3 h-3" /> Audio Output</span>
          </div>

          {/* Continue */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate('/patient/consent')}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleContinue}
              className="px-7 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
