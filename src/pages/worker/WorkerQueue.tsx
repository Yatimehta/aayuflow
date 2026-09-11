import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, ArrowRight, CheckCircle2, AlertCircle, Bell, Stethoscope, UserPlus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';

export const WorkerQueue: React.FC = () => {
  const navigate = useNavigate();
  const { patients, selectedHospital, setActivePatientId, showToast } = useApp();

  const handleCallToken = (token: string, name: string) => {
    showToast({
      type: 'info',
      title: 'Token Called on OPD Speaker',
      message: `Token ${token} (${name}) called to OPD Counter.`
    });
  };

  const sortedPatients = [...patients].sort((a, b) => {
    const aPriority = a.priorityFlag || a.clinicalSummary?.priorityFlag || false;
    const bPriority = b.priorityFlag || b.clinicalSummary?.priorityFlag || false;
    if (aPriority && !bPriority) return -1;
    if (!aPriority && bPriority) return 1;
    return a.queueNumber - b.queueNumber;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#DCEAE7] shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0D2B3E]">
            OPD Waiting Queue & Tokens
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Current patient queue list and token status at {selectedHospital.name}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/worker/assist')}
            className="px-4 py-2.5 rounded-xl bg-[#146356] hover:bg-[#0f4d43] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Assist Next Patient</span>
          </button>
        </div>
      </div>

      {/* Queue Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedPatients.map((patient) => {
          const isPriority = patient.priorityFlag || patient.clinicalSummary?.priorityFlag || false;
          return (
            <div
              key={patient.id}
              className={`p-5 rounded-3xl border shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between ${
                isPriority
                  ? 'border-rose-300 border-l-4 border-l-rose-500 bg-rose-50/30'
                  : 'bg-white border-[#DCEAE7]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-2xl font-black font-mono text-[#146356]">
                      #{patient.tokenNumber}
                    </span>
                    {isPriority && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-100 text-rose-700 border border-rose-300">
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                        <span>PRIORITY</span>
                      </span>
                    )}
                  </div>
                  <StatusBadge status={patient.status} size="sm" />
                </div>

                <div className="mt-2.5">
                  <h3 className="text-sm font-bold text-[#0D2B3E]">{patient.name}</h3>
                  <p className="text-xs text-slate-500">
                    {patient.age} yrs • {patient.gender} • {patient.preferredLanguage || 'Hindi'}
                  </p>
                </div>

                <div className="mt-3 p-3 bg-[#F4FBF9] rounded-xl border border-[#DCEAE7] text-xs">
                  <p className="text-slate-400 text-[11px] font-semibold">Reported Issue:</p>
                  <p className="font-medium text-[#0D2B3E] truncate mt-0.5" title={patient.chiefComplaint}>
                    {patient.chiefComplaint}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-[#DCEAE7]">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Slot: #{patient.queueNumber}</span>
                  <span className="text-[#146356] font-bold font-mono">OTP: {patient.otp || '4829'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCallToken(patient.tokenNumber, patient.name)}
                    className="flex-1 py-2 rounded-xl border border-[#DCEAE7] hover:bg-slate-50 text-[#0D2B3E] text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Bell className="w-3.5 h-3.5 text-[#146356]" />
                    <span>Call Token</span>
                  </button>
                  <button
                    onClick={() => {
                      setActivePatientId(patient.id);
                      navigate('/worker/assist');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#E4EFEC] hover:bg-[#146356] text-[#146356] hover:text-white text-xs font-bold transition-all"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
