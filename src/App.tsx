/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { DashboardView } from './components/dashboard/DashboardView';
import { WorkoutStudioView } from './components/workout/WorkoutStudioView';
import { NutritionView } from './components/nutrition/NutritionView';
import { WellnessView } from './components/wellness/WellnessView';
import { HabitsView } from './components/habits/HabitsView';
import { ProgressView } from './components/analytics/ProgressView';
import { CoachView } from './components/coach/CoachView';
import { ProfileSettingsView } from './components/profile/ProfileSettingsView';
import { LiveWorkoutModal } from './components/workout/LiveWorkoutModal';
import { FlowCoachModal } from './components/coach/FlowCoachModal';
import { AdaptiveEngineModal } from './components/adaptive/AdaptiveEngineModal';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { Sparkles, Bot } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    userProfile,
    activeTab,
    isLiveWorkoutOpen,
    activeWorkout,
    closeLiveWorkout,
    isFlowCoachOpen,
    setIsFlowCoachOpen,
  } = useApp();

  // If onboarding is not completed, show the guided onboarding flow
  if (!userProfile.onboardingCompleted) {
    return <OnboardingFlow />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'train':
        return <WorkoutStudioView />;
      case 'nutrition':
        return <NutritionView />;
      case 'wellness':
        return <WellnessView />;
      case 'habits':
        return <HabitsView />;
      case 'progress':
        return <ProgressView />;
      case 'coach':
        return <CoachView />;
      case 'profile':
        return <ProfileSettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col lg:flex-row antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-16 lg:pb-0">
        <Header />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Navigation Bar */}
      <MobileNav />

      {/* Floating Flow Coach Trigger (when modal is closed and not on dedicated coach view) */}
      {!isFlowCoachOpen && activeTab !== 'coach' && (
        <button
          onClick={() => setIsFlowCoachOpen(true)}
          className="fixed bottom-20 lg:bottom-7 right-5 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition"
          title="Open Flow Coach AI Assistant"
        >
          <Bot className="w-5 h-5 fill-slate-950" />
          <span className="hidden sm:inline">Ask Flow Coach</span>
          <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
        </button>
      )}

      {/* Floating Assistant Modal */}
      <FlowCoachModal />

      {/* Live Interactive Workout Modal */}
      {isLiveWorkoutOpen && activeWorkout && (
        <LiveWorkoutModal workout={activeWorkout} onClose={closeLiveWorkout} />
      )}

      {/* Adaptive Planning Engine Modal */}
      <AdaptiveEngineModal />

      {/* Notification Drawer */}
      <NotificationDrawer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
