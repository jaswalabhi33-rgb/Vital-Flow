import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Droplet,
  Plus,
  Flame,
  Clock,
  Sparkles,
  Info,
  Check,
  ChevronDown,
  ChevronUp,
  Trash2,
  Tag,
  DollarSign,
  Apple,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MealItem } from '../../types';

export const NutritionView: React.FC = () => {
  const {
    meals,
    foodLogs,
    logFood,
    deleteFoodLog,
    waterMl,
    waterTargetMl,
    addWater,
    resetWater,
    userProfile,
  } = useApp();

  const [cuisineFilter, setCuisineFilter] = useState<'All' | 'Indian' | 'Global'>('All');
  const [selectedMealForDetails, setSelectedMealForDetails] = useState<MealItem | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Custom log modal state
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Breakfast');
  const [customCalories, setCustomCalories] = useState(350);
  const [customProtein, setCustomProtein] = useState(20);
  const [customCarbs, setCustomCarbs] = useState(40);
  const [customFat, setCustomFat] = useState(10);

  // Daily totals from logged foods
  const totalCaloriesLogged = foodLogs.reduce((acc, f) => acc + f.calories, 0);
  const totalProteinLogged = foodLogs.reduce((acc, f) => acc + f.proteinGrams, 0);
  const totalCarbsLogged = foodLogs.reduce((acc, f) => acc + f.carbsGrams, 0);
  const totalFatLogged = foodLogs.reduce((acc, f) => acc + f.fatGrams, 0);

  const calorieTarget = userProfile.calorieTarget || 2250;
  const proteinTarget = userProfile.proteinTarget || 135;
  const carbsTarget = userProfile.carbsTarget || 250;
  const fatsTarget = userProfile.fatsTarget || 65;

  const filteredMeals = meals.filter((m) => {
    if (cuisineFilter === 'Indian') return m.cuisine.toLowerCase().includes('indian');
    if (cuisineFilter === 'Global') return !m.cuisine.toLowerCase().includes('indian');
    return true;
  });

  const handleQuickLogMeal = (meal: MealItem) => {
    logFood({
      name: meal.name,
      category: meal.category,
      calories: meal.calories,
      proteinGrams: meal.proteinGrams,
      carbsGrams: meal.carbsGrams,
      fatGrams: meal.fatGrams,
    });
  };

  const handleCustomLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    logFood({
      name: customName,
      category: customCategory,
      calories: customCalories,
      proteinGrams: customProtein,
      carbsGrams: customCarbs,
      fatGrams: customFat,
    });
    setCustomName('');
    setIsLogModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <UtensilsCrossed className="w-6 h-6 text-emerald-400" />
              <span>AI Nutrition & Meal Planner</span>
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              Non-Restrictive
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Wholesome nourishment customized to your {userProfile.dietPreference} diet, cultural preferences, and energy recovery needs.
          </p>
        </div>

        <button
          onClick={() => setIsLogModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 transition"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Log Custom Food / Meal</span>
        </button>
      </div>

      {/* Daily Nutrition & Hydration Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Macros & Calorie Overview (8 cols) */}
        <div className="md:col-span-8 p-5 rounded-2xl bg-[#121A26] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Apple className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Daily Macronutrient Targets</h3>
            </div>
            <span className="text-[11px] text-slate-400">
              {foodLogs.length} logged items today
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Calories (optional tracking) */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400 font-medium">Calories</span>
                <Flame className="w-3.5 h-3.5 text-orange-400" />
              </div>
              <div className="text-lg font-black text-white">{totalCaloriesLogged}</div>
              <div className="text-[10px] text-slate-400">Target: ~{calorieTarget} kcal</div>
              <div className="w-full bg-slate-800 rounded-full h-1 mt-2">
                <div
                  className="bg-orange-500 h-1 rounded-full"
                  style={{ width: `${Math.min(100, (totalCaloriesLogged / calorieTarget) * 100)}%` }}
                />
              </div>
            </div>

            {/* Protein */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400 font-medium">Protein</span>
                <span className="text-emerald-400 font-bold text-xs">{totalProteinLogged}g</span>
              </div>
              <div className="text-lg font-black text-emerald-400">{totalProteinLogged}g</div>
              <div className="text-[10px] text-slate-400">Target: {proteinTarget}g</div>
              <div className="w-full bg-slate-800 rounded-full h-1 mt-2">
                <div
                  className="bg-emerald-500 h-1 rounded-full"
                  style={{ width: `${Math.min(100, (totalProteinLogged / proteinTarget) * 100)}%` }}
                />
              </div>
            </div>

            {/* Carbohydrates */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400 font-medium">Carbs</span>
                <span className="text-cyan-400 font-bold text-xs">{totalCarbsLogged}g</span>
              </div>
              <div className="text-lg font-black text-cyan-400">{totalCarbsLogged}g</div>
              <div className="text-[10px] text-slate-400">Target: {carbsTarget}g</div>
              <div className="w-full bg-slate-800 rounded-full h-1 mt-2">
                <div
                  className="bg-cyan-500 h-1 rounded-full"
                  style={{ width: `${Math.min(100, (totalCarbsLogged / carbsTarget) * 100)}%` }}
                />
              </div>
            </div>

            {/* Healthy Fats */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400 font-medium">Fats</span>
                <span className="text-amber-400 font-bold text-xs">{totalFatLogged}g</span>
              </div>
              <div className="text-lg font-black text-amber-400">{totalFatLogged}g</div>
              <div className="text-[10px] text-slate-400">Target: {fatsTarget}g</div>
              <div className="w-full bg-slate-800 rounded-full h-1 mt-2">
                <div
                  className="bg-amber-500 h-1 rounded-full"
                  style={{ width: `${Math.min(100, (totalFatLogged / fatsTarget) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Nutrition values are estimates to assist mindful nourishment; never intended as rigid medical prescription.</span>
          </div>
        </div>

        {/* Hydration Tracker Card (4 cols) */}
        <div className="md:col-span-4 p-5 rounded-2xl bg-gradient-to-br from-[#0F1B2A] to-[#121A26] border border-cyan-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Droplet className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Daily Water Intake</h3>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400">
                {Math.round((waterMl / waterTargetMl) * 100)}%
              </span>
            </div>

            <div className="my-2">
              <div className="text-2xl font-black text-white">
                {waterMl} <span className="text-xs text-slate-400 font-normal">/ {waterTargetMl} ml</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-teal-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (waterMl / waterTargetMl) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
            <button
              onClick={() => addWater(250)}
              className="flex-1 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-xs border border-cyan-500/30 transition flex items-center justify-center gap-1"
            >
              <Plus className="w-3 h-3" /> 250ml
            </button>
            <button
              onClick={() => addWater(500)}
              className="flex-1 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-xs border border-cyan-500/30 transition flex items-center justify-center gap-1"
            >
              <Plus className="w-3 h-3" /> 500ml
            </button>
            <button
              onClick={resetWater}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs transition"
              title="Reset Water"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Meals Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Personalized Meal Suggestions</h3>
            <span className="text-xs text-slate-400">({filteredMeals.length} recipes)</span>
          </div>

          {/* Cuisine Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            {(['All', 'Indian', 'Global'] as const).map((tag) => (
              <button
                key={tag}
                onClick={() => setCuisineFilter(tag)}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  cuisineFilter === tag
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white bg-slate-900'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Meals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMeals.map((meal) => (
            <div
              key={meal.id}
              className="p-5 rounded-2xl bg-[#121A26] border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {meal.category}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5 rounded-md bg-slate-800">
                      {meal.cuisine}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {meal.proteinGrams}g Protein
                  </span>
                </div>

                <h4 className="text-base font-bold text-white">{meal.name}</h4>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {meal.prepTimeMinutes} mins prep
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    ~{meal.calories} kcal
                  </span>
                  <span className="text-slate-400">Budget: {meal.approximateCost}</span>
                </div>

                {/* Ingredients snippet */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Key Ingredients:</span>
                  <p className="line-clamp-2">
                    {meal.ingredients.map((ing) => `${ing.portion} ${ing.name}`).join(', ')}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800">
                <button
                  onClick={() => setSelectedMealForDetails(meal)}
                  className="text-xs font-semibold text-emerald-400 hover:underline"
                >
                  View Full Recipe & Steps →
                </button>

                <button
                  onClick={() => handleQuickLogMeal(meal)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-bold text-xs transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log This Meal</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logged Meals List for Today */}
      <div className="p-5 rounded-2xl bg-[#121A26] border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white">Today's Food Log History</h3>
        {foodLogs.length === 0 ? (
          <p className="text-xs text-slate-400 py-3">No foods logged today yet.</p>
        ) : (
          <div className="space-y-2">
            {foodLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">{log.name}</span>
                    <span className="text-[10px] text-slate-400">({log.category} • {log.time})</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-3 mt-0.5">
                    <span>{log.calories} kcal</span>
                    <span>Protein: <strong className="text-emerald-400">{log.proteinGrams}g</strong></span>
                    <span>Carbs: {log.carbsGrams}g</span>
                    <span>Fat: {log.fatGrams}g</span>
                  </div>
                </div>

                <button
                  onClick={() => deleteFoodLog(log.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 transition"
                  title="Remove log"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Meal Recipe & Steps Modal */}
      {selectedMealForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400">
                  {selectedMealForDetails.category} • {selectedMealForDetails.cuisine}
                </span>
                <h3 className="text-lg font-bold text-white">{selectedMealForDetails.name}</h3>
              </div>
              <button
                onClick={() => setSelectedMealForDetails(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-400">Calories</span>
                <p className="font-bold text-white">~{selectedMealForDetails.calories} kcal</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Protein</span>
                <p className="font-bold text-emerald-400">{selectedMealForDetails.proteinGrams}g</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Carbs</span>
                <p className="font-bold text-cyan-400">{selectedMealForDetails.carbsGrams}g</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Fats</span>
                <p className="font-bold text-amber-400">{selectedMealForDetails.fatGrams}g</p>
              </div>
            </div>

            {/* Ingredients */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                Ingredients & Portions
              </h4>
              <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                {selectedMealForDetails.ingredients.map((ing, i) => (
                  <li key={i}>
                    <strong>{ing.portion}:</strong> {ing.name}
                  </li>
                ))}
              </ul>
            </div>

            {/* Cooking steps */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                Preparation Steps ({selectedMealForDetails.prepTimeMinutes} mins)
              </h4>
              <ol className="space-y-2 list-decimal list-inside text-slate-300">
                {selectedMealForDetails.instructions.map((step, sIdx) => (
                  <li key={sIdx} className="leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Substitutions */}
            {selectedMealForDetails.substitutions.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="font-bold text-slate-200 block text-[11px]">Substitutions:</span>
                <ul className="list-disc list-inside text-[11px] text-slate-400">
                  {selectedMealForDetails.substitutions.map((sub, subIdx) => (
                    <li key={subIdx}>{sub}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedMealForDetails(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleQuickLogMeal(selectedMealForDetails);
                  setSelectedMealForDetails(null);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
              >
                Log This Meal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Meal Log Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Log Custom Meal / Food</h3>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCustomLogSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Meal / Food Name</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Scrambled Eggs with Sourdough Toast"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Meal Category</label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    value={customCalories}
                    onChange={(e) => setCustomCalories(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={customProtein}
                    onChange={(e) => setCustomProtein(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    value={customCarbs}
                    onChange={(e) => setCustomCarbs(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Fats (g)</label>
                  <input
                    type="number"
                    value={customFat}
                    onChange={(e) => setCustomFat(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  Save Food Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
