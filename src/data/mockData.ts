import { Hospital, Patient, ClinicalQuestion, StaffMember, AuditLog, AdminStats, Consultation } from '../types';

export const MOCK_HOSPITALS: Hospital[] = [
  {
    id: 'hosp-1',
    name: 'All India Institute of Ayurveda (AIIA)',
    type: 'Apex Central Institute',
    category: 'Ayurveda',
    location: 'Sarita Vihar, Mathura Road',
    city: 'New Delhi',
    state: 'Delhi',
    activeDoctors: 24,
    currentWaitMinutes: 18,
    rating: 4.9,
    totalPatientsToday: 284,
    emergencyAvailable: true,
    departments: ['Kayachikitsa (Internal Medicine)', 'Panchakarma', 'Shalya Tantra', 'Swasthavritta', 'Stri Roga']
  },
  {
    id: 'hosp-2',
    name: 'National Institute of Ayurveda (NIA)',
    type: 'National Deemed University',
    category: 'Ayurveda',
    location: 'Madhav Vilas, Amer Road',
    city: 'Jaipur',
    state: 'Rajasthan',
    activeDoctors: 19,
    currentWaitMinutes: 25,
    rating: 4.8,
    totalPatientsToday: 215,
    emergencyAvailable: false,
    departments: ['Kayachikitsa', 'Dravyaguna', 'Rasa Shastra', 'Kaumarbhritya']
  },
  {
    id: 'hosp-3',
    name: 'CCRAS Central Ayurveda Research Hospital',
    type: 'Central Research Council OPD',
    category: 'Integrative',
    location: 'Worli Sea Face',
    city: 'Mumbai',
    state: 'Maharashtra',
    activeDoctors: 14,
    currentWaitMinutes: 12,
    rating: 4.7,
    totalPatientsToday: 160,
    emergencyAvailable: false,
    departments: ['Metabolic Disorders', 'Sandhigata Vata Care', 'Rasayana & Geriatrics']
  },
  {
    id: 'hosp-4',
    name: 'Government Ayurveda College & Hospital',
    type: 'State Apex Healthcare Centre',
    category: 'Ayurveda',
    location: 'Thiruvananthapuram Main',
    city: 'Trivandrum',
    state: 'Kerala',
    activeDoctors: 31,
    currentWaitMinutes: 15,
    rating: 4.9,
    totalPatientsToday: 340,
    emergencyAvailable: true,
    departments: ['Authentic Panchakarma', 'Neurological Rehab', 'Visha Chikitsa', 'Shalakya Tantra']
  },
  {
    id: 'hosp-5',
    name: 'Patanjali Yogpeeth AYUSH Integrated OPD',
    type: 'Holistic Yoga & Ayurveda Centre',
    category: 'Integrative',
    location: 'Maharishi Dayanand Gram, Delhi-Haridwar Highway',
    city: 'Haridwar',
    state: 'Uttarakhand',
    activeDoctors: 16,
    currentWaitMinutes: 30,
    rating: 4.6,
    totalPatientsToday: 195,
    emergencyAvailable: true,
    departments: ['Yogic Therapy', 'Dietetics & Pathya', 'Nadi Pariksha OPD']
  },
  {
    id: 'hosp-6',
    name: 'National Institute of Homoeopathy (NIH)',
    type: 'National Apex Homoeopathic Institute',
    category: 'Homoeopathy',
    location: 'Block GE, Sector III, Salt Lake',
    city: 'Kolkata',
    state: 'West Bengal',
    activeDoctors: 12,
    currentWaitMinutes: 20,
    rating: 4.7,
    totalPatientsToday: 140,
    emergencyAvailable: false,
    departments: ['Chronic Care OPD', 'Materia Medica Clinic', 'Organon Clinic']
  }
];

