import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Circle,
  Clock,
  Dumbbell,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Flame,
  Award,
  Sparkles,
  ArrowRightLeft,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WorkoutRoutine } from '../../types';

interface LiveWorkoutModalProps {
  workout: WorkoutRoutine;
  onClose: () => void;
}

export const LiveWorkoutModal: React.FC<LiveWorkoutModalProps> = ({ workout, onClose }) => {
  const { finishLiveWorkout, userProfile } = useApp();

  // Overall workout timer
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Exercise navigation
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  // Rest timer
  const [restSecondsLeft, setRestSecondsLeft] = useState<number | null>(null);
  const [isResting, setIsResting] = useState(false);

  // Track sets for each exercise: map of exerciseId -> Array<{ setNumber, weight, reps, completed }>
  const [exerciseSets, setExerciseSets] = useState<{
    [exerciseId: string]: { setNumber: number; weight: number; reps: number; completed: boolean }[];
  }>(() => {
    const initial: Record<string, any> = {};
    workout.exercises.forEach((ex) => {
      const setsArr = [];
      const defaultReps = parseInt(ex.reps.split('-')[0], 10) || 10;
      for (let s = 1; s <= ex.sets; s++) {
        setsArr.push({
          setNumber: s,
          weight: userProfile.unitSystem === 'metric' ? 16 : 35,
          reps: defaultReps,
          completed: false,
        });
      }
      initial[ex.id] = setsArr;
    });
    return initial;
  });

  // Finish confirmation & effort rating
  const [isFinishing, setIsFinishing] = useState(false);
  const [perceivedEffort, setPerceivedEffort] = useState(7);
  const [workoutNotes, setWorkoutNotes] = useState('');

  // Active exercise substitutions
  const [activeSubstitutions, setActiveSubstitutions] = useState<{ [exId: string]: boolean }>({});

  // Main timer tick
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && !isFinishing) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, isFinishing]);

  // Rest timer tick
  useEffect(() => {
    let restInterval: any;
    if (isResting && restSecondsLeft !== null && restSecondsLeft > 0) {
      restInterval = setInterval(() => {
        setRestSecondsLeft((prev) => {
          if (prev === null || prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(restInterval);
  }, [isResting, restSecondsLeft]);

  const currentExercise = workout.exercises[currentExerciseIndex];
  const isSubstituted = activeSubstitutions[currentExercise?.id];
  const activeExerciseName = isSubstituted ? currentExercise?.substitution : currentExercise?.name;

  const currentSets = currentExercise ? exerciseSets[currentExercise.id] || [] : [];

  const handleToggleSet = (setIdx: number) => {
    if (!currentExercise) return;
    const sets = [...(exerciseSets[currentExercise.id] || [])];
    const willBeCompleted = !sets[setIdx].completed;
    sets[setIdx] = { ...sets[setIdx], completed: willBeCompleted };

    setExerciseSets((prev) => ({
      ...prev,
      [currentExercise.id]: sets,
    }));

    // Trigger rest timer automatically on completing a set
    if (willBeCompleted) {
      setRestSecondsLeft(currentExercise.restSeconds || 60);
      setIsResting(true);
    }
  };

  const handleUpdateSetWeight = (setIdx: number, val: number) => {
    if (!currentExercise) return;
    const sets = [...(exerciseSets[currentExercise.id] || [])];
    sets[setIdx] = { ...sets[setIdx], weight: Math.max(0, val) };
    setExerciseSets((prev) => ({ ...prev, [currentExercise.id]: sets }));
  };

  const handleUpdateSetReps = (setIdx: number, val: number) => {
    if (!currentExercise) return;
    const sets = [...(exerciseSets[currentExercise.id] || [])];
    sets[setIdx] = { ...sets[setIdx], reps: Math.max(1, val) };
    setExerciseSets((prev) => ({ ...prev, [currentExercise.id]: sets }));
  };

  const handleCompleteWorkout = () => {
    const durationMins = Math.max(1, Math.round(secondsElapsed / 60));
    const calories = Math.round(durationMins * 7.8);

    const completedExercises = workout.exercises.map((ex) => ({
      exerciseName: activeSubstitutions[ex.id] ? ex.substitution : ex.name,
      setsCompleted: exerciseSets[ex.id] || [],
    }));

    finishLiveWorkout({
      durationMinutes: durationMins,
      perceivedEffort,
      notes: workoutNotes,
      exercisesCompleted: completedExercises,
      caloriesBurnedEstimate: calories,
    });
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Completion calculation
  const totalSetsCount = workout.exercises.reduce((acc, ex) => acc + ex.sets, 0);
  const completedSetsCount = Object.values(exerciseSets).flat().filter((s) => s.completed).length;
  const progressPercent = Math.min(100, Math.round((completedSetsCount / Math.max(1, totalSetsCount)) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#0F172A] border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800/90 flex items-center justify-between bg-slate-900/60">
          <div>
            <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Live Workout Tracking
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white mt-1 truncate max-w-xs sm:max-w-md">
              {workout.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Workout Stopwatch */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-emerald-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(secondsElapsed)}</span>
            </div>

            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title={isTimerRunning ? 'Pause' : 'Resume'}
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Workout Progress Bar */}
        <div className="w-full bg-slate-800/60 h-1.5">
          <div
            className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-1.5 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Rest Timer Banner (Floating if active) */}
        {isResting && restSecondsLeft !== null && restSecondsLeft > 0 && (
          <div className="bg-gradient-to-r from-cyan-950/80 via-slate-900 to-teal-950/80 border-b border-cyan-500/40 px-5 py-2.5 flex items-center justify-between text-xs animate-in slide-in-from-top duration-200">
            <div className="flex items-center gap-2 text-cyan-300 font-bold">
              <RotateCcw className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Rest Interval:</span>
              <span className="font-mono text-base text-white">{formatTime(restSecondsLeft)}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setRestSecondsLeft((prev) => (prev || 0) + 15)}
                className="px-2 py-1 rounded-md bg-cyan-500/20 text-cyan-300 font-semibold text-[11px] hover:bg-cyan-500/30 transition"
              >
                +15s
              </button>
              <button
                onClick={() => {
                  setIsResting(false);
                  setRestSecondsLeft(0);
                }}
                className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 hover:text-white text-[11px] font-semibold transition"
              >
                Skip Rest
              </button>
            </div>
          </div>
        )}

        {/* Content Body */}
        {!isFinishing ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Current Exercise Card */}
            {currentExercise && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Exercise {currentExerciseIndex + 1} of {workout.exercises.length}
                    </span>
                    <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                      <span>{activeExerciseName}</span>
                      {isSubstituted && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Substituted
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium mt-0.5">
                      <span>Target: {currentExercise.targetMuscle}</span>
                      <span>•</span>
                      <span>Rest: {currentExercise.restSeconds}s</span>
                    </div>
                  </div>

                  {/* Substitution Toggle */}
                  {currentExercise.substitution && (
                    <button
                      onClick={() =>
                        setActiveSubstitutions((prev) => ({
                          ...prev,
                          [currentExercise.id]: !prev[currentExercise.id],
                        }))
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 self-start sm:self-auto transition"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isSubstituted ? 'Revert to Original' : 'Swap Exercise'}</span>
                    </button>
                  )}
                </div>

                {/* Instructions Drawer */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs space-y-1.5">
                  <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
                    Coach Form Guidance:
                  </span>
                  <p className="text-slate-300 leading-relaxed">{currentExercise.instruction}</p>
                </div>

                {/* Sets Table */}
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3">
                    <div className="col-span-2">Set</div>
                    <div className="col-span-4">Weight ({userProfile.unitSystem === 'metric' ? 'kg' : 'lbs'})</div>
                    <div className="col-span-3">Reps</div>
                    <div className="col-span-3 text-right">Done</div>
                  </div>

                  {currentSets.map((set, setIdx) => (
                    <div
                      key={set.setNumber}
                      className={`grid grid-cols-12 gap-2 items-center p-3 rounded-xl border transition ${
                        set.completed
                          ? 'bg-emerald-950/20 border-emerald-500/30'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="col-span-2 font-mono font-bold text-sm text-slate-200">
                        #{set.setNumber}
                      </div>

                      <div className="col-span-4">
                        <input
                          type="number"
                          value={set.weight}
                          onChange={(e) => handleUpdateSetWeight(setIdx, parseFloat(e.target.value) || 0)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-bold text-white text-center focus:outline-none focus:border-emerald-400"
                        />
                      </div>

                      <div className="col-span-3">
                        <input
                          type="number"
                          value={set.reps}
                          onChange={(e) => handleUpdateSetReps(setIdx, parseInt(e.target.value, 10) || 1)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-bold text-white text-center focus:outline-none focus:border-emerald-400"
                        />
                      </div>

                      <div className="col-span-3 flex justify-end">
                        <button
                          onClick={() => handleToggleSet(setIdx)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
                            set.completed
                              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                          }`}
                        >
                          {set.completed ? <Check className="w-4 h-4 stroke-[3]" /> : <Circle className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Safety Warning */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Never push through sharp or pinching pain. Substitute or terminate if joint discomfort occurs.</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Completion Summary & RPE Check-in */
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-white">Workout Complete!</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Log your effort to help VitalFlow AI calibrate tomorrow’s recovery and adaptive schedule.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Duration</span>
                <p className="text-lg font-black text-white">{Math.round(secondsElapsed / 60)}m</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Sets Done</span>
                <p className="text-lg font-black text-emerald-400">{completedSetsCount} sets</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Est. Burn</span>
                <p className="text-lg font-black text-orange-400">
                  ~{Math.round((secondsElapsed / 60) * 7.8)} kcal
                </p>
              </div>
            </div>

            {/* Perceived Effort (RPE 1-10) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-200">Perceived Effort (RPE):</span>
                <span className="font-extrabold text-emerald-400 text-sm">{perceivedEffort} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={perceivedEffort}
                onChange={(e) => setPerceivedEffort(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>1 - Very Light</span>
                <span>5 - Moderate</span>
                <span>8 - Heavy</span>
                <span>10 - Maximum</span>
              </div>
            </div>

            {/* Optional Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Workout Notes (Optional)</label>
              <textarea
                value={workoutNotes}
                onChange={(e) => setWorkoutNotes(e.target.value)}
                placeholder="How did the weights feel? Any areas feeling tight or energized?"
                rows={2}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 resize-none"
              />
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between gap-3">
          {!isFinishing ? (
            <>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentExerciseIndex === 0}
                  onClick={() => setCurrentExerciseIndex((prev) => Math.max(0, prev - 1))}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition"
                  title="Previous Exercise"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={currentExerciseIndex >= workout.exercises.length - 1}
                  onClick={() => setCurrentExerciseIndex((prev) => Math.min(workout.exercises.length - 1, prev + 1))}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition"
                  title="Next Exercise"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                {currentExerciseIndex < workout.exercises.length - 1 ? (
                  <button
                    onClick={() => setCurrentExerciseIndex((prev) => prev + 1)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition"
                  >
                    Next Exercise →
                  </button>
                ) : null}

                <button
                  onClick={() => setIsFinishing(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/25 transition active:scale-95"
                >
                  Complete Workout
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsFinishing(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
              >
                Back to Tracking
              </button>
              <button
                onClick={handleCompleteWorkout}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-500/30 transition active:scale-95 flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Save & Sync Progress</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
