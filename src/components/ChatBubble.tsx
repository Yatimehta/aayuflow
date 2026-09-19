import React from 'react';
import { Sprout, User, Volume2 } from 'lucide-react';
import { IntakeChatMessage } from '../types';
import { useTranslation } from '../utils/translations';

interface ChatBubbleProps {
  message: IntakeChatMessage;
  onOptionClick?: (option: string) => void;
  onSpeak?: (text: string) => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  onOptionClick,
  onSpeak
}) => {
  const { t } = useTranslation();
  const isAi = message.sender === 'ai';

  return (
    <div className={`flex flex-col ${isAi ? 'items-start' : 'items-end'} mb-4 space-y-2`}>
      <div className={`flex items-start gap-2.5 max-w-[85%] sm:max-w-[75%] ${isAi ? '' : 'flex-row-reverse'}`}>
        
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-xs ${
            isAi ? 'bg-brand-teal' : 'bg-brand-heading'
          }`}
        >
          {isAi ? <Sprout className="w-4 h-4" /> : <User className="w-4 h-4" />}
        </div>

        {/* Message Card */}
        <div
          className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-soft ${
            isAi
              ? 'bg-white border border-brand-border text-brand-heading rounded-tl-sm'
              : 'bg-brand-teal text-white rounded-tr-sm font-medium'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <p>{message.text}</p>
            {isAi && onSpeak && (
              <button
                onClick={() => onSpeak(message.text)}
                className="text-brand-muted hover:text-brand-teal-dark p-0.5 rounded transition-colors"
                title={t('cb_read_aloud')}
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className={`mt-1 text-[10px] text-right ${isAi ? 'text-brand-muted' : 'text-white/70'}`}>
            {message.timestamp}
          </div>
        </div>
      </div>

      {/* Suggested Quick Reply Options */}
      {isAi && message.options && message.options.length > 0 && (
        <div className="flex flex-wrap gap-1.5 ml-11 max-w-[85%] sm:max-w-[80%]">
          {message.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => onOptionClick && onOptionClick(opt)}
              className="text-xs px-3 py-1.5 rounded-xl border border-brand-teal/40 bg-brand-teal-light text-brand-teal-dark font-medium hover:bg-brand-teal hover:text-white transition-all shadow-xs"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
