import React from 'react';
import { Volume2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../utils/translations';

interface AudioAloudButtonProps {
  text: string;
  label?: string;
  className?: string;
  alwaysShow?: boolean;
}

export const AudioAloudButton: React.FC<AudioAloudButtonProps> = ({
  text,
  label,
  className = '',
  alwaysShow = false
}) => {
  const { audioGuided, speakingText, speakText } = useApp();
  const { t } = useTranslation();

  if (!audioGuided && !alwaysShow) {
    return null;
  }

  const isSpeaking = speakingText === text;

  if (isSpeaking) {
    return (
      <span
        aria-live="polite"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-teal-100/90 text-teal-900 border border-teal-300 text-xs font-semibold shadow-xs animate-in fade-in duration-150 ${className}`}
      >
        <Volume2 className="w-3.5 h-3.5 text-teal-700 animate-pulse" />
        <span>{t('aab_speaking')}</span>
        <span className="flex items-end gap-0.5 h-3.5 px-0.5">
          <span className="w-0.5 bg-teal-600 rounded-full animate-soundwave-1 inline-block" style={{ height: '10px' }} />
          <span className="w-0.5 bg-teal-600 rounded-full animate-soundwave-2 inline-block" style={{ height: '14px' }} />
          <span className="w-0.5 bg-teal-600 rounded-full animate-soundwave-3 inline-block" style={{ height: '7px' }} />
        </span>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        speakText(text);
      }}
      title={t('aab_listen_instruction')}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold text-teal-700 bg-teal-50/90 hover:bg-teal-100 border border-teal-200/80 transition-all shadow-2xs hover:shadow-xs active:scale-95 ${className}`}
    >
      <Volume2 className="w-3.5 h-3.5 text-teal-600" />
      <span>{label || t('aab_read_aloud')}</span>
    </button>
  );
};
