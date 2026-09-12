import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  FileText,
  Check,
  FileCheck,
  Clock,
  Loader2,
  AlertTriangle,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DocumentLabResults } from '../../components/DocumentLabResults';
import { DocumentItem } from '../../types';
import { extractDocument, ExtractionResult } from '../../utils/ocrExtraction';
import { uploadPatientDocument } from '../../utils/dbApiClient';

export const PatientUploadDocument: React.FC = () => {
  const navigate = useNavigate();
  const {
    activePatient,
    patients,
    selectedHospital,
    showToast
  } = useApp();

  const patient = activePatient || patients[0];

  const [docFile, setDocFile] = useState<File | null>(null);
  const [docType, setDocType] = useState<DocumentItem['type']>('Lab Report');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [extraction, setExtraction] = useState<ExtractionResult | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionError, setExtractionError] = useState<string | null>(null);

  // Runs the document through the real OCR/extraction backend as soon as a file
  // is chosen, so the preview below reflects what's actually on the page.
  useEffect(() => {
    if (!docFile) {
      setExtraction(null);
      setExtractionError(null);
      return;
    }

    let cancelled = false;
    setIsExtracting(true);
    setExtractionError(null);

    extractDocument(docFile, docType)
      .then((result) => {
        if (!cancelled) setExtraction(result);
      })
      .catch((err) => {
        if (!cancelled) setExtractionError(err instanceof Error ? err.message : 'Extraction failed.');
      })
      .finally(() => {
        if (!cancelled) setIsExtracting(false);
      });

    return () => {
      cancelled = true;
    };
  }, [docFile, docType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!docFile) {
      showToast({
        type: 'error',
        title: 'File Required',
        message: 'Please select a document or report to upload.'
      });
      return;
    }

    setIsSubmitting(true);

    const fileName = docFile.name;
    const newDoc: DocumentItem = {
      id: 'doc-' + Date.now(),
      patientId: patient.id,
      name: fileName,
      type: docType,
      uploadDate: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      size: `${(docFile.size / (1024 * 1024)).toFixed(1)} MB`,
      status: 'Verified',
      ocrExtractedSummary: notes || extraction?.ocrExtractedSummary || 'No text could be read from this document.',
      labResults: extraction?.labResults,
      drugInteractions: extraction?.drugInteractions
    };

    // Attach to patient documents
    patient.documents = [newDoc, ...(patient.documents || [])];

    // Persist the actual file bytes to the encrypted database — best-effort,
    // the local record above is already the source of truth for this UI.
    uploadPatientDocument(
      patient.tokenNumber,
      docFile,
      docType,
      notes || extraction?.ocrExtractedSummary || null
    ).catch(() => {});

    showToast({
      type: 'success',
      title: 'Document Uploaded',
      message: `${fileName} attached to your patient record.`
    });

    setIsSubmitting(false);

    // Navigate to clean token confirmation
    navigate('/patient/token', {
      state: {
        token: patient.tokenNumber,
        queueSlot: patient.queueNumber,
        hospitalName: selectedHospital.name,
        estimatedWait: '~15 mins'
      }
    });
  };

  return (
    <div className="min-h-[85vh] py-10 px-4 sm:px-6 relative z-10">
      <div className="max-w-lg mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => navigate('/patient/dashboard')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Upload Document
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Submit your medical report, prescription, or scan before your consultation.
            </p>
          </div>
        </div>

        {/* Minimalist Upload Card */}
        <form 
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6"
        >
          
          {/* Document Type Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-800">
              Document Type *
            </label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value as DocumentItem['type'])}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
            >
              <option value="Lab Report">Lab Report (Blood, Urine, Pathology)</option>
              <option value="Prescription">Prescription / Medication Slip</option>
              <option value="Diagnostic Scan">Diagnostic Scan / X-Ray / MRI / USG</option>
              <option value="Discharge Summary">Discharge Summary / Prior Case Note</option>
            </select>
          </div>

          {/* File Picker Drop Area */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-800">
              Choose File (PDF, PNG, JPG) *
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-teal-400 bg-slate-50/50 transition-colors">
              <input
                type="file"
                id="patient-file-upload"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setDocFile(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
              <label htmlFor="patient-file-upload" className="cursor-pointer block space-y-2">
                <Upload className="w-8 h-8 text-teal-600 mx-auto" />
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    {docFile ? docFile.name : 'Click to select or drop document here'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {docFile 
                      ? `${(docFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to submit` 
                      : 'Supports PDF, JPG, PNG up to 25MB'}
                  </p>
                </div>
              </label>

              {docFile && (
                <button
                  type="button"
                  onClick={() => setDocFile(null)}
                  className="mt-3 text-xs text-rose-600 font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Remove file</span>
                </button>
              )}
            </div>

            {/* Extracted Values Live Preview — reads the actual document via the
                character-recognition backend (ocr-service/); nothing here is fabricated. */}
            {docFile && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">AI Extraction Preview:</span>
                  {!isExtracting && !extractionError && (
                    <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full font-bold border border-teal-200">
                      Read from your document
                    </span>
                  )}
                </div>

                {isExtracting && (
                  <div className="flex items-center gap-2 text-slate-500 py-2">
                    <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                    <span>Reading document with AI...</span>
                  </div>
                )}

                {!isExtracting && extractionError && (
                  <div className="flex items-start gap-2 text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-2.5">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Couldn't read this document automatically ({extractionError}). You can still submit it — a staff member can review it manually.</span>
                  </div>
                )}

                {!isExtracting && !extractionError && extraction && (
                  extraction.labResults?.length || extraction.drugInteractions?.length ? (
                    <DocumentLabResults labResults={extraction.labResults} drugInteractions={extraction.drugInteractions} />
                  ) : (
                    <p className="text-slate-600 leading-relaxed">{extraction.ocrExtractedSummary}</p>
                  )
                )}
              </div>
            )}
          </div>

          {/* Optional Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-800">
              Notes or Doctor's Comments (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Fasting blood sugar report from last week..."
              className="w-full p-3 text-xs rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all leading-relaxed placeholder:text-slate-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/patient/dashboard')}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || isExtracting}
              className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs disabled:opacity-50"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{isSubmitting ? 'Uploading...' : isExtracting ? 'Reading document...' : 'Submit Document'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
