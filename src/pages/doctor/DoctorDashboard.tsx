import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../utils/translations';
import { StatCard } from '../../components/StatCard';
import { PatientTable } from '../../components/PatientTable';
import { DoctorOtpModal } from '../../components/DoctorOtpModal';
import { Patient } from '../../types';
import { isAyurvedicRecord, isAllopathicRecord } from '../../utils/streamClassification';

export const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    patients,
    selectedHospital,
    setActivePatientId,
    unlockPatient,
    unreadReportCount,
    showToast,
    currentUser
  } = useApp();

  // Selected Patient for OTP Consultation Access
  const [selectedOtpPatient, setSelectedOtpPatient] = useState<Patient | null>(null);

  // A doctor's queue only ever contains their own stream — an Allopathy
  // doctor has no business seeing (or being counted against) Ayurvedic
  // intakes, and vice versa. Only actually restrict once we know the
  // doctor's discipline; leave unfiltered otherwise (e.g. still loading).
  const myPatients = currentUser?.discipline === 'Ayurveda'
    ? patients.filter(isAyurvedicRecord)
    : currentUser?.discipline === 'Allopathy'
    ? patients.filter(isAllopathicRecord)
    : patients;

  const waitingPatients = myPatients.filter(p => p.status === 'Processing' || p.status === 'Pending');
  const completedPatients = myPatients.filter(p => p.status === 'Verified');
  const aiReadyPatients = myPatients.filter(p => p.clinicalSummary?.aiGeneratedNotes && p.status !== 'Rejected');
  const waitMinutes = selectedHospital.currentWaitMinutes || 18;

  const handleStartConsultation = (p: Patient) => {
    setSelectedOtpPatient(p);
  };

  const handleOtpSuccess = (p: Patient) => {
    unlockPatient(p.id);
    setActivePatientId(p.id);
    setSelectedOtpPatient(null);
    showToast({
      type: 'success',
      title: 'Consultation Access Verified',
      message: `Dossier unlocked for ${p.name}. Loading clinical summary.`
    });
    navigate(`/doctor/patient?id=${p.id}`);
  };

  return (
    <div className="relative z-10">
      
      {/* 1. TOP METRIC STRIP: Passive Operational Summary (Compact Vertical Footprint) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mb-3.5">
        <StatCard
          title="Waiting"
          value={`${waitingPatients.length || 5} Patients`}
          icon={Clock}
          variant="amber"
          compact
        />
        <StatCard
          title="Completed Today"
          value={`${completedPatients.length || 3} Patients`}
          icon={CheckCircle2}
          variant="mint"
          compact
        />
        <StatCard
          title="AI Summary Ready"
          value={`${aiReadyPatients.length || unreadReportCount || 3} Drafts`}
          icon={Sparkles}
          variant="teal"
          compact
        />
        <StatCard
          title="Average Wait Time"
          value={`${waitMinutes} mins`}
          icon={Users}
          variant="blue"
          compact
        />
      </div>

      {/* 2. STREAMLINED OPD CONSULTATION QUEUE */}
      <PatientTable
        patients={myPatients}
        onSelectPatient={handleStartConsultation}
        onStartConsultation={handleStartConsultation}
        title={t('nav_queue')}
        showLanguage={false}
      />

      {/* 3. DOCTOR ACCESS OTP MODAL */}
      <DoctorOtpModal
        isOpen={!!selectedOtpPatient}
        patient={selectedOtpPatient}
        onClose={() => setSelectedOtpPatient(null)}
        onSuccess={handleOtpSuccess}
      />

    </div>
  );
};
