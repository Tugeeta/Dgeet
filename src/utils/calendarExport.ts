import { PlanTask } from '../types';

export function generateICSContent(tasks: PlanTask[]): string {
  const pad = (n: number) => String(n).padStart(2, '0');

  const formatICSDate = (date: Date) => {
    return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
  };

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CyberMission 1K//Cybersecurity Sprint//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Cybersecurity Advanced Sprint & $1,000 Mission',
    'X-WR-TIMEZONE:America/Los_Angeles',
  ];

  const nowUTC = formatICSDate(new Date());

  tasks.forEach((task) => {
    // Determine hours based on category
    // Default study block: e.g. 19:00 PT (which is 03:00 UTC next day in PST)
    const taskDate = new Date(`${task.dateStr}T19:00:00-08:00`);
    const endDate = new Date(taskDate.getTime() + (task.estimatedHours || 2) * 60 * 60 * 1000);

    const startFormatted = formatICSDate(taskDate);
    const endFormatted = formatICSDate(endDate);

    const escapeText = (str: string) => str.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:cyber-task-${task.id}@cybermission1k.app`);
    lines.push(`DTSTAMP:${nowUTC}`);
    lines.push(`DTSTART:${startFormatted}`);
    lines.push(`DTEND:${endFormatted}`);
    lines.push(`SUMMARY:[CyberSprint] ${escapeText(task.title)}`);
    lines.push(`DESCRIPTION:Mission: $1,000 Cybersecurity Submission\\nCategory: ${task.category.toUpperCase()}\\nPriority: ${task.priority.toUpperCase()}\\n\\nDetails:\\n${escapeText(task.description)}\\n\\nCyber Pro Tip:\\n${escapeText(task.cyberTip)}`);
    lines.push(`PRIORITY:${task.priority === 'critical' ? 1 : task.priority === 'high' ? 3 : 5}`);
    lines.push('STATUS:CONFIRMED');

    // Add reminder alarms (15 min and 1 hour before)
    lines.push('BEGIN:VALARM');
    lines.push('TRIGGER:-PT15M');
    lines.push('ACTION:DISPLAY');
    lines.push(`DESCRIPTION:Reminder: ${escapeText(task.title)} is starting soon! Stay on track for the $1,000 mission.`);
    lines.push('END:VALARM');

    lines.push('BEGIN:VALARM');
    lines.push('TRIGGER:-PT1H');
    lines.push('ACTION:DISPLAY');
    lines.push(`DESCRIPTION:Upcoming: ${escapeText(task.title)} (Cybersecurity Sprint)`);
    lines.push('END:VALARM');

    lines.push('END:VEVENT');
  });

  // Add the final submission deadline event specifically: Nov 23 at 11:59 PM PT
  const finalDeadline = new Date('2026-11-23T23:59:00-08:00');
  const finalStart = new Date(finalDeadline.getTime() - 2 * 60 * 60 * 1000); // 2 hour window
  lines.push('BEGIN:VEVENT');
  lines.push(`UID:final-deadline-${Date.now()}@cybermission1k.app`);
  lines.push(`DTSTAMP:${nowUTC}`);
  lines.push(`DTSTART:${formatICSDate(finalStart)}`);
  lines.push(`DTEND:${formatICSDate(finalDeadline)}`);
  lines.push('SUMMARY:🔥 FINAL DEADLINE: Submit Cybersecurity Project for $1,000 Prize!');
  lines.push('DESCRIPTION:HARD DEADLINE: Submit by Nov 23, 11:59 p.m. PT. Verify portfolio link, project repo, video walkthrough, and quiz completion certificates.');
  lines.push('PRIORITY:1');
  lines.push('STATUS:CONFIRMED');
  lines.push('BEGIN:VALARM');
  lines.push('TRIGGER:-PT2H');
  lines.push('ACTION:DISPLAY');
  lines.push('DESCRIPTION:FINAL 2 HOURS: Complete project submission for $1,000 prize!');
  lines.push('END:VALARM');
  lines.push('END:VEVENT');

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export function downloadCalendarICS(tasks: PlanTask[]) {
  const content = generateICSContent(tasks);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'Cybersecurity_Mission_1000_Schedule.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
