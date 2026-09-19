import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import { LabResultItem, DrugInteractionItem } from '../types';
import { useTranslation } from '../utils/translations';

interface DocumentLabResultsProps {
  labResults?: LabResultItem[];
  drugInteractions?: DrugInteractionItem[];
  className?: string;
}

export const DocumentLabResults: React.FC<DocumentLabResultsProps> = ({
  labResults = [],
  drugInteractions = [],
  className = ''
}) => {
  const { t } = useTranslation();
  if (labResults.length === 0 && drugInteractions.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Extracted Lab Values / Metrics */}
      {labResults.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <span>{t('dlr_extracted_values')}</span>
            {labResults.some(r => r.isAbnormal) && (
              <span className="text-rose-600 font-bold normal-case text-[10px] flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{t('dlr_abnormal_detected')}</span>
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {labResults.map((res, idx) => {
              if (res.isAbnormal) {
                return (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-900 text-xs shadow-2xs font-medium animate-in fade-in"
                  >
                    <span className="font-bold text-rose-950">
                      {res.parameter}: {res.value} {res.unit || ''}
                    </span>
                    <span className="inline-flex items-center gap-1 font-bold text-rose-700 bg-rose-100/90 px-1.5 py-0.5 rounded text-[10px] border border-rose-200">
                      <AlertCircle className="w-2.5 h-2.5 text-rose-600" />
                      <span>{t('dlr_out_of_range', { range: res.referenceRange })}</span>
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium"
                >
                  <span className="font-semibold text-slate-800">
                    {res.parameter}: {res.value} {res.unit || ''}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {t('dlr_normal_range', { range: res.referenceRange })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Potential Drug Interaction Warning */}
      {drugInteractions.length > 0 && (
        <div className="space-y-1.5 pt-1">
          {drugInteractions.map((item, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-amber-50/90 border border-amber-300 text-amber-950 text-xs space-y-1 shadow-2xs"
            >
              <div className="flex items-center gap-1.5 font-bold text-amber-800 text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                <span>{t('dlr_interaction_warning')}</span>
              </div>
              <p className="text-[11px] text-amber-900 leading-snug">
                <span className="font-semibold text-amber-950">{item.drugs.join(' + ')}:</span> {item.warning}
                <span className="ml-1 text-[10px] font-bold text-amber-700 uppercase bg-amber-100 px-1 py-0.2 rounded border border-amber-200">
                  {item.severity} {t('dlr_risk_suffix')}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
