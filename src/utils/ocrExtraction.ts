import { DrugInteractionItem, LabResultItem } from '../types';

/**
 * Prototype-only stand-in for document extraction — no backend, no network
 * call. It never fabricates lab values or medicines that weren't actually on
 * the page; it just acknowledges the upload so the rest of the flow has
 * something to show.
 */
export interface ExtractionResult {
  ocrExtractedSummary: string;
  labResults?: LabResultItem[];
  drugInteractions?: DrugInteractionItem[];
}

const SIMULATED_DELAY_MS = 500;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function extractPrescription(file: File): Promise<ExtractionResult> {
  await wait(SIMULATED_DELAY_MS);
  return {
    ocrExtractedSummary: `"${file.name}" received. Automatic reading is disabled in this prototype — a staff member will review it manually.`
  };
}

export async function extractLabReport(file: File): Promise<ExtractionResult> {
  await wait(SIMULATED_DELAY_MS);
  return {
    ocrExtractedSummary: `"${file.name}" received. Automatic reading is disabled in this prototype — a staff member will review it manually.`
  };
}

/** Picks the right stand-in for a document type; kept as two functions above
 * so call sites don't care that both currently do the same thing. */
export async function extractDocument(file: File, docType: string): Promise<ExtractionResult> {
  return docType === 'Prescription' ? extractPrescription(file) : extractLabReport(file);
}
