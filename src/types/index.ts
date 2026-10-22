export type UnitSystem = 'metric' | 'imperial';

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type TrainingLocation = 'Gym' | 'Home' | 'Outdoors' | 'Mixed';

export type DietType = 'Vegetarian' | 'Vegan' | 'Eggetarian' | 'Non-Vegetarian' | 'Flexitarian' | 'Pescatarian';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  unitSystem: UnitSystem;
  heightCm: number;
  weightKg: number;
  country: string;
  goals: string[];
  experienceLevel: ExperienceLevel;
  trainingStyle: string;
  location: TrainingLocation;
  equipment: string[];
  daysPerWeek: number;
  preferredDuration: number; // minutes
  enjoyedExercises: string[];
  avoidedExercises: string[];
  dietPreference: DietType;
  cuisinePreference: string;
  allergies: string[];
  likedFoods: string[];
  dislikedFoods: string[];
  cookingTimeMinutes: number;
  budgetPreference: 'Budget-Friendly' | 'Moderate' | 'Premium';
  trackCalories: boolean;
  calorieTarget?: number;
  proteinTarget?: number; // grams
  carbsTarget?: number;
  fatsTarget?: number;
  sleepAvgHours: number;
  energyLevel: 'Low' | 'Moderate' | 'High' | 'Peak';
  dailyActivityLevel: 'Sedentary' | 'Lightly Active' | 'Moderately Active' | 'Very Active';
  stressLevel: 'Low' | 'Moderate' | 'Elevated' | 'High';
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface ExerciseItem {
  id: string;
  name: string;
  sets: number;
  reps: string;
  restSeconds: number;
  targetMuscle: string;
  instruction: string;
  substitution: string;
  equipment: string;
  videoPlaceholder?: string;
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  category: 'Strength' | 'Hypertrophy' | 'Cardio' | 'Mobility' | 'Bodyweight' | 'Active Recovery';
  goal: string;
  durationMinutes: number;
  difficulty: ExperienceLevel;
  targetMuscles: string[];
  equipmentNeeded: string[];
  warmup: { exercise: string; duration: string; notes: string }[];
  exercises: ExerciseItem[];
  cooldown: { exercise: string; duration: string; notes: string }[];
  safetyNotes: string[];
  caloriesEstimate: number;
  isTodayRecommended?: boolean;
}

export interface WorkoutLog {
  id: string;
  workoutId: string;
  title: string;
  completedAt: string;
  durationMinutes: number;
  perceivedEffort: number; // 1-10 RPE
  notes?: string;
  exercisesCompleted: {
    exerciseName: string;
    setsCompleted: { setNumber: number; weight: number; reps: number; completed: boolean }[];
  }[];
  caloriesBurnedEstimate: number;
}

export interface MealItem {
  id: string;
  name: string;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  cuisine: string; // Indian, Mediterranean, Asian, Western, etc.
  dietType: DietType;
  prepTimeMinutes: number;
  approximateCost: 'Low' | 'Moderate' | 'High';
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  ingredients: { name: string; portion: string }[];
  instructions: string[];
  substitutions: string[];
  imagePlaceholder?: string;
}

export interface FoodLogEntry {
  id: string;
  name: string;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  time: string;
  date: string;
}

export interface SleepRecord {
  id: string;
  date: string; // YYYY-MM-DD
  bedtime: string; // e.g. "23:15"
  wakeTime: string; // e.g. "07:00"
  durationHours: number;
  qualityRating: number; // 1-5
  notes?: string;
  windDownChecklistCompleted: boolean;
}

export interface RecoveryLog {
  id: string;
  date: string;
  fatigueLevel: number; // 1-10
  energyLevel: number; // 1-10
  sorenessAreas: string[];
  perceivedRecoveryScore: number; // 1-100
  notes?: string;
}

export interface Habit {
  id: string;
  title: string;
  category: 'Hydration' | 'Movement' | 'Nutrition' | 'Sleep' | 'Mindfulness';
  targetFrequency: string; // e.g. "Daily"
  targetValue?: string;
  streakCount: number;
  bestStreak: number;
  completedDates: string[]; // YYYY-MM-DD
  icon: string;
  color: string;
}

export interface DailyScheduleTask {
  id: string;
  title: string;
  timeSlot: string;
  type: 'mobility' | 'workout' | 'nutrition' | 'mindfulness' | 'sleep';
  description: string;
  completed: boolean;
  skipped: boolean;
  recommendedDuration: string;
}

export interface AdaptationRecommendation {
  id: string;
  date: string;
  recommendationTitle: string;
  reason: string;
  informedBy: string[];
  suggestedAction: string;
  modifiedSchedule?: string;
  recoveryAdvice?: string;
  userApprovalRequired: boolean;
  status: 'pending' | 'accepted' | 'dismissed';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'workout' | 'hydration' | 'recovery' | 'coach' | 'milestone';
  read: boolean;
  actionUrl?: string;
}

export interface MilestoneBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  category: 'Consistency' | 'Strength' | 'Habits' | 'Recovery';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  category?: 'fitness' | 'nutrition' | 'recovery' | 'general';
  suggestedAction?: {
    type: 'start_workout' | 'view_meal' | 'review_adaptation' | 'log_water';
    label: string;
    payload?: any;
  };
}
