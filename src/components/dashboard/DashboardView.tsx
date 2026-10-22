import React from 'react';
import {
  Flame,
  Dumbbell,
  Moon,
  Droplet,
  Clock,
  Sparkles,
  CheckCircle2,
  Circle,
  Plus,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Zap,
  Info,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CircularProgress } from '../common/CircularProgress';

export const DashboardView: React.FC = () => {
  const {
    userProfile,
    workouts,
    workoutLogs,
    waterMl,
    waterTargetMl,
    addWater,
    scheduleTasks,
    toggleScheduleTask,
    sleepRecords,
    recoveryLog,
    habits,
    calculateWellnessScore,
    adaptation,
    setIsAdaptiveModalOpen,
    setIsFlowCoachOpen,
    startLiveWorkout,
    setActiveTab,
  } = useApp();

  const wellness = calculateWellnessScore();

  // Calculate actual weekly metrics
  const workoutsThisWeek = workoutLogs.filter((w) => {
    const diff = (Date.now() - new Date(w.completedAt).getTime()) / (1000 * 3600 * 24);
    return diff <= 7;
  });

  const totalWeeklyMinutes = workoutsThisWeek.reduce((acc, w) => acc + w.durationMinutes, 0);
  const weeklyMinutesTarget = userProfile.daysPerWeek * userProfile.preferredDuration;
  const workoutTargetPercent = Math.min(100, Math.round((workoutsThisWeek.length / Math.max(1, userProfile.daysPerWeek)) * 100));

  const latestSleep = sleepRecords[0] || { durationHours: 7.5, qualityRating: 4 };

  const waterPercent = Math.min(100, Math.round((waterMl / waterTargetMl) * 100));

  // Consistency score calculation
  const totalCompletedHabits = habits.reduce((acc, h) => acc + (h.completedDates.length > 0 ? 1 : 0), 0);
  const consistencyScore = habits.length ? Math.round((totalCompletedHabits / habits.length) * 100) : 92;

  const todayWorkout = workouts.find((w) => w.isTodayRecommended) || workouts[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Insight Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#111A28] via-[#132235] to-[#0E1724] border border-slate-800 p-6 lg:p-7 shadow-xl">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                Adaptive Flow Active
              </span>
              <span className="text-xs text-slate-400">Week 3 Consistency</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              “Your body changes. Your plan should too.”
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Based on your logged 8.0h sleep and mild hamstring tightness, your daily load is calibrated for optimal stimulus without fatigue accumulation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {todayWorkout && (
              <button
                onClick={() => startLiveWorkout(todayWorkout)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition transform active:scale-95"
              >
                <Dumbbell className="w-4 h-4 fill-slate-950" />
                <span>Start Today's Workout</span>
              </button>
            )}
            <button
              onClick={() => setIsFlowCoachOpen(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-sm font-semibold transition"
            >
              <span>Consult Flow Coach</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Adaptive Recommendation Card (if pending) */}
      {adaptation && adaptation.status === 'pending' && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/20 to-slate-900/60 border border-emerald-500/40 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <Zap className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">{adaptation.recommendationTitle}</h3>
                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    AI Suggested
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">{adaptation.reason}</p>
                <div className="flex items-center gap-2 mt-2 text-[11px] text-emerald-400 font-medium">
                  <span>Next: {adaptation.suggestedAction}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsAdaptiveModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shrink-0 transition"
            >
              Review & Apply
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards Grid (6 Primary Indicators) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* 1. Daily Activity */}
        <div className="p-4 rounded-2xl bg-[#121A26] border border-slate-800/90 flex flex-col justify-between hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Daily Movement</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="flex items-center justify-between my-1">
            <div>
              <div className="text-xl font-extrabold text-white">45 <span className="text-xs text-slate-400 font-normal">mins</span></div>
              <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-0.5 mt-0.5">
                <TrendingUp className="w-3 h-3" /> Target hit
              </p>
            </div>
            <CircularProgress value={100} size={54} strokeWidth={5} color="#F97316" showValue={false} />
          </div>
          <span className="text-[10px] text-slate-400 mt-2">Active morning walk & stretch</span>
        </div>

        {/* 2. Workout Completion */}
        <div className="p-4 rounded-2xl bg-[#121A26] border border-slate-800/90 flex flex-col justify-between hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Weekly Workouts</span>
            <Dumbbell className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-center justify-between my-1">
            <div>
              <div className="text-xl font-extrabold text-white">
                {workoutsThisWeek.length} <span className="text-xs text-slate-400 font-normal">/ {userProfile.daysPerWeek}</span>
              </div>
              <p className="text-[11px] text-emerald-400 font-medium mt-0.5">75% of target</p>
            </div>
            <CircularProgress value={workoutTargetPercent} size={54} strokeWidth={5} color="#10B981" showValue={false} />
          </div>
          <span className="text-[10px] text-slate-400 mt-2">Next: Full Body Strength</span>
        </div>

        {/* 3. Sleep Duration */}
        <div className="p-4 rounded-2xl bg-[#121A26] border border-slate-800/90 flex flex-col justify-between hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Sleep Duration</span>
            <Moon className="w-4 h-4 text-violet-400" />
          </div>
          <div className="flex items-center justify-between my-1">
            <div>
              <div className="text-xl font-extrabold text-white">{latestSleep.durationHours} <span className="text-xs text-slate-400 font-normal">hrs</span></div>
              <p className="text-[11px] text-violet-400 font-medium mt-0.5">★ {latestSleep.qualityRating}.0/5 Quality</p>
            </div>
            <CircularProgress value={Math.min(100, (latestSleep.durationHours / 8) * 100)} size={54} strokeWidth={5} color="#8B5CF6" showValue={false} />
          </div>
          <span className="text-[10px] text-slate-400 mt-2">+32m vs baseline average</span>
        </div>

        {/* 4. Hydration */}
        <div className="p-4 rounded-2xl bg-[#121A26] border border-slate-800/90 flex flex-col justify-between hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Hydration</span>
            <Droplet className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-center justify-between my-1">
            <div>
              <div className="text-xl font-extrabold text-white">{waterMl} <span className="text-xs text-slate-400 font-normal">ml</span></div>
              <p className="text-[11px] text-cyan-400 font-medium mt-0.5">{waterPercent}% completed</p>
            </div>
            <CircularProgress value={waterPercent} size={54} strokeWidth={5} color="#06B6D4" showValue={false} />
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <button
              onClick={() => addWater(250)}
              className="flex-1 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-[11px] font-bold text-cyan-300 transition flex items-center justify-center gap-1"
            >
              <Plus className="w-3 h-3" /> 250ml
            </button>
          </div>
        </div>

        {/* 5. Weekly Movement Minutes */}
        <div className="p-4 rounded-2xl bg-[#121A26] border border-slate-800/90 flex flex-col justify-between hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Weekly Minutes</span>
            <Clock className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-center justify-between my-1">
            <div>
              <div className="text-xl font-extrabold text-white">{totalWeeklyMinutes} <span className="text-xs text-slate-400 font-normal">/ {weeklyMinutesTarget}m</span></div>
              <p className="text-[11px] text-teal-400 font-medium mt-0.5">Steady progression</p>
            </div>
            <CircularProgress value={Math.min(100, (totalWeeklyMinutes / weeklyMinutesTarget) * 100)} size={54} strokeWidth={5} color="#14B8A6" showValue={false} />
          </div>
          <span className="text-[10px] text-slate-400 mt-2">Active calorie burn on track</span>
        </div>

        {/* 6. Consistency Score */}
        <div className="p-4 rounded-2xl bg-[#121A26] border border-slate-800/90 flex flex-col justify-between hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Consistency</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-center justify-between my-1">
            <div>
              <div className="text-xl font-extrabold text-white">{consistencyScore}%</div>
              <p className="text-[11px] text-emerald-400 font-medium mt-0.5">Top tier rhythm</p>
            </div>
            <CircularProgress value={consistencyScore} size={54} strokeWidth={5} color="#10B981" showValue={false} />
          </div>
          <span className="text-[10px] text-slate-400 mt-2">Based on tracked habits</span>
        </div>
      </div>

      {/* Wellness Composite Score & AI Daily Insight (2-Column) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Wellness Score (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#121A26] border border-slate-800 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <h3 className="font-bold text-white text-base">Today's Wellness Score</h3>
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Proprietary Indicator
              </span>
            </div>

            <div className="flex items-center gap-6 my-4">
              <CircularProgress
                value={wellness.score}
                size={110}
                strokeWidth={9}
                gradientColors={['#10B981', '#06B6D4']}
              >
                <span className="text-2xl font-black text-white">{wellness.score}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">/ 100</span>
              </CircularProgress>

              <div className="flex-1 space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 font-medium mb-1">
                    <span>Movement Stimulus (35%)</span>
                    <span className="font-bold text-emerald-400">{wellness.breakdown.movement}/35</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${(wellness.breakdown.movement / 35) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 font-medium mb-1">
                    <span>Sleep Quality (30%)</span>
                    <span className="font-bold text-violet-400">{wellness.breakdown.sleep}/30</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-violet-500 h-1.5 rounded-full" style={{ width: `${(wellness.breakdown.sleep / 30) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 font-medium mb-1">
                    <span>Recovery Readiness (20%)</span>
                    <span className="font-bold text-cyan-400">{wellness.breakdown.recovery}/20</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${(wellness.breakdown.recovery / 20) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 font-medium mb-1">
                    <span>Habits & Hydration (15%)</span>
                    <span className="font-bold text-amber-400">{wellness.breakdown.habits}/15</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${(wellness.breakdown.habits / 15) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{wellness.trend}</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">{wellness.suggestion}</p>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 mt-4 leading-normal flex items-start gap-1">
            <Info className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
            <span>VitalFlow Wellness Score reflects self-logged metrics and habit consistency; not a medical measurement or clinical diagnosis.</span>
          </p>
        </div>

        {/* AI Daily Insight Card (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-gradient-to-br from-[#121E2F] via-[#101928] to-[#0D1522] border border-slate-800 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Your Daily Insight</h3>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                Grounded in 6 days of logged data
              </span>
            </div>

            <div className="space-y-3.5 text-sm">
              <p className="text-slate-200 leading-relaxed">
                “You have completed <strong>3 of your 4 planned sessions</strong> this week with an average effort rating of 7.2/10. Your sleep duration has trended up by <strong>+32 minutes</strong>, creating prime conditions for neural recovery.”
              </p>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  Adaptive Focus for Today:
                </h4>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Prioritize steady tempo in your compound squat sets rather than pushing for personal record loads.</li>
                  <li>Incorporate 90 seconds of post-workout hamstring release to address logged tightness.</li>
                  <li>Maintain steady hydration: another 750ml brings you into the ideal 2,500ml recovery zone.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800">
            <span className="text-xs text-slate-400">Questions about today’s recommendation?</span>
            <button
              onClick={() => setIsFlowCoachOpen(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 group"
            >
              <span>Discuss with Flow Coach</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Today's Plan Schedule */}
      <div className="p-6 rounded-2xl bg-[#121A26] border border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Today's Adaptive Schedule</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any item to mark complete. Flow Coach dynamically recalculates your plan based on completions.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('train')}
            className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Workout Studio</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {scheduleTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleScheduleTask(task.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                task.completed
                  ? 'bg-slate-900/40 border-emerald-500/30 opacity-80 hover:opacity-100'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-slate-400 font-semibold">{task.timeSlot}</span>
                  {task.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <h4 className={`text-xs font-bold ${task.completed ? 'text-slate-400 line-through' : 'text-slate-100'}`}>
                  {task.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed line-clamp-2">
                  {task.description}
                </p>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/60 text-[10px] text-slate-400">
                <span>{task.recommendedDuration}</span>
                <span className={`capitalize font-semibold ${task.completed ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {task.completed ? 'Done' : 'Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
