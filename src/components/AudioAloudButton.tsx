import React, { useState, useRef, useEffect } from 'react';
import { Volume2, Square } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AudioAloudButtonProps {
  text: string;
  label?: string;
  className?: string;
  alwaysShow?: boolean;
}

export const AudioAloudButton: React.FC<AudioAloudButtonProps> = ({
  text,
  label = 'Read this aloud',
  className = '',
  alwaysShow = false
}) => {
  const { audioGuided, patientLanguage } = useApp();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  if (!audioGuided && !alwaysShow) {
    return null;
  }

  const handleSpeak = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isSpeaking && audioRef.current) {
      audioRef.current.pause();
      setIsSpeaking(false);
      return;
    }

    try {
      setIsSpeaking(true);
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${baseUrl}/api/v1/tts/synthesize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          language: patientLanguage || 'en'
        }),
      });

      if (!response.ok) throw new Error('TTS failed');

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsSpeaking(false);
    }
  };

  if (isSpeaking) {
    return (
      <button
        type="button"
        onClick={handleSpeak}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-teal-100/90 text-teal-900 border border-teal-300 text-xs font-semibold shadow-xs animate-in fade-in duration-150 cursor-pointer ${className}`}
      >
        <Square className="w-3.5 h-3.5 text-teal-700 fill-teal-700" />
        <span>Stop Playing</span>
        <span className="flex items-end gap-0.5 h-3.5 px-0.5 ml-1">
          <span className="w-0.5 bg-teal-600 rounded-full animate-pulse inline-block" style={{ height: '10px' }} />
          <span className="w-0.5 bg-teal-600 rounded-full animate-pulse inline-block delay-75" style={{ height: '14px' }} />
          <span className="w-0.5 bg-teal-600 rounded-full animate-pulse inline-block delay-150" style={{ height: '7px' }} />
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleSpeak}
      title="Listen to this instruction"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold text-teal-700 bg-teal-50/90 hover:bg-teal-100 border border-teal-200/80 transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer ${className}`}
    >
      <Volume2 className="w-3.5 h-3.5 text-teal-600" />
      <span>{label}</span>
    </button>
  );
};
