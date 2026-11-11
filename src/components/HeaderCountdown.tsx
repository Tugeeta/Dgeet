import React, { useEffect, useState } from 'react';
import { Shield, Trophy, Flame, Bell, Monitor, Volume2, VolumeX, Calendar, CheckCircle2, Share2, Copy, Check, ExternalLink, Link2, X, FileText } from 'lucide-react';
import { getTimeRemaining, TimeLeft, DEADLINE_ISO } from '../utils/timeUtils';
import { isAudioEnabled, setAudioEnabled, playRadarPing, playSuccessChime } from '../utils/audioUtils';

interface HeaderCountdownProps {
  completedTasksCount: number;
  totalTasksCount: number;
  onOpenAmbient: () => void;
  onSelectTab: (tab: string) => void;
  currentTab: string;
}

export const HeaderCountdown: React.FC<HeaderCountdownProps> = ({
  completedTasksCount,
  totalTasksCount,
  onOpenAmbient,
  onSelectTab,
  currentTab,
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeRemaining());
  const [audioOn, setAudioOn] = useState<boolean>(isAudioEnabled());
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // App URLs
  const sharedAppUrl = typeof window !== 'undefined' && window.location.origin.includes('run.app')
    ? window.location.origin
    : 'https://ais-pre-pmz2mlneayqxi5alb6is4i-406883776915.us-west1.run.app';
  const devAppUrl = 'https://ais-dev-pmz2mlneayqxi5alb6is4i-406883776915.us-west1.run.app';

  const copyToClipboard = (url: string, type: string) => {
    navigator.clipboard.writeText(url);
    setCopiedType(type);
    playSuccessChime();
    setTimeout(() => setCopiedType(null), 2500);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleAudio = () => {
    const nextState = !audioOn;
    setAudioOn(nextState);
    setAudioEnabled(nextState);
    if (nextState) {
      playRadarPing();
    }
  };

  const progressPercent = totalTasksCount > 0 
    ? Math.round((completedTasksCount / totalTasksCount) * 100) 
    : 0;

  return (
    <header className="border-b border-emerald-500/20 bg-slate-950/95 backdrop-blur-md sticky top-0 z-40">
      {/* Top Urgent Ribbon */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 px-4 py-1.5 text-xs border-b border-emerald-500/30 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-400 font-mono font-semibold tracking-wider uppercase">
            Cyber Mission Command
          </span>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <span className="text-amber-300 font-medium flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            Prize Pool: $1,000 USD
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-300 font-mono text-[11px]">
          <span className="text-slate-400">HARD DEADLINE:</span>
          <span className="text-rose-400 font-bold bg-rose-950/50 px-2 py-0.5 rounded border border-rose-500/30">
            Nov 23, 2026 @ 11:59 PM PT
          </span>
          <button
            onClick={toggleAudio}
            title={audioOn ? 'Mute Sound Effects' : 'Enable Sound Effects'}
            className="text-slate-400 hover:text-emerald-400 transition-colors p-1"
          >
            {audioOn ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Countdown & Stats Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Mission Identity */}
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="relative p-3 rounded-xl bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)] shrink-0">
              <Shield className="w-8 h-8 text-emerald-400 animate-pulse" />
              <div className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded-full font-mono">
                $1K
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2 font-['Space_Grotesk']">
                  CYBERSPEC MISSION 1K
                  <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40">
                    ADVANCED SPRINT
                  </span>
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Daily Quizzes • Weekly Assignments • Final Exam • Portfolio Forge
              </p>
            </div>
          </div>

          {/* Big Live Countdown Clock */}
          <div className="flex items-center gap-2 sm:gap-3 bg-slate-900/90 border border-emerald-500/30 px-3 sm:px-5 py-2.5 rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.1)]">
            <div className="flex flex-col items-center">
              <div className="font-mono text-xl sm:text-3xl font-extrabold text-emerald-400 tracking-wider">
                {timeLeft.formattedDays}
              </div>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono">Days</span>
            </div>
            <span className="font-mono text-xl sm:text-2xl text-emerald-500/50 -mt-3 animate-pulse">:</span>
            <div className="flex flex-col items-center">
              <div className="font-mono text-xl sm:text-3xl font-extrabold text-emerald-400 tracking-wider">
                {timeLeft.formattedHours}
              </div>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono">Hours</span>
            </div>
            <span className="font-mono text-xl sm:text-2xl text-emerald-500/50 -mt-3 animate-pulse">:</span>
            <div className="flex flex-col items-center">
              <div className="font-mono text-xl sm:text-3xl font-extrabold text-emerald-400 tracking-wider">
                {timeLeft.formattedMinutes}
              </div>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono">Mins</span>
            </div>
            <span className="font-mono text-xl sm:text-2xl text-emerald-500/50 -mt-3 animate-pulse">:</span>
            <div className="flex flex-col items-center">
              <div className="font-mono text-xl sm:text-3xl font-extrabold text-amber-400 tracking-wider">
                {timeLeft.formattedSeconds}
              </div>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono">Secs</span>
            </div>

            <div className="h-8 w-px bg-slate-800 mx-2 hidden sm:block" />

            <button
              onClick={onOpenAmbient}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-semibold transition-all hover:scale-105"
              title="Launch fullscreen live desk clock lock screen"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desk Clock</span>
            </button>
          </div>

          {/* Readiness Tracker */}
          <div className="w-full lg:w-48 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between lg:block">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400 flex items-center gap-1 font-mono text-[11px]">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Readiness:
              </span>
              <span className="font-mono font-bold text-emerald-400">{progressPercent}%</span>
            </div>
            <div className="w-32 lg:w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-500 mt-1 font-mono text-right hidden lg:block">
              {completedTasksCount}/{totalTasksCount} Milestones Done
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between overflow-x-auto gap-2 pb-1 scrollbar-none">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onSelectTab('plan')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                currentTab === 'plan'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Step-by-Step Plan</span>
            </button>

            <button
              onClick={() => onSelectTab('lockscreen')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                currentTab === 'lockscreen'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Lock Screen & Wallpaper</span>
              <span className="bg-amber-400 text-slate-950 text-[9px] px-1 rounded font-mono font-bold">
                HD
              </span>
            </button>

            <button
              onClick={() => onSelectTab('reminders')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                currentTab === 'reminders'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Daily Reminders & Calendar</span>
            </button>

            <button
              onClick={() => onSelectTab('portfolio')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                currentTab === 'portfolio'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Portfolio Forge</span>
            </button>

            <button
              onClick={() => onSelectTab('quiz')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                currentTab === 'quiz'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Quiz & Exam Booster</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-2.5 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Link2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Project URL</span>
            </button>
            <span className="text-[11px] font-mono text-slate-500 hidden md:inline">PT Target</span>
          </div>
        </div>
      </div>

      {/* Share / Project URL Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                  <Link2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
                    Project Live URLs
                  </h3>
                  <p className="text-xs text-slate-400">
                    Use these links to access, bookmark, or share your mission countdown on any phone, tablet, or PC.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* URL 1: Shared Public App URL */}
            <div className="space-y-2 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Shared Live App URL
                </span>
                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                  Public & Shareable
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={sharedAppUrl}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 select-all"
                />
                <button
                  onClick={() => copyToClipboard(sharedAppUrl, 'shared')}
                  className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all shrink-0"
                >
                  {copiedType === 'shared' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <a
                  href={sharedAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors shrink-0"
                  title="Open URL in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* URL 2: Development App URL */}
            <div className="space-y-2 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                  Development Runtime URL
                </span>
                <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                  Dev Environment
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={devAppUrl}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 select-all"
                />
                <button
                  onClick={() => copyToClipboard(devAppUrl, 'dev')}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-all shrink-0 border border-slate-700"
                >
                  {copiedType === 'dev' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <a
                  href={devAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors shrink-0"
                  title="Open URL in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Phone Home Screen Tip */}
            <div className="bg-emerald-950/20 border border-emerald-500/20 p-3 rounded-xl text-xs text-slate-300 space-y-1">
              <span className="font-bold text-emerald-400 block">💡 Add to Phone Home Screen:</span>
              <p className="text-slate-400 leading-relaxed">
                Open the <strong>Shared Live URL</strong> in Safari (iOS) or Chrome (Android) and tap <strong>"Add to Home Screen"</strong>. It launches as an app icon with instant fullscreen desk countdown!
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