export const MOCK_CONSULTATIONS: Consultation[] = [
  {
    id: 'con-101',
    tokenNumber: 'AYU-260910-018',
    patientId: 'pat-1',
    patientName: 'Rameshwar Prasad Sharma',
    hospitalId: 'hosp-1',
    hospitalName: 'All India Institute of Ayurveda (AIIA)',
    careSystem: 'AYURVEDA',
    department: 'Kayachikitsa',
    doctorName: 'Dr. Alok Verma, MD (Ayu)',
    date: '2026-09-10',
    status: 'Verified',
    chiefComplaint: 'Bilateral Knee Joint Pain & Stiffness (Sandhivata) for 8 months',
    symptoms: ['Crepitus and aching pain in knees', 'Morning stiffness exceeding 45 minutes', 'Difficulty climbing stairs'],
    duration: '8 months chronic',
    severity: 'Moderate',
    hadBefore: 'Seasonal aches during winter months',
    existingConditions: ['Mild hypertension (controlled)', 'Occasional constipation'],
    currentMedications: ['Yogaraja Guggulu 2 tab BD', 'Telmisartan 40mg OD'],
    knownAllergies: ['Gastric upset with NSAIDs'],
    recentTests: 'Bilateral Knee X-Ray AP/Lat, Serum Uric Acid',
    additionalNotes: 'Patient seeking Panchakarma Janu Basti treatment.',
    priorityFlag: false,
    aiGeneratedNotes: 'Classical lakshana of Sandhivata (Osteoarthritis). Vata-shamana with Janu Basti recommended.',
    evidenceReportId: 'rep-seed-1',
    documents: [
      {
        id: 'doc-101',
        patientId: 'pat-1',
        consultationId: 'con-101',
        name: 'Knee_XRay_Bilateral_AP_Lateral.pdf',
        type: 'Lab Report',
        size: '3.4 MB',
        uploadDate: '2026-09-09',
        status: 'Verified',
        ocrExtractedSummary: 'Bilateral medial joint space narrowing with marginal osteophytes. Grade II Osteoarthritis.'
      },
      {
        id: 'doc-103',
        patientId: 'pat-1',
        consultationId: 'con-101',
        name: 'Serum_Uric_Acid_CRP_Panel.pdf',
        type: 'Lab Report',
        size: '890 KB',
        uploadDate: '2026-09-08',
        status: 'Verified',
        ocrExtractedSummary: 'Serum Uric Acid: 5.4 mg/dL. CRP: 3.8 mg/L. RA Factor: Negative.'
      }
    ],
    prescriptions: [
      {
        id: 'rx-1',
        medicineName: 'Yogaraja Guggulu',
        form: 'Vati / Tablet',
        dosage: '2 tablets (500mg each)',
        anupana: 'Warm water or Dashamula Kwath',
        timing: 'After Food',
        duration: '30 Days',
        careSystem: 'AYURVEDA'
      },
      {
        id: 'rx-2',
        medicineName: 'Dashamularishta',
        form: 'Asava / Arishta',
        dosage: '20 ml with equal warm water',
        anupana: 'Warm water',
        timing: 'After Food',
        duration: '30 Days',
        careSystem: 'AYURVEDA'
      }
    ]
  },
  {
    id: 'con-102',
    tokenNumber: 'ALLO-251120-042',
    patientId: 'pat-1',
    patientName: 'Rameshwar Prasad Sharma',
    hospitalId: 'hosp-1',
    hospitalName: 'Safdarjung Hospital Allopathy OPD',
    careSystem: 'ALLOPATHY',
    department: 'General Medicine & Cardiology',
    doctorName: 'Dr. K. S. Murthy, MD',
    date: '2025-11-20',
    status: 'Verified',
    chiefComplaint: 'Primary Hypertension Routine Follow-up & NSAID Gastritis',
    symptoms: ['Mild epigastric burning after taking painkiller', 'BP reading 138/88 mmHg'],
    duration: '2 weeks',
    severity: 'Mild',
    hadBefore: 'Hypertension diagnosed 3 years ago',
    existingConditions: ['Hypertension'],
    currentMedications: ['Telmisartan 40mg OD', 'Aceclofenac 100mg SOS (discontinued)'],
    knownAllergies: ['Gastric irritation with NSAIDs'],
    recentTests: 'Lipid Profile, Serum Creatinine, ECG',
    additionalNotes: 'Advised to consult AYUSH department for joint pain management without NSAIDs.',
    priorityFlag: false,
    documents: [
      {
        id: 'doc-102',
        patientId: 'pat-1',
        consultationId: 'con-102',
        name: 'Previous_Allopathy_Prescription_Max.pdf',
        type: 'Prescription',
        size: '1.2 MB',
        uploadDate: '2025-11-20',
        status: 'Verified',
        ocrExtractedSummary: 'Telmisartan 40mg morning. Discontinue Aceclofenac due to GI upset.'
      }
    ]
  },
  {
    id: 'con-201',
    tokenNumber: 'ALLO-260910-019',
    patientId: 'pat-2',
    patientName: 'Ananya Mehra',
    hospitalId: 'hosp-1',
    hospitalName: 'All India Institute of Medical Sciences (AIIMS)',
    careSystem: 'ALLOPATHY',
    department: 'Endocrinology & Diabetology',
    doctorName: 'Dr. Ritu Saxena, MD (Endo)',
    date: '2026-09-10',
    status: 'Verified',
    chiefComplaint: 'Type 2 Diabetes Mellitus Glycemic Assessment & Lethargy',
    symptoms: ['Post-lunch fatigue', 'Occasional polydipsia', 'Mild blurred vision when stressed'],
    duration: '6 months',
    severity: 'Moderate',
    hadBefore: 'Gestational diabetes 4 years ago',
    existingConditions: ['Type 2 Diabetes Mellitus', 'Dyslipidemia'],
    currentMedications: ['Metformin 500mg BD after meals', 'Atorvastatin 10mg HS'],
    knownAllergies: ['None'],
    recentTests: 'HbA1c: 7.4%, Fasting Glucose: 142 mg/dL, Post-prandial: 188 mg/dL',
    additionalNotes: 'Patient requests integrative lifestyle and diet management.',
    priorityFlag: false,
    documents: [
      {
        id: 'doc-201',
        patientId: 'pat-2',
        consultationId: 'con-201',
        name: 'Endoscopy_Report_Fortis.pdf',
        type: 'Lab Report',
        size: '2.1 MB',
        uploadDate: '2026-09-09',
        status: 'Processing',
        ocrExtractedSummary: 'Mild antral erythema noted in stomach lining. Lower esophageal sphincter intact.'
      }
    ]
  },
  {
    id: 'con-202',
    tokenNumber: 'AYU-251214-031',
    patientId: 'pat-2',
    patientName: 'Ananya Mehra',
    hospitalId: 'hosp-1',
    hospitalName: 'All India Institute of Ayurveda (AIIA)',
    careSystem: 'AYURVEDA',
    department: 'Prameha & Lifestyle Clinic',
    doctorName: 'Dr. Sunita Deshmukh',
    date: '2025-12-14',
    status: 'Verified',
    chiefComplaint: 'Kapha-Medovaha Srotorodha & Sluggish Metabolism (Early Prameha)',
    symptoms: ['Heaviness after meals (Guruta)', 'Sweet taste in mouth in mornings (Madhuryam Asye)'],
    duration: '3 months',
    severity: 'Mild',
    hadBefore: 'No prior Ayurvedic treatment',
    existingConditions: ['Metabolic syndrome tendencies'],
    currentMedications: ['Nishamalaki Churna 3g BD with lukewarm water'],
    knownAllergies: ['None'],
    recentTests: 'Ayurvedic Prakriti Assessment: Kapha-Pitta',
    priorityFlag: false
  },
  {
    id: 'con-301',
    tokenNumber: 'AYU-260910-020',
    patientId: 'pat-3',
    patientName: 'Vikramaditya Singhania',
    hospitalId: 'hosp-1',
    hospitalName: 'All India Institute of Ayurveda (AIIA)',
    careSystem: 'AYURVEDA',
    department: 'Shalya & Kayachikitsa',
    doctorName: 'Dr. Alok Verma, MD (Ayu)',
    date: '2026-09-10',
    status: 'Processing',
    chiefComplaint: 'Acute Vatarakta (Gouty Arthritis Flare) with Severe Big Toe Pain & Erythema',
    symptoms: ['Excruciating throbbing pain in right first MTP joint', 'Unable to wear footwear', 'Local burning heat and redness'],
    duration: '3 days acute attack',
    severity: 'Severe',
    hadBefore: 'Two milder episodes over past year',
    existingConditions: ['Hyperuricemia', 'Sedentary corporate lifestyle'],
    currentMedications: ['Kaishore Guggulu', 'Pinda Taila external'],
    knownAllergies: ['Aspirin triggers bronchospasm'],
    recentTests: 'Serum Uric Acid: 8.9 mg/dL (Critically high)',
    priorityFlag: true
  },
  {
    id: 'con-601',
    tokenNumber: 'AYU-260910-023',
    patientId: 'pat-6',
    patientName: 'Mohd. Tariq Siddiqui',
    hospitalId: 'hosp-1',
    hospitalName: 'All India Institute of Ayurveda (AIIA)',
    careSystem: 'AYURVEDA',
    department: 'Kayachikitsa & Panchakarma',
    doctorName: 'Dr. Alok Verma, MD (Ayu)',
    date: '2026-09-10',
    status: 'Pending',
    chiefComplaint: 'Severe Sciatica & Lumbar Radiculopathy (Gridhrasi) radiating to left heel',
    symptoms: ['Shooting electrical pain radiating down posterior thigh and calf', 'Positive SLR at 40 degrees', 'Severe restriction of spinal mobility'],
    duration: '4 months worsening after lifting weight',
    severity: 'Severe',
    hadBefore: 'Mild lower back stiffness 1 year ago',
    existingConditions: ['L4-L5 left disc bulge on MRI'],
    currentMedications: ['Trayodashanga Guggulu', 'Sahacharadi Taila'],
    knownAllergies: ['None'],
    recentTests: 'MRI Lumbar Spine (2026-09-08)',
    priorityFlag: true
  }
];

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'pat-1',
    tokenNumber: 'AYU-260910-018',
    queueNumber: 4,
    name: 'Rameshwar Prasad Sharma',
    age: 58,
    gender: 'Male',
    phone: '+91 98112 34567',
    email: 'rameshwar.sharma@gmail.com',
    abhaId: '45-9821-4321-7890',
    address: 'B-42, Sector 15, Rohini, New Delhi',
    bloodGroup: 'B+',
    hospitalId: 'hosp-1',
    hospitalName: 'All India Institute of Ayurveda (AIIA)',
    registrationDate: '2026-09-09',
    appointmentTime: '10:30 AM',
    status: 'Verified',
    careSystem: 'AYURVEDA',
    priorityFlag: false,
    ayurvedaHistory: [MOCK_CONSULTATIONS[0]],
    allopathyHistory: [MOCK_CONSULTATIONS[1]],
    chiefComplaint: 'Bilateral Knee Joint Pain & Stiffness (Sandhivata) for 8 months',
    doshaPrimary: 'Vata-Kapha',
    preferredLanguage: 'Hindi (हिंदी)',
    vitals: {
      bp: '132/84 mmHg',
      pulse: '74 bpm',
      weight: '76 kg',
      spo2: '98%',
      temperature: '98.4 °F'
    },
    clinicalSummary: {
      prakriti: 'Vata-Pitta',
      vikriti: 'Aggravated Vata localized in Janu Sandhi (Knee joints)',
      chiefComplaints: [
        'Crepitus and aching pain in both knee joints, worse upon morning waking',
        'Difficulty climbing stairs and sitting cross-legged for more than 10 mins',
        'Mild swelling over right patella without localized heat'
      ],
      duration: '8 months chronic, aggravated in rainy & cold climate',
      agni: 'Vishama (Irregular appetite with variable digestion)',
      koshtha: 'Krura (Tendency toward constipation, hard stools)',
      nidana: 'Excessive dry food intake, frequent irregular travel, sedentary habits causing Vata Prakopa',
      srotasInvolved: ['Asthivaha Srotas', 'Majjavaha Srotas', 'Purishavaha Srotas'],
      aiGeneratedNotes: 'Patient presents classical lakshana of Sandhivata (Osteoarthritis). No history of traumatic injury or gouty erythema. ESR mildly elevated (28 mm/hr). AI recommends initial Vata-shamana with Snehana (Janu Basti) followed by mild Mrudu Virechana.',
      recommendedTherapies: [
        'Janu Basti with Murivenna / Mahanarayana Taila (7 days)',
        'Patra Pinda Sweda for pain relief & crepitus reduction',
        'Abhyanga with Dhanwantharam Taila'
      ],
      lifestyleAdvice: [
        'Strict Pathya: Consume lukewarm water and avoid refrigerated meals',
        'Include cow ghee (1 tsp) with warm milk at bedtime',
        'Avoid dry pulses (Chana, Rajma) and excessive night shifts'
      ],
      verifiedByDoctor: true,
      verifiedAt: '10:45 AM, Today',
      doctorNotes: 'Confirmed diagnosis of Sandhigata Vata. Prescribed oral Yogaraja Guggulu and external oil therapy.'
    },
    documents: [
      {
        id: 'doc-101',
        patientId: 'pat-1',
        name: 'Knee_XRay_Bilateral_AP_Lateral.pdf',
        type: 'Lab Report',
        size: '3.4 MB',
        uploadDate: '2026-09-09',
        status: 'Verified',
        ocrExtractedSummary: 'Bilateral medial compartment joint space narrowing with marginal osteophyte formation. Mild subchondral sclerosis. Compatible with Grade II Osteoarthritis.'
      },
      {
        id: 'doc-102',
        patientId: 'pat-1',
        name: 'Previous_Allopathy_Prescription_Max.pdf',
        type: 'Prescription',
        size: '1.2 MB',
        uploadDate: '2026-09-08',
        status: 'Verified',
        ocrExtractedSummary: 'Aceclofenac 100mg + Paracetamol 325mg BD, Pantoprazole 40mg OD. Patient reported gastric irritation with NSAIDs.'
      },
      {
        id: 'doc-103',
        patientId: 'pat-1',
        name: 'Serum_Uric_Acid_CRP_Panel.pdf',
        type: 'Lab Report',
        size: '890 KB',
        uploadDate: '2026-09-08',
        status: 'Verified',
        ocrExtractedSummary: 'Serum Uric Acid: 5.4 mg/dL (Normal). CRP: 3.8 mg/L (Borderline). RA Factor: Negative (<10 IU/mL).'
      }
    ],
    prescriptions: [
      {
        id: 'rx-1',
        medicineName: 'Yogaraja Guggulu',
        form: 'Vati / Tablet',
        dosage: '2 tablets (500mg each)',
        anupana: 'Warm water or Dashamula Kwath',
        timing: 'After Food',
        duration: '30 Days'
      },
      {
        id: 'rx-2',
        medicineName: 'Dashamularishta',
        form: 'Asava / Arishta',
        dosage: '20 ml with equal quantity of lukewarm water',
        anupana: 'Warm water',
        timing: 'After Food',
        duration: '30 Days'
      },
      {
        id: 'rx-3',
        medicineName: 'Mahanarayana Taila',
        form: 'Taila / Oil',
        dosage: 'Gentle warm application over knees',
        anupana: 'External application followed by hot fomentation',
        timing: 'Before Food',
        duration: '21 Days'
      }
    ],
    previousVisits: [
      {
        id: 'vis-1',
        date: '2026-05-14',
        doctor: 'Dr. Alok Verma, MD (Ayu)',
        department: 'Kayachikitsa',
        diagnosis: 'Early Sandhivata with Vata Imbalance',
        chiefComplaints: 'Mild right knee stiffness',
        prescriptionsCount: 2,
        status: 'Completed'
      },
      {
        id: 'vis-2',
        date: '2025-11-20',
        doctor: 'Dr. Sunita Deshmukh',
        department: 'Swasthavritta',
        diagnosis: 'Agni Mandya & Constipation',
        chiefComplaints: 'Bloating and incomplete evacuation',
        prescriptionsCount: 1,
        status: 'Completed'
      }
    ]
  },
  {
    id: 'pat-2',
    tokenNumber: 'ALLO-260910-019',
    queueNumber: 5,
    name: 'Ananya Mehra',
    age: 34,
    gender: 'Female',
    phone: '+91 98711 87654',
    email: 'ananya.mehra@techcorp.in',
    abhaId: '91-3412-8822-1109',
    address: 'Flat 702, Silver Oak Towers, Golf Course Road, Gurugram',
    bloodGroup: 'O+',
    hospitalId: 'hosp-1',
    hospitalName: 'All India Institute of Ayurveda (AIIA)',
    registrationDate: '2026-09-09',
    appointmentTime: '10:50 AM',
    status: 'Processing',
    careSystem: 'ALLOPATHY',
    priorityFlag: false,
    ayurvedaHistory: [MOCK_CONSULTATIONS[3]],
    allopathyHistory: [MOCK_CONSULTATIONS[2]],
    chiefComplaint: 'Severe Acidity, Heartburn (Amlapitta), and Stress-Induced Migraine',
    doshaPrimary: 'Pitta-Vata',
    preferredLanguage: 'English',
    vitals: {
      bp: '118/76 mmHg',
      pulse: '82 bpm',
      weight: '59 kg',
      spo2: '99%',
      temperature: '98.6 °F'
    },
    clinicalSummary: {
      prakriti: 'Pitta-Kapha',
      vikriti: 'Vidagdha Jeerna with Urdhvaga Amlapitta and Shirashoola',
      chiefComplaints: [
        'Sour eructations (Tikta-Amla Udgara) after meals',
        'Burning sensation in retrosternal and epigastric area (Hrit-Daha)',
        'Throbbing right-sided headache triggered by skipped meals or screen fatigue'
      ],
      duration: '5 months, worsening with late-night coffee and tight work deadlines',
      agni: 'Tikshna (Intense, burning appetite leading to irritation when food is delayed)',
      koshtha: 'Mrudu (Soft stools, sensitive gut)',
      nidana: 'Excessive sour, spicy foods, fermented snacks, mental stress (Chinta) & irregular sleep',
      srotasInvolved: ['Annavaha Srotas', 'Rasavaha Srotas', 'Majjavaha Srotas'],
      aiGeneratedNotes: 'Classical symptoms of Urdhvaga Amlapitta with Pittaja Shirashoola. Patient consumes 4 cups of espresso daily. AI recommends Pitta-shamak line of management with Avipattikar Churna and cooling herbal infusions (Usheera, Chandana).',
      recommendedTherapies: [
        'Shirodhara with Ksheerabala Taila / Takradhara (Cooling buttermilk therapy)',
        'Mukhadhauti with Triphala water',
        'Pranayama: Sheetali and Sheetkari daily 10 minutes'
      ],
      lifestyleAdvice: [
        'Avoid spicy, fried, deep-fried snacks, vinegar, and excess caffeine',
        'Take fresh tender coconut water at 11:00 AM',
        'Eat soaked munakka (black raisins) in morning'
      ],
      verifiedByDoctor: false
    },
    documents: [
      {
        id: 'doc-201',
        patientId: 'pat-2',
        name: 'Endoscopy_Report_Fortis.pdf',
        type: 'Lab Report',
        size: '2.1 MB',
        uploadDate: '2026-09-09',
        status: 'Processing',
        ocrExtractedSummary: 'Mild antral erythema noted in stomach lining. Lower esophageal sphincter intact. No evidence of ulceration or H. pylori.'
      }
    ],
    prescriptions: [
      {
        id: 'rx-21',
        medicineName: 'Avipattikar Churna',
        form: 'Churna',
        dosage: '3 grams with lukewarm water or honey',
        anupana: 'Lukewarm water',
        timing: 'Before Food',
        duration: '21 Days'
      },
      {
        id: 'rx-22',
        medicineName: 'Kamadudha Rasa (Mukta Yukta)',
        form: 'Vati / Tablet',
        dosage: '1 tablet twice daily',
        anupana: 'Milk or sugar candy water',
        timing: 'After Food',
        duration: '15 Days'
      }
    ],
    previousVisits: []
  },
  {
    id: 'pat-3',
    tokenNumber: 'AYU-260910-020',
    queueNumber: 6,
    name: 'Baldev Singh Gill',
    age: 64,
    gender: 'Male',
    phone: '+91 94172 65432',
    address: 'Village Majri, Near Kharar, Mohali',
    bloodGroup: 'A+',
    hospitalId: 'hosp-1',
    hospitalName: 'All India Institute of Ayurveda (AIIA)',
    registrationDate: '2026-09-09',
    appointmentTime: '11:15 AM',
    status: 'Pending',
    careSystem: 'AYURVEDA',
    priorityFlag: false,
    chiefComplaint: 'Madhumeha (Type 2 Diabetes Support) & Peripheral Neuropathy in feet',
    doshaPrimary: 'Kapha-Vata',
    preferredLanguage: 'Hindi (हिंदी)',
    vitals: {
      bp: '138/88 mmHg',
      pulse: '76 bpm',
      weight: '82 kg',
      spo2: '97%',
      temperature: '98.2 °F'
    },
    clinicalSummary: {
      prakriti: 'Kapha-Pitta',
      vikriti: 'Kaphaja Prameha transitioning into Vataja Dhatukshaya',
      chiefComplaints: [
        'Numbness and tingling sensation in both soles (Pada Supthi & Suptata)',
        'Polyuria at night (Prabhuta Avila Mutrata)',
        'General fatigue and lethargy after light walking'
      ],
      duration: 'Diagnosed Diabetes 7 years; numbness started 4 months ago',
      agni: 'Manda (Sluggish digestive fire with heaviness post meal)',
      koshtha: 'Madhyama',
      nidana: 'Excessive sweet & carbohydrate consumption, lack of physical vyayama',
      srotasInvolved: ['Medovaha Srotas', 'Mutravaha Srotas', 'Majjavaha Srotas'],
      aiGeneratedNotes: 'AI extracted HbA1c of 7.9% from uploaded report. Classical features of Prameha Upadrava (Diabetic Neuropathy). Recommends Nishamalaki, Chandraprabha Vati, and Pada Abhyanga with Ksheerabala 101.',
      recommendedTherapies: [
        'Pada Abhyanga (Foot massage with medicated oils)',
        'Udwarthana (Herbal dry powder massage for Meda reduction)',
        'Nabhi Basti with Dashamula'
      ],
      lifestyleAdvice: [
        'Daily 30 minutes brisk walking in morning',
        'Replace white rice with Yava (Barley) and Kodra (Kodo millet)',
        'Drink Fenugreek (Methi) seed soaked water every morning'
      ],
      verifiedByDoctor: false
    },
    documents: [
      {
        id: 'doc-301',
        patientId: 'pat-3',
        name: 'HbA1c_Lipid_Profile_Lab.pdf',
        type: 'Lab Report',
        size: '1.7 MB',
        uploadDate: '2026-09-09',
        status: 'Verified',
        ocrExtractedSummary: 'Fasting Blood Sugar: 142 mg/dL. Postprandial: 198 mg/dL. HbA1c: 7.9%. Total Cholesterol: 218 mg/dL.'
      }
    ],
    prescriptions: [],
    previousVisits: []
  },
  {
    id: 'pat-4',
    tokenNumber: 'AYU-260910-021',
    queueNumber: 7,
    name: 'Kavita Sundaram',
    age: 42,
    gender: 'Female',
    phone: '+91 97890 12345',
    email: 'kavita.s@gmail.com',
    abhaId: '33-2198-7744-5512',
    address: 'No. 18, Anna Nagar West, Chennai',
    bloodGroup: 'AB+',
    hospitalId: 'hosp-4',
    hospitalName: 'Government Ayurveda College & Hospital',
    registrationDate: '2026-09-09',
    appointmentTime: '11:40 AM',
    status: 'Verified',
    careSystem: 'AYURVEDA',
    priorityFlag: false,
    chiefComplaint: 'Chronic Sinusitis & Recurrent Allergic Cough (Kasa-Pratishyaya)',
    doshaPrimary: 'Kapha-Vata',
    preferredLanguage: 'Tamil (தமிழ்)',
    vitals: {
      bp: '122/80 mmHg',
      pulse: '78 bpm',
      weight: '62 kg',
      spo2: '99%',
      temperature: '98.5 °F'
    },
    clinicalSummary: {
      prakriti: 'Kapha-Pitta',
      vikriti: 'Dushta Pratishyaya with Kapha blockage in Urdhva Jatrugata region',
      chiefComplaints: [
        'Post nasal drip and frontal headache on waking',
        'Dry nagging cough aggravated during climate transition or AC exposure',
        'Loss of taste (Aruchi) and nasal congestion'
      ],
      duration: '2.5 years persistent episodic',
      agni: 'Manda',
      koshtha: 'Madhyama',
      nidana: 'Frequent intake of ice creams, cold drinks, exposure to dust and air conditioning',
      srotasInvolved: ['Pranavaha Srotas', 'Urdhvajatrugata Srotas'],
      aiGeneratedNotes: 'AI recognized chronic rhinosinusitis pattern. Nasya Karma with Shadbindu Taila or Anu Taila is strongly indicated. Vyadhikshamatwa (immunity) enhancement needed.',
      recommendedTherapies: [
        'Marsha / Pratimarsha Nasya with Anu Taila (2 drops in each nostril)',
        'Bashpa Sweda (Steam inhalation with Tulsi and Karpura)',
        'Kavala (Gargling with Triphala decoction & turmeric)'
      ],
      lifestyleAdvice: [
        'Drink warm water infused with dry ginger (Shunti) throughout the day',
        'Avoid dairy curd, banana, and chilled beverages',
        'Sleep with head elevated and avoid direct air conditioner blast'
      ],
      verifiedByDoctor: true,
      verifiedAt: '09:30 AM, Today',
      doctorNotes: 'Advised 7 days Pratimarsha Nasya course. Review after 2 weeks.'
    },
    documents: [
      {
        id: 'doc-401',
        patientId: 'pat-4',
        name: 'PNS_CT_Scan_Report.pdf',
        type: 'Lab Report',
        size: '4.2 MB',
        uploadDate: '2026-09-08',
        status: 'Verified',
        ocrExtractedSummary: 'Bilateral maxillary mucosal thickening. Mild deviated nasal septum to left side. Ostiomeatal units patent.'
      }
    ],
    prescriptions: [
      {
        id: 'rx-41',
        medicineName: 'Sitopaladi Churna',
        form: 'Churna',
        dosage: '3 grams mixed with honey & ghee',
        anupana: 'Pure Honey',
        timing: 'After Food',
        duration: '21 Days'
      },
      {
        id: 'rx-42',
        medicineName: 'Anu Taila',
        form: 'Taila / Oil',
        dosage: '2 drops in each nostril daily morning',
        anupana: 'External Nasya',
        timing: 'Empty Stomach',
        duration: '30 Days'
      }
    ],
    previousVisits: [
      {
        id: 'vis-41',
        date: '2026-02-18',
        doctor: 'Dr. Padmanabhan Pillai',
        department: 'Shalakya Tantra',
        diagnosis: 'Dushta Pratishyaya',
        chiefComplaints: 'Acute rhinitis flareup',
        prescriptionsCount: 2,
        status: 'Completed'
      }
    ]
  },
  {
    id: 'pat-5',
    tokenNumber: 'AYU-260910-022',
    queueNumber: 8,
    name: 'Pooja Vijay Kulkarni',
    age: 29,
    gender: 'Female',
    phone: '+91 98230 45678',
    email: 'pooja.kulkarni@designstudio.co',
    abhaId: '76-1144-8833-9021',
    address: '14/B, Deccan Gymkhana, Pune',
    bloodGroup: 'O-',
    hospitalId: 'hosp-3',
    hospitalName: 'CCRAS Central Ayurveda Research Hospital',
    registrationDate: '2026-09-09',
    appointmentTime: '12:00 PM',
    status: 'Rejected',
    careSystem: 'AYURVEDA',
    priorityFlag: false,
    chiefComplaint: 'PCOS / Irregular Menstrual Cycles & Cystic Acne (Artava Kshaya)',
    doshaPrimary: 'Kapha-Vata',
    preferredLanguage: 'Marathi (मराठी)',
    vitals: {
      bp: '110/72 mmHg',
      pulse: '80 bpm',
      weight: '67 kg',
      spo2: '99%',
      temperature: '98.4 °F'
    },
    clinicalSummary: {
      prakriti: 'Pitta-Kapha',
      vikriti: 'Avarana of Vata by Kapha and Meda leading to Artava Sroto-Avarodha',
      chiefComplaints: [
        'Delayed menstrual cycles (45-60 days cycle duration)',
        'Painful cramps on Day 1 (Kashtartava)',
        'Persistent facial acne along jawline (Mukhadushika)'
      ],
      duration: '14 months',
      agni: 'Manda',
      koshtha: 'Madhyama',
      nidana: 'High glycemic diet, midnight snacking, lack of physical activity',
      srotasInvolved: ['Artavavaha Srotas', 'Medovaha Srotas'],
      aiGeneratedNotes: 'Case requires gynecological re-evaluation. Document scans submitted were blurred and illegible; status set to Rejected for resubmission of USG Pelvis scan.',
      recommendedTherapies: [
        'Upanaha Sweda on lower abdomen',
        'Virechana Karma after proper Snehana',
        'Yoga: Baddha Konasana, Supta Baddha Konasana'
      ],
      lifestyleAdvice: [
        'Eliminate refined sugar and bakery goods',
        'Drink warm Cinnamon & Fenugreek infused decoction'
      ],
      verifiedByDoctor: false,
      doctorNotes: 'Pelvic ultrasound image scan was unreadable. Requested re-upload from patient.'
    },
    documents: [
      {
        id: 'doc-501',
        patientId: 'pat-5',
        name: 'USG_Pelvis_Scan_Blurry.jpg',
        type: 'Lab Report',
        size: '450 KB',
        uploadDate: '2026-09-09',
        status: 'Rejected',
        ocrExtractedSummary: 'OCR failed: Low resolution image artifact detected. Re-upload requested.'
      }
    ],
    prescriptions: [],
    previousVisits: []
  },
  {
    id: 'pat-6',
    tokenNumber: 'AYU-260910-023',
    queueNumber: 9,
    name: 'Mohd. Tariq Siddiqui',
    age: 51,
    gender: 'Male',
    phone: '+91 99350 78901',
    address: 'Chowk, Near Gol Darwaza, Lucknow',
    bloodGroup: 'B+',
    hospitalId: 'hosp-1',
    hospitalName: 'All India Institute of Ayurveda (AIIA)',
    registrationDate: '2026-09-09',
    appointmentTime: '12:20 PM',
    status: 'Pending',
    careSystem: 'AYURVEDA',
    priorityFlag: true,
    ayurvedaHistory: [MOCK_CONSULTATIONS[5]],
    chiefComplaint: 'Chronic Lumbar Spine Pain & Sciatica Radiating Down Left Leg (Gridhrasi)',
    doshaPrimary: 'Vata',
    preferredLanguage: 'Hindi (हिंदी)',
    vitals: {
      bp: '130/82 mmHg',
      pulse: '72 bpm',
      weight: '71 kg',
      spo2: '98%',
      temperature: '98.1 °F'
    },
    clinicalSummary: {
      prakriti: 'Vata-Kapha',
      vikriti: 'Gridhrasi (Sciatica) with severe Kandara and Snayu Stambha',
      chiefComplaints: [
        'Shooting pain from left buttock radiating to calf and heel (Toda & Stambha)',
        'Inability to bend forward without sharp electric sensation',
        'Weakness in left dorsiflexion upon walking > 50 meters'
      ],
      duration: '4 months worsening after lifting heavy luggage',
      agni: 'Sama',
      koshtha: 'Krura',
      nidana: 'Sudden mechanical load, prolonged two-wheeler commuting on bumpy roads',
      srotasInvolved: ['Asthivaha Srotas', 'Majjavaha Srotas'],
      aiGeneratedNotes: 'Classical Gridhrasi presentation with positive straight leg raise (SLR) at 45 degrees on left side. AI advises Kati Basti, Matra Basti, and Nirgundi Sweda.',
      recommendedTherapies: [
        'Kati Basti with Sahacharadi and Dhanwantharam Taila (7 days)',
        'Matra Basti with Ksheerabala Taila 60ml daily for 8 days',
        'Agnikarma / Raktamokshana if radiating pain persists'
      ],
      lifestyleAdvice: [
        'Strictly avoid two-wheeler commuting and sudden spinal twisting',
        'Use firm orthopedic mattress and lumbar pillow support',
        'Gentle Shalabhasana under expert guidance only'
      ],
      verifiedByDoctor: false
    },
    documents: [
      {
        id: 'doc-601',
        patientId: 'pat-6',
        name: 'MRI_Lumbosacral_Spine_Medanta.pdf',
        type: 'Lab Report',
        size: '5.6 MB',
        uploadDate: '2026-09-09',
        status: 'Pending',
        ocrExtractedSummary: 'L4-L5 left paracentral disc extrusion causing thecal sac compression and exiting left L5 nerve root impingement.'
      }
    ],
    prescriptions: [],
    previousVisits: []
  },
  {
    id: 'pat-7',
    tokenNumber: 'ALLO-260910-024',
    queueNumber: 10,
    name: 'Debashree Mukherjee',
    age: 38,
    gender: 'Female',
    phone: '+91 98301 98765',
    email: 'debashree.m@yahoo.co.in',
    abhaId: '82-9900-1122-3344',
    address: 'Lake Gardens, Southern Avenue, Kolkata',
    bloodGroup: 'A+',
    hospitalId: 'hosp-6',
    hospitalName: 'National Institute of Homoeopathy (NIH)',
    registrationDate: '2026-09-09',
    appointmentTime: '12:45 PM',
    status: 'Verified',
    careSystem: 'ALLOPATHY',
    priorityFlag: false,
    chiefComplaint: 'Insomnia, Anxiety, & Digestive Heaviness (Nidranasha & Mano-Klama)',
    doshaPrimary: 'Vata-Pitta',
    preferredLanguage: 'Bengali (বাংলা)',
    vitals: {
      bp: '124/78 mmHg',
      pulse: '84 bpm',
      weight: '55 kg',
      spo2: '99%',
      temperature: '98.6 °F'
    },
    clinicalSummary: {
      prakriti: 'Vata-Pitta',
      vikriti: 'Manovaha Sroto-Dushti with Raja-Tama Vriddhi & Anidra',
      chiefComplaints: [
        'Difficulty falling asleep; waking up at 3:00 AM with racing thoughts',
        'Restless leg sensation and heart palpitations under deadline pressure',
        'Loss of appetite and dry skin'
      ],
      duration: '6 months',
      agni: 'Vishama',
      koshtha: 'Krura',
      nidana: 'Excess screen time past midnight, high corporate stress, irregular meals',
      srotasInvolved: ['Manovaha Srotas', 'Rasavaha Srotas'],
      aiGeneratedNotes: 'AI assessment highlights sleep fragmentation and elevated sympathetic drive. Classical Medhya Rasayana protocol recommended (Brahmi, Shankhpushpi, Ashwagandha).',
      recommendedTherapies: [
        'Shirodhara with Brahmi Taila or Jatamansi Ksheera (7 sessions)',
        'Padabhyanga (Foot massage before sleep)',
        'Yoga Nidra meditation daily 20 mins'
      ],
      lifestyleAdvice: [
        'Zero digital screens 1 hour before sleep',
        'Drink warm milk with nutmeg (Jaiphal) powder and 2 drops of cow ghee at bedtime',
        'Morning sun exposure for 15 minutes'
      ],
      verifiedByDoctor: true,
      verifiedAt: '09:15 AM, Today',
      doctorNotes: 'Prescribed Saraswatarishta and Brahmi Vati. Patient reported good response to trial Shirodhara.'
    },
    documents: [],
    prescriptions: [
      {
        id: 'rx-71',
        medicineName: 'Saraswatarishta with Gold (Swarna Yukta)',
        form: 'Asava / Arishta',
        dosage: '15 ml with equal lukewarm water',
        anupana: 'Lukewarm water',
        timing: 'After Food',
        duration: '45 Days'
      },
      {
        id: 'rx-72',
        medicineName: 'Brahmi Vati',
        form: 'Vati / Tablet',
        dosage: '1 tablet twice daily',
        anupana: 'Warm milk',
        timing: 'Bedtime',
        duration: '30 Days'
      }
    ],
    previousVisits: []
  },
  {
    id: 'pat-8',
    tokenNumber: 'AYU-260910-025',
    queueNumber: 11,
    name: 'Devendra Nath Joshi',
    age: 47,
    gender: 'Male',
    phone: '+91 94120 33221',
    address: 'Tallital, Nainital Road, Haldwani',
    bloodGroup: 'O+',
    hospitalId: 'hosp-2',
    hospitalName: 'National Institute of Ayurveda (NIA)',
    registrationDate: '2026-09-09',
    appointmentTime: '01:00 PM',
    status: 'Processing',
    careSystem: 'AYURVEDA',
    priorityFlag: false,
    chiefComplaint: 'Chronic Eczema & Pruritus on Bilateral Forearms (Vicharchika / Twak Roga)',
    doshaPrimary: 'Pitta-Kapha',
    preferredLanguage: 'Hindi (हिंदी)',
    vitals: {
      bp: '120/80 mmHg',
      pulse: '74 bpm',
      weight: '68 kg',
      spo2: '98%',
      temperature: '98.3 °F'
    },
    clinicalSummary: {
      prakriti: 'Pitta',
      vikriti: 'Vicharchika with Rakta and Twacha Dushti',
      chiefComplaints: [
        'Dark, thickened skin patches with intense itching (Kandu) on elbows and forearms',
        'Serous discharge when scratched in humid weather (Srava)',
        'Burning sensation aggravated after sun exposure (Daha)'
      ],
      duration: '1.5 years chronic relapsing',
      agni: 'Tikshna',
      koshtha: 'Madhyama',
      nidana: 'Viruddha Ahara (intake of milk with salty snacks), excessive sour fermented foods',
      srotasInvolved: ['Raktavaha Srotas', 'Swedavaha Srotas'],
      aiGeneratedNotes: 'AI image analysis indicates Vicharchika (Eczema). Rakta-shodhaka (blood purifying) formulation indicated with Mahatiktaka Ghrita and Khadirarishta.',
      recommendedTherapies: [
        'Jalaukavacharana (Leech therapy) over hyperpigmented margins',
        'Parisheka with Triphala and Neem decoction',
        'Virechana Karma during Sharad Ritu'
      ],
      lifestyleAdvice: [
        'Strictly discontinue Viruddha Ahara (milk with fish/salt/sour fruits)',
        'Wear loose cotton clothing, avoid synthetic fibers',
        'Bathe with lukewarm water infused with Neem leaves'
      ],
      verifiedByDoctor: false
    },
    documents: [
      {
        id: 'doc-801',
        patientId: 'pat-8',
        name: 'Dermatology_Biopsy_Skin_Smear.pdf',
        type: 'Lab Report',
        size: '1.9 MB',
        uploadDate: '2026-09-09',
        status: 'Processing',
        ocrExtractedSummary: 'Epidermal spongiosis with superficial perivascular lymphocytic infiltrate. Consistent with subacute eczematous dermatitis. No fungal hyphae seen.'
      }
    ],
    prescriptions: [],
    previousVisits: []
  }
];

