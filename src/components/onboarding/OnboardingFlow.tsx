import React, { useState } from 'react';
import {
  Zap,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Dumbbell,
  UtensilsCrossed,
  Moon,
  HeartPulse,
  Clock,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserProfile, ExperienceLevel, TrainingLocation, DietType } from '../../types';

export const OnboardingFlow: React.FC = () => {
  const { userProfile, updateProfile, resetToDemoData } = useApp();

  const [step, setStep] = useState(1);

  // Form State
  const [name, setName] = useState(userProfile.name || '');
  const [age, setAge] = useState(userProfile.age || 26);
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [heightCm, setHeightCm] = useState(userProfile.heightCm || 175);
  const [weightKg, setWeightKg] = useState(userProfile.weightKg || 70);
  const [country, setCountry] = useState(userProfile.country || 'United States');

  // Goals
  const allGoals = [
    'Build muscle',
    'Improve strength',
    'Improve cardiovascular endurance',
    'Lose weight safely',
    'Improve general fitness',
    'Improve flexibility and mobility',
    'Improve sleep quality',
    'Manage everyday stress',
    'Build consistent healthy habits',
    'Improve sports performance',
  ];
  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    userProfile.goals.length ? userProfile.goals : ['Build muscle', 'Improve cardiovascular endurance', 'Manage everyday stress']
  );

  // Experience
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(userProfile.experienceLevel || 'Intermediate');
  const [location, setLocation] = useState<TrainingLocation>(userProfile.location || 'Mixed');
  const allEquipment = ['Dumbbells', 'Pull-up Bar', 'Resistance Bands', 'Kettlebell', 'Yoga Mat', 'Barbell & Rack', 'Cardio Machine'];
  const [equipment, setEquipment] = useState<string[]>(userProfile.equipment || ['Dumbbells', 'Resistance Bands', 'Yoga Mat']);
  const [daysPerWeek, setDaysPerWeek] = useState(userProfile.daysPerWeek || 4);
  const [preferredDuration, setPreferredDuration] = useState(userProfile.preferredDuration || 40);

  // Nutrition
  const [dietPreference, setDietPreference] = useState<DietType>(userProfile.dietPreference || 'Vegetarian');
  const [cuisinePreference, setCuisinePreference] = useState(userProfile.cuisinePreference || 'Indian & Mediterranean');
  const [allergies, setAllergies] = useState<string[]>(userProfile.allergies || []);
  const [cookingTime, setCookingTime] = useState(userProfile.cookingTimeMinutes || 25);
  const [budget, setBudget] = useState<'Budget-Friendly' | 'Moderate' | 'Premium'>(userProfile.budgetPreference || 'Moderate');

  // Recovery & Lifestyle
  const [sleepAvg, setSleepAvg] = useState(userProfile.sleepAvgHours || 7.5);
  const [energyLevel, setEnergyLevel] = useState<'Low' | 'Moderate' | 'High' | 'Peak'>(userProfile.energyLevel || 'Moderate');
  const [activityLevel, setActivityLevel] = useState<'Sedentary' | 'Lightly Active' | 'Moderately Active' | 'Very Active'>(userProfile.dailyActivityLevel || 'Moderately Active');
  const [stressLevel, setStressLevel] = useState<'Low' | 'Moderate' | 'Elevated' | 'High'>(userProfile.stressLevel || 'Moderate');

  const toggleGoal = (g: string) => {
    setSelectedGoals((prev) =>
      prev.includes(g) ? prev.filter((item) => item !== g) : [...prev, g]
    );
  };

  const toggleEquipment = (eq: string) => {
    setEquipment((prev) =>
      prev.includes(eq) ? prev.filter((item) => item !== eq) : [...prev, eq]
    );
  };

  const handleCompleteOnboarding = () => {
    updateProfile({
      name: name || 'Friend',
      age,
      unitSystem,
      heightCm,
      weightKg,
      country,
      goals: selectedGoals,
      experienceLevel,
      location,
      equipment,
      daysPerWeek,
      preferredDuration,
      dietPreference,
      cuisinePreference,
      allergies,
      cookingTimeMinutes: cookingTime,
      budgetPreference: budget,
      sleepAvgHours: sleepAvg,
      energyLevel,
      dailyActivityLevel: activityLevel,
      stressLevel,
      onboardingCompleted: true,
    });
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] flex flex-col items-center justify-center p-4 sm:p-6 text-slate-100">
      <div className="w-full max-w-2xl bg-[#0F172A] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Step Progress Indicator */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-sm">
              <Zap className="w-4 h-4 fill-slate-950" />
            </div>
            <div>
              <span className="text-xs font-bold text-white tracking-tight">VitalFlow AI</span>
              <span className="text-[10px] text-slate-400 block">Personalized Setup</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
            <span>Step {step} of 7</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${(step / 7) * 100}%` }}
          />
        </div>

        {/* STEP 1: Welcome */}
        {step === 1 && (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/10">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Welcome to VitalFlow AI
              </h2>
              <p className="text-sm font-semibold text-emerald-400">
                “Your body changes. Your plan should too.”
              </p>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                An adaptive fitness, nutrition, and recovery companion that responds to your daily soreness, sleep, and lifestyle constraints.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-lg mx-auto text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <Dumbbell className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white block">Smart Workouts</span>
                <span className="text-[11px] text-slate-400">Calibrated to your gear & energy.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <UtensilsCrossed className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white block">AI Nutrition</span>
                <span className="text-[11px] text-slate-400">Indian & Global wholesome meals.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <Moon className="w-4 h-4 text-violet-400" />
                <span className="font-bold text-white block">Deep Recovery</span>
                <span className="text-[11px] text-slate-400">Sleep, breathwork & joint care.</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={() => setStep(2)}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Build My Wellness Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={resetToDemoData}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition"
              >
                Explore Demo Mode (Alex Morgan)
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Profile */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white">Tell us about yourself</h3>
              <p className="text-xs text-slate-400">We use this to calculate energy baselines and safe volume.</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Your Name or Preferred Handle</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value, 10) || 18)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-400"
                    min="16"
                    max="100"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Country / Region</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Units */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-bold text-slate-300">Measurement System</span>
                <div className="flex gap-1 bg-slate-800 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setUnitSystem('metric')}
                    className={`px-3 py-1 rounded text-xs font-bold ${
                      unitSystem === 'metric' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
                    }`}
                  >
                    Metric (kg/cm)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnitSystem('imperial')}
                    className={`px-3 py-1 rounded text-xs font-bold ${
                      unitSystem === 'imperial' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
                    }`}
                  >
                    Imperial (lbs/in)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">
                    Height ({unitSystem === 'metric' ? 'cm' : 'in'})
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
          </div>
        )}

        {/* STEP 3: Goals */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white">What are your primary goals?</h3>
              <p className="text-xs text-slate-400">Select all that apply. VitalFlow balances multiple goals simultaneously.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {allGoals.map((g) => {
                const isSelected = selectedGoals.includes(g);
                return (
                  <button
                    key={g}
                    onClick={() => toggleGoal(g)}
                    className={`p-3 rounded-xl border text-left font-semibold transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span>{g}</span>
                    {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Experience & Training */}
        {step === 4 && (
          <div className="space-y-4 text-xs">
            <div>
              <h3 className="text-lg font-bold text-white">Fitness experience & equipment</h3>
              <p className="text-xs text-slate-400">Tell us how and where you train.</p>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Experience Level</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setExperienceLevel(lvl)}
                    className={`py-2 rounded-xl font-bold border transition ${
                      experienceLevel === lvl
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Days Available / Week</label>
                <select
                  value={daysPerWeek}
                  onChange={(e) => setDaysPerWeek(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value={2}>2 Days / Week</option>
                  <option value={3}>3 Days / Week</option>
                  <option value={4}>4 Days / Week (Recommended)</option>
                  <option value={5}>5 Days / Week</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Session Duration</label>
                <select
                  value={preferredDuration}
                  onChange={(e) => setPreferredDuration(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value={20}>20 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={40}>40 Minutes</option>
                  <option value={50}>50 Minutes</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Available Equipment</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {allEquipment.map((eq) => {
                  const hasEq = equipment.includes(eq);
                  return (
                    <button
                      key={eq}
                      type="button"
                      onClick={() => toggleEquipment(eq)}
                      className={`p-2.5 rounded-xl border text-left font-semibold transition flex items-center justify-between ${
                        hasEq
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span>{eq}</span>
                      {hasEq && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Nutrition Preferences */}
        {step === 5 && (
          <div className="space-y-4 text-xs">
            <div>
              <h3 className="text-lg font-bold text-white">Nutrition Preferences</h3>
              <p className="text-xs text-slate-400">Non-restrictive nourishment adapted to your palate.</p>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Diet Style</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(['Vegetarian', 'Vegan', 'Eggetarian', 'Non-Vegetarian', 'Flexitarian', 'Pescatarian'] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDietPreference(d)}
                    className={`py-2 px-3 rounded-xl font-bold border transition text-center ${
                      dietPreference === d
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Regional Cuisine Preference</label>
              <input
                type="text"
                value={cuisinePreference}
                onChange={(e) => setCuisinePreference(e.target.value)}
                placeholder="e.g. Indian (Dal, Roti, Paneer), Mediterranean, Asian Fusion"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Cooking Time</label>
                <select
                  value={cookingTime}
                  onChange={(e) => setCookingTime(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value={15}>Under 15 mins (Quick)</option>
                  <option value={25}>20-25 mins (Standard)</option>
                  <option value={40}>35-45 mins (Gourmet)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Approximate Budget</label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value="Budget-Friendly">Budget-Friendly</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Recovery and Lifestyle */}
        {step === 6 && (
          <div className="space-y-4 text-xs">
            <div>
              <h3 className="text-lg font-bold text-white">Sleep & Recovery Profile</h3>
              <p className="text-xs text-slate-400">Recovery dictates how your workout intensity is scheduled.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Typical Sleep Duration</label>
                <input
                  type="number"
                  step="0.5"
                  value={sleepAvg}
                  onChange={(e) => setSleepAvg(parseFloat(e.target.value) || 7)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                  min="4"
                  max="12"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">General Energy Level</label>
                <select
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                  <option value="Peak">Peak</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Daily Activity Level</label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value="Sedentary">Sedentary (Desk Job)</option>
                  <option value="Lightly Active">Lightly Active (Some walking)</option>
                  <option value="Moderately Active">Moderately Active</option>
                  <option value="Very Active">Very Active</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Stress Self-Assessment</label>
                <select
                  value={stressLevel}
                  onChange={(e) => setStressLevel(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value="Low">Low Stress</option>
                  <option value="Moderate">Moderate Stress</option>
                  <option value="Elevated">Elevated</option>
                  <option value="High">High Stress</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: Personalized Plan Summary */}
        {step === 7 && (
          <div className="space-y-5 py-2">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white">Your Adaptive Plan Is Ready!</h3>
              <p className="text-xs text-slate-400">
                Tailored for {name || 'you'} • {experienceLevel} • {dietPreference} Diet
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="font-bold text-emerald-400 block uppercase tracking-wider text-[10px]">
                  Weekly Cadence
                </span>
                <p className="text-slate-200 font-semibold">{daysPerWeek} training sessions / week</p>
                <span className="text-[11px] text-slate-400">~{preferredDuration} mins per session with available gear.</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="font-bold text-cyan-400 block uppercase tracking-wider text-[10px]">
                  Nutrition Approach
                </span>
                <p className="text-slate-200 font-semibold">{dietPreference} • {cuisinePreference}</p>
                <span className="text-[11px] text-slate-400">Balanced protein targets without restrictive dieting.</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="font-bold text-violet-400 block uppercase tracking-wider text-[10px]">
                  Recovery Priority
                </span>
                <p className="text-slate-200 font-semibold">Sleep ~{sleepAvg}h & Guided Breathwork</p>
                <span className="text-[11px] text-slate-400">Dynamic de-load when soreness signals elevate.</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="font-bold text-amber-400 block uppercase tracking-wider text-[10px]">
                  First Recommended Action
                </span>
                <p className="text-slate-200 font-semibold">Launch Today's Full Body Session</p>
                <span className="text-[11px] text-slate-400">Explore the interactive live set tracker.</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>You can modify your profile and constraints anytime in Settings. Your data is stored securely in your browser.</span>
            </div>

            <button
              onClick={handleCompleteOnboarding}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/25 transition active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Enter VitalFlow AI Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Buttons (Steps 2 - 6) */}
        {step > 1 && step < 7 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              onClick={() => setStep((s) => s + 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-md shadow-emerald-500/20 active:scale-95"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
