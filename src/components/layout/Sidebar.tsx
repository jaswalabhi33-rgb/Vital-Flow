import React from 'react';
import {
  LayoutDashboard,
  Dumbbell,
  UtensilsCrossed,
  Moon,
  LineChart,
  Bot,
  CheckSquare,
  User,
  Zap,
  ShieldAlert,
  Flame,
  Droplet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    adaptation,
    setIsAdaptiveModalOpen,
    waterMl,
    waterTargetMl,
    habits,
  } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'train', label: 'Workout Studio', icon: Dumbbell },
    { id: 'nutrition', label: 'Nutrition & Meals', icon: UtensilsCrossed },
    { id: 'wellness', label: 'Sleep & Recovery', icon: Moon },
    { id: 'habits', label: 'Daily Habits', icon: CheckSquare },
    { id: 'progress', label: 'Analytics & Trends', icon: LineChart },
    { id: 'coach', label: 'Flow Coach AI', icon: Bot, isSpecial: true },
    { id: 'profile', label: 'Profile & Settings', icon: User },
  ];

  const hasPendingAdaptation = adaptation && adaptation.status === 'pending';
  const highestStreak = habits.length ? Math.max(...habits.map((h) => h.streakCount)) : 0;
  const waterPercent = Math.min(100, Math.round((waterMl / waterTargetMl) * 100));

  return (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 bg-[#0E1522] border-r border-slate-800/80 p-5 select-none shrink-0 min-h-screen sticky top-0 h-screen overflow-y-auto">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20">
          <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center">
            <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-lg tracking-tight text-white">VitalFlow</span>
            <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              AI
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Adaptive Wellness Companion</span>
        </div>
      </div>

      {/* Adaptive Recommendation Alert Banner */}
      {hasPendingAdaptation && (
        <div
          onClick={() => setIsAdaptiveModalOpen(true)}
          className="mb-6 p-3 rounded-xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-500/30 hover:border-emerald-400/50 cursor-pointer transition group"
        >
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
            <Zap className="w-3.5 h-3.5 animate-pulse" />
            <span>Plan Adjustment Ready</span>
          </div>
          <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
            {adaptation.recommendationTitle}
          </p>
          <span className="text-[10px] text-emerald-400 font-semibold mt-1 inline-block group-hover:underline">
            Review Adaptation →
          </span>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
          Platform Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-300'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.isSpecial && (
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Mini Widgets: Streak & Water Quick Glance */}
      <div className="mt-auto pt-4 space-y-3 border-t border-slate-800/80">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-cyan-400" />
              Hydration
            </span>
            <span className="text-slate-200 font-bold">{waterPercent}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-teal-400 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${waterPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
            <span>{waterMl} ml</span>
            <span>Goal: {waterTargetMl} ml</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
            <span className="text-xs text-slate-300 font-medium">Active Streak</span>
          </div>
          <span className="text-xs font-bold text-emerald-400">{highestStreak} days</span>
        </div>

        {/* Responsible AI Disclaimer Mini */}
        <div className="flex items-start gap-1.5 px-2 text-[10px] text-slate-400 leading-tight">
          <ShieldAlert className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
          <span>VitalFlow AI is for fitness support, not medical diagnosis or clinical treatment.</span>
        </div>
      </div>
    </aside>
  );
};
