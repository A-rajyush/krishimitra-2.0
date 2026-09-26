import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  User,
  Sparkles,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';
import { ChatMessage, LanguageCode } from '../types';

interface AgriChatProps {
  currentLang: LanguageCode;
}

export const AgriChat: React.FC<AgriChatProps> = ({ currentLang }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'नमस्ते किसान भाई/बहन! 🙏 मैं कृषि मित्र (KrishiMitra) हूँ। आप मुझसे फसल सुरक्षा, खाद की मात्रा, खरपतवार नियंत्रण, मौसम या सरकारी योजनाओं के बारे में अपनी भाषा में कुछ भी पूछ सकते हैं। बोलकर या लिखकर प्रश्न पूछें!',
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const quickPrompts = [
    'गेहूं में कल्ले (tillers) बढ़ाने के लिए क्या डालें?',
    'सरसों में माहू (Aphids) कीट का जैविक व रासायनिक उपाय?',
    'टमाटर में पत्ती मुड़न (Leaf Curl Virus) कैसे रोकें?',
    'धान की फसल में जिंक की कमी के लक्षण व सुधार?',
    'PM-KISAN योजना की 17वीं किस्त का स्टेटस कैसे देखें?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Speech Recognition (Voice Input)
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = currentLang === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? prev + ' ' + transcript : transcript));
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn('Speech recognition init error:', e);
      setIsListening(false);
    }
  };

  // Text-to-speech for responses
  const handleToggleSpeak = async (msgId: string, text: string) => {
    if (currentlySpeakingId === msgId) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (audioPlayerRef.current) audioPlayerRef.current.pause();
      setCurrentlySpeakingId(null);
      return;
    }

    setCurrentlySpeakingId(msgId);

    // Try voice TTS endpoint
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.slice(0, 500), voice: 'Kore' }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.audioBase64) {
          const audio = new Audio(`data:audio/mp3;base64,${data.audioBase64}`);
          audioPlayerRef.current = audio;
          audio.onended = () => setCurrentlySpeakingId(null);
          audio.onerror = () => fallbackSpeak(msgId, text);
          audio.play();
          return;
        }
      }
    } catch (e) {
      console.warn('TTS error, using browser speech synthesis', e);
    }

    fallbackSpeak(msgId, text);
  };

  const fallbackSpeak = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      setCurrentlySpeakingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;
    utterance.onend = () => setCurrentlySpeakingId(null);
    utterance.onerror = () => setCurrentlySpeakingId(null);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: query.trim(),
      timestamp: 'Now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const payload = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payload,
          language: currentLang,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to get answer');
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      const errorBotMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'मुझे खेद है, तकनीकी कारण से उत्तर नहीं मिल पाया। कृपया पुनः प्रयास करें।',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, errorBotMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-green-950 rounded-3xl p-5 sm:p-7 text-white shadow-xl flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>24/7 AI Krishi Salahkar • किसान सलाहकार</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            Conversational Farming Expert
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/80 mt-1">
            Ask any question on pests, fertilizer schedules, sowing depths, weedicide safety, or market timing.
          </p>
        </div>
      </div>

      {/* Suggested Quick Prompt Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-stone-500 shrink-0 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5" /> Suggested:
        </span>
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-white hover:bg-emerald-50 hover:border-emerald-300 text-stone-700 border border-stone-200 transition-colors whitespace-nowrap shadow-2xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col h-[520px] overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m) => {
            const isBot = m.role === 'assistant';
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-[85%] sm:max-w-[78%] ${
                  isBot ? 'self-start' : 'self-end ml-auto flex-row-reverse'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-xs ${
                    isBot ? 'bg-emerald-700' : 'bg-stone-800'
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div className="space-y-1">
                  <div
                    className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      isBot
                        ? 'bg-stone-50 text-stone-900 border border-stone-200'
                        : 'bg-emerald-700 text-white shadow-xs'
                    }`}
                  >
                    {m.content}
                  </div>

                  {isBot && (
                    <div className="flex items-center gap-2 pt-0.5">
                      <button
                        onClick={() => handleToggleSpeak(m.id, m.content)}
                        className={`text-[11px] font-semibold flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
                          currentlySpeakingId === m.id
                            ? 'text-amber-700 bg-amber-100 font-bold'
                            : 'text-stone-500 hover:text-emerald-700 hover:bg-stone-100'
                        }`}
                      >
                        {currentlySpeakingId === m.id ? (
                          <>
                            <VolumeX className="w-3 h-3" />
                            <span>Stop Audio</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" />
                            <span>Listen Aloud (सुनें)</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 max-w-[80%] self-start">
              <div className="w-8 h-8 rounded-xl bg-emerald-700 flex items-center justify-center shrink-0 text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3 flex items-center gap-2 text-xs text-stone-500">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                <span>KrishiMitra is reviewing agronomy data...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-stone-50 border-t border-stone-200 flex items-center gap-2">
          {/* Voice Input Mic Button */}
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2.5 rounded-xl border transition-all ${
              isListening
                ? 'bg-red-500 text-white border-red-600 animate-pulse'
                : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-300'
            }`}
            title="Speak your question (बोलकर पूछें)"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-700" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="फसल, बीमारी, खाद या मंडी भाव के बारे में पूछें..."
            className="flex-1 bg-white text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl shadow-md transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
