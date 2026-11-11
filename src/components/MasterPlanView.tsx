import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  ShieldAlert, 
  Terminal, 
  CheckSquare, 
  Filter,
  Trophy,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PlanTask, TaskCategory, SubTask } from '../types';
import { playSuccessChime, playRadarPing } from '../utils/audioUtils';

interface MasterPlanViewProps {
  tasks: PlanTask[];
  onUpdateTasks: (tasks: PlanTask[]) => void;
  onSelectTab: (tab: string) => void;
}

export const MasterPlanView: React.FC<MasterPlanViewProps> = ({
  tasks,
  onUpdateTasks,
  onSelectTab,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | TaskCategory>('all');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>('day-1');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<TaskCategory>('quiz');
  const [newTaskDate, setNewTaskDate] = useState('2026-11-12');
  const [newTaskHours, setNewTaskHours] = useState(2);
  const [newTaskTip, setNewTaskTip] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    let justCompletedAll = false;

    const updated = tasks.map((t) => {
      if (t.id !== taskId) return t;
      const updatedSubtasks = t.subtasks.map((st) => {
        if (st.id === subtaskId) {
          const nextVal = !st.completed;
          if (nextVal) playSuccessChime();
          return { ...st, completed: nextVal };
        }
        return st;
      });

      const allDone = updatedSubtasks.every((st) => st.completed);
      if (allDone && !t.completed) {
        justCompletedAll = true;
      }

      return {
        ...t,
        subtasks: updatedSubtasks,
        completed: allDone,
      };
    });

    onUpdateTasks(updated);

    if (justCompletedAll) {
      playSuccessChime();
      // Check if all tasks in entire mission are done
      const allTasksFinished = updated.every((t) => t.completed);
      if (allTasksFinished) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const toggleTaskCompleted = (taskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id !== taskId) return t;
      const nextCompleted = !t.completed;
      if (nextCompleted) {
        playSuccessChime();
      }
      return {
        ...t,
        completed: nextCompleted,
        subtasks: t.subtasks.map((st) => ({ ...st, completed: nextCompleted })),
      };
    });
    onUpdateTasks(updated);
  };

  const handleUpdateNotes = (taskId: string, notes: string) => {
    const updated = tasks.map((t) => (t.id === taskId ? { ...t, notes } : t));
    onUpdateTasks(updated);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: PlanTask = {
      id: `custom-${Date.now()}`,
      dayNumber: tasks.length + 1,
      dateStr: newTaskDate,
      dayName: new Date(newTaskDate).toLocaleDateString('en-US', { weekday: 'long' }),
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      priority: 'high',
      estimatedHours: newTaskHours,
      description: newTaskDesc.trim() || 'Custom course requirement.',
      cyberTip: newTaskTip.trim() || 'Review cybersecurity documentation and check system logs.',
      completed: false,
      subtasks: [
        { id: `st-${Date.now()}-1`, title: 'Initial preparation and reading', completed: false },
        { id: `st-${Date.now()}-2`, title: 'Execute and document findings', completed: false },
      ],
    };

    onUpdateTasks([...tasks, newTask]);
    setIsAddModalOpen(false);
    setNewTaskTitle('');
    setNewTaskTip('');
    setNewTaskDesc('');
    playSuccessChime();
  };

  const filteredTasks = tasks.filter((t) => {
    if (selectedFilter === 'all') return true;
    return t.category === selectedFilter;
  });

  const getCategoryBadge = (cat: TaskCategory) => {
    switch (cat) {
      case 'quiz':
        return {
          bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
          label: 'Daily Quiz',
        };
      case 'assignment':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
          label: 'Weekly Assignment',
        };
      case 'test':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
          label: 'Final Exam Prep',
        };
      case 'portfolio':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
          label: 'Portfolio Sprint',
        };
      case 'submission':
        return {
          bg: 'bg-purple-500/15 border-purple-500/40 text-purple-300 animate-pulse',
          label: 'Final $1,000 Submission',
        };
    }
  };

  // Metrics
  const totalSubtasks = tasks.reduce((acc, t) => acc + t.subtasks.length, 0);
  const doneSubtasks = tasks.reduce(
    (acc, t) => acc + t.subtasks.filter((st) => st.completed).length,
    0
  );
  const quizCount = tasks.filter((t) => t.category === 'quiz').length;
  const assignmentCount = tasks.filter((t) => t.category === 'assignment').length;

  return (
    <div className="space-y-6">
      {/* Top Banner / Roadmap Summary */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <BookOpen className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-['Space_Grotesk']">
                13-Day Cybersecurity Master Plan
              </h2>
            </div>
            <p className="text-sm text-slate-400 max-w-2xl">
              Engineered specifically for your Cybersecurity Advanced Course: balance daily quizzes, complete both weekly assignments, prepare for and pass the final main test, and assemble your professional portfolio for the <strong className="text-amber-400">$1,000 project submission</strong> by Nov 23 at 11:59 PM PT.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Add Custom Task</span>
            </button>

            <button
              onClick={() => onSelectTab('reminders')}
              className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-emerald-500/30 transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Sync to Phone Calendar (.ICS)</span>
            </button>
          </div>
        </div>

        {/* Milestone Quick KPI Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-mono">SUBTASKS COMPLETED</span>
            <div className="text-lg font-bold text-white font-mono mt-0.5">
              {doneSubtasks} / {totalSubtasks}
            </div>
            <div className="text-[10px] text-emerald-400 font-medium mt-1">
              {totalSubtasks > 0 ? Math.round((doneSubtasks / totalSubtasks) * 100) : 0}% execution
            </div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-mono">DAILY QUIZZES</span>
            <div className="text-lg font-bold text-cyan-400 font-mono mt-0.5">
              13 Planned
            </div>
            <div className="text-[10px] text-slate-400 font-medium mt-1">1 per day streak</div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-mono">WEEKLY ASSIGNMENTS</span>
            <div className="text-lg font-bold text-amber-400 font-mono mt-0.5">
              2 Due (Nov 15 & 20)
            </div>
            <div className="text-[10px] text-slate-400 font-medium mt-1">Snort & Pentest CVSS</div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-mono">GRAND FINALE</span>
            <div className="text-lg font-bold text-purple-400 font-mono mt-0.5">
              Nov 22 & 23
            </div>
            <div className="text-[10px] text-amber-300 font-medium mt-1">Final Test & $1K Submission</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-slate-500 flex items-center gap-1 mr-2 font-mono">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {[
            { id: 'all', label: 'All 13 Days' },
            { id: 'quiz', label: 'Daily Quizzes' },
            { id: 'assignment', label: 'Weekly Assignments' },
            { id: 'test', label: 'Final Exam' },
            { id: 'portfolio', label: 'Portfolio Forge' },
            { id: 'submission', label: 'Grand Submission' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id as typeof selectedFilter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedFilter === tab.id
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 font-mono">
          Showing {filteredTasks.length} Milestones
        </span>
      </div>

      {/* Day-by-Day Task List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const badge = getCategoryBadge(task.category);
          const isExpanded = expandedTaskId === task.id;
          const completedSubtasks = task.subtasks.filter((st) => st.completed).length;

          return (
            <div
              key={task.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                task.completed
                  ? 'bg-slate-900/40 border-emerald-500/20 opacity-90'
                  : task.priority === 'critical'
                  ? 'bg-slate-900/90 border-rose-500/40 shadow-lg shadow-rose-950/20'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Task Header */}
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => toggleTaskCompleted(task.id)}
                    className="mt-1 text-slate-400 hover:text-emerald-400 transition-colors shrink-0"
                    title={task.completed ? 'Mark Incomplete' : 'Mark Complete'}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-950" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-600 hover:text-emerald-400" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-400">
                        DAY {task.dayNumber} • {task.dayName.toUpperCase()}, {task.dateStr.slice(5)}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                        {badge.label}
                      </span>
                      {task.priority === 'critical' && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-300">
                          CRITICAL
                        </span>
                      )}
                    </div>

                    <h3
                      className={`text-base sm:text-lg font-bold font-['Space_Grotesk'] ${
                        task.completed ? 'line-through text-slate-500' : 'text-white'
                      }`}
                    >
                      {task.title}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        Est. {task.estimatedHours}h
                      </span>
                      <span>
                        {completedSubtasks} of {task.subtasks.length} subtasks done
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                  >
                    <span>{isExpanded ? 'Collapse' : 'Details'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Expanded Details Pane */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 bg-slate-950/40 space-y-4">
                  {/* Task Description */}
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {task.description}
                  </p>

                  {/* Subtask Checklist */}
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Action Checklist:
                    </span>
                    {task.subtasks.map((st) => (
                      <label
                        key={st.id}
                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-800/40 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={st.completed}
                          onChange={() => toggleSubtask(task.id, st.id)}
                          className="mt-1 rounded border-slate-700 text-emerald-500 focus:ring-0 w-4 h-4"
                        />
                        <span
                          className={`text-sm ${
                            st.completed ? 'line-through text-slate-500' : 'text-slate-200'
                          }`}
                        >
                          {st.title}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* Cybersecurity Pro Tip */}
                  <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3.5 flex items-start gap-3">
                    <Terminal className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-mono font-bold text-emerald-300 block mb-0.5">
                        CYBER DEFENSE PRO TIP
                      </span>
                      <p className="text-emerald-100/90 leading-relaxed">{task.cyberTip}</p>
                    </div>
                  </div>

                  {/* User Notes Input */}
                  <div>
                    <label className="text-xs font-mono text-slate-400 block mb-1">
                      Your Daily Score, Submission Links or Scratch Notes:
                    </label>
                    <textarea
                      value={task.notes || ''}
                      onChange={(e) => handleUpdateNotes(task.id, e.target.value)}
                      placeholder="e.g. Scored 95% on quiz, pushed commit 4a8f9, Wireshark filter applied..."
                      rows={2}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Custom Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white font-['Space_Grotesk'] mb-4">
              Add Custom Course Milestone / Task
            </h3>

            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Revise Cryptography & RSA for Quiz 5"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Category</label>
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value as TaskCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="quiz">Daily Quiz</option>
                    <option value="assignment">Weekly Assignment</option>
                    <option value="test">Final Test Prep</option>
                    <option value="portfolio">Portfolio Building</option>
                    <option value="submission">Submission Milestone</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Target Date</label>
                  <input
                    type="date"
                    value={newTaskDate}
                    onChange={(e) => setNewTaskDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Estimated Hours</label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  max="12"
                  value={newTaskHours}
                  onChange={(e) => setNewTaskHours(parseFloat(e.target.value) || 1)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="What needs to be accomplished?"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Cyber Tip or Tool Command</label>
                <input
                  type="text"
                  value={newTaskTip}
                  onChange={(e) => setNewTaskTip(e.target.value)}
                  placeholder="e.g. Use nmap -sV -sC -Pn against test network"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
