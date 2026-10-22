import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  WorkoutRoutine,
  WorkoutLog,
  MealItem,
  FoodLogEntry,
  SleepRecord,
  RecoveryLog,
  Habit,
  DailyScheduleTask,
  AdaptationRecommendation,
  MilestoneBadge,
  AppNotification,
  ChatMessage,
} from '../types';
import {
  INITIAL_PROFILE,
  INITIAL_WORKOUTS,
  INITIAL_WORKOUT_LOGS,
  INITIAL_MEALS,
  INITIAL_FOOD_LOGS,
  INITIAL_HABITS,
  INITIAL_SCHEDULE,
  INITIAL_SLEEP_RECORDS,
  INITIAL_RECOVERY_LOG,
  INITIAL_ADAPTATION,
  INITIAL_BADGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_CHAT_MESSAGES,
} from '../data/initialData';

interface WellnessScoreInfo {
  score: number;
  breakdown: {
    movement: number;
    sleep: number;
    recovery: number;
    habits: number;
  };
  trend: string;
  suggestion: string;
}

interface AppContextType {
  userProfile: UserProfile;
  workouts: WorkoutRoutine[];
  workoutLogs: WorkoutLog[];
  meals: MealItem[];
  foodLogs: FoodLogEntry[];
  waterMl: number;
  waterTargetMl: number;
  sleepRecords: SleepRecord[];
  recoveryLog: RecoveryLog;
  habits: Habit[];
  scheduleTasks: DailyScheduleTask[];
  adaptation: AdaptationRecommendation | null;
  badges: MilestoneBadge[];
  notifications: AppNotification[];
  chatMessages: ChatMessage[];
  isChatLoading: boolean;

  // Navigation & Modals
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLiveWorkoutOpen: boolean;
  activeWorkout: WorkoutRoutine | null;
  startLiveWorkout: (workout: WorkoutRoutine) => void;
  closeLiveWorkout: () => void;
  finishLiveWorkout: (logData: {
    durationMinutes: number;
    perceivedEffort: number;
    notes?: string;
    exercisesCompleted: {
      exerciseName: string;
      setsCompleted: { setNumber: number; weight: number; reps: number; completed: boolean }[];
    }[];
    caloriesBurnedEstimate: number;
  }) => void;

  isFlowCoachOpen: boolean;
  setIsFlowCoachOpen: (open: boolean) => void;
  isAdaptiveModalOpen: boolean;
  setIsAdaptiveModalOpen: (open: boolean) => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;