export const MOCK_CLINICAL_QUESTIONS: ClinicalQuestion[] = [
  {
    id: 'q-1',
    step: 1,
    category: 'Chief Complaint',
    question: '1. What is your main health problem today?',
    ayushContext: 'Pradhana Vedana (Chief Complaint) identifies the primary Rogamarga and directs initial triage.',
    type: 'chips',
    options: [
      'Joint Pain & Morning Stiffness (Sandhivata)',
      'Severe Acidity & Retrosternal Heartburn (Amlapitta)',
      'High Blood Sugar & Metabolic Sluggishness (Madhumeha)',
      'Chronic Dry Cough & Chest Congestion (Kasa-Shwasa)',
      'Skin Itching, Rashes or Eczema (Vicharchika / Kushta)',
      'Chronic Insomnia, Anxiety & Stress (Nidranasha)',
      'General Weakness & Digestive Sluggishness'
    ],
    placeholder: 'Describe your primary health concern in your own words...'
  },
  {
    id: 'q-2',
    step: 2,
    category: 'Current Symptoms',
    question: '2. Which symptoms are you experiencing?',
    ayushContext: 'Rupa (Clinical Presentation): Specific Lakshanas indicate Dosha-Dhatu concordance.',
    type: 'chips',
    options: [
      'Swelling, tenderness & joint crepitus',
      'Burning in chest, sour belching & headache',
      'Frequent night urination, excess thirst & leg cramps',
      'Shortness of breath, wheezing & throat scratchiness',
      'Dry scaling, redness, oozing & severe itching',
      'Restlessness, heart palpitations & mental exhaustion'
    ],
    placeholder: 'List any other physical or mental symptoms...'
  },
  {
    id: 'q-3',
    step: 3,
    category: 'Duration & Severity',
    question: '3. When did the problem start?',
    ayushContext: 'Vyadhi Kala (Chronicity): Acute (Navina) vs Chronic (Jirna) determines prognosis and Panchakarma applicability.',
    type: 'chips',
    options: [
      'Less than 1 week ago (Acute onset)',
      '1 to 4 weeks ago',
      '1 to 6 months ago',
      '6 months to 2 years ago',
      'More than 2 years ago (Chronic long-standing condition)'
    ],
    placeholder: 'e.g. Started 3 weeks ago after travel...'
  },
  {
    id: 'q-4',
    step: 4,
    category: 'Duration & Severity',
    question: '4. How severe is it? (Mild / Moderate / Severe)',
    ayushContext: 'Bala Pariksha: High severity triggers priority doctor review flag.',
    type: 'chips',
    options: [
      'Mild (Noticeable but does not disrupt daily routine)',
      'Moderate (Interferes with work, sleep, or walking)',
      'Severe (Intense discomfort, unable to carry out normal activities - Priority Flag)'
    ],
    placeholder: 'Rate from Mild, Moderate, or Severe...'
  },
  {
    id: 'q-5',
    step: 5,
    category: 'Medical History',
    question: '5. Have you had this problem before?',
    ayushContext: 'Punaravartaka (Recurrence): Past episodes indicate deep-seated Dhatu Kshaya or lifestyle etiology (Nidana).',
    type: 'chips',
    options: [
      'No, this is the very first time',
      'Yes, occurs seasonally (e.g. in winter or rainy season)',
      'Yes, recurs every few months when stressed or off-diet',
      'Yes, continuous chronic condition with flare-ups'
    ],
    placeholder: 'e.g. Had similar knee pain 2 years ago...'
  },
  {
    id: 'q-6',
    step: 6,
    category: 'Medical History',
    question: '6. Do you have any existing medical conditions?',
    ayushContext: 'Sahaja / Kulaja Rogas: Co-morbidities alter Agni and determine medicine safety.',
    type: 'chips',
    options: [
      'Hypertension (High Blood Pressure)',
      'Type 2 Diabetes Mellitus',
      'Hypothyroidism / Hyperthyroidism',
      'Asthma / Bronchitis',
      'GERD / Chronic Peptic Acidity',
      'None / No known diagnosed conditions'
    ],
    placeholder: 'Mention any diagnosed diseases or past surgeries...'
  },
  {
    id: 'q-7',
    step: 7,
    category: 'Medications & Allergies',
    question: '7. Are you currently taking any medicines?',
    ayushContext: 'Aushadha Pariksha: Prevents herb-drug contraindications and dual dosing.',
    type: 'chips',
    options: [
      'Daily allopathic prescription medications',
      'Ayurvedic or herbal formulations',
      'Over-the-counter painkillers or antacids',
      'Vitamins / Dietary supplements only',
      'No current medications'
    ],
    placeholder: 'Specify medicine names and daily dosages...'
  },
  {
    id: 'q-8',
    step: 8,
    category: 'Medications & Allergies',
    question: '8. Do you have any known allergies?',
    ayushContext: 'Satmya / Asatmya Pariksha: Intolerances to specific botanicals, dairy, gluten, or pharmaceuticals.',
    type: 'chips',
    options: [
      'No known drug or food allergies',
      'Allergy to Penicillin / Sulfa / Antibiotics',
      'Allergy to NSAID painkillers (Aspirin, Ibuprofen)',
      'Lactose / Milk intolerance',
      'Dust, pollen, or seasonal allergy'
    ],
    placeholder: 'List any drug, food, or contact allergies...'
  },
  {
    id: 'q-9',
    step: 9,
    category: 'Consultations & Observations',
    question: '9. Have you had any recent tests or medical consultations?',
    ayushContext: 'Nidanatmaka Pariksha: Connects external diagnostic reports to AYUSH clinical assessment.',
    type: 'chips',
    options: [
      'Blood tests (CBC, HbA1c, Lipid profile) in last 3 months',
      'Radiography / X-Ray / MRI scan in last 6 months',
      'Recent consultation with an Allopathic specialist',
      'Recent consultation with an Ayurvedic Vaidya',
      'No tests or doctor visits in past year'
    ],
    placeholder: 'e.g. Knee X-ray taken at district hospital last month...'
  },
  {
    id: 'q-10',
    step: 10,
    category: 'Consultations & Observations',
    question: '10. Is there anything else you want the doctor to know?',
    ayushContext: 'Manasika Bhava: Emotional well-being, dietary habits, work shifts, or specific patient concerns.',
    type: 'text',
    options: [
      'I prefer herbal and non-surgical Panchakarma therapies',
      'I work night shifts which disturbs my food timing and sleep',
      'Family history of joint and metabolic disorders',
      'Experiencing significant workplace stress and fatigue'
    ],
    placeholder: 'Type or speak any lifestyle factors, dietary patterns, or specific concerns for the Vaidya...'
  }
];

