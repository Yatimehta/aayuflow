import React, { useState, useRef } from 'react';
import { Mic, Square, Check, X, RotateCcw, Volume2, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { intakeApi } from '../api/endpoints';

interface QuestionVoiceHandlerProps {
  questionId: string;
  questionText: string;
  language: string;
  onConfirm: (transcript: string) => void;
}

export const QuestionVoiceHandler: React.FC<QuestionVoiceHandlerProps> = ({
  questionId,
  questionText,
  language,
  onConfirm
}) => {
  const { t } = useTranslation();
  const [state, setState] = useState<'idle' | 'recording' | 'processing' | 'confirming'>('idle');
  const [transcript, setTranscript] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleReadAloud = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(questionText);
      utterance.lang = language;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setState('processing');
        try {
          const res = await intakeApi.transcribeAudio(audioBlob, language);
          setTranscript(res.text || '');
          setState('confirming');
        } catch (e) {
          console.error("Transcription failed", e);
          setState('idle');
        }
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setState('recording');
    } catch (err) {
      console.error("Microphone access denied", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  if (state === 'idle') {
    return (
      <div className="flex items-center gap-3 mt-3">
        <button
          type="button"
          onClick={startRecording}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F4FBF9] border border-[#146356]/30 text-[#146356] text-xs font-bold hover:bg-[#E4EFEC] transition-colors"
        >
          <Mic className="w-3.5 h-3.5" />
          <span>{t('answerByVoice', { defaultValue: 'Answer by voice' })}</span>
        </button>
        <button
          type="button"
          onClick={handleReadAloud}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>{t('readAloud', { defaultValue: 'Read aloud' })}</span>
        </button>
      </div>
    );
  }

  if (state === 'recording') {
    return (
      <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-red-600">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-bold">{t('listening', { defaultValue: 'Listening...' })}</span>
        </div>
        <button
          type="button"
          onClick={stopRecording}
          className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-md text-xs font-bold shadow-sm"
        >
          <Square className="w-3 h-3 fill-current" />
          <span>{t('stop', { defaultValue: 'Stop' })}</span>
        </button>
      </div>
    );
  }

  if (state === 'processing') {
    return (
      <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-slate-600">
        <RefreshCw className="w-4 h-4 animate-spin" />
        <span className="text-xs font-medium">{t('processing', { defaultValue: 'Processing...' })}</span>
      </div>
    );
  }

  if (state === 'confirming') {
    return (
      <div className="mt-3 p-4 rounded-xl bg-[#F4FBF9] border border-[#146356]/30 space-y-3">
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t('youSaid', { defaultValue: 'You said:' })}</span>
          <p className="text-sm font-semibold text-[#0D2B3E] mt-1">"{transcript}"</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              onConfirm(transcript);
              setState('idle');
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#146356] text-white rounded-lg text-xs font-bold shadow-sm"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{t('confirm', { defaultValue: 'Confirm' })}</span>
          </button>
          <button
            type="button"
            onClick={() => setState('idle')}
            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50"
          >
            <X className="w-3.5 h-3.5" />
            <span>{t('edit', { defaultValue: 'Edit' })}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setState('idle');
              setTimeout(startRecording, 100);
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('retry', { defaultValue: 'Retry' })}</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
};
