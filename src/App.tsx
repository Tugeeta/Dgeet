import React, { useState, useEffect } from 'react';
import { HeaderCountdown } from './components/HeaderCountdown';
import { MasterPlanView } from './components/MasterPlanView';
import { LockScreenGenerator } from './components/LockScreenGenerator';
import { DailyRemindersView } from './components/DailyRemindersView';
import { PortfolioForgeView } from './components/PortfolioForgeView';
import { QuizBoosterView } from './components/QuizBoosterView';
import { AmbientLockScreenModal } from './components/AmbientLockScreenModal';
import { INITIAL_PLAN_TASKS } from './data/defaultPlan';
import { PlanTask } from './types';
import { Shield, Trophy, ExternalLink, Sparkles, Terminal } from 'lucide-react';

export default function App() {
  const [tasks, setTasks] = useState<PlanTask[]>(() => {
    const saved = localStorage.getItem('cyber_plan_tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PLAN_TASKS;
      }
    }
    return INITIAL_PLAN_TASKS;
  });

  const [currentTab, setCurrentTab] = useState<string>('plan');
  const [showAmbientModal, setShowAmbientModal] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('cyber_plan_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const totalTasksCount = tasks.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-emerald-500 selection:text-slate-950">
      {/* Sticky Header with Live Countdown & Tab Navigation */}
      <HeaderCountdown
        completedTasksCount={completedTasksCount}
        totalTasksCount={totalTasksCount}
        onOpenAmbient={() => setShowAmbientModal(true)}
        onSelectTab={setCurrentTab}
        currentTab={currentTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {currentTab === 'plan' && (
          <MasterPlanView
            tasks={tasks}
            onUpdateTasks={setTasks}
            onSelectTab={setCurrentTab}
          />
        )}

        {currentTab === 'lockscreen' && (
          <LockScreenGenerator
            onOpenAmbient={() => setShowAmbientModal(true)}
            completedTasksCount={completedTasksCount}
            totalTasksCount={totalTasksCount}
          />
        )}

        {currentTab === 'reminders' && (
          <DailyRemindersView
            tasks={tasks}
            onSelectTab={setCurrentTab}
          />
        )}

        {currentTab === 'portfolio' && (
          <PortfolioForgeView />
        )}

        {currentTab === 'quiz' && (
          <QuizBoosterView />
        )}
      </main>

      {/* Fullscreen Ambient Desk Clock Modal */}
      {showAmbientModal && (
        <AmbientLockScreenModal
          onClose={() => setShowAmbientModal(false)}
          completedTasksCount={completedTasksCount}
          totalTasksCount={totalTasksCount}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>CyberMission 1K Command System</span>
            <span>•</span>
            <span className="text-amber-400">$1,000 Milestone Target</span>
          </div>

          <div className="flex items-center gap-4 text-center sm:text-right">
            <span>Hard Deadline: Nov 23, 2026 @ 11:59 PM PT</span>
            <span>•</span>
            <button
              onClick={() => setShowAmbientModal(true)}
              className="text-emerald-400 hover:text-emerald-300 underline"
            >
              Open Ambient Desk Clock
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
