/**
 * Strict helper function to normalize stream classification across all mock data fields.
 * Explicitly guards against allopathic leakages into Ayurvedic views.
 */
export const isAyurvedicRecord = (patient: any): boolean => {
  if (!patient) return false;
  const intake = String(patient.intakeType || '').toLowerCase().trim();
  const care = String(patient.careSystem || '').toLowerCase().trim();
  const dept = String(patient.department || '').toLowerCase().trim();
  const token = String(patient.tokenNumber || '').toLowerCase().trim();

  // Explicit negative check: If marked as allopathy, it CANNOT be Ayurvedic
  if (
    intake === 'allopathy' || 
    intake === 'allopathic' || 
    care === 'allopathy' || 
    care === 'allopathic' ||
    token.startsWith('allo')
  ) {
    return false;
  }

  // Explicit positive check:
  return (
    intake === 'ayurveda' ||
    intake === 'ayurvedic' ||
    care === 'ayurveda' ||
    care === 'ayush' ||
    dept.includes('ayush') ||
    dept.includes('ayurved') ||
    token.startsWith('ayu')
  );
};

export const isAllopathicRecord = (patient: any): boolean => {
  if (!patient) return false;
  const intake = String(patient.intakeType || '').toLowerCase().trim();
  const care = String(patient.careSystem || '').toLowerCase().trim();
  const dept = String(patient.department || '').toLowerCase().trim();
  const token = String(patient.tokenNumber || '').toLowerCase().trim();

  // Explicit negative check: If marked as ayurvedic, it CANNOT be Allopathic
  if (
    intake === 'ayurveda' ||
    intake === 'ayurvedic' ||
    care === 'ayurveda' ||
    care === 'ayush' ||
    dept.includes('ayush') ||
    dept.includes('ayurved') ||
    token.startsWith('ayu')
  ) {
    return false;
  }

  // Explicit positive check:
  return (
    intake === 'allopathy' || 
    intake === 'allopathic' || 
    care === 'allopathy' || 
    care === 'allopathic' ||
    dept.includes('general') ||
    dept.includes('allo') ||
    token.startsWith('allo') ||
    token.startsWith('gen')
  );
};
