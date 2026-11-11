export type TaskCategory = 'quiz' | 'assignment' | 'test' | 'portfolio' | 'submission';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface PlanTask {
  id: string;
  dayNumber: number; // 1 to 13
  dateStr: string; // e.g. "2026-11-11"
  dayName: string; // e.g. "Wednesday"
  title: string;
  category: TaskCategory;
  priority: 'critical' | 'high' | 'medium';
  estimatedHours: number;
  description: string;
  cyberTip: string;
  subtasks: SubTask[];
  completed: boolean;
  notes?: string;
}

export interface ReminderSetting {
  id: string;
  title: string;
  time: string; // HH:MM
  days: string[]; // e.g. ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  enabled: boolean;
  category: TaskCategory;
}

export interface LockScreenConfig {
  aspectRatio: 'phone' | 'desktop' | 'square';
  theme: 'matrix' | 'sentinel' | 'crimson' | 'gold' | 'obsidian';
  customTitle: string;
  customSubtitle: string;
  showDailyQuote: boolean;
  showProgress: boolean;
  showTargetTime: boolean;
  blurBackground: boolean;
  accentGlow: boolean;
}

export interface PortfolioProject {
  id: string;
  title: string;
  domain: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'not_started' | 'in_progress' | 'completed';
  description: string;
  keySkills: string[];
  deliverables: string[];
  githubTemplate: string;
}

export interface QuizCard {
  id: string;
  domain: 'SOC & SIEM' | 'Network Security' | 'Threat Hunting' | 'Cryptography' | 'IAM & Cloud' | 'Incident Response';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
