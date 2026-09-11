import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Edit3, 
  ShieldCheck, 
  MessageSquare,
  FileCheck2,
  Stethoscope
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';

export const DoctorVerify: React.FC = () => {
  const navigate = useNavigate();
  const { 
    patients, 
    activePatient, 
    setActivePatientId, 
    updatePatientStatus, 
    updatePatientClinicalSummary, 
    showToast 
  } = useApp();

  const patient = activePatient || patients[0];

  // Helper to map Agni from intake to summary enum
  const mapIntakeAgni = (agniStr?: string): 'Sama' | 'Vishama' | 'Tikshna' | 'Manda' => {
    if (!agniStr) return patient.clinicalSummary.agni;
    if (agniStr.includes('Vishamagni')) return 'Vishama';
    if (agniStr.includes('Tikshnagni')) return 'Tikshna';
    if (agniStr.includes('Mandagni')) return 'Manda';
    if (agniStr.includes('Samagni')) return 'Sama';
    return patient.clinicalSummary.agni;
  };

  // Editable Form fields — Auto-populated from 10-point assessment when available
  const [prakriti, setPrakriti] = useState(
    patient.ayurvedaIntake?.bodyBuild || patient.clinicalSummary.prakriti
  );
  const [vikriti, setVikriti] = useState(
    patient.ayurvedaIntake?.doshaBaseline
      ? `Vata [${patient.ayurvedaIntake.doshaBaseline.vata.join(', ') || 'N/A'}] • Pitta [${patient.ayurvedaIntake.doshaBaseline.pitta.join(', ') || 'N/A'}] • Kapha [${patient.ayurvedaIntake.doshaBaseline.kapha.join(', ') || 'N/A'}]`
      : patient.clinicalSummary.vikriti
  );
  const [agni, setAgni] = useState(
    mapIntakeAgni(patient.ayurvedaIntake?.agni)
  );
  const [koshtha, setKoshtha] = useState(patient.clinicalSummary.koshtha);
  const [nidana, setNidana] = useState(
    patient.ayurvedaIntake?.hetuTriggers && patient.ayurvedaIntake.hetuTriggers.length > 0
      ? `Hetu (Triggers): ${patient.ayurvedaIntake.hetuTriggers.join(', ')}. ${patient.clinicalSummary.nidana}`
      : patient.clinicalSummary.nidana
  );
  const [aiNotes, setAiNotes] = useState(patient.clinicalSummary.aiGeneratedNotes);
  const [doctorRemarks, setDoctorRemarks] = useState(
    patient.ayurvedaIntake
      ? `I have examined the patient. 10-point assessment confirms ${patient.ayurvedaIntake.mainConcern} with ${patient.ayurvedaIntake.bodyBuild} constitution and ${patient.ayurvedaIntake.agni}. AI summary endorsed.`
      : 'I have examined the patient. Symptoms and pulse (Nadi) confirm classical Sandhivata with localized Vata Prakopa. AI summary verified.'
  );

  // Request Changes Modal
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [changesNote, setChangesNote] = useState('');

  const handleVerify = () => {
    updatePatientClinicalSummary(patient.id, {
      prakriti,
      vikriti,
      agni: agni as any,
      koshtha: koshtha as any,
      nidana,
      aiGeneratedNotes: aiNotes
    });
    updatePatientStatus(patient.id, 'Verified', doctorRemarks);
    showToast({
      type: 'success',
      title: 'Clinical Summary Verified',
      message: `Case ${patient.tokenNumber} signed off by Dr. Alok Verma.`
    });
    navigate('/doctor/consultation');
  };

  const handleRequestChanges = () => {
    if (!changesNote.trim()) {
      showToast({ type: 'error', title: 'Note Required', message: 'Please specify the revision needed.' });
      return;
    }
    updatePatientStatus(patient.id, 'Rejected', changesNote);
    setIsRequestModalOpen(false);
    showToast({
      type: 'warning',
      title: 'Changes Requested',
      message: `Notified Assistant Desk to re-verify or re-upload for ${patient.name}.`
    });
    navigate('/doctor');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-brand-border shadow-soft flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/doctor')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-muted hover:text-brand-heading mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to OPD Queue</span>
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-brand-heading">
              Verify & Edit AI Clinical Summary
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-mint text-[#2E7D32] border border-[#A7D7B5]/40">
              Human-In-The-Loop
            </span>
          </div>
          <p className="text-xs text-brand-muted mt-1">
            Review AI-generated Ayurvedic parameters, make clinical edits, and sign off for consultation.
          </p>
        </div>

        {/* Patient Token Badge */}
        <div className="flex items-center gap-3 p-3 bg-brand-bg rounded-2xl border border-brand-border">
          <div className="w-10 h-10 rounded-xl bg-brand-teal text-white font-bold text-sm flex items-center justify-center">
            {patient.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-xs text-brand-heading">{patient.name}</span>
              <span className="font-mono text-xs font-bold text-brand-teal-dark bg-brand-teal-light px-1.5 py-0.5 rounded">
                {patient.tokenNumber}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#CEF3ED] text-[#146356] border border-[#9FDCD1]">
                {patient.intakeType === 'ayurveda' || patient.careSystem === 'AYURVEDA' ? 'AYUSH Intake' : 'Allopathy'}
              </span>
              {patient.otp && (
                <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#E4EFEC] text-[#146356] border border-[#9FDCD1]">
                  <span>OTP:</span>
                  <span className="tracking-wider">{patient.otp}</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-brand-muted">{patient.age} yrs • {patient.gender} • {patient.phone}</p>
          </div>
        </div>
      </div>

      {/* Main Form & Editable Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-soft space-y-6">
        
        {/* Banner */}
        <div className="p-4 rounded-2xl bg-brand-teal-light/40 border border-brand-teal/30 flex items-start gap-3 text-xs">
          <Sparkles className="w-5 h-5 text-brand-teal-dark flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-brand-heading">Physician Verification Protocol (Ayush Grid):</p>
            <p className="text-brand-body mt-0.5">
              You can adjust Prakriti, digestive fire (Agni), and etiology below. Click "Verify Case" to lock the synthesis into the patient's permanent EMR or "Request Changes" to route back to intake desk.
            </p>
          </div>
        </div>

        {/* Editable AYUSH Parameters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-bold text-brand-heading mb-1 uppercase tracking-wider">
              Prakriti (Constitution)
            </label>
            <input
              type="text"
              value={prakriti}
              onChange={(e) => setPrakriti(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30 font-semibold text-brand-heading"
            />
          </div>

          <div>
            <label className="block font-bold text-brand-heading mb-1 uppercase tracking-wider">
              Vikriti (Dosha Imbalance)
            </label>
            <input
              type="text"
              value={vikriti}
              onChange={(e) => setVikriti(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30 font-semibold text-brand-heading"
            />
          </div>

          <div>
            <label className="block font-bold text-brand-heading mb-1 uppercase tracking-wider">
              Agni (Digestive Fire)
            </label>
            <select
              value={agni}
              onChange={(e) => setAgni(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30 font-semibold text-brand-heading"
            >
              <option value="Sama">Sama Agni (Balanced)</option>
              <option value="Vishama">Vishama Agni (Vata / Irregular)</option>
              <option value="Tikshna">Tikshna Agni (Pitta / Intense)</option>
              <option value="Manda">Manda Agni (Kapha / Sluggish)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-brand-heading mb-1 uppercase tracking-wider">
              Koshtha (Bowel Habit)
            </label>
            <select
              value={koshtha}
              onChange={(e) => setKoshtha(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30 font-semibold text-brand-heading"
            >
              <option value="Madhyama">Madhyama (Normal)</option>
              <option value="Krura">Krura (Constipated / Hard)</option>
              <option value="Mrudu">Mrudu (Soft / Sensitive)</option>
            </select>
          </div>
        </div>

        {/* Nidana & Samprapti */}
        <div className="text-xs space-y-1">
          <label className="block font-bold text-brand-heading uppercase tracking-wider">
            Nidana (Etiological Factors) & Pathogenesis
          </label>
          <textarea
            rows={2}
            value={nidana}
            onChange={(e) => setNidana(e.target.value)}
            className="w-full p-3 rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30 leading-relaxed text-brand-heading"
          />
        </div>

        {/* AI Generated Clinical Synthesis Notes */}
        <div className="text-xs space-y-1">
          <div className="flex items-center justify-between">
            <label className="block font-bold text-brand-heading uppercase tracking-wider">
              Comprehensive Clinical Summary (Editable Rich Text)
            </label>
            <span className="text-[10px] text-brand-teal-dark font-medium">Auto-generated by AI model</span>
          </div>
          <textarea
            rows={5}
            value={aiNotes}
            onChange={(e) => setAiNotes(e.target.value)}
            className="w-full p-3.5 rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30 leading-relaxed text-brand-heading font-sans"
          />
        </div>

        {/* Doctor Verification Remarks */}
        <div className="text-xs space-y-1">
          <label className="block font-bold text-brand-heading uppercase tracking-wider">
            Consulting Physician Endorsement / Nadi Notes
          </label>
          <textarea
            rows={2}
            value={doctorRemarks}
            onChange={(e) => setDoctorRemarks(e.target.value)}
            className="w-full p-3 rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30 leading-relaxed text-brand-heading"
            placeholder="Add specific pulse examination, tongue signs, or differential diagnosis..."
          />
        </div>

        {/* Actions Bar: Verify and Request Changes */}
        <div className="pt-4 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[#F3A6A0] bg-[#FDF1F0] hover:bg-rose-100 text-[#C53030] text-xs font-bold transition-colors"
          >
            <AlertCircle className="w-4 h-4" />
            <span>Request Changes / Re-Scan</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate('/doctor/patient')}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-brand-border text-brand-heading text-xs font-semibold hover:bg-brand-bg"
            >
              Cancel
            </button>
            <button
              onClick={handleVerify}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white text-xs font-bold shadow-soft-lg transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify & Proceed to Consultation</span>
            </button>
          </div>
        </div>

      </div>

      {/* Request Changes Modal */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title="Request Changes / Clarification"
        subtitle={`Notify OPD Assistant Desk regarding ${patient.name}`}
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-brand-heading mb-1">
              Instructions for Assistant Desk:
            </label>
            <textarea
              rows={4}
              value={changesNote}
              onChange={(e) => setChangesNote(e.target.value)}
              placeholder="e.g. Scanned knee X-Ray was blurry, please ask patient to re-scan. Also verify if patient has history of hyperuricemia..."
              className="w-full p-3 rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-brand-border">
            <button
              onClick={() => setIsRequestModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-brand-border text-brand-heading font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleRequestChanges}
              className="px-5 py-2 rounded-xl bg-[#C53030] hover:bg-rose-700 text-white font-bold shadow-soft"
            >
              Send Request to Desk
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
