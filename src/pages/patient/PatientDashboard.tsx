import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ShieldCheck, 
  Upload, 
  ArrowRight, 
  FileText, 
  History, 
  Clock, 
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../utils/translations';

export const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { activePatient, patients, selectedHospital } = useApp();
  const { t } = useTranslation();

  const patient = activePatient || patients[0];

  return (
    <div className="min-h-[85vh] py-16 px-4 sm:px-6 flex items-center justify-center relative z-10">
      <div className="max-w-xl w-full space-y-10 text-center">
        
        {/* Google-Style Minimalist Greeting Header */}
        <div className="space-y-2">


          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            {t('pd_greeting', { name: patient?.name?.split(' ')[0] || 'Patient' })}
          </h1>

          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {t('pd_subtitle', { hospital: selectedHospital.name })}
          </p>
        </div>

        {/* EXACTLY TWO PRIMARY ACTION OPTIONS: EQUALLY-WEIGHTED CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          
          {/* Option 1: Start Intake */}
          <div
            id="patient-start-intake-btn"
            onClick={() => navigate('/patient/consent')}
            className="group bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 hover:border-teal-500/70 hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-5"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center transition-transform group-hover:scale-105">
                <Sparkles className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                  {t('pd_start_title')}
                </h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {t('pd_start_desc')}
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-teal-700 group-hover:underline">
              <span>{t('pd_start_cta')}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>

          {/* Option 2: Upload Document */}
          <div
            onClick={() => navigate('/patient/upload')}
            className="group bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 hover:border-teal-500/70 hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-5"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center transition-transform group-hover:scale-105">
                <Upload className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                  {t('pd_upload_title')}
                </h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {t('pd_upload_desc')}
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-teal-700 group-hover:underline">
              <span>{t('pd_upload_cta')}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>

        </div>

        {/* THIRD CLEARLY SECONDARY OPTION/LINK: MY RECORDS */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => navigate('/patient/records')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-white/80 border border-transparent hover:border-slate-200 transition-all"
          >
            <History className="w-4 h-4 text-slate-400" />
            <span>{t('pd_records_link')}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        {/* Subtle active token notice if already generated */}
        {patient?.tokenNumber && (
          <div className="pt-4 border-t border-slate-200/60 max-w-sm mx-auto">
            <button
              type="button"
              onClick={() => navigate('/patient/token', {
                state: {
                  token: patient.tokenNumber,
                  queueSlot: patient.queueNumber,
                  hospitalName: selectedHospital.name,
                  estimatedWait: '~15 mins'
                }
              })}
              className="text-[11px] text-slate-500 hover:text-teal-700 transition-colors inline-flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              <span>{t('pd_active_token_label')} <strong className="font-mono text-slate-800">{patient.tokenNumber}</strong> {t('pd_view_slip')}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
