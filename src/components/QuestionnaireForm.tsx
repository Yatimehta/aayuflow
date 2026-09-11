import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, CheckCircle2, Leaf, Activity } from 'lucide-react';
import { encounterApi } from '../api/endpoints';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { QuestionVoiceHandler } from './QuestionVoiceHandler';
import { AudioAloudButton } from './AudioAloudButton';

interface FormSchema {
  id: string;
  label: string;
  type: 'radio' | 'multiselect' | 'textarea' | 'text';
  options?: string[];
  voice_enabled?: boolean;
}

interface QuestionnaireFormProps {
  pathway: 'allopathy' | 'ayurveda';
  title: string;
  onBack: () => void;
}

export const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({ pathway, title, onBack }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { activePatient, patientLanguage, showToast, selectedHospital, updatePatientIntake } = useApp();
  
  const [schema, setSchema] = useState<FormSchema[]>([]);
  const [responses, setResponses] = useState<Record<string, string | string[]>>({});
  const [encounterId, setEncounterId] = useState<number | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        if (!activePatient) return;
        const encRes = await encounterApi.createEncounter(activePatient.id);
        setEncounterId(encRes.encounter_id || encRes.id);
        const schemaRes = await encounterApi.getQuestionnaireSchema(pathway);
        setSchema(schemaRes);
      } catch (err) {
        console.error("Failed to init form", err);
      }
    };
    init();
  }, [activePatient, pathway]);

  const handleOptionToggle = (fieldId: string, opt: string, isMulti: boolean) => {
    setResponses(prev => {
      if (isMulti) {
        const current = (prev[fieldId] as string[]) || [];
        if (current.includes(opt)) {
          return { ...prev, [fieldId]: current.filter(item => item !== opt) };
        } else {
          return { ...prev, [fieldId]: [...current, opt] };
        }
      }
      return { ...prev, [fieldId]: opt };
    });
  };

  const handleTextChange = (fieldId: string, text: string) => {
    setResponses(prev => ({ ...prev, [fieldId]: text }));
  };

  const handleVoiceConfirm = (field: FormSchema, transcript: string) => {
    const isMulti = field.type === 'multiselect';
    
    if (field.type === 'textarea' || field.type === 'text') {
      const current = (responses[field.id] as string) || '';
      const newVal = current ? `${current} ${transcript}` : transcript;
      handleTextChange(field.id, newVal);
    } else if (field.type === 'radio' || isMulti) {
      // Deterministic matching: check if transcript matches any option text exactly (case-insensitive)
      const transcriptLower = transcript.trim().toLowerCase();
      
      const matchedOption = field.options?.find(opt => {
        const translatedOpt = t(opt, { defaultValue: opt }).toLowerCase();
        return translatedOpt === transcriptLower || opt.toLowerCase() === transcriptLower;
      });

      if (matchedOption) {
        handleOptionToggle(field.id, matchedOption, isMulti);
      } else {
        showToast({
          type: 'error',
          title: t('matchFailedTitle', { defaultValue: 'No Match Found' }),
          message: t('matchFailedMessage', { defaultValue: 'Could not match your voice to an option. Please select manually.' })
        });
      }
    }
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!encounterId) return;

    try {
      const formattedResponses = Object.entries(responses).map(([questionId, answer]) => ({
        question_id: questionId,
        question_text: schema.find(s => s.id === questionId)?.label || questionId,
        answer: Array.isArray(answer) ? answer.join(', ') : answer
      }));

      await encounterApi.submitBulkQuestionnaire(
        encounterId,
        patientLanguage || 'en',
        pathway,
        formattedResponses
      );

      updatePatientIntake(activePatient!.id, pathway, responses);

      showToast({
        type: 'success',
        title: t('intakeComplete', { defaultValue: 'Intake Complete' }),
        message: 'Your responses have been saved.'
      });
      navigate('/patient/records');
    } catch (err) {
      console.error(err);
      showToast({ type: 'error', title: 'Error', message: 'Failed to submit.' });
    }
  };

  if (schema.length === 0) {
    return (
      <div className="min-h-[85vh] py-10 px-4 flex items-center justify-center">
        <p className="text-slate-500 animate-pulse">{t('processing', { defaultValue: 'Loading...' })}</p>
      </div>
    );
  }

  const isAyurveda = pathway === 'ayurveda';

  return (
    <div className="min-h-[85vh] py-10 px-4 sm:px-6 relative z-10 font-sans selection:bg-[#CEF3ED] selection:text-[#0D2B3E]">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Top Navigation & Header */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#0D2B3E] font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('back', { defaultValue: 'Back to Stream Selection' })}</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CEF3ED] text-[#146356] text-xs font-bold uppercase tracking-wider mb-1.5 border border-[#9FDCD1]">
                {isAyurveda ? <Leaf className="w-3.5 h-3.5" /> : <Activity className="w-3.5 h-3.5" />}
                <span>Step 4 · Comprehensive {isAyurveda ? 'AYUSH' : 'Medical'} Assessment</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0D2B3E] tracking-tight">
                {title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Detailed Clinical Baseline Assessment for {selectedHospital?.name}
              </p>
            </div>

            <AudioAloudButton
              text={t('generalInstructions', { defaultValue: `Please answer these questions regarding your health to assist your ${isAyurveda ? 'Ayurvedic physician' : 'doctor'}.` })}
              label={t('audioGuidance', { defaultValue: 'Audio Guidance' })}
              alwaysShow={true}
              className="self-start sm:self-auto flex-shrink-0"
            />
          </div>
        </div>

        {/* Main Form Card */}
        <form onSubmit={submitForm} className="bg-white rounded-3xl border border-[#DCEAE7] shadow-xs p-6 sm:p-9 space-y-9">
          {schema.map((field, index) => (
            <div key={field.id} className={index === 0 ? "space-y-3.5" : "space-y-3.5 pt-4 border-t border-slate-100"}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#E4EFEC] text-[#146356] font-bold text-xs flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <label className="text-sm font-bold text-[#0D2B3E]">
                    {t(field.id, { defaultValue: field.label })}
                  </label>
                </div>
                {field.type === 'multiselect' && (
                  <span className="text-[10px] text-slate-400">{t('selectAllApply', { defaultValue: 'Select all that apply' })}</span>
                )}
              </div>

              {/* Textarea or Text rendering */}
              {(field.type === 'textarea' || field.type === 'text') && (
                <div className="pt-2 animate-in fade-in">
                  {field.type === 'textarea' ? (
                    <textarea
                      value={(responses[field.id] as string) || ''}
                      onChange={(e) => handleTextChange(field.id, e.target.value)}
                      placeholder={t('symptomsPlaceholder', { defaultValue: 'Type your answer here...' })}
                      className="w-full px-4 py-3 text-xs rounded-xl border border-[#DCEAE7] bg-[#F4FBF9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146356]/30 text-[#0D2B3E] min-h-[100px]"
                    />
                  ) : (
                    <input
                      type="text"
                      value={(responses[field.id] as string) || ''}
                      onChange={(e) => handleTextChange(field.id, e.target.value)}
                      placeholder={t('symptomsPlaceholder', { defaultValue: 'Type your answer here...' })}
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-[#DCEAE7] bg-[#F4FBF9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146356]/30 text-[#0D2B3E]"
                    />
                  )}
                </div>
              )}

              {/* Radio or Multiselect rendering */}
              {(field.type === 'radio' || field.type === 'multiselect') && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {field.options?.map((opt) => {
                    const isMulti = field.type === 'multiselect';
                    const isSelected = isMulti 
                      ? ((responses[field.id] as string[]) || []).includes(opt)
                      : responses[field.id] === opt;
                    
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleOptionToggle(field.id, opt, isMulti)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer border flex items-center gap-1.5 ${
                          isSelected
                            ? (isMulti ? 'bg-[#E4EFEC] border-[#146356] text-[#146356] font-bold' : 'bg-[#E4EFEC] border-[#146356] text-[#146356] shadow-2xs ring-1 ring-[#146356]')
                            : 'bg-[#F4FBF9] border-[#DCEAE7] text-slate-700 hover:border-[#146356]/50'
                        }`}
                      >
                        {isMulti && (
                          <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${isSelected ? 'bg-[#146356] border-[#146356] text-white' : 'border-slate-300 bg-white'}`}>
                            {isSelected && <CheckCircle2 className="w-3 h-3" />}
                          </div>
                        )}
                        <span>{t(opt, { defaultValue: opt })}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Render Question Voice Handler per Question */}
              {field.voice_enabled !== false && (
                <QuestionVoiceHandler
                  questionId={field.id}
                  questionText={t(field.id, { defaultValue: field.label })}
                  language={patientLanguage || 'hi'}
                  onConfirm={(transcript) => handleVoiceConfirm(field, transcript)}
                />
              )}
            </div>
          ))}

          {/* Action Footer */}
          <div className="pt-6 border-t border-[#DCEAE7] flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={onBack}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium"
            >
              ← {t('cancel', { defaultValue: 'Cancel & Choose Another Stream' })}
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-9 py-3.5 rounded-2xl bg-[#146356] hover:bg-[#0F4A40] text-white font-bold text-sm shadow-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>{t('submitIntake', { defaultValue: 'Submit Intake & Generate Token' })}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
