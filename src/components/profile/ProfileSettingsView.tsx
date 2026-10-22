import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Settings,
  Scale,
  Bell,
  Trash2,
  RotateCcw,
  Download,
  AlertTriangle,
  Check,
  Sparkles,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProfileSettingsView: React.FC = () => {
  const {
    userProfile,
    updateProfile,
    resetToDemoData,
    resetToNewUser,
    workoutLogs,
    sleepRecords,
  } = useApp();

  const [name, setName] = useState(userProfile.name);
  const [age, setAge] = useState(userProfile.age);
  const [heightCm, setHeightCm] = useState(userProfile.heightCm);
  const [weightKg, setWeightKg] = useState(userProfile.weightKg);
  const [unitSystem, setUnitSystem] = useState(userProfile.unitSystem);
  const [dietPreference, setDietPreference] = useState(userProfile.dietPreference);
  const [cuisinePreference, setCuisinePreference] = useState(userProfile.cuisinePreference);
  const [daysPerWeek, setDaysPerWeek] = useState(userProfile.daysPerWeek);
  const [preferredDuration, setPreferredDuration] = useState(userProfile.preferredDuration);
  const [trackCalories, setTrackCalories] = useState(userProfile.trackCalories);
  const [isSavedToast, setIsSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      age,
      heightCm,
      weightKg,
      unitSystem,
      dietPreference,
      cuisinePreference,
      daysPerWeek,
      preferredDuration,
      trackCalories,
    });
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  const handleExport = () => {
    const exportObject = {
      userProfile,
      workoutLogs,
      sleepRecords,
      exportedAt: new Date().toISOString(),
      app: 'VitalFlow AI',
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObject, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `vitalflow_profile_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <User className="w-6 h-6 text-emerald-400" />
              <span>Profile, Goals & Settings</span>
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              Personalized
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Update your baseline metrics, diet boundaries, and equipment preferences to calibrate Flow Coach recommendations.
          </p>
        </div>

        {isSavedToast && (
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Details */}
        <div className="p-6 rounded-2xl bg-[#121A26] border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            1. Personal & Physical Dimensions
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-300 block mb-1">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-400"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value, 10) || 18)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-400"
                min="16"
                max="100"
                required
              />
            </div>

            {/* Units Toggle */}
            <div className="sm:col-span-2 flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div>
                <span className="font-bold text-slate-200 block text-xs">Measurement Units</span>
                <span className="text-[11px] text-slate-400">Controls height, weight, and workout load formatting</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setUnitSystem('metric')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    unitSystem === 'metric'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Metric (kg / cm)
                </button>
                <button
                  type="button"
                  onClick={() => setUnitSystem('imperial')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    unitSystem === 'imperial'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Imperial (lbs / in)
                </button>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">
                Height ({unitSystem === 'metric' ? 'cm' : 'inches'})
              </label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(parseFloat(e.target.value) || 170)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">
                Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})
              </label>
              <input
                type="number"
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(parseFloat(e.target.value) || 70)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>
        </div>

        {/* Training & Equipment */}
        <div className="p-6 rounded-2xl bg-[#121A26] border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            2. Training Cadence & Equipment
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-300 block mb-1">Target Training Days / Week</label>
              <select
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(parseInt(e.target.value, 10))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-400"
              >
                <option value={2}>2 Days / Week (Light)</option>
                <option value={3}>3 Days / Week (Balanced)</option>
                <option value={4}>4 Days / Week (Optimal Hybrid)</option>
                <option value={5}>5 Days / Week (High Frequency)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Preferred Session Duration</label>
              <select
                value={preferredDuration}
                onChange={(e) => setPreferredDuration(parseInt(e.target.value, 10))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-400"
              >
                <option value={20}>20 Minutes (Express)</option>
                <option value={30}>30 Minutes</option>
                <option value={40}>40 Minutes (Standard)</option>
                <option value={50}>50 Minutes</option>
                <option value={60}>60 Minutes (Full Volume)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-300 block mb-1">Available Equipment</label>
              <p className="text-xs text-slate-300 p-3 rounded-xl bg-slate-900 border border-slate-800">
                {userProfile.equipment.join(', ')}
              </p>
            </div>
          </div>
        </div>

        {/* Nutrition & Cuisine Preferences */}
        <div className="p-6 rounded-2xl bg-[#121A26] border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            3. Nutrition & Dietary Style
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-300 block mb-1">Diet Style</label>
              <select
                value={dietPreference}
                onChange={(e) => setDietPreference(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Eggetarian">Eggetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Flexitarian">Flexitarian</option>
                <option value="Pescatarian">Pescatarian</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Cuisine Preference</label>
              <input
                type="text"
                value={cuisinePreference}
                onChange={(e) => setCuisinePreference(e.target.value)}
                placeholder="e.g. Indian, Mediterranean, Asian"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="sm:col-span-2 flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div>
                <span className="font-bold text-slate-200 block text-xs">Calorie Tracking</span>
                <span className="text-[11px] text-slate-400">
                  Optional. If disabled, focus solely on macronutrient balance and wholesome energy.
                </span>
              </div>
              <input
                type="checkbox"
                checked={trackCalories}
                onChange={(e) => setTrackCalories(e.target.checked)}
                className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-sm shadow-md transition active:scale-95"
          >
            Save Profile Preferences
          </button>
        </div>
      </form>

      {/* Health Safety & Responsible AI Card */}
      <div className="p-6 rounded-2xl bg-[#121A26] border border-amber-500/30 space-y-3 text-xs">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <span>Health Safety & Responsible AI Commitment</span>
        </div>
        <p className="text-slate-300 leading-relaxed">
          VitalFlow AI is a supportive fitness and wellness companion—<strong>not a diagnostic medical device or clinical treatment service</strong>.
        </p>
        <ul className="list-disc list-inside space-y-1.5 text-slate-400 text-[11px]">
          <li>If you experience sharp chest pain, shortness of breath, dizziness, or joint instability, immediately stop exercise and seek emergency medical care.</li>
          <li>Nutrition values, calorie calculations, and adaptive workout adjustments are estimates designed for general guidance.</li>
          <li>We never fabricate wearable biometric data or claim real-time continuous sensor readings unless authorized physical hardware is connected.</li>
          <li>Your personal logs remain private and stored in your browser session. You retain full ownership to export or delete your profile anytime.</li>
        </ul>
      </div>

      {/* Demo Controls & Data Management */}
      <div className="p-6 rounded-2xl bg-[#121A26] border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Data Management & Demo Sandbox
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={handleExport}
            className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-left transition flex items-center gap-3"
          >
            <Download className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="text-xs font-bold text-white block">Export JSON Data</span>
              <span className="text-[10px] text-slate-400">Download complete logs</span>
            </div>
          </button>

          <button
            onClick={resetToDemoData}
            className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-left transition flex items-center gap-3"
          >
            <RotateCcw className="w-5 h-5 text-cyan-400" />
            <div>
              <span className="text-xs font-bold text-white block">Reset to Demo Profile</span>
              <span className="text-[10px] text-slate-400">Restore rich sample data</span>
            </div>
          </button>

          <button
            onClick={resetToNewUser}
            className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-rose-950/30 hover:border-rose-500/30 text-left transition flex items-center gap-3"
          >
            <Trash2 className="w-5 h-5 text-rose-400" />
            <div>
              <span className="text-xs font-bold text-rose-300 block">Clear & Restart Onboarding</span>
              <span className="text-[10px] text-slate-400">Start fresh from Step 1</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
