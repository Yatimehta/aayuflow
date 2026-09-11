import React, { createContext, useContext, useState, useEffect } from 'react';
import { Hospital, Patient, UserRole, PatientStatus, StaffMember, AuditLog, AdminStats, EvidenceReport, CareSystem, Consultation, DocumentItem, Doctor, DoctorDiscipline } from '../types';
import { MOCK_HOSPITALS, MOCK_PATIENTS, MOCK_STAFF, MOCK_AUDIT_LOGS, MOCK_ADMIN_STATS, MOCK_CONSULTATIONS, MOCK_DOCTORS } from '../data/mockData';
import { generateAIClinicalReport } from '../utils/aiReportGenerator';

export interface ToastItem {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'alert';
}

export interface CurrentUser {
  name: string;
  role: UserRole;
  abhaId?: string;
  phone?: string;
  email?: string;
  department?: string;
  counter?: string;
  discipline?: DoctorDiscipline;
  qualification?: string;
  licenseId?: string;
  hospitalName?: string;
  yearsOfPractice?: number;
  avatarUrl?: string;
}

interface AppContextType {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: CurrentUser | null;
  doctors: Doctor[];
  loginAsPatient: (p: Patient) => void;
  loginAsStaff: (
    role: UserRole, 
    name: string, 
    department?: string, 
    discipline?: DoctorDiscipline,
    extra?: Partial<CurrentUser>
  ) => void;
  logout: () => void;
  hospitals: Hospital[];
  selectedHospital: Hospital;
  setSelectedHospital: (h: Hospital) => void;
  patients: Patient[];
  activePatient: Patient | null;
  setActivePatientId: (id: string | null) => void;
  addPatient: (newPatientData: Partial<Patient>) => Patient;
  completeIntake: (
    patientData: Partial<Patient>,
    answers?: Record<string, string>,
    workerNotes?: string,
    careSystem?: CareSystem
  ) => { patient: Patient; report: EvidenceReport };
  evidenceReports: EvidenceReport[];
  addEvidenceReport: (report: EvidenceReport) => void;
  markReportAsRead: (reportId: string) => void;
  unreadReportCount: number;
  consultations: Consultation[];
  attachLabReport: (consultationId: string, doc: DocumentItem) => void;
  updatePatientStatus: (patientId: string, status: PatientStatus, notes?: string) => void;
  updatePatientClinicalSummary: (patientId: string, summary: Partial<Patient['clinicalSummary']>) => void;
  addPrescriptionToPatient: (patientId: string, prescription: any) => void;
  staff: StaffMember[];
  updateStaffStatus: (id: string, status: StaffMember['status']) => void;
  auditLogs: AuditLog[];
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  adminStats: AdminStats;
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  unreadCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'ayuflow_state_v1';

const INITIAL_EVIDENCE_REPORTS: EvidenceReport[] = [
  {
    id: 'rep-seed-1',
    patientId: 'pat-1',
    patientName: 'Rameshwar Prasad Sharma',
    tokenNumber: 'AYU-260910-018',
    careSystem: 'AYURVEDA',
    priorityFlag: false,
    title: 'Ayurvedic Prakriti & Sandhivata Synthesis Report',
    date: 'Today, 09:15 AM',
    chiefComplaint: 'Bilateral Knee Joint Pain & Morning Stiffness (Sandhivata)',
    prakriti: 'Vata-Kapha',
    vikriti: 'Aggravated Vata localized in Sandhi (Joints) with Asthi-Majja Kshaya',
    agni: 'Vishama Agni (Irregular appetite with variable digestion)',
    koshtha: 'Krura Koshtha (Hard stools, tendency towards constipation)',
    findings: 'AI synthesis for Rameshwar Prasad Sharma (58y, Male) indicates classical Sandhivata (Osteoarthritis). Crepitus and morning stiffness correlate with Vata Prakopa exacerbated by cold climatic drafts. Radiography exhibits medial joint space narrowing. No septic or gouty arthritis markers detected.',
    redFlags: [
      'Persistent morning joint stiffness exceeding 45 minutes',
      'Crepitus during bilateral knee extension and stair climbing',
      'Difficulty rising from floor without upper body support'
    ],
    therapies: [
      'Janu Basti with Murivenna & Mahanarayana Taila (7-day course)',
      'Patra Pinda Sweda for local pain & crepitus relief',
      'Mrudu Virechana with Eranda Taila for Vata-anulomana'
    ],
    diet: [
      'Consume warm boiled water with 1 pinch of ginger powder',
      'Add 1 teaspoon of organic cow ghee to warm milk before bedtime',
      'Strictly avoid refrigerated food, dry pulses (Chana, Rajma), and late dinner'
    ],
    readByDoctor: false,
    status: 'Processing'
  },
  {
    id: 'rep-seed-2',
    patientId: 'pat-2',
    patientName: 'Ananya Mehra',
    tokenNumber: 'ALLO-260910-019',
    careSystem: 'ALLOPATHY',
    priorityFlag: false,
    title: 'Type 2 Diabetes Mellitus Glycemic Assessment & Triage Summary',
    date: 'Today, 09:30 AM',
    chiefComplaint: 'Type 2 Diabetes Mellitus Glycemic Assessment & Lethargy',
    prakriti: 'Pitta-Vata',
    vikriti: 'Hyperglycemic metabolic dysregulation with Medovaha involvement',
    agni: 'Tikshna Agni (Intense appetite, gastric burning if meals delayed)',
    koshtha: 'Mrudu Koshtha (Sensitive bowel with loose tendency)',
    findings: 'Clinical triage for Ananya Mehra (34y, Female) demonstrates HbA1c 7.4% on Metformin therapy. Patient experiences post-prandial fatigue and erratic meal schedules.',
    redFlags: [
      'Post-prandial drowsiness and fluctuating glucose levels',
      'High work-related stress triggering elevated fasting cortisol'
    ],
    therapies: [
      'Endocrine follow-up & continuous glucose monitoring review',
      'Low GI Mediterranean / Sattvic meal plan',
      '30-minute post-meal brisk walking protocol'
    ],
    diet: [
      'Fresh leafy salads before lunch',
      'Replace refined carbohydrates with complex grains and legumes',
      'Discontinue late night espresso and processed snacks'
    ],
    readByDoctor: true,
    status: 'Processing'
  },
  {
    id: 'rep-seed-3',
    patientId: 'pat-6',
    patientName: 'Mohd. Tariq Siddiqui',
    tokenNumber: 'AYU-260910-023',
    careSystem: 'AYURVEDA',
    priorityFlag: true,
    title: 'Severe Gridhrasi (Sciatica) Radiculopathy Priority Dossier',
    date: 'Today, 10:00 AM',
    chiefComplaint: 'Severe Sciatica & Lumbar Radiculopathy (Gridhrasi) radiating to left heel',
    prakriti: 'Vata-Kapha',
    vikriti: 'Severe Vata Prakopa localized in Kandara & Snayu with Asthi-Majjavaha Sroto-Dushti',
    agni: 'Sama Agni',
    koshtha: 'Krura Koshtha',
    findings: 'PRIORITY ALERT: Patient presents with acute debilitating left sciatica, positive SLR at 40 degrees, and inability to bear full weight. Immediate Kati Basti and urgent doctor review recommended.',
    redFlags: [
      'CRITICAL: Shooting neurological pain radiating down left leg with antalgic gait',
      'Positive Straight Leg Raise (SLR) at 40 degrees with acute paracentral pain',
      'Motor weakness in left dorsiflexion requiring immediate clinical supervision'
    ],
    therapies: [
      'Kati Basti with Sahacharadi and Dhanwantharam Taila (7 days)',
      'Matra Basti with Ksheerabala Taila 60ml daily for 8 days',
      'Urgent neuro-clinical evaluation'
    ],
    diet: [
      'Consume only warm freshly cooked meals with Dashamula Kwath',
      'Strict bed rest on firm orthopedic surface',
      'Avoid sudden spinal rotation and two-wheeler commuting'
    ],
    readByDoctor: false,
    status: 'Pending'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state from localStorage if available
  const [savedData] = useState(() => {
    try {
      const item = localStorage.getItem(LOCAL_STORAGE_KEY);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  });

  const [currentRole, setRoleState] = useState<UserRole>(savedData?.currentRole || 'guest');
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(
    savedData?.currentUser || {
      name: 'Rameshwar Prasad Sharma',
      role: 'patient',
      abhaId: '45-9821-4321-7890',
      phone: '+91 98112 34567'
    }
  );

  const [hospitals] = useState<Hospital[]>(MOCK_HOSPITALS);
  const [selectedHospital, setSelectedHospital] = useState<Hospital>(
    savedData?.selectedHospitalId 
      ? MOCK_HOSPITALS.find(h => h.id === savedData.selectedHospitalId) || MOCK_HOSPITALS[0]
      : MOCK_HOSPITALS[0]
  );
  const [patients, setPatients] = useState<Patient[]>(savedData?.patients || MOCK_PATIENTS);
  const [consultations, setConsultations] = useState<Consultation[]>(savedData?.consultations || MOCK_CONSULTATIONS);
  const [evidenceReports, setEvidenceReports] = useState<EvidenceReport[]>(
    savedData?.evidenceReports || INITIAL_EVIDENCE_REPORTS
  );
  const [activePatientId, setActivePatientId] = useState<string | null>(savedData?.activePatientId || 'pat-1');
  const [staff, setStaff] = useState<StaffMember[]>(MOCK_STAFF);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [adminStats] = useState<AdminStats>(MOCK_ADMIN_STATS);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n-1',
      title: 'New AI Intake Completed',
      message: 'Token AYU-260910-018 clinical dossier synthesized for Dr. Verma.',
      time: '5m ago',
      read: false,
      type: 'success'
    },
    {
      id: 'n-2',
      title: 'Document Verified by OCR',
      message: 'Knee X-Ray Bilateral verified for Rameshwar Sharma.',
      time: '20m ago',
      read: false,
      type: 'info'
    },
    {
      id: 'n-3',
      title: 'Resubmission Requested',
      message: 'USG Pelvis scan for Pooja Kulkarni needs re-upload.',
      time: '1h ago',
      read: true,
      type: 'alert'
    }
  ]);

