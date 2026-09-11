export type UserRole = 'patient' | 'worker' | 'doctor' | 'admin' | 'lab' | 'guest';

export type PatientStatus = 'Verified' | 'Pending' | 'Processing' | 'Rejected';

export type CareSystem = 'AYURVEDA' | 'ALLOPATHY';

export interface Hospital {
  id: string;
  name: string;
  type: string;
  category: 'Ayurveda' | 'Homoeopathy' | 'Unani' | 'Siddha' | 'Integrative';
  location: string;
  city: string;
  state: string;
  activeDoctors: number;
  currentWaitMinutes: number;
  rating: number;
  totalPatientsToday: number;
  emergencyAvailable: boolean;
  departments: string[];
}

export interface DocumentItem {
  id: string;
  patientId: string;
  consultationId?: string;
  name: string;
  type: 'Prescription' | 'Lab Report' | 'Discharge Summary' | 'Diet Chart' | 'Ayurvedic Case Sheet' | 'Diagnostic Scan' | 'Scan';
  size: string;
  uploadDate: string;
  status: PatientStatus;
  url?: string;
  ocrExtractedSummary?: string;
}

export interface ClinicalSummary {
  patientBanner?: {
    name: string;
    patientId: string;
    consultationId: string;
    careSystem: CareSystem;
  };
  prakriti: string;
  vikriti: string;
  chiefComplaints: string[];
  symptoms?: string[];
  duration: string;
  severity?: 'Mild' | 'Moderate' | 'Severe';
  medications?: string[];
  allergies?: string[];
  agni: string;
  koshtha: string;
  nidana: string;
  srotasInvolved: string[];
  aiGeneratedNotes: string;
  recommendedTherapies: string[];
  lifestyleAdvice: string[];
  verifiedByDoctor: boolean;
  verifiedAt?: string;
  doctorNotes?: string;
  priorityFlag?: boolean;
}

export interface EvidenceReport {
  id: string;
  patientId: string;
  patientName: string;
  tokenNumber: string;
  careSystem?: CareSystem;
  title: string;
  date: string;
  chiefComplaint: string;
  prakriti: string;
  vikriti: string;
  agni: string;
  koshtha: string;
  findings: string;
  redFlags: string[];
  therapies: string[];
  diet: string[];
  readByDoctor: boolean;
  status: PatientStatus;
  priorityFlag?: boolean;
}

export interface PrescriptionItem {
  id: string;
  medicineName: string;
  form: 'Churna' | 'Vati / Tablet' | 'Kwath' | 'Asava / Arishta' | 'Taila / Oil' | 'Ghrita' | 'Capsule' | 'Tablet / Capsule' | 'Syrup';
  dosage: string;
  anupana: string; // Vehicle e.g. Warm water, Honey, Milk
  timing: 'Before Food' | 'After Food' | 'Empty Stomach' | 'Bedtime';
  duration: string;
  careSystem?: CareSystem;
}

export interface PreviousVisit {
  id: string;
  date: string;
  doctor: string;
  department: string;
  diagnosis: string;
  chiefComplaints: string;
  prescriptionsCount: number;
  status: 'Completed' | 'Follow-up';
  careSystem?: CareSystem;
}

export interface Consultation {
  id: string;
  tokenNumber: string; // e.g. AYU-260910-018 or ALLO-260910-018
  patientId: string;
  patientName: string;
  hospitalId: string;
  hospitalName: string;
  careSystem: CareSystem;
  department: string;
  doctorName?: string;
  date: string;
  status: PatientStatus;
  chiefComplaint: string;
  symptoms: string[];
  duration: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  hadBefore: string;
  existingConditions: string[];
  currentMedications: string[];
  knownAllergies: string[];
  recentTests: string;
  additionalNotes?: string;
  priorityFlag: boolean;
  aiGeneratedNotes?: string;
  evidenceReportId?: string;
  documents?: DocumentItem[];
  prescriptions?: PrescriptionItem[];
}

export interface Patient {
  id: string;
  tokenNumber: string;
  queueNumber: number;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email?: string;
  abhaId?: string;
  address: string;
  bloodGroup: string;
  hospitalId: string;
  hospitalName: string;
  registrationDate: string;
  appointmentTime: string;
  status: PatientStatus;
  careSystem?: CareSystem;
  chiefComplaint: string;
  doshaPrimary: string;
  preferredLanguage: string;
  priorityFlag?: boolean;
  vitals: {
    bp: string;
    pulse: string;
    weight: string;
    spo2: string;
    temperature: string;
  };
  clinicalSummary: ClinicalSummary;
  documents: DocumentItem[];
  prescriptions: PrescriptionItem[];
  previousVisits: PreviousVisit[];
  ayurvedaHistory?: Consultation[];
  allopathyHistory?: Consultation[];
}

export interface IntakeChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  isAudio?: boolean;
  options?: string[];
}

export interface ClinicalQuestion {
  id: string;
  step: number;
  category: 'Chief Complaint' | 'Current Symptoms' | 'Duration & Severity' | 'Medical History' | 'Medications & Allergies' | 'Consultations & Observations';
  question: string;
  ayushContext: string;
  type: 'select' | 'chips' | 'scale' | 'text';
  options: string[];
  placeholder?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'AYUSH Worker' | 'Senior Vaidya' | 'Pharmacist' | 'Admin' | 'Lab Technician';
  counter: string;
  department: string;
  status: 'Active' | 'On Break' | 'Offline';
  patientsHandledToday: number;
  avgHandlingMinutes: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
  status: 'Success' | 'Warning' | 'Error';
  category: 'ABDM Sync' | 'Triage AI' | 'User Access' | 'Prescription Lock' | 'Lab Diagnostic';
}

export interface AdminStats {
  totalFootfallToday: number;
  avgTriageTimeMinutes: number;
  aiConcordanceRate: number;
  abdmSyncRate: number;
  activeCounters: number;
  criticalWaitAlerts: number;
}

export type DoctorDiscipline = 'Ayurveda' | 'Allopathy';

export interface Doctor {
  id: string;
  name: string;
  discipline: DoctorDiscipline;
  qualification: string;
  licenseId: string;
  department: string;
  hospitalId: string;
  hospitalName: string;
  yearsOfPractice: number;
  contactNumber: string;
  email: string;
  avatarUrl?: string;
  opdCounter?: string;
}


