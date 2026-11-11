import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  BellRing, 
  Calendar, 
  Clock, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Volume2, 
  Smartphone, 
  Info,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { ReminderSetting, PlanTask } from '../types';
import { INITIAL_REMINDERS } from '../data/defaultPlan';
import { downloadCalendarICS } from '../utils/calendarExport';
import { playRadarPing, playSuccessChime } from '../utils/audioUtils';

interface DailyRemindersViewProps {
  tasks: PlanTask[];
  onSelectTab: (tab: string) => void;
}

export const DailyRemindersView: React.FC<DailyRemindersViewProps> = ({
  tasks,
  onSelectTab,
}) => {
  const [reminders, setReminders] = useState<ReminderSetting[]>(() => {
    const saved = localStorage.getItem('cyber_reminders');
    return saved ? JSON.parse(saved) : INITIAL_REMINDERS;
  });

  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() => {
    return typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'default';
  });

  const [testSent, setTestSent] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('14:00');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    localStorage.setItem('cyber_reminders', JSON.stringify(reminders));
  }, [reminders]);

  const requestPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setNotificationPermission(perm);
        if (perm === 'granted') {
          playSuccessChime();
          new Notification('🎯 Mission 1K: Notifications Active!', {
            body: 'You will receive daily reminders for your Cybersecurity quizzes, assignments, and the Nov 23 deadline!',
            icon: '/favicon.ico',
          });
        }
      } catch {
        // Fallback
      }
    }
  };

  const fireTestNotification = () => {
    playRadarPing();
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('🚨 Mission 1K Urgent Reminder', {
        body: 'Daily Quiz #1 is waiting. Keep your streak alive for the Nov 23 $1,000 deadline!',
      });
      setTestSent(true);
      setTimeout(() => setTestSent(false), 3000);
    } else {
      alert('🔔 In-App Reminder: Daily Quiz is pending! Enable browser notifications to receive background alerts.');
    }
  };

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newRem: ReminderSetting = {
      id: `rem-${Date.now()}`,
      title: newTitle.trim(),
      time: newTime,
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      enabled: true,
      category: 'assignment',
    };

    setReminders((prev) => [...prev, newRem]);
    setNewTitle('');
    setShowAddForm(false);
    playSuccessChime();
  };

  const handleDownloadCalendar = () => {
    downloadCalendarICS(tasks);
    playSuccessChime();
  };

  // Find today's urgent task (Day 1 for sprint launch)
  const todayTask = tasks[0];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <BellRing className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
                Daily Reminders & Smart Calendar Sync
              </h2>
            </div>
            <p className="text-sm text-slate-400 max-w-2xl">
              Stay accountable every single day. Configure browser alerts and download the complete 13-day study schedule directly into your Apple Calendar, Google Calendar, or Outlook.
            </p>
          </div>

          <button
            onClick={handleDownloadCalendar}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all hover:scale-105 shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Export 13-Day Schedule (.ICS)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Reminders & Notifications (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Browser Notification Status Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Bell className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Browser Push Notifications</h3>
                  <p className="text-xs text-slate-400">
                    Receive daily alerts even when this tab is running in the background.
                  </p>
                </div>
              </div>

              <span
                className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                  notificationPermission === 'granted'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}
              >
                {notificationPermission === 'granted' ? 'ACTIVE & ENABLED' : 'PERMISSION NEEDED'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {notificationPermission !== 'granted' ? (
                <button
                  onClick={requestPermission}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-all flex items-center gap-1.5"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Enable Browser Notifications</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                  <CheckCircle className="w-4 h-4" />
                  <span>Browser notifications authorized!</span>
                </div>
              )}

              <button
                onClick={fireTestNotification}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span>{testSent ? 'Ping Fired!' : 'Test Notification Ping'}</span>
              </button>
            </div>
          </div>

          {/* Active Daily Alarms List */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                Daily Reminder Timetable
              </h3>

              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Reminder
              </button>
            </div>

            {/* Add Custom Reminder Form */}
            {showAddForm && (
              <form onSubmit={handleAddReminder} className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-3">
                <div>
                  <label className="text-[11px] text-slate-400 font-mono block mb-1">Reminder Label</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 15-Minute Flashcard Review"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 font-mono block mb-1">Alert Time (24h)</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-emerald-500 text-slate-950 font-bold rounded text-xs"
                  >
                    Save
                  </button>
                </div>
              </form>
            )}

            {/* List of Reminders */}
            <div className="space-y-2.5">
              {reminders.map((rem) => (
                <div
                  key={rem.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                    rem.enabled
                      ? 'bg-slate-950/70 border-slate-800'
                      : 'bg-slate-950/30 border-slate-900 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-bold text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded border border-amber-500/20">
                      {rem.time}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-white">{rem.title}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Repeats Daily (Mon - Sun)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleReminder(rem.id)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        rem.enabled ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          rem.enabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>

                    <button
                      onClick={() => deleteReminder(rem.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                      title="Delete reminder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Calendar Import Instructions & Today's Focus (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Calendar Sync Card */}
          <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white font-['Space_Grotesk']">
                How to Sync With Your Phone
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Exporting the <strong>.ICS file</strong> automatically populates:
            </p>

            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
              <li>All 13 daily quiz time slots with topic outlines</li>
              <li>Assignment 1 & 2 milestone review alarms</li>
              <li>Final Main Test preparation window</li>
              <li>Hard deadline alarm on <strong className="text-rose-300">Nov 23 @ 11:59 PM PT</strong> for the $1,000 project submission</li>
            </ul>

            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1.5 font-mono">
              <div className="text-emerald-400 font-bold">📲 Quick Import Guide:</div>
              <div>• <strong>Apple iPhone / Mac:</strong> Download .ICS and tap to add all to Calendar.</div>
              <div>• <strong>Google Calendar:</strong> Settings ➔ Import & Export ➔ Select .ICS file.</div>
              <div>• <strong>Outlook:</strong> Open with Outlook or import via Calendar settings.</div>
            </div>

            <button
              onClick={handleDownloadCalendar}
              className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Download .ICS Calendar File</span>
            </button>
          </div>

          {/* Today's Target Focus Card */}
          {todayTask && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  🎯 TODAY'S IMMEDIATE FOCUS
                </span>
                <span className="text-xs font-mono text-slate-400">Day 1 / 13</span>
              </div>

              <h4 className="text-sm font-bold text-white">{todayTask.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{todayTask.description}</p>

              <div className="space-y-1.5 pt-1">
                {todayTask.subtasks.map((st) => (
                  <div key={st.id} className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{st.title}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onSelectTab('plan')}
                className="w-full mt-2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Open Full Step-by-Step Plan</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
