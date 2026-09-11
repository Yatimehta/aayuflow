import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, X, Eye, Sparkles } from 'lucide-react';
import { DocumentItem } from '../types';
import { StatusBadge } from './StatusBadge';
import { DocumentLabResults } from './DocumentLabResults';

interface FileUploadZoneProps {
  onFilesUploaded?: (files: DocumentItem[]) => void;
  initialDocuments?: DocumentItem[];
  title?: string;
  subtitle?: string;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFilesUploaded,
  initialDocuments = [],
  title = 'Upload Medical Documents',
  subtitle = 'Drag & drop past prescriptions, lab tests, discharge summaries (PDF, JPG, PNG)'
}) => {
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateUpload = (fileNames: string[]) => {
    setUploading(true);
    setUploadProgress(10);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 250);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);

      const newDocs: DocumentItem[] = fileNames.map((name, idx) => ({
        id: 'doc-' + Date.now() + '-' + idx,
        patientId: 'current',
        name,
        type: name.toLowerCase().includes('presc')
          ? 'Prescription'
          : name.toLowerCase().includes('blood') || name.toLowerCase().includes('lab')
          ? 'Lab Report'
          : 'Ayurvedic Case Sheet',
        size: (1.2 + Math.random() * 2).toFixed(1) + ' MB',
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'Verified',
        ocrExtractedSummary: 'AI OCR extracted text successfully. Extracted diagnostic values and clinical entities parsed.',
        labResults: (name.toLowerCase().includes('blood') || name.toLowerCase().includes('lab') || idx % 2 === 0)
          ? [
              { parameter: 'Hemoglobin', value: '8.2', unit: 'g/dL', referenceRange: '13.5 - 17.5 g/dL', isAbnormal: true },
              { parameter: 'Blood Pressure', value: '160/100', unit: 'mmHg', referenceRange: '90-120/60-80', isAbnormal: true },
              { parameter: 'Blood Sugar (Fasting)', value: '220', unit: 'mg/dL', referenceRange: '70 - 99 mg/dL', isAbnormal: true },
              { parameter: 'Serum Creatinine', value: '0.9', unit: 'mg/dL', referenceRange: '0.7 - 1.3 mg/dL', isAbnormal: false }
            ]
          : undefined,
        drugInteractions: name.toLowerCase().includes('presc')
          ? [
              {
                drugs: ['Aceclofenac 100mg', 'Telmisartan 40mg'],
                warning: 'Potential interaction — flag for physician review (risk of reduced BP efficacy and kidney stress)',
                severity: 'Moderate'
              }
            ]
          : undefined
      }));

      const updated = [...documents, ...newDocs];
      setDocuments(updated);
      setUploading(false);
      setUploadProgress(0);
      if (onFilesUploaded) onFilesUploaded(updated);
    }, 1200);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const names = Array.from(e.dataTransfer.files).map(f => f.name);
      simulateUpload(names);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const names = Array.from(e.target.files).map(f => f.name);
      simulateUpload(names);
    }
  };

  const removeDoc = (id: string) => {
    const filtered = documents.filter(d => d.id !== id);
    setDocuments(filtered);
    if (onFilesUploaded) onFilesUploaded(filtered);
  };

  return (
    <div className="space-y-4">
      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-brand-teal bg-brand-teal-light/40 scale-[1.01]'
            : 'border-brand-border bg-white hover:border-brand-teal/80 hover:bg-brand-bg'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-teal-light flex items-center justify-center text-brand-teal-dark mb-3">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h3 className="text-base font-semibold text-brand-heading mb-1">{title}</h3>
          <p className="text-xs text-brand-muted max-w-sm">{subtitle}</p>

          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-brand-teal text-white shadow-soft">
              Browse Files
            </span>
            <span className="text-xs text-brand-muted">or drop files here</span>
          </div>

          <div className="mt-4 flex items-center gap-2 text-[11px] text-brand-teal-dark font-medium bg-brand-teal-light px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI OCR automatically parses Sanskrit & Ayurvedic drug terms</span>
          </div>
        </div>
      </div>

      {/* Uploading Progress Bar Simulation */}
      {uploading && (
        <div className="p-4 rounded-xl bg-white border border-brand-border shadow-soft space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between text-xs font-semibold text-brand-heading">
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-brand-teal-dark" />
              Scanning & parsing document with AI OCR...
            </span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full h-2 bg-brand-border rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-teal transition-all duration-300 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Document List */}
      {documents.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-brand-heading px-1">
            <span>Attached Records ({documents.length})</span>
            <span className="text-[11px] text-brand-muted">Auto-classified</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-start justify-between p-3 rounded-xl border border-brand-border bg-white shadow-soft hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-brand-teal-light text-brand-teal-dark flex-shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-semibold text-brand-heading truncate" title={doc.name}>
                      {doc.name}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-brand-muted mt-0.5">
                      <span>{doc.type}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                    </div>
                    {doc.ocrExtractedSummary && (
                      <p className="text-[10px] text-brand-body line-clamp-1 mt-1 bg-brand-bg px-1.5 py-0.5 rounded border border-brand-border/60">
                        {doc.ocrExtractedSummary}
                      </p>
                    )}
                    <DocumentLabResults labResults={doc.labResults} drugInteractions={doc.drugInteractions} className="mt-2" />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <StatusBadge status={doc.status} size="sm" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewDoc(doc);
                    }}
                    className="p-2 rounded-xl hover:bg-brand-bg text-brand-muted hover:text-brand-heading transition-colors min-w-[38px] min-h-[38px] flex items-center justify-center"
                    title="Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeDoc(doc.id);
                    }}
                    className="p-2 rounded-xl hover:bg-red-50 text-brand-muted hover:text-red-500 transition-colors min-w-[38px] min-h-[38px] flex items-center justify-center"
                    title="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Simple Document Preview Modal */}
      {previewDoc && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewDoc(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-soft-lg border border-brand-border space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-teal-dark" />
                <h3 className="text-sm font-bold text-brand-heading">{previewDoc.name}</h3>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1 rounded-lg text-brand-muted hover:bg-brand-bg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-brand-bg border border-brand-border text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-brand-muted">Document Type:</span>
                <span className="font-semibold text-brand-heading">{previewDoc.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">File Size:</span>
                <span className="font-medium">{previewDoc.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">Upload Status:</span>
                <StatusBadge status={previewDoc.status} size="sm" />
              </div>
              <div className="pt-2 border-t border-brand-border/60">
                <p className="font-semibold text-brand-heading mb-1">Extracted Clinical Entities (OCR):</p>
                <p className="text-brand-body leading-relaxed">
                  {previewDoc.ocrExtractedSummary || 'No text extracted.'}
                </p>
              </div>
              <DocumentLabResults labResults={previewDoc.labResults} drugInteractions={previewDoc.drugInteractions} className="pt-2 border-t border-brand-border/60" />
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-brand-teal text-white shadow-soft"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
