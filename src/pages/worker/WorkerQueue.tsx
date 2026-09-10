import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, ArrowRight, CheckCircle2, AlertCircle, Bell, Stethoscope } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';

export const WorkerQueue: React.FC = () => {
  const navigate = useNavigate();
  const { patients, selectedHospital, setActivePatientId, updatePatientStatus, showToast } = useApp();

  const handleCallToken = (token: string, name: string) => {
    showToast({
      type: 'info',
      title: 'Token Called on OPD Speaker',
      message: `Token ${token} (${name}) summoned to Counter A-2 / Kayachikitsa OPD.`
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-3xl border border-brand-border shadow-soft flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-heading">
            Live OPD Queue & Token Dispatch
          </h1>
          <p className="text-xs text-brand-muted mt-1">
            Displaying real-time patient progression at {selectedHospital.name}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-brand-teal-light text-brand-teal-dark border border-brand-teal/30">
            Average Wait: {selectedHospital.currentWaitMinutes} mins
          </span>
        </div>
      </div>

      {/* Queue Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {patients.map((patient, idx) => (
          <div
            key={patient.id}
            className="bg-white p-5 rounded-3xl border border-brand-border shadow-soft hover:shadow-soft-lg transition-all space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black font-mono text-brand-teal-dark">
                  {patient.tokenNumber}
                </span>
                <StatusBadge status={patient.status} size="sm" />
              </div>

              <div className="mt-2">
                <h3 className="text-sm font-bold text-brand-heading">{patient.name}</h3>
                <p className="text-xs text-brand-muted">
                  {patient.age} yrs • {patient.gender} • {patient.preferredLanguage}
                </p>
              </div>

              <div className="mt-3 p-3 bg-brand-bg rounded-xl border border-brand-border/60 text-xs">
                <p className="text-brand-muted text-[11px]">Presenting Complaint:</p>
                <p className="font-medium text-brand-heading truncate mt-0.5" title={patient.chiefComplaint}>
                  {patient.chiefComplaint}
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-brand-border">
              <div className="flex items-center justify-between text-xs text-brand-muted">
                <span>Queue Slot: #{patient.queueNumber}</span>
                <span>{patient.appointmentTime}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCallToken(patient.tokenNumber, patient.name)}
                  className="flex-1 py-2 rounded-xl border border-brand-border hover:bg-brand-bg text-brand-heading text-xs font-semibold flex items-center justify-center gap-1"
                >
                  <Bell className="w-3.5 h-3.5 text-brand-teal-dark" />
                  <span>Call Token</span>
                </button>
                <button
                  onClick={() => {
                    setActivePatientId(patient.id);
                    navigate('/worker/assist');
                  }}
                  className="flex-1 py-2 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white text-xs font-bold shadow-soft flex items-center justify-center gap-1"
                >
                  <span>Assist Intake</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
