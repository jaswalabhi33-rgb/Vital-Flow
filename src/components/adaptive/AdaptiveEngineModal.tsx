import React from 'react';
import { Zap, Check, X, ShieldCheck, ArrowRight, Activity, Clock, HeartPulse } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdaptiveEngineModal: React.FC = () => {
  const {
    adaptation,
    isAdaptiveModalOpen,
    setIsAdaptiveModalOpen,
    acceptAdaptation,
    dismissAdaptation,
  } = useApp();

  if (!isAdaptiveModalOpen || !adaptation) return null;

  const handleAccept = () => {
    acceptAdaptation(adaptation.id);
    setIsAdaptiveModalOpen(false);
  };

  const handleDismiss = () => {
    dismissAdaptation(adaptation.id);
    setIsAdaptiveModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-xl bg-[#0F172A] border border-emerald-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Adaptive Engine Recommendation
                </span>
              </div>
              <h3 className="text-lg font-black text-white mt-0.5">
                {adaptation.recommendationTitle}
              </h3>
            </div>
          </div>
          <button
            onClick={() => setIsAdaptiveModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-xl"
          >
            ✕
          </button>
        </div>

        {/* Core Rationale */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
            Why This Plan Is Changing:
          </span>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            {adaptation.reason}
          </p>
        </div>

        {/* Informed By Data Inputs */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Informed By Your Real Tracked Data:
          </span>
          <div className="flex flex-wrap gap-2">
            {adaptation.informedBy.map((item, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-1.5"
              >
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Suggested Next Actions */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 to-teal-950/20 border border-emerald-500/30 space-y-3">
          <div>
            <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">
              Suggested Calibration:
            </span>
            <p className="text-xs text-white font-medium mt-1 leading-relaxed">
              {adaptation.suggestedAction}
            </p>
          </div>

          {adaptation.modifiedSchedule && (
            <div className="pt-2 border-t border-emerald-500/20 text-xs text-slate-300">
              <strong className="text-emerald-400">Schedule Adjustment:</strong> {adaptation.modifiedSchedule}
            </div>
          )}

          {adaptation.recoveryAdvice && (
            <div className="pt-2 border-t border-emerald-500/20 text-xs text-slate-300">
              <strong className="text-cyan-400">Recovery Priority:</strong> {adaptation.recoveryAdvice}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={handleDismiss}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
          >
            Keep Original Plan
          </button>

          <button
            onClick={handleAccept}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition active:scale-95 flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Accept & Apply Adaptive Plan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
