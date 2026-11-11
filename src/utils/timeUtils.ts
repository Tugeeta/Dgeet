// Deadline: November 23, 2026 at 11:59 PM Pacific Time
// Pacific Standard Time is UTC-8
export const DEADLINE_ISO = '2026-11-23T23:59:00-08:00';
export const DEADLINE_TIMESTAMP = new Date(DEADLINE_ISO).getTime();

// Start of mission sprint: Nov 10, 2026 18:00 PT
export const SPRINT_START_TIMESTAMP = new Date('2026-11-10T18:00:00-08:00').getTime();

export interface TimeLeft {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  formattedDays: string;
  formattedHours: string;
  formattedMinutes: string;
  formattedSeconds: string;
}

export function getTimeRemaining(targetTimestamp: number = DEADLINE_TIMESTAMP): TimeLeft {
  const now = Date.now();
  const totalMs = targetTimestamp - now;

  if (totalMs <= 0) {
    return {
      totalMs: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
      formattedDays: '00',
      formattedHours: '00',
      formattedMinutes: '00',
      formattedSeconds: '00',
    };
  }

  const seconds = Math.floor((totalMs / 1000) % 60);
  const minutes = Math.floor((totalMs / 1000 / 60) % 60);
  const hours = Math.floor((totalMs / (1000 * 60 * 60)) % 24);
  const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));

  return {
    totalMs,
    days,
    hours,
    minutes,
    seconds,
    isExpired: false,
    formattedDays: String(days).padStart(2, '0'),
    formattedHours: String(hours).padStart(2, '0'),
    formattedMinutes: String(minutes).padStart(2, '0'),
    formattedSeconds: String(seconds).padStart(2, '0'),
  };
}

export function getSprintTimeElapsedPercent(): number {
  const now = Date.now();
  const totalSpan = DEADLINE_TIMESTAMP - SPRINT_START_TIMESTAMP;
  const elapsed = now - SPRINT_START_TIMESTAMP;
  if (elapsed <= 0) return 0;
  if (elapsed >= totalSpan) return 100;
  return Math.min(100, Math.max(0, Math.round((elapsed / totalSpan) * 100)));
}

export function formatPacificDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  }).format(date);
}

export const MOTIVATIONAL_CYBER_QUOTES = [
  "Defense in depth starts with discipline in execution. Submit to win $1,000.",
  "Every packet inspected brings you closer to mastery and the $1,000 prize.",
  "Security is not a product, but a process. Execute your daily plan.",
  "The best incident response is relentless preparation. Crush today's quiz.",
  "Your professional portfolio is proof of skill. Build what recruiters can't ignore.",
  "13 Days of focus = Career-defining certification & $1,000 reward.",
  "Zero-trust mindset: Validate every assignment before marking done.",
  "Nov 23, 11:59 PM PT is non-negotiable. Lock in.",
];
