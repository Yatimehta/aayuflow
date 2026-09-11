import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, Volume2, ArrowRight, Loader2 } from 'lucide-react';
import { encounterApi, intakeApi } from '../api/endpoints';
import { VoiceInput } from './VoiceInput';
import { useApp } from '../context/AppContext';

interface MultimodalIntakeProps {
  encounterId: number;
  language: string;
  onComplete: () => void;
}

export const MultimodalIntake: React.FC<MultimodalIntakeProps> = ({ encounterId, language, onComplete }) => {

  const uiTranslations: Record<string, Record<string, string>> = {
    hi: {
      listen: "सुनें",
      loading: "लोड हो रहा है...",
      typeHere: "अपना उत्तर यहाँ टाइप करें...",
      typeOrSpeak: "टाइप करें या बोलें"
    },
    en: {
      listen: "Listen",
      loading: "Loading...",
      typeHere: "Type your answer here...",
      typeOrSpeak: "Type or speak"
    }
  };
  
  const t = (key: string) => {
    return uiTranslations[language]?.[key] || uiTranslations['en'][key] || key;
  };

  const [messages, setMessages] = useState<{id: string, text: string, sender: 'ai' | 'user'}[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<{id: string, text: string} | null>(null);
  const [loading, setLoading] = useState(false);
  const [textInput, setTextInput] = useState('');
  const { showToast } = useApp();
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  useEffect(() => {
    fetchNextQuestion();
  }, [encounterId]);

  const fetchNextQuestion = async () => {
    setLoading(true);
    try {
      const res = await intakeApi.getNextQuestion(encounterId, language);
      if (res.is_complete) {
        onComplete();
        return;
      }
      setCurrentQuestion({ id: res.question_id, text: res.question_text });
      setMessages(prev => [...prev, { id: res.question_id, text: res.question_text, sender: 'ai' }]);
    } catch (e) {
      console.error(e);
      showToast({ type: 'error', title: 'Error', message: 'Failed to fetch next question.' });
    } finally {
      setLoading(false);
    }
  };

  const playTTS = async (text: string) => {
    if (isSynthesizing) return;
    setIsSynthesizing(true);
    try {
      // Direct fetch to avoid JSON interceptors for blob
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/tts/synthesize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ text, language })
      });
      if (!res.ok) throw new Error("TTS failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
    } catch (e) {
      console.error(e);
      showToast({ type: 'error', title: 'TTS Error', message: 'Could not play audio.' });
    } finally {
      setIsSynthesizing(false);
    }
  };

  const submitResponse = async (answer: string, source: string) => {
    if (!currentQuestion) return;
    setLoading(true);
    setMessages(prev => [...prev, { id: 'u-' + Date.now(), text: answer, sender: 'user' }]);
    try {
      await intakeApi.submitResponse(encounterId, currentQuestion.id, answer, language, source);
      await fetchNextQuestion();
    } catch (e) {
      console.error(e);
      showToast({ type: 'error', title: 'Error', message: 'Failed to submit answer.' });
      setLoading(false);
    }
  };

  const handleVoiceResult = (transcript: string) => {
    submitResponse(transcript, 'voice');
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      submitResponse(textInput.trim(), 'text');
      setTextInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-brand-border shadow-soft overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-brand-bg/50">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 ${msg.sender === 'user' ? 'bg-brand-teal text-white' : 'bg-white border border-brand-border text-brand-heading'}`}>
              <p className="text-sm">{msg.text}</p>
              {msg.sender === 'ai' && (
                <button 
                  onClick={() => playTTS(msg.text)}
                  disabled={isSynthesizing}
                  className="mt-2 text-xs font-semibold text-brand-teal flex items-center gap-1 hover:text-brand-teal-dark"
                >
                  {isSynthesizing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Volume2 className="w-3 h-3" />}
                  <span>{isSynthesizing ? t('loading') : t('listen')}</span>
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-white border border-brand-border rounded-2xl p-4 flex gap-2 items-center">
               <span className="w-2 h-2 rounded-full bg-brand-teal animate-bounce"></span>
               <span className="w-2 h-2 rounded-full bg-brand-teal animate-bounce" style={{animationDelay: '0.2s'}}></span>
               <span className="w-2 h-2 rounded-full bg-brand-teal animate-bounce" style={{animationDelay: '0.4s'}}></span>
             </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-brand-border space-y-3">
        <VoiceInput 
          value={textInput} 
          onChange={setTextInput}
          onResult={handleVoiceResult}
          language={language}
          disabled={loading || !currentQuestion}
        />
        <form onSubmit={handleTextSubmit} className="flex gap-2">
          <input 
            type="text" 
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            disabled={loading || !currentQuestion}
            className="flex-1 px-4 py-2 border border-brand-border rounded-xl focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal text-sm"
            placeholder={t("typeHere")}
          />
          <button 
            type="submit"
            disabled={!textInput.trim() || loading || !currentQuestion}
            className="px-4 py-2 bg-brand-teal text-white rounded-xl disabled:opacity-50 flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
