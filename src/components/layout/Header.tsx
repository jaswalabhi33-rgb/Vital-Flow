import React from 'react';
import { Bell, Sparkles, ShieldCheck, Activity, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Header: React.FC = () => {
  const {
    userProfile,
    calculateWellnessScore,
    notifications,
    setIsNotificationOpen,
    setIsFlowCoachOpen,
    setActiveTab,
    resetToDemoData,
  } = useApp();

  const wellness = calculateWellnessScore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const todayStr = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0B0F17]/85 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Greeting & Date */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-lg lg:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>{getGreeting()}, {userProfile.name?.split(' ')[0] || 'Friend'}</span>
              <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Ready to flow
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
            <span>{todayStr}</span>
            <span>•</span>
            <span className="text-slate-300">“Your body changes. Your plan should too.”</span>
          </p>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Wellness Score Badge */}
          <button
            onClick={() => setActiveTab('wellness')}
            title="Today's Composite Wellness Score"
            aria-label="View Today's Composite Wellness Score"
            className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition group text-left"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs">
              {wellness.score}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 group-hover:text-slate-300">
                Wellness Score
              </span>
              <span className="text-xs font-semibold text-emerald-400">
                {wellness.score >= 80 ? 'Prime Alignment' : wellness.score >= 65 ? 'Moderate Readiness' : 'Recovery Focus'}
              </span>
            </div>
          </button>

          {/* Ask Flow Coach Button */}
          <button
            onClick={() => setIsFlowCoachOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-semibold text-xs sm:text-sm shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 transition transform active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Flow Coach</span>
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => setIsNotificationOpen(true)}
            className="relative p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition"
            title="Notifications"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-slate-950 text-[10px] font-extrabold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Demo Reset helper */}
          <button
            onClick={resetToDemoData}
            title="Reset Demo Data"
            aria-label="Reset Demo Data"
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 text-[11px] font-medium text-slate-400 hover:text-slate-200 transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Demo</span>
          </button>

          {/* User Profile Avatar */}
          <button
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2 pl-1 group"
            title="Open Profile & Settings"
            aria-label="Open Profile and Settings"
          >
            <div className="relative">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center font-bold text-white text-xs sm:text-sm shadow-sm">
                {userProfile.name ? userProfile.name.split(' ').map((n) => n[0]).join('').substring(0, 2) : 'VF'}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0B0F17]" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
