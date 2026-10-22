import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  Dumbbell,
  UtensilsCrossed,
  Moon,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CoachView: React.FC = () => {
  const {
    chatMessages,
    sendChatMessage,
    isChatLoading,
    userProfile,
    workouts,
    startLiveWorkout,
    setActiveTab,
    setIsAdaptiveModalOpen,
  } = useApp();

  const [input, setInput] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'fitness' | 'nutrition' | 'recovery'>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatLoading]);

  const quickPrompts = [
    { text: 'Create my workout for today.', icon: Dumbbell, cat: 'fitness' },
    { text: 'I only have 20 minutes. Adapt my plan.', icon: Zap, cat: 'fitness' },
    { text: 'Suggest a high-protein vegetarian Indian meal.', icon: UtensilsCrossed, cat: 'nutrition' },
    { text: 'I missed two workouts. Help me get back on track.', icon: Zap, cat: 'fitness' },
    { text: 'I slept poorly. How should I adjust my activity today?', icon: Moon, cat: 'recovery' },
    { text: 'Explain how I am progressing this month.', icon: Sparkles, cat: 'all' },
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isChatLoading) return;
    setInput('');
    await sendChatMessage(text, activeCategory === 'all' ? 'general' : activeCategory);
  };

  const handleActionClick = (action: NonNullable<(typeof chatMessages)[0]['suggestedAction']>) => {
    if (action.type === 'start_workout') {
      const wk = workouts.find((w) => w.isTodayRecommended) || workouts[0];
      if (wk) startLiveWorkout(wk);
      else setActiveTab('train');
    } else if (action.type === 'view_meal') {
      setActiveTab('nutrition');
    } else if (action.type === 'review_adaptation') {
      setIsAdaptiveModalOpen(true);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Bot className="w-6 h-6 text-emerald-400" />
              <span>Flow Coach AI</span>
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              Personalized Guidance
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time adaptive advice grounded in your fitness goals, sleep metrics, and equipment constraints.
          </p>
        </div>

        {/* Profile Context Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Active Context: <strong>{userProfile.experienceLevel}</strong> • {userProfile.dietPreference}</span>
        </div>
      </div>

      {/* Suggested Prompt Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {quickPrompts.map((qp, idx) => {
          const Icon = qp.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSend(qp.text)}
              className="p-3.5 rounded-2xl bg-[#121A26] border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-800/60 text-left transition group flex items-start gap-3"
            >
              <div className="p-2 rounded-xl bg-slate-800 text-emerald-400 group-hover:bg-emerald-500/20 group-hover:scale-105 transition shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300 leading-snug">
                {qp.text}
              </span>
            </button>
          );
        })}
      </div>

      {/* Chat Thread Container */}
      <div className="rounded-3xl bg-[#121A26] border border-slate-800 flex flex-col h-[600px] overflow-hidden shadow-xl">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 leading-relaxed space-y-2.5 ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none shadow-md'
                    : 'bg-slate-900 border border-slate-800/90 text-slate-200 rounded-bl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>

                {msg.suggestedAction && (
                  <button
                    onClick={() => handleActionClick(msg.suggestedAction!)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition active:scale-95"
                  >
                    <span>{msg.suggestedAction.label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                <div className="text-[10px] text-slate-400 text-right">{msg.timestamp}</div>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isChatLoading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs py-2 pl-11">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>Flow Coach is analyzing your recovery signals & framing recommendations...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#0F1728] border-t border-slate-800 flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a question for Flow Coach (e.g. adjust workout for sore shoulders, high-protein meal)..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isChatLoading}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-40 text-slate-950 font-bold transition flex items-center gap-2 active:scale-95 shadow-md shadow-emerald-500/20"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