export const MOCK_LANGUAGES = [
  { code: 'hi', name: 'Hindi', native: 'हिंदी', popular: true },
  { code: 'en', name: 'English', native: 'English', popular: true },
  { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्', popular: false },
  { code: 'mr', name: 'Marathi', native: 'मराठी', popular: true },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', popular: true },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', popular: false },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', popular: true },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', popular: false },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', popular: false },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', popular: false }
];

export const INITIAL_CHAT_MESSAGES = [
  {
    id: 'msg-1',
    sender: 'ai' as const,
    text: 'Namaste! I am AyuFlow Assistant, your clinical intake companion. I am here to understand your symptoms before you meet the Vaidya / Doctor.',
    timestamp: 'Just now'
  },
  {
    id: 'msg-2',
    sender: 'ai' as const,
    text: 'You can speak using the microphone button or type below. Let us begin with your primary complaint — what brings you in today?',
    timestamp: 'Just now',
    options: [
      'Joint Pain & Knee Stiffness',
      'Digestive Acid Reflux & Bloating',
      'Blood Sugar & Weight Support',
      'Chronic Cough or Sinusitis',
      'Skin Allergy or Rashes'
    ]
  }
];

export const MOCK_STAFF: StaffMember[] = [
  {
    id: 'st-1',
    name: 'Priya Narayanan',
    role: 'AYUSH Worker',
    counter: 'Counter A-1 (Triage)',
    department: 'Intake Desk',
    status: 'Active',
    patientsHandledToday: 34,
    avgHandlingMinutes: 3.2
  },
  {
    id: 'st-2',
    name: 'Suresh Kumar Verma',
    role: 'AYUSH Worker',
    counter: 'Counter A-2 (Assisted Voice)',
    department: 'Intake Desk',
    status: 'Active',
    patientsHandledToday: 28,
    avgHandlingMinutes: 4.1
  },
  {
    id: 'st-3',
    name: 'Dr. Alok Verma, MD (Ayu)',
    role: 'Senior Vaidya',
    counter: 'OPD Room 104',
    department: 'Kayachikitsa (Internal Medicine)',
    status: 'Active',
    patientsHandledToday: 21,
    avgHandlingMinutes: 8.5
  },
  {
    id: 'st-4',
    name: 'Dr. Sunita Deshmukh',
    role: 'Senior Vaidya',
    counter: 'OPD Room 108',
    department: 'Panchakarma Center',
    status: 'Active',
    patientsHandledToday: 18,
    avgHandlingMinutes: 11.2
  },
  {
    id: 'st-5',
    name: 'Anjali Sharma',
    role: 'Pharmacist',
    counter: 'Dispensary Counter 3',
    department: 'AYUSH Pharmacy',
    status: 'Active',
    patientsHandledToday: 52,
    avgHandlingMinutes: 2.0
  },
  {
    id: 'st-6',
    name: 'Col. Rajesh Bakshi (Retd.)',
    role: 'Admin',
    counter: 'Directorate Room',
    department: 'Hospital Administration',
    status: 'Active',
    patientsHandledToday: 0,
    avgHandlingMinutes: 0
  }
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-1',
    timestamp: '11:42 AM Today',
    action: 'FHIR Prescription Bundle Pushed',
    actor: 'Dr. Alok Verma',
    details: 'Token AYU-1042 signed prescription synced to ABDM Health Locker.',
    status: 'Success',
    category: 'ABDM Sync'
  },
  {
    id: 'aud-2',
    timestamp: '11:35 AM Today',
    action: 'AI Prakriti & Agni Synthesis Generated',
    actor: 'AyuFlow Clinical AI Engine v2.4',
    details: 'Derived Vata-Kapha imbalance with Manda Agni for Token AYU-1044.',
    status: 'Success',
    category: 'Triage AI'
  },
  {
    id: 'aud-3',
    timestamp: '11:10 AM Today',
    action: 'ABHA Linkage & OTP Verification',
    actor: 'System Gateway (NHA)',
    details: 'ABHA ID 45-9821-4321-7890 authenticated via Aadhaar OTP.',
    status: 'Success',
    category: 'User Access'
  },
  {
    id: 'aud-4',
    timestamp: '10:48 AM Today',
    action: 'Document Resubmission Triggered',
    actor: 'Dr. Alok Verma',
    details: 'Requested re-scan for patient Pooja Kulkarni (USG scan illegible).',
    status: 'Warning',
    category: 'Prescription Lock'
  },
  {
    id: 'aud-5',
    timestamp: '10:15 AM Today',
    action: 'OPD Queue Threshold Alert',
    actor: 'Monitoring Service',
    details: 'Kayachikitsa waiting list exceeded 15 patients. Alerted Counter A-2.',
    status: 'Warning',
    category: 'Triage AI'
  },
  {
    id: 'aud-6',
    timestamp: '09:00 AM Today',
    action: 'OPD Facility Key Handshake',
    actor: 'Admin Directorate',
    details: 'All India Institute of Ayurveda AIIA-OPD-DELHI gateway initialized.',
    status: 'Success',
    category: 'ABDM Sync'
  }
];

export const MOCK_ADMIN_STATS: AdminStats = {
  totalFootfallToday: 284,
  avgTriageTimeMinutes: 3.4,
  aiConcordanceRate: 98.2,
  abdmSyncRate: 99.6,
  activeCounters: 6,
  criticalWaitAlerts: 1
};

