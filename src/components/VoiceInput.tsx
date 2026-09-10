import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Type, Volume2, Sparkles, Check, RefreshCw, X } from 'lucide-react';

export interface VoiceInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  samplePhrases?: string[];
  language?: string;
  className?: string;
  rows?: number;
}

const DEFAULT_SAMPLE_PHRASES = [
  'घुटनों में सुबह बहुत तेज़ दर्द और अकड़न रहती है',
  'Severe acidity and retrosternal burning sensation after meals',
  'पिछले 2 हफ्ते से लगातार सूखी खांसी और छाती में जकड़न है',
  'Frequent urination at night with weakness and fatigue'
];

export const VoiceInput: React.FC<VoiceInputProps> = ({
  value,
  onChange,
  placeholder = 'Describe symptoms or observations...',
  label,
  samplePhrases = DEFAULT_SAMPLE_PHRASES,
  language = 'Hindi / English',
  className = '',
  rows = 3
}) => {
  const [mode, setMode] = useState<'voice' | 'text'>('voice');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [interimTranscript, setInterimTranscript] = useState('');
  const timerRef = useRef<any>(null);
  const streamIntervalRef = useRef<any>(null);

  // Audio timer
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds(s => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // Simulated progressive speech recognition streaming
  const startRecording = () => {
    setIsRecording(true);
    setInterimTranscript('');

    // Pick an appropriate sample phrase to stream
    const chosenPhrase = samplePhrases[Math.floor(Math.random() * samplePhrases.length)];
    const words = chosenPhrase.split(' ');
    let wordIndex = 0;

    // Delay start of speech recognition slightly
    const startDelay = setTimeout(() => {
      streamIntervalRef.current = setInterval(() => {
        if (wordIndex < words.length) {
          wordIndex++;
          const currentWords = words.slice(0, wordIndex).join(' ');
          setInterimTranscript(currentWords);
        } else {
          // Finished speaking
          if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
          setTimeout(() => {
            setIsRecording(false);
            const newValue = value ? `${value} ${chosenPhrase}` : chosenPhrase;
            onChange(newValue);
            setInterimTranscript('');
          }, 600);
        }
      }, 350);
    }, 700);

    return () => {
      clearTimeout(startDelay);
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    };
  };

  const stopRecording = () => {
    if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    setIsRecording(false);
    if (interimTranscript) {
      const newValue = value ? `${value} ${interimTranscript}` : interimTranscript;
      onChange(newValue);
      setInterimTranscript('');
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Header with Mode Toggle and Language Indicator */}
      <div className="flex items-center justify-between">
        {label && (
          <label className="text-xs font-bold text-brand-heading flex items-center gap-1.5">
            <span>{label}</span>
            <span className="text-[10px] font-normal text-brand-muted">
              ({language})
            </span>
          </label>
        )}

        <div className="flex items-center gap-1 bg-brand-bg p-0.5 rounded-xl border border-brand-border ml-auto">
          <button
            type="button"
            onClick={() => setMode('voice')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              mode === 'voice'
                ? 'bg-white text-brand-teal-dark shadow-xs'
                : 'text-brand-muted hover:text-brand-heading'
            }`}
          >
            <Mic className="w-3 h-3" />
            <span>Voice</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('text')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              mode === 'text'
                ? 'bg-white text-brand-heading shadow-xs'
                : 'text-brand-muted hover:text-brand-heading'
            }`}
          >
            <Type className="w-3 h-3" />
            <span>Type</span>
          </button>
        </div>
      </div>

      {/* Voice Mode Container */}
      {mode === 'voice' ? (
        <div className="rounded-2xl border border-brand-border bg-white p-4 shadow-soft space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Mic and Waveform visual */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button
                type="button"
                onClick={toggleRecording}
                className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-soft flex-shrink-0 ${
                  isRecording
                    ? 'bg-rose-500 text-white shadow-rose-200 scale-105 ring-4 ring-rose-200 animate-pulse'
                    : 'bg-brand-teal text-white hover:bg-brand-teal-dark hover:scale-105'
                }`}
                title={isRecording ? 'Click to stop recording' : 'Click to speak'}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-brand-heading">
                    {isRecording ? 'Listening in Hindi & Regional dialects...' : 'Tap mic to speak symptoms'}
                  </span>
                  {isRecording && (
                    <span className="font-mono text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      {formatTime(recordingSeconds)}
                    </span>
                  )}
                </div>

                {/* Animated Waveform Bars */}
                {isRecording ? (
                  <div className="flex items-center gap-1 h-5 pt-0.5">
                    {[
                      'h-3 animate-pulse',
                      'h-5 animate-bounce',
                      'h-2 animate-pulse',
                      'h-4 animate-bounce',
                      'h-5 animate-pulse',
                      'h-3 animate-bounce',
                      'h-4 animate-pulse',
                      'h-2 animate-bounce'
                    ].map((animClass, idx) => (
                      <span
                        key={idx}
                        className={`w-1 rounded-full bg-brand-teal transition-all ${animClass}`}
                        style={{ animationDelay: `${idx * 120}ms` }}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-brand-muted">
                    Supports Hindi, Marathi, Bengali, Tamil, Telugu, and Indian English
                  </p>
                )}
              </div>
            </div>

            {/* Quick Action when text is present */}
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="text-xs font-semibold text-brand-muted hover:text-rose-500 flex items-center gap-1 self-end sm:self-center"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* Transcript Box */}
          <div className="p-3.5 rounded-xl bg-brand-bg border border-brand-border text-xs min-h-[56px] flex flex-col justify-center">
            {isRecording ? (
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-brand-teal uppercase tracking-wider">
                  Live Transcription:
                </span>
                <p className="text-brand-heading font-medium italic">
                  {interimTranscript || 'Waiting for voice audio...'}
                  <span className="inline-block w-1.5 h-3.5 ml-1 bg-brand-teal animate-pulse" />
                </p>
              </div>
            ) : value ? (
              <p className="text-brand-heading font-medium leading-relaxed">
                {value}
              </p>
            ) : (
              <p className="text-brand-muted italic">
                {placeholder}
              </p>
            )}
          </div>

          {/* Quick Clickable Suggestions */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-brand-teal" />
              <span>Or click a sample complaint to test:</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {samplePhrases.slice(0, 3).map((phrase, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onChange(phrase)}
                  className="text-[11px] text-brand-body text-left px-2.5 py-1 rounded-lg bg-white border border-brand-border hover:border-brand-teal/50 hover:bg-brand-teal-light/20 transition-all line-clamp-1"
                >
                  "{phrase}"
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Manual Keyboard Mode */
        <div className="space-y-2">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            placeholder={placeholder}
            className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-brand-border bg-white text-brand-heading placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-teal/40 transition-all leading-relaxed shadow-soft"
          />
          {/* Quick Suggestions below Textarea */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] font-semibold text-brand-muted">Quick insert:</span>
            {samplePhrases.slice(0, 2).map((phrase, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onChange(value ? `${value} ${phrase}` : phrase)}
                className="text-[10px] text-brand-muted hover:text-brand-heading px-2 py-0.5 rounded-md bg-brand-bg border border-brand-border transition-colors"
              >
                + "{phrase.substring(0, 32)}..."
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
