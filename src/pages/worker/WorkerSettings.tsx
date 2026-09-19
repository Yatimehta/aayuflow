import React, { useState } from 'react';
import { Hospital, Bell, Volume2, ShieldCheck, Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../utils/translations';

export const WorkerSettings: React.FC = () => {
  const { t } = useTranslation();
  const { selectedHospital, showToast } = useApp();
  const [audioAnnounce, setAudioAnnounce] = useState(true);
  const [autoOcr, setAutoOcr] = useState(true);
  const [regionalDialect, setRegionalDialect] = useState('Hindi (Standard)');

  const handleSave = () => {
    showToast({
      type: 'success',
      title: 'Preferences Saved',
      message: 'OPD Assistant Desk preferences updated.'
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-brand-border shadow-soft">
        <h1 className="text-xl sm:text-2xl font-bold text-brand-heading">{t('ws_title')}</h1>
        <p className="text-xs text-brand-muted mt-1">{t('ws_subtitle')}</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-brand-border shadow-soft space-y-6 text-xs">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-brand-bg border border-brand-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-brand-blue-light text-brand-blue-dark">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-brand-heading">{t('ws_audio_announce')}</p>
                <p className="text-brand-muted">{t('ws_audio_announce_desc')}</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={audioAnnounce}
              onChange={(e) => setAudioAnnounce(e.target.checked)}
              className="w-4 h-4 accent-brand-teal"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-brand-bg border border-brand-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-brand-teal-light text-brand-teal-dark">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-brand-heading">{t('ws_auto_ocr')}</p>
                <p className="text-brand-muted">{t('ws_auto_ocr_desc')}</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoOcr}
              onChange={(e) => setAutoOcr(e.target.checked)}
              className="w-4 h-4 accent-brand-teal"
            />
          </div>

          <div className="p-3 rounded-2xl bg-brand-bg border border-brand-border space-y-1.5">
            <label className="block font-bold text-brand-heading">{t('ws_dialect_label')}</label>
            <select
              value={regionalDialect}
              onChange={(e) => setRegionalDialect(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-brand-border bg-white text-brand-heading font-medium"
            >
              <option value="Hindi (Standard)">Hindi (Standard)</option>
              <option value="Hindi (Bhojpuri)">Hindi (Bhojpuri / Purvanchal)</option>
              <option value="Marathi">Marathi</option>
              <option value="Tamil">Tamil</option>
              <option value="Bengali">Bengali</option>
            </select>
          </div>
        </div>

        <div className="pt-3 border-t border-brand-border flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-brand-teal text-white font-bold shadow-soft flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{t('ws_save')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
