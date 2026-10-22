import React, { useState, useEffect } from 'react';
import {
  Moon,
  HeartPulse,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Circle,
  Plus,
  Info,
  ShieldAlert,
  Smile,
  Frown,
  Meh,
  Sun,
  Flame,
  Battery,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WellnessView: React.FC = () => {
  const { sleepRecords, logSleep, recoveryLog, logRecovery, requestCustomAdaptation } = useApp();

  // Sleep Logging state
  const [bedtime, setBedtime] = useState('23:15');
  const [wakeTime, setWakeTime] = useState('07:15');
  const [qualityRating, setQualityRating] = useState(4);
  const [sleepNotes, setSleepNotes] = useState('');
  const [windDownChecklist, setWindDownChecklist] = useState([
    { id: 'wd_1', text: 'Dim room lights & enable warm screen filter by 10:15 PM', completed: true },
    { id: 'wd_2', text: 'Hydrate with 200ml room temp water or chamomile tea', completed: true },
    { id: 'wd_3', text: 'Room temperature cool (66-68°F / 19-20°C)', completed: true },
    { id: 'wd_4', text: '5-minute diaphragmatic breathing before lying down', completed: false },
  ]);

  // Recovery Log State
  const [fatigueLevel, setFatigueLevel] = useState(recoveryLog.fatigueLevel || 4);
  const [energyLevel, setEnergyLevel] = useState(recoveryLog.energyLevel || 7);
  const [selectedSoreness, setSelectedSoreness] = useState<string[]>(recoveryLog.sorenessAreas || ['Hamstrings']);

  // Box Breathing Timer (4-4-4-4)
  const [isBreathingRunning, setIsBreathingRunning] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Hold (Empty)'>('Inhale');
  const [breathSeconds, setBreathSeconds] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  // Gratitude / Mood Check-in
  const [selectedMood, setSelectedMood] = useState<string>('Calm & Focused');
  const [gratitudeNote, setGratitudeNote] = useState('');
  const [savedReflections, setSavedReflections] = useState<string[]>([
    'Grateful for completing Tuesday’s full-body session without lower back strain.',
    'Enjoyed the turmeric roasted tofu lunch today.',
  ]);

  // Breathing interval effect
  useEffect(() => {
    let timer: any;
    if (isBreathingRunning) {
      timer = setInterval(() => {
        setBreathSeconds((prev) => {
          if (prev <= 1) {
            // Transition phase
            setBreathPhase((currentPhase) => {
              if (currentPhase === 'Inhale') return 'Hold';
              if (currentPhase === 'Hold') return 'Exhale';
              if (currentPhase === 'Exhale') return 'Hold (Empty)';
              setCyclesCompleted((c) => c + 1);
              return 'Inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreathingRunning]);

  const muscleAreas = [
    'Hamstrings',
    'Quadriceps',
    'Upper Back',
    'Lower Back',
    'Shoulders',
    'Chest',
    'Calves',
    'Glutes',
    'Neck',
  ];

  const handleToggleSoreness = (area: string) => {
    setSelectedSoreness((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const handleSaveRecovery = () => {
    // Calculate recovery readiness: higher energy, lower fatigue = higher score
    const score = Math.round(Math.max(10, Math.min(100, (energyLevel * 10 - fatigueLevel * 4 - selectedSoreness.length * 3 + 40))));
    logRecovery({
      date: new Date().toISOString().split('T')[0],
      fatigueLevel,
      energyLevel,
      sorenessAreas: selectedSoreness,
      perceivedRecoveryScore: score,
      notes: `Energy ${energyLevel}/10, Fatigue ${fatigueLevel}/10.`,
    });

    // If fatigue is high or soreness is high, proactively trigger adaptive engine
    if (fatigueLevel >= 7 || selectedSoreness.length >= 3) {
      requestCustomAdaptation({
        reason: 'Elevated muscle soreness & systemic fatigue',
        energyLevel,
        sorenessLevel: fatigueLevel,
      });
    }
  };

  const handleSaveSleep = (e: React.FormEvent) => {
    e.preventDefault();
    // Parse duration estimate from bedtime and wakeTime
    const [bH, bM] = bedtime.split(':').map(Number);
    const [wH, wM] = wakeTime.split(':').map(Number);
    let dur = (wH * 60 + wM - (bH * 60 + bM)) / 60;
    if (dur < 0) dur += 24;
    dur = Math.round(dur * 10) / 10;

    logSleep({
      date: new Date().toISOString().split('T')[0],
      bedtime,
      wakeTime,
      durationHours: dur || 7.5,
      qualityRating,
      notes: sleepNotes,
      windDownChecklistCompleted: windDownChecklist.every((item) => item.completed),
    });
  };

  const handleSaveGratitude = () => {
    if (!gratitudeNote.trim()) return;
    setSavedReflections([gratitudeNote.trim(), ...savedReflections]);
    setGratitudeNote('');
  };

  const toggleWindDownItem = (id: string) => {
    setWindDownChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Moon className="w-6 h-6 text-violet-400" />
              <span>Sleep, Recovery & Mental Wellness</span>
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30">
              Restorative
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Sustainable fitness honors recovery as half the equation. Track your sleep, calibrate soreness, and regulate your nervous system.
          </p>
        </div>
      </div>

      {/* 2-Column: Sleep Tracking (Left) & Recovery Readiness (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sleep Tracker (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#121A26] border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-violet-400" />
              <h3 className="font-bold text-white text-base">Sleep Tracker & Consistency</h3>
            </div>
            <span className="text-xs font-mono font-bold text-violet-400">
              Avg: 7.8 hrs / night
            </span>
          </div>

          {/* Quick Sleep History Bars */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Recent 6 Nights Trend</span>
              <span className="text-[11px] text-emerald-400 font-bold">+32 mins vs prior week</span>
            </div>
            <div className="flex items-end justify-between gap-2 h-24 pt-2">
              {sleepRecords.slice(0, 6).reverse().map((record, idx) => {
                const heightPercent = Math.min(100, (record.durationHours / 9) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[10px] font-mono font-bold text-slate-300">{record.durationHours}h</span>
                    <div className="w-full bg-slate-800 rounded-t-md h-full flex items-end">
                      <div
                        className="w-full bg-gradient-to-t from-violet-600 to-indigo-400 rounded-t-md transition-all duration-500"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-slate-400">
                      {record.date.split('-').slice(1).join('/')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Log Last Night Form */}
          <form onSubmit={handleSaveSleep} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3.5 text-xs">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              Log Sleep Duration & Quality
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1 font-medium">Bedtime</label>
                <input
                  type="time"
                  value={bedtime}
                  onChange={(e) => setBedtime(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 font-medium">Wake Time</label>
                <input
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Sleep Quality Rating (1-5)</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setQualityRating(star)}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition ${
                      qualityRating >= star
                        ? 'bg-violet-500/20 border-violet-500/40 text-violet-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    ★ {star}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition"
              >
                Save Sleep Entry
              </button>
            </div>
          </form>

          {/* Evening Wind-Down Checklist */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Evening Wind-Down Routine
            </h4>
            <div className="space-y-2">
              {windDownChecklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleWindDownItem(item.id)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between text-xs ${
                    item.completed
                      ? 'bg-slate-900/40 border-violet-500/30 text-slate-400 line-through'
                      : 'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span>{item.text}</span>
                  {item.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0 ml-2" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recovery & Soreness Tracker (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#121A26] border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-base">Physiological Recovery Readiness</h3>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-xs">
              <span>Readiness: {recoveryLog.perceivedRecoveryScore} / 100</span>
            </div>
          </div>

          {/* Energy vs Fatigue Sliders */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
            {/* Energy Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Battery className="w-4 h-4 text-emerald-400" />
                  Current Energy Level:
                </span>
                <span className="font-mono font-bold text-emerald-400 text-sm">{energyLevel} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>Drained (1)</span>
                <span>Balanced (5)</span>
                <span>Electrified (10)</span>
              </div>
            </div>

            {/* Fatigue Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-400" />
                  Systemic Muscle Fatigue:
                </span>
                <span className="font-mono font-bold text-orange-400 text-sm">{fatigueLevel} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={fatigueLevel}
                onChange={(e) => setFatigueLevel(parseInt(e.target.value, 10))}
                className="w-full accent-orange-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>Fresh (1)</span>
                <span>Moderate (5)</span>
                <span>Deep Fatigue (10)</span>
              </div>
            </div>
          </div>

          {/* Muscle Soreness Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Select Sore or Tight Muscle Groups:
              </span>
              <span className="text-[11px] text-slate-400">
                {selectedSoreness.length} selected
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {muscleAreas.map((area) => {
                const isSelected = selectedSoreness.includes(area);
                return (
                  <button
                    key={area}
                    onClick={() => handleToggleSoreness(area)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition text-center ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {area}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleSaveRecovery}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition active:scale-95"
          >
            Update Recovery Readiness & Recalibrate Plan
          </button>

          <p className="text-[10px] text-slate-400 flex items-start gap-1">
            <Info className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" />
            <span>VitalFlow uses soreness signals to safeguard joints and modify training volume. If you experience severe chest pain, fainting, or acute trauma, stop and seek urgent medical care.</span>
          </p>
        </div>
      </div>

      {/* Guided Breathing Timer (Box Breathing) & Gratitude Journal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Box Breathing Timer (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-gradient-to-br from-[#101A29] to-[#121E2F] border border-cyan-500/30 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-base">Guided Box Breathing (4-4-4-4)</h3>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-300">
                {cyclesCompleted} Cycles Completed
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Used by high-performance athletes to downregulate sympathetic fight-or-flight and lower resting cortisol.
            </p>

            {/* Visual Animated Breathing Circle */}
            <div className="flex flex-col items-center justify-center my-4">
              <div
                className={`relative w-44 h-44 rounded-full flex flex-col items-center justify-center border-2 transition-all duration-1000 ${
                  breathPhase === 'Inhale'
                    ? 'scale-110 border-cyan-400 bg-cyan-500/20 shadow-xl shadow-cyan-500/20'
                    : breathPhase === 'Hold' || breathPhase === 'Hold (Empty)'
                    ? 'scale-105 border-teal-400 bg-teal-500/15'
                    : 'scale-90 border-slate-600 bg-slate-900/60'
                }`}
              >
                <span className="text-xs uppercase font-extrabold tracking-widest text-cyan-300">
                  {breathPhase}
                </span>
                <span className="text-4xl font-black text-white font-mono my-1">
                  {breathSeconds}s
                </span>
                <span className="text-[10px] text-slate-400">Deep Diaphragmatic</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={() => setIsBreathingRunning(!isBreathingRunning)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition active:scale-95"
            >
              {isBreathingRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isBreathingRunning ? 'Pause Session' : 'Start 4-Min Breathing'}</span>
            </button>
            <button
              onClick={() => {
                setIsBreathingRunning(false);
                setBreathSeconds(4);
                setBreathPhase('Inhale');
              }}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mindful Mood & Gratitude Micro-Journal (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#121A26] border border-slate-800 flex flex-col justify-between space-y-4 shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">Mindset & Gratitude Check-in</h3>
              </div>
              <span className="text-xs text-slate-400">Mental Clarity</span>
            </div>

            {/* Mood selector */}
            <div className="space-y-2 mb-4">
              <label className="text-xs font-bold text-slate-300">How is your mental state right now?</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {['Energized', 'Calm & Focused', 'Mild Stress', 'Fatigued'].map((mood) => (
                  <button
                    key={mood}
                    onClick={() => setSelectedMood(mood)}
                    className={`py-2 px-2.5 rounded-xl font-semibold border transition text-center ${
                      selectedMood === mood
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            {/* Gratitude Prompt */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">One thing you appreciate about your body or day:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={gratitudeNote}
                  onChange={(e) => setGratitudeNote(e.target.value)}
                  placeholder="e.g. Grateful for strong legs during the squat session..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveGratitude()}
                />
                <button
                  onClick={handleSaveGratitude}
                  className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/30 transition shrink-0"
                >
                  Save
                </button>
              </div>
            </div>

            {/* Saved reflections history */}
            <div className="space-y-1.5 mt-4">
              <span className="text-[10px] uppercase font-bold text-slate-400">Recent Reflections:</span>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {savedReflections.map((ref, rIdx) => (
                  <div
                    key={rIdx}
                    className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 italic"
                  >
                    “{ref}”
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-400">
            VitalFlow mindfulness tools are designed for supportive daily wellness; not a substitute for clinical psychiatric care.
          </div>
        </div>
      </div>
    </div>
  );
};
