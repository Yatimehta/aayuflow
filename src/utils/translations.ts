export const FORM_STRINGS: Record<string, any> = {
  "en": {
    "weight_label": "Weight (in kg) *",
    "weight_q": "Question 1: Please enter your weight in kilograms.",
    "age_label": "Age *",
    "age_q": "Question 2: Please enter your age in completed years.",
    "blood_group_label": "Blood Group",
    "blood_group_q": "Question 3: Please select your blood group.",
    "symptoms_label": "Symptoms & Discomfort *",
    "symptoms_q": "Question 4: Please describe your symptoms and bodily discomfort in your own words.",
    "symptoms_placeholder": "E.g., I have been having severe headache...",
    "symptoms_listening": "Listening... Speak now",
    "duration_label": "Duration *",
    "duration_q": "Question 5: When did your health problem start? Please select one option.",
    "severity_label": "Severity *",
    "severity_q": "Question 6: How severe is your condition? Please select Mild, Moderate, or Severe.",
    "severity_mild": "Mild",
    "severity_moderate": "Moderate",
    "severity_severe": "Severe",
    "btn_submit": "Complete & Submit Profile",
    "title": "Allopathic Intake",
    "processing": "Processing...",
    "symptomsPlaceholder": "E.g., I have been having severe headache...",
    "intakeComplete": "Intake Complete",
    "voice_dictate": "Voice Dictate",
    "read_aloud": "Read this aloud"
  },
  "hi": {
    "weight_label": "वजन (किलो में) *",
    "weight_q": "प्रश्न 1: कृपया अपना वजन किलोग्राम में दर्ज करें।",
    "age_label": "आयु *",
    "age_q": "प्रश्न 2: कृपया अपनी आयु दर्ज करें।",
    "blood_group_label": "रक्त समूह",
    "blood_group_q": "प्रश्न 3: कृपया अपना रक्त समूह चुनें।",
    "symptoms_label": "लक्षण और परेशानी *",
    "symptoms_q": "प्रश्न 4: कृपया अपने लक्षणों और शारीरिक परेशानी का वर्णन अपने शब्दों में करें।",
    "symptoms_placeholder": "उदाहरण: मुझे तेज सिरदर्द हो रहा है...",
    "symptoms_listening": "सुन रहा हूँ... अब बोलें",
    "duration_label": "अवधि *",
    "duration_q": "प्रश्न 5: आपकी स्वास्थ्य समस्या कब शुरू हुई? कृपया एक विकल्प चुनें।",
    "severity_label": "गंभीरता *",
    "severity_q": "प्रश्न 6: आपकी स्थिति कितनी गंभीर है? कृपया हल्का, मध्यम, या गंभीर चुनें।",
    "severity_mild": "हल्का",
    "severity_moderate": "मध्यम",
    "severity_severe": "गंभीर",
    "btn_submit": "प्रोफ़ाइल पूर्ण और सबमिट करें",
    "title": "एलोपैथिक प्रवेश",
    "processing": "प्रसंस्करण...",
    "symptomsPlaceholder": "उदाहरण: मुझे तेज सिरदर्द हो रहा है...",
    "intakeComplete": "प्रवेश पूरा हुआ",
    "voice_dictate": "बोलकर दर्ज करें",
    "read_aloud": "इसे जोर से पढ़ें"
  }
};

export const t = (key: string, lang: string): string => {
  const languageData = FORM_STRINGS[lang] || FORM_STRINGS["en"];
  return languageData[key] || FORM_STRINGS["en"][key] || key;
};

// Add Ayurveda Titles
FORM_STRINGS['en']['ayurveda_title'] = 'Ayurvedic Intake';
FORM_STRINGS['hi']['ayurveda_title'] = 'आयुर्वेदिक प्रवेश';
if (!FORM_STRINGS['mr']) FORM_STRINGS['mr'] = {};
FORM_STRINGS['mr']['title'] = 'अॅलोपॅथिक प्रवेश';
FORM_STRINGS['mr']['processing'] = 'प्रक्रिया करत आहे...';
FORM_STRINGS['mr']['symptomsPlaceholder'] = 'उदा., मला तीव्र डोकेदुखी होत आहे...';
FORM_STRINGS['mr']['intakeComplete'] = 'प्रवेश पूर्ण झाला';

FORM_STRINGS['mr']['ayurveda_title'] = 'आयुर्वेदिक प्रवेश';

if (!FORM_STRINGS['ml']) FORM_STRINGS['ml'] = {};
FORM_STRINGS['ml']['title'] = 'അലോപ്പതി ഇൻടേക്ക്';
FORM_STRINGS['ml']['ayurveda_title'] = 'ആയുർവേദ ഇൻടേക്ക്';
FORM_STRINGS['ml']['processing'] = 'പ്രോസസ്സ് ചെയ്യുന്നു...';
FORM_STRINGS['ml']['symptomsPlaceholder'] = 'ഉദാഹരണത്തിന്, എനിക്ക് കഠിനമായ തലവേദന ഉണ്ട്...';
FORM_STRINGS['ml']['intakeComplete'] = 'ഇൻടേക്ക് പൂർത്തിയായി';