  // Persist important data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          currentRole,
          currentUser,
          selectedHospitalId: selectedHospital.id,
          patients,
          consultations,
          evidenceReports,
          activePatientId
        })
      );
    } catch {
      // safe fallback
    }
  }, [currentRole, currentUser, selectedHospital, patients, consultations, evidenceReports, activePatientId]);

  const activePatient = patients.find(p => p.id === activePatientId) || patients[0] || null;

  const showToast = (toast: Omit<ToastItem, 'id'>) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const setRole = (role: UserRole) => {
    setRoleState(role);
  };

  const loginAsPatient = (p: Patient) => {
    setRoleState('patient');
    setCurrentUser({
      name: p.name,
      role: 'patient',
      abhaId: p.abhaId,
      phone: p.phone,
      email: p.email
    });
    setActivePatientId(p.id);
    showToast({
      type: 'success',
      title: 'ABHA Link Verified',
      message: `Welcome back, ${p.name}. Health records retrieved.`
    });
  };

  const loginAsStaff = (
    role: UserRole, 
    name: string, 
    department?: string,
    discipline?: DoctorDiscipline,
    extra?: Partial<CurrentUser>
  ) => {
    setRoleState(role);

    const matchedDoctor = role === 'doctor'
      ? MOCK_DOCTORS.find(d => 
          (name && d.name.toLowerCase().includes(name.toLowerCase())) || 
          (discipline && d.discipline === discipline)
        ) || MOCK_DOCTORS[0]
      : null;

    const assignedDiscipline = discipline || matchedDoctor?.discipline || (role === 'doctor' ? 'Ayurveda' : undefined);

    const updatedUser: CurrentUser = {
      name,
      role,
      department: department || matchedDoctor?.department || (role === 'doctor' ? (assignedDiscipline === 'Allopathy' ? 'General Medicine & OPD' : 'Kayachikitsa (Internal Medicine)') : role === 'admin' ? 'Hospital Administration' : 'Intake Desk'),
      counter: matchedDoctor?.opdCounter || (role === 'doctor' ? 'OPD Room 104' : 'Desk AYUSH-A1'),
      discipline: assignedDiscipline,
      qualification: extra?.qualification || matchedDoctor?.qualification || (assignedDiscipline === 'Allopathy' ? 'MBBS, MD (General Medicine)' : 'BAMS, MD (Ayurveda)'),
      licenseId: extra?.licenseId || matchedDoctor?.licenseId || (assignedDiscipline === 'Allopathy' ? 'MCI-DEL-2016-55421' : 'AYU-MED-DEL-2014-889'),
      yearsOfPractice: extra?.yearsOfPractice || matchedDoctor?.yearsOfPractice || (assignedDiscipline === 'Allopathy' ? 10 : 14),
      hospitalName: selectedHospital.name,
      email: extra?.email || matchedDoctor?.email || `${name.toLowerCase().replace(/[^a-z]/g, '.')}@aiia.gov.in`,
      phone: extra?.phone || matchedDoctor?.contactNumber || '+91 98101 23456',
      avatarUrl: extra?.avatarUrl || matchedDoctor?.avatarUrl,
      ...extra
    };

    setCurrentUser(updatedUser);
    showToast({
      type: 'success',
      title: 'Authenticated',
      message: `Signed in as ${name} (${role.toUpperCase()}${assignedDiscipline ? ` · ${assignedDiscipline}` : ''})`
    });
  };


  const logout = () => {
    setRoleState('guest');
    setCurrentUser(null);
    showToast({
      type: 'info',
      title: 'Logged Out',
      message: 'Session closed successfully.'
    });
  };

  const completeIntake = (
    patientData: Partial<Patient>,
    answers: Record<string, string> = {},
    workerNotes?: string,
    stream: CareSystem = 'AYURVEDA'
  ): { patient: Patient; report: EvidenceReport } => {
    const careSystem = patientData.careSystem || stream;
    const nextQueue = patients.length + 1;
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const datePrefix = `${yy}${mm}${dd}`;
    const token = patientData.tokenNumber || `${careSystem === 'AYURVEDA' ? 'AYU' : 'ALLO'}-${datePrefix}-${String(nextQueue).padStart(3, '0')}`;
    const patId = patientData.id || ('pat-' + Date.now());
    const name = patientData.name || 'Anonymous Patient';
    const age = typeof patientData.age === 'number' ? patientData.age : parseInt(String(patientData.age || '42'), 10) || 42;
    const gender = (patientData.gender as 'Male' | 'Female' | 'Other') || 'Male';
    const chiefComplaint = answers['q-1'] || patientData.chiefComplaint || 'General OPD consultation';

    const severityAnswer = answers['q-4'] || '';
    const isSevere = severityAnswer.toLowerCase().includes('severe') || chiefComplaint.toLowerCase().includes('severe') || chiefComplaint.toLowerCase().includes('sciatica');

    // Generate AI Clinical Report tailored to chief complaint
    const aiReport = generateAIClinicalReport({
      patientId: patId,
      patientName: name,
      tokenNumber: token,
      chiefComplaint,
      age,
      gender,
      careSystem,
      answers
    });
    aiReport.readByDoctor = false;
    aiReport.priorityFlag = isSevere;
    aiReport.careSystem = careSystem;

    // Create consultation object
    const conId = 'con-' + Date.now();
    const newConsultation: Consultation = {
      id: conId,
      tokenNumber: token,
      patientId: patId,
      patientName: name,
      hospitalId: selectedHospital.id,
      hospitalName: selectedHospital.name,
      careSystem,
      department: careSystem === 'AYURVEDA' ? 'Kayachikitsa' : 'General Medicine',
      doctorName: careSystem === 'AYURVEDA' ? 'Dr. Alok Verma, MD (Ayu)' : 'Dr. Ritu Saxena, MD',
      date: new Date().toISOString().split('T')[0],
      status: 'Processing',
      chiefComplaint,
      symptoms: [answers['q-2'] || chiefComplaint],
      duration: answers['q-3'] || '3 weeks',
      severity: isSevere ? 'Severe' : severityAnswer.includes('Moderate') ? 'Moderate' : 'Mild',
      hadBefore: answers['q-5'] || 'First episode',
      existingConditions: answers['q-6'] ? [answers['q-6']] : [],
      currentMedications: answers['q-7'] ? [answers['q-7']] : [],
      knownAllergies: answers['q-8'] ? [answers['q-8']] : [],
      recentTests: answers['q-9'] || 'None reported',
      additionalNotes: answers['q-10'] || workerNotes,
      priorityFlag: isSevere,
      aiGeneratedNotes: aiReport.findings,
      evidenceReportId: aiReport.id,
      documents: patientData.documents || []
    };

    const newPat: Patient = {
      id: patId,
      tokenNumber: token,
      queueNumber: nextQueue,
      name,
      age,
      gender,
      phone: patientData.phone || '+91 98000 00000',
      email: patientData.email,
      abhaId: patientData.abhaId || `${Math.floor(10 + Math.random() * 89)}-${Math.floor(1000 + Math.random() * 8999)}-${Math.floor(1000 + Math.random() * 8999)}-${Math.floor(1000 + Math.random() * 8999)}`,
      address: patientData.address || 'New Delhi, India',
      bloodGroup: patientData.bloodGroup || 'B+',
      hospitalId: selectedHospital.id,
      hospitalName: selectedHospital.name,
      registrationDate: new Date().toISOString().split('T')[0],
      appointmentTime: 'Today, OPD Queue #' + nextQueue,
      status: 'Processing',
      careSystem,
      priorityFlag: isSevere,
      chiefComplaint,
      doshaPrimary: aiReport.prakriti,
      preferredLanguage: patientData.preferredLanguage || 'Hindi (हिंदी)',
      vitals: {
        bp: '120/80 mmHg',
        pulse: '74 bpm',
        weight: '68 kg',
        spo2: '99%',
        temperature: '98.4 °F',
        ...(patientData.vitals || {})
      },
      clinicalSummary: {
        patientBanner: {
          name,
          patientId: patId,
          consultationId: conId,
          careSystem
        },
        prakriti: aiReport.prakriti,
        vikriti: aiReport.vikriti,
        chiefComplaints: [chiefComplaint],
        symptoms: [answers['q-2'] || chiefComplaint],
        duration: answers['q-3'] || '3 weeks',
        severity: isSevere ? 'Severe' : 'Moderate',
        medications: answers['q-7'] ? [answers['q-7']] : [],
        allergies: answers['q-8'] ? [answers['q-8']] : [],
        agni: aiReport.agni,
        koshtha: aiReport.koshtha,
        nidana: answers['q-5'] || 'Dietary irregularity & seasonal aggravation',
        srotasInvolved: ['Rasavaha Srotas', 'Asthivaha Srotas'],
        aiGeneratedNotes: aiReport.findings,
        recommendedTherapies: aiReport.therapies,
        lifestyleAdvice: aiReport.diet,
        verifiedByDoctor: false,
        priorityFlag: isSevere,
        doctorNotes: workerNotes ? `Worker Intake Note: ${workerNotes}` : undefined
      },
      documents: patientData.documents || [],
      prescriptions: [],
      previousVisits: [],
      ayurvedaHistory: careSystem === 'AYURVEDA' ? [newConsultation] : [],
      allopathyHistory: careSystem === 'ALLOPATHY' ? [newConsultation] : []
    };

    setPatients(prev => [newPat, ...prev]);
    setEvidenceReports(prev => [aiReport, ...prev]);
    setConsultations(prev => [newConsultation, ...prev]);
    setActivePatientId(newPat.id);

    // Notification for doctor & hospital
    const notif: NotificationItem = {
      id: 'n-' + Date.now(),
      title: isSevere ? 'CRITICAL: Priority AI Intake' : 'New AI Intake Completed',
      message: `Token ${newPat.tokenNumber} (${newPat.name}): Clinical report synthesized for ${careSystem} stream.${isSevere ? ' [PRIORITY FLAG]' : ''}`,
      time: 'Just now',
      read: false,
      type: isSevere ? 'alert' : 'success'
    };
    setNotifications(prev => [notif, ...prev]);

    // Audit log for admin ABDM compliance
    const newLog: AuditLog = {
      id: 'aud-' + Date.now(),
      timestamp: 'Just now',
      action: `AI ${careSystem} Intake Synthesized`,
      actor: 'AyuFlow Triage Engine',
      details: `Synthesized dossier for Token ${newPat.tokenNumber} (${newPat.name}) - Stream: ${careSystem}. Priority: ${isSevere ? 'CRITICAL' : 'STANDARD'}.`,
      status: isSevere ? 'Warning' : 'Success',
      category: 'Triage AI'
    };
    setAuditLogs(prev => [newLog, ...prev]);

    showToast({
      type: isSevere ? 'warning' : 'success',
      title: isSevere ? 'Priority Intake Flagged' : 'Intake Completed & Token Issued',
      message: `Token #${newPat.tokenNumber} [${careSystem}] generated and added to queue.`
    });

    return { patient: newPat, report: aiReport };
  };

  const attachLabReport = (consultationId: string, doc: DocumentItem) => {
    setConsultations(prev => prev.map(c => {
      if (c.id === consultationId || c.tokenNumber === consultationId) {
        return {
          ...c,
          documents: [...(c.documents || []), doc]
        };
      }
      return c;
    }));

    setPatients(prev => prev.map(p => {
      const matchesCon = p.tokenNumber === consultationId ||
        p.ayurvedaHistory?.some(c => c.id === consultationId || c.tokenNumber === consultationId) ||
        p.allopathyHistory?.some(c => c.id === consultationId || c.tokenNumber === consultationId);

      if (matchesCon) {
        return {
          ...p,
          documents: [doc, ...p.documents]
        };
      }
      return p;
    }));

    showToast({
      type: 'success',
      title: 'Lab Report Linked',
      message: `${doc.name} successfully linked to Consultation ${consultationId}.`
    });

    const newLog: AuditLog = {
      id: 'aud-' + Date.now(),
      timestamp: 'Just now',
      action: 'Diagnostic Document Attached',
      actor: 'Lab Staff Technician',
      details: `Uploaded ${doc.name} to Consultation ID ${consultationId}.`,
      status: 'Success',
      category: 'Lab Diagnostic'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const addPatient = (patientData: Partial<Patient>): Patient => {
    const result = completeIntake(patientData);
    return result.patient;
  };

  const addEvidenceReport = (report: EvidenceReport) => {
    setEvidenceReports(prev => [report, ...prev]);
  };

  const markReportAsRead = (reportId: string) => {
    setEvidenceReports(prev => prev.map(r => r.id === reportId ? { ...r, readByDoctor: true } : r));
  };

  const unreadReportCount = evidenceReports.filter(r => !r.readByDoctor).length;

  const updatePatientStatus = (patientId: string, status: PatientStatus, notes?: string) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          status,
          clinicalSummary: {
            ...p.clinicalSummary,
            verifiedByDoctor: status === 'Verified',
            verifiedAt: status === 'Verified' ? 'Just now' : undefined,
            doctorNotes: notes || p.clinicalSummary.doctorNotes
          }
        };
      }
      return p;
    }));
    showToast({
      type: status === 'Verified' ? 'success' : status === 'Rejected' ? 'error' : 'info',
      title: `Status Updated to ${status}`,
      message: `Patient case record updated successfully.`
    });
  };

  const updatePatientClinicalSummary = (patientId: string, summaryUpdate: Partial<Patient['clinicalSummary']>) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          clinicalSummary: {
            ...p.clinicalSummary,
            ...summaryUpdate
          }
        };
      }
      return p;
    }));
    showToast({
      type: 'success',
      title: 'Clinical Summary Updated',
      message: 'AI and doctor synthesis saved.'
    });
  };

  const addPrescriptionToPatient = (patientId: string, prescription: any) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          prescriptions: [...p.prescriptions, prescription]
        };
      }
      return p;
    }));
    showToast({
      type: 'success',
      title: 'Prescription Added',
      message: `${prescription.medicineName} added to patient regimen.`
    });
  };

  const updateStaffStatus = (id: string, status: StaffMember['status']) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    showToast({
      type: 'info',
      title: 'Staff Status Updated',
      message: `Counter staff status set to ${status}.`
    });
  };

  const addAuditLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      id: 'aud-' + Date.now(),
      timestamp: 'Just now',
      ...log
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setRole,
        currentUser,
        doctors: MOCK_DOCTORS,
        loginAsPatient,
        loginAsStaff,
        logout,
        hospitals,
        selectedHospital,
        setSelectedHospital,
        patients,
        activePatient,
        setActivePatientId,
        addPatient,
        completeIntake,
        evidenceReports,
        addEvidenceReport,
        markReportAsRead,
        unreadReportCount,
        consultations,
        attachLabReport,
        updatePatientStatus,
        updatePatientClinicalSummary,
        addPrescriptionToPatient,
        staff,
        updateStaffStatus,
        auditLogs,
        addAuditLog,
        adminStats,
        toasts,
        showToast,
        removeToast,
        notifications,
        markNotificationRead,
        clearAllNotifications,
        unreadCount
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
