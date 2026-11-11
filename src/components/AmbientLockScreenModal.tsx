import React, { useState, useEffect } from 'react';
import { X, Maximize, Minimize, Volume2, VolumeX, Shield, Sparkles } from 'lucide-react';
import { getTimeRemaining, TimeLeft, MOTIVATIONAL_CYBER_QUOTES } from '../utils/timeUtils';
import { playTickSound, isAudioEnabled, setAudioEnabled } from '../utils/audioUtils';

interface AmbientLockScreenModalProps {
  onClose: () => void;
  completedTasksCount: number;
  totalTasksCount: number;
}

export const AmbientLockScreenModal: React.FC<AmbientLockScreenModalProps> = ({
  onClose,
  completedTasksCount,
  totalTasksCount,
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeRemaining());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioTick, setAudioTick] = useState(false);
  const [theme, setTheme] = useState<'matrix' | 'sentinel' | 'crimson' | 'gold'>('matrix');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining());
      if (audioTick) {
        playTickSound();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [audioTick]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const themeClasses = {
    matrix: {
      bg: 'bg-black text-emerald-400',
      border: 'border-emerald-500/30',
      glow: 'shadow-[0_0_60px_rgba(16,185,129,0.25)]',
      accent: 'text-emerald-300',
      sub: 'text-emerald-500/80',
    },
    sentinel: {
      bg: 'bg-[#030712] text-cyan-400',
      border: 'border-cyan-500/30',
      glow: 'shadow-[0_0_60px_rgba(6,182,212,0.25)]',
      accent: 'text-cyan-300',
      sub: 'text-cyan-500/80',
    },
    crimson: {
      bg: 'bg-[#0a0204] text-rose-500',
      border: 'border-rose-500/30',
      glow: 'shadow-[0_0_60px_rgba(244,63,94,0.25)]',
      accent: 'text-rose-300',
      sub: 'text-rose-500/80',
    },
    gold: {
      bg: 'bg-[#0a0702] text-amber-400',
      border: 'border-amber-500/30',
      glow: 'shadow-[0_0_60px_rgba(245,158,11,0.25)]',
      accent: 'text-amber-300',
      sub: 'text-amber-500/80',
    },
  };

  const curr = themeClasses[theme];
  const progressPct = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 10;

  return (
    <div className={`fixed inset-0 z-50 flex flex-col justify-between p-6 sm:p-12 select-none overflow-hidden ${curr.bg}`}>
      {/* Background Cyber Scanline Texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))',
          backgroundSize: '100% 4px, 6px 100%',
        }}
      />

      {/* Top Controls */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 animate-pulse" />
          <div>
            <div className="font-mono text-xs font-bold tracking-widest uppercase">
              $1,000 CYBERSECURITY MISSION COUNTDOWN
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              TARGET: NOV 23, 2026 • 11:59:00 PM PT
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Switcher */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
            {(['matrix', 'sentinel', 'crimson', 'gold'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`w-4 h-4 rounded-full transition-all ${
                  t === 'matrix' ? 'bg-emerald-500' : t === 'sentinel' ? 'bg-cyan-400' : t === 'crimson' ? 'bg-rose-500' : 'bg-amber-400'
                } ${theme === t ? 'ring-2 ring-white scale-110' : 'opacity-60'}`}
              />
            ))}
          </div>

          <button
            onClick={() => setAudioTick(!audioTick)}
            className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white"
            title="Audio Ticking Sound"
          >
            {audioTick ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white"
            title="Exit (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Massive Countdown Display */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto">
        <div className="text-center mb-6 sm:mb-10">
          <div className="inline-block px-4 py-1 rounded-full border border-current text-xs font-mono font-bold tracking-widest uppercase mb-3 bg-black/40">
            ⚡ MISSION ACTIVE • TIME CRITICAL ⚡
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-['Space_Grotesk']">
            DEADLINE APPROACHING
          </h2>
          <p className="text-xs sm:text-base font-mono text-slate-400 mt-2">
            Daily Quizzes • Weekly Assignments • Final Main Test • Portfolio
          </p>
        </div>

        {/* 4 Digit Boxes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-4xl">
          <div className={`flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-black/60 border ${curr.border} ${curr.glow}`}>
            <span className="font-mono text-5xl sm:text-7xl md:text-8xl font-black tracking-tight">
              {timeLeft.formattedDays}
            </span>
            <span className="text-xs sm:text-sm font-mono tracking-widest uppercase text-slate-400 mt-2 font-bold">
              Days
            </span>
          </div>

          <div className={`flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-black/60 border ${curr.border} ${curr.glow}`}>
            <span className="font-mono text-5xl sm:text-7xl md:text-8xl font-black tracking-tight">
              {timeLeft.formattedHours}
            </span>
            <span className="text-xs sm:text-sm font-mono tracking-widest uppercase text-slate-400 mt-2 font-bold">
              Hours
            </span>
          </div>

          <div className={`flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-black/60 border ${curr.border} ${curr.glow}`}>
            <span className="font-mono text-5xl sm:text-7xl md:text-8xl font-black tracking-tight">
              {timeLeft.formattedMinutes}
            </span>
            <span className="text-xs sm:text-sm font-mono tracking-widest uppercase text-slate-400 mt-2 font-bold">
              Minutes
            </span>
          </div>

          <div className={`flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-black/60 border border-amber-500/40 shadow-[0_0_60px_rgba(245,158,11,0.25)]`}>
            <span className="font-mono text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-amber-400">
              {timeLeft.formattedSeconds}
            </span>
            <span className="text-xs sm:text-sm font-mono tracking-widest uppercase text-amber-300 mt-2 font-bold">
              Seconds
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-2xl mt-8 space-y-2">
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>MISSION READINESS</span>
            <span className="font-bold text-white">{progressPct}%</span>
          </div>
          <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Quote & Esc hint */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-mono gap-3">
        <div className="italic text-center sm:text-left text-slate-300">
          “November 23 at 11:59 p.m. PT • Complete your mission and claim the $1,000 prize.”
        </div>
        <div className="text-[11px] text-slate-500 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800">
          Press [ESC] to Exit Desk Clock
        </div>
      </div>
    </div>
  );
};
