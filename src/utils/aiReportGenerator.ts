import { EvidenceReport, PatientStatus, CareSystem } from '../types';

const OCR_SERVICE_URL = import.meta.env.VITE_OCR_SERVICE_URL || 'http://localhost:8000';

export interface GenerateReportParams {
  patientId: string;
  patientName: string;
  tokenNumber: string;
  chiefComplaint: string;
  age: number;
  gender: string;
  careSystem?: CareSystem;
  answers?: Record<string, string>;
}

interface ClinicalReportDraftResponse {
  title: string;
  prakriti: string | null;
  vikriti: string | null;
  agni: string | null;
  koshtha: string | null;
  findings: string;
  red_flags: string[];
  therapies: string[];
  diet: string[];
}

export interface RemoteClinicalReportDraft {
  title: string;
  prakriti: string;
  vikriti: string;
  agni: string;
  koshtha: string;
  findings: string;
  redFlags: string[];
  therapies: string[];
  diet: string[];
}

/** Calls the real Gemini-backed clinical-report draft on ocr-service — this is
 * what actually generates the "AI-Generated Draft" doctors see, instead of the
 * hardcoded keyword-matched templates below. Callers should treat this as
 * best-effort: generateAIClinicalReport()'s synchronous local template is what
 * renders instantly, and should stay in place if this call fails (e.g.
 * ocr-service isn't running). Correctly returns empty Ayurveda-specific
 * fields (prakriti/vikriti/agni/koshtha) for an Allopathy patient, unlike the
 * local templates, which always used Ayurvedic terminology. */
export async function generateAIClinicalReportRemote(params: GenerateReportParams): Promise<RemoteClinicalReportDraft> {
  const { patientName, age, gender, chiefComplaint, careSystem = 'AYURVEDA', answers = {} } = params;

  const response = await fetch(`${OCR_SERVICE_URL}/generate-clinical-report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      patient_name: patientName,
      age,
      gender,
      chief_complaint: chiefComplaint,
      care_system: careSystem,
      answers
    })
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Clinical report generation failed (${response.status}): ${detail || response.statusText}`);
  }

  const data: ClinicalReportDraftResponse = await response.json();
  return {
    title: data.title,
    prakriti: data.prakriti ?? '',
    vikriti: data.vikriti ?? '',
    agni: data.agni ?? '',
    koshtha: data.koshtha ?? '',
    findings: data.findings,
    redFlags: data.red_flags,
    therapies: data.therapies,
    diet: data.diet
  };
}

