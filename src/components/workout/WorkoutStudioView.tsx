import React, { useState } from 'react';
import {
  Dumbbell,
  Play,
  Sparkles,
  Clock,
  Flame,
  Filter,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Activity,
  History,
  Info,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WorkoutRoutine } from '../../types';

export const WorkoutStudioView: React.FC = () => {
  const { workouts, workoutLogs, startLiveWorkout, generateAiWorkout, userProfile } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [expandedWorkoutId, setExpandedWorkoutId] = useState<string | null>(workouts[0]?.id || null);

  // AI Generator Modal state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiGoal, setAiGoal] = useState('Full Body Strength & Core');
  const [aiDuration, setAiDuration] = useState(35);
  const [aiSoreness, setAiSoreness] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<'routines' | 'history'>('routines');

  const categories = ['All', 'Strength', 'Hypertrophy', 'Cardio', 'Mobility', 'Active Recovery'];

  const filteredWorkouts = workouts.filter((w) => {
    if (categoryFilter !== 'All' && w.category !== categoryFilter) return false;
    return true;
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    const newWk = await generateAiWorkout({
      targetGoal: aiGoal,
      durationMinutes: aiDuration,
      sorenessAreas: aiSoreness,
    });
    setIsGenerating(false);
    setIsAiModalOpen(false);
    if (newWk) {
      setExpandedWorkoutId(newWk.id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Dumbbell className="w-6 h-6 text-emerald-400" />
              <span>Smart Workout Studio</span>
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              Interactive
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Science-backed training routines adapted to your equipment ({userProfile.equipment.join(', ')}) and recovery readiness.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Custom AI Workout</span>
          </button>
        </div>
      </div>

      {/* Subnav Tabs: Routines vs History */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-4 text-xs font-semibold">
          <button
            onClick={() => setViewMode('routines')}
            className={`pb-2 transition relative ${
              viewMode === 'routines' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Workout Library ({workouts.length})</span>
            {viewMode === 'routines' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setViewMode('history')}
            className={`pb-2 transition relative flex items-center gap-1.5 ${
              viewMode === 'history' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Completed Logs ({workoutLogs.length})</span>
            {viewMode === 'history' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
            )}
          </button>
        </div>

        {viewMode === 'routines' && (
          <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  categoryFilter === cat
                    ? 'bg-slate-800 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {viewMode === 'routines' ? (
        /* Workouts List */
        <div className="space-y-4">
          {filteredWorkouts.map((routine) => {
            const isExpanded = expandedWorkoutId === routine.id;
            return (
              <div
                key={routine.id}
                className={`rounded-2xl border transition-all ${
                  routine.isTodayRecommended
                    ? 'bg-gradient-to-r from-[#121E2F] to-[#101926] border-emerald-500/40 shadow-lg'
                    : 'bg-[#121A26] border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header */}
                <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                        {routine.category}
                      </span>
                      {routine.isTodayRecommended && (
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Recommended for Today
                        </span>
                      )}
                      <span className="text-xs text-slate-400 font-medium">{routine.difficulty}</span>
                    </div>

                    <h3 className="text-lg font-extrabold text-white">{routine.title}</h3>
                    <p className="text-xs text-slate-300">{routine.goal}</p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                        {routine.durationMinutes} mins
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-orange-400" />
                        ~{routine.caloriesEstimate} kcal
                      </span>
                      <span className="flex items-center gap-1">
                        <Dumbbell className="w-3.5 h-3.5 text-cyan-400" />
                        {routine.exercises.length} exercises
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setExpandedWorkoutId(isExpanded ? null : routine.id)}
                      className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1 transition"
                    >
                      <span>{isExpanded ? 'Hide Details' : 'View Exercises'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => startLiveWorkout(routine)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/25 transition active:scale-95"
                    >
                      <Play className="w-4 h-4 fill-slate-950" />
                      <span>Start Workout</span>
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 border-t border-slate-800/80 space-y-5 animate-in slide-in-from-top-2 duration-200">
                    {/* Warmup */}
                    {routine.warmup && routine.warmup.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                          1. Warm-up & Joint Mobilization ({routine.warmup.length} movements)
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          {routine.warmup.map((wm, i) => (
                            <div key={i} className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                              <span className="font-semibold text-slate-200 block">{wm.exercise}</span>
                              <span className="text-[11px] text-emerald-400 font-mono">{wm.duration}</span>
                              <p className="text-[10px] text-slate-400 mt-0.5">{wm.notes}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Exercises List */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        2. Working Compound & Accessory Exercises
                      </h4>
                      <div className="space-y-2">
                        {routine.exercises.map((ex, idx) => (
                          <div
                            key={ex.id || idx}
                            className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">
                                  {idx + 1}
                                </span>
                                <h5 className="text-sm font-bold text-white">{ex.name}</h5>
                              </div>
                              <div className="flex items-center gap-3 text-xs">
                                <span className="font-mono text-emerald-400 font-bold">
                                  {ex.sets} sets × {ex.reps}
                                </span>
                                <span className="text-slate-400">Rest: {ex.restSeconds}s</span>
                              </div>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed pl-7">{ex.instruction}</p>
                            {ex.substitution && (
                              <p className="text-[11px] text-slate-400 pl-7 mt-1">
                                <strong className="text-slate-300">Available Substitution:</strong> {ex.substitution}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cooldown */}
                    {routine.cooldown && routine.cooldown.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                        <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
                          3. Cooldown & Parasympathetic Downregulation
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {routine.cooldown.map((cd, i) => (
                            <div key={i} className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                              <span className="font-semibold text-slate-200 block">{cd.exercise}</span>
                              <span className="text-[11px] text-cyan-400 font-mono">{cd.duration}</span>
                              <p className="text-[10px] text-slate-400 mt-0.5">{cd.notes}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Safety notes */}
                    {routine.safetyNotes && routine.safetyNotes.length > 0 && (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                          <span>Safety Notes:</span>
                        </div>
                        <ul className="list-disc list-inside text-[11px] space-y-0.5 text-amber-200">
                          {routine.safetyNotes.map((note, nIdx) => (
                            <li key={nIdx}>{note}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Workout Logs History */
        <div className="space-y-3">
          {workoutLogs.length === 0 ? (
            <div className="p-10 text-center rounded-2xl bg-[#121A26] border border-slate-800 text-slate-400">
              <Dumbbell className="w-10 h-10 mx-auto stroke-[1.2] mb-3 text-slate-400" />
              <p className="text-sm font-semibold text-slate-300">No workout logs recorded yet.</p>
              <p className="text-xs text-slate-400 mt-1">Start a live workout above to track your history and volume.</p>
            </div>
          ) : (
            workoutLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#121A26] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-sm font-bold text-white">{log.title}</h4>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {new Date(log.completedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span>Duration: <strong className="text-slate-200">{log.durationMinutes}m</strong></span>
                    <span>Effort (RPE): <strong className="text-emerald-400">{log.perceivedEffort}/10</strong></span>
                    <span>Calories: <strong className="text-orange-400">~{log.caloriesBurnedEstimate} kcal</strong></span>
                  </div>
                  {log.notes && (
                    <p className="text-xs text-slate-400 italic mt-1">“{log.notes}”</p>
                  )}
                </div>

                <div className="text-xs font-semibold text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
                  {log.exercisesCompleted.length} exercises logged
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* AI Workout Generator Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Generate Custom AI Workout</h3>
              </div>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Target Goal or Muscle Focus</label>
                <input
                  type="text"
                  value={aiGoal}
                  onChange={(e) => setAiGoal(e.target.value)}
                  placeholder="e.g. Upper Body Push, Core & Glute Burn, Joint Friendly Legs"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Session Duration</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="15"
                    max="60"
                    step="5"
                    value={aiDuration}
                    onChange={(e) => setAiDuration(parseInt(e.target.value, 10))}
                    className="flex-1 accent-emerald-400"
                  />
                  <span className="font-mono font-bold text-sm text-emerald-400 w-16 text-right">
                    {aiDuration} mins
                  </span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Any Soreness or Pain to Avoid?</label>
                <input
                  type="text"
                  value={aiSoreness}
                  onChange={(e) => setAiSoreness(e.target.value)}
                  placeholder="e.g. Lower back tightness, right shoulder pinching"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-400"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Flow Coach will automatically substitute exercises that stress these joints.
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400">
                <strong>Equipped with:</strong> {userProfile.equipment.join(', ')} • <strong>Level:</strong> {userProfile.experienceLevel}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAiModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isGenerating ? 'Structuring Plan...' : 'Generate Workout'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
