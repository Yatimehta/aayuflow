export type LanguageCode = 'en' | 'hi';

export interface TranslationDictionary {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export const TRANSLATIONS: TranslationDictionary = {
  // Stepper & Navigation
  step1_title: { en: 'Select Hospital', hi: 'अस्पताल चुनें' },
  step2_title: { en: 'Patient Registration', hi: 'रोगी पंजीकरण' },
  step3_title: { en: 'OPD Token Slip', hi: 'ओपीडी टोकन पर्ची' },
  step4_title: { en: 'Upload Records', hi: 'दस्तावेज़ अपलोड' },
  step5_title: { en: 'Language Selection', hi: 'भाषा चयन' },
  step6_title: { en: 'Chief Complaints', hi: 'मुख्य स्वास्थ्य समस्या' },
  step7_title: { en: 'Clinical Questionnaire', hi: 'आयुष प्रश्नावली' },
  step8_title: { en: 'Review & Submit', hi: 'समीक्षा और जमा करें' },
  step9_title: { en: 'Token Confirmed', hi: 'टोकन जारी हुआ' },

  // Buttons
  btn_next: { en: 'Continue Next', hi: 'आगे बढ़ें' },
  btn_back: { en: 'Back', hi: 'पीछे जाएं' },
  btn_generate_token: { en: 'Generate OPD Token', hi: 'ओपीडी टोकन प्राप्त करें' },
  btn_start_intake: { en: 'Start Conversational Intake', hi: 'संवाद आधारित जांच शुरू करें' },
  btn_review: { en: 'Review All Responses', hi: 'सभी उत्तरों की समीक्षा करें' },
  btn_submit_intake: { en: 'Submit Intake & Send to Doctor', hi: 'जांच जमा करें और डॉक्टर को भेजें' },
  btn_copy_token: { en: 'Copy Token', hi: 'टोकन कॉपी करें' },
  btn_print_slip: { en: 'Print Official Slip', hi: 'आधिकारिक पर्ची प्रिंट करें' },
  btn_view_dashboard: { en: 'Go to Patient Dashboard', hi: 'रोगी डैशबोर्ड पर जाएं' },

  // Step 2 Form
  reg_header: { en: 'Patient Information & Demographics', hi: 'रोगी का विवरण एवं जनसांख्यिकी' },
  reg_sub: { en: 'Enter ABHA number or mobile to pull existing ABDM records', hi: 'मौजूदा रिकॉर्ड लाने के लिए आभा आईडी या मोबाइल नंबर दर्ज करें' },
  lbl_name: { en: 'Full Name', hi: 'पूरा नाम' },
  lbl_age: { en: 'Age', hi: 'आयु' },
  lbl_gender: { en: 'Gender', hi: 'लिंग' },
  lbl_phone: { en: 'Mobile Number', hi: 'मोबाइल नंबर' },
  lbl_abha: { en: 'ABHA ID / Address', hi: 'आभा आईडी / पता' },
  lbl_complaint: { en: 'Primary Chief Complaint', hi: 'मुख्य स्वास्थ्य समस्या' },

  // Step 6 Chat / Voice Intake
  chat_header: { en: 'AI Conversational Clinical Intake', hi: 'एआई संवादात्मक आयुष केस-टेकिंग' },
  chat_sub: { en: 'Explain your health issues in your own voice or words', hi: 'अपनी भाषा में बोलकर या लिखकर अपनी स्वास्थ्य समस्याएं बताएं' },
  chat_placeholder: { en: 'Speak or type symptoms (e.g. घुटनों में दर्द, खट्टी डकारें)...', hi: 'अपनी समस्या बोलें या लिखें (जैसे घुटनों में दर्द, पेट में जलन)...' },
  chat_mic_prompt: { en: 'Tap mic to speak symptoms in Hindi or English', hi: 'हिंदी या अंग्रेजी में बोलने के लिए माइक दबाएं' },

  // Step 7 Questionnaire
  quest_header: { en: 'Deterministic AYUSH Clinical Questionnaire', hi: 'प्रामाणिक आयुष नैदानिक प्रश्नावली' },
  quest_sub: { en: 'Assessment of Prakriti, Agni (digestive fire), and Koshtha (bowel)', hi: 'प्रकृति, अग्नि (पाचन शक्ति), और कोष्ठ (पेट) की प्रामाणिक जांच' },

  // Step 8 Review
  review_header: { en: 'Pre-Consultation Clinical Intake Review', hi: 'डॉक्टर परामर्श पूर्व केस समीक्षा' },
  review_sub: { en: 'Verify your recorded symptoms before sending to the physician OPD queue', hi: 'डॉक्टर के पास भेजने से पहले दर्ज किए गए लक्षणों की पुष्टि करें' }
};

export const getTranslation = (key: string, lang: string = 'en'): string => {
  const normLang = lang.toLowerCase().startsWith('hi') ? 'hi' : 'en';
  return TRANSLATIONS[key]?.[normLang] || TRANSLATIONS[key]?.en || key;
};
