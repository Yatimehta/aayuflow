import React, { useState } from 'react';
import { Stethoscope, ShieldCheck, Database, Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../utils/translations';

export const DoctorSettings: React.FC = () => {
  const { t } = useTranslation();
  const { showToast } = useApp();
  const [defaultDuration, setDefaultDuration] = useState('30 Days');
  const [autoSnomed, setAutoSnomed] = useState(true);
  const [abdmDirectSync, setAbdmDirectSync] = useState(true);

  const handleSave = () => {
    showToast({
      type: 'success',
      title: 'Consultation Preferences Saved',
      message: 'Physician defaults updated.'
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-brand-border shadow-soft">
        <h1 className="text-xl sm:text-2xl font-bold text-brand-heading">{t('ds_title')}</h1>
        <p className="text-xs text-brand-muted mt-1">{t('ds_subtitle')}</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-brand-border shadow-soft space-y-6 text-xs">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-brand-bg border border-brand-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-brand-mint text-[#2E7D32]">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-brand-heading">{t('ds_auto_snomed')}</p>
                <p className="text-brand-muted">{t('ds_auto_snomed_desc')}</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoSnomed}
              onChange={(e) => setAutoSnomed(e.target.checked)}
              className="w-4 h-4 accent-brand-teal"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-brand-bg border border-brand-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-brand-teal-light text-brand-teal-dark">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-brand-heading">{t('ds_abdm_sync')}</p>
                <p className="text-brand-muted">{t('ds_abdm_sync_desc')}</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={abdmDirectSync}
              onChange={(e) => setAbdmDirectSync(e.target.checked)}
              className="w-4 h-4 accent-brand-teal"
            />
          </div>

          <div className="p-3 rounded-2xl bg-brand-bg border border-brand-border space-y-1.5">
            <label className="block font-bold text-brand-heading">{t('ds_duration_label')}</label>
            <select
              value={defaultDuration}
              onChange={(e) => setDefaultDuration(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-brand-border bg-white text-brand-heading font-medium"
            >
              <option value="15 Days">15 Days</option>
              <option value="21 Days">21 Days (Traditional cycle)</option>
              <option value="30 Days">30 Days (Standard Rasayana)</option>
              <option value="45 Days">45 Days</option>
            </select>
          </div>
        </div>

        <div className="pt-3 border-t border-brand-border flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-brand-teal text-white font-bold shadow-soft flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{t('ds_save')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
