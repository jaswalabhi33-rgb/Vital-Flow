import React from 'react';
import {
  LayoutDashboard,
  Dumbbell,
  UtensilsCrossed,
  Bot,
  Play,
  Menu,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MobileNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    workouts,
    startLiveWorkout,
    setIsFlowCoachOpen,
  } = useApp();

  const handleStartTodayWorkout = () => {
    const todayWk = workouts.find((w) => w.isTodayRecommended) || workouts[0];
    if (todayWk) {
      startLiveWorkout(todayWk);
    } else {
      setActiveTab('train');
    }
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F17]/95 backdrop-blur-lg border-t border-slate-800/90 px-3 py-2 flex items-center justify-around safe-area-pb">
      {/* Home */}
      <button
        onClick={() => setActiveTab('dashboard')}
        className={`flex flex-col items-center justify-center p-1.5 transition ${
          activeTab === 'dashboard' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <LayoutDashboard className="w-5 h-5" />
        <span className="text-[10px] mt-1">Home</span>
      </button>

      {/* Train */}
      <button
        onClick={() => setActiveTab('train')}
        className={`flex flex-col items-center justify-center p-1.5 transition ${
          activeTab === 'train' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Dumbbell className="w-5 h-5" />
        <span className="text-[10px] mt-1">Train</span>
      </button>

      {/* Center Action: Start Today's Workout */}
      <button
        onClick={handleStartTodayWorkout}
        className="flex flex-col items-center justify-center -mt-6 group"
        title="Start Today's Workout"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/30 group-active:scale-95 transition">
          <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
        </div>
        <span className="text-[10px] font-bold text-emerald-400 mt-1">Start</span>
      </button>

      {/* Nutrition */}
      <button
        onClick={() => setActiveTab('nutrition')}
        className={`flex flex-col items-center justify-center p-1.5 transition ${
          activeTab === 'nutrition' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <UtensilsCrossed className="w-5 h-5" />
        <span className="text-[10px] mt-1">Meals</span>
      </button>

      {/* Coach */}
      <button
        onClick={() => setIsFlowCoachOpen(true)}
        className={`flex flex-col items-center justify-center p-1.5 transition ${
          activeTab === 'coach' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Bot className="w-5 h-5" />
        <span className="text-[10px] mt-1">Coach</span>
      </button>

      {/* More (Wellness, Habits, Progress, Profile) */}
      <button
        onClick={() => setActiveTab(activeTab === 'wellness' ? 'progress' : 'wellness')}
        className={`flex flex-col items-center justify-center p-1.5 transition ${
          ['wellness', 'habits', 'progress', 'profile'].includes(activeTab)
            ? 'text-emerald-400 font-semibold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Menu className="w-5 h-5" />
        <span className="text-[10px] mt-1">More</span>
      </button>
    </nav>
  );
};
