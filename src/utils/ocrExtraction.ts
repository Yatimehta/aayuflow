import { DrugInteractionItem, LabResultItem } from '../types';

/**
 * Talks to the local character-recognition backend (ocr-service/), which holds the
 * Gemini API key server-side (.env, never shipped to the browser) and does the actual
 * OCR + structured extraction. The frontend only ever sends the raw file bytes here
 * and gets back parsed JSON — it never sees or sends any API key.
 */
const OCR_SERVICE_URL = import.meta.env.VITE_OCR_SERVICE_URL || 'http://localhost:8000';

export interface ExtractionResult {
  ocrExtractedSummary: string;
  labResults?: LabResultItem[];
  drugInteractions?: DrugInteractionItem[];
}

interface Medicine {
  name: string;
  dosage?: string | null;
  frequency?: string | null;
  duration?: string | null;
}

interface PrescriptionExtraction {
  patient_name?: string | null;
  diagnosis?: string | null;
  medicines: Medicine[];
  tests_recommended: string[];
  follow_up_date?: string | null;
  doctor_notes?: string | null;
  raw_text: string;
  confidence?: string | null;
}

interface DetailedLabTestResult {
  test_name: string;
  category?: string | null;
  value?: string | null;
  unit?: string | null;
  reference_range?: string | null;
  flag?: string | null;
}

interface LabReportFullExtraction {
  patient: { name?: string | null };
  report: { lab_name?: string | null; report_date?: string | null };
  results: DetailedLabTestResult[];
  critical_findings: string[];
  interpretive_notes?: string | null;
  raw_text: string;
}

const describeMedicine = (m: Medicine): string =>
  [m.name, m.dosage, m.frequency, m.duration].filter(Boolean).join(' · ');

async function callExtractionEndpoint<T>(path: string, file: File): Promise<T> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${OCR_SERVICE_URL}${path}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Extraction failed (${response.status}): ${detail || response.statusText}`);
  }

  return response.json();
}

export async function extractPrescription(file: File): Promise<ExtractionResult> {
  const data = await callExtractionEndpoint<PrescriptionExtraction>('/extract/prescription', file);

  const summaryParts = [
    data.diagnosis ? `Diagnosis: ${data.diagnosis}.` : null,
    data.medicines.length ? `${data.medicines.length} medicine(s): ${data.medicines.map(describeMedicine).join('; ')}.` : null,
    data.follow_up_date ? `Follow-up: ${data.follow_up_date}.` : null,
  ].filter(Boolean);

  return {
    ocrExtractedSummary:
      summaryParts.length > 0 ? summaryParts.join(' ') : data.raw_text.slice(0, 200) || 'No text could be read from this document.',
  };
}

export async function extractLabReport(file: File): Promise<ExtractionResult> {
  const data = await callExtractionEndpoint<LabReportFullExtraction>('/extract/lab-report-full', file);

  const labResults: LabResultItem[] = data.results.map((r) => ({
    parameter: r.test_name,
    value: r.value ?? '',
    unit: r.unit ?? undefined,
    referenceRange: r.reference_range ?? '',
    isAbnormal: !!r.flag && r.flag.toLowerCase() !== 'normal',
  }));

  const summary =
    data.critical_findings.length > 0
      ? data.critical_findings.join('; ')
      : data.interpretive_notes || (labResults.length > 0 ? `${labResults.length} result(s) extracted, all within normal range.` : data.raw_text.slice(0, 200)) || 'No text could be read from this document.';

  return { ocrExtractedSummary: summary, labResults: labResults.length > 0 ? labResults : undefined };
}

/** Picks the right endpoint for a document type; everything that isn't a
 * prescription goes through the general lab-report extraction, which is
 * written to pull out whatever's actually printed on the page rather than
 * assuming a fixed set of fields. */
export async function extractDocument(file: File, docType: string): Promise<ExtractionResult> {
  return docType === 'Prescription' ? extractPrescription(file) : extractLabReport(file);
}
