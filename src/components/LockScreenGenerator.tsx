import React, { useRef, useState, useEffect } from 'react';
import { 
  Download, 
  Smartphone, 
  Monitor, 
  Sparkles, 
  Share2, 
  RefreshCw, 
  Eye, 
  ShieldCheck, 
  Trophy, 
  Clock, 
  Check, 
  Sliders
} from 'lucide-react';
import { getTimeRemaining, MOTIVATIONAL_CYBER_QUOTES, DEADLINE_ISO, getSprintTimeElapsedPercent } from '../utils/timeUtils';
import { playSuccessChime } from '../utils/audioUtils';

interface LockScreenGeneratorProps {
  onOpenAmbient: () => void;
  completedTasksCount: number;
  totalTasksCount: number;
}

type AspectRatio = 'phone' | 'desktop';
type ThemeMode = 'matrix' | 'sentinel' | 'crimson' | 'gold' | 'obsidian';

export const LockScreenGenerator: React.FC<LockScreenGeneratorProps> = ({
  onOpenAmbient,
  completedTasksCount,
  totalTasksCount,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('phone');
  const [theme, setTheme] = useState<ThemeMode>('matrix');
  const [title, setTitle] = useState('CYBERSECURITY MISSION 1K');
  const [subtitle, setSubtitle] = useState('Daily Quizzes • Portfolio • Final Test');
  const [quote, setQuote] = useState(MOTIVATIONAL_CYBER_QUOTES[0]);
  const [showProgress, setShowProgress] = useState(true);
  const [showCyberGrid, setShowCyberGrid] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Time remaining updated every second
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const themeColors = {
    matrix: {
      bg: '#030a06',
      primary: '#10b981',
      secondary: '#059669',
      accent: '#34d399',
      text: '#ecfdf5',
      glow: 'rgba(16, 185, 129, 0.4)',
      boxBg: 'rgba(6, 44, 25, 0.4)',
      tagBg: '#064e3b',
    },
    sentinel: {
      bg: '#050c18',
      primary: '#06b6d4',
      secondary: '#0284c7',
      accent: '#38bdf8',
      text: '#f0f9ff',
      glow: 'rgba(6, 182, 212, 0.4)',
      boxBg: 'rgba(8, 47, 73, 0.4)',
      tagBg: '#164e63',
    },
    crimson: {
      bg: '#0f0507',
      primary: '#f43f5e',
      secondary: '#e11d48',
      accent: '#fb7185',
      text: '#fff1f2',
      glow: 'rgba(244, 63, 94, 0.4)',
      boxBg: 'rgba(76, 5, 25, 0.4)',
      tagBg: '#881337',
    },
    gold: {
      bg: '#0d0a03',
      primary: '#f59e0b',
      secondary: '#d97706',
      accent: '#fbbf24',
      text: '#fffbeb',
      glow: 'rgba(245, 158, 11, 0.4)',
      boxBg: 'rgba(69, 26, 3, 0.4)',
      tagBg: '#78350f',
    },
    obsidian: {
      bg: '#09090b',
      primary: '#e4e4e7',
      secondary: '#a1a1aa',
      accent: '#ffffff',
      text: '#fafafa',
      glow: 'rgba(255, 255, 255, 0.25)',
      boxBg: 'rgba(24, 24, 27, 0.6)',
      tagBg: '#27272a',
    },
  };

  const currentTheme = themeColors[theme];

  // Draw high resolution image to canvas
  const renderToCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions based on aspect ratio
    // High-res pixel density for super crisp wallpapers
    const width = aspectRatio === 'phone' ? 1080 : 1920;
    const height = aspectRatio === 'phone' ? 1920 : 1080;

    canvas.width = width;
    canvas.height = height;

    // 1. Background Fill
    ctx.fillStyle = currentTheme.bg;
    ctx.fillRect(0, 0, width, height);

    // 2. Subtle Cyber Grid & Radar Rings
    if (showCyberGrid) {
      ctx.strokeStyle = `${currentTheme.primary}12`;
      ctx.lineWidth = 1;
      const gridSize = aspectRatio === 'phone' ? 60 : 80;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Decorative radar circle
      ctx.strokeStyle = `${currentTheme.primary}20`;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, Math.min(width, height) * 0.42, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(width / 2, height / 2, Math.min(width, height) * 0.48, 0, Math.PI * 2);
      ctx.setLineDash([8, 12]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 3. Ambient Vignette Glow
    const radial = ctx.createRadialGradient(width / 2, height * 0.45, 80, width / 2, height * 0.45, width * 0.75);
    radial.addColorStop(0, currentTheme.glow);
    radial.addColorStop(1, 'transparent');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, width, height);

    // 4. Header Badges: $1,000 Mission Status
    const badgeY = aspectRatio === 'phone' ? 140 : 90;
    ctx.save();
    ctx.textAlign = 'center';

    // Mission status pill
    const pillText = '⚡ MISSION DEADLINE: NOV 23 • 11:59 PM PT • $1,000 PRIZE ⚡';
    ctx.font = 'bold 24px monospace';
    ctx.fillStyle = currentTheme.tagBg;
    const pillWidth = ctx.measureText(pillText).width + 60;
    const pillHeight = 44;
    
    // Draw rounded pill
    ctx.fillStyle = currentTheme.boxBg;
    ctx.strokeStyle = currentTheme.primary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect((width - pillWidth) / 2, badgeY - 26, pillWidth, pillHeight, 22);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = currentTheme.accent;
    ctx.fillText(pillText, width / 2, badgeY + 4);

    // 5. Main Title & Subtitle
    ctx.font = aspectRatio === 'phone' ? '900 52px sans-serif' : '900 64px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = currentTheme.glow;
    ctx.shadowBlur = 25;
    const titleY = aspectRatio === 'phone' ? 240 : 180;
    ctx.fillText(title, width / 2, titleY);

    ctx.font = '600 28px sans-serif';
    ctx.fillStyle = currentTheme.accent;
    ctx.shadowBlur = 0;
    ctx.fillText(subtitle, width / 2, titleY + 45);

    // 6. Giant Countdown Clock
    const clockCenterY = aspectRatio === 'phone' ? height * 0.48 : height * 0.52;
    const units = [
      { label: 'DAYS', val: timeLeft.formattedDays },
      { label: 'HOURS', val: timeLeft.formattedHours },
      { label: 'MINUTES', val: timeLeft.formattedMinutes },
      { label: 'SECONDS', val: timeLeft.formattedSeconds },
    ];

    if (aspectRatio === 'phone') {
      // 2x2 grid for phone aspect ratio
      const boxW = 400;
      const boxH = 210;
      const spacingX = 40;
      const spacingY = 30;

      const leftX = width / 2 - boxW - spacingX / 2;
      const rightX = width / 2 + spacingX / 2;
      const topY = clockCenterY - boxH - spacingY / 2;
      const botY = clockCenterY + spacingY / 2;

      const positions = [
        { x: leftX, y: topY },
        { x: rightX, y: topY },
        { x: leftX, y: botY },
        { x: rightX, y: botY },
      ];

      units.forEach((u, i) => {
        const pos = positions[i];
        // Box card
        ctx.fillStyle = currentTheme.boxBg;
        ctx.strokeStyle = `${currentTheme.primary}80`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(pos.x, pos.y, boxW, boxH, 20);
        ctx.fill();
        ctx.stroke();

        // Corner tick marks
        ctx.strokeStyle = currentTheme.accent;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y + 20);
        ctx.lineTo(pos.x, pos.y);
        ctx.lineTo(pos.x + 20, pos.y);
        ctx.stroke();

        // Digit Value
        ctx.font = 'bold 96px monospace';
        ctx.fillStyle = i === 3 ? '#f59e0b' : currentTheme.accent;
        ctx.shadowColor = currentTheme.glow;
        ctx.shadowBlur = 15;
        ctx.fillText(u.val, pos.x + boxW / 2, pos.y + 120);

        // Unit Label
        ctx.font = 'bold 22px monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.shadowBlur = 0;
        ctx.fillText(u.label, pos.x + boxW / 2, pos.y + 165);
      });
    } else {
      // 1x4 horizontal row for desktop
      const boxW = 320;
      const boxH = 220;
      const gap = 35;
      const totalRowW = 4 * boxW + 3 * gap;
      const startX = (width - totalRowW) / 2;

      units.forEach((u, i) => {
        const x = startX + i * (boxW + gap);
        const y = clockCenterY - boxH / 2;

        ctx.fillStyle = currentTheme.boxBg;
        ctx.strokeStyle = `${currentTheme.primary}80`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(x, y, boxW, boxH, 24);
        ctx.fill();
        ctx.stroke();

        // Digit
        ctx.font = 'bold 110px monospace';
        ctx.fillStyle = i === 3 ? '#f59e0b' : currentTheme.accent;
        ctx.shadowColor = currentTheme.glow;
        ctx.shadowBlur = 20;
        ctx.fillText(u.val, x + boxW / 2, y + 130);

        // Label
        ctx.font = 'bold 24px monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.shadowBlur = 0;
        ctx.fillText(u.label, x + boxW / 2, y + 180);
      });
    }

    // 7. Progress Bar
    if (showProgress) {
      const progY = aspectRatio === 'phone' ? height * 0.76 : height * 0.77;
      const progW = aspectRatio === 'phone' ? 840 : 1200;
      const progH = 24;
      const progX = (width - progW) / 2;

      const completionPct = totalTasksCount > 0 
        ? Math.round((completedTasksCount / totalTasksCount) * 100) 
        : 15;

      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(progX, progY, progW, progH, 12);
      ctx.fill();

      // Filled progress
      const fillW = Math.max(20, (progW * completionPct) / 100);
      const grad = ctx.createLinearGradient(progX, progY, progX + fillW, progY);
      grad.addColorStop(0, currentTheme.secondary);
      grad.addColorStop(1, currentTheme.accent);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(progX, progY, fillW, progH, 12);
      ctx.fill();

      // Progress text
      ctx.font = 'bold 20px monospace';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(
        `MISSION PROGRESS: ${completionPct}% COMPLETE (${completedTasksCount}/${totalTasksCount} MILESTONES)`,
        width / 2,
        progY - 18
      );
    }

    // 8. Motivational Cyber Quote
    const quoteY = aspectRatio === 'phone' ? height * 0.88 : height * 0.90;
    ctx.font = 'italic 26px sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(`“${quote}”`, width / 2, quoteY);

    // 9. Watermark footer
    ctx.font = 'bold 18px monospace';
    ctx.fillStyle = '#64748b';
    ctx.fillText(
      `TARGET: 2026-11-23 23:59:00 PT • LOCK SCREEN HUD GENERATED BY CYBERSPEC`,
      width / 2,
      height - 40
    );

    ctx.restore();
  };

  useEffect(() => {
    renderToCanvas();
  }, [aspectRatio, theme, title, subtitle, quote, showProgress, showCyberGrid, timeLeft, completedTasksCount]);

  const handleDownload = () => {
    setIsGenerating(true);
    renderToCanvas();
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) {
        setIsGenerating(false);
        return;
      }
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `CyberMission1K_${aspectRatio === 'phone' ? 'Phone_LockScreen' : 'Desktop_Wallpaper'}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsGenerating(false);
      playSuccessChime();
    }, 150);
  };

  const handleCopyShare = async () => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          // Copy image to clipboard if supported
          if (navigator.clipboard && window.ClipboardItem) {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            setCopied(true);
            playSuccessChime();
            setTimeout(() => setCopied(false), 3000);
          } else {
            // Fallback: Copy link
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
          }
        } catch {
          navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          setTimeout(() => setCopied(false), 3000);
        }
      });
    } catch {
      // Fallback
    }
  };

  const shuffleQuote = () => {
    const nextIdx = Math.floor(Math.random() * MOTIVATIONAL_CYBER_QUOTES.length);
    setQuote(MOTIVATIONAL_CYBER_QUOTES[nextIdx]);
  };

  return (
    <div className="space-y-6">
      {/* Top Description Box */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 sm:p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Smartphone className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
                Shareable Countdown Lock Screen & Wallpaper
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Set this high-impact live countdown wallpaper on your phone or computer lock screen to keep the Nov 23 deadline and the $1,000 prize front-and-center every single time you look at your screen.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenAmbient}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all hover:scale-105"
            >
              <Eye className="w-4 h-4" />
              <span>Full Screen Live Desk Clock</span>
            </button>
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-900/30 transition-all hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Rendering...' : 'Download High-Res PNG'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* 1. Device Format */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
            <label className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2 block flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              1. Choose Screen Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setAspectRatio('phone')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                  aspectRatio === 'phone'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Phone (9:16 Vertical)</span>
              </button>

              <button
                onClick={() => setAspectRatio('desktop')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                  aspectRatio === 'desktop'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span>Computer (16:9 Wide)</span>
              </button>
            </div>
          </div>

          {/* 2. Visual Theme */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
            <label className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2 block flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              2. Tactical Cyber Theme
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                onClick={() => setTheme('matrix')}
                className={`p-2.5 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all ${
                  theme === 'matrix'
                    ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300 ring-1 ring-emerald-500'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                <span>Matrix Terminal</span>
              </button>

              <button
                onClick={() => setTheme('sentinel')}
                className={`p-2.5 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all ${
                  theme === 'sentinel'
                    ? 'border-cyan-500 bg-cyan-950/60 text-cyan-300 ring-1 ring-cyan-500'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
                <span>SOC Sentinel</span>
              </button>

              <button
                onClick={() => setTheme('crimson')}
                className={`p-2.5 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all ${
                  theme === 'crimson'
                    ? 'border-rose-500 bg-rose-950/60 text-rose-300 ring-1 ring-rose-500'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
                <span>Red Team Alert</span>
              </button>

              <button
                onClick={() => setTheme('gold')}
                className={`p-2.5 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all ${
                  theme === 'gold'
                    ? 'border-amber-500 bg-amber-950/60 text-amber-300 ring-1 ring-amber-500'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                <span>$1,000 Gold</span>
              </button>

              <button
                onClick={() => setTheme('obsidian')}
                className={`p-2.5 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all col-span-2 sm:col-span-1 ${
                  theme === 'obsidian'
                    ? 'border-slate-300 bg-slate-800 text-white ring-1 ring-slate-300'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-slate-200 shadow-[0_0_8px_#ffffff]" />
                <span>Obsidian Stealth</span>
              </button>
            </div>
          </div>

          {/* 3. Text Customization */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
            <label className="text-xs font-mono uppercase text-slate-400 font-semibold block">
              3. Customize Lock Screen Text
            </label>

            <div>
              <span className="text-[11px] text-slate-400 block mb-1">Mission Header</span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block mb-1">Focus Areas Subtitle</span>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-slate-400">Motivational Cyber Quote</span>
                <button
                  onClick={shuffleQuote}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono"
                >
                  <RefreshCw className="w-3 h-3" /> Shuffle
                </button>
              </div>
              <textarea
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            {/* Toggles */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={showProgress}
                  onChange={(e) => setShowProgress(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                />
                <span>Show Progress Meter</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={showCyberGrid}
                  onChange={(e) => setShowCyberGrid(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                />
                <span>Cyber Grid Texture</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={handleDownload}
              className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
            >
              <Download className="w-4 h-4" />
              <span>Download {aspectRatio === 'phone' ? 'Phone Lock Screen' : 'Desktop Wallpaper'} (PNG)</span>
            </button>

            <button
              onClick={handleCopyShare}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-slate-400" />
                  <span>Copy Shareable Card / Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Preview Column (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live Screen Preview (Ultra HD Render)
            </span>
            <span>Target: Nov 23 @ 11:59 PM PT</span>
          </div>

          {/* Frame Container */}
          <div className="relative w-full flex justify-center items-center bg-slate-950/80 p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-2xl">
            {aspectRatio === 'phone' ? (
              // Mobile Mockup Frame
              <div className="relative w-[300px] sm:w-[340px] aspect-[9/16] rounded-[44px] p-3 bg-slate-800 border-4 border-slate-700 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col">
                {/* Speaker & camera notch */}
                <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto mb-2 z-10 shrink-0" />
                
                {/* Screen content canvas */}
                <div className="relative w-full h-full rounded-[34px] overflow-hidden bg-black flex items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Home indicator bar */}
                <div className="w-28 h-1 bg-slate-600 rounded-full mx-auto mt-2 z-10 shrink-0" />
              </div>
            ) : (
              // Desktop Monitor Mockup Frame
              <div className="w-full max-w-[580px] flex flex-col items-center">
                <div className="w-full aspect-[16/9] rounded-xl p-2 bg-slate-800 border-4 border-slate-700 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
                {/* Monitor Stand */}
                <div className="w-20 h-6 bg-slate-700 mt-0" />
                <div className="w-40 h-2.5 bg-slate-600 rounded-full" />
              </div>
            )}
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-slate-400 max-w-md">
              💡 <strong>Pro Tip:</strong> On iOS, download and set as Lock Screen with "Depth Effect" off. On Android/Windows/Mac, right click or save image and select "Set as Desktop Background / Lock Screen".
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
