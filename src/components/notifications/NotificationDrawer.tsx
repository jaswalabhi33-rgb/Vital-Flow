import React, { useState } from 'react';
import { X, Check, Bell, Dumbbell, Droplet, Moon, Bot, Award, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationOpen,
    setIsNotificationOpen,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    setActiveTab,
    setIsAdaptiveModalOpen,
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'unread' | 'workout' | 'coach'>('all');

  if (!isNotificationOpen) return null;

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'workout') return n.type === 'workout';
    if (filter === 'coach') return n.type === 'coach';
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'workout':
        return <Dumbbell className="w-4 h-4 text-emerald-400" />;
      case 'hydration':
        return <Droplet className="w-4 h-4 text-cyan-400" />;
      case 'recovery':
        return <Moon className="w-4 h-4 text-violet-400" />;
      case 'coach':
        return <Bot className="w-4 h-4 text-teal-400" />;
      case 'milestone':
        return <Award className="w-4 h-4 text-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleNotificationClick = (item: (typeof notifications)[0]) => {
    markNotificationRead(item.id);
    if (item.actionUrl === 'adaptive') {
      setIsNotificationOpen(false);
      setIsAdaptiveModalOpen(true);
    } else if (item.actionUrl) {
      setIsNotificationOpen(false);
      setActiveTab(item.actionUrl);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsNotificationOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#0F172A] border-l border-slate-800 h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Notifications</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
              {notifications.filter((n) => !n.read).length} unread
            </span>
          </div>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="p-1.5 text-slate-400 hover:text-rose-400 transition"
                title="Clear all notifications"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setIsNotificationOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-800/80 overflow-x-auto text-xs">
          {(['all', 'unread', 'workout', 'coach'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-lg capitalize font-medium transition ${
                filter === tab
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center text-slate-400">
              <Bell className="w-10 h-10 stroke-[1.2] mb-3 text-slate-400" />
              <p className="text-sm font-medium">All caught up!</p>
              <p className="text-xs text-slate-400 mt-1">No notifications matching this filter.</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={`p-3.5 rounded-xl border transition cursor-pointer ${
                  item.read
                    ? 'bg-slate-900/40 border-slate-800/60 opacity-75 hover:opacity-100 hover:bg-slate-900'
                    : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 shrink-0">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h4 className="text-xs font-bold text-slate-100 truncate">{item.title}</h4>
                      <span className="text-[10px] text-slate-400 shrink-0">{item.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.message}</p>
                    {item.actionUrl && (
                      <span className="text-[11px] font-semibold text-emerald-400 hover:underline inline-block mt-2">
                        View Details →
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
