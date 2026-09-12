/**
 * Talks to the database-api backend (database/app.py), which is the only thing
 * that ever touches Postgres or the AES-256-GCM encryption keys. The browser
 * just sends/receives plain JSON over HTTP — see database/README.md for how
 * data is actually encrypted at rest on the other side of this call.
 */
const DB_API_URL = import.meta.env.VITE_DB_API_URL || 'http://localhost:8001';

export interface PatientRecordPayload {
  token_number: string;
  name: string;
  phone: string;
  email?: string | null;
  abha_id?: string | null;
  address: string;
  blood_group: string;
  age: number;
  gender: string;
  chief_complaint: string;
  care_system?: string | null;
  dosha_primary?: string | null;
  preferred_language?: string;
  hospital_name: string;
  hospital_city: string;
}

export interface DoctorRecordPayload {
  name: string;
  contact_number: string;
  email: string;
  license_id: string;
  aadhaar_number: string;
  discipline: string;
  qualification: string;
  department: string;
  years_of_practice?: number;
  hospital_name: string;
  hospital_city: string;
  degree_certificate_ref?: string | null;
  registration_proof_ref?: string | null;
}

async function postJson<T>(path: string, payload: unknown): Promise<T> {
  const response = await fetch(`${DB_API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Request to ${path} failed (${response.status}): ${detail || response.statusText}`);
  }
  return response.json();
}

/** Persists a new patient intake to the encrypted database. Callers should treat
 * this as best-effort — the app's own localStorage-backed state remains the
 * source of truth for the UI, so a failure here (e.g. backend not running)
 * shouldn't block the patient's actual intake flow. */
export function registerPatientRecord(payload: PatientRecordPayload) {
  return postJson('/patients', payload);
}

/** Persists a doctor's verified registration (license, Aadhaar, degree) to the
 * encrypted database. Resubmitting the same license number updates the
 * existing record rather than creating a duplicate. */
export function registerDoctorRecord(payload: DoctorRecordPayload) {
  return postJson('/doctors', payload);
}

/** Uploads a patient-submitted file (lab report, prescription, scan) to the
 * encrypted database — the file's actual bytes are stored, not just a
 * reference to it. Looked up by token number since that's the identifier the
 * frontend has on hand for a patient. Best-effort like the other calls here:
 * the document already lives in the app's local state regardless of whether
 * this succeeds. */
export function uploadPatientDocument(
  tokenNumber: string,
  file: File,
  docType: string,
  ocrExtractedSummary?: string | null
) {
  const form = new FormData();
  form.append('file', file);
  form.append('doc_type', docType);
  if (ocrExtractedSummary) form.append('ocr_extracted_summary', ocrExtractedSummary);

  return fetch(`${DB_API_URL}/patients/by-token/${encodeURIComponent(tokenNumber)}/documents`, {
    method: 'POST',
    body: form,
  }).then(async (response) => {
    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new Error(`Document upload failed (${response.status}): ${detail || response.statusText}`);
    }
  });
}