  // Actions
  addWater: (amountMl: number) => void;
  resetWater: () => void;
  toggleScheduleTask: (taskId: string) => void;
  toggleHabit: (habitId: string, dateStr?: string) => void;
  addHabit: (habitData: { title: string; category: Habit['category']; targetFrequency: string; targetValue?: string; color?: string }) => void;
  deleteHabit: (id: string) => void;
  logFood: (entry: Omit<FoodLogEntry, 'id' | 'date' | 'time'>) => void;
  deleteFoodLog: (id: string) => void;
  logSleep: (record: Omit<SleepRecord, 'id'>) => void;
  logRecovery: (log: Omit<RecoveryLog, 'id'>) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  acceptAdaptation: (id: string) => void;
  dismissAdaptation: (id: string) => void;
  requestCustomAdaptation: (params: { reason: string; energyLevel: number; sorenessLevel: number }) => Promise<void>;
  sendChatMessage: (content: string, category?: 'fitness' | 'nutrition' | 'recovery' | 'general') => Promise<void>;
  generateAiWorkout: (params: { targetGoal: string; durationMinutes: number; sorenessAreas?: string }) => Promise<WorkoutRoutine | null>;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  resetToDemoData: () => void;
  resetToNewUser: () => void;
  calculateWellnessScore: () => WellnessScoreInfo;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'vitalflow_data_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial from localStorage if available
  const [dataLoaded, setDataLoaded] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [workouts, setWorkouts] = useState<WorkoutRoutine[]>(INITIAL_WORKOUTS);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>(INITIAL_WORKOUT_LOGS);
  const [meals, setMeals] = useState<MealItem[]>(INITIAL_MEALS);
  const [foodLogs, setFoodLogs] = useState<FoodLogEntry[]>(INITIAL_FOOD_LOGS);
  const [waterMl, setWaterMl] = useState<number>(1750);
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>(INITIAL_SLEEP_RECORDS);
  const [recoveryLog, setRecoveryLog] = useState<RecoveryLog>(INITIAL_RECOVERY_LOG);
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [scheduleTasks, setScheduleTasks] = useState<DailyScheduleTask[]>(INITIAL_SCHEDULE);
  const [adaptation, setAdaptation] = useState<AdaptationRecommendation | null>(INITIAL_ADAPTATION);
  const [badges, setBadges] = useState<MilestoneBadge[]>(INITIAL_BADGES);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // UI state
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isLiveWorkoutOpen, setIsLiveWorkoutOpen] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState<WorkoutRoutine | null>(null);
  const [isFlowCoachOpen, setIsFlowCoachOpen] = useState(false);
  const [isAdaptiveModalOpen, setIsAdaptiveModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Initialize from storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.userProfile) setUserProfile(parsed.userProfile);
        if (parsed.workouts) setWorkouts(parsed.workouts);
        if (parsed.workoutLogs) setWorkoutLogs(parsed.workoutLogs);
        if (parsed.meals) setMeals(parsed.meals);
        if (parsed.foodLogs) setFoodLogs(parsed.foodLogs);
        if (typeof parsed.waterMl === 'number') setWaterMl(parsed.waterMl);
        if (parsed.sleepRecords) setSleepRecords(parsed.sleepRecords);
        if (parsed.recoveryLog) setRecoveryLog(parsed.recoveryLog);
        if (parsed.habits) setHabits(parsed.habits);
        if (parsed.scheduleTasks) setScheduleTasks(parsed.scheduleTasks);
        if (parsed.adaptation !== undefined) setAdaptation(parsed.adaptation);
        if (parsed.badges) setBadges(parsed.badges);
        if (parsed.notifications) setNotifications(parsed.notifications);
        if (parsed.chatMessages) setChatMessages(parsed.chatMessages);
      }
    } catch (e) {
      console.warn('Failed to load from local storage', e);
    } finally {
      setDataLoaded(true);
    }
  }, []);

  // Save to storage on change
  useEffect(() => {
    if (!dataLoaded) return;
    try {
      const dataToSave = {
        userProfile,
        workouts,
        workoutLogs,
        meals,
        foodLogs,
        waterMl,
        sleepRecords,
        recoveryLog,
        habits,
        scheduleTasks,
        adaptation,
        badges,
        notifications,
        chatMessages,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.warn('Failed to save to local storage', e);
    }
  }, [
    dataLoaded,
    userProfile,
    workouts,
    workoutLogs,
    meals,
    foodLogs,
    waterMl,
    sleepRecords,
    recoveryLog,
    habits,
    scheduleTasks,
    adaptation,
    badges,
    notifications,
    chatMessages,
  ]);

  const waterTargetMl = 2500;

  const addWater = (amountMl: number) => {
    setWaterMl((prev) => {
      const next = Math.max(0, prev + amountMl);
      if (next >= waterTargetMl && prev < waterTargetMl) {
        try {
          confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
        } catch {}
        addNotification({
          title: 'Hydration Target Reached! 💧',
          message: `Great job! You reached your goal of ${waterTargetMl}ml today.`,
          type: 'hydration',
        });
      }
      return next;
    });
  };

  const resetWater = () => {
    setWaterMl(0);
  };

  const toggleScheduleTask = (taskId: string) => {
    setScheduleTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const toggleHabit = (habitId: string, dateStr?: string) => {
    const today = dateStr || new Date().toISOString().split('T')[0];
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const exists = h.completedDates.includes(today);
        let updatedDates: string[];
        let newStreak = h.streakCount;
        if (exists) {
          updatedDates = h.completedDates.filter((d) => d !== today);
          newStreak = Math.max(0, newStreak - 1);
        } else {
          updatedDates = [...h.completedDates, today];
          newStreak = newStreak + 1;
          try {
            confetti({ particleCount: 20, spread: 50, origin: { y: 0.7 } });
          } catch {}
        }
        return {
          ...h,
          completedDates: updatedDates,
          streakCount: newStreak,
          bestStreak: Math.max(h.bestStreak, newStreak),
        };
      })
    );
  };

  const addHabit = (habitData: {
    title: string;
    category: Habit['category'];
    targetFrequency: string;
    targetValue?: string;
    color?: string;
  }) => {
    const newHabit: Habit = {
      id: `hab_${Date.now()}`,
      title: habitData.title,
      category: habitData.category,
      targetFrequency: habitData.targetFrequency,
      targetValue: habitData.targetValue || '',
      streakCount: 0,
      bestStreak: 0,
      completedDates: [],
      icon: habitData.category === 'Movement' ? 'Dumbbell' : habitData.category === 'Hydration' ? 'Droplet' : habitData.category === 'Sleep' ? 'Moon' : habitData.category === 'Mindfulness' ? 'HeartPulse' : 'Apple',
      color: habitData.color || '#10B981',
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const logFood = (entry: Omit<FoodLogEntry, 'id' | 'date' | 'time'>) => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = now.toISOString().split('T')[0];
    const newLog: FoodLogEntry = {
      ...entry,
      id: `fl_${Date.now()}`,
      time,
      date,
    };
    setFoodLogs((prev) => [newLog, ...prev]);
  };

  const deleteFoodLog = (id: string) => {
    setFoodLogs((prev) => prev.filter((item) => item.id !== id));
  };

  const logSleep = (record: Omit<SleepRecord, 'id'>) => {
    const newRecord: SleepRecord = {
      ...record,
      id: `sl_${Date.now()}`,
    };
    setSleepRecords((prev) => [newRecord, ...prev.filter((r) => r.date !== record.date)]);
    addNotification({
      title: 'Sleep Record Logged 🌙',
      message: `Recorded ${record.durationHours}h of sleep with a ${record.qualityRating}/5 quality rating.`,
      type: 'recovery',
    });
  };

  const logRecovery = (log: Omit<RecoveryLog, 'id'>) => {
    const newLog: RecoveryLog = {
      ...log,
      id: `rec_${Date.now()}`,
    };
    setRecoveryLog(newLog);
    addNotification({
      title: 'Recovery Check-in Saved ✨',
      message: `Readiness updated (${newLog.perceivedRecoveryScore}/100). Plan adjusted to reflect your current energy.`,
      type: 'recovery',
    });
  };

  const updateProfile = (profileUpdate: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...profileUpdate }));
  };

  const addNotification = (notif: { title: string; message: string; type: AppNotification['type']; actionUrl?: string }) => {
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      title: notif.title,
      message: notif.message,
      timestamp: 'Just now',
      type: notif.type,
      read: false,
      actionUrl: notif.actionUrl,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const startLiveWorkout = (workout: WorkoutRoutine) => {
    setActiveWorkout(workout);
    setIsLiveWorkoutOpen(true);
  };

  const closeLiveWorkout = () => {
    setIsLiveWorkoutOpen(false);
  };

  const finishLiveWorkout = (logData: {
    durationMinutes: number;
    perceivedEffort: number;
    notes?: string;
    exercisesCompleted: {
      exerciseName: string;
      setsCompleted: { setNumber: number; weight: number; reps: number; completed: boolean }[];
    }[];
    caloriesBurnedEstimate: number;
  }) => {
    const newLog: WorkoutLog = {
      id: `wl_${Date.now()}`,
      workoutId: activeWorkout?.id || 'custom',
      title: activeWorkout?.title || 'Completed Workout',
      completedAt: new Date().toISOString(),
      ...logData,
    };

    setWorkoutLogs((prev) => [newLog, ...prev]);

    // Also mark workout schedule task as completed if present
    setScheduleTasks((prev) =>
      prev.map((t) => (t.type === 'workout' ? { ...t, completed: true } : t))
    );

    // Trigger celebration
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {}

    addNotification({
      title: 'Workout Completed! 🔥',
      message: `You crushed "${newLog.title}" in ${newLog.durationMinutes} mins! +${newLog.caloriesBurnedEstimate} kcal burned.`,
      type: 'workout',
    });

    setIsLiveWorkoutOpen(false);
    setActiveWorkout(null);
  };

  const acceptAdaptation = (id: string) => {
    if (adaptation && adaptation.id === id) {
      setAdaptation({ ...adaptation, status: 'accepted' });
      // Update schedule task
      setScheduleTasks((prev) =>
        prev.map((t) =>
          t.type === 'workout'
            ? {
                ...t,
                title: 'Adaptive Session (Hamstring Protective)',
                description: 'Modified compound session (35 mins) preserving consistency with joint safety.',
                recommendedDuration: '35 mins',
              }
            : t
        )
      );

      // Unlock adaptive mindset badge
      setBadges((prev) =>
        prev.map((b) =>
          b.id === 'badge_5' ? { ...b, unlockedAt: new Date().toISOString() } : b
        )
      );

      addNotification({
        title: 'Plan Adapted Successfully ⚡',
        message: 'Your schedule was dynamically tailored to safeguard recovery while keeping consistency high.',
        type: 'coach',
      });
    }
  };

  const dismissAdaptation = (id: string) => {
    if (adaptation && adaptation.id === id) {
      setAdaptation({ ...adaptation, status: 'dismissed' });
    }
  };

  const requestCustomAdaptation = async (params: {
    reason: string;
    energyLevel: number;
    sorenessLevel: number;
  }) => {
    try {
      const res = await fetch('/api/adapt-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...params,
          userGoal: userProfile.goals[0] || 'Consistency',
          missedDays: 1,
        }),
      });
      const data = await res.json();
      if (data.adaptation) {
        const newAdaptation: AdaptationRecommendation = {
          id: `adapt_${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          recommendationTitle: data.adaptation.recommendationTitle || 'Smart Schedule Rebalance',
          reason: data.adaptation.reason || 'Adaptive adjustment to match your physiological feedback.',
          informedBy: data.adaptation.informedBy || ['Reported energy and soreness metrics'],
          suggestedAction: data.adaptation.suggestedAction || 'Adjust training volume and rest intervals.',
          modifiedSchedule: data.adaptation.modifiedSchedule,
          recoveryAdvice: data.adaptation.recoveryAdvice,
          userApprovalRequired: true,
          status: 'pending',
        };
        setAdaptation(newAdaptation);
        setIsAdaptiveModalOpen(true);
      }
    } catch (e) {
      console.error('Failed to request adaptation', e);
    }
  };

  const sendChatMessage = async (
    content: string,
    category: 'fitness' | 'nutrition' | 'recovery' | 'general' = 'general'
  ) => {
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const messagesPayload = [...chatMessages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messagesPayload,
          userProfile,
        }),
      });

      const data = await res.json();
      const replyText = data.reply || "I'm listening and analyzing your fitness signals. How can I assist you further?";

      let action: ChatMessage['suggestedAction'] = undefined;
      const lowerReply = replyText.toLowerCase();
      if (lowerReply.includes('workout') || lowerReply.includes('exercise')) {
        action = { type: 'start_workout', label: 'Launch Workout Studio' };
      } else if (lowerReply.includes('meal') || lowerReply.includes('protein')) {
        action = { type: 'view_meal', label: 'Browse Meal Plan' };
      }

      const assistantMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category,
        suggestedAction: action,
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat send error:', err);
      const fallbackMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: "I'm here for you! I had a brief connection delay, but remember: consistency beats intensity every time. Let me know if you want to modify today's workout or meal targets.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category,
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const generateAiWorkout = async (params: {
    targetGoal: string;
    durationMinutes: number;
    sorenessAreas?: string;
  }): Promise<WorkoutRoutine | null> => {
    try {
      const res = await fetch('/api/generate-workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...params,
          equipment: userProfile.equipment,
          experienceLevel: userProfile.experienceLevel,
        }),
      });
      const data = await res.json();
      if (data.workout) {
        const generated: WorkoutRoutine = {
          id: `wk_ai_${Date.now()}`,
          title: data.workout.title || 'AI Tailored Flow',
          category: 'Strength',
          goal: data.workout.goal || params.targetGoal,
          durationMinutes: data.workout.durationMinutes || params.durationMinutes,
          difficulty: data.workout.difficulty || userProfile.experienceLevel,
          targetMuscles: data.workout.targetMuscles || ['Full Body'],
          equipmentNeeded: userProfile.equipment,
          caloriesEstimate: Math.round((data.workout.durationMinutes || 35) * 7.5),
          warmup: data.workout.warmup || [{ exercise: 'Dynamic Stretches', duration: '3 mins', notes: 'Prepare joints' }],
          exercises: (data.workout.exercises || []).map((ex: any, idx: number) => ({
            id: `ai_ex_${idx}`,
            name: ex.name,
            sets: ex.sets || 3,
            reps: String(ex.reps || '10-12'),
            restSeconds: ex.restSeconds || 60,
            targetMuscle: ex.targetMuscle || 'General',
            instruction: ex.instruction || 'Maintain proper form and control.',
            substitution: ex.substitution || 'Bodyweight variation',
            equipment: userProfile.equipment[0] || 'Dumbbells',
          })),
          cooldown: data.workout.cooldown || [{ exercise: 'Child’s pose', duration: '2 mins', notes: 'Relax' }],
          safetyNotes: data.workout.safetyNotes || ['Stop if sharp discomfort occurs.'],
        };
        setWorkouts((prev) => [generated, ...prev]);
        return generated;
      }
      return null;
    } catch (e) {
      console.error('Failed to generate workout', e);
      return null;
    }
  };

  const calculateWellnessScore = (): WellnessScoreInfo => {
    // Composite Proprietary Wellness Score (0 - 100)
    // 1. Movement adherence (35%): Workouts completed this week
    const recentWorkouts = workoutLogs.filter((w) => {
      const diffDays = (Date.now() - new Date(w.completedAt).getTime()) / (1000 * 3600 * 24);
      return diffDays <= 7;
    }).length;
    const movementScore = Math.min(35, (recentWorkouts / Math.max(1, userProfile.daysPerWeek)) * 35);

    // 2. Sleep adherence (30%): Avg sleep duration vs 8h target
    const recentSleep = sleepRecords.slice(0, 3);
    const avgSleep = recentSleep.length ? recentSleep.reduce((acc, s) => acc + s.durationHours, 0) / recentSleep.length : 7.5;
    const sleepScore = Math.min(30, (avgSleep / 8) * 30);

    // 3. Recovery readiness (20%): Energy vs fatigue
    const recoveryScore = (recoveryLog.perceivedRecoveryScore / 100) * 20;

    // 4. Habits & Hydration (15%)
    const waterRatio = Math.min(1, waterMl / waterTargetMl);
    const habitScore = waterRatio * 15;

    const total = Math.round(movementScore + sleepScore + recoveryScore + habitScore);

    let trend = '+4 pts vs last week';
    let suggestion = 'High readiness today! Prime window for your compound strength session.';
    if (total < 70) {
      trend = '-3 pts due to sleep variance';
      suggestion = 'Recovery is slightly compromised. Consider light mobility and a 15-minute earlier bedtime.';
    } else if (total >= 88) {
      trend = '+6 pts with steady hydration & sleep';
      suggestion = 'Peak physiological alignment. Perfect day to challenge moderate progressive overload.';
    }

    return {
      score: Math.min(100, Math.max(0, total)),
      breakdown: {
        movement: Math.round(movementScore),
        sleep: Math.round(sleepScore),
        recovery: Math.round(recoveryScore),
        habits: Math.round(habitScore),
      },
      trend,
      suggestion,
    };
  };

  const resetToDemoData = () => {
    setUserProfile(INITIAL_PROFILE);
    setWorkouts(INITIAL_WORKOUTS);
    setWorkoutLogs(INITIAL_WORKOUT_LOGS);
    setMeals(INITIAL_MEALS);
    setFoodLogs(INITIAL_FOOD_LOGS);
    setWaterMl(1750);
    setSleepRecords(INITIAL_SLEEP_RECORDS);
    setRecoveryLog(INITIAL_RECOVERY_LOG);
    setHabits(INITIAL_HABITS);
    setScheduleTasks(INITIAL_SCHEDULE);
    setAdaptation(INITIAL_ADAPTATION);
    setBadges(INITIAL_BADGES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setChatMessages(INITIAL_CHAT_MESSAGES);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setActiveTab('dashboard');
  };

  const resetToNewUser = () => {
    const freshProfile: UserProfile = {
      ...INITIAL_PROFILE,
      name: '',
      onboardingCompleted: false,
    };
    setUserProfile(freshProfile);
    setWorkoutLogs([]);
    setFoodLogs([]);
    setWaterMl(0);
    setActiveTab('dashboard');
  };

  return (
    <AppContext.Provider
      value={{
        userProfile,
        workouts,
        workoutLogs,
        meals,
        foodLogs,
        waterMl,
        waterTargetMl,
        sleepRecords,
        recoveryLog,
        habits,
        scheduleTasks,
        adaptation,
        badges,
        notifications,
        chatMessages,
        isChatLoading,
        activeTab,
        setActiveTab,
        isLiveWorkoutOpen,
        activeWorkout,
        startLiveWorkout,
        closeLiveWorkout,
        finishLiveWorkout,
        isFlowCoachOpen,
        setIsFlowCoachOpen,
        isAdaptiveModalOpen,
        setIsAdaptiveModalOpen,
        isNotificationOpen,
        setIsNotificationOpen,
        addWater,
        resetWater,
        toggleScheduleTask,
        toggleHabit,
        addHabit,
        deleteHabit,
        logFood,
        deleteFoodLog,
        logSleep,
        logRecovery,
        updateProfile,
        acceptAdaptation,
        dismissAdaptation,
        requestCustomAdaptation,
        sendChatMessage,
        generateAiWorkout,
        markNotificationRead,
        clearAllNotifications,
        resetToDemoData,
        resetToNewUser,
        calculateWellnessScore,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
