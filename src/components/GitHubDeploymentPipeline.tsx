import React, { useState } from 'react';
import { GitCommit, GitBranch, Terminal, CheckCircle2, ExternalLink, RefreshCw, AlertCircle, Copy, Check } from 'lucide-react';
import { GitCommit as GitCommitType } from '../types';
import { sounds } from '../utils/sound';

interface GitHubDeploymentPipelineProps {
  commits: GitCommitType[];
  repoUrl: string;
  isDeploying: boolean;
}

export const GitHubDeploymentPipeline: React.FC<GitHubDeploymentPipelineProps> = ({
  commits,
  repoUrl,
  isDeploying,
}) => {
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [copiedSha, setCopiedSha] = useState<string | null>(null);

  const branches = Array.from(new Set(commits.map((c) => c.branch)));

  const filteredCommits = commits.filter((c) => {
    if (selectedBranch === 'all') return true;
    return c.branch === selectedBranch;
  });

  const handleCopySha = (sha: string) => {
    navigator.clipboard.writeText(sha);
    setCopiedSha(sha);
    sounds.playBubblePop();
    setTimeout(() => setCopiedSha(null), 2000);
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-sky-500/20 text-sky-400 rounded-lg border border-sky-500/30">
            <GitBranch className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              GitHub Automated Deployment Pipeline
              <a
                href={`https://github.com/${repoUrl}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-mono-code font-normal hover:underline"
              >
                <span>{repoUrl}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </h3>
            <p className="text-xs text-slate-400">
              Autonomous AI engineers push code, create branches, deploy previews, and manage merges/reverts automatically.
            </p>
          </div>
        </div>

        {/* Branch Filter */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-500 font-mono-code px-1.5">Branch:</span>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="bg-slate-900 text-slate-200 text-xs rounded px-2 py-1 outline-none border border-slate-700 font-mono-code"
          >
            <option value="all">All Branches</option>
            {branches.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Live CI/CD Runner Console */}
      <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 font-mono-code text-xs">
        <div className="flex items-center justify-between text-slate-400 mb-2 border-b border-slate-800/80 pb-1.5">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-bold text-slate-300">CI/CD Runner Telemetry</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] text-emerald-400 font-semibold">PIPELINE ACTIVE</span>
          </div>
        </div>

        <div className="space-y-1 text-[11px] text-slate-300">
          <div className="text-slate-500">
            [workflow] LuuOW/moon-plaza-tango-otter &bull; Automated Deployment Engine v2.4
          </div>
          <div className="text-emerald-400">
            &gt; git remote check: connected to https://github.com/LuuOW/moon-plaza-tango-otter.git
          </div>
          <div className="text-sky-400">
            &gt; monetization hooks: paypal.me/lk3mpe &bull; mercadopago/lkempe verified
          </div>
          {isDeploying ? (
            <div className="text-amber-300 animate-pulse font-bold">
              &gt; [BUILD] Compiling experiment branch &bull; Running lint &amp; telemetry checks...
            </div>
          ) : (
            <div className="text-slate-400">
              &gt; Ready for next founder directive &bull; Autonomous decision matrix armed.
            </div>
          )}
        </div>
      </div>

      {/* Commits List Tree */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold text-slate-300 font-mono-code">Recent Automated Commits</h4>
        <div className="space-y-2">
          {filteredCommits.map((commit) => {
            const isMerge = commit.type === 'merge_kept';
            const isRollback = commit.type === 'revert_rollback';

            return (
              <div
                key={commit.sha}
                className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-1.5 rounded-md mt-0.5 ${
                      isMerge
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : isRollback
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                    }`}
                  >
                    <GitCommit className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-100">{commit.message}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 font-mono-code">
                      <span>{commit.author}</span>
                      <span>&bull;</span>
                      <span className="text-amber-400">{commit.branch}</span>
                      <span>&bull;</span>
                      <span className="text-slate-500">{commit.diffSummary}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleCopySha(commit.sha)}
                    className="flex items-center gap-1 font-mono-code text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-700 transition"
                  >
                    {copiedSha === commit.sha ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-slate-400" />
                    )}
                    <span>{commit.sha}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
