import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Stethoscope, 
  Plus, 
  Trash2, 
  Send, 
  CheckCircle2, 
  ArrowLeft, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  Database,
  Printer,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PrescriptionItem } from '../../types';
import { Modal } from '../../components/Modal';
import { useTranslation } from '../../utils/translations';

export const DoctorConsultation: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    patients, 
    activePatient, 
    selectedHospital, 
    addPrescriptionToPatient, 
    updatePatientStatus,
    showToast 
  } = useApp();

  const patient = activePatient || patients[0];

  // Prescriptions List State
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>(
    patient.prescriptions.length > 0 ? patient.prescriptions : [
      {
        id: 'rx-new-1',
        medicineName: 'Yogaraja Guggulu',
        form: 'Vati / Tablet',
        dosage: '2 tablets (500mg each)',
        anupana: 'Lukewarm water or Dashamula Kwath',
        timing: 'After Food',
        duration: '30 Days'
      },
      {
        id: 'rx-new-2',
        medicineName: 'Dashamularishta',
        form: 'Asava / Arishta',
        dosage: '20 ml with 20 ml lukewarm water',
        anupana: 'Lukewarm water',
        timing: 'After Food',
        duration: '30 Days'
      },
      {
        id: 'rx-new-3',
        medicineName: 'Mahanarayana Taila',
        form: 'Taila / Oil',
        dosage: 'Gentle warm application over affected joints',
        anupana: 'External application followed by hot fomentation',
        timing: 'Before Food',
        duration: '21 Days'
      }
    ]
  );

  // New Rx Form state
  const [newRx, setNewRx] = useState({
    medicineName: '',
    form: 'Vati / Tablet' as PrescriptionItem['form'],
    dosage: '1 tablet twice daily',
    anupana: 'Warm water',
    timing: 'After Food' as PrescriptionItem['timing'],
    duration: '15 Days'
  });

  // Clinical diagnosis & follow-up
  const [finalDiagnosis, setFinalDiagnosis] = useState(
    patient.clinicalSummary.vikriti || 'Sandhivata (Degenerative Osteoarthritis) with Vata Imbalance'
  );
  const [dietaryAdvice, setDietaryAdvice] = useState(
    'Strict Pathya: Consume lukewarm water and avoid refrigerated food. Take 1 tsp cow ghee in warm milk at night. Avoid rajma, chana, and cold weather exposure.'
  );
  const [followUpDays, setFollowUpDays] = useState('21 Days');

  // EMR Confirmation Modal
  const [isEmrModalOpen, setIsEmrModalOpen] = useState(false);
  const [syncingEmr, setSyncingEmr] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const handleAddMedicine = () => {
    if (!newRx.medicineName.trim()) {
      showToast({ type: 'error', title: 'Medicine Name Required', message: 'Please enter a valid AYUSH formulation.' });
      return;
    }
    const item: PrescriptionItem = {
      id: 'rx-' + Date.now(),
      ...newRx
    };
    setPrescriptions([...prescriptions, item]);
    setNewRx({
      medicineName: '',
      form: 'Vati / Tablet',
      dosage: '1 tablet twice daily',
      anupana: 'Warm water',
      timing: 'After Food',
      duration: '15 Days'
    });
    showToast({ type: 'success', title: 'Medicine Added', message: `${item.medicineName} added to prescription list.` });
  };

  const handleRemoveMedicine = (id: string) => {
    setPrescriptions(prescriptions.filter(p => p.id !== id));
  };

  const handleSendToEmr = () => {
    setSyncingEmr(true);
    setTimeout(() => {
      setSyncingEmr(false);
      setSyncSuccess(true);
      updatePatientStatus(patient.id, 'Verified', `Consultation completed by Dr. Verma. Prescriptions synced to ABDM.`);
      showToast({
        type: 'success',
        title: 'Synchronized with Hospital HIS / ABDM',
        message: `Prescription & encounter notes for ${patient.name} locked into electronic health record.`
      });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-brand-border shadow-soft flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/doctor/patient')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-muted hover:text-brand-heading mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('dc_back')}</span>
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-brand-heading">
              {t('dc_title')}
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-teal-light text-brand-teal-dark border border-brand-teal/30">
              {t('dc_active_encounter')}
            </span>
          </div>
          <p className="text-xs text-brand-muted mt-1">
            {t('dc_subtitle')}
          </p>
        </div>

        {/* Action Button: Send to HIS / EMR */}
        <button
          onClick={() => setIsEmrModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-brand-teal hover:bg-brand-teal-dark text-white text-xs font-bold shadow-soft-lg hover:scale-[1.02] transition-all"
        >
          <Database className="w-4 h-4" />
          <span>{t('dc_send_emr')}</span>
        </button>
      </div>

      {/* Patient Banner */}
      <div className="p-4 rounded-3xl bg-brand-bg border border-brand-border flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-teal-dark text-white font-bold flex items-center justify-center">
            {patient.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-brand-heading">{patient.name}</span>
              <span className="font-mono text-brand-teal-dark font-bold bg-brand-teal-light px-2 py-0.5 rounded">
                {patient.tokenNumber}
              </span>
            </div>
            <p className="text-brand-muted mt-0.5">
              {patient.age} yrs • {patient.gender} • Prakriti: <strong>{patient.clinicalSummary.prakriti}</strong>
            </p>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-brand-muted">{t('dc_opd_dept')}</span>
          <p className="font-semibold text-brand-heading">Kayachikitsa • {selectedHospital.name}</p>
        </div>
      </div>

      {/* Main Form Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: Prescription Builder (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-brand-border shadow-soft space-y-5">
          <div className="border-b border-brand-border pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-brand-teal-dark" />
              <h3 className="text-base font-bold text-brand-heading">
                {t('dc_formulation_builder')}
              </h3>
            </div>
            <span className="text-xs text-brand-muted">
              {prescriptions.length} items in regimen
            </span>
          </div>

          {/* Quick Presets */}
          <div>
            <span className="text-[11px] font-semibold text-brand-muted block mb-1.5">
              Quick Select Classical Formulations:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { name: 'Triphala Churna', form: 'Churna', dosage: '3g with warm water at bedtime' },
                { name: 'Ashwagandha Rasayana', form: 'Capsule', dosage: '1 capsule BD with milk' },
                { name: 'Avipattikar Churna', form: 'Churna', dosage: '3g before meals with water' },
                { name: 'Punarnavadi Kwath', form: 'Kwath', dosage: '15ml with warm water BD' },
                { name: 'Ksheerabala Taila 101', form: 'Taila / Oil', dosage: '5 drops with warm milk' }
              ].map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setNewRx({
                      ...newRx,
                      medicineName: preset.name,
                      form: preset.form as any,
                      dosage: preset.dosage
                    });
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-lg border border-brand-border bg-brand-bg hover:bg-brand-teal-light text-brand-heading transition-colors"
                >
                  + {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Add Medicine Inline Card */}
          <div className="p-4 rounded-2xl bg-brand-bg border border-brand-border space-y-3 text-xs">
            <h4 className="font-bold text-brand-heading">Add Formulation to Prescription:</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-brand-muted mb-1 font-semibold">Medicine Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Yogaraja Guggulu, Dashamula..."
                  value={newRx.medicineName}
                  onChange={(e) => setNewRx({ ...newRx, medicineName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-brand-border bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30 font-semibold"
                />
              </div>

              <div>
                <label className="block text-brand-muted mb-1 font-semibold">Dosage Form</label>
                <select
                  value={newRx.form}
                  onChange={(e) => setNewRx({ ...newRx, form: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-brand-border bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
                >
                  <option value="Vati / Tablet">Vati / Tablet</option>
                  <option value="Churna">Churna (Powder)</option>
                  <option value="Kwath">Kwath (Decoction)</option>
                  <option value="Asava / Arishta">Asava / Arishta (Fermented)</option>
                  <option value="Taila / Oil">Taila / Oil (External/Internal)</option>
                  <option value="Ghrita">Ghrita (Medicated Ghee)</option>
                  <option value="Capsule">Capsule</option>
                </select>
              </div>

              <div>
                <label className="block text-brand-muted mb-1 font-semibold">Dosage</label>
                <input
                  type="text"
                  value={newRx.dosage}
                  onChange={(e) => setNewRx({ ...newRx, dosage: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-brand-border bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
                />
              </div>

              <div>
                <label className="block text-brand-muted mb-1 font-semibold">Anupana (Vehicle)</label>
                <input
                  type="text"
                  placeholder="e.g. Warm water, Honey, Milk..."
                  value={newRx.anupana}
                  onChange={(e) => setNewRx({ ...newRx, anupana: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-brand-border bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
                />
              </div>

              <div>
                <label className="block text-brand-muted mb-1 font-semibold">Timing</label>
                <select
                  value={newRx.timing}
                  onChange={(e) => setNewRx({ ...newRx, timing: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-brand-border bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
                >
                  <option value="Before Food">Before Food (Pragbhakta)</option>
                  <option value="After Food">After Food (Adhobhakta)</option>
                  <option value="Empty Stomach">Empty Stomach (Abhakta)</option>
                  <option value="Bedtime">Bedtime (Nishi)</option>
                </select>
              </div>

              <div>
                <label className="block text-brand-muted mb-1 font-semibold">Duration</label>
                <input
                  type="text"
                  value={newRx.duration}
                  onChange={(e) => setNewRx({ ...newRx, duration: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-brand-border bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleAddMedicine}
                className="px-4 py-2 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white font-bold shadow-soft flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{t('dc_add_formulation')}</span>
              </button>
            </div>
          </div>

          {/* Current Prescriptions List */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-brand-heading uppercase tracking-wider">
              {t('dc_active_rx')} ({prescriptions.length}):
            </h4>

            {prescriptions.map((rx) => (
              <div
                key={rx.id}
                className="p-3.5 rounded-2xl border border-brand-border bg-white shadow-soft flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h5 className="font-bold text-brand-heading">{rx.medicineName}</h5>
                    <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-brand-teal-light text-brand-teal-dark">
                      {rx.form}
                    </span>
                  </div>
                  <p className="text-brand-body">
                    {rx.dosage} • <span className="font-medium text-brand-teal-dark">{rx.timing}</span>
                  </p>
                  <p className="text-[11px] text-brand-muted">
                    Anupana: {rx.anupana} • Duration: <strong>{rx.duration}</strong>
                  </p>
                </div>

                <button
                  onClick={() => handleRemoveMedicine(rx.id)}
                  className="p-1 rounded-lg text-brand-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Remove formulation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT: Diagnosis, Dietary Pathya & Follow-up (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-soft space-y-4 text-xs">
            <h3 className="text-base font-bold text-brand-heading">
              {t('dc_final_diagnosis')}
            </h3>

            <div>
              <label className="block font-bold text-brand-heading mb-1 uppercase tracking-wider">
                Definitive AYUSH Diagnosis
              </label>
              <textarea
                rows={2}
                value={finalDiagnosis}
                onChange={(e) => setFinalDiagnosis(e.target.value)}
                className="w-full p-3 rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30 leading-relaxed text-brand-heading font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-brand-heading mb-1 uppercase tracking-wider">
                Pathya & Apathya (Diet & Lifestyle Restrictions)
              </label>
              <textarea
                rows={4}
                value={dietaryAdvice}
                onChange={(e) => setDietaryAdvice(e.target.value)}
                className="w-full p-3 rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30 leading-relaxed text-brand-heading"
              />
            </div>

            <div>
              <label className="block font-bold text-brand-heading mb-1 uppercase tracking-wider">
                Recommended Follow-Up Interval
              </label>
              <select
                value={followUpDays}
                onChange={(e) => setFollowUpDays(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30 font-medium"
              >
                <option value="7 Days">7 Days (Review acute flare)</option>
                <option value="14 Days">14 Days (Sub-acute progress)</option>
                <option value="21 Days">21 Days (Standard Panchakarma cycle)</option>
                <option value="30 Days">30 Days (Chronic Rasayana review)</option>
              </select>
            </div>

            <div className="pt-2 border-t border-brand-border flex items-center justify-between">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-brand-border hover:bg-brand-bg text-brand-heading font-semibold"
              >
                <Printer className="w-4 h-4" />
                <span>{t('dc_print_rx')}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsEmrModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white font-bold shadow-soft"
              >
                <span>{t('dc_send_his_emr')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Confirmation Modal for Sending to HIS/EMR */}
      <Modal
        isOpen={isEmrModalOpen}
        onClose={() => {
          setIsEmrModalOpen(false);
          setSyncSuccess(false);
        }}
        title={t('dc_modal_title')}
        subtitle={`Encrypted dispatch for ${patient.name} (${patient.tokenNumber})`}
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs">
          
          {!syncSuccess ? (
            <>
              <div className="p-3.5 bg-brand-bg rounded-2xl border border-brand-border space-y-2">
                <div className="flex justify-between">
                  <span className="text-brand-muted">Patient:</span>
                  <span className="font-bold text-brand-heading">{patient.name} ({patient.tokenNumber})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-muted">ABHA Address:</span>
                  <span className="font-mono text-brand-heading">{patient.abhaId || 'Linked via Mobile'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-muted">Diagnosis:</span>
                  <span className="font-medium text-brand-heading truncate max-w-[260px]">{finalDiagnosis}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-muted">Total Medicines:</span>
                  <span className="font-bold text-brand-teal-dark">{prescriptions.length} items</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-brand-teal-light/40 border border-brand-teal/40 space-y-1">
                <p className="font-bold text-brand-teal-dark flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>ABDM Milestone 1 & 2 Interoperability:</span>
                </p>
                <p className="text-brand-body leading-relaxed">
                  Upon confirmation, the digital AYUSH prescription bundle (FHIR / SNOMED CT compliant) will be pushed to the National Health Authority gateway and local hospital dispensary.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-brand-border">
                <button
                  onClick={() => setIsEmrModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-brand-border font-semibold text-brand-heading hover:bg-brand-bg"
                >
                  {t('pi_cancel')}
                </button>
                <button
                  onClick={handleSendToEmr}
                  disabled={syncingEmr}
                  className="px-6 py-2 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white font-bold shadow-soft flex items-center gap-2"
                >
                  {syncingEmr ? t('dc_syncing') : t('dc_confirm_sync')}
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            /* Sync Success View */
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
              <div className="w-14 h-14 rounded-2xl bg-[#EAF7ED] text-[#2E7D32] border border-[#A7D7B5] flex items-center justify-center mx-auto shadow-soft">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-brand-heading">Successfully Synced to Hospital EMR</h4>
                <p className="text-xs text-brand-muted mt-1">
                  Encounter #EMR-{Math.floor(100000 + Math.random() * 900000)} generated. The hospital dispensary and patient's ABHA app have been updated.
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setIsEmrModalOpen(false);
                    navigate('/doctor');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-brand-teal text-white font-bold shadow-soft"
                >
                  {t('dc_return_queue')}
                </button>
              </div>
            </div>
          )}

        </div>
      </Modal>

    </div>
  );
};