export const generateAIClinicalReport = ({
  patientId,
  patientName,
  tokenNumber,
  chiefComplaint,
  age,
  gender,
  careSystem = 'AYURVEDA',
  answers = {}
}: GenerateReportParams): EvidenceReport => {
  const lowerComplaint = chiefComplaint.toLowerCase();
  const severityAnswer = answers['q-4'] || '';
  const isSevere = severityAnswer.toLowerCase().includes('severe') || lowerComplaint.includes('severe') || lowerComplaint.includes('sciatica');


  // Template 1: Joint Pain / Sandhivata
  if (lowerComplaint.includes('joint') || lowerComplaint.includes('knee') || lowerComplaint.includes('sandhivata') || lowerComplaint.includes('stiff')) {
    return {
      id: 'rep-' + Date.now(),
      patientId,
      patientName,
      tokenNumber,
      title: 'Ayurvedic Prakriti & Sandhivata Synthesis Report',
      date: 'Generated Today',
      chiefComplaint,
      prakriti: 'Vata-Kapha',
      vikriti: 'Aggravated Vata localized in Sandhi (Joints) with Asthi-Majja Kshaya',
      agni: answers['q-4'] || 'Vishama Agni (Irregular appetite with variable digestion)',
      koshtha: answers['q-5'] || 'Krura Koshtha (Hard stools, tendency towards constipation)',
      findings: `AI synthesis for ${patientName} (${age}y, ${gender}) indicates classical Sandhivata (Osteoarthritis). Crepitus and morning stiffness correlate with Vata Prakopa exacerbated by ${answers['q-3'] || 'cold climatic drafts'}. Radiography exhibits medial joint space narrowing. No septic or gouty arthritis markers detected.`,
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
      status: 'Processing',
      careSystem,
      priorityFlag: isSevere
    };
  }

  // Template 2: Acidity / Amlapitta
  if (lowerComplaint.includes('acid') || lowerComplaint.includes('heartburn') || lowerComplaint.includes('amlapitta') || lowerComplaint.includes('reflux') || lowerComplaint.includes('stomach') || lowerComplaint.includes('burn')) {
    return {
      id: 'rep-' + Date.now(),
      patientId,
      patientName,
      tokenNumber,
      title: 'Urdhvaga Amlapitta & Digestive Fire Assessment',
      date: 'Generated Today',
      chiefComplaint,
      prakriti: 'Pitta-Vata',
      vikriti: 'Vidagdha Jeerna with Urdhvaga Amlapitta (Hyperchlorhydria) and Shirashoola',
      agni: answers['q-4'] || 'Tikshna Agni (Intense appetite, gastric burning if meals delayed)',
      koshtha: answers['q-5'] || 'Mrudu Koshtha (Sensitive bowel with loose tendency)',
      findings: `Clinical evaluation for ${patientName} reveals classical lakshana of Urdhvaga Amlapitta. Retrosternal burning (Hrit-Daha) and sour eructations (Tikta-Amla Udgara) indicate Vidagdha Pitta. Stress and erratic dietary timing aggravate Manovaha and Annavaha Srotas.`,
      redFlags: [
        'Retrosternal and epigastric burning worsening within 2 hours of meal',
        'Throbbing headache triggered by missed meals or late screen exposure',
        'Acid regurgitation disrupting night sleep (Nidra-Viparyaya)'
      ],
      therapies: [
        'Takradhara (Medicated cooling buttermilk stream over forehead, 5 sessions)',
        'Mukhadhauti with Triphala decoction',
        'Sheetali & Sheetkari Pranayama daily morning 10 minutes'
      ],
      diet: [
        'Fresh tender coconut water daily at 11:00 AM',
        'Soaked black raisins (Munakka) 10 pieces upon morning waking',
        'Strictly discontinue vinegar, fermented bakery products, and excess caffeine'
      ],
      readByDoctor: false,
      status: 'Processing',
      careSystem,
      priorityFlag: isSevere
    };
  }

  // Template 3: Diabetes / Metabolic (Madhumeha)
  if (lowerComplaint.includes('diabet') || lowerComplaint.includes('sugar') || lowerComplaint.includes('madhumeha') || lowerComplaint.includes('prameha') || lowerComplaint.includes('numb')) {
    return {
      id: 'rep-' + Date.now(),
      patientId,
      patientName,
      tokenNumber,
      title: 'Madhumeha Metabolic Concordance & Peripheral Nerve Profile',
      date: 'Generated Today',
      chiefComplaint,
      prakriti: 'Kapha-Vata',
      vikriti: 'Kaphaja Prameha transitioning into Vataja Dhatukshaya with Upadrava',
      agni: answers['q-4'] || 'Manda Agni (Sluggish digestion fire with post-meal lethargy)',
      koshtha: answers['q-5'] || 'Madhyama Koshtha',
      findings: `AI entity parsing notes ongoing glycemic elevation with early peripheral neuropathy signs (Pada Supthi). Sluggish digestive fire produces Ama, causing Medo-Dhatu Dushti. Recommended protocol integrates Nishamalaki and herbal foot snehana.`,
      redFlags: [
        'Bilateral tingling and numbness in foot soles on walking',
        'Nocturnal polyuria disrupting circadian sleep cycles',
        'Heaviness and lack of morning alertness'
      ],
      therapies: [
        'Pada Abhyanga (Medicated foot massage with Ksheerabala 101)',
        'Udwarthana (Dry herbal coarse powder scrub for Meda reduction)',
        'Nabhi Basti with Dashamula decoction'
      ],
      diet: [
        'Replace refined polished grains with Yava (Barley) and Kodo millet',
        'Drink Fenugreek (Methi) seed water empty stomach in morning',
        'Daily morning brisk walk 35 minutes before sunrise'
      ],
      readByDoctor: false,
      status: 'Processing',
      careSystem,
      priorityFlag: isSevere
    };
  }

  // Template 4: Respiratory / Cough / Sinus (Kasa - Pratishyaya)
  if (lowerComplaint.includes('cough') || lowerComplaint.includes('sinus') || lowerComplaint.includes('breath') || lowerComplaint.includes('kasa') || lowerComplaint.includes('cold') || lowerComplaint.includes('asthma')) {
    return {
      id: 'rep-' + Date.now(),
      patientId,
      patientName,
      tokenNumber,
      title: 'Pranavaha Sroto-Dushti & Dushta Pratishyaya Dossier',
      date: 'Generated Today',
      chiefComplaint,
      prakriti: 'Kapha-Vata',
      vikriti: 'Dushta Pratishyaya with Kapha blockage in Urdhvajatru region',
      agni: answers['q-4'] || 'Manda Agni (Low digestive power with taste loss)',
      koshtha: answers['q-5'] || 'Madhyama Koshtha',
      findings: `AI diagnostics suggest recurrent allergic rhinosinusitis and chronic Kasa. Pranavaha Srotas obstruction observed due to exposure to ${answers['q-3'] || 'damp air conditioning'}. Indicated for Nasya therapy and Sitopaladi formulation.`,
      redFlags: [
        'Post-nasal drip with frontal heaviness and morning sinus pressure',
        'Nagging dry cough worsening in evening and climate shifts',
        'Temporary loss of taste sensation (Aruchi)'
      ],
      therapies: [
        'Marsha / Pratimarsha Nasya with Anu Taila (2 drops per nostril)',
        'Bashpa Sweda (Steam inhalation with Tulsi leaves and camphor)',
        'Kavala (Gargle with warm turmeric and Triphala water)'
      ],
      diet: [
        'Sip warm water boiled with dry ginger (Shunti) throughout the day',
        'Eliminate refrigerated curd, cold water, and bananas from diet',
        'Sleep with elevated head position'
      ],
      readByDoctor: false,
      status: 'Processing',
      careSystem,
      priorityFlag: isSevere
    };
  }

  // Template 5: Dermatology / Eczema / Skin (Vicharchika / Kushta)
  if (lowerComplaint.includes('skin') || lowerComplaint.includes('itch') || lowerComplaint.includes('eczema') || lowerComplaint.includes('rash') || lowerComplaint.includes('vicharchika') || lowerComplaint.includes('psoriasis')) {
    return {
      id: 'rep-' + Date.now(),
      patientId,
      patientName,
      tokenNumber,
      title: 'Vicharchika & Raktavaha Sroto-Dushti Evaluation',
      date: 'Generated Today',
      chiefComplaint,
      prakriti: 'Pitta-Kapha',
      vikriti: 'Kaphaja-Pitta Dushti localized in Twak & Rakta Dhatu with Kandu and Srava',
      agni: answers['q-4'] || 'Mandagni with Tikshna aggravation',
      koshtha: answers['q-5'] || 'Madhyama Koshtha',
      findings: `AI dermatological mapping for ${patientName} identifies typical features of Vicharchika (Eczema). Pruritus (Kandu) and erythema indicate Pitta-Kapha vitiation in the cutaneous micro-channels. Recommended protocol includes Raktashodhaka herbs and external Lepa application.`,
      redFlags: [
        'Persistent pruritus intensifying at night or post-sweating',
        'Dry scaling and hyperpigmentation around flexural folds',
        'Exacerbation following consumption of sour or fermented items'
      ],
      therapies: [
        'Takradhara with Musta and Amalaki decoction',
        'Application of Somaraji Taila / Marichyadi Taila locally',
        'Virechana with Avipattikar Churna & Triphala'
      ],
      diet: [
        'Consume Bitter (Tikta) greens such as Methi and Neem leaves',
        'Drink boiled coriander-fennel water at room temperature',
        'Strictly avoid seafood, brinjal, curd, and synthetic soaps'
      ],
      readByDoctor: false,
      status: 'Processing',
      careSystem,
      priorityFlag: isSevere
    };
  }

  // Template 6: Default / General AYUSH Wellness & Lifestyle Imbalance
  return {
    id: 'rep-' + Date.now(),
    patientId,
    patientName,
    tokenNumber,
    title: 'Comprehensive AYUSH Holistic Clinical Dossier',
    date: 'Generated Today',
    chiefComplaint,
    prakriti: 'Vata-Pitta',
    vikriti: 'Tridosha Imbalance with Rasa-Raktavaha Sroto-Dushti',
    agni: answers['q-4'] || 'Vishama Agni',
    koshtha: answers['q-5'] || 'Madhyama Koshtha',
    findings: `Comprehensive AI analysis for ${patientName} shows systemic metabolic imbalance related to presenting complaint "${chiefComplaint}". Deepana (appetite stimulation) and Pachana (digestive clearance) advised as primary line of reversal.`,
    redFlags: [
      'Generalized fatigue and sluggish post-meal digestion',
      'Irregular sleep rhythm influenced by lifestyle stress',
      'Mild metabolic toxin (Ama) symptoms observed'
    ],
    therapies: [
      'Sarvanga Abhyanga with warm Dhanwantharam Taila',
      'Bashpa Sweda (Herbal steam box therapy)',
      'Yoga Nidra & daily Nadi Shodhana Pranayama'
    ],
    diet: [
      'Follow fresh, warm, sattvic meal schedule with zero midnight snacking',
      'Drink warm water infused with cumin and coriander seeds',
      'Include seasonal green vegetables and mung dal'
    ],
    readByDoctor: false,
    status: 'Processing',
    careSystem,
    priorityFlag: isSevere
  };
};
