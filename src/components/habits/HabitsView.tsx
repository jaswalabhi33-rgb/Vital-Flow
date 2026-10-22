import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Flame,
  Droplet,
  Dumbbell,
  Moon,
  HeartPulse,
  Apple,
  Trash2,
  Calendar,
  Sparkles,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Habit } from '../../types';

export const HabitsView: React.FC = () => {
  const { habits, toggleHabit, addHabit, deleteHabit } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<Habit['category']>('Movement');
  const [newTargetVal, setNewTargetVal] = useState('30 mins');
  const [newColor, setNewColor] = useState('#10B981');

  // Days of current week for adherence dots
  const getPast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  };

  const past7Days = getPast7Days();
  const todayStr = new Date().toISOString().split('T')[0];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addHabit({
      title: newTitle.trim(),
      category: newCategory,
      targetFrequency: 'Daily',
      targetValue: newTargetVal,
      color: newColor,
    });
    setNewTitle('');
    setIsAddModalOpen(false);
  };

  const getCategoryIcon = (cat: Habit['category']) => {
    switch (cat) {
      case 'Hydration':
        return <Droplet className="w-4 h-4 text-cyan-400" />;
      case 'Movement':
        return <Dumbbell className="w-4 h-4 text-emerald-400" />;
      case 'Sleep':
        return <Moon className="w-4 h-4 text-violet-400" />;
      case 'Mindfulness':
        return <HeartPulse className="w-4 h-4 text-pink-400" />;
      case 'Nutrition':
        return <Apple className="w-4 h-4 text-amber-400" />;
      default:
        return <CheckSquare className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <CheckSquare className="w-6 h-6 text-emerald-400" />
              <span>Habits & Daily Routines</span>
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              Sustainable Rhythm
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Build resilience through incremental consistency. If you miss a day, simply restart tomorrow—progress over perfection.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Habit</span>
        </button>
      </div>

      {/* Habits List */}
      <div className="space-y-3">
        {habits.map((habit) => {
          const isDoneToday = habit.completedDates.includes(todayStr);
          return (
            <div
              key={habit.id}
              className={`p-5 rounded-2xl border transition-all ${
                isDoneToday
                  ? 'bg-gradient-to-r from-slate-900/90 to-[#121A26] border-emerald-500/30'
                  : 'bg-[#121A26] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left details */}
                <div className="flex items-start gap-3.5">
                  <div
                    onClick={() => toggleHabit(habit.id)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition shrink-0 ${
                      isDoneToday
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {getCategoryIcon(habit.category)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-bold ${isDoneToday ? 'text-white' : 'text-slate-200'}`}>
                        {habit.title}
                      </h4>
                      {habit.targetValue && (
                        <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded-md bg-slate-800">
                          {habit.targetValue}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1 font-semibold text-emerald-400">
                        <Flame className="w-3.5 h-3.5 fill-emerald-400/20" />
                        {habit.streakCount} day streak
                      </span>
                      <span>•</span>
                      <span>Best: {habit.bestStreak} days</span>
                      <span>•</span>
                      <span>{habit.targetFrequency}</span>
                    </div>
                  </div>
                </div>

                {/* Right: 7-day adherence dots + delete */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <div className="flex items-center gap-1.5">
                    {past7Days.map((dateStr) => {
                      const completed = habit.completedDates.includes(dateStr);
                      const isToday = dateStr === todayStr;
                      const dayLetter = new Date(dateStr).toLocaleDateString([], { weekday: 'narrow' });
                      return (
                        <button
                          key={dateStr}
                          onClick={() => toggleHabit(habit.id, dateStr)}
                          title={`${dateStr} ${completed ? 'Completed' : 'Not completed'}`}
                          className={`w-7 h-8 rounded-lg flex flex-col items-center justify-center text-[10px] font-bold transition ${
                            completed
                              ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                              : 'bg-slate-800/80 border border-slate-700/60 text-slate-400 hover:bg-slate-700'
                          } ${isToday ? 'ring-1 ring-emerald-400' : ''}`}
                        >
                          <span className="text-[8px] text-slate-400 font-normal">{dayLetter}</span>
                          <span>{completed ? '✓' : '•'}</span>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="p-2 text-slate-400 hover:text-rose-400 transition ml-2"
                    title="Delete Habit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Non-judgmental Philosophy Card */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-400">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>VitalFlow Consistency Philosophy:</strong> Missing a habit on high-stress or travel days is a normal part of life. We never penalize or shame you. What matters is the velocity of returning to your rhythm.
        </p>
      </div>

      {/* Add Custom Habit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-2xl relative space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add New Habit</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Habit Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 10,000 Daily Steps, 10m Morning Mobility"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value="Movement">Movement & Exercise</option>
                  <option value="Hydration">Hydration</option>
                  <option value="Nutrition">Nutrition</option>
                  <option value="Sleep">Sleep & Wind-down</option>
                  <option value="Mindfulness">Mindfulness & Mental Health</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Target Value / Benchmark</label>
                <input
                  type="text"
                  value={newTargetVal}
                  onChange={(e) => setNewTargetVal(e.target.value)}
                  placeholder="e.g. 2,500ml, 15 mins, By 11:00 PM"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  Create Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
