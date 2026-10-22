import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Dumbbell,
  UtensilsCrossed,
  Moon,
  Zap,
  ArrowRight,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FlowCoachModal: React.FC = () => {
  const {
    isFlowCoachOpen,
    setIsFlowCoachOpen,
    chatMessages,
    sendChatMessage,
    isChatLoading,
    setActiveTab,
    startLiveWorkout,
    workouts,
    setIsAdaptiveModalOpen,
  } = useApp();

  const [input, setInput] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<'general' | 'fitness' | 'nutrition' | 'recovery'>('general');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFlowCoachOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isFlowCoachOpen, isChatLoading]);

  if (!isFlowCoachOpen) return null;

  const quickPrompts = [
    'Create my workout for today.',
    'I only have 20 minutes. Adapt my plan.',
    'Suggest a high-protein vegetarian Indian meal.',
    'I slept poorly. How should I adjust my activity today?',
    'I missed two workouts. Help me get back on track.',
    'Explain how I am progressing this month.',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isChatLoading) return;
    setInput('');
    await sendChatMessage(text, selectedTopic);
  };

  const handleActionClick = (action: NonNullable<(typeof chatMessages)[0]['suggestedAction']>) => {
    if (action.type === 'start_workout') {
      const wk = workouts.find((w) => w.isTodayRecommended) || workouts[0];
      if (wk) {
        setIsFlowCoachOpen(false);
        startLiveWorkout(wk);
      } else {
        setIsFlowCoachOpen(false);
        setActiveTab('train');
      }
    } else if (action.type === 'view_meal') {
      setIsFlowCoachOpen(false);
      setActiveTab('nutrition');
    } else if (action.type === 'review_adaptation') {
      setIsFlowCoachOpen(false);
      setIsAdaptiveModalOpen(true);
    }
  };

  return (
    <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 flex items-end sm:items-center justify-center pointer-events-none">
      {/* Container */}
      <div className="pointer-events-auto w-full sm:w-[440px] h-[85vh] sm:h-[620px] bg-[#0E1624] border border-slate-700/80 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
        {/* Header */}
        <div className="p-4 bg-[#121B2B] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/20">
              <Bot className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white">Flow Coach AI</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Adaptive Fitness & Recovery Guide</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setIsFlowCoachOpen(false);
                setActiveTab('coach');
              }}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition text-xs"
              title="Open Fullscreen Coach"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsFlowCoachOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Topic filter pills */}
        <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-900/60 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          {(['general', 'fitness', 'nutrition', 'recovery'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              className={`px-2.5 py-1 rounded-lg capitalize font-medium transition shrink-0 ${
                selectedTopic === t
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed space-y-2 ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {msg.suggestedAction && (
                  <button
                    onClick={() => handleActionClick(msg.suggestedAction!)}
                    className="w-full mt-2 py-1.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
                  >
                    <span>{msg.suggestedAction.label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                <div className="text-[9px] text-slate-400 text-right">{msg.timestamp}</div>
              </div>

              {msg.role === 'user' && (
                <div className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {isChatLoading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs py-2 pl-8">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>Flow Coach is thinking & formulating recommendations...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-3 py-2 bg-slate-900/40 border-t border-slate-800/80 overflow-x-auto flex gap-1.5 scrollbar-none">
          {quickPrompts.slice(0, 3).map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0 border border-slate-700/60 transition"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#111928] border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Flow Coach anything..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isChatLoading}
            className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
