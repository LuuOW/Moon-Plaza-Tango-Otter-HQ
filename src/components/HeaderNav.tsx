import React from 'react';
import { CompanyStats } from '../types';
import {
  Sparkles,
  GitBranch,
  BookOpen,
  DollarSign,
  Volume2,
  VolumeX,
  ExternalLink,
  Coins,
  TrendingUp,
  Activity,
  Zap,
} from 'lucide-react';
import { sounds } from '../utils/sound';

interface HeaderNavProps {
  stats: CompanyStats;
  onOpenArticles: () => void;
  onOpenDonation: () => void;
  onOpenJournalTab: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isAutonomousLive: boolean;
  onToggleAutonomous: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  stats,
  onOpenArticles,
  onOpenDonation,
  onOpenJournalTab,
  soundEnabled,
  onToggleSound,
  isAutonomousLive,
  onToggleAutonomous,
}) => {
  return (
    <header className="w-full bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-40 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Brand Identity & Active Badges */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center text-slate-950 font-pixel text-xs shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/40">
            🦦
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-1.5 font-mono-code">
                Moon Plaza: Tango Otter HQ
              </h1>
              <span className="font-pixel text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                HABBO ISOMETRIC
              </span>
              <span
                onClick={onToggleAutonomous}
                className={`cursor-pointer text-[10px] font-mono-code px-2 py-0.5 rounded-full flex items-center gap-1 transition ${
                  isAutonomousLive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
                title="Click to toggle continuous agent banter and telemetry"
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isAutonomousLive ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'
                  }`}
                />
                {isAutonomousLive ? '⚡ SIMULATION LIVE' : '⏸ SIMULATION PAUSED'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5 flex-wrap">
              <a
                href="https://ask-meridian.uk"
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-0.5 font-medium"
              >
                ask-meridian.uk
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <span>&bull;</span>
              <a
                href={`https://github.com/${stats.githubRepo}`}
                target="_blank"
                rel="noreferrer"
                className="text-sky-400 hover:text-sky-300 hover:underline flex items-center gap-0.5 font-mono-code"
              >
                {stats.githubRepo}
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <span>&bull;</span>
              <a
                href={`https://github.com/${stats.journalRepo}`}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-0.5 font-mono-code"
              >
                {stats.journalRepo}
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </p>
          </div>
        </div>

        {/* Right: Live Telemetry Metrics & Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Revenue Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs shadow-sm">
            <Coins className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] text-emerald-400/80 uppercase font-mono-code font-bold">
              Treasury:
            </span>
            <span className="font-mono-code font-bold text-emerald-300 text-sm">
              ${stats.totalRevenue.toFixed(0)}
            </span>
          </div>

          {/* Research Journal Button */}
          <button
            onClick={onOpenJournalTab}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/70 hover:bg-indigo-900/80 text-indigo-300 hover:text-indigo-100 border border-indigo-500/40 text-xs font-mono-code font-bold transition shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>Meridian Journal</span>
          </button>

          {/* Donate / Tip Lucas Modal */}
          <button
            onClick={onOpenDonation}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition active:scale-95 font-mono-code"
          >
            <DollarSign className="w-3.5 h-3.5 text-slate-950" />
            <span>Tip (lk3mpe / lkempe)</span>
          </button>

          {/* Sound Synthesizer Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition"
            title={soundEnabled ? 'Mute 8-bit Audio' : 'Enable 8-bit Audio'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-400" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

