import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FlaskConical, 
  Search, 
  Upload, 
  ShieldAlert, 
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DocumentItem, Consultation } from '../../types';
import { useTranslation } from '../../utils/translations';

export const LabStaffPortal: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    consultations, 
    attachLabReport, 
    selectedHospital, 
    showToast 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [streamFilter, setStreamFilter] = useState<'ALL' | 'AYURVEDA' | 'ALLOPATHY'>('ALL');
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  
  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [docName, setDocName] = useState('Serum_Uric_Acid_and_CRP_Report.pdf');
  const [docType, setDocType] = useState<DocumentItem['type']>('Lab Report');
  const [ocrText, setOcrText] = useState('Serum Uric Acid: 5.6 mg/dL (Normal reference 3.5 - 7.2 mg/dL). High-Sensitivity CRP: 4.2 mg/L (Borderline elevated). Joint inflammation correlation confirmed.');
  const [isUploading, setIsUploading] = useState(false);

  // Filter consultations
  const filteredConsultations = consultations.filter(c => {
    const matchesSearch = c.tokenNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStream = streamFilter === 'ALL' || c.careSystem === streamFilter;
    return matchesSearch && matchesStream;
  });

  const handleOpenUpload = (con: Consultation) => {
    setSelectedConsultation(con);
    setDocName(`${con.patientName.split(' ')[0]}_Diagnostic_Panel.pdf`);
    setIsUploadModalOpen(true);
  };

  const handleAttachReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConsultation) return;

    setIsUploading(true);
    setTimeout(() => {
      const newDoc: DocumentItem = {
        id: 'doc-lab-' + Date.now(),
        patientId: selectedConsultation.patientId,
        consultationId: selectedConsultation.id,
        name: docName,
        type: docType,
        size: '2.4 MB',
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'Verified',
        ocrExtractedSummary: ocrText
      };

      attachLabReport(selectedConsultation.id, newDoc);
      setIsUploading(false);
      setIsUploadModalOpen(false);
      showToast({
        type: 'success',
        title: 'Diagnostic Report Attached',
        message: `Successfully linked report to Token ${selectedConsultation.tokenNumber}.`
      });
    }, 800);
  };

  return (
    <div className="min-h-screen py-6 sm:py-8 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        
        {/* TOP STAT STRIP + CALLOUT BADGE (Exact Reference Pattern) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-8 stat-strip px-5 py-3 flex flex-wrap items-center justify-between gap-y-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 flex-shrink-0" />
              <span className="text-slate-500">{t('lab_diagnostic_requests')}</span>
              <span className="font-extrabold text-slate-900 text-sm font-sans">{consultations.length}</span>
              <span className="text-slate-400">{t('lab_active')}</span>
            </div>

            <div className="hidden sm:block h-4 w-px bg-slate-300" />

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
              <span className="text-slate-500">{t('lab_ayurveda_stream')}</span>
              <span className="font-extrabold text-slate-900 text-sm font-sans">{consultations.filter(c => c.careSystem === 'AYURVEDA').length}</span>
              <span className="text-emerald-700 font-semibold text-[11px]">{t('lab_tokens')}</span>
            </div>

            <div className="hidden sm:block h-4 w-px bg-slate-300" />

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 flex-shrink-0" />
              <span className="text-slate-500">{t('lab_allopathy_stream')}</span>
              <span className="font-extrabold text-slate-900 text-sm font-sans">{consultations.filter(c => c.careSystem === 'ALLOPATHY').length}</span>
              <span className="text-sky-700 font-semibold text-[11px]">{t('lab_tokens')}</span>
            </div>

            <div className="hidden md:block h-4 w-px bg-slate-300" />

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0" />
              <span className="text-slate-500">{t('lab_abdm_node')}</span>
              <span className="font-bold text-teal-700 text-sm">{t('lab_online')}</span>
            </div>
          </div>

          <div className="lg:col-span-4 callout-badge px-4 py-2.5 flex items-center justify-between gap-3 text-xs leading-snug">
            <p className="text-slate-700">
              {t('lab_callout_prefix')} <strong className="text-teal-700 font-bold">{t('lab_callout_bold')}</strong>.
            </p>
            <FlaskConical className="w-4 h-4 text-teal-600 flex-shrink-0" />
          </div>
        </div>

        {/* Portal Header & Compliance Card */}
        <div className="glass-card p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center shadow-xs">
                <FlaskConical className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {t('lab_title')}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-800">
                    {t('lab_restricted_staff')}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t('lab_subtitle', { hospital: selectedHospital.name })}
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-semibold shadow-xs self-start sm:self-auto">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>{t('lab_restricted_clinical')}</span>
            </span>
          </div>

          <div className="p-3.5 rounded-2xl glass-subcard text-xs text-slate-600 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">{t('lab_security_title')}</strong> {t('lab_security_desc')}
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="glass-card p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('lab_search_placeholder')}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 bg-white/95 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 font-medium text-slate-900 shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('lab_stream_label')}</span>
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              {(['ALL', 'AYURVEDA', 'ALLOPATHY'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setStreamFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    streamFilter === s
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Consultations Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              {t('lab_active_consultations')}
            </h2>
            <span className="text-xs font-mono font-bold text-teal-800 bg-white/90 border border-slate-200 px-3 py-1 rounded-full shadow-xs">
              {filteredConsultations.length} {t('lab_consultations_suffix')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredConsultations.map((con) => {
              const isAyu = con.careSystem === 'AYURVEDA';
              const docCount = con.documents?.length || 0;

              return (
                <div
                  key={con.id}
                  className="glass-card p-5 flex flex-col justify-between gap-4 transition-all hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-900 shadow-xs">
                        {con.tokenNumber}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isAyu 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                          : 'bg-sky-50 text-sky-800 border border-sky-200'
                      }`}>
                        {con.careSystem}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                        {con.patientName}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {t('lab_dept_label')} <strong>{con.department}</strong> • {con.hospitalName.split(' ')[0]}
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl glass-subcard text-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                        {t('lab_triage_indication')}
                      </span>
                      <p className="text-slate-700 line-clamp-2 font-medium">
                        {con.chiefComplaint}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 font-mono pt-1">
                      <span>{t('lab_id_label')} {con.id}</span>
                      <span>{t('lab_attached_docs')} <strong className="text-slate-900">{docCount}</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenUpload(con)}
                    className="w-full btn-brand-primary inline-flex items-center justify-center gap-2 py-2 px-4 text-xs font-bold"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{t('lab_upload_link')}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* UPLOAD DIAGNOSTIC REPORT MODAL */}
      {isUploadModalOpen && selectedConsultation && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsUploadModalOpen(false)}
        >
          <div
            className="glass-card bg-white/95 max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {t('lab_attach_report')}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {t('lab_token_label')} <strong className="font-mono text-teal-700">{selectedConsultation.tokenNumber}</strong> ({selectedConsultation.patientName})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAttachReport} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">{t('lab_file_name')}</label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">{t('lab_investigation_category')}</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900"
                >
                  <option value="Lab Report">{t('lab_cat_pathology')}</option>
                  <option value="Scan">{t('lab_cat_radiology')}</option>
                  <option value="Prescription">{t('lab_cat_prescription')}</option>
                  <option value="Other">{t('lab_cat_other')}</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">{t('lab_ocr_summary')}</label>
                <textarea
                  rows={3}
                  required
                  value={ocrText}
                  onChange={(e) => setOcrText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  {t('pi_cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="btn-brand-primary px-5 py-2 font-bold"
                >
                  {isUploading ? t('lab_attaching') : t('lab_upload_sync')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
