import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Leaf, ArrowRight, ArrowLeft, Layers, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PatientIntakePath: React.FC = () => {
  const navigate = useNavigate();
  const { selectedHospital } = useApp();

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 flex items-center justify-center relative z-10">
      <div className="max-w-3xl w-full space-y-8">

        {/* Back Button */}
        <div>
          <button
            type="button"
            id="back-to-consent-btn"
            onClick={() => navigate('/patient/consent')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#0D2B3E] font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Consent</span>
          </button>
        </div>

        {/* Header Block */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CEF3ED] text-[#146356] text-xs font-bold uppercase tracking-wider mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Step 3 · Consultation Stream</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#0D2B3E] tracking-tight">
            Select Consultation Stream
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            परामर्श धारा चुनें • Choose the clinical approach for generating your OPD case draft at {selectedHospital.name}.
          </p>
        </div>

        {/* Two Large Circular Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">

          {/* Option 1: Allopathic Intake */}
          <div
            id="select-allopathy-card"
            onClick={() => navigate('/patient/intake?type=allopathy')}
            className="group relative bg-white p-7 sm:p-8 rounded-3xl border border-[#DCEAE7] hover:border-[#146356] hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              {/* Large circular icon */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#E4EFEC] text-[#146356] flex items-center justify-center transition-transform duration-200 group-hover:scale-105 shadow-2xs">
                <Stethoscope className="w-8 h-8 sm:w-10 sm:h-10 stroke-[1.75]" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-[#0D2B3E] group-hover:text-[#146356] transition-colors">
                    Allopathic Intake
                  </h2>
                </div>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">
                  आधुनिक चिकित्सा
                </p>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Standard symptom history, duration, severity scale, and prior prescription reports.
                </p>
              </div>

              {/* Scope highlights */}
              <div className="pt-2 flex flex-wrap gap-1.5 text-[11px]">
                <span className="px-2.5 py-1 rounded-lg bg-[#F4FBF9] text-slate-600 border border-[#DCEAE7]">
                  Chief Complaints
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#F4FBF9] text-slate-600 border border-[#DCEAE7]">
                  Severity & Onset
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#F4FBF9] text-slate-600 border border-[#DCEAE7]">
                  Prior Rx Upload
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#146356] group-hover:underline">
              <span>Begin Allopathic Intake</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </div>

          {/* Option 2: Dedicated Ayurvedic Intake */}
          <div
            id="select-ayurveda-card"
            onClick={() => navigate('/patient/intake-ayurveda')}
            className="group relative bg-white p-7 sm:p-8 rounded-3xl border-2 border-[#146356]/40 hover:border-[#146356] hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-6 ring-1 ring-[#146356]/10"
          >
            {/* Recommended pill */}
            <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-[#146356] text-white text-[10px] font-bold uppercase tracking-wider shadow-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#CEF3ED]" />
              <span>AIIA AYUSH Protocol</span>
            </div>

            <div className="space-y-4">
              {/* Large circular icon */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#E4EFEC] text-[#146356] flex items-center justify-center transition-transform duration-200 group-hover:scale-105 shadow-2xs">
                <Leaf className="w-8 h-8 sm:w-10 sm:h-10 stroke-[1.75]" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-[#0D2B3E] group-hover:text-[#146356] transition-colors">
                    Ayurvedic Intake
                  </h2>
                </div>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">
                  आयुर्वेदिक मूल्यांकन
                </p>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Prakriti (body constitution), Agni (digestive fire), lifestyle triggers, and Dosha phenotype baseline.
                </p>
              </div>

              {/* Scope highlights */}
              <div className="pt-2 flex flex-wrap gap-1.5 text-[11px]">
                <span className="px-2.5 py-1 rounded-lg bg-[#E4EFEC] text-[#146356] font-medium border border-[#9FDCD1]">
                  Prakriti & Agni
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#E4EFEC] text-[#146356] font-medium border border-[#9FDCD1]">
                  Dosha Baseline
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#E4EFEC] text-[#146356] font-medium border border-[#9FDCD1]">
                  Hetu & Diet Triggers
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#146356] group-hover:underline">
              <span>Begin Ayurvedic Intake</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </div>

        </div>

        {/* Security / ABDM Guarantee footnote */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-400">
            Both intake streams feed directly into the ABDM FHIR Clinical Dossier for your consulting doctor.
          </p>
        </div>

      </div>
    </div>
  );
};
