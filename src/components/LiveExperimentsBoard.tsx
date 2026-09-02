import React, { useState } from 'react';
import { Experiment, ExperimentStatus } from '../types';
import {
  TrendingUp,
  GitBranch,
  GitCommit,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Play,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Code,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import { sounds } from '../utils/sound';
import confetti from 'canvas-confetti';

interface LiveExperimentsBoardProps {
  experiments: Experiment[];
  onSimulateTraffic: (experimentId: string, visitors: number, conversionLikelihood?: number) => void;
  onEvaluateExperiment: (experimentId: string) => void;
  onSimulateDonation: (experimentId: string, amount: number) => void;
}

export const LiveExperimentsBoard: React.FC<LiveExperimentsBoardProps> = ({
  experiments,
  onSimulateTraffic,
  onEvaluateExperiment,
  onSimulateDonation,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'live' | 'kept' | 'rolled_back'>('all');
  const [activePreviewId, setActivePreviewId] = useState<string | null>(
    experiments.find((e) => e.status === 'live')?.id || experiments[0]?.id || null
  );
  const [copiedAlias, setCopiedAlias] = useState(false);
  const [customTip, setCustomTip] = useState('15');

  const filteredExperiments = experiments.filter((exp) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'live') return exp.status === 'live' || exp.status === 'deploying' || exp.status === 'evaluating';
    return exp.status === selectedFilter;
  });

  const activeExperiment = experiments.find((e) => e.id === activePreviewId) || experiments[0];

  const handleCopyAlias = () => {
    navigator.clipboard.writeText('lkempe');
    setCopiedAlias(true);
    sounds.playBubblePop();
    setTimeout(() => setCopiedAlias(false), 2000);
  };

  const handleTestDonation = (amount: number) => {
    if (!activeExperiment) return;
    sounds.playCoin();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#F59E0B', '#10B981', '#38BDF8'],
    });
    onSimulateDonation(activeExperiment.id, amount);
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            Autonomous Revenue Experiments Engine
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Rule: Autonomous multi-agents test monetization models. If conversion &gt; target &rarr; <span className="text-emerald-400 font-semibold">KEEP</span> (merge to main). Otherwise &rarr; <span className="text-rose-400 font-semibold">ROLLBACK</span> (git revert).
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 self-start">
          {[
            { id: 'all', label: 'All Experiments' },
            { id: 'live', label: 'Live Testing' },
            { id: 'kept', label: 'Kept (Merged)' },
            { id: 'rolled_back', label: 'Rolled Back' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id as any)}
              className={`px-2.5 py-1 text-xs rounded-md transition font-medium ${
                selectedFilter === tab.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Left column list of experiments, Right column live sandbox preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Experiments List */}
        <div className="lg:col-span-6 space-y-3">
          {filteredExperiments.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-lg">
              No experiments found under this filter. Broadcast a new idea to deploy one!
            </div>
          ) : (
            filteredExperiments.map((exp) => {
              const isSelected = exp.id === activePreviewId;
              const isKept = exp.status === 'kept';
              const isRolledBack = exp.status === 'rolled_back';
              const isLive = exp.status === 'live' || exp.status === 'evaluating';

              return (
                <div
                  key={exp.id}
                  onClick={() => setActivePreviewId(exp.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-amber-500/80 shadow-lg ring-1 ring-amber-500/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono-code text-[11px] text-slate-400">
                          {exp.branch}
                        </span>
                        {isKept && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> KEPT (In Main)
                          </span>
                        )}
                        {isRolledBack && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> ROLLED BACK
                          </span>
                        )}
                        {isLive && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 animate-pulse">
                            <Clock className="w-3 h-3" /> LIVE TESTING
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-100">{exp.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                        {exp.description}
                      </p>
                    </div>
                  </div>

                  {/* Telemetry Metrics Bar */}
                  <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Traffic</span>
                      <span className="font-mono-code font-bold text-slate-200">
                        {exp.impressions}
                      </span>
                    </div>
                    <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Clicks</span>
                      <span className="font-mono-code font-bold text-slate-200">
                        {exp.clicks}
                      </span>
                    </div>
                    <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Conv. Rate</span>
                      <span
                        className={`font-mono-code font-bold ${
                          exp.currentConversionRate >= exp.targetConversionRate
                            ? 'text-emerald-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {exp.currentConversionRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Revenue</span>
                      <span className="font-mono-code font-bold text-emerald-400">
                        ${exp.revenueEarned.toFixed(0)}
                      </span>
                    </div>
                  </div>

                  {/* Actions for Live Testing */}
                  {isLive && (
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sounds.playStep();
                          onSimulateTraffic(exp.id, 50, 0.08); // High converting traffic
                        }}
                        className="flex-1 text-xs py-1.5 px-2.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center justify-center gap-1 font-medium"
                      >
                        <Play className="w-3 h-3 text-emerald-400" />
                        <span>Inject 50 Visitors</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEvaluateExperiment(exp.id);
                        }}
                        className="text-xs py-1.5 px-3 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition flex items-center justify-center gap-1 shadow"
                      >
                        <Zap className="w-3 h-3" />
                        <span>Run Decision Check</span>
                      </button>
                    </div>
                  )}

                  {exp.decisionReason && (
                    <div className="mt-2 text-[11px] p-2 rounded bg-slate-900/90 text-slate-300 border border-slate-800/80">
                      <span className="font-bold text-slate-400">Decision Telemetry: </span>
                      {exp.decisionReason}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Live Interactive Sandbox & Payment Widget */}
        <div className="lg:col-span-6 space-y-4">
          {activeExperiment ? (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-inner space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono-code text-amber-400 font-bold uppercase tracking-wider block">
                    Live Component Sandbox
                  </span>
                  <h3 className="text-sm font-bold text-slate-100">{activeExperiment.title}</h3>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Target Threshold</span>
                  <span className="text-xs font-mono-code font-bold text-emerald-400">
                    &gt;= {activeExperiment.targetConversionRate}%
                  </span>
                </div>
              </div>

              {/* Rendered Interactive Banner Preview */}
              <div className="relative overflow-hidden rounded-xl border-2 border-amber-500/50 bg-gradient-to-br from-slate-900 via-slate-850 to-amber-950/40 p-5 shadow-2xl">
                {/* 8-bit Pixel Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-pixel text-[10px] text-amber-400 px-2 py-1 rounded bg-amber-500/20 border border-amber-500/30">
                    MOON PLAZA REVENUE
                  </span>
                  <span className="text-xs font-mono-code text-slate-400">
                    Tango Otter Patron Hub
                  </span>
                </div>

                <h4 className="text-base font-extrabold text-white leading-snug">
                  {activeExperiment.bannerHeadline}
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {activeExperiment.bannerSubtext}
                </p>

                {/* Amount Selection Buttons */}
                <div className="mt-4 flex items-center gap-2 flex-wrap">
                  {activeExperiment.suggestedAmounts.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => handleTestDonation(amt)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-amber-500 hover:text-slate-950 text-slate-200 border border-slate-700 font-bold text-xs transition shadow active:scale-95"
                    >
                      ${amt} Tip
                    </button>
                  ))}
                  <button
                    onClick={() => handleTestDonation(parseFloat(customTip) || 15)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow active:scale-95 flex items-center gap-1"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    Custom Tip
                  </button>
                </div>

                {/* Real Payment Links (PayPal & MercadoPago) */}
                <div className="mt-5 pt-4 border-t border-slate-700/60 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* PayPal.me */}
                  <a
                    href="https://paypal.me/lk3mpe"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => {
                      sounds.playCoin();
                      onSimulateDonation(activeExperiment.id, 15);
                    }}
                    className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-[#0079C1] hover:bg-[#00457C] text-white font-bold text-xs shadow-lg transition"
                  >
                    <span>Donate with PayPal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {/* MercadoPago */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#009EE3]/15 border border-[#009EE3]/40 text-xs">
                    <div>
                      <span className="text-[10px] text-sky-400 block font-semibold">MercadoPago Alias</span>
                      <span className="font-mono-code font-bold text-white">lkempe</span>
                    </div>
                    <button
                      onClick={handleCopyAlias}
                      className="p-1.5 rounded bg-sky-500/20 hover:bg-sky-500/40 text-sky-300 border border-sky-400/30 transition flex items-center gap-1 text-[11px] font-medium"
                    >
                      {copiedAlias ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedAlias ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Code Diff Preview */}
              <div className="bg-slate-900 rounded-lg p-3 border border-slate-800 text-xs font-mono-code">
                <div className="flex items-center justify-between text-slate-400 mb-1.5">
                  <span className="flex items-center gap-1">
                    <Code className="w-3.5 h-3.5 text-amber-400" />
                    Git Commit Diff
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono-code">
                    SHA: {activeExperiment.commitSha}
                  </span>
                </div>
                <pre className="text-[11px] text-emerald-400/90 whitespace-pre-wrap leading-tight bg-slate-950 p-2 rounded border border-slate-800/80">
                  {activeExperiment.codeDiffPreview}
                </pre>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 text-xs border border-slate-800 rounded-xl">
              Select an experiment to inspect live telemetry & sandbox preview.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
